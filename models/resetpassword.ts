
// models/DemandeResetMotDePasse.ts
import mongoose, { Document } from "mongoose";
const { Schema, model } = mongoose;

export interface IDemandeResetMotDePasse extends Document {
  utilisateur: mongoose.Types.ObjectId;
  token: string;
  expireLe: Date;
  utilise: boolean;
  dateDemande: Date;
  traitePar?: mongoose.Types.ObjectId;
  dateTraitement?: Date;
  statut: "en_attente" | "approuve" | "rejete";
  nouveauMotDePasseTemporaire?: string;
  raisonRejet?: string;
}

const DemandeResetMotDePasseSchema = new Schema<IDemandeResetMotDePasse>({
  utilisateur: { type: Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  token: { type: String, required: true, unique: true },
  expireLe: { type: Date, required: true },
  utilise: { type: Boolean, default: false },
  dateDemande: { type: Date, default: Date.now },
  traitePar: { type: Schema.Types.ObjectId, ref: "Utilisateur" },
  dateTraitement: Date,
  statut: { type: String, enum: ["en_attente", "approuve", "rejete"], default: "en_attente" },
  nouveauMotDePasseTemporaire: { type: String, select: false },
  raisonRejet: String,
}, { timestamps: true });

// Index pour expiration automatique
DemandeResetMotDePasseSchema.index({ expireLe: 1 }, { expireAfterSeconds: 0 });
DemandeResetMotDePasseSchema.index({ utilisateur: 1 });
DemandeResetMotDePasseSchema.index({ statut: 1 });

const DemandeResetMotDePasse = mongoose.models.DemandeResetMotDePasse ||
  model<IDemandeResetMotDePasse>("DemandeResetMotDePasse", DemandeResetMotDePasseSchema);
export default DemandeResetMotDePasse;