// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Utilisateur from "@/backend/models/utilisateur";
// import actionModel from "@/backend/models/action";
// import { voirPermission } from "@/middleware/permission";
// import { getUserFromToken } from "@/backend/utils/auth"; // fonction JWT/session

// // ──────────────────────────────────────────────
// // POST → créer un utilisateur
// // ──────────────────────────────────────────────
// export const POST = async (request: Request) => {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
//     if (!currentUser || !voirPermission(currentUser, "creer_utilisateur")) {
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
//     }

//     const { prenom, nom, email, motDePasse, roleId, telephone, paroisse, secteur  } = await request.json();

//     if (!prenom || !nom || !email || !motDePasse || !roleId || !paroisse || !secteur ) {
//       return NextResponse.json({ message: "Champs requis manquants." }, { status: 400 });
//     }

//     const userExiste = await Utilisateur.findOne({ email });
//     if (userExiste) return NextResponse.json({ message: "Email déjà utilisé." }, { status: 400 });

//     const user = await Utilisateur.create({
//       prenom,
//       nom,
//       email,
//       motDePasse,
//       role: roleId,
//       telephone,
//       paroisse,
//       secteur,
//       creerPar: currentUser._id,
//     });

//     // log action
//     await actionModel.create({
//       admin: currentUser._id,
//       action: "creer_utilisateur",
//       module: "Utilisateur",
//       donnees: { userId: user._id }
//     });

//     return NextResponse.json(user, { status: 201 });

//   } catch (error) {
//     return NextResponse.json({ message: "Erreur lors de la création.", error }, { status: 500 });
//   }
// };

// // ──────────────────────────────────────────────
// // PATCH → modifier un utilisateur
// // ──────────────────────────────────────────────
// export async function PATCH(request: Request, { params }: { params: { id: string } }) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
//     if (!currentUser || !voirPermission(currentUser, "modifier_utilisateur")) {
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
//     }

//     const userId = params.id;
//     const { prenom, nom, email, roleId, telephone, paroisse, section } = await request.json();

//     const user = await Utilisateur.findById(userId);
//     if (!user) return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });

//     // ABAC : restriction paroisse pour non-Admins
//     if (currentUser.role.nom !== "Admin" && user.paroisse !== currentUser.paroisse) {
//       return NextResponse.json({ message: "Accès refusé à cette paroisse." }, { status: 403 });
//     }

//     user.prenom = prenom ?? user.prenom;
//     user.nom = nom ?? user.nom;
//     user.email = email ?? user.email;
//     user.role = roleId ?? user.role;
//     user.telephone = telephone ?? user.telephone;
//     user.paroisse = paroisse ?? user.paroisse;
//     user.section = section ?? user.section;

//     await user.save();

//     await actionModel.create({
//       admin: currentUser._id,
//       action: "modifier_utilisateur",
//       module: "Utilisateur",
//       donnees: { userId: user._id }
//     });

//     return NextResponse.json(user, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Erreur lors de la mise à jour.", error }, { status: 500 });
//   }
// }

// // ──────────────────────────────────────────────
// // DELETE → supprimer un utilisateur
// // ──────────────────────────────────────────────
// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
//     if (!currentUser || !voirPermission(currentUser, "supprimer_utilisateur")) {
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
//     }

//     const userId = params.id;
//     const user = await Utilisateur.findById(userId);
//     if (!user) return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });

//     // ABAC : restriction paroisse
//     if (currentUser.role.nom !== "Admin" && user.paroisse !== currentUser.paroisse) {
//       return NextResponse.json({ message: "Accès refusé à cette paroisse." }, { status: 403 });
//     }

//     await user.remove();

//     await actionModel.create({
//       admin: currentUser._id,
//       action: "supprimer_utilisateur",
//       module: "Utilisateur",
//       donnees: { userId: user._id }
//     });

//     return NextResponse.json({ message: "Utilisateur supprimé." }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Erreur lors de la suppression.", error }, { status: 500 });
//   }
// }

// // ──────────────────────────────────────────────
// // GET → récupérer un utilisateur par ID
// // ──────────────────────────────────────────────
// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
//     if (!currentUser || !voirPermission(currentUser, "voir_utilisateur")) {
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
//     }

//     const userId = params.id;
//     const user = await Utilisateur.findById(userId).populate("role");
//     if (!user) return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });

//     // ABAC : restriction paroisse
//     if (currentUser.role.nom !== "Admin" && user.paroisse !== currentUser.paroisse) {
//       return NextResponse.json({ message: "Accès refusé à cette paroisse." }, { status: 403 });
//     }

//     return NextResponse.json(user);

//   } catch (error) {
//     return NextResponse.json({ message: "Erreur lors de la recherche.", error }, { status: 500 });
//   }
// }

// // ──────────────────────────────────────────────
// // GETall → lister tous les utilisateurs
// // ──────────────────────────────────────────────
// export async function GETall(request: Request) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
//     if (!currentUser || !voirPermission(currentUser, "voir_utilisateur")) {
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
//     }

//     const query: any = {};
//     if (currentUser.role.nom !== "Admin") {
//       query.paroisse = currentUser.paroisse; // restriction ABAC
//     }

//     const utilisateurs = await Utilisateur.find(query).populate("role");
//     return NextResponse.json(utilisateurs);

//   } catch (error) {
//     return NextResponse.json({ message: "Erreur serveur.", error }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Utilisateur from "@/models/utilisateur";
import actionModel from "@/models/action";
import { getUserFromToken } from "@/utils/auth";
import { emailTemplates, sendEmail } from "@/lib/email";
import { randomBytes } from "crypto";

// ──────────────────────────────────────────────
// POST → Créer un utilisateur (Admin seulement)
// ──────────────────────────────────────────────
export const POST = async (request: Request) => {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    // ✅ VÉRIFICATION STRICTE: Seul l'admin peut créer des utilisateurs
    if (!currentUser || currentUser.role.nom !== "Admin") {
      return NextResponse.json({ message: "Accès refusé. Admin requis." }, { status: 403 });
    }

    const { prenom, nom, email, motDePasse, roleId, telephone, paroisse, secteur } = await request.json();

    // ✅ VALIDATION COMPLÈTE
    const champsRequis = { prenom, nom, email, motDePasse, roleId, paroisse, secteur };
    const champsManquants = Object.entries(champsRequis)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (champsManquants.length > 0) {
      return NextResponse.json({ 
        message: "Champs requis manquants.", 
        champs: champsManquants 
      }, { status: 400 });
    }

    // ✅ VÉRIFICATION EMAIL EXISTANT
    const userExiste = await Utilisateur.findOne({ email });
    if (userExiste) {
      return NextResponse.json({ message: "Email déjà utilisé." }, { status: 400 });
    }
     const motDePasseTemporaire =  randomBytes(8).toString('hex');

    // ✅ CRÉATION SÉCURISÉE
    const user = await Utilisateur.create({
      prenom,
      nom,
      email,
      motDePasse : motDePasseTemporaire,
      role: roleId,
      telephone,
      paroisse,
      secteur,
      creerPar: currentUser._id,
      doitChangerMotDePasse: true
    });

  

    //email de bienvenue avec le mot de passe temporaire
   await sendEmail({
  to: user.email,
  ...emailTemplates.welcomeUser({
    prenom: user.prenom,
    email: user.email,
    motDePasseTemporaire: motDePasseTemporaire
  })
});

    // log action
    await actionModel.create({
      admin: currentUser._id,
      action: "creer_utilisateur",
      module: "Utilisateur",
      donnees: { 
        userId: user._id, 
        email: user.email, 
        paroisse: user.paroisse, 
        secteur: user.secteur 
      }
    });

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
    console.error("Erreur création utilisateur:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la création." 
    }, { status: 500 });
  }
};

// ──────────────────────────────────────────────
// GET → Lister tous les utilisateurs (Admin seulement)
// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// GET → Lister tous les utilisateurs avec pagination
// ──────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || currentUser.role.nom !== "Admin") {
      return NextResponse.json({ message: "Accès refusé. Admin requis." }, { status: 403 });
    }

    // ✅ RÉCUPÉRATION DES PARAMÈTRES DE PAGINATION
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // ✅ CALCUL PAGINATION
    const skip = (page - 1) * limit;

    // ✅ FILTRE DE RECHERCHE (optionnel)
    const filter: any = {};
    if (search) {
      filter.$or = [
        { prenom: { $regex: search, $options: 'i' } },
        { nom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // ✅ REQUÊTE AVEC PAGINATION
    const [utilisateurs, total] = await Promise.all([
      Utilisateur.find(filter)
        .populate("role")
        .select("-motDePasse")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      
      Utilisateur.countDocuments(filter)
    ]);

    // ✅ RÉPONSE AVEC MÉTADATAS
    return NextResponse.json({
      data: utilisateurs,
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
    console.error("Erreur liste utilisateurs:", error);
    return NextResponse.json({ 
      message: "Erreur serveur." 
    }, { status: 500 });
  }
}