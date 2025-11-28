import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import Fichier from "@/models/fichier";
import action from "@/models/action";

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
    const type = formData.get('type') as "courrier" | "bulletin" | "autre";
    const nom = formData.get('nom') as string;

    if (!file || !type || !nom) {
      return NextResponse.json({ 
        message: "Fichier, type et nom requis." 
      }, { status: 400 });
    }

    //  VALIDATION DU TYPE
    if (!["courrier", "bulletin", "autre"].includes(type)) {
      return NextResponse.json({ 
        message: "Type de fichier invalide." 
      }, { status: 400 });
    }

    //  VALIDATION TAILLE (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        message: "Fichier trop volumineux. Maximum 10MB." 
      }, { status: 400 });
    }

    //  CONVERSION EN BUFFER
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    //  GÉNÉRATION URL/SAUVEGARDE (à adapter selon votre système de stockage)
    // Exemple avec stockage local - à remplacer par votre service (AWS S3, etc.)
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const fileUrl = `/uploads/${fileName}`;
    
    // Ici, vous intégrerez votre service de stockage
    // Pour l'exemple, on simule l'enregistrement
    console.log('Fichier à sauvegarder:', {
      nom: file.name,
      type: file.type,
      taille: file.size,
      url: fileUrl
    });

    //  CRÉATION EN BASE
    const nouveauFichier = await Fichier.create({
      url: fileUrl,
      nom: nom,
      type: type,
      uploader: currentUser._id,
      taille: file.size
    });

    //  LOG D'AUDIT
    await action.create({
      admin: currentUser._id,
      action: "uploader_fichiers",
      module: "Fichier",
      donnees: { 
        fichierId: nouveauFichier._id,
        nom: nom,
        type: type,
        taille: file.size
      }
    });

    return NextResponse.json(
      { 
        message: "Fichier uploadé avec succès.",
        data: nouveauFichier 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Erreur upload fichier:", error);
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
    const type = searchParams.get('type');
    const uploader = searchParams.get('uploader');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    //  CONSTRUCTION FILTRES
    let filtre: any = {};
    
    // Filtre par type
    if (type && ["courrier", "bulletin", "autre"].includes(type)) {
      filtre.type = type;
    }

    // Filtre par uploader (admin voit tout, autres voient seulement leurs fichiers)
    if (currentUser.role.nom !== "Admin") {
      filtre.uploader = currentUser._id;
    } else if (uploader) {
      filtre.uploader = uploader;
    }

    const skip = (page - 1) * limit;

    const fichiers = await Fichier.find(filtre)
      .populate("uploader", "prenom nom email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Fichier.countDocuments(filtre);

    return NextResponse.json({
      fichiers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Erreur liste fichiers:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération des fichiers." 
    }, { status: 500 });
  }
}