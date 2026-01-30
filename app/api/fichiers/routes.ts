import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import Fichier from "@/models/fichier";
import action from "@/models/action";
import { writeFile, mkdir } from "fs/promises";
import { 
  validateFileType,
  validateFileSize,
  generateUniqueFileName,
  getFileUrl,
  buildFileResponse
} from "@/lib/fileUtils";
import {
  getUploadDir,
  getFilePath
} from "@/lib/fileUtilsServer";

// ──────────────────────────────────────────────
// POST → Uploader un fichier
// ──────────────────────────────────────────────
export const POST = async (request: Request) => {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "uploader_fichiers")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const nom = formData.get('nom') as string;

    if (!file || !nom) {
      return NextResponse.json({ 
        message: "Fichier et nom requis." 
      }, { status: 400 });
    }

    // ──────────────────────────────────────────────
    // VALIDATION DU FICHIER
    // ──────────────────────────────────────────────
    if (!validateFileType(file.type)) {
      return NextResponse.json({ 
        message: "Type de fichier non supporté. PDF, JPG, JPEG ou PNG uniquement." 
      }, { status: 400 });
    }

    if (!validateFileSize(file.size)) {
      return NextResponse.json({ 
        message: "Fichier trop volumineux. Maximum 10MB." 
      }, { status: 400 });
    }

    // ──────────────────────────────────────────────
    // GÉNÉRATION NOM UNIQUE
    // ──────────────────────────────────────────────
    const uniqueName = generateUniqueFileName(file.name);

    // ──────────────────────────────────────────────
    // CRÉATION DOSSIER SI NÉCESSAIRE
    // ──────────────────────────────────────────────
    try {
      const uploadDir = getUploadDir();
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Dossier existe déjà
    }

    // ──────────────────────────────────────────────
    // SAUVEGARDE PHYSIQUE
    // ──────────────────────────────────────────────
    const filepath = getFilePath(uniqueName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // ──────────────────────────────────────────────
    // CRÉATION EN BASE
    // ──────────────────────────────────────────────
    const nouveauFichier = await Fichier.create({
      nom: nom,
      nomUnique: uniqueName,
      url: getFileUrl(uniqueName),
      type: file.type,
      taille: file.size,
      uploadePar: currentUser._id
    });

    console.log('✅ Fichier uploadé:', nouveauFichier._id, nom);

    // ──────────────────────────────────────────────
    // LOG D'AUDIT
    // ──────────────────────────────────────────────
    await action.create({
      admin: currentUser._id,
      action: "uploader_fichiers",
      module: "Fichier",
      donnees: { 
        fichierId: nouveauFichier._id,
        nom: nom,
        taille: file.size
      }
    });

    return NextResponse.json(
      { 
        message: "Fichier uploadé avec succès.",
        data: buildFileResponse(nouveauFichier) 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Erreur upload fichier:", error);
    return NextResponse.json({ 
      message: "Erreur lors de l'upload du fichier." 
    }, { status: 500 });
  }
};

// ──────────────────────────────────────────────
// GET → Lister les fichiers
// ──────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "voir_fichiers")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const uploader = searchParams.get('uploader');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // ──────────────────────────────────────────────
    // CONSTRUCTION FILTRES
    // ──────────────────────────────────────────────
    let filtre: any = {};

    // Filtre par uploader (admin voit tout, autres voient seulement leurs fichiers)
    if (currentUser.role.nom !== "Admin") {
      filtre.uploadePar = currentUser._id;
    } else if (uploader) {
      filtre.uploadePar = uploader;
    }

    const skip = (page - 1) * limit;

    const fichiers = await Fichier.find(filtre)
      .populate("uploadePar", "prenom nom email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Fichier.countDocuments(filtre);

    return NextResponse.json({
      fichiers: fichiers.map(f => buildFileResponse(f)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("❌ Erreur liste fichiers:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération des fichiers." 
    }, { status: 500 });
  }
}