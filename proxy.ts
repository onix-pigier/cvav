// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { voirPermission } from './utils/permission';

// Routes publiques (toujours accessibles)
const PUBLIC_ROUTES = ['/login', '/forgot-password', '/register', '/'];

// Routes qui nécessitent une permission spécifique
const PROTECTED_ROUTES: Record<string, string> = {
  
  '/admin': 'voir_utilisateur',                    // ex: accès page admin
  '/admin/users': 'voir_utilisateur',
  '/admin/users/create': 'creer_utilisateur',
  '/admin/users/edit': 'modifier_utilisateur',
  '/admin/users/delete': 'supprimer_utilisateur',
  '/admin/roles': 'voir_role',
  '/admin/logs': 'voir_les_logs_actions',
  '/admin/ceremonies': 'voir_demande_ceremonies',
  '/admin/attestations': 'voir_demande_attestations',

  '/militants': 'voir_militants',
  '/militants/create': 'creer_militant',
  '/militants/edit': 'modifier_militant',

  '/fichiers': 'voir_fichiers',
  '/fichiers/upload': 'uploader_fichiers',
  '/fichiers/delete': 'supprimer_fichiers',

  // Tu peux même faire des wildcards simples
  '/notifications': 'voir_notifications',
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Routes publiques → on laisse passer
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return checkAndRedirectIfLoggedIn(request, pathname);
  }

  // 2. Récupération sécurisée de l'utilisateur (via ton cookie httpOnly)
  const meResponse = await fetch(new URL('/api/auth/me', request.url), {
    headers: {
      cookie: request.headers.get('cookie') || '',
    },
  });

  if (!meResponse.ok) {
    // Pas connecté → login avec retour
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { utilisateur } = await meResponse.json();

  // 3. Vérification de la permission avec TON système existant
  const requiredPermission = findRequiredPermission(pathname);

  if (requiredPermission && !voirPermission(utilisateur, requiredPermission)) {
    return NextResponse.redirect(new URL('/403', request.url));
  }

  // Tout est bon → on continue
  return NextResponse.next();
}

// --- Fonctions utilitaires ---

// Si déjà connecté sur /login → dashboard
async function checkAndRedirectIfLoggedIn(request: NextRequest, pathname: string) {
  if (pathname === '/login') {
    const res = await fetch(new URL('/api/auth/me', request.url), {
      headers: { cookie: request.headers.get('cookie') || '' },
    });
    if (res.ok) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  return NextResponse.next();
}

// Trouve la permission requise pour une route
function findRequiredPermission(pathname: string): string | null {
  // Recherche exacte d'abord
  if (PROTECTED_ROUTES[pathname]) {
    return PROTECTED_ROUTES[pathname];
  }

  // Recherche par préfixe (ex: /admin/users/123 → /admin/users)
  for (const [route, permission] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route + '/') || pathname === route) {
      return permission;
    }
  }

  // Si pas de règle spécifique → on laisse passer (ou tu peux bloquer tout par défaut)
  return null;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};