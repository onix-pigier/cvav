// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import Utilisateur from "@/models/utilisateur";
import Militant from "@/models/militant";
import DemandeCeremonie from "@/models/ceremonie";
import DemandeAttestation from "@/models/attestation";
import LogAction from "@/models/action";

export async function GET(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || currentUser.role.nom !== "Admin") {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    // Récupérer les statistiques en parallèle
    const [
      totalUsers,
      totalMilitants,
      pendingCeremonies,
      pendingAttestations,
      recentActivities
    ] = await Promise.all([
      Utilisateur.countDocuments(),
      Militant.countDocuments(),
      DemandeCeremonie.countDocuments({ statut: "en_attente" }),
      DemandeAttestation.countDocuments({ statut: "en_attente" }),
      LogAction.find()
        .populate("admin", "prenom nom")
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    return NextResponse.json({
      totalUsers,
      totalMilitants,
      pendingCeremonies,
      pendingAttestations,
      recentActivities
    });

  } catch (error) {
    console.error("Erreur récupération stats:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération des statistiques." 
    }, { status: 500 });
  }
}