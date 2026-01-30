import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import DemandeResetMotDePasse from "@/models/resetpassword";
import Utilisateur from "@/models/utilisateur";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { token, motDePasse } = await request.json();

    if (!token || !motDePasse) {
      return NextResponse.json({ message: "Token et nouveau mot de passe requis." }, { status: 400 });
    }

    const demande = await DemandeResetMotDePasse.findOne({ token, statut: "en_attente", expireLe: { $gt: new Date() } }).select('+utilisateur');
    if (!demande) {
      return NextResponse.json({ message: "Token invalide ou expiré." }, { status: 400 });
    }

    const utilisateur = await Utilisateur.findById(demande.utilisateur);
    if (!utilisateur) {
      return NextResponse.json({ message: "Utilisateur introuvable." }, { status: 404 });
    }

    // Mettre à jour le mot de passe (le pre-save du modèle hashera)
    utilisateur.motDePasse = motDePasse;
    utilisateur.doitChangerMotDePasse = false;
    await utilisateur.save();

    demande.statut = "approuve";
    demande.utilise = true;
    demande.dateTraitement = new Date();
    await demande.save();

    // Envoyer confirmation
    const mail = emailTemplates.passwordReset({ prenom: utilisateur.prenom, motDePasseTemporaire: motDePasse });
    await sendEmail({ to: utilisateur.email, subject: mail.subject, html: mail.html });

    return NextResponse.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error('Erreur reset by token:', error);
    return NextResponse.json({ message: 'Erreur lors de la réinitialisation.' }, { status: 500 });
  }
}
