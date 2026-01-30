// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Utilisateur from "@/models/utilisateur";
import DemandeResetMotDePasse from "@/models/resetpassword";
import Notification from "@/models/notification";
import { sendEmail, emailTemplates } from "@/lib/email";
import Role from "@/models/role";
import { consumeRateLimit } from "@/lib/rateLimiter";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();

    // Rate-limiter simple (par email) : 5 tentatives / heure
    const key = `forgot:${email ? email.toLowerCase() : 'unknown'}`;
    const rate = consumeRateLimit(key, { windowMs: 60 * 60 * 1000, max: 5 });
    if (!rate.allowed) {
      return NextResponse.json({ message: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
    }

    if (!email) {
      return NextResponse.json({ message: "Email requis." }, { status: 400 });
    }

    // 🔒 Vérifier que l'utilisateur existe et est actif
    const utilisateur = await Utilisateur.findOne({ 
      email: email.toLowerCase(), 
      actif: true 
    });

    // Pour des raisons de sécurité, on ne révèle pas si l'email existe
    const messageReponse = "Si votre email existe dans notre système, une demande a été envoyée à l'administrateur.";

    if (!utilisateur) {
      return NextResponse.json({ message: messageReponse });
    }

    // 🔒 Vérifier qu'il n'y a pas déjà une demande en attente
    const demandeExistante = await DemandeResetMotDePasse.findOne({
      utilisateur: utilisateur._id,
      statut: "en_attente",
      expireLe: { $gt: new Date() }
    });

    if (demandeExistante) {
      return NextResponse.json({ 
        message: "Une demande de réinitialisation est déjà en cours." 
      }, { status: 400 });
    }

    // 🔑 Générer un token sécurisé
    const token = randomBytes(32).toString('hex');
    const expireLe = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    // Créer la demande
    const demandeReset = await DemandeResetMotDePasse.create({
      utilisateur: utilisateur._id,
      token,
      expireLe,
      statut: "en_attente"
    });

    // Envoyer lien de réinitialisation à l'utilisateur
    const resetLink = `${(process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '')}/forgot-reset/${token}`;
    const mail = emailTemplates.resetLink({ prenom: utilisateur.prenom, link: resetLink });
    await sendEmail({ to: utilisateur.email, subject: mail.subject, html: mail.html });

    // Notifier les administrateurs (notification interne)
    const roleAdmin = await Role.findOne({ nom: "Admin" });
    if (roleAdmin) {
      const admins = await Utilisateur.find({ role: roleAdmin._id });
      for (const admin of admins) {
        await Notification.create({
          utilisateur: admin._id,
          titre: "Demande de réinitialisation de mot de passe",
          message: `${utilisateur.prenom} ${utilisateur.nom} (${utilisateur.email}) a demandé une réinitialisation de mot de passe.`,
          lien: `/admin/reset-password-requests/${demandeReset._id}`,
          type: "info"
        });
      }
    }

    return NextResponse.json({ message: messageReponse });

  } catch (error) {
    console.error("Erreur demande reset mot de passe:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la demande de réinitialisation." 
    }, { status: 500 });
  }
}