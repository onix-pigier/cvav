//  //app/api/attestations/route.ts

//  import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { voirPermission } from "@/utils/permission";
// import { getUserFromToken } from "@/utils/auth";
// import DemandeAttestation from "@/models/attestation";
// import action from "@/models/action";
// import Notification from "@/models/notification";
// import Role from "@/models/role";
// import Utilisateur from "@/models/utilisateur";
// import { sendEmail, emailTemplates } from "@/lib/email";

// // ──────────────────────────────────────────────
// // POST → Créer une demande d'attestation
// // ──────────────────────────────────────────────
// export const POST = async (request: Request) => {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
    
//     if (!currentUser || !voirPermission(currentUser, "creer_demande_attestation")) {
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
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

//     //  VALIDATION DES CHAMPS REQUIS
//     const champsRequis = {
//       prenom,
//       nom,
//       paroisse,
//       secteur,
//       anneeFinFormation,
//       lieuDernierCamp
//     };

//     const champsManquants = Object.entries(champsRequis)
//       .filter(([_, value]) => value === undefined || value === null || value === "")
//       .map(([key]) => key);

//     if (champsManquants.length > 0) {
//       return NextResponse.json({ 
//         message: "Champs requis manquants.", 
//         champs: champsManquants 
//       }, { status: 400 });
//     }

//     //  VALIDATION DE L'ANNÉE (doit être dans le passé)
//     const anneeActuelle = new Date().getFullYear();
//     if (anneeFinFormation >= anneeActuelle) {
//       return NextResponse.json({ 
//         message: "L'année de fin de formation doit être dans le passé." 
//       }, { status: 400 });
//     }

//     //  VÉRIFICATION ABAC : L'utilisateur ne peut créer que dans sa paroisse/secteur
//     if (currentUser.role.nom !== "Admin") {
//       if (paroisse !== currentUser.paroisse || secteur !== currentUser.secteur) {
//         return NextResponse.json({ 
//           message: "Vous ne pouvez créer des demandes que dans votre paroisse et secteur." 
//         }, { status: 403 });
//       }
//     }

//     //  CRÉATION DE LA DEMANDE
//     const nouvelleDemande = await DemandeAttestation.create({
//       utilisateur: currentUser._id,
//       prenom,
//       nom,
//       paroisse,
//       secteur,
//       anneeFinFormation,
//       lieuDernierCamp,
//       bulletinScanne: bulletinScanne || null,
//       statut: "en_attente"
//     });

//     //  LOG D'AUDIT
//     await action.create({
//       admin: currentUser._id,
//       action: "creer_demande_attestation",
//       module: "Attestation",
//       donnees: { 
//         demandeId: nouvelleDemande._id,
//         nom: `${prenom} ${nom}`,
//         paroisse,
//         secteur
//       }
//     });

//     //  NOTIFICATION POUR L'ADMIN - Nouvelle demande
//     const roleAdmin = await Role.findOne({ nom: "Admin" });
//     if (roleAdmin) {
//       const admins = await Utilisateur.find({ role: roleAdmin._id });
      
//       for (const admin of admins) {
//         await Notification.create({
//           utilisateur: admin._id,
//           titre: "Nouvelle demande d'attestation",
//           message: `${currentUser.prenom} ${currentUser.nom} a soumis une nouvelle demande d'attestation pour ${prenom} ${nom}`,
//           lien: `/admin/attestations/${nouvelleDemande._id}`,
//           type: "info"
//         });
//       }
//        for (const admin of admins) {
//   await sendEmail({
//     to: admin.email,
//     ...emailTemplates.newRequestAdmin({
//       type: 'attestaion', // ou 'attestation'
//       user: `${currentUser.prenom} ${currentUser.nom}`,
//       date: new Date().toLocaleDateString('fr-FR')
//     })
//   });
//       }
//     }

//     return NextResponse.json(
//       { 
//         message: "Demande d'attestation créée avec succès et administrateurs notifiés.",
//         data: nouvelleDemande 
//       }, 
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error("Erreur création demande attestation:", error);
//     return NextResponse.json({ 
//       message: "Erreur lors de la création de la demande." 
//     }, { status: 500 });
//   }
// }

// // ──────────────────────────────────────────────
// // GET → Lister les demandes d'attestation
// // ──────────────────────────────────────────────
// export async function GET(request: Request) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
    
//     if (!currentUser || !voirPermission(currentUser, "voir_demande_attestations")) {
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
//     }

//     //  CONSTRUCTION DU FILTRE ABAC
//     let filtre = {};
    
//     if (currentUser.role.nom === "Admin") {
//       // Admin voit toutes les demandes
//       filtre = {};
//     } else if (voirPermission(currentUser, "voir_les_demandes_attestation")) {
//       // Utilisateurs avec permission spécifique voient leur paroisse/secteur
//       filtre = { 
//         paroisse: currentUser.paroisse,
//         secteur: currentUser.secteur
//       };
//     } else {
//       // Utilisateurs normaux ne voient que leurs propres demandes
//       filtre = { utilisateur: currentUser._id };
//     }

//     const demandes = await DemandeAttestation.find(filtre)
//       .populate("utilisateur", "prenom nom email")
//       .populate("validePar", "prenom nom")
//       .populate("bulletinScanne", "nom url")
//       .populate("fichierAttestationPDF", "nom url")
//       .sort({ createdAt: -1 });

//     return NextResponse.json(demandes);

//   } catch (error) {
//     console.error("Erreur liste demandes attestation:", error);
//     return NextResponse.json({ 
//       message: "Erreur lors de la récupération des demandes." 
//     }, { status: 500 });
//   }
// }

// // ──────────────────────────────────────────────
// // PATCH → Valider/Rejeter une demande (Admin seulement)
// // ──────────────────────────────────────────────
// export async function PATCH(request: Request) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
    
//     if (!currentUser || !voirPermission(currentUser, "valider_demande_attestation")) {
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
//     }

//     const { id, statut, commentaireAdmin, numeroAttestation, fichierAttestationPDF } = await request.json();

//     if (!id || !statut) {
//       return NextResponse.json({ 
//         message: "ID et statut requis." 
//       }, { status: 400 });
//     }

//     if (!["valide", "rejete"].includes(statut)) {
//       return NextResponse.json({ 
//         message: "Statut invalide. Doit être 'valide' ou 'rejete'." 
//       }, { status: 400 });
//     }

//     const demande = await DemandeAttestation.findById(id).populate("utilisateur", "prenom nom email");
//     if (!demande) {
//       return NextResponse.json({ 
//         message: "Demande d'attestation non trouvée." 
//       }, { status: 404 });
//     }

//     //  VALIDATION: Pour une validation, le numéro d'attestation est requis
//     if (statut === "valide" && !numeroAttestation) {
//       return NextResponse.json({ 
//         message: "Le numéro d'attestation est requis pour valider une demande." 
//       }, { status: 400 });
//     }

//     //  MISE À JOUR AVEC VALIDATION
//     const updateData: any = {
//       statut,
//       validePar: currentUser._id,
//       dateValidation: new Date()
//     };

//     if (commentaireAdmin) {
//       updateData.commentaireAdmin = commentaireAdmin;
//     }

//     if (statut === "valide") {
//       updateData.numeroAttestation = numeroAttestation;
//       if (fichierAttestationPDF) {
//         updateData.fichierAttestationPDF = fichierAttestationPDF;
//       }
//     } else {
//       // Si rejetée, on efface les champs d'attestation
//       updateData.numeroAttestation = null;
//       updateData.fichierAttestationPDF = null;
//     }

//     const demandeMaj = await DemandeAttestation.findByIdAndUpdate(
//       id, 
//       updateData, 
//       { new: true, runValidators: true }
//     )
//     .populate("utilisateur", "prenom nom email")
//     .populate("validePar", "prenom nom")
//     .populate("fichierAttestationPDF", "nom url");

//     //  NOTIFICATION POUR L'UTILISATEUR - Réponse admin
//     await Notification.create({
//       utilisateur: demandeMaj.utilisateur._id,
//       titre: `Demande d'attestation ${statut === 'valide' ? 'approuvée' : 'rejetée'}`,
//       message: `Votre demande d'attestation pour ${demandeMaj.prenom} ${demandeMaj.nom} a été ${statut === 'valide' ? 'approuvée' : 'rejetée'}${statut === 'valide' ? ` - Numéro: ${numeroAttestation}` : ''}${commentaireAdmin ? `. Commentaire: ${commentaireAdmin}` : ''}`,
//       lien: `/mes-attestations/${demandeMaj._id}`,
//       type: statut === 'valide' ? "succes" : "erreur"
//     });

//     //  LOG D'AUDIT
//     await action.create({
//       admin: currentUser._id,
//       action: `${statut}_demande_attestation`,
//       module: "Attestation",
//       donnees: { 
//         demandeId: demandeMaj._id,
//         statut: statut,
//         numeroAttestation: numeroAttestation || null,
//         commentaire: commentaireAdmin || null
//       }
//     });

//     return NextResponse.json(
//       { 
//         message: `Demande ${statut === 'valide' ? 'validée' : 'rejetée'} avec succès. L'utilisateur a été notifié.`,
//         data: demandeMaj 
//       }, 
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Erreur validation demande attestation:", error);
//     return NextResponse.json({ 
//       message: "Erreur lors de la validation de la demande." 
//     }, { status: 500 });
//   }
// } 
// app/api/attestations/route.ts - VERSION COMPLÈTE CORRIGÉE
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
// POST → Créer une demande d'attestation (BROUILLON)
// ──────────────────────────────────────────────
export const POST = async (request: Request) => {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "creer_mes_demandes_attestations")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const {
      prenom,
      nom,
      paroisse,
      secteur,
      anneeFinFormation,
      lieuDernierCamp,
      bulletinScanne,
      soumise = false // ✅ Par défaut, c'est un brouillon
    } = await request.json();

    console.log('📝 Création demande attestation - Soumise:', soumise);

    //  VALIDATION DES CHAMPS REQUIS (si soumise)
    if (soumise) {
      const champsRequis = {
        prenom,
        nom,
        paroisse,
        secteur,
        anneeFinFormation,
        lieuDernierCamp
      };

      const champsManquants = Object.entries(champsRequis)
        .filter(([_, value]) => value === undefined || value === null || value === "")
        .map(([key]) => key);

      if (champsManquants.length > 0) {
        return NextResponse.json({ 
          message: "Champs requis manquants pour soumettre la demande.", 
          champs: champsManquants 
        }, { status: 400 });
      }

      //  VALIDATION DE L'ANNÉE
      const anneeActuelle = new Date().getFullYear();
      if (anneeFinFormation >= anneeActuelle) {
        return NextResponse.json({ 
          message: "L'année de fin de formation doit être dans le passé." 
        }, { status: 400 });
      }
    }

    //  VÉRIFICATION ABAC (uniquement si admin)
    if (!estAdmin(currentUser)) {
      if (paroisse !== currentUser.paroisse || secteur !== currentUser.secteur) {
        return NextResponse.json({ 
          message: "Vous ne pouvez créer des demandes que dans votre paroisse et secteur." 
        }, { status: 403 });
      }
    }

    //  CRÉATION DE LA DEMANDE
    const nouvelleDemande = await DemandeAttestation.create({
      utilisateur: currentUser._id,
      prenom,
      nom,
      paroisse,
      secteur,
      anneeFinFormation,
      lieuDernierCamp,
      bulletinScanne: bulletinScanne || null,
      soumise, // ✅ Important
      statut: "en_attente",
      dateSoumission: soumise ? new Date() : null
    });

    //  LOG D'AUDIT
    await action.create({
      admin: currentUser._id,
      action: soumise ? "soumettre_demande_attestation" : "creer_brouillon_attestation",
      module: "Attestation",
      donnees: { 
        demandeId: nouvelleDemande._id,
        nom: `${prenom} ${nom}`,
        paroisse,
        secteur,
        soumise
      }
    });

    // ✅ NOTIFICATION ADMIN (uniquement si soumise)
    if (soumise) {
      const roleAdmin = await Role.findOne({ nom: /^admin$/i });
      if (roleAdmin) {
        const admins = await Utilisateur.find({ role: roleAdmin._id, actif: true });
        
        for (const admin of admins) {
          await Notification.create({
            utilisateur: admin._id,
            titre: "Nouvelle demande d'attestation",
            message: `${currentUser.prenom} ${currentUser.nom} a soumis une demande d'attestation pour ${prenom} ${nom}`,
            lien: `/dashboard/admin/attestations/${nouvelleDemande._id}`,
            type: "info"
          });
        }

        // Email aux admins
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
            console.warn('⚠️ Erreur envoi email admin:', emailError);
          }
        }
      }
    }

    return NextResponse.json(
      { 
        message: soumise 
          ? "Demande d'attestation soumise avec succès. Les administrateurs ont été notifiés."
          : "Brouillon sauvegardé. Vous pourrez le soumettre plus tard.",
        data: nouvelleDemande 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("💥 Erreur création demande attestation:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la création de la demande." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// GET → Lister les demandes d'attestation
// ──────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "voir_mes_demandes_attestations")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    console.log('📋 GET attestations - User:', currentUser.email, '- Admin:', estAdmin(currentUser));

    //  CONSTRUCTION DU FILTRE ABAC
    let filtre: any = {};

    // Support du paramètre `view` : 'brouillons' | 'soumises'
    const urlObj = new URL(request.url);
    const view = urlObj.searchParams.get('view');

    if (estAdmin(currentUser)) {
      // Admin : par défaut voir les soumises. Si view fourni, respecter la demande.
      if (view === 'brouillons') {
        filtre = { soumise: false };
        console.log('👑 Admin: Voir toutes les demandes brouillons');
      } else if (view === 'soumises') {
        filtre = { soumise: true };
        console.log('👑 Admin: Voir toutes les demandes soumises');
      } else {
        filtre = { soumise: true };
        console.log('👑 Admin: Voir toutes les demandes soumises (par défaut)');
      }
    } else {
      // Utilisateurs non-admin voient leurs propres demandes. Optionnellement filtrées par view.
      filtre = { utilisateur: currentUser._id };
      if (view === 'brouillons') filtre.soumise = false;
      if (view === 'soumises') filtre.soumise = true;
      console.log('👤 User: Voir ses propres demandes', view || '(toutes)');
    }

    const demandes = await DemandeAttestation.find(filtre)
      .populate("utilisateur", "prenom nom email")
      .populate("validePar", "prenom nom")
      .populate("bulletinScanne", "nom url")
      .populate("fichierAttestationPDF", "nom url")
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ ${demandes.length} demandes trouvées`);

    return NextResponse.json(demandes);

  } catch (error) {
    console.error("💥 Erreur liste demandes attestation:", error);
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
    
    if (!currentUser || !estAdmin(currentUser)) {
      return NextResponse.json({ message: "Accès refusé. Admin requis." }, { status: 403 });
    }

    const { id, statut, commentaireAdmin, numeroAttestation, fichierAttestationPDF } = await request.json();

    console.log('🔄 PATCH attestation - ID:', id, '- Statut:', statut);

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

    const demande = await DemandeAttestation.findById(id).populate("utilisateur", "prenom nom email");
    if (!demande) {
      return NextResponse.json({ 
        message: "Demande d'attestation non trouvée." 
      }, { status: 404 });
    }

    // ✅ Vérifier que la demande est soumise
    if (!demande.soumise) {
      return NextResponse.json({ 
        message: "Cette demande n'a pas été soumise et ne peut pas être validée." 
      }, { status: 400 });
    }

    //  VALIDATION: Numéro requis pour validation
    if (statut === "valide" && !numeroAttestation) {
      return NextResponse.json({ 
        message: "Le numéro d'attestation est requis pour valider une demande." 
      }, { status: 400 });
    }

    //  MISE À JOUR
    const updateData: any = {
      statut,
      validePar: currentUser._id,
      dateValidation: new Date()
    };

    if (commentaireAdmin) {
      updateData.commentaireAdmin = commentaireAdmin;
    }

    if (statut === "valide") {
      updateData.numeroAttestation = numeroAttestation;
      if (fichierAttestationPDF) {
        updateData.fichierAttestationPDF = fichierAttestationPDF;
      }
    } else {
      updateData.numeroAttestation = null;
      updateData.fichierAttestationPDF = null;
    }

    const demandeMaj = await DemandeAttestation.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    )
    .populate("utilisateur", "prenom nom email")
    .populate("validePar", "prenom nom")
    .populate("fichierAttestationPDF", "nom url");

    // ✅ NOTIFICATION UTILISATEUR
    await Notification.create({
      utilisateur: demandeMaj.utilisateur._id,
      titre: `Demande d'attestation ${statut === 'valide' ? 'approuvée' : 'rejetée'}`,
      message: `Votre demande d'attestation pour ${demandeMaj.prenom} ${demandeMaj.nom} a été ${statut === 'valide' ? 'approuvée' : 'rejetée'}${statut === 'valide' ? ` - Numéro: ${numeroAttestation}` : ''}${commentaireAdmin ? `. Commentaire: ${commentaireAdmin}` : ''}`,
      lien: `/dashboard/attestations/${demandeMaj._id}`,
      type: statut === 'valide' ? "succes" : "erreur"
    });

    //  LOG D'AUDIT
    await action.create({
      admin: currentUser._id,
      action: `${statut}_demande_attestation`,
      module: "Attestation",
      donnees: { 
        demandeId: demandeMaj._id,
        statut: statut,
        numeroAttestation: numeroAttestation || null,
        commentaire: commentaireAdmin || null
      }
    });

    console.log('✅ Attestation mise à jour et notification envoyée');

    return NextResponse.json(
      { 
        message: `Demande ${statut === 'valide' ? 'validée' : 'rejetée'} avec succès. L'utilisateur a été notifié.`,
        data: demandeMaj 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("💥 Erreur validation demande attestation:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la validation de la demande." 
    }, { status: 500 });
  }
}