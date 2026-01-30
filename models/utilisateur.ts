import mongoose, { Document } from "mongoose";
const { Schema, model } = mongoose; // <-- retirer 'models'
import bcrypt from "bcryptjs";

export interface IUtilisateur extends Document {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  role: mongoose.Types.ObjectId;
  telephone?: string;
  paroisse?: string;
  secteur?: string;
  actif: boolean;
  creerPar: mongoose.Types.ObjectId | null;
  doitChangerMotDePasse: boolean;
  dernierChangementMotDePasse: Date;
  tentativesConnexion: number;
  bloqueJusquA?: Date;

  compareMotDePasse: (candidate: string) => Promise<boolean>;
  incrementerTentativeConnexion: () => Promise<void>;
  reinitialiserTentativesConnexion: () => Promise<void>;
}

// Schema (inchangé)
const UtilisateurSchema = new Schema<IUtilisateur>(
  {
    prenom: { type: String, required: true, trim: true },
    nom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    motDePasse: { type: String, required: true, select: false },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    telephone: { type: String, trim: true },
    paroisse: { type: String, trim: true },
    secteur: { type: String, trim: true },
    actif: { type: Boolean, default: true , index: true },
    creerPar: { type: Schema.Types.ObjectId, ref: "Utilisateur", default: null },
    doitChangerMotDePasse: { type: Boolean, default: false },
    dernierChangementMotDePasse: { type: Date, default: Date.now },
    tentativesConnexion: { type: Number, default: 0 },
    bloqueJusquA: { type: Date },
  },
  { timestamps: true }
);


// ──────────────────────────────────────────────────
// MIDDLEWARES ET MÉTHODES
// ──────────────────────────────────────────────────

// Hachage du mot de passe
UtilisateurSchema.pre("save", async function (next) {
  if (!this.isModified("motDePasse")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    this.dernierChangementMotDePasse = new Date();
    next();
  } catch (err: any) {
    next(err);
  }
});

// Méthode pour comparer les mots de passe
UtilisateurSchema.methods.compareMotDePasse = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.motDePasse);
};

// Méthode pour incrémenter les tentatives de connexion
UtilisateurSchema.methods.incrementerTentativeConnexion = async function () {
  this.tentativesConnexion += 1;
  
  // Bloquer après 5 tentatives échouées pendant 30 minutes
  if (this.tentativesConnexion >= 5) {
    this.bloqueJusquA = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  }
  
  await this.save();
};

// Méthode pour réinitialiser les tentatives
UtilisateurSchema.methods.reinitialiserTentativesConnexion = async function () {
  this.tentativesConnexion = 0;
  this.bloqueJusquA = undefined;
  await this.save();
};

// Ne jamais renvoyer le mot de passe
UtilisateurSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.motDePasse;
  return user;
};

// Indexes
UtilisateurSchema.index({ role: 1 });
UtilisateurSchema.index({ actif: 1 });
UtilisateurSchema.index({ bloqueJusquA: 1 });

const Utilisateur = mongoose.models.Utilisateur || model<IUtilisateur>("Utilisateur", UtilisateurSchema);
export default Utilisateur;