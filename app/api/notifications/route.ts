// C:\Users\cesar\Documents\cv-av\app\api\notifications\route.ts 
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { getUserFromToken } from "@/utils/auth";
// import Notification from "@/models/notification";

// // GET /api/notifications
// export async function GET(request: Request) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
    
//     if (!currentUser) {
//       return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '20');
//     const skip = (page - 1) * limit;

//     // Récupérer les notifications de l'utilisateur
//     const notifications = await Notification.find({ utilisateur: currentUser._id })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     // Compter le total des notifications non lues
//     const totalNonLues = await Notification.countDocuments({
//       utilisateur: currentUser._id,
//       lu: false
//     });

//     // Compter le total des notifications
//     const totalNotifications = await Notification.countDocuments({
//       utilisateur: currentUser._id
//     });

//     return NextResponse.json({
//       notifications,
//       pagination: {
//         page,
//         limit,
//         total: totalNotifications,
//         totalPages: Math.ceil(totalNotifications / limit)
//       },
//       stats: {
//         totalNonLues
//       }
//     });

//   } catch (error) {
//     console.error("Erreur récupération notifications:", error);
//     return NextResponse.json({ 
//       message: "Erreur serveur." 
//     }, { status: 500 });
//   }
// }

// // PATCH /api/notifications - Marquer toutes les notifications comme lues
// export async function PATCH(request: Request) {
//   try {
//     await connectDB();
//     const currentUser = await getUserFromToken(request);
    
//     if (!currentUser) {
//       return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
//     }

//     await Notification.updateMany(
//       { utilisateur: currentUser._id, lu: false },
//       { $set: { lu: true } }
//     );

//     return NextResponse.json({ 
//       message: "Toutes les notifications ont été marquées comme lues." 
//     });

//   } catch (error) {
//     console.error("Erreur marquage notifications:", error);
//     return NextResponse.json({ 
//       message: "Erreur lors du marquage des notifications." 
//     }, { status: 500 });
//   }
// }
//app/api/notifications/route.ts - VERSION CORRIGÉE
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission, estAdmin } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import Notification from "@/models/notification";

// ============================================
// GET - Lister les notifications
// ============================================
export async function GET(request: Request) {
    try {
        await connectDB();
        const currentUser = await getUserFromToken(request);
        
        if (!currentUser) {
            return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
        }

        // ✅ CORRIGÉ : Vérification des permissions avec admin bypass
        const peutVoir = 
            estAdmin(currentUser) ||
            voirPermission(currentUser, "voir_mes_notifications") ||
            voirPermission(currentUser, "voir_toute_notification");

        if (!peutVoir) {
            return NextResponse.json({ 
                message: "Accès refusé. Permission manquante." 
            }, { status: 403 });
        }

        // Filtrage selon le rôle
        let filtre: any = {};
        
        if (estAdmin(currentUser) && voirPermission(currentUser, "voir_toute_notification")) {
            // Admin peut voir toutes les notifications
            filtre = {};
        } else {
            // Utilisateur voit seulement ses notifications
            filtre = { utilisateur: currentUser._id };
        }

        const notifications = await Notification.find(filtre)
            .populate('emetteur', 'prenom nom email')
            .sort({ createdAt: -1 })
            .limit(50);
        
        return NextResponse.json(notifications);

    } catch (error) {
        console.error("❌ Erreur liste notifications:", error);
        return NextResponse.json({ 
            message: "Erreur lors de la récupération des notifications." 
        }, { status: 500 });
    }
}

// ============================================
// PATCH - Marquer comme lu(e)
// ============================================
export async function PATCH(request: Request) {
    try {
        await connectDB();
        const currentUser = await getUserFromToken(request);
        
        if (!currentUser) {
            return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
        }

        const { id, all } = await request.json();

        // ✅ CORRIGÉ : Vérification des permissions
        const peutMarquer = 
            estAdmin(currentUser) ||
            voirPermission(currentUser, "marquer_mes_notifications_comme_lues") ||
            voirPermission(currentUser, "marquer_toute_notification_comme_lue");

        if (!peutMarquer) {
            return NextResponse.json({ 
                message: "Accès refusé. Permission manquante." 
            }, { status: 403 });
        }

        let updateResult;

        if (all) {
            // Marquer toutes comme lues
            const filter = estAdmin(currentUser) 
                ? { lu: false }  // Admin peut marquer toutes
                : { utilisateur: currentUser._id, lu: false };  // User marque les siennes
            
            updateResult = await Notification.updateMany(
                filter,
                { $set: { lu: true } }
            );
        } else if (id) {
            // Marquer une seule notification
            const filter = estAdmin(currentUser)
                ? { _id: id }  // Admin peut marquer n'importe laquelle
                : { _id: id, utilisateur: currentUser._id };  // User seulement la sienne
            
            updateResult = await Notification.updateOne(
                filter,
                { $set: { lu: true } }
            );
        } else {
            return NextResponse.json({ 
                message: "ID ou paramètre 'all' requis." 
            }, { status: 400 });
        }

        if (updateResult.modifiedCount === 0 && !all) {
            return NextResponse.json({ 
                message: "Notification non trouvée ou déjà lue." 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            message: `${updateResult.modifiedCount} notification(s) mise(s) à jour.`,
            modifiedCount: updateResult.modifiedCount
        }, { status: 200 });

    } catch (error) {
        console.error("❌ Erreur mise à jour notification:", error);
        return NextResponse.json({ 
            message: "Erreur lors de la mise à jour des notifications." 
        }, { status: 500 });
    }
}