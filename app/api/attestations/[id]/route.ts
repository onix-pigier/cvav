// //app/api/attestations/[id]/route.ts

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { voirPermission } from "@/utils/permission";
// import { getUserFromToken } from "@/utils/auth";
// import DemandeAttestation from "@/models/attestation";
// import action from "@/models/action";

// // ──────────────────────────────────────────────
// // GET → Récupérer une demande spécifique
// // ──────────────────────────────────────────────
// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
    
//     if (!currentUser || !voirPermission(currentUser, "voir_demande_attestations")) {
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
//     }

//     const demandeId = params.id;
//     const demande = await DemandeAttestation.findById(demandeId)
//       .populate("utilisateur", "prenom nom email secteur paroisse")
//       .populate("validePar", "prenom nom")
//       .populate("bulletinScanne", "nom url type taille")
//       .populate("fichierAttestationPDF", "nom url type taille");

//     if (!demande) {
//       return NextResponse.json({ 
//         message: "Demande d'attestation non trouvée." 
//       }, { status: 404 });
//     }

//     // ✅ VÉRIFICATION ABAC
//     if (currentUser.role.nom !== "Admin") {
//       const estProprietaire = demande.utilisateur._id.toString() === currentUser._id.toString();
//       const memeParoisse = demande.paroisse === currentUser.paroisse;
//       const memeSecteur = demande.secteur === currentUser.secteur;
      
//       if (!estProprietaire && !(memeParoisse && memeSecteur)) {
//         return NextResponse.json({ 
//           message: "Accès refusé à cette demande." 
//         }, { status: 403 });
//       }
//     }

//     return NextResponse.json(demande);

//   } catch (error) {
//     console.error("Erreur recherche demande attestation:", error);
//     return NextResponse.json({ 
//       message: "Erreur lors de la recherche de la demande." 
//     }, { status: 500 });
//   }
// }

// // ──────────────────────────────────────────────
// // PUT → Modifier une demande
// // ──────────────────────────────────────────────
// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
    
//     if (!currentUser || !voirPermission(currentUser, "modifier_demande_attestation")) {
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
//     }

//     const demandeId = params.id;
//     const demande = await DemandeAttestation.findById(demandeId);

//     if (!demande) {
//       return NextResponse.json({ 
//         message: "Demande d'attestation non trouvée." 
//       }, { status: 404 });
//     }

//     // ✅ VÉRIFICATION ABAC : Seul le propriétaire peut modifier (et seulement si en attente)
//     const estProprietaire = demande.utilisateur.toString() === currentUser._id.toString();
    
//     if (!estProprietaire) {
//       return NextResponse.json({ 
//         message: "Vous ne pouvez modifier que vos propres demandes." 
//       }, { status: 403 });
//     }

//     if (demande.statut !== "en_attente") {
//       return NextResponse.json({ 
//         message: "Vous ne pouvez modifier que les demandes en attente." 
//       }, { status: 400 });
//     }

//     const {
//       prenom,
//       nom,
//       paroisse,
//       secteur,
//       anneeFinFormation,
//       lieuDernierCamp,
//       bulletinScanne
//     } = await request.json();

//     // ✅ VALIDATION ABAC : L'utilisateur ne peut modifier que vers sa paroisse/secteur
//     if (currentUser.role.nom !== "Admin") {
//       if ((paroisse && paroisse !== currentUser.paroisse) || 
//           (secteur && secteur !== currentUser.secteur)) {
//         return NextResponse.json({ 
//           message: "Vous ne pouvez créer des demandes que dans votre paroisse et secteur." 
//         }, { status: 403 });
//       }
//     }

//     // ✅ VALIDATION DE L'ANNÉE
//     if (anneeFinFormation) {
//       const anneeActuelle = new Date().getFullYear();
//       if (anneeFinFormation >= anneeActuelle) {
//         return NextResponse.json({ 
//           message: "L'année de fin de formation doit être dans le passé." 
//         }, { status: 400 });
//       }
//     }

//     // ✅ MISE À JOUR
//     const updates: any = {};
//     if (prenom) updates.prenom = prenom;
//     if (nom) updates.nom = nom;
//     if (paroisse) updates.paroisse = paroisse;
//     if (secteur) updates.secteur = secteur;
//     if (anneeFinFormation) updates.anneeFinFormation = anneeFinFormation;
//     if (lieuDernierCamp) updates.lieuDernierCamp = lieuDernierCamp;
//     if (bulletinScanne !== undefined) updates.bulletinScanne = bulletinScanne;

//     const demandeMaj = await DemandeAttestation.findByIdAndUpdate(
//       demandeId,
//       updates,
//       { new: true, runValidators: true }
//     )
//     .populate("utilisateur", "prenom nom email")
//     .populate("bulletinScanne", "nom url");

//     // ✅ LOG D'AUDIT
//     await action.create({
//       admin: currentUser._id,
//       action: "modifier_demande_attestation",
//       module: "Attestation",
//       donnees: { 
//         demandeId: demandeMaj._id,
//         modifications: Object.keys(updates)
//       }
//     });

//     return NextResponse.json(
//       { 
//         message: "Demande modifiée avec succès.",
//         data: demandeMaj 
//       }, 
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Erreur modification demande attestation:", error);
//     return NextResponse.json({ 
//       message: "Erreur lors de la modification de la demande." 
//     }, { status: 500 });
//   }
// }

// // ──────────────────────────────────────────────
// // DELETE → Supprimer une demande
// // ──────────────────────────────────────────────
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
    
//     if (!currentUser || !voirPermission(currentUser, "supprimer_demande_attestation")) {
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
//     }

//     const demandeId = params.id;
//     const demande = await DemandeAttestation.findById(demandeId);

//     if (!demande) {
//       return NextResponse.json({ 
//         message: "Demande d'attestation non trouvée." 
//       }, { status: 404 });
//     }

//     // ✅ VÉRIFICATION ABAC
//     const estProprietaire = demande.utilisateur.toString() === currentUser._id.toString();
//     const estAdmin = currentUser.role.nom === "Admin";
    
//     if (!estProprietaire && !estAdmin) {
//       return NextResponse.json({ 
//         message: "Vous ne pouvez supprimer que vos propres demandes." 
//       }, { status: 403 });
//     }

//     // ✅ Les non-admins ne peuvent supprimer que les demandes en attente
//     if (!estAdmin && demande.statut !== "en_attente") {
//       return NextResponse.json({ 
//         message: "Vous ne pouvez supprimer que les demandes en attente." 
//       }, { status: 400 });
//     }

//     await DemandeAttestation.findByIdAndDelete(demandeId);

//     // ✅ LOG D'AUDIT
//     await action.create({
//       admin: currentUser._id,
//       action: "supprimer_demande_attestation",
//       module: "Attestation",
//       donnees: { 
//         demandeId: demande._id,
//         statut: demande.statut,
//         nom: `${demande.prenom} ${demande.nom}`
//       }
//     });

//     return NextResponse.json({ 
//       message: "Demande supprimée avec succès." 
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Erreur suppression demande attestation:", error);
//     return NextResponse.json({ 
//       message: "Erreur lors de la suppression de la demande." 
//     }, { status: 500 });
//   }
// }

// app/api/attestations/[id]/route.ts - VERSION COMPLÈTE CORRIGÉE
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission, estAdmin } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import DemandeAttestation from "@/models/attestation";
import action from "@/models/action";
import Notification from "@/models/notification";
import Role from "@/models/role";
import Utilisateur from "@/models/utilisateur";
import { sendEmail, emailTemplates } from "@/lib/email";

// ──────────────────────────────────────────────
// GET → Récupérer une demande spécifique
// ──────────────────────────────────────────────
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "voir_mes_demandes_attestations")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const params = await context.params;
    const demandeId = params.id;

    const demande = await DemandeAttestation.findById(demandeId)
      .populate("utilisateur", "prenom nom email secteur paroisse")
      .populate("validePar", "prenom nom")
      .populate("bulletinScanne", "nom url type taille")
      .populate("fichierAttestationPDF", "nom url type taille");

    if (!demande) {
      return NextResponse.json({ 
        message: "Demande d'attestation non trouvée." 
      }, { status: 404 });
    }

    // ✅ VÉRIFICATION ABAC
    const estProprietaire = demande.utilisateur._id.toString() === currentUser._id.toString();
    const estAdminUser = estAdmin(currentUser);
    
    if (!estAdminUser && !estProprietaire) {
      return NextResponse.json({ 
        message: "Accès refusé à cette demande." 
      }, { status: 403 });
    }

    // ✅ Si admin, vérifier que la demande est soumise
    if (estAdminUser && !estProprietaire && !demande.soumise) {
      return NextResponse.json({ 
        message: "Cette demande n'a pas encore été soumise." 
      }, { status: 404 });
    }

    return NextResponse.json(demande);

  } catch (error) {
    console.error("💥 Erreur recherche demande attestation:", error);
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    const params = await context.params;
    const demandeId = params.id;

    const demande = await DemandeAttestation.findById(demandeId);

    if (!demande) {
      return NextResponse.json({ 
        message: "Demande d'attestation non trouvée." 
      }, { status: 404 });
    }

    const estProprietaire = demande.utilisateur.toString() === currentUser._id.toString();
    const estAdminUser = estAdmin(currentUser);

    console.log('✏️ PUT attestation - User:', currentUser.email, '- Proprio:', estProprietaire, '- Admin:', estAdminUser);
    console.log('📊 Demande - Soumise:', demande.soumise, '- Statut:', demande.statut);

    // ✅ RÈGLES DE MODIFICATION
    if (!estAdminUser) {
      // Utilisateur normal : peut modifier uniquement ses demandes NON soumises
      if (!estProprietaire) {
        return NextResponse.json({ 
          message: "Vous ne pouvez modifier que vos propres demandes." 
        }, { status: 403 });
      }

      if (demande.soumise) {
        return NextResponse.json({ 
          message: "Une demande soumise ne peut plus être modifiée. Contactez un administrateur." 
        }, { status: 403 });
      }
    } else {
      // Admin : peut modifier UNIQUEMENT les demandes soumises
      if (!demande.soumise) {
        return NextResponse.json({ 
          message: "Cette demande n'a pas été soumise et ne peut pas être modifiée." 
        }, { status: 403 });
      }
    }

    const {
      prenom,
      nom,
      paroisse,
      secteur,
      anneeFinFormation,
      lieuDernierCamp,
      bulletinScanne,
      soumise // ✅ Permettre soumission via PUT
    } = await request.json();

    // ✅ VALIDATION ABAC (si pas admin)
    if (!estAdminUser) {
      if ((paroisse && paroisse !== currentUser.paroisse) || 
          (secteur && secteur !== currentUser.secteur)) {
        return NextResponse.json({ 
          message: "Vous ne pouvez créer des demandes que dans votre paroisse et secteur." 
        }, { status: 403 });
      }
    }

    // ✅ VALIDATION DE L'ANNÉE
    if (anneeFinFormation) {
      const anneeActuelle = new Date().getFullYear();
      if (anneeFinFormation >= anneeActuelle) {
        return NextResponse.json({ 
          message: "L'année de fin de formation doit être dans le passé." 
        }, { status: 400 });
      }
    }

    // ✅ VALIDATION si soumission
    if (soumise && !demande.soumise) {
      const champsRequis = {
        prenom: prenom || demande.prenom,
        nom: nom || demande.nom,
        paroisse: paroisse || demande.paroisse,
        secteur: secteur || demande.secteur,
        anneeFinFormation: anneeFinFormation || demande.anneeFinFormation,
        lieuDernierCamp: lieuDernierCamp || demande.lieuDernierCamp
      };

      const champsManquants = Object.entries(champsRequis)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (champsManquants.length > 0) {
        return NextResponse.json({ 
          message: "Champs requis manquants pour soumettre.", 
          champs: champsManquants 
        }, { status: 400 });
      }
    }

    // ✅ MISE À JOUR
    const updates: any = {};
    if (prenom) updates.prenom = prenom;
    if (nom) updates.nom = nom;
    if (paroisse) updates.paroisse = paroisse;
    if (secteur) updates.secteur = secteur;
    if (anneeFinFormation) updates.anneeFinFormation = anneeFinFormation;
    if (lieuDernierCamp) updates.lieuDernierCamp = lieuDernierCamp;
    if (bulletinScanne !== undefined) updates.bulletinScanne = bulletinScanne;

    // ✅ Gérer la soumission
    if (soumise && !demande.soumise) {
      updates.soumise = true;
      updates.dateSoumission = new Date();

      // Notifier les admins
      const roleAdmin = await Role.findOne({ nom: /^admin$/i });
      if (roleAdmin) {
        const admins = await Utilisateur.find({ role: roleAdmin._id, actif: true });
        
        for (const admin of admins) {
          await Notification.create({
            utilisateur: admin._id,
            titre: "Nouvelle demande d'attestation soumise",
            message: `${currentUser.prenom} ${currentUser.nom} a soumis une demande d'attestation`,
            lien: `/dashboard/admin/attestations/${demandeId}`,
            type: "info"
          });
        }

        // Email
        for (const admin of admins) {
          try {
            await sendEmail({
              to: admin.email,
              ...emailTemplates.newRequestAdmin({
                type: 'attestation',
                user: `${currentUser.prenom} ${currentUser.nom}`,
                date: new Date().toLocaleDateString('fr-FR')
              })
            });
          } catch (emailError) {
            console.warn('⚠️ Erreur envoi email:', emailError);
          }
        }
      }
    }

    const demandeMaj = await DemandeAttestation.findByIdAndUpdate(
      demandeId,
      updates,
      { new: true, runValidators: true }
    )
    .populate("utilisateur", "prenom nom email")
    .populate("bulletinScanne", "nom url");

    // ✅ LOG D'AUDIT
    await action.create({
      admin: currentUser._id,
      action: soumise && !demande.soumise ? "soumettre_demande_attestation" : "modifier_demande_attestation",
      module: "Attestation",
      donnees: { 
        demandeId: demandeMaj._id,
        modifications: Object.keys(updates),
        parAdmin: estAdminUser
      }
    });

    console.log('✅ Attestation mise à jour');

    return NextResponse.json(
      { 
        message: soumise && !demande.soumise 
          ? "Demande soumise avec succès. Les administrateurs ont été notifiés."
          : "Demande modifiée avec succès.",
        data: demandeMaj 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("💥 Erreur modification demande attestation:", error);
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    const params = await context.params;
    const demandeId = params.id;

    const demande = await DemandeAttestation.findById(demandeId);

    if (!demande) {
      return NextResponse.json({ 
        message: "Demande d'attestation non trouvée." 
      }, { status: 404 });
    }

    const estProprietaire = demande.utilisateur.toString() === currentUser._id.toString();
    const estAdminUser = estAdmin(currentUser);
    
    // ✅ RÈGLES DE SUPPRESSION
    if (!estProprietaire && !estAdminUser) {
      return NextResponse.json({ 
        message: "Vous ne pouvez supprimer que vos propres demandes." 
      }, { status: 403 });
    }

    // ✅ Utilisateurs ne peuvent supprimer que les demandes NON soumises
    if (!estAdminUser && demande.soumise) {
      return NextResponse.json({ 
        message: "Vous ne pouvez supprimer que vos brouillons. Cette demande a été soumise." 
      }, { status: 400 });
    }

    await DemandeAttestation.findByIdAndDelete(demandeId);

    // ✅ LOG D'AUDIT
    await action.create({
      admin: currentUser._id,
      action: "supprimer_demande_attestation",
      module: "Attestation",
      donnees: { 
        demandeId: demande._id,
        statut: demande.statut,
        soumise: demande.soumise,
        nom: `${demande.prenom} ${demande.nom}`,
        parAdmin: estAdminUser
      }
    });

    console.log('🗑️ Attestation supprimée');

    return NextResponse.json({ 
      message: "Demande supprimée avec succès." 
    }, { status: 200 });

  } catch (error) {
    console.error("💥 Erreur suppression demande attestation:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la suppression de la demande." 
    }, { status: 500 });
  }
}