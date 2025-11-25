import mongoose, { Document } from "mongoose";
const { Schema, model,  } = mongoose;
export interface IFichier extends Document {
  url: string;
  nom: string;
  type: "courrier" | "bulletin" | "autre";
  uploader: mongoose.Types.ObjectId;
  taille?: number;
}

const FichierSchema = new Schema<IFichier>({
  url: { type: String, required: true },
  nom: { type: String, required: true },
  type: { type: String, enum: ["courrier", "bulletin","autre"], required: true },
  uploader: { type: Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  taille: { type: Number },
}, { timestamps: true });

const Fichier = mongoose.models.Fichier || model<IFichier>("Fichier", FichierSchema);
export default Fichier;
