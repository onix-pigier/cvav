// app/api/users/[id]/logs/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import { estAdmin } from "@/utils/permission";
import LogAction from "@/models/action";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    console.log('📊 Début récupération logs utilisateur');
    
    if (!currentUser || !estAdmin(currentUser)) {
      console.log('❌ Accès refusé - Non admin');
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const params = await context.params;
    const userId = params.id;

    console.log('🔍 Recherche logs pour user:', userId);

    // Récupérer les 50 dernières actions de cet utilisateur
    const logs = await LogAction.find({ admin: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('action module createdAt donnees');

    console.log(`✅ ${logs.length} logs trouvés`);

    return NextResponse.json(logs);

  } catch (error) {
    console.error("💥 Erreur récupération logs:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération des logs." 
    }, { status: 500 });
  }
}