// //app/api/militants/route.ts - VERSION CORRIGÉE
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission, estAdmin } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import militant from '@/models/militant';
import action from '@/models/action';

// ──────────────────────────────────────────────
// UTILITAIRES ABAC CONSOLIDÉS
// ──────────────────────────────────────────────

/**
 * Retourne le filtre MongoDB basé sur le rôle et la zone de l'utilisateur.
 * - Admin: retourne {} (Accès à toutes les données).
 * - Autre: retourne { paroisse: P, secteur: S } (Accès limité à sa zone).
 */
function getFiltreABAC(utilisateur: any) {
  console.log('📍 getFiltreABAC - Utilisateur:', {
    id: utilisateur?._id,
    role: utilisateur?.role?.nom,
    paroisse: utilisateur?.paroisse,
    secteur: utilisateur?.secteur
  });

  if (estAdmin(utilisateur)) {
    console.log("✅ Admin détecté : accès complet aux militants.");
    return {};
  }

  // Pour les autres rôles, restreindre par paroisse et secteur
  const filtre = {
    paroisse: utilisateur?.paroisse,
    secteur: utilisateur?.secteur
  };

  console.log("🔒 Filtre ABAC généré :", filtre);
  return filtre;
}

// ──────────────────────────────────────────────
// POST - Création avec ABAC strict
// ──────────────────────────────────────────────
export const POST = async (request: Request) => {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    console.log('👤 POST - Utilisateur connecté:', {
      id: currentUser?._id,
      email: currentUser?.email,
      role: currentUser?.role?.nom,
      paroisse: currentUser?.paroisse,
      secteur: currentUser?.secteur
    });
    
    // ✅ CORRECTION : Vérifier la bonne permission
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    if (!voirPermission(currentUser, "creer_militant")) {
      console.log('❌ Permission refusée pour creer_militant');
      return NextResponse.json({ 
        message: "Accès refusé. Permission 'creer_militant' requise." 
      }, { status: 403 });
    }

    const body = await request.json();
    const { nom, prenom, paroisse, secteur, sexe, grade, quartier, telephone } = body;
    
    console.log('📝 Données reçues:', { nom, prenom, paroisse, secteur, sexe, grade });
    
    // Validation
    const champsRequis = { nom, prenom, paroisse, secteur, sexe, grade, quartier };
    const champsManquants = Object.entries(champsRequis)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (champsManquants.length > 0) {
      console.log('⚠️ Champs manquants:', champsManquants);
      return NextResponse.json({ 
        message: `Champs requis manquants: ${champsManquants.join(', ')}.`,
        champs: champsManquants
      }, { status: 400 });
    }

    // ABAC : L'utilisateur ne peut créer que dans sa zone (sauf admin)
    const isAdminUser = estAdmin(currentUser);
    console.log(`🔐 Vérification ABAC - Admin: ${isAdminUser}`);
    
    if (!isAdminUser) {
      console.log('🔒 Vérification zone pour utilisateur non-admin');
      if (currentUser.paroisse !== paroisse || currentUser.secteur !== secteur) {
        console.log('❌ Zone non autorisée:', {
          userParoisse: currentUser.paroisse,
          userSecteur: currentUser.secteur,
          tentativeParoisse: paroisse,
          tentativeSecteur: secteur
        });
        return NextResponse.json({ 
          message: "Vous ne pouvez créer des militants que dans votre paroisse et secteur." 
        }, { status: 403 });
      }
      console.log('✅ Zone autorisée');
    } else {
      console.log('✅ Admin - Création autorisée partout');
    }

    // Vérification d'existence
    const militantExiste = await militant.findOne({ 
      nom, 
      prenom, 
      paroisse, 
      secteur 
    });
    
    if (militantExiste) {
      console.log('⚠️ Militant déjà existant');
      return NextResponse.json({ 
        message: "Militant déjà existant avec ces informations." 
      }, { status: 400 });
    }

    // Création
    const newMilitant = await militant.create({
      creePar: currentUser._id,
      nom,
      prenom,
      paroisse,
      secteur,
      sexe,
      grade,
      quartier,
      telephone
    });

    console.log('✅ Militant créé:', newMilitant._id);

    // Journalisation
    await action.create({
      admin: currentUser._id,
      action: "creer_militant",
      module: "Militant",
      donnees: { militantId: newMilitant._id }
    });

    return NextResponse.json(newMilitant, { status: 201 });

  } catch (error) {
    console.error("❌ Erreur création militant:", error);
    if (error instanceof Error && (error as any).name === 'ValidationError') {
        return NextResponse.json({ 
            message: "Erreur de validation des données.", 
            details: (error as any).errors 
        }, { status: 400 });
    }
    return NextResponse.json({ 
      message: "Erreur serveur lors de la création.",
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Erreur inconnue') : undefined
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

    if (!currentUser) {
      console.log('❌ Aucun utilisateur connecté');
      return NextResponse.json({ 
        message: "Non authentifié." 
      }, { status: 401 });
    }

    // ✅ CORRECTION : Vérifier les bonnes permissions
    const peutVoirTout = 
      estAdmin(currentUser) || 
      voirPermission(currentUser, "voir_tout_militant");
    
    const peutVoirSiens = voirPermission(currentUser, "voir_mes_militants");

    if (!peutVoirTout && !peutVoirSiens) {
      console.log('❌ Permissions insuffisantes');
      return NextResponse.json({ 
        message: "Accès refusé. Permission 'voir_tout_militant' ou 'voir_mes_militants' requise." 
      }, { status: 403 });
    }

    console.log('✅ Permissions OK - Peut voir tout:', peutVoirTout, '- Peut voir siens:', peutVoirSiens);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const secteur = searchParams.get("secteur") || "";
    const grade = searchParams.get("grade") || "";
    const skip = (page - 1) * limit;

    console.log('📋 Paramètres:', { page, limit, search, secteur, grade });

    // ✅ FILTRE ABAC SELON LES PERMISSIONS
    let filtreABAC = {};
    
    if (peutVoirTout) {
      // Admin ou permission globale : voir TOUT
      filtreABAC = {};
      console.log('✅ Accès global - Pas de filtre ABAC');
    } else if (peutVoirSiens) {
      // User normal : voir seulement sa zone
      filtreABAC = getFiltreABAC(currentUser);
      console.log('🔒 Accès restreint - Filtre ABAC appliqué:', filtreABAC);
    }

    let filtre: any = { ...filtreABAC };

    // Filtres optionnels
    if (secteur) {
      filtre.secteur = secteur;
    }

    if (grade) {
      filtre.grade = grade;
    }

    // Recherche textuelle
    if (search) {
      filtre.$or = [
        { nom: { $regex: search, $options: "i" } },
        { prenom: { $regex: search, $options: "i" } },
        { quartier: { $regex: search, $options: "i" } },
        { paroisse: { $regex: search, $options: "i" } },
        { secteur: { $regex: search, $options: "i" } },
      ];
    }

    console.log('🔍 Filtre final:', JSON.stringify(filtre, null, 2));

    // Exécution des requêtes
    const [militants, total] = await Promise.all([
      militant.find(filtre)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      militant.countDocuments(filtre)
    ]);

    console.log('📊 Résultats:', {
      militantsTrouves: militants.length,
      total: total
    });

    // Statistiques
    let stats = { total: 0, parSecteur: {}, parGrade: {} };
    try {
      const [parSecteur, parGrade] = await Promise.all([
        militant.aggregate([
          { $match: filtreABAC },
          { $group: { _id: "$secteur", count: { $sum: 1 } } }
        ]),
        militant.aggregate([
          { $match: filtreABAC },
          { $group: { _id: "$grade", count: { $sum: 1 } } }
        ])
      ]);

      stats = {
        total: total,
        parSecteur: Object.fromEntries(parSecteur.map(s => [s._id, s.count])),
        parGrade: Object.fromEntries(parGrade.map(g => [g._id, g.count])),
      };

      console.log('📈 Statistiques:', stats);
    } catch (statsError) {
      console.warn('⚠️ Erreur stats:', statsError);
    }

    const response = NextResponse.json({ 
      data: militants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;

  } catch (error) {
    console.error("❌ Erreur recherche militants:", error);
    
    if (error instanceof Error) {
      console.error('❌ Détails:', {
        message: error.message,
        stack: error.stack
      });
    }

    return NextResponse.json({ 
      message: "Erreur serveur lors de la recherche.",
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Erreur inconnue' : undefined
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE - Suppression avec ABAC
// ──────────────────────────────────────────────
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    // ✅ CORRECTION : Vérifier les bonnes permissions
    const peutSupprimerTout = 
      estAdmin(currentUser) || 
      voirPermission(currentUser, "supprimer_tout_militant");
    
    const peutSupprimerSiens = voirPermission(currentUser, "supprimer_mes_militants");

    if (!peutSupprimerTout && !peutSupprimerSiens) {
      return NextResponse.json({ 
        message: "Accès refusé. Permission manquante." 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ 
        message: "ID invalide." 
      }, { status: 400 });
    }

    // Filtre ABAC
    let filtreAcces = {};
    
    if (peutSupprimerTout) {
      filtreAcces = {};  // Peut supprimer n'importe lequel
    } else if (peutSupprimerSiens) {
      filtreAcces = getFiltreABAC(currentUser);  // Seulement sa zone
    }

    const militantToDelete = await militant.findOneAndDelete({ 
        _id: id, 
        ...filtreAcces 
    });

    if (!militantToDelete) {
      return NextResponse.json({ 
          message: "Militant non trouvé ou accès refusé." 
      }, { status: 404 });
    }

    // Journalisation
    await action.create({
      admin: currentUser._id,
      action: "supprimer_militant",
      module: "Militant",
      donnees: { militantId: militantToDelete._id }
    });

    console.log('✅ Militant supprimé:', militantToDelete._id);
    return NextResponse.json({ message: "Militant supprimé." });

  } catch (error) {
    console.error("❌ Erreur suppression militant:", error);
    return NextResponse.json({ 
      message: "Erreur serveur lors de la suppression." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PUT - Modification avec ABAC
// ──────────────────────────────────────────────
export async function PUT(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    // ✅ CORRECTION : Vérifier les bonnes permissions
    const peutModifierTout = 
      estAdmin(currentUser) || 
      voirPermission(currentUser, "modifier_tout_militant");
    
    const peutModifierSiens = voirPermission(currentUser, "modifier_mes_militants");

    if (!peutModifierTout && !peutModifierSiens) {
      return NextResponse.json({ 
        message: "Accès refusé. Permission manquante." 
      }, { status: 403 });
    }

    const body = await request.json();
    const { id, nom, prenom, paroisse, secteur, sexe, grade, quartier, telephone } = body;
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ 
        message: "ID invalide." 
      }, { status: 400 });
    }

    // Filtre ABAC
    let filtreAcces = {};
    
    if (peutModifierTout) {
      filtreAcces = {};
    } else if (peutModifierSiens) {
      filtreAcces = getFiltreABAC(currentUser);
    }

    const militantToUpdate = await militant.findOne({ _id: id, ...filtreAcces });
    
    if (!militantToUpdate) {
      return NextResponse.json({ 
        message: "Militant non trouvé ou accès refusé." 
      }, { status: 404 });
    }

    // ABAC pour déplacement
    const nouvelleParoisse = paroisse || militantToUpdate.paroisse;
    const nouveauSecteur = secteur || militantToUpdate.secteur;

    const estDeplacement = (paroisse && paroisse !== militantToUpdate.paroisse) || 
                           (secteur && secteur !== militantToUpdate.secteur);

    if (estDeplacement && !peutModifierTout) {
        // User non-admin ne peut déplacer que vers sa zone
        if (nouvelleParoisse !== currentUser.paroisse || nouveauSecteur !== currentUser.secteur) {
            return NextResponse.json({ 
              message: "Vous ne pouvez déplacer un militant que dans votre zone." 
            }, { status: 403 });
        }
    }

    // Mise à jour
    const updatedMilitant = await militant.findByIdAndUpdate(
      id, 
      { 
        nom, 
        prenom, 
        paroisse: nouvelleParoisse, 
        secteur: nouveauSecteur, 
        sexe, 
        grade, 
        quartier,
        telephone 
      }, 
      { new: true, runValidators: true }
    );
    
    // Journalisation
    await action.create({
      admin: currentUser._id,
      action: "modifier_militant",
      module: "Militant",
      donnees: { militantId: updatedMilitant._id }
    });

    console.log('✅ Militant modifié:', updatedMilitant._id);
    return NextResponse.json({ 
      message: "Militant modifié.", 
      data: updatedMilitant 
    });

  } catch (error) {
    console.error("❌ Erreur modification militant:", error);
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
// PATCH - Lecture unitaire avec ABAC
// ──────────────────────────────────────────────
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    // ✅ CORRECTION : Vérifier les bonnes permissions
    const peutVoirTout = 
      estAdmin(currentUser) || 
      voirPermission(currentUser, "voir_tout_militant");
    
    const peutVoirSiens = voirPermission(currentUser, "voir_mes_militants");

    if (!peutVoirTout && !peutVoirSiens) {
      return NextResponse.json({ 
        message: "Accès refusé. Permission manquante." 
      }, { status: 403 });
    }

    const { id } = await request.json();
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ 
        message: "ID invalide." 
      }, { status: 400 });
    }

    // Filtre ABAC
    let filtreAcces = {};
    
    if (peutVoirTout) {
      filtreAcces = {};
    } else if (peutVoirSiens) {
      filtreAcces = getFiltreABAC(currentUser);
    }

    const militantToGet = await militant.findOne({ 
        _id: id, 
        ...filtreAcces 
    });

    if (!militantToGet) {
      return NextResponse.json({ 
          message: "Militant non trouvé ou accès refusé." 
      }, { status: 404 });
    }

    return NextResponse.json(militantToGet);

  } catch (error) {
    console.error("❌ Erreur recherche militant:", error);
    return NextResponse.json({ 
      message: "Erreur serveur lors de la lecture." 
    }, { status: 500 });
  }
}