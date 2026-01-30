// app/api/upload/route.ts - Upload de fichiers (endpoint simple pour composants)
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import Fichier from "@/models/fichier";
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
// POST → Upload simple de fichier (pour FileUpload.tsx)
// ──────────────────────────────────────────────
export const POST = async (request: Request) => {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "Aucun fichier fourni" }, { status: 400 });
    }

    // ──────────────────────────────────────────────
    // VALIDATION DU FICHIER
    // ──────────────────────────────────────────────
    if (!validateFileType(file.type)) {
      return NextResponse.json({ 
        message: "Type de fichier non supporté. PDF, JPG ou PNG uniquement." 
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
    // ENREGISTREMENT EN BASE DE DONNÉES
    // ──────────────────────────────────────────────
    const fichierDoc = await Fichier.create({
      nom: file.name,
      nomUnique: uniqueName,
      url: getFileUrl(uniqueName),
      type: file.type,
      taille: file.size,
      uploadePar: currentUser._id
    });

    console.log("✅ Fichier uploadé:", fichierDoc._id, file.name);

    return NextResponse.json({
      message: "Fichier uploadé avec succès",
      fichier: buildFileResponse(fichierDoc)
    }, { status: 201 });

  } catch (error) {
    console.error("💥 Erreur upload:", error);
    return NextResponse.json({ 
      message: "Erreur lors de l'upload du fichier" 
    }, { status: 500 });
  }
};