import mongoose, { Document } from "mongoose";
const { Schema, model } = mongoose;
export interface IMilitant extends Document {
  creePar: mongoose.Types.ObjectId;
  prenom: string;
  nom: string;
  paroisse: string;
  secteur: string;
  sexe: "M" | "F";
  grade: string;
  quartier: string;

}

const MilitantSchema = new Schema<IMilitant>({
  creePar: { type: Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  prenom: { type: String, required: true },
  sexe: { type: String, enum: ["M", "F"], required: true },
  nom: { type: String, required: true },
  paroisse: { type: String, required: true },
  secteur: { type: String, required: true },
  grade: { type: String, required: true },
  quartier: { type: String, required: true },

}, { timestamps: true });

MilitantSchema.index({ paroisse: 1, secteur: 1 });


const Militant = mongoose.models.Militant || model<IMilitant>("Militant", MilitantSchema);
export default Militant;