import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import Notification from "@/models/notification";

// PATCH /api/notifications/[id] - Marquer une notification comme lue
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    const notificationId = params.id;
    const notification = await Notification.findOne({
      _id: notificationId,
      utilisateur: currentUser._id
    });

    if (!notification) {
      return NextResponse.json({ 
        message: "Notification non trouvée." 
      }, { status: 404 });
    }

    notification.lu = true;
    await notification.save();

    return NextResponse.json({ 
      message: "Notification marquée comme lue.",
      data: notification
    });

  } catch (error) {
    console.error("Erreur marquage notification:", error);
    return NextResponse.json({ 
      message: "Erreur lors du marquage de la notification." 
    }, { status: 500 });
  }
}

// DELETE /api/notifications/[id] - Supprimer une notification
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    const notificationId = params.id;
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      utilisateur: currentUser._id
    });

    if (!notification) {
      return NextResponse.json({ 
        message: "Notification non trouvée." 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Notification supprimée." 
    });

  } catch (error) {
    console.error("Erreur suppression notification:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la suppression de la notification." 
    }, { status: 500 });
  }
}