// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ 
      message: "Déconnexion réussie." 
    });

    // ✅ Supprimer le cookie de token
    response.cookies.delete({
      name: "token",
      path: "/"
    });

    // ✅ Ajouter les headers pour éviter le cache
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;

  } catch (error) {
    console.error("💥 Erreur déconnexion:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la déconnexion." 
    }, { status: 500 });
  }
}