import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Utilisateur from "@/models/utilisateur";
import LogAction from "@/models/action";
import { getUserFromToken } from "@/utils/auth";

// ──────────────────────────────────────────────
// GET → Récupérer un utilisateur par ID (Admin seulement)
// ──────────────────────────────────────────────
export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } //  CORRECTION NEXT.JS 14
) {
  try {
    //  CORRECTION CRITIQUE : AWAITER LES PARAMS
    const { id } = await params;
    const userId = id;
    
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    // CORRECTION : Vérification insensible à la casse
    if (!currentUser || currentUser.role.nom?.toLowerCase() !== "admin") {
      console.log(' Accès refusé GET - Rôle:', currentUser?.role?.nom);
      return NextResponse.json({ message: "Accès refusé. Admin requis." }, { status: 403 });
    }

    const user = await Utilisateur.findById(userId).populate("role").select("-motDePasse");
    
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error("Erreur recherche utilisateur:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la recherche." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PATCH → Modifier un utilisateur (Admin seulement)
// ──────────────────────────────────────────────
export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } //  CORRECTION NEXT.JS 14
) {
  try {
    //  CORRECTION CRITIQUE : AWAITER LES PARAMS
    const { id } = await params;
    const userId = id;
    
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    // CORRECTION : Vérification insensible à la casse
    if (!currentUser || currentUser.role.nom?.toLowerCase() !== "admin") {
      console.log(' Accès refusé PATCH - Rôle:', currentUser?.role?.nom);
      return NextResponse.json({ message: "Accès refusé. Admin requis." }, { status: 403 });
    }
    

    const { prenom, nom, email, roleId, telephone, paroisse, secteur } = await request.json();

    console.log(" Données reçues modification utilisateur:", { 
      prenom, nom, email, roleId, telephone, paroisse, secteur, userId
    });

    // EMPÊCHER AUTO MODIFICATION DU RÔLE ADMIN 
    if (roleId && userId === currentUser._id.toString() && roleId !== currentUser.role._id.toString()) {
      return NextResponse.json({ 
        message: "Vous ne pouvez pas modifier votre propre rôle." 
      }, { status: 403 });
    }

    const user = await Utilisateur.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
    }

    if (email && email !== user.email) {
      const emailExists = await Utilisateur.findOne({ email });
      if (emailExists) {
        return NextResponse.json({ message: "L'email est déjà utilisé par un autre utilisateur." }, { status: 400 });
      } 
    }

    // MISE À JOUR SÉCURISÉE
    const updates: any = {};
    if (prenom) updates.prenom = prenom;
    if (nom) updates.nom = nom;
    if (email) updates.email = email;
    if (telephone) updates.telephone = telephone;
    if (roleId) updates.role = roleId;
    if (paroisse) updates.paroisse = paroisse;
    if (secteur) updates.secteur = secteur;

    console.log(" Updates à appliquer:", updates);

    const updatedUser = await Utilisateur.findByIdAndUpdate(
      userId, 
      updates, 
      { new: true, runValidators: true }
    ).select("-motDePasse");

    if (!updatedUser) {
      return NextResponse.json({ message: "Erreur lors de la mise à jour." }, { status: 500 });
    }

    // LOG D'AUDIT
    await LogAction.create({
      admin: currentUser._id,
      action: "modifier_utilisateur",
      module: "Utilisateur",
      donnees: { 
        userId: updatedUser._id,
        modifications: Object.keys(updates)
      }
    });

    return NextResponse.json(
      { 
        message: "Utilisateur modifié avec succès.",
        data: updatedUser
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur modification utilisateur:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la mise à jour." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE → Supprimer un utilisateur (Admin seulement)
// ──────────────────────────────────────────────
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } //  CORRECTION NEXT.JS 14
) {
  try {
    //  CORRECTION CRITIQUE : AWAITER LES PARAMS
    const { id } = await params;
    const userId = id;
    
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    // CORRECTION : Vérification insensible à la casse
    if (!currentUser || currentUser.role.nom?.toLowerCase() !== "admin") {
      console.log(' Accès refusé DELETE - Rôle:', currentUser?.role?.nom);
      return NextResponse.json({ message: "Accès refusé. Admin requis." }, { status: 403 });
    }

    const user = await Utilisateur.findById(userId);
    
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
    }

    console.log("Tentative suppression utilisateur:", user.email);

    // EMPÊCHER l'auto-suppression
    if (userId === currentUser._id.toString()) {
      return NextResponse.json({ 
        message: "Vous ne pouvez pas supprimer votre propre compte." 
      }, { status: 403 });
    }

    // SUPPRESSION SÉCURISÉE
    await Utilisateur.findByIdAndDelete(userId);

    // LOG D'AUDIT
    await LogAction.create({
      admin: currentUser._id,
      action: "supprimer_utilisateur",
      module: "Utilisateur",
      donnees: { 
        userId: user._id,
        email: user.email,
        paroisse: user.paroisse,
        secteur: user.secteur
      }
    });

    return NextResponse.json({ 
      message: "Utilisateur supprimé avec succès." 
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur suppression utilisateur:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la suppression." 
    }, { status: 500 });
  }
}