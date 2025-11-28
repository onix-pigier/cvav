import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import DemandeCeremonie from "@/models/ceremonie";
import action from "@/models/action";

// ──────────────────────────────────────────────
// GET → Récupérer une demande spécifique
// ──────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "voir_demande_ceremonies")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const demandeId = params.id;
    const demande = await DemandeCeremonie.findById(demandeId)
      .populate("utilisateur", "prenom nom email secteur paroisse")
      .populate("validePar", "prenom nom")
      .populate("courrierScanne", "nom url type taille");

    if (!demande) {
      return NextResponse.json({ 
        message: "Demande de cérémonie non trouvée." 
      }, { status: 404 });
    }

    //  VÉRIFICATION ABAC
    if (currentUser.role.nom !== "Admin") {
      const estProprietaire = demande.utilisateur._id.toString() === currentUser._id.toString();
      const memeSecteur = demande.Secteur === currentUser.secteur;
      const memeParoisse = demande.paroisse === currentUser.paroisse;
      
      if (!estProprietaire && !(memeSecteur && memeParoisse)) {
        return NextResponse.json({ 
          message: "Accès refusé à cette demande." 
        }, { status: 403 });
      }
    }

    return NextResponse.json(demande);

  } catch (error) {
    console.error("Erreur recherche demande cérémonie:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la recherche de la demande." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PUT → Modifier une demande
// ──────────────────────────────────────────────
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "modifier_demande_ceremonie")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const demandeId = params.id;
    const demande = await DemandeCeremonie.findById(demandeId);

    if (!demande) {
      return NextResponse.json({ 
        message: "Demande de cérémonie non trouvée." 
      }, { status: 404 });
    }

    //  VÉRIFICATION ABAC : Seul le propriétaire peut modifier (et seulement si en attente)
    const estProprietaire = demande.utilisateur.toString() === currentUser._id.toString();
    
    if (!estProprietaire) {
      return NextResponse.json({ 
        message: "Vous ne pouvez modifier que vos propres demandes." 
      }, { status: 403 });
    }

    if (demande.statut !== "en_attente") {
      return NextResponse.json({ 
        message: "Vous ne pouvez modifier que les demandes en attente." 
      }, { status: 400 });
    }

    const {
      Secteur,
      paroisse,
      foulardsBenjamins,
      foulardsCadets,
      foulardsAines,
      dateCeremonie,
      lieuxCeremonie,
      nombreParrains,
      nombreMarraines,
      courrierScanne
    } = await request.json();

    //  VALIDATION ABAC : L'utilisateur ne peut modifier que vers son secteur et paroisse
    if (currentUser.role.nom !== "Admin") {
      if (Secteur && Secteur !== currentUser.secteur) {
        return NextResponse.json({ 
          message: "Vous ne pouvez créer des demandes que dans votre secteur." 
        }, { status: 403 });
      }

      if (paroisse && paroisse !== currentUser.paroisse) {
        return NextResponse.json({ 
          message: "Vous ne pouvez modifier que votre propre paroisse." 
        }, { status: 403 });
      }
    }

    //  VALIDATION DE LA DATE si modification
    if (dateCeremonie) {
      const dateCeremonieObj = new Date(dateCeremonie);
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);

      if (dateCeremonieObj < aujourdhui) {
        return NextResponse.json({ 
          message: "La date de cérémonie doit être dans le futur." 
        }, { status: 400 });
      }
    }

    //  MISE À JOUR
    const updates: any = {};
    if (Secteur) updates.Secteur = Secteur;
    if (paroisse) updates.paroisse = paroisse;
    if (foulardsBenjamins !== undefined) updates.foulardsBenjamins = foulardsBenjamins;
    if (foulardsCadets !== undefined) updates.foulardsCadets = foulardsCadets;
    if (foulardsAines !== undefined) updates.foulardsAines = foulardsAines;
    if (dateCeremonie) updates.dateCeremonie = new Date(dateCeremonie);
    if (lieuxCeremonie) updates.lieuxCeremonie = lieuxCeremonie;
    if (nombreParrains !== undefined) updates.nombreParrains = nombreParrains;
    if (nombreMarraines !== undefined) updates.nombreMarraines = nombreMarraines;
    if (courrierScanne) updates.courrierScanne = courrierScanne;

    const demandeMaj = await DemandeCeremonie.findByIdAndUpdate(
      demandeId,
      updates,
      { new: true, runValidators: true }
    )
    .populate("utilisateur", "prenom nom email")
    .populate("courrierScanne", "nom url");

    //  LOG D'AUDIT
    await action.create({
      admin: currentUser._id,
      action: "modifier_demande_ceremonie",
      module: "Ceremonie",
      donnees: { 
        demandeId: demandeMaj._id,
        modifications: Object.keys(updates)
      }
    });

    return NextResponse.json(
      { 
        message: "Demande modifiée avec succès.",
        data: demandeMaj 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur modification demande cérémonie:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la modification de la demande." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE → Supprimer une demande
// ──────────────────────────────────────────────
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "supprimer_demande_ceremonie")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const demandeId = params.id;
    const demande = await DemandeCeremonie.findById(demandeId);

    if (!demande) {
      return NextResponse.json({ 
        message: "Demande de cérémonie non trouvée." 
      }, { status: 404 });
    }

    //  VÉRIFICATION ABAC
    const estProprietaire = demande.utilisateur.toString() === currentUser._id.toString();
    const estAdmin = currentUser.role.nom === "Admin";
    
    if (!estProprietaire && !estAdmin) {
      return NextResponse.json({ 
        message: "Vous ne pouvez supprimer que vos propres demandes." 
      }, { status: 403 });
    }

    //  Les non-admins ne peuvent supprimer que les demandes en attente
    if (!estAdmin && demande.statut !== "en_attente") {
      return NextResponse.json({ 
        message: "Vous ne pouvez supprimer que les demandes en attente." 
      }, { status: 400 });
    }

    await DemandeCeremonie.findByIdAndDelete(demandeId);

    //  LOG D'AUDIT
    await action.create({
      admin: currentUser._id,
      action: "supprimer_demande_ceremonie",
      module: "Ceremonie",
      donnees: { 
        demandeId: demande._id,
        statut: demande.statut,
        secteur: demande.Secteur
      }
    });

    return NextResponse.json({ 
      message: "Demande supprimée avec succès." 
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur suppression demande cérémonie:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la suppression de la demande." 
    }, { status: 500 });
  }
}