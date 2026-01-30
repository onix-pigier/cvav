//app/api/auth/change-password/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import Utilisateur from "@/models/utilisateur";
import LogAction from "@/models/action";

export async function POST(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    // Changement de mot de passe demandé
    if (!currentUser) {
      console.log('❌ DEBUG: Utilisateur non authentifié');
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    const body = await request.json();
    const { motDePasseActuel, nouveauMotDePasse, isForcedChange } = body;

    if (!motDePasseActuel || !nouveauMotDePasse) {
      console.log('❌ DEBUG: Champs manquants');
      return NextResponse.json({ 
        message: "Mot de passe actuel et nouveau mot de passe requis." 
      }, { status: 400 });
    }

    // Vérifier la force du nouveau mot de passe
    if (nouveauMotDePasse.length < 6) {
      console.log('❌ DEBUG: Mot de passe trop court');
      return NextResponse.json({ 
        message: "Le mot de passe doit contenir au moins 6 caractères." 
      }, { status: 400 });
    }

    // Charger l'utilisateur avec le mot de passe
    const utilisateur = await Utilisateur.findById(currentUser._id)
      .select("+motDePasse +doitChangerMotDePasse");

    if (!utilisateur) {
      console.log('❌ DEBUG: Utilisateur non trouvé en base');
      return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
    }

    // 🔄 LOGIQUE ADAPTÉE POUR LES DEUX MODES
    // Vérifications et comparaisons sans log sensible
    
    if (isForcedChange) {
      // 🎯 MODE FORCÉ : Vérification du mot de passe temporaire
      const motDePasseTemporaireCorrect = await utilisateur.compareMotDePasse(motDePasseActuel);
      if (!motDePasseTemporaireCorrect) {
        return NextResponse.json({ message: "Mot de passe temporaire incorrect." }, { status: 400 });
      }
    } else {
      const motDePasseActuelCorrect = await utilisateur.compareMotDePasse(motDePasseActuel);
      if (!motDePasseActuelCorrect) {
        return NextResponse.json({ message: "Mot de passe actuel incorrect." }, { status: 400 });
      }
    }

    // Empêcher la réutilisation du même mot de passe
    const memeMotDePasse = await utilisateur.compareMotDePasse(nouveauMotDePasse);
    if (memeMotDePasse) {
      return NextResponse.json({ message: "Le nouveau mot de passe doit être différent de l'actuel." }, { status: 400 });
    }

    // Mettre à jour le mot de passe
    utilisateur.motDePasse = nouveauMotDePasse;
    
    // Seulement en mode forcé, on désactive le flag
    if (isForcedChange) {
      utilisateur.doitChangerMotDePasse = false;
      utilisateur.tentativesConnexion = 0;
      utilisateur.bloqueJusquA = undefined;
    }
    
    await utilisateur.save();
    console.log('✅ DEBUG: Mot de passe mis à jour avec succès');

    // Log d'audit
    await LogAction.create({
      admin: currentUser._id,
      action: "changer_mot_de_passe",
      module: "Auth",
      donnees: { 
        userId: currentUser._id,
        changementForce: isForcedChange || false,
        mode: isForcedChange ? "forcé" : "volontaire"
      }
    });

    return NextResponse.json({ 
      message: "Mot de passe changé avec succès." 
    });

  } catch (error) {
    console.error("💥 DEBUG: Erreur changement mot de passe:", error);
    return NextResponse.json({ 
      message: "Erreur lors du changement de mot de passe." 
    }, { status: 500 });
  }
}