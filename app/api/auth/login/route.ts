 // app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import Utilisateur from "@/models/utilisateur";



export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, motDePasse } = await request.json();

    if (!email || !motDePasse) {
      return NextResponse.json({ 
        message: "Email et mot de passe requis." 
      }, { status: 400 });
    }

    // 🔒 Vérifier si l'utilisateur existe avec le mot de passe
    const utilisateur = await Utilisateur.findOne({ email })
      .select("+motDePasse")
      .populate("role", "nom permissions");

    if (!utilisateur) {
      return NextResponse.json({ 
        message: "Email ou mot de passe incorrect." 
      }, { status: 401 });
    }

    // 🔒 Vérifier si le compte est actif
    if (!utilisateur.actif) {
      return NextResponse.json({ 
        message: "Compte désactivé. Contactez l'administrateur." 
      }, { status: 401 });
    }

    // 🔒 Vérifier si le compte est bloqué temporairement
    if (utilisateur.bloqueJusquA && utilisateur.bloqueJusquA > new Date()) {
      return NextResponse.json({ 
        message: "Compte temporairement bloqué. Contactez l'administrateur." 
      }, { status: 401 });
    }

    // 🔒 Vérifier le mot de passe
    const motDePasseCorrect = await utilisateur.compareMotDePasse(motDePasse);
    if (!motDePasseCorrect) {
      await utilisateur.incrementerTentativeConnexion();
      return NextResponse.json({ 
        message: "Email ou mot de passe incorrect." 
      }, { status: 401 });
    }

    //  Connexion réussie - réinitialiser les tentatives
    await utilisateur.reinitialiserTentativesConnexion();

    // 🔑 Générer le token JWT
        const jwtSecret: Secret = process.env.JWT_SECRET as Secret;
        if (!jwtSecret) {
          throw new Error("JWT_SECRET non défini.");
        }
        const signOptions: SignOptions = {
          expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as unknown as SignOptions["expiresIn"],
        };
        const token = jwt.sign(
          { 
            userId: utilisateur._id,
            email: utilisateur.email,
            role: utilisateur.role.nom
          },
          jwtSecret,
          signOptions
        );

    // 📦 Préparer la réponse
    const userResponse = utilisateur.toJSON();

    const response = NextResponse.json({
      message: "Connexion réussie.",
      utilisateur: userResponse,
      doitChangerMotDePasse: utilisateur.doitChangerMotDePasse
    });

    // 🍪 Définir le cookie HTTP-only
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Erreur connexion:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la connexion." 
    }, { status: 500 });
  }
}