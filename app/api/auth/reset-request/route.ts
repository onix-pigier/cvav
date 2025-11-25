// app/api/auth/reset-requests/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import DemandeResetMotDePasse from "@/models/resetpassword";

export async function GET(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "reset_password")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statut = searchParams.get('statut');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filtre: any = {};
    if (statut) {
      filtre.statut = statut;
    }

    const skip = (page - 1) * limit;

    const demandes = await DemandeResetMotDePasse.find(filtre)
      .populate("utilisateur", "prenom nom email")
      .populate("traitePar", "prenom nom")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await DemandeResetMotDePasse.countDocuments(filtre);

    return NextResponse.json({
      demandes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Erreur liste demandes reset:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération des demandes." 
    }, { status: 500 });
  }
}