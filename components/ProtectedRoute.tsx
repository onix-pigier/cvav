"use client";

import { ReactNode } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, isLoggingOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ✅ Si pas authentifié et le chargement est fini, rediriger vers login
    if (!isLoading && !isLoggingOut && !isAuthenticated) {
      console.warn("🔒 Accès refusé - redirection vers login");
      router.push("/login");
    }

    // ✅ Si on a un rôle requis, vérifier le rôle
    if (
      !isLoading &&
      !isLoggingOut &&
      user &&
      requiredRole &&
      user.role?.nom?.toLowerCase() !== requiredRole.toLowerCase()
    ) {
      console.warn(`🔒 Accès refusé - rôle ${requiredRole} requis`);
      router.push("/403");
    }
  }, [isLoading, isAuthenticated, isLoggingOut, user, requiredRole, router]);

  // ✅ Pendant le chargement ou la déconnexion, afficher rien
  if (isLoading || isLoggingOut) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  // ✅ Si pas authentifié, retourner null (la redirection se fera dans le useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // ✅ Si rôle requis et ne correspond pas, ne pas afficher
  if (
    requiredRole &&
    user?.role?.nom?.toLowerCase() !== requiredRole.toLowerCase()
  ) {
    return null;
  }

  return <>{children}</>;
}
