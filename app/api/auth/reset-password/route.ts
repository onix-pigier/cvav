// app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import DemandeResetMotDePasse from "@/models/resetpassword";
import Utilisateur from "@/models/utilisateur";
import Notification from "@/models/notification";
import action from "@/models/action";
import { sendEmail, emailTemplates } from "@/lib/email";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "reset_password")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const { demandeId, action: actionAdmin, raisonRejet } = await request.json();

    if (!demandeId || !actionAdmin) {
      return NextResponse.json({ 
        message: "Demande ID et action requis." 
      }, { status: 400 });
    }

    if (!["approuve", "rejete"].includes(actionAdmin)) {
      return NextResponse.json({ 
        message: "Action invalide. Doit être 'approuve' ou 'rejete'." 
      }, { status: 400 });
    }

    if (actionAdmin === "rejete" && !raisonRejet) {
      return NextResponse.json({ 
        message: "Une raison est requise pour rejeter la demande." 
      }, { status: 400 });
    }

    // 📝 Récupérer la demande
    const demande = await DemandeResetMotDePasse.findById(demandeId)
      .populate("utilisateur", "prenom nom email");

    if (!demande) {
      return NextResponse.json({ message: "Demande non trouvée." }, { status: 404 });
    }

    if (demande.statut !== "en_attente") {
      return NextResponse.json({ 
        message: "Demande déjà traitée." 
      }, { status: 400 });
    }

    if (demande.expireLe < new Date()) {
      return NextResponse.json({ 
        message: "Demande expirée." 
      }, { status: 400 });
    }

    // 🔄 Traiter la demande
    demande.statut = actionAdmin;
    demande.traitePar = currentUser._id;
    demande.dateTraitement = new Date();

    if (actionAdmin === "approuve") {
      // 🔑 Générer un mot de passe temporaire
      const motDePasseTemporaire = randomBytes(8).toString('hex');
      
      // 🔒 Mettre à jour l'utilisateur
      const utilisateur = await Utilisateur.findById(demande.utilisateur._id);
      if (utilisateur) {
        utilisateur.motDePasse = motDePasseTemporaire;
        utilisateur.doitChangerMotDePasse = true;
        await utilisateur.save();

        // Stocker le mot de passe temporaire (hashé) dans la demande
        demande.nouveauMotDePasseTemporaire = utilisateur.motDePasse;
      }

      // 🔔 Notifier l'utilisateur
      await Notification.create({
        utilisateur: demande.utilisateur._id,
        titre: "Mot de passe réinitialisé",
        message: `Un administrateur a réinitialisé votre mot de passe. Vous devez le changer à votre prochaine connexion. Mot de passe temporaire: ${motDePasseTemporaire}`,
        type: "info"
      });

      // Envoyer l'email avec le mot de passe temporaire
      await sendEmail({
        to: utilisateur ? utilisateur.email : demande.utilisateur.email,
        ...emailTemplates.passwordReset({
          prenom: utilisateur ? utilisateur.prenom : demande.utilisateur.prenom,
          motDePasseTemporaire: motDePasseTemporaire
        })
      });

    } else {
      // 📝 Enregistrer la raison du rejet
}

await demande.save();

// 📊 Log d'audit
await action.create({
  admin: currentUser._id,
  action: `reset_password_${actionAdmin}`,
  module: "Auth",
  donnees: { 
    demandeId: demande._id,
    utilisateur: demande.utilisateur._id
  }
});
    await action.create({
      admin: currentUser._id,
      action: `reset_password_${actionAdmin}`,
      module: "Auth",
      donnees: { 
        demandeId: demande._id,
        utilisateur: demande.utilisateur._id
      }
    });
    

    return NextResponse.json({ 
      message: `Demande ${actionAdmin === 'approuve' ? 'approuvée' : 'rejetée'}.` 
    });

  } catch (error) {
    console.error("Erreur reset mot de passe:", error);
    return NextResponse.json({ 
      message: "Erreur lors du traitement de la demande." 
    }, { status: 500 });
  }
}