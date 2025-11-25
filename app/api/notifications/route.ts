import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import Notification from "@/models/notification";

// GET /api/notifications
export async function GET(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Récupérer les notifications de l'utilisateur
    const notifications = await Notification.find({ utilisateur: currentUser._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Compter le total des notifications non lues
    const totalNonLues = await Notification.countDocuments({
      utilisateur: currentUser._id,
      lu: false
    });

    // Compter le total des notifications
    const totalNotifications = await Notification.countDocuments({
      utilisateur: currentUser._id
    });

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total: totalNotifications,
        totalPages: Math.ceil(totalNotifications / limit)
      },
      stats: {
        totalNonLues
      }
    });

  } catch (error) {
    console.error("Erreur récupération notifications:", error);
    return NextResponse.json({ 
      message: "Erreur serveur." 
    }, { status: 500 });
  }
}

// PATCH /api/notifications - Marquer toutes les notifications comme lues
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    await Notification.updateMany(
      { utilisateur: currentUser._id, lu: false },
      { $set: { lu: true } }
    );

    return NextResponse.json({ 
      message: "Toutes les notifications ont été marquées comme lues." 
    });

  } catch (error) {
    console.error("Erreur marquage notifications:", error);
    return NextResponse.json({ 
      message: "Erreur lors du marquage des notifications." 
    }, { status: 500 });
  }
}