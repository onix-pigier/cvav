//app/api/auth/me/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import Utilisateur, { IUtilisateur } from "@/models/utilisateur";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // ✅ Pas de cache

export async function GET(request: Request) {
  try {
    await connectDB();
    
    console.log("🔍 Début /me - Authentification en cours...");

    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      console.log("❌ /me - Non authentifié");
      const response = NextResponse.json(
        { message: "Non authentifié." }, 
        { status: 401 }
      );
      // ✅ Empêcher le cache de réponses 401
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return response;
    }

    console.log("✅ /me - Token valide, chargement utilisateur...");

    // 🔥 Recharger depuis la base pour être sûr d'avoir les données à jour
    const utilisateur = await Utilisateur.findById(currentUser._id)
      .populate("role", "nom permissions")
      .select("-motDePasse")
      .lean() as unknown as IUtilisateur | null;

    if (!utilisateur) {
      console.log("❌ /me - Utilisateur non trouvé en base");
      return NextResponse.json(
        { message: "Utilisateur non trouvé." }, 
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      utilisateur,
      doitChangerMotDePasse: utilisateur.doitChangerMotDePasse
    });

    // ✅ Headers anti-cache pour les données sensibles
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;

  } catch (error) {
    console.error("💥 Erreur /me:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération du profil." 
    }, { status: 500 });
  }
}