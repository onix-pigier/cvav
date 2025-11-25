// utils/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Utilisateur from "@/models/utilisateur";
import { connectDB } from "@/lib/db";

export async function getUserFromToken(request?: Request) {
  try {
    let token: string | undefined;

    // Récupérer le token depuis les cookies
    if (request) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const tokenMatch = cookieHeader.match(/token=([^;]+)/);
        token = tokenMatch ? tokenMatch[1] : undefined;
      }
    } else {
      // Pour les Server Components
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    }

    if (!token) {
      console.log("Aucun token trouvé ");
      return null;
    }
    console.log("Token trouvé :", token.substring(0, 20) + "...");


    // Vérifier le token
    const  jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET non défini");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };

    console.log("Token décodé email :", decoded.userId);
      console.log("Token décodé -UserID :", decoded.email);
      console.log("Token décodé -Rôle :", decoded.role);

    // Connexion à la base de données

      await connectDB();

    // Récupérer l'utilisateur
    const utilisateur = await Utilisateur.findById(decoded.userId)
      .populate("role", "nom permissions");

    if (!utilisateur) {
      //throw new Error("Utilisateur non trouvé");
      console.log('utilatueur non trouvé en db');
      return null;
    }

    if (!utilisateur.actif) {
      console.log('Utilisateur non actif');
      return null;
    }

    console.log("Utilisateur récupéré :", utilisateur.email);
    return utilisateur;

  } catch (error) {
    console.error("Erreur vérification token:", error);
    return null;
  }
}