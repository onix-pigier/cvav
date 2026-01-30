// lib/fileUtilsServer.ts - Utilitaires serveur pour gestion des fichiers
import { unlink } from "fs/promises";
import path from "path";

// ──────────────────────────────────────────────
// CONSTANTS
// ──────────────────────────────────────────────
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg"
];

export const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ──────────────────────────────────────────────
// UTILITAIRES DE FICHIERS (Server only)
// ──────────────────────────────────────────────
export async function deletePhysicalFile(uniqueFileName: string): Promise<void> {
  try {
    const filePath = getFilePath(uniqueFileName);
    await unlink(filePath);
    console.log("✅ Fichier physique supprimé:", uniqueFileName);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.warn("⚠️ Fichier déjà supprimé ou inexistant:", uniqueFileName);
    } else {
      throw error;
    }
  }
}

export function getUploadDir(): string {
  return path.join(process.cwd(), "public", "uploads");
}

export function getFilePath(uniqueFileName: string): string {
  return path.join(getUploadDir(), uniqueFileName);
}
