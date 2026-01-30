import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import Fichier from "@/models/fichier";
import { readFile } from "fs/promises";
import { getFilePath } from "@/lib/fileUtilsServer";
import path from "path";

// ──────────────────────────────────────────────
// GET → Télécharger un fichier
// ──────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: fichierId } = await params;
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "telecharger_fichiers")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    // ──────────────────────────────────────────────
    // RECHERCHE DU FICHIER EN BASE
    // ──────────────────────────────────────────────
    const fichier = await Fichier.findById(fichierId)
      .populate("uploadePar", "prenom nom email");

    if (!fichier) {
      return NextResponse.json({ 
        message: "Fichier non trouvé." 
      }, { status: 404 });
    }

    // ──────────────────────────────────────────────
    // VÉRIFICATION DES PERMISSIONS
    // ──────────────────────────────────────────────
    if (currentUser.role.nom !== "Admin" && 
        fichier.uploadePar._id.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ 
        message: "Accès refusé à ce fichier." 
      }, { status: 403 });
    }

    // ──────────────────────────────────────────────
    // RÉCUPÉRATION DU FICHIER PHYSIQUE
    // ──────────────────────────────────────────────
    const filePath = getFilePath(fichier.nomUnique);
    let fileData: Buffer;

    try {
      fileData = await readFile(filePath);
    } catch (error: any) {
      console.error("❌ Fichier physique non trouvé:", filePath);
      return NextResponse.json({ 
        message: "Fichier non trouvé sur le serveur." 
      }, { status: 404 });
    }

    // ──────────────────────────────────────────────
    // PRÉPARATION DES HEADERS
    // ──────────────────────────────────────────────
    const fileName = encodeURIComponent(fichier.nom);
    
    const headers = new Headers();
    headers.set("Content-Type", fichier.type);
    headers.set("Content-Length", fileData.length.toString());
    headers.set(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${fileName}`
    );
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    console.log("✅ Fichier téléchargé:", fichierId, fichier.nom);

    // ──────────────────────────────────────────────
    // RETOUR DU FLUX DE FICHIER
    // ──────────────────────────────────────────────
    return new NextResponse(Buffer.from(fileData), {
      status: 200,
      headers: headers
    });

  } catch (error) {
    console.error("❌ Erreur téléchargement fichier:", error);
    return NextResponse.json({ 
      message: "Erreur lors du téléchargement du fichier." 
    }, { status: 500 });
  }
}