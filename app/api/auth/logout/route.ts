// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ 
      message: "Déconnexion réussie." 
    });

    // LA BONNE FAÇON DE SUPPRIMER UN COOKIE (Next.js 16+)
    response.cookies.delete("token");
    // OU si tu veux être ultra-explicite :
    // response.cookies.delete({ name: "token", path: "/" });

    return response;

  } catch (error) {
    console.error("Erreur déconnexion:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la déconnexion." 
    }, { status: 500 });
  }
}