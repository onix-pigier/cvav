import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import Fichier from "@/models/fichier";

// ──────────────────────────────────────────────
// GET → Télécharger un fichier
// ──────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "telecharger_fichiers")) {
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

    // ✅ VÉRIFICATION PERMISSIONS
    if (currentUser.role.nom !== "Admin" && 
        fichier.uploader._id.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ 
        message: "Accès refusé à ce fichier." 
      }, { status: 403 });
    }

    // ✅ LOGIQUE DE TÉLÉCHARGEMENT
    // Ici, vous intégrerez la récupération physique du fichier
    // selon votre système de stockage (AWS S3, système de fichiers, etc.)
    
    // Pour l'exemple, on retourne les infos du fichier
    // Dans un vrai système, vous streameriez le fichier
    return NextResponse.json(
      { 
        message: "Endpoint de téléchargement - à implémenter",
        data: {
          fichier: fichier,
          downloadUrl: `/api/fichiers/${fichierId}/download/file` // Exemple d'URL
        }
      }
    );

  } catch (error) {
    console.error("Erreur téléchargement fichier:", error);
    return NextResponse.json({ 
      message: "Erreur lors du téléchargement du fichier." 
    }, { status: 500 });
  }
}