// //app/models/ceremonie.ts
// import mongoose, {  Document } from "mongoose";
// const { Schema, model } = mongoose;

// export interface IDemandeCeremonie extends Document {
//   utilisateur: mongoose.Types.ObjectId;
//   Secteur: string;
//   paroisse: string;
//   foulardsBenjamins: number;
//   foulardsCadets: number;
//   foulardsAines: number;
//   dateCeremonie: Date;
//   lieuxCeremonie: string;
//   nombreParrains: number;
//   nombreMarraines: number;
//   courrierScanne: mongoose.Types.ObjectId; // ref Fichier
//   statut: "en_attente" | "valide" | "rejete";
//   commentaireAdmin?: string;
//   validePar?: mongoose.Types.ObjectId;
//   dateValidation?: Date;
// }

// const DemandeCeremonieSchema = new Schema<IDemandeCeremonie>(
//   {
//     utilisateur: { type: Schema.Types.ObjectId, ref: "Utilisateur", required: true },
//     Secteur: { type: String, required: true },
//     paroisse: { type: String, required: true },
//     foulardsBenjamins: { type: Number, min: 0, required: true },
//     foulardsCadets: { type: Number, min: 0, required: true },
//     foulardsAines: { type: Number, min: 0, required: true },
//     dateCeremonie: { type: Date, required: true },
//     lieuxCeremonie: { type: String, required: true },
//     nombreParrains: { type: Number, min: 0, required: true },
//     nombreMarraines: { type: Number, min: 0, required: true },
//     courrierScanne: { type: Schema.Types.ObjectId, ref: "Fichier", required: true },
//     statut: {
//       type: String,
//       enum: ["en_attente", "valide", "rejete"],
//       default: "en_attente",
//     },
//     commentaireAdmin: String,
//     validePar: { type: Schema.Types.ObjectId, ref: "Utilisateur" },
//     dateValidation: Date,
//   },
//   { timestamps: true }
// );

// const DemandeCeremonie = mongoose.models.DemandeCeremonie ||
//   model<IDemandeCeremonie>("DemandeCeremonie", DemandeCeremonieSchema);
// export default DemandeCeremonie;

// models/ceremonie.ts - VERSION CORRIGÉE
import mongoose, { Document } from "mongoose";
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
  courrierScanne: mongoose.Types.ObjectId;
  
  // ✅ NOUVEAU CHAMP : Pour gérer le brouillon vs soumis
  soumise: boolean;
  
  statut: "en_attente" | "valide" | "rejete";
  commentaireAdmin?: string;
  validePar?: mongoose.Types.ObjectId;
  dateValidation?: Date;
  dateSoumission?: Date; // ✅ Date de soumission
}

const DemandeCeremonieSchema = new Schema<IDemandeCeremonie>(
  {
    utilisateur: { 
      type: Schema.Types.ObjectId, 
      ref: "Utilisateur", 
      required: true,
      index: true 
    },
    
    Secteur: { type: String, required: true, trim: true, index: true },
    paroisse: { type: String, required: true, trim: true, index: true },
    foulardsBenjamins: { type: Number, min: 0, required: true },
    foulardsCadets: { type: Number, min: 0, required: true },
    foulardsAines: { type: Number, min: 0, required: true },
    dateCeremonie: { type: Date, required: true, index: true },
    lieuxCeremonie: { type: String, required: true, trim: true },
    nombreParrains: { type: Number, min: 0, required: true },
    nombreMarraines: { type: Number, min: 0, required: true },
    courrierScanne: { type: Schema.Types.ObjectId, ref: "Fichier", required: true },
    
    // ✅ Champ clé pour distinguer brouillon/soumis
    soumise: { 
      type: Boolean, 
      default: false,
      index: true 
    },
    
    statut: {
      type: String,
      enum: ["en_attente", "valide", "rejete"],
      default: "en_attente",
      index: true
    },
    
    commentaireAdmin: { type: String, trim: true },
    validePar: { type: Schema.Types.ObjectId, ref: "Utilisateur" },
    dateValidation: { type: Date },
    dateSoumission: { type: Date }, // ✅ Quand l'utilisateur l'a soumise
  },
  { timestamps: true }
);

// Index composés pour les requêtes
DemandeCeremonieSchema.index({ utilisateur: 1, soumise: 1 });
DemandeCeremonieSchema.index({ statut: 1, soumise: 1 });
DemandeCeremonieSchema.index({ Secteur: 1, paroisse: 1, soumise: 1 });
DemandeCeremonieSchema.index({ dateCeremonie: 1 });

const DemandeCeremonie = mongoose.models.DemandeCeremonie ||
  model<IDemandeCeremonie>("DemandeCeremonie", DemandeCeremonieSchema);

export default DemandeCeremonie;