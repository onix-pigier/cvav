// 3. models/DemandeCeremonie.ts
import mongoose, {  Document } from "mongoose";
const { Schema, model } = mongoose;

export interface IDemandeCeremonie extends Document {
  utilisateur: mongoose.Types.ObjectId;
  Secteur: string;
  paroisse: string;
  foulardsBenjamins: number;
  foulardsCadets: number;
  foulardsAines: number;
  dateCeremonie: Date;
  lieuxCeremonie: string;
  nombreParrains: number;
  nombreMarraines: number;
  courrierScanne: mongoose.Types.ObjectId; // ref Fichier
  statut: "en_attente" | "valide" | "rejete";
  commentaireAdmin?: string;
  validePar?: mongoose.Types.ObjectId;
  dateValidation?: Date;
}

const DemandeCeremonieSchema = new Schema<IDemandeCeremonie>(
  {
    utilisateur: { type: Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    Secteur: { type: String, required: true },
    paroisse: { type: String, required: true },
    foulardsBenjamins: { type: Number, min: 0, required: true },
    foulardsCadets: { type: Number, min: 0, required: true },
    foulardsAines: { type: Number, min: 0, required: true },
    dateCeremonie: { type: Date, required: true },
    lieuxCeremonie: { type: String, required: true },
    nombreParrains: { type: Number, min: 0, required: true },
    nombreMarraines: { type: Number, min: 0, required: true },
    courrierScanne: { type: Schema.Types.ObjectId, ref: "Fichier", required: true },
    statut: {
      type: String,
      enum: ["en_attente", "valide", "rejete"],
      default: "en_attente",
    },
    commentaireAdmin: String,
    validePar: { type: Schema.Types.ObjectId, ref: "Utilisateur" },
    dateValidation: Date,
  },
  { timestamps: true }
);

const DemandeCeremonie = mongoose.models.DemandeCeremonie ||
  model<IDemandeCeremonie>("DemandeCeremonie", DemandeCeremonieSchema);
export default DemandeCeremonie;