// //app/api/permissions/route.ts

// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/db';
// import { getUserFromToken } from '@/utils/auth';
// import { voirPermission } from '@/utils/permission';
// import { ALL_PERMISSIONS } from '@/utils/permission';

// export async function GET(request: Request) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
    
//     //  VÉRIFICATION RBAC STRICTE
//     if (!currentUser) {
//       return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
//     }

//     //  SEULS LES ADMINS OU GESTIONNAIRES DE RÔLES
//     const peutVoirPermissions = voirPermission(currentUser, "creer_role") || 
//                                voirPermission(currentUser, "modifier_role") ||
//                                currentUser.role.nom.toLowerCase() === 'admin';

//     if (!peutVoirPermissions) {
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
//     }

//     return NextResponse.json(ALL_PERMISSIONS);

//   } catch (error) {
//     console.error("Erreur route permissions:", error);
//     return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
//   }
// }
// ──────────────────────────────────────────────

// app/api/permissions/route.ts - VERSION SIMPLIFIÉE
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromToken } from '@/utils/auth';
import { voirPermission, estAdmin, ALL_PERMISSIONS, PERMISSIONS_CATEGORIES } from '@/utils/permission';

// ============================================
// ROUTE GET - RETOURNE LES PERMISSIONS
// ============================================

export async function GET(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    // ✅ Vérification authentification
    if (!currentUser) {
      return NextResponse.json({ 
        message: "Authentification requise." 
      }, { status: 401 });
    }

    // ✅ Vérification permissions
    const peutVoirPermissions = 
      estAdmin(currentUser) ||
      voirPermission(currentUser, "creer_role") || 
      voirPermission(currentUser, "modifier_tout_role") ||
      voirPermission(currentUser, "voir_tout_role");

    if (!peutVoirPermissions) {
      return NextResponse.json({ 
        message: "Accès refusé." 
      }, { status: 403 });
    }

    // ✅ Récupération du format demandé
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'organized';

    // ============================================
    // FORMAT 1 : LISTE PLATE (codes uniquement)
    // ============================================
    if (format === 'codes') {
      return NextResponse.json({
        total: ALL_PERMISSIONS.length,
        permissions: ALL_PERMISSIONS
      });
    }

    // ============================================
    // FORMAT 2 : LISTE SIMPLE (code + label)
    // ============================================
    if (format === 'flat') {
      const permissionsFlat = Object.values(PERMISSIONS_CATEGORIES)
        .flatMap(categorie => categorie.permissions);

      return NextResponse.json({
        total: permissionsFlat.length,
        permissions: permissionsFlat
      });
    }

    // ============================================
    // FORMAT 3 : ORGANISÉ PAR CATÉGORIE (défaut)
    // ============================================
    return NextResponse.json({
      total: ALL_PERMISSIONS.length,
      categories: Object.entries(PERMISSIONS_CATEGORIES).map(([key, categorie]) => ({
        id: key,
        nom: categorie.nom,
        icon: categorie.icon,
        description: categorie.description,
        count: categorie.permissions.length,
        permissions: categorie.permissions
      })),
      meta: {
        isAdmin: estAdmin(currentUser),
        userRole: currentUser.role.nom,
        formats: ['organized', 'flat', 'codes']
      }
    });

  } catch (error) {
    console.error("💥 Erreur API permissions:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération des permissions." 
    }, { status: 500 });
  }
}

// ✅ Re-export pour utilisation dans d'autres fichiers
export { ALL_PERMISSIONS, PERMISSIONS_CATEGORIES } from '@/utils/permission';