// 7. models/Notification.ts
import  mongoose, {  Document } from "mongoose";
const { Schema, model } = mongoose;

export interface INotification extends Document {
  utilisateur: mongoose.Types.ObjectId;
  titre: string;
  message: string;
  lien?: string;
  lu: boolean;
  type?: "info" | "succes" | "erreur";
}

const NotificationSchema = new Schema<INotification>(
  {
    utilisateur: { type: Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    titre: { type: String, required: true },
    message: { type: String, required: true },
    lien: String,
    lu: { type: Boolean, default: false },
    type: { type: String, enum: ["info", "succes", "erreur"], default: "info" },
  },
  { timestamps: true }
);

const Notification = mongoose.models.Notification || model<INotification>("Notification", NotificationSchema);
export default Notification;