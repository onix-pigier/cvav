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
//app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { voirPermission } from "@/utils/permission";
import { getUserFromToken } from "@/utils/auth";
import Notification from "@/models/notification";

// ──────────────────────────────────────────────
// GET → Lister les notifications de l'utilisateur
// URL: /api/notifications
// ──────────────────────────────────────────────
export async function GET(request: Request) {
    try {
        await connectDB();
        const currentUser = await getUserFromToken(request);
        
        if (!currentUser) {
            return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
        }

        // Vérification de la permission de voir les notifications
        // La permission "voir_notifications" est définie pour 'utilisateur' et 'admin'.
        if (!voirPermission(currentUser, "voir_notifications")) {
            return NextResponse.json({ message: "Accès refusé. Permission manquante." }, { status: 403 });
        }

        // Le filtre assure que l'utilisateur ne voit que ses propres notifications
        const filtre = { utilisateur: currentUser._id };

        const notifications = await Notification.find(filtre)
            .sort({ createdAt: -1 })
            // Limiter la requête si la performance est un problème, par exemple: .limit(50)
            .limit(50); 
        
        // IMPORTANT : Retourne directement le tableau (Array) pour correspondre au modèle simple
        // utilisé dans le front-end du composant AttestationsPage.tsx.
        return NextResponse.json(notifications);

    } catch (error) {
        console.error("Erreur liste notifications:", error);
        return NextResponse.json({ 
            message: "Erreur lors de la récupération des notifications." 
        }, { status: 500 });
    }
}

// ──────────────────────────────────────────────
// PATCH → Marquer une/des notification(s) comme lue(s)
// URL: /api/notifications
// Body: { id?: string, all?: boolean }
// ──────────────────────────────────────────────
export async function PATCH(request: Request) {
    try {
        await connectDB();
        const currentUser = await getUserFromToken(request);
        const { id, all } = await request.json(); // id pour une seule, all=true pour toutes

        if (!currentUser) {
            return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
        }

        // Vérification de la permission de marquer comme lue
        if (!voirPermission(currentUser, "marquer_notification_comme_lue")) {
            return NextResponse.json({ message: "Accès refusé. Permission manquante." }, { status: 403 });
        }

        let updateResult;

        if (all) {
            // Option 1: Marquer TOUTES les notifications non lues de l'utilisateur comme lues
            updateResult = await Notification.updateMany(
                { utilisateur: currentUser._id, lu: false },
                { $set: { lu: true } }
            );
        } else if (id) {
            // Option 2: Marquer une notification spécifique comme lue
            updateResult = await Notification.updateOne(
                { _id: id, utilisateur: currentUser._id }, // S'assurer que l'utilisateur possède la notification
                { $set: { lu: true } }
            );
        } else {
            return NextResponse.json({ message: "ID ou paramètre 'all' requis." }, { status: 400 });
        }

        if (updateResult.modifiedCount === 0 && !all) {
            return NextResponse.json({ message: "Notification non trouvée ou déjà lue." }, { status: 404 });
        }

        return NextResponse.json({ 
            message: `${updateResult.modifiedCount} notification(s) mise(s) à jour.`,
            modifiedCount: updateResult.modifiedCount
        }, { status: 200 });

    } catch (error) {
        console.error("Erreur mise à jour notification:", error);
        return NextResponse.json({ 
            message: "Erreur lors de la mise à jour des notifications." 
        }, { status: 500 });
    }
} 