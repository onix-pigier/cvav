// app/api/attestations/[id]/valider/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import DemandeAttestation from "@/models/attestation";
import Notification from "@/models/notification";
import Action from "@/models/action";
import Utilisateur from "@/models/utilisateur";
import { sendEmail } from "@/lib/email";

// ──────────────────────────────────────────────
// GET → Récupérer une demande spécifique
// ──────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const demandeId = id;
    const demande = await DemandeAttestation.findById(demandeId)
      .populate("utilisateur", "prenom nom email secteur paroisse")
      .populate("bulletinScanne", "nom url type taille _id");

    if (!demande) {
      return NextResponse.json({ 
        message: "Demande d'attestation non trouvée." 
      }, { status: 404 });
    }

    // Vérification accès: propriétaire ou admin
    const estProprietaire = demande.utilisateur._id.toString() === currentUser._id.toString();
    const estAdmin = currentUser.role?.nom === "Admin";
    
    if (!estProprietaire && !estAdmin) {
      return NextResponse.json({ 
        message: "Accès refusé à cette demande." 
      }, { status: 403 });
    }

    return NextResponse.json(demande);

  } catch (error) {
    console.error("Erreur GET attestation:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération de la demande." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PUT → Modifier ou valider/rejeter une demande
// ──────────────────────────────────────────────
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const demandeId = id;
    const demande = await DemandeAttestation.findById(demandeId)
      .populate("utilisateur");

    if (!demande) {
      return NextResponse.json({ 
        message: "Demande d'attestation non trouvée." 
      }, { status: 404 });
    }

    const body = await request.json();
    const { action, statut, numeroAttestation, motifRejet, prenom, nom, paroisse, secteur, anneeFinFormation, lieuDernierCamp } = body;

    // ════════════════════════════════════════════════
    // 🟢 ACTION 1: VALIDATION PAR ADMIN (action === 'validate')
    // ════════════════════════════════════════════════
    if (action === 'validate') {
      // Vérifier que c'est un admin
      if (currentUser.role?.nom !== 'Admin') {
        return NextResponse.json({ 
          message: "Seul un admin peut valider" 
        }, { status: 403 });
      }

      // Vérifier que la demande est soumise et en attente
      if (!demande.soumise || demande.statut !== 'en_attente') {
        return NextResponse.json({ 
          message: "Cette demande ne peut pas être validée" 
        }, { status: 400 });
      }

      // Vérifier que numéro d'attestation est fourni
      if (!numeroAttestation || !numeroAttestation.trim()) {
        return NextResponse.json({ 
          message: "Le numéro d'attestation est requis" 
        }, { status: 400 });
      }

      // Mise à jour
      demande.statut = 'valide';
      demande.numeroAttestation = numeroAttestation.trim();
      demande.validePar = currentUser._id;
      demande.dateValidation = new Date();
      await demande.save();

      // 📧 Email à l'utilisateur
      const user = await Utilisateur.findById(demande.utilisateur._id);
      if (user?.email) {
        try {
          await sendEmail({
            to: user.email,
            subject: "✅ Attestation validée",
            html: `
              <h2>Votre attestation a été validée!</h2>
              <p>Prénom: ${demande.prenom}</p>
              <p>Nom: ${demande.nom}</p>
              <p><strong>Numéro d'attestation: ${numeroAttestation}</strong></p>
              <p>Vous pouvez télécharger votre attestation depuis votre dashboard.</p>
            `
          });
        } catch (emailError) {
          console.error("Erreur envoi email:", emailError);
        }
      }

      // 🔔 Notification utilisateur
      await Notification.create({
        utilisateur: demande.utilisateur._id,
        titre: "✅ Attestation validée",
        message: `Votre attestation pour ${demande.prenom} ${demande.nom} a été validée. N°: ${numeroAttestation}`,
        lien: `/dashboard/attestations/${demandeId}`,
        type: "succes"
      });

      // 📊 Log d'audit
      await Action.create({
        admin: currentUser._id,
        action: "valider_attestation",
        module: "Attestation",
        donnees: { 
          demandeId: demande._id,
          numeroAttestation,
          pour: `${demande.prenom} ${demande.nom}`
        }
      });

      return NextResponse.json({
        message: "Attestation validée avec succès",
        data: demande
      }, { status: 200 });
    }

    // ════════════════════════════════════════════════
    // 🔴 ACTION 2: REJET PAR ADMIN (action === 'reject')
    // ════════════════════════════════════════════════
    if (action === 'reject') {
      // Vérifier que c'est un admin
      if (currentUser.role?.nom !== 'Admin') {
        return NextResponse.json({ 
          message: "Seul un admin peut rejeter" 
        }, { status: 403 });
      }

      // Vérifier que la demande est soumise et en attente
      if (!demande.soumise || demande.statut !== 'en_attente') {
        return NextResponse.json({ 
          message: "Cette demande ne peut pas être rejetée" 
        }, { status: 400 });
      }

      // Vérifier que motif est fourni
      if (!motifRejet || !motifRejet.trim()) {
        return NextResponse.json({ 
          message: "Le motif du rejet est requis" 
        }, { status: 400 });
      }

      // Mise à jour
      demande.statut = 'rejete';
      demande.commentaireAdmin = motifRejet.trim();
      demande.validePar = currentUser._id;
      demande.dateValidation = new Date();
      await demande.save();

      // 📧 Email à l'utilisateur
      const user = await Utilisateur.findById(demande.utilisateur._id);
      if (user?.email) {
        try {
          await sendEmail({
            to: user.email,
            subject: "❌ Attestation rejetée",
            html: `
              <h2>Votre demande d'attestation a été rejetée</h2>
              <p>Prénom: ${demande.prenom}</p>
              <p>Nom: ${demande.nom}</p>
              <p><strong>Motif:</strong> ${motifRejet}</p>
              <p>Vous pouvez modifier et soumettre à nouveau votre demande.</p>
            `
          });
        } catch (emailError) {
          console.error("Erreur envoi email:", emailError);
        }
      }

      // 🔔 Notification utilisateur
      await Notification.create({
        utilisateur: demande.utilisateur._id,
        titre: "❌ Attestation rejetée",
        message: `Motif: ${motifRejet}`,
        lien: `/dashboard/attestations/${demandeId}`,
        type: "erreur"
      });

      // 📊 Log d'audit
      await Action.create({
        admin: currentUser._id,
        action: "rejeter_attestation",
        module: "Attestation",
        donnees: { 
          demandeId: demande._id,
          motifRejet,
          pour: `${demande.prenom} ${demande.nom}`
        }
      });

      return NextResponse.json({
        message: "Attestation rejetée avec succès",
        data: demande
      }, { status: 200 });
    }

    // ════════════════════════════════════════════════
    // 🟡 ACTION 3: MODIFICATION PAR PROPRIETAIRE (user normal)
    // ════════════════════════════════════════════════
    if (!action || action === 'modify') {
      // Vérifier que c'est le propriétaire
      const estProprietaire = demande.utilisateur._id.toString() === currentUser._id.toString();
      if (!estProprietaire) {
        return NextResponse.json({ 
          message: "Vous ne pouvez modifier que vos propres demandes." 
        }, { status: 403 });
      }

      // Vérifier que demande est en brouillon ou en_attente
      if (demande.soumise && demande.statut !== 'en_attente') {
        return NextResponse.json({ 
          message: "Vous ne pouvez modifier que les demandes en attente." 
        }, { status: 400 });
      }

      const updates: any = {};
      if (prenom !== undefined) updates.prenom = prenom;
      if (nom !== undefined) updates.nom = nom;
      if (paroisse !== undefined) updates.paroisse = paroisse;
      if (secteur !== undefined) updates.secteur = secteur;
      if (anneeFinFormation !== undefined) updates.anneeFinFormation = anneeFinFormation;
      if (lieuDernierCamp !== undefined) updates.lieuDernierCamp = lieuDernierCamp;

      const demandeMaj = await DemandeAttestation.findByIdAndUpdate(
        demandeId,
        updates,
        { new: true, runValidators: true }
      ).populate("utilisateur", "prenom nom").populate("bulletinScanne", "nom url");

      return NextResponse.json({
        message: "Demande modifiée avec succès.",
        data: demandeMaj
      }, { status: 200 });
    }

    return NextResponse.json({ 
      message: "Action non reconnue" 
    }, { status: 400 });

  } catch (error) {
    console.error("Erreur PUT attestation:", error);
    return NextResponse.json({ 
      message: "Erreur lors du traitement de la demande." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE → Supprimer une demande
// ──────────────────────────────────────────────
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const demandeId = id;
    const demande = await DemandeAttestation.findById(demandeId);

    if (!demande) {
      return NextResponse.json({ 
        message: "Demande d'attestation non trouvée." 
      }, { status: 404 });
    }

    // Vérification accès: propriétaire ou admin
    const estProprietaire = demande.utilisateur.toString() === currentUser._id.toString();
    const estAdmin = currentUser.role?.nom === "Admin";
    
    if (!estProprietaire && !estAdmin) {
      return NextResponse.json({ 
        message: "Accès refusé" 
      }, { status: 403 });
    }

    await DemandeAttestation.findByIdAndDelete(demandeId);

    // 📊 Log d'audit
    await Action.create({
      admin: currentUser._id,
      action: "supprimer_attestation",
      module: "Attestation",
      donnees: { 
        demandeId: demande._id,
        statut: demande.statut,
        pour: `${demande.prenom} ${demande.nom}`
      }
    });

    return NextResponse.json({ 
      message: "Demande supprimée avec succès." 
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur DELETE attestation:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la suppression." 
    }, { status: 500 });
  }
}
