import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import Ceremonie from "@/models/ceremonie";
import Notification from "@/models/notification";
import Action from "@/models/action";
import Utilisateur from "@/models/utilisateur";
import { sendEmail } from "@/lib/email";

// ──────────────────────────────────────────────
// GET → Récupérer une cérémonie spécifique
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
    const ceremonyId = id;
    const ceremony = await Ceremonie.findById(ceremonyId)
      .populate("utilisateur", "prenom nom email secteur paroisse")
      .populate("courrierScanne", "nom url type taille _id");

    if (!ceremony) {
      return NextResponse.json({ 
        message: "Cérémonie non trouvée." 
      }, { status: 404 });
    }

    // Vérification accès: propriétaire ou admin
    const estProprietaire = ceremony.utilisateur._id.toString() === currentUser._id.toString();
    const estAdmin = currentUser.role?.nom === "Admin";
    
    if (!estProprietaire && !estAdmin) {
      return NextResponse.json({ 
        message: "Accès refusé à cette cérémonie." 
      }, { status: 403 });
    }

    return NextResponse.json(ceremony);

  } catch (error) {
    console.error("Erreur GET cérémonie:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PUT → Modifier ou valider/rejeter une cérémonie
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
    const ceremonyId = id;
    const ceremony = await Ceremonie.findById(ceremonyId)
      .populate("utilisateur");

    if (!ceremony) {
      return NextResponse.json({ 
        message: "Cérémonie non trouvée." 
      }, { status: 404 });
    }

    const body = await request.json();
    const { action, statut, motifRejet, Secteur, paroisse, dateCeremonie, lieuxCeremonie, foulards } = body;

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

      // Vérifier que la cérémonie est soumise et en attente
      if (!ceremony.soumise || ceremony.statut !== 'en_attente') {
        return NextResponse.json({ 
          message: "Cette cérémonie ne peut pas être validée" 
        }, { status: 400 });
      }

      // Mise à jour
      ceremony.statut = 'valide';
      ceremony.validePar = currentUser._id;
      ceremony.dateValidation = new Date();
      await ceremony.save();

      // 📧 Email à l'utilisateur
      const user = await Utilisateur.findById(ceremony.utilisateur._id);
      if (user?.email) {
        try {
          await sendEmail({
            to: user.email,
            subject: "✅ Cérémonie validée",
            html: `
              <h2>Votre cérémonie a été validée!</h2>
              <p>Secteur: ${ceremony.Secteur}</p>
              <p>Paroisse: ${ceremony.paroisse}</p>
              <p>Date: ${new Date(ceremony.dateCeremonie).toLocaleDateString('fr-FR')}</p>
              <p>Lieu: ${ceremony.lieuxCeremonie}</p>
              <p>Vous pouvez consulter les détails depuis votre dashboard.</p>
            `
          });
        } catch (emailError) {
          console.error("Erreur envoi email:", emailError);
        }
      }

      // 🔔 Notification utilisateur
      await Notification.create({
        utilisateur: ceremony.utilisateur._id,
        titre: "✅ Cérémonie validée",
        message: `Votre cérémonie du ${new Date(ceremony.dateCeremonie).toLocaleDateString('fr-FR')} a été validée.`,
        lien: `/dashboard/ceremonies/${ceremonyId}`,
        type: "succes"
      });

      // 📊 Log d'audit
      await Action.create({
        admin: currentUser._id,
        action: "valider_ceremonie",
        module: "Ceremonie",
        donnees: { 
          ceremonyId: ceremony._id,
          Secteur: ceremony.Secteur,
          paroisse: ceremony.paroisse,
          date: ceremony.dateCeremonie
        }
      });

      return NextResponse.json({
        message: "Cérémonie validée avec succès",
        data: ceremony
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

      // Vérifier que la cérémonie est soumise et en attente
      if (!ceremony.soumise || ceremony.statut !== 'en_attente') {
        return NextResponse.json({ 
          message: "Cette cérémonie ne peut pas être rejetée" 
        }, { status: 400 });
      }

      // Vérifier que motif est fourni
      if (!motifRejet || !motifRejet.trim()) {
        return NextResponse.json({ 
          message: "Le motif du rejet est requis" 
        }, { status: 400 });
      }

      // Mise à jour
      ceremony.statut = 'rejete';
      ceremony.commentaireAdmin = motifRejet.trim();
      ceremony.validePar = currentUser._id;
      ceremony.dateValidation = new Date();
      await ceremony.save();

      // 📧 Email à l'utilisateur
      const user = await Utilisateur.findById(ceremony.utilisateur._id);
      if (user?.email) {
        try {
          await sendEmail({
            to: user.email,
            subject: "❌ Cérémonie rejetée",
            html: `
              <h2>Votre demande de cérémonie a été rejetée</h2>
              <p>Secteur: ${ceremony.Secteur}</p>
              <p>Paroisse: ${ceremony.paroisse}</p>
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
        utilisateur: ceremony.utilisateur._id,
        titre: "❌ Cérémonie rejetée",
        message: `Motif: ${motifRejet}`,
        lien: `/dashboard/ceremonies/${ceremonyId}`,
        type: "erreur"
      });

      // 📊 Log d'audit
      await Action.create({
        admin: currentUser._id,
        action: "rejeter_ceremonie",
        module: "Ceremonie",
        donnees: { 
          ceremonyId: ceremony._id,
          motifRejet,
          Secteur: ceremony.Secteur
        }
      });

      return NextResponse.json({
        message: "Cérémonie rejetée avec succès",
        data: ceremony
      }, { status: 200 });
    }

    // ════════════════════════════════════════════════
    // 🟡 ACTION 3: MODIFICATION PAR PROPRIETAIRE
    // ════════════════════════════════════════════════
    if (!action || action === 'modify') {
      // Vérifier que c'est le propriétaire
      const estProprietaire = ceremony.utilisateur._id.toString() === currentUser._id.toString();
      if (!estProprietaire) {
        return NextResponse.json({ 
          message: "Vous ne pouvez modifier que vos propres demandes." 
        }, { status: 403 });
      }

      // Vérifier que demande est en brouillon ou en_attente
      if (ceremony.soumise && ceremony.statut !== 'en_attente') {
        return NextResponse.json({ 
          message: "Vous ne pouvez modifier que les demandes en attente." 
        }, { status: 400 });
      }

      const updates: any = {};
      if (Secteur !== undefined) updates.Secteur = Secteur;
      if (paroisse !== undefined) updates.paroisse = paroisse;
      if (dateCeremonie !== undefined) updates.dateCeremonie = dateCeremonie;
      if (lieuxCeremonie !== undefined) updates.lieuxCeremonie = lieuxCeremonie;
      if (foulards !== undefined) updates.foulards = foulards;

      const ceremonyMaj = await Ceremonie.findByIdAndUpdate(
        ceremonyId,
        updates,
        { new: true, runValidators: true }
      ).populate("utilisateur", "prenom nom").populate("courrierScanne", "nom url");

      return NextResponse.json({
        message: "Cérémonie modifiée avec succès.",
        data: ceremonyMaj
      }, { status: 200 });
    }

    return NextResponse.json({ 
      message: "Action non reconnue" 
    }, { status: 400 });

  } catch (error) {
    console.error("Erreur PUT cérémonie:", error);
    return NextResponse.json({ 
      message: "Erreur lors du traitement." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE → Supprimer une cérémonie
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
    const ceremonyId = id;
    const ceremony = await Ceremonie.findById(ceremonyId);

    if (!ceremony) {
      return NextResponse.json({ 
        message: "Cérémonie non trouvée." 
      }, { status: 404 });
    }

    // Vérification accès: propriétaire ou admin
    const estProprietaire = ceremony.utilisateur.toString() === currentUser._id.toString();
    const estAdmin = currentUser.role?.nom === "Admin";
    
    if (!estProprietaire && !estAdmin) {
      return NextResponse.json({ 
        message: "Accès refusé" 
      }, { status: 403 });
    }

    await Ceremonie.findByIdAndDelete(ceremonyId);

    // 📊 Log d'audit
    await Action.create({
      admin: currentUser._id,
      action: "supprimer_ceremonie",
      module: "Ceremonie",
      donnees: { 
        ceremonyId: ceremony._id,
        statut: ceremony.statut,
        Secteur: ceremony.Secteur
      }
    });

    return NextResponse.json({ 
      message: "Cérémonie supprimée avec succès." 
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur DELETE cérémonie:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la suppression." 
    }, { status: 500 });
  }
}
