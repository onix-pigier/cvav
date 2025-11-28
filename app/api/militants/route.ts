import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission"; // Assurez-vous que cette fonction vérifie les rôles
import { getUserFromToken } from "@/utils/auth";
import militant from '@/models/militant'; // Modèle Militant
import action from '@/models/action';     // Modèle Action (Journal)
import { Console } from "console";

// ──────────────────────────────────────────────
// UTILITAIRES ABAC CONSOLIDÉS
// ──────────────────────────────────────────────

/**
 * Retourne le filtre de requête MongoDB basé sur le rôle et la zone de l'utilisateur.
 * - Admin: retourne {} (Accès à toutes les données).
 * - Autre: retourne { paroisse: P, secteur: S } (Accès limité à sa zone).
 */

function getFiltreABAC(utilisateur: any) {
  console.log(' Utilisateur dans getFiltreABAC:', {
    id: utilisateur?._id,
    role: utilisateur?.role?.nom,
    paroisse: utilisateur?.paroisse,
    secteur: utilisateur?.secteur
  });

  
    if (utilisateur.role.nom === "Admin") {
    console.log("Utilisateur Admin détecté : accès complet aux militants.");
    return {};
}

// Pour les autres rôles, restreindre par paroisse et secteur
  const filtre = {
    paroisse: utilisateur?.paroisse,
    secteur: utilisateur?.secteur
  };

  console.log("Filtre ABAC généré pour l'utilisateur :", filtre);
  return filtre;
}

// ──────────────────────────────────────────────
// POST - Création avec ABAC strict
// ──────────────────────────────────────────────
export const POST = async (request: Request) => {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    // 1. Vérification RBAC de base
    if (!currentUser || !voirPermission(currentUser, "creer_militant")) {
      return NextResponse.json({ message: "Accès refusé. Permission manquante." }, { status: 403 });
    }

    const body = await request.json();
    const { nom, prenom, paroisse, secteur, sexe, grade, quartier } = body;
    
    // --- Validation de format / Champs requis ---
    const champsRequis = { nom, prenom, paroisse, secteur, sexe, grade, quartier };
    const champsManquants = Object.entries(champsRequis)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (champsManquants.length > 0) {
      return NextResponse.json({ 
        message: `Champs requis manquants: ${champsManquants.join(', ')}.`,
        champs: champsManquants
      }, { status: 400 });
    }
    // --- Fin Validation ---

    // 2. VÉRIFICATION ABAC CRITIQUE : L'utilisateur ne peut créer que dans sa zone
    // Sauf si c'est l'Admin (qui peut créer n'importe où)
    if (currentUser.role.nom !== "Admin") {
      if (currentUser.paroisse !== paroisse || currentUser.secteur !== secteur) {
        return NextResponse.json({ 
          message: "Vous ne pouvez créer des militants que dans votre paroisse et secteur." 
        }, { status: 403 });
      }
    }

    // 3. Vérification d'existence (robustesse : Nom, Prénom, Paroisse, Secteur doivent être uniques ensemble)
    const militantExiste = await militant.findOne({ 
      nom, 
      prenom, 
      paroisse, 
      secteur ,

    });
    
    if (militantExiste) {
      return NextResponse.json({ message: "Militant déjà existant (Nom, Prénom, Paroisse, Secteur non uniques)." }, { status: 400 });
    }

    // 4. Création
    const newMilitant = await militant.create({
      creePar: currentUser._id,
      ...champsRequis
    });

    // 5. Journalisation
    await action.create({
      admin: currentUser._id,
      action: "creer_militant",
      module: "Militant",
      donnees: { militantId: newMilitant._id }
    });

    return NextResponse.json(newMilitant, { status: 201 });

  } catch (error) {
    console.error("Erreur création militant:", error);
    // Gérer spécifiquement les erreurs de validation Mongoose si le modèle échoue
    if (error instanceof Error && (error as any).name === 'ValidationError') {
        return NextResponse.json({ 
            message: "Erreur de validation des données.", 
            details: (error as any).errors 
        }, { status: 400 });
    }
    return NextResponse.json({ 
      message: "Erreur serveur lors de la création." 
    }, { status: 500 });
  }
};

// ──────────────────────────────────────────────
// GET - Liste avec ABAC implicite & Pagination
// ──────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    console.log('🟢 Début GET /api/militants');
    
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    console.log('👤 Utilisateur connecté:', {
      id: currentUser?._id,
      role: currentUser?.role?.nom,
      paroisse: currentUser?.paroisse,
      secteur: currentUser?.secteur
    });

    // 1. Vérification RBAC avec debugging
    if (!currentUser) {
      console.log(' Aucun utilisateur connecté');
      return NextResponse.json({ message: "Accès refusé. Utilisateur non connecté." }, { status: 403 });
    }

    if (!voirPermission(currentUser, "voir_militants")) {
      console.log(' Permission manquante pour voir_militants');
      return NextResponse.json({ message: "Accès refusé. Permission manquante." }, { status: 403 });
    }

    console.log(' Permissions OK');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const secteur = searchParams.get("secteur") || "";
    const grade = searchParams.get("grade") || "";
    const skip = (page - 1) * limit;

    console.log('📋 Paramètres de requête:', { page, limit, search, secteur, grade });

    // 2. FILTRE ABAC IMPLICITE
    const filtreABAC = getFiltreABAC(currentUser);
    let filtre: any = { ...filtreABAC };

    console.log(' Filtre ABAC initial:', filtre);

    // 3. Ajout des filtres optionnels
    if (secteur) {
      filtre.secteur = secteur;
    }

    if (grade) {
      filtre.grade = grade;
    }

    // 4. Recherche textuelle
    if (search) {
      filtre.$or = [
        { nom: { $regex: search, $options: "i" } },
        { prenom: { $regex: search, $options: "i" } },
        { quartier: { $regex: search, $options: "i" } },
        { paroisse: { $regex: search, $options: "i" } },
        { secteur: { $regex: search, $options: "i" } },
      ];
    }

    console.log(' Filtre final appliqué:', JSON.stringify(filtre, null, 2));

    // 5. Exécution des requêtes
    const [militants, total] = await Promise.all([
      militant.find(filtre)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Utilisez lean() pour de meilleures performances
      militant.countDocuments(filtre)
    ]);

    console.log('📊 Résultats:', {
      militantsTrouves: militants.length,
      total: total,
      filtre: filtre
    });

    // 6. Statistiques (optionnel)
    try {
      const [parSecteur, parGrade] = await Promise.all([
        militant.aggregate([
          { $match: filtreABAC }, // Utiliser filtreABAC pour les stats globales
          { $group: { _id: "$secteur", count: { $sum: 1 } } }
        ]),
        militant.aggregate([
          { $match: filtreABAC },
          { $group: { _id: "$grade", count: { $sum: 1 } } }
        ])
      ]);

      const stats = {
        total: total,
        parSecteur: Object.fromEntries(parSecteur.map(s => [s._id, s.count])),
        parGrade: Object.fromEntries(parGrade.map(g => [g._id, g.count])),
      };

      console.log('📈 Statistiques calculées:', stats);
    } catch (statsError) {
      console.warn('⚠️ Erreur lors du calcul des statistiques:', statsError);
      // Continuer sans les stats
    }

    const response = NextResponse.json({ 
      data: militants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

    // Headers CORS pour le développement
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;

  } catch (error) {
    console.error(" Erreur recherche militants:", error);
    
    // Log détaillé de l'erreur
    if (error instanceof Error) {
      console.error('📌 Détails erreur:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    return NextResponse.json({ 
      message: "Erreur serveur lors de la recherche de la liste.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE - Suppression avec ABAC implicite
// ──────────────────────────────────────────────
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    // 1. Vérification RBAC
    if (!currentUser || !voirPermission(currentUser, "supprimer_militant")) {
      return NextResponse.json({ message: "Accès refusé. Permission manquante." }, { status: 403 });
    }

    // Récupération de l'ID via les paramètres de l'URL (préférable pour DELETE)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // ID maintenant lu uniquement ici
    
    if (!id) {
      return NextResponse.json({ message: "ID manquant dans les paramètres de requête (Ex: /api/militants?id=...)." }, { status: 400 });
    }
    
    // 2. Vérification de format d'ID (robustesse)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: "ID de militant invalide (format attendu : ObjectId)." }, { status: 400 });
    }

    // 3. FILTRE ABAC IMPLICITE : Supprime UNIQUEMENT si l'ID ET la zone correspondent
    const filtreAcces = getFiltreABAC(currentUser);

    const militantToDelete = await militant.findOneAndDelete({ 
        _id: id, 
        ...filtreAcces 
    });

    if (!militantToDelete) {
      // Si non trouvé, c'est que l'ID n'existe pas OU qu'il est hors de la zone de l'utilisateur
      return NextResponse.json({ 
          message: "Militant non trouvé ou accès refusé (hors de votre zone)." 
      }, { status: 404 });
    }

    // 4. Journalisation
    await action.create({
      admin: currentUser._id,
      action: "supprimer_militant",
      module: "Militant",
      donnees: { militantId: militantToDelete._id }
    });

    return NextResponse.json({ message: "Militant supprimé." });

  } catch (error) {
    console.error("Erreur suppression militant:", error);
    return NextResponse.json({ 
      message: "Erreur serveur lors de la suppression." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PUT - Modification/Déplacement avec ABAC
// ──────────────────────────────────────────────
export async function PUT(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    // 1. Vérification RBAC
    if (!currentUser || !voirPermission(currentUser, "modifier_militant")) {
      return NextResponse.json({ message: "Accès refusé. Permission manquante." }, { status: 403 });
    }

    const body = await request.json();
    const { id, nom, prenom, paroisse, secteur, sexe, grade, quartier } = body;
    
    if (!id) {
      return NextResponse.json({ message: "ID manquant dans le corps de la requête." }, { status: 400 });
    }
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ message: "ID de militant invalide (format attendu : ObjectId)." }, { status: 400 });
    }

    // 
    const filtreAcces = getFiltreABAC(currentUser);
const militantToUpdate = await militant.findOne({ _id: id, ...filtreAcces });
    
    

    // 2. VÉRIFICATION 1: Accès au militant existant (basé sur l'ancienne zone)
    if (currentUser.role.nom !== "Admin" && 
        (currentUser.paroisse !== militantToUpdate.paroisse || currentUser.secteur !== militantToUpdate.secteur)) {
      return NextResponse.json({ 
        message: "Accès refusé : Le militant n'est pas dans votre paroisse/secteur." 
      }, { status: 403 });
    }

    // 3. VÉRIFICATION 2: Logique de DÉPLACEMENT (basé sur la nouvelle zone)
    const nouvelleParoisse = paroisse || militantToUpdate.paroisse;
    const nouveauSecteur = secteur || militantToUpdate.secteur;

    const estDeplacement = (paroisse && paroisse !== militantToUpdate.paroisse) || 
                           (secteur && secteur !== militantToUpdate.secteur);

    if (estDeplacement && currentUser.role.nom !== "Admin") {
        // Utilisateur Paroisse/Secteur : Ne peut déplacer le militant que vers SA PROPRE zone
        if (nouvelleParoisse !== currentUser.paroisse || nouveauSecteur !== currentUser.secteur) {
            return NextResponse.json({ 
              message: "Vous ne pouvez déplacer un militant que dans votre paroisse/secteur." 
            }, { status: 403 });
        }
    }

    // 4. Mise à jour (update) avec filtre ABAC pour garantir qu'on modifie un militant accessible
    // On utilise findByIdAndUpdate ici car le contrôle d'accès est fait juste au-dessus.
    const updatedMilitant = await militant.findByIdAndUpdate(
      id, 
      { nom, prenom, paroisse: nouvelleParoisse, secteur: nouveauSecteur, sexe, grade, quartier }, 
      { new: true, runValidators: true }
    );
    
    // 5. Journalisation
    await action.create({
      admin: currentUser._id,
      action: "modifier_militant",
      module: "Militant",
      donnees: { militantId: updatedMilitant._id }
    });

    return NextResponse.json({ 
      message: "Militant modifié.", 
      data: updatedMilitant 
    });

  } catch (error) {
    console.error("Erreur modification militant:", error);
    // Gérer spécifiquement les erreurs de validation Mongoose
    if (error instanceof Error && (error as any).name === 'ValidationError') {
        return NextResponse.json({ 
            message: "Erreur de validation des données.", 
            details: (error as any).errors 
        }, { status: 400 });
    }
    return NextResponse.json({ 
      message: "Erreur serveur lors de la modification." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PATCH - Lecture unitaire (findById) avec ABAC implicite
// ──────────────────────────────────────────────
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    // 1. Vérification RBAC
    if (!currentUser || !voirPermission(currentUser, "voir_militants")) {
      return NextResponse.json({ message: "Accès refusé. Permission manquante." }, { status: 403 });
    }

    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ message: "ID manquant dans le corps de la requête." }, { status: 400 });
    }
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ message: "ID de militant invalide (format attendu : ObjectId)." }, { status: 400 });
    }

    // 2. FILTRE ABAC IMPLICITE : Trouve UNIQUEMENT si l'ID ET la zone correspondent
    const filtreAcces = getFiltreABAC(currentUser);

    const militantToGet = await militant.findOne({ 
        _id: id, 
        ...filtreAcces 
    });

    if (!militantToGet) {
      // Si non trouvé, c'est que l'ID n'existe pas OU qu'il est hors de la zone de l'utilisateur
      return NextResponse.json({ 
          message: "Militant non trouvé ou accès refusé (hors de votre zone)." 
      }, { status: 404 });
    }

    return NextResponse.json(militantToGet);

  } catch (error) {
    console.error("Erreur recherche militant:", error);
    return NextResponse.json({ 
      message: "Erreur serveur lors de la lecture unitaire." 
    }, { status: 500 });
  }
}