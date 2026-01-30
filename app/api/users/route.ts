//app/api/users/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Utilisateur from "@/models/utilisateur";
import LogAction from "@/models/action";
import { getUserFromToken } from "@/utils/auth";
import { emailTemplates, sendEmail } from "@/lib/email";
import { randomBytes } from "crypto";
import mongoose from "mongoose";

// ──────────────────────────────────────────────
// POST → Créer un utilisateur (Admin seulement)
// ──────────────────────────────────────────────

export const POST = async (request: Request) => {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    console.log('=== DEBUG USER ROLE POST ===');
    console.log('User:', currentUser?.email);
    console.log('Role object:', currentUser?.role);
    console.log('Role nom:', currentUser?.role?.nom);
    console.log('=======================');
    
    if (!currentUser || currentUser.role.nom?.toLowerCase() !== "admin") {
      console.log(' Accès refusé POST - Rôle:', currentUser?.role?.nom);
      return NextResponse.json({ message: "Accès refusé. Admin requis." }, { status: 403 });
    }

    const { prenom, nom, email, motDePasse, roleId, telephone, paroisse, secteur } = await request.json();

    //  CORRECTION : motDePasse n'est plus requis car généré automatiquement
    const champsRequis = { 
      prenom, 
      nom, 
      email, 
      // motDePasse, // ← RETIRÉ des champs requis
      roleId, 
      paroisse, 
      secteur 
    };
    
    const champsManquants = Object.entries(champsRequis)
      .filter(([key, value]) => {
        const estManquant = !value || value.toString().trim() === '';
        if (estManquant) {
          console.log(` Champ manquant: ${key} =`, value);
        }
        return estManquant;
      })
      .map(([key]) => key);

    console.log(' CHAMPS MANQUANTS TROUVÉS:', champsManquants);

    if (champsManquants.length > 0) {
      return NextResponse.json({ 
        message: "Champs requis manquants.", 
        champs: champsManquants 
      }, { status: 400 });
    }

    console.log(' TOUS LES CHAMPS SONT PRÉSENTS');

    // VÉRIFICATION EMAIL EXISTANT
    const userExiste = await Utilisateur.findOne({ email });
    if (userExiste) {
      console.log(' Email déjà utilisé:', email);
      return NextResponse.json({ message: "Email déjà utilisé." }, { status: 400 });
    }
    
    //  GÉNÉRATION AUTOMATIQUE DU MOT DE PASSE
    const motDePasseTemporaire = randomBytes(8).toString('hex');
    console.log(' Mot de passe temporaire généré:', motDePasseTemporaire);

    // CRÉATION SÉCURISÉE
    const user = await Utilisateur.create({
      prenom,
      nom,
      email,
      motDePasse: motDePasseTemporaire, // ← Toujours utilisé mais généré auto
      role: roleId,
      telephone,
      paroisse,
      secteur,
      creerPar: currentUser._id,
      doitChangerMotDePasse: true // ← FORCER le changement au 1er login
    });

    console.log(' Utilisateur créé en base:', user.email);

    // Email de bienvenue avec le mot de passe temporaire
    try {
      await sendEmail({
        to: user.email,
        ...emailTemplates.welcomeUser({
          prenom: user.prenom,
          email: user.email,
          motDePasseTemporaire: motDePasseTemporaire
        })
      });
      console.log('📧 Email de bienvenue envoyé');
    } catch (emailError) {
      console.warn('⚠️ Erreur envoi email:', emailError);
      // On continue même si l'email échoue
    }

    // log action
    await LogAction.create({
      admin: currentUser._id,
      action: "creer_tout_utilisateur",
      module: "Utilisateur",
      donnees: { 
        userId: user._id, 
        email: user.email, 
        paroisse: user.paroisse, 
        secteur: user.secteur 
      }
    });

    console.log(' Log d audit créé');

    return NextResponse.json(
      { 
        message: "Utilisateur créé avec succès.",
        data: { 
          _id: user._id, 
          prenom: user.prenom, 
          nom: user.nom, 
          email: user.email,
          paroisse: user.paroisse,
          secteur: user.secteur
        }
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error(" Erreur création utilisateur:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la création." 
    }, { status: 500 });
  }
};
// ──────────────────────────────────────────────
// GET → Lister tous les utilisateurs avec pagination
// ──────────────────────────────────────────────
// export async function GET(request: Request) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
    
//     if (!currentUser || currentUser.role.nom?.toLowerCase() !== "admin") {
//       console.log(' Accès refusé GET - Rôle:', currentUser?.role?.nom);
//       return NextResponse.json({ message: "Accès refusé. Admin requis." }, { status: 403 });
//     }

//     // RÉCUPÉRATION DES PARAMÈTRES DE PAGINATION
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const search = searchParams.get('search') || '';

//     // CALCUL PAGINATION
//     const skip = (page - 1) * limit;

//     // FILTRE DE RECHERCHE (optionnel)
//     const filter: any = {};
//     if (search) {
//       filter.$or = [
//         { prenom: { $regex: search, $options: 'i' } },
//         { nom: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // REQUÊTE AVEC PAGINATION
//     const [utilisateurs, total] = await Promise.all([
//       Utilisateur.find(filter)
//         .populate("role")
//         .select("-motDePasse")
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit),
      
//       Utilisateur.countDocuments(filter)
//     ]);

//     // RÉPONSE AVEC MÉTADATAS
//     return NextResponse.json({
//       data: utilisateurs,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//         hasNext: page < Math.ceil(total / limit),
//         hasPrev: page > 1
//       }
//     });

//   } catch (error) {
//     console.error("Erreur liste utilisateurs:", error);
//     return NextResponse.json({ 
//       message: "Erreur serveur." 
//     }, { status: 500 });
//   }
// }

// app/api/users/route.ts - PARTIE GET CORRIGÉE
// Remplacer uniquement la fonction GET

export async function GET(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    console.log('📋 GET /api/users - Début');
    
    if (!currentUser || currentUser.role.nom?.toLowerCase() !== "admin") {
      console.log('❌ Accès refusé GET - Rôle:', currentUser?.role?.nom);
      return NextResponse.json({ message: "Accès refusé. Admin requis." }, { status: 403 });
    }

    // RÉCUPÉRATION DES PARAMÈTRES DE PAGINATION
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') || '';

    console.log('🔍 Paramètres:', { page, limit, search, roleFilter });

    // CALCUL PAGINATION
    const skip = (page - 1) * limit;

    // FILTRE DE RECHERCHE
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { prenom: { $regex: search, $options: 'i' } },
        { nom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // FILTRE PAR RÔLE
    if (roleFilter) {
      // Chercher l'ID du rôle par son nom
      const Role = mongoose.model('Role');
      const role = await Role.findOne({ nom: new RegExp(`^${roleFilter}$`, 'i') });
      if (role) {
        filter.role = role._id;
      }
    }

    console.log('🔎 Filtre appliqué:', JSON.stringify(filter));

    // REQUÊTE AVEC PAGINATION
    const [utilisateurs, total] = await Promise.all([
      Utilisateur.find(filter)
        .populate("role", "nom permissions")
        .select("-motDePasse")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // ← Important pour avoir les vraies données
      
      Utilisateur.countDocuments(filter)
    ]);

    console.log(`✅ Trouvé ${utilisateurs.length} utilisateurs sur ${total} total`);
    
    // Ajouter le champ estActif pour compatibilité frontend
    const utilisateursAvecStatut = utilisateurs.map(u => ({
      ...u,
      estActif: u.actif // Mapper actif → estActif pour le frontend
    }));

    // RÉPONSE AVEC MÉTADATAS
    return NextResponse.json({
      data: utilisateursAvecStatut,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("💥 Erreur liste utilisateurs:", error);
    return NextResponse.json({ 
      message: "Erreur serveur." 
    }, { status: 500 });
  }
}