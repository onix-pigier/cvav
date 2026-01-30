// models/fichier.ts - Modèle pour les fichiers uploadés
import mongoose from "mongoose";

const FichierSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      description: "Nom original du fichier fourni par l'utilisateur"
    },
    nomUnique: {
      type: String,
      required: true,
      unique: true,
      description: "Nom unique généré pour éviter les collisions"
    },
    url: {
      type: String,
      required: true,
      description: "URL d'accès au fichier"
    },
    type: {
      type: String,
      required: true,
      enum: ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
      description: "Type MIME du fichier"
    },
    taille: {
      type: Number,
      required: true,
      description: "Taille du fichier en octets"
    },
    uploadePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
      description: "Utilisateur qui a uploadé le fichier"
    }
  },
  {
    timestamps: true,
    description: "Collection des fichiers uploadés dans le système"
  }
);

// Index pour optimiser les requêtes
FichierSchema.index({ uploadePar: 1, createdAt: -1 });
FichierSchema.index({ nomUnique: 1 });
FichierSchema.index({ createdAt: -1 });

const Fichier = mongoose.models.Fichier || mongoose.model("Fichier", FichierSchema);

export default Fichier;