// app/api/users/[id]/reset-password/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import { estAdmin } from "@/utils/permission";
import Utilisateur from "@/models/utilisateur";
import LogAction from "@/models/action";
import { randomBytes } from "crypto";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    console.log('🔑 Début réinitialisation mot de passe');
    
    if (!currentUser || !estAdmin(currentUser)) {
      console.log(' Accès refusé - Non admin');
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const params = await context.params;
    const userId = params.id;

    const user = await Utilisateur.findById(userId);
    if (!user) {
      console.log(' Utilisateur non trouvé');
      return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
    }

    console.log(' Réinitialisation pour:', user.email);

    // Générer nouveau mot de passe temporaire (16 caractères)
    const nouveauMotDePasse = randomBytes(8).toString('hex');
    user.motDePasse = nouveauMotDePasse;
    user.doitChangerMotDePasse = true;
    await user.save();

    console.log(' Mot de passe modifié en base');

    // Envoyer email
    try {
      await sendEmail({
        to: user.email,
        ...emailTemplates.passwordReset({
          prenom: user.prenom,
          motDePasseTemporaire: nouveauMotDePasse
        })
      });
      console.log(' Email envoyé');
    } catch (emailError) {
      console.warn(' Erreur envoi email:', emailError);
      // On continue même si l'email échoue
    }

    // Log d'audit
    await LogAction.create({
      admin: currentUser._id,
      action: "reinitialiser_mot_de_passe",
      module: "Utilisateur",
      donnees: { 
        userId: user._id, 
        email: user.email,
        parAdmin: currentUser.email
      }
    });

    console.log('📝 Log audit créé');
    console.log('🎉 Réinitialisation terminée');

    return NextResponse.json({ 
      message: "Mot de passe réinitialisé. Un email a été envoyé à l'utilisateur." 
    });

  } catch (error) {
    console.error("💥 Erreur réinitialisation:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la réinitialisation." 
    }, { status: 500 });
  }
}