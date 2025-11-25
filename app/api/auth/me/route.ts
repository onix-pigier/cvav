// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import Utilisateur from "@/models/utilisateur";

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    console.log("utilisateur trouvé dans /me :", currentUser.email);

    // // Recharger l'utilisateur avec les données fraîches
    // const utilisateur = await Utilisateur.findById(currentUser._id)
    //   .populate("role", "nom permissions");

    // if (!utilisateur) {
    //   return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
    // }

    return NextResponse.json({
      utilisateur: currentUser.toJSON(),
      doitChangerMotDePasse: currentUser.doitChangerMotDePasse
    });

  } catch (error) {
    console.error("Erreur récupération utilisateur:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération du profil." 
    }, { status: 500 });
  }
}