// // app/api/users/[id]/toggle-status/route.ts

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { getUserFromToken } from "@/utils/auth";
// import { estAdmin } from "@/utils/permission";
// import Utilisateur from "@/models/utilisateur";
// import LogAction from "@/models/action";

// export async function PATCH(
//   request: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
    
//     console.log('🔄 Début toggle statut utilisateur');
    
//     if (!currentUser || !estAdmin(currentUser)) {
//       console.log('❌ Accès refusé - Non admin');
//       return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
//     }

//     const params = await context.params;
//     const userId = params.id;

//     // Empêcher auto-désactivation
//     if (userId === currentUser._id.toString()) {
//       console.log('❌ Tentative auto-désactivation bloquée');
//       return NextResponse.json({ 
//         message: "Vous ne pouvez pas désactiver votre propre compte." 
//       }, { status: 403 });
//     }

//     const user = await Utilisateur.findById(userId).populate("role");
//     if (!user) {
//       console.log('❌ Utilisateur non trouvé');
//       return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
//     }

//     console.log('👤 Toggle statut pour:', user.email);
//     console.log('📊 Statut actuel:', user.actif);

//     // Toggle statut
//     const ancienStatut = user.actif;
//     user.actif = !user.actif;
//     await user.save();

//     console.log('✅ Nouveau statut:', user.actif);

//     // Log d'audit
//     await LogAction.create({
//       admin: currentUser._id,
//       action: user.actif ? "activer_utilisateur" : "desactiver_utilisateur",
//       module: "Utilisateur",
//       donnees: { 
//         userId: user._id, 
//         email: user.email,
//         ancienStatut,
//         nouveauStatut: user.actif,
//         parAdmin: currentUser.email
//       }
//     });

//     console.log('📝 Log audit créé');
//     console.log('🎉 Toggle statut terminé');

//     return NextResponse.json({ 
//       message: `Compte ${user.estActif ? 'activé' : 'désactivé'} avec succès.`,
//       data: user
//     });

//   } catch (error) {
//     console.error("💥 Erreur toggle status:", error);
//     return NextResponse.json({ 
//       message: "Erreur lors du changement de statut." 
//     }, { status: 500 });
//   }
// }

// app/api/users/[id]/toggle-status/route.ts - VERSION CORRIGÉE

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import { estAdmin } from "@/utils/permission";
import Utilisateur from "@/models/utilisateur";
import LogAction from "@/models/action";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    console.log('🔄 Début toggle statut utilisateur');
    
    if (!currentUser || !estAdmin(currentUser)) {
      console.log('❌ Accès refusé - Non admin');
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const params = await context.params;
    const userId = params.id;

    // Empêcher auto-désactivation
    if (userId === currentUser._id.toString()) {
      console.log('❌ Tentative auto-désactivation bloquée');
      return NextResponse.json({ 
        message: "Vous ne pouvez pas désactiver votre propre compte." 
      }, { status: 403 });
    }

    // Charger l'utilisateur avec le rôle peuplé
    const user = await Utilisateur.findById(userId).populate("role");
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
    }

    console.log('👤 Toggle statut pour:', user.email);
    console.log('📊 Statut actuel (actif):', user.actif);

    // Empêcher désactivation admin système
    if (user.email === 'kouassicesariokouassi@gmail.com' && user.actif) {
      console.log('❌ Tentative désactivation admin système bloquée');
      return NextResponse.json({ 
        message: "L'administrateur système ne peut pas être désactivé." 
      }, { status: 403 });
    }

    // Toggle le statut (utiliser "actif" pas "estActif")
    const ancienStatut = user.actif;
    user.actif = !user.actif;
    await user.save();

    console.log('✅ Nouveau statut (actif):', user.actif);

    // Log d'audit
    await LogAction.create({
      admin: currentUser._id,
      action: user.actif ? "activer_utilisateur" : "desactiver_utilisateur",
      module: "Utilisateur",
      donnees: { 
        userId: user._id, 
        email: user.email,
        ancienStatut,
        nouveauStatut: user.actif,
        parAdmin: currentUser.email
      }
    });

    console.log('📝 Log audit créé');
    console.log('🎉 Toggle statut terminé');

    return NextResponse.json({ 
      message: `Compte ${user.actif ? 'activé' : 'désactivé'} avec succès.`,
      data: user
    });

  } catch (error) {
    console.error("💥 Erreur toggle status:", error);
    return NextResponse.json({ 
      message: "Erreur lors du changement de statut." 
    }, { status: 500 });
  }
}