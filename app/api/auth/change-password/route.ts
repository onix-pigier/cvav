// app/api/auth/change-password/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import Utilisateur from "@/models/utilisateur";
import action from "@/models/action";

export async function POST(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    const { ancienMotDePasse, nouveauMotDePasse } = await request.json();

    if (!ancienMotDePasse || !nouveauMotDePasse) {
      return NextResponse.json({ 
        message: "Ancien et nouveau mot de passe requis." 
      }, { status: 400 });
    }

    // 🔒 Vérifier la force du nouveau mot de passe
    if (nouveauMotDePasse.length < 8) {
      return NextResponse.json({ 
        message: "Le mot de passe doit contenir au moins 8 caractères." 
      }, { status: 400 });
    }

    // 🔒 Charger l'utilisateur avec le mot de passe
    const utilisateur = await Utilisateur.findById(currentUser._id)
      .select("+motDePasse");

    if (!utilisateur) {
      return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
    }

    // 🔒 Vérifier l'ancien mot de passe
    const ancienCorrect = await utilisateur.compareMotDePasse(ancienMotDePasse);
    if (!ancienCorrect) {
      return NextResponse.json({ 
        message: "Ancien mot de passe incorrect." 
      }, { status: 400 });
    }

    // 🔒 Empêcher la réutilisation du même mot de passe
    const memeMotDePasse = await utilisateur.compareMotDePasse(nouveauMotDePasse);
    if (memeMotDePasse) {
      return NextResponse.json({ 
        message: "Le nouveau mot de passe doit être différent de l'ancien." 
      }, { status: 400 });
    }

    // ✅ Mettre à jour le mot de passe
    utilisateur.motDePasse = nouveauMotDePasse;
    utilisateur.doitChangerMotDePasse = false;
    await utilisateur.save();

    // 📝 Log d'audit
    await action.create({
      admin: currentUser._id,
      action: "changer_mot_de_passe",
      module: "Auth",
      donnees: { 
        userId: utilisateur._id,
        changementForce: false
      }
    });

    return NextResponse.json({ 
      message: "Mot de passe changé avec succès." 
    });

  } catch (error) {
    console.error("Erreur changement mot de passe:", error);
    return NextResponse.json({ 
      message: "Erreur lors du changement de mot de passe." 
    }, { status: 500 });
  }
}