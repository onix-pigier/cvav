import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import Fichier from "@/models/fichier";
import action from "@/models/action";

// ──────────────────────────────────────────────
// GET → Récupérer un fichier spécifique
// ──────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "voir_fichiers")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const fichierId = params.id;
    const fichier = await Fichier.findById(fichierId)
      .populate("uploader", "prenom nom email");

    if (!fichier) {
      return NextResponse.json({ 
        message: "Fichier non trouvé." 
      }, { status: 404 });
    }

    //  VÉRIFICATION PERMISSIONS
    if (currentUser.role.nom !== "Admin" && 
        fichier.uploader._id.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ 
        message: "Accès refusé à ce fichier." 
      }, { status: 403 });
    }

    return NextResponse.json(fichier);

  } catch (error) {
    console.error("Erreur recherche fichier:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la recherche du fichier." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PUT → Modifier les métadonnées d'un fichier
// ──────────────────────────────────────────────
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "modifier_fichier")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const fichierId = params.id;
    const { nom, type } = await request.json();

    const fichier = await Fichier.findById(fichierId);
    if (!fichier) {
      return NextResponse.json({ 
        message: "Fichier non trouvé." 
      }, { status: 404 });
    }

    //  VÉRIFICATION PERMISSIONS
    if (currentUser.role.nom !== "Admin" && 
        fichier.uploader.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ 
        message: "Vous ne pouvez modifier que vos propres fichiers." 
      }, { status: 403 });
    }

    //  MISE À JOUR
    const updates: any = {};
    if (nom) updates.nom = nom;
    if (type && ["courrier", "bulletin", "autre"].includes(type)) {
      updates.type = type;
    }

    const fichierMaj = await Fichier.findByIdAndUpdate(
      fichierId,
      updates,
      { new: true, runValidators: true }
    ).populate("uploader", "prenom nom email");

    //  LOG D'AUDIT
    await action.create({
      admin: currentUser._id,
      action: "modifier_fichier",
      module: "Fichier",
      donnees: { 
        fichierId: fichierMaj._id,
        modifications: Object.keys(updates)
      }
    });

    return NextResponse.json(
      { 
        message: "Fichier modifié avec succès.",
        data: fichierMaj 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur modification fichier:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la modification du fichier." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE → Supprimer un fichier
// ──────────────────────────────────────────────
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "supprimer_fichiers")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const fichierId = params.id;
    const fichier = await Fichier.findById(fichierId);

    if (!fichier) {
      return NextResponse.json({ 
        message: "Fichier non trouvé." 
      }, { status: 404 });
    }

    //  VÉRIFICATION PERMISSIONS
    if (currentUser.role.nom !== "Admin" && 
        fichier.uploader.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ 
        message: "Vous ne pouvez supprimer que vos propres fichiers." 
      }, { status: 403 });
    }

    //  SUPPRESSION DU FICHIER (logique de suppression physique à implémenter)
    // Ici, vous intégrerez la suppression physique selon votre système de stockage
    console.log('Fichier à supprimer physiquement:', fichier.url);

    //  SUPPRESSION EN BASE
    await Fichier.findByIdAndDelete(fichierId);

    //  LOG D'AUDIT
    await action.create({
      admin: currentUser._id,
      action: "supprimer_fichiers",
      module: "Fichier",
      donnees: { 
        fichierId: fichier._id,
        nom: fichier.nom,
        type: fichier.type
      }
    });

    return NextResponse.json({ 
      message: "Fichier supprimé avec succès." 
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur suppression fichier:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la suppression du fichier." 
    }, { status: 500 });
  }
}