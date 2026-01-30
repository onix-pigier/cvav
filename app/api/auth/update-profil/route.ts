// app/api/auth/update-profile/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import Utilisateur from "@/models/utilisateur";
import LogAction from "@/models/action";

export async function PUT(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    console.log('📝 DEBUG UPDATE PROFILE - Début');
    console.log('👤 - User authentifié:', currentUser?.email);
    
    if (!currentUser) {
      console.log('❌ DEBUG: Utilisateur non authentifié');
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    const body = await request.json();
    const { nom, prenom } = body;

    console.log('📥 DEBUG: Données reçues:', { nom, prenom });

    // Validation
    if (!nom || !prenom) {
      console.log('❌ DEBUG: Champs manquants');
      return NextResponse.json({ 
        message: "Nom et prénom requis." 
      }, { status: 400 });
    }

    if (nom.trim().length < 2 || prenom.trim().length < 2) {
      console.log('❌ DEBUG: Champs trop courts');
      return NextResponse.json({ 
        message: "Le nom et le prénom doivent contenir au moins 2 caractères." 
      }, { status: 400 });
    }

    // Mettre à jour l'utilisateur
    const utilisateur = await Utilisateur.findByIdAndUpdate(
      currentUser._id,
      {
        nom: nom.trim(),
        prenom: prenom.trim(),
      },
      { 
        new: true,
        runValidators: true 
      }
    )
    .populate("role", "nom permissions")
    .select("-motDePasse");

    if (!utilisateur) {
      console.log('❌ DEBUG: Utilisateur non trouvé');
      return NextResponse.json({ 
        message: "Utilisateur non trouvé." 
      }, { status: 404 });
    }

    console.log('✅ DEBUG: Profil mis à jour avec succès');

    // Log d'audit
    await LogAction.create({
      admin: currentUser._id,
      action: "modifier_profil",
      module: "Auth",
      donnees: { 
        userId: currentUser._id,
        modifications: { nom, prenom }
      }
    });

    console.log('📝 DEBUG: Log d\'audit créé');

    return NextResponse.json({ 
      message: "Profil mis à jour avec succès.",
      utilisateur: utilisateur.toJSON()
    });

  } catch (error) {
    console.error("💥 DEBUG: Erreur mise à jour profil:", error);
    
    // Gestion des erreurs de validation Mongoose
    if (error instanceof Error && (error as any).name === 'ValidationError') {
      return NextResponse.json({ 
        message: "Erreur de validation des données.", 
        details: (error as any).errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      message: "Erreur lors de la mise à jour du profil.",
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Erreur inconnue') : undefined
    }, { status: 500 });
  }
}