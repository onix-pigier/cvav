// lib/db.ts
import mongoose from "mongoose";

// Charge TOUS les modèles AVANT même la connexion
// → c'est la méthode la plus fiable et sans effet de bord
import "@/models/action";
import "@/models/attestation";
import "@/models/ceremonie";
import "@/models/fichier";
import "@/models/militant";
import "@/models/notification";
import "@/models/resetpassword";
import "@/models/role";
import "@/models/utilisateur";
// → Ajoute les nouveaux ici ou passe à la version dynamique (voir bonus ci-dessous)

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error("MONGO_URI non définie");

type MongooseCache = { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = globalThis.mongoose;

if (!cached) cached = globalThis.mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const conn = await mongoose.connect(MONGO_URI!, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    console.log("MongoDB connecté :", conn.connection.host, conn.connection.name);
    cached!.promise = Promise.resolve(conn.connection); // on stocke la connexion
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}