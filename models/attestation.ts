import mongoose, { Document} from "mongoose";
const { Schema, model } = mongoose;

export interface IDemandeAttestation extends Document {
  utilisateur: mongoose.Types.ObjectId;
  prenom: string;
  nom: string;
  paroisse: string;
  secteur: string;
  anneeFinFormation: number;
  lieuDernierCamp: string;
  bulletinScanne?: mongoose.Types.ObjectId;
  statut: "en_attente" | "valide" | "rejete";
  commentaireAdmin?: string;
  numeroAttestation?: string;
  fichierAttestationPDF?: mongoose.Types.ObjectId;
  validePar?: mongoose.Types.ObjectId;
  dateValidation?: Date;
}

const DemandeAttestationSchema = new Schema<IDemandeAttestation>({
  utilisateur: { type: Schema.Types.ObjectId, ref: "Utilisateur", required: true },

  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  paroisse: { type: String, required: true },
  secteur: { type: String, required: true },
  anneeFinFormation: { type: Number, required: true },
  lieuDernierCamp: { type: String, required: true },

  bulletinScanne: { type: Schema.Types.ObjectId, ref: "Fichier" },

  statut: {
    type: String,
    enum: ["en_attente", "valide", "rejete"],
    default: "en_attente"
  },

  commentaireAdmin: { type: String },
  numeroAttestation: String,
    fichierAttestationPDF: { type: Schema.Types.ObjectId, ref: "Fichier" },
    validePar: { type: Schema.Types.ObjectId, ref: "Utilisateur" },
    dateValidation: Date,

}, { timestamps: true });

const DemandeAttestation = mongoose.models.DemandeAttestation ||
  model<IDemandeAttestation>("DemandeAttestation", DemandeAttestationSchema);
export default DemandeAttestation;