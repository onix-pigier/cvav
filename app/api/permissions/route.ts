//app/api/permissions/route.ts

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromToken } from '@/utils/auth';
import { voirPermission } from '@/utils/permission';
import { ALL_PERMISSIONS } from '@/utils/permission';

export async function GET(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    //  VÉRIFICATION RBAC STRICTE
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    //  SEULS LES ADMINS OU GESTIONNAIRES DE RÔLES
    const peutVoirPermissions = voirPermission(currentUser, "creer_role") || 
                               voirPermission(currentUser, "modifier_role") ||
                               currentUser.role.nom.toLowerCase() === 'admin';

    if (!peutVoirPermissions) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    return NextResponse.json(ALL_PERMISSIONS);

  } catch (error) {
    console.error("Erreur route permissions:", error);
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}