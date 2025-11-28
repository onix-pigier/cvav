import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import DemandeCeremonie from "@/models/ceremonie";
import action from "@/models/action";
import Notification from "@/models/notification";
import Role from "@/models/role";
import Utilisateur from "@/models/utilisateur";
import { sendEmail, emailTemplates } from "@/lib/email";

// ──────────────────────────────────────────────
// POST → Créer une demande de cérémonie
// ──────────────────────────────────────────────
export const POST = async (request: Request) => {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "creer_demande_ceremonie")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
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

    //  VALIDATION DES CHAMPS REQUIS
    const champsRequis = {
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
    };

    const champsManquants = Object.entries(champsRequis)
      .filter(([_, value]) => value === undefined || value === null || value === "")
      .map(([key]) => key);

    if (champsManquants.length > 0) {
      return NextResponse.json({ 
        message: "Champs requis manquants.", 
        champs: champsManquants 
      }, { status: 400 });
    }

    //  VALIDATION DES NOMBRES POSITIFS
    if (foulardsBenjamins < 0 || foulardsCadets < 0 || foulardsAines < 0 || 
        nombreParrains < 0 || nombreMarraines < 0) {
      return NextResponse.json({ 
        message: "Les nombres doivent être positifs." 
      }, { status: 400 });
    }

    //  VALIDATION DE LA DATE (au moins 1 jour dans le futur)
    const dateCeremonieObj = new Date(dateCeremonie);
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    if (dateCeremonieObj < aujourdhui) {
      return NextResponse.json({ 
        message: "La date de cérémonie doit être dans le futur." 
      }, { status: 400 });
    }

    //  VÉRIFICATION ABAC : L'utilisateur ne peut créer que dans son secteur/paroisse
    if (currentUser.role.nom !== "Admin") {
      if (Secteur !== currentUser.secteur || paroisse !== currentUser.paroisse) {
        return NextResponse.json({ 
          message: "Vous ne pouvez créer des demandes que dans votre secteur et paroisse." 
        }, { status: 403 });
      }
    }

    //  CRÉATION DE LA DEMANDE
    const nouvelleDemande = await DemandeCeremonie.create({
      utilisateur: currentUser._id,
      Secteur,
      paroisse,
      foulardsBenjamins,
      foulardsCadets,
      foulardsAines,
      dateCeremonie: dateCeremonieObj,
      lieuxCeremonie,
      nombreParrains,
      nombreMarraines,
      courrierScanne,
      statut: "en_attente"
    });

    //  LOG D'AUDIT
    await action.create({
      admin: currentUser._id,
      action: "creer_demande_ceremonie",
      module: "Ceremonie",
      donnees: { 
        demandeId: nouvelleDemande._id,
        secteur: Secteur,
        dateCeremonie: dateCeremonieObj
      }
    });

    //  NOTIFICATION POUR L'ADMIN - Nouvelle demande
    const roleAdmin = await Role.findOne({ nom: "Admin" });
    if (roleAdmin) {
      const admins = await Utilisateur.find({ role: roleAdmin._id });
      
      for (const admin of admins) {
        await Notification.create({
          utilisateur: admin._id,
          titre: "Nouvelle demande de cérémonie",
          message: `${currentUser.prenom} ${currentUser.nom} a soumis une nouvelle demande de cérémonie pour le secteur ${Secteur}`,
          lien: `/admin/ceremonies/${nouvelleDemande._id}`,
          type: "info"
        });
      }

       for (const admin of admins) {
  await sendEmail({
    to: admin.email,
    ...emailTemplates.newRequestAdmin({
      type: 'cérémonie', // ou 'attestation'
      user: `${currentUser.prenom} ${currentUser.nom}`,
      date: new Date().toLocaleDateString('fr-FR')
    })
  });
}

       
    }

    

    return NextResponse.json(
      { 
        message: "Demande de cérémonie créée avec succès et administrateurs notifiés.",
        data: nouvelleDemande 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Erreur création demande cérémonie:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la création de la demande." 
    }, { status: 500 });
  }
};

// ──────────────────────────────────────────────
// GET → Lister les demandes de cérémonie
// ──────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "voir_demande_ceremonies")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    //  CONSTRUCTION DU FILTRE ABAC
    let filtre = {};
    
    if (currentUser.role.nom === "Admin") {
      // Admin voit toutes les demandes
      filtre = {};
    } else if (voirPermission(currentUser, "voir_les_demandes_ceremonie")) {
      // Utilisateurs avec permission spécifique voient leur secteur/paroisse
      filtre = { 
        Secteur: currentUser.secteur,
        paroisse: currentUser.paroisse
      };
    } else {
      // Utilisateurs normaux ne voient que leurs propres demandes
      filtre = { utilisateur: currentUser._id };
    }

    const demandes = await DemandeCeremonie.find(filtre)
      .populate("utilisateur", "prenom nom email")
      .populate("validePar", "prenom nom")
      .populate("courrierScanne", "nom url")
      .sort({ createdAt: -1 });

    return NextResponse.json(demandes);

  } catch (error) {
    console.error("Erreur liste demandes cérémonie:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération des demandes." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PATCH → Valider/Rejeter une demande (Admin seulement)
// ──────────────────────────────────────────────
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "valider_demande_ceremonie")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const { id, statut, commentaireAdmin } = await request.json();

    if (!id || !statut) {
      return NextResponse.json({ 
        message: "ID et statut requis." 
      }, { status: 400 });
    }

    if (!["valide", "rejete"].includes(statut)) {
      return NextResponse.json({ 
        message: "Statut invalide. Doit être 'valide' ou 'rejete'." 
      }, { status: 400 });
    }

    const demande = await DemandeCeremonie.findById(id).populate("utilisateur", "prenom nom email");
    if (!demande) {
      return NextResponse.json({ 
        message: "Demande de cérémonie non trouvée." 
      }, { status: 404 });
    }

    //  MISE À JOUR AVEC VALIDATION
    const updateData: any = {
      statut,
      validePar: currentUser._id,
      dateValidation: new Date()
    };

    if (commentaireAdmin) {
      updateData.commentaireAdmin = commentaireAdmin;
    }

    const demandeMaj = await DemandeCeremonie.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    )
    .populate("utilisateur", "prenom nom email")
    .populate("validePar", "prenom nom");

    //  NOTIFICATION POUR L'UTILISATEUR - Réponse admin
    await Notification.create({
      utilisateur: demandeMaj.utilisateur._id,
      titre: `Demande de cérémonie ${statut === 'valide' ? 'approuvée' : 'rejetée'}`,
      message: `Votre demande de cérémonie pour le ${new Date(demandeMaj.dateCeremonie).toLocaleDateString()} a été ${statut === 'valide' ? 'approuvée' : 'rejetée'}${commentaireAdmin ? `. Commentaire: ${commentaireAdmin}` : ''}`,
      lien: `/mes-ceremonies/${demandeMaj._id}`,
      type: statut === 'valide' ? "succes" : "erreur"
    });

    //  LOG D'AUDIT
    await action.create({
      admin: currentUser._id,
      action: `${statut}_demande_ceremonie`,
      module: "Ceremonie",
      donnees: { 
        demandeId: demandeMaj._id,
        statut: statut,
        commentaire: commentaireAdmin || null
      }
    });

    return NextResponse.json(
      { 
        message: `Demande ${statut === 'valide' ? 'validée' : 'rejetée'} avec succès. L'utilisateur a été notifié.`,
        data: demandeMaj 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur validation demande cérémonie:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la validation de la demande." 
    }, { status: 500 });
  }
}