// // utils/auth.ts - VERSION CORRIGÉE
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

    if (!token) return null;

    // Vérifier le token (ne pas logger le token en clair pour éviter fuite)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET non défini");
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      email: string;
      role: string;
    };

    // Connexion à la base de données
    await connectDB();

    // Récupérer l'utilisateur
    const utilisateur = await Utilisateur.findById(decoded.userId)
      .populate("role", "nom permissions");

    // ⚠️ CORRECTION : Vérifier d'abord si l'utilisateur existe
    if (!utilisateur) return null;

    // 🔥 CORRECTION : Meilleure gestion de la population du rôle
    if (!utilisateur.role || typeof utilisateur.role === 'string') {
      console.log("🔄 Rôle non peuplé, nouvelle population...");
      await utilisateur.populate('role');
    }

    if (!utilisateur.actif) return null;
    return utilisateur;

  } catch (error) {
    console.error("❌ Erreur vérification token:", error);
    return null;
  }
}