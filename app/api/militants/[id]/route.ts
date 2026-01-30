//app/api/militants/[id]/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import militant from '@/models/militant';
import action from '@/models/action';

// ──────────────────────────────────────────────
// UTILITAIRE ABAC
// ──────────────────────────────────────────────

/**
 * Vérifie si l'utilisateur est admin (insensible à la casse)
 */
function estAdmin(utilisateur: any): boolean {
  const roleNom = utilisateur?.role?.nom?.toLowerCase() || '';
  return roleNom === 'admin';
}

function getFiltreABAC(utilisateur: any) {
  if (estAdmin(utilisateur)) {
    return {};
  }
  return {
    paroisse: utilisateur?.paroisse,
    secteur: utilisateur?.secteur
  };
}

// ──────────────────────────────────────────────
// GET → Récupérer un militant spécifique
// ──────────────────────────────────────────────
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }  // ✅ CORRECTION: params est une Promise
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    const isAdmin = estAdmin(currentUser);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    // Vérification des permissions selon le rôle
    if (!voirPermission(currentUser, "voir_militants")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    // ✅ CORRECTION: Await params avant d'accéder à id
    const params = await context.params;
    const militantId = params.id;
    
    console.log('🔍 Recherche militant ID:', militantId);
    
    // Validation de l'ID
    if (!militantId || !militantId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: "ID de militant invalide." }, { status: 400 });
    }
    
    // Filtre ABAC adapté au rôle
    let filtre: any = { _id: militantId };
    
    if (!isAdmin) {
      filtre = { ...filtre, ...getFiltreABAC(currentUser) };
    }

    console.log('🔍 Filtre appliqué:', filtre);

    const militantTrouve = await militant.findOne(filtre);

    if (!militantTrouve) {
      console.log('❌ Militant non trouvé avec filtre:', filtre);
      return NextResponse.json({ 
        message: "Militant non trouvé ou accès refusé." 
      }, { status: 404 });
    }

    console.log('✅ Militant trouvé:', militantTrouve._id);
    return NextResponse.json(militantTrouve);

  } catch (error) {
    console.error("❌ Erreur recherche militant:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la recherche du militant.",
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Erreur inconnue') : undefined
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PUT → Modifier un militant spécifique
// ──────────────────────────────────────────────
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }  // ✅ CORRECTION: params est une Promise
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    // Vérification RBAC
    if (!currentUser || !voirPermission(currentUser, "modifier_militant")) {
      return NextResponse.json({ message: "Accès refusé. Permission manquante." }, { status: 403 });
    }

    // ✅ CORRECTION: Await params avant d'accéder à id
    const params = await context.params;
    const id = params.id;

    const body = await request.json();
    const { nom, prenom, paroisse, secteur, sexe, grade, quartier, telephone } = body;
    
    if (!id) {
      return NextResponse.json({ message: "ID manquant." }, { status: 400 });
    }
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ message: "ID de militant invalide (format attendu : ObjectId)." }, { status: 400 });
    }

    console.log('✏️ Modification militant ID:', id);

    // Récupération du militant existant
    const filtreAcces = getFiltreABAC(currentUser);
    const militantToUpdate = await militant.findOne({ _id: id, ...filtreAcces });
    
    if (!militantToUpdate) {
      console.log('❌ Militant non trouvé pour modification');
      return NextResponse.json({ 
        message: "Militant non trouvé ou accès refusé." 
      }, { status: 404 });
    }

    // VÉRIFICATION ABAC pour déplacement
    const nouvelleParoisse = paroisse || militantToUpdate.paroisse;
    const nouveauSecteur = secteur || militantToUpdate.secteur;

    const estDeplacement = (paroisse && paroisse !== militantToUpdate.paroisse) || 
                           (secteur && secteur !== militantToUpdate.secteur);

    const isAdmin = estAdmin(currentUser);

    if (estDeplacement && !isAdmin) {
        // Utilisateur non-admin : Ne peut déplacer le militant que vers SA PROPRE zone
        if (nouvelleParoisse !== currentUser.paroisse || nouveauSecteur !== currentUser.secteur) {
            return NextResponse.json({ 
              message: "Vous ne pouvez déplacer un militant que dans votre paroisse/secteur." 
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
      message: "Erreur serveur lors de la modification.",
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Erreur inconnue') : undefined
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE → Supprimer un militant spécifique
// ──────────────────────────────────────────────
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }  // ✅ CORRECTION: params est une Promise
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    // Vérification RBAC
    if (!currentUser || !voirPermission(currentUser, "supprimer_militant")) {
      return NextResponse.json({ message: "Accès refusé. Permission manquante." }, { status: 403 });
    }

    // ✅ CORRECTION: Await params avant d'accéder à id
    const params = await context.params;
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ message: "ID manquant." }, { status: 400 });
    }
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: "ID de militant invalide (format attendu : ObjectId)." }, { status: 400 });
    }

    console.log('🗑️ Suppression militant ID:', id);

    // FILTRE ABAC IMPLICITE
    const filtreAcces = getFiltreABAC(currentUser);

    const militantToDelete = await militant.findOneAndDelete({ 
        _id: id, 
        ...filtreAcces 
    });

    if (!militantToDelete) {
      console.log('❌ Militant non trouvé pour suppression');
      return NextResponse.json({ 
          message: "Militant non trouvé ou accès refusé (hors de votre zone)." 
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
    return NextResponse.json({ message: "Militant supprimé avec succès." });

  } catch (error) {
    console.error("❌ Erreur suppression militant:", error);
    return NextResponse.json({ 
      message: "Erreur serveur lors de la suppression.",
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Erreur inconnue') : undefined
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PATCH → Lecture unitaire (alternative)
// ──────────────────────────────────────────────
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    const isAdmin = estAdmin(currentUser);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    if (!voirPermission(currentUser, "voir_militants")) {
      return NextResponse.json({ message: "Accès refusé. Permission manquante." }, { status: 403 });
    }

    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ message: "ID manquant dans le corps de la requête." }, { status: 400 });
    }
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ message: "ID de militant invalide." }, { status: 400 });
    }

    // Filtre ABAC adapté au rôle
    let filtreAcces: any = { _id: id };
    
    if (!isAdmin) {
      filtreAcces = { ...filtreAcces, ...getFiltreABAC(currentUser) };
    }

    const militantToGet = await militant.findOne(filtreAcces);

    if (!militantToGet) {
      return NextResponse.json({ 
          message: "Militant non trouvé ou accès refusé." 
      }, { status: 404 });
    }

    return NextResponse.json(militantToGet);

  } catch (error) {
    console.error("❌ Erreur recherche militant:", error);
    return NextResponse.json({ 
      message: "Erreur serveur lors de la lecture unitaire.",
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Erreur inconnue') : undefined
    }, { status: 500 });
  }
}