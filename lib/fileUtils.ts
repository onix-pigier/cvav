// lib/fileUtils.ts - Utilitaires partagés pour gestion des fichiers
import path from "path";

// ──────────────────────────────────────────────
// TYPES & INTERFACES
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
// VALIDATION
// ──────────────────────────────────────────────
export function validateFileType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType);
}

export function validateFileSize(size: number, maxSize: number = MAX_FILE_SIZE): boolean {
  return size > 0 && size <= maxSize;
}

export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export function validateFileExtension(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ALLOWED_EXTENSIONS.includes(ext);
}

// ──────────────────────────────────────────────
// GÉNÉRATION DE NOMS UNIQUES
// ──────────────────────────────────────────────
export function generateUniqueFileName(originalFileName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 9);
  const extension = getFileExtension(originalFileName);
  // Nettoyer le nom original
  const baseName = originalFileName
    .replace(/\.[^/.]+$/, "") // Enlever extension
    .replace(/\s+/g, "-") // Remplacer espaces par tirets
    .replace(/[^a-zA-Z0-9-]/g, "") // Garder uniquement alphanumérique et tirets
    .substring(0, 30); // Limiter la longueur
  
  return `${timestamp}-${randomString}${extension}`;
}

// ──────────────────────────────────────────────
// GESTION DES CHEMINS (public)
// ──────────────────────────────────────────────
export function getFileUrl(uniqueFileName: string): string {
  return `/uploads/${uniqueFileName}`;
}

// ──────────────────────────────────────────────
// CONSTRUCTION RÉPONSE
// ──────────────────────────────────────────────
export function buildFileResponse(fichier: any) {
  return {
    _id: fichier._id,
    nom: fichier.nom,
    nomUnique: fichier.nomUnique,
    url: fichier.url,
    type: fichier.type,
    taille: fichier.taille,
    uploadePar: fichier.uploadePar,
    createdAt: fichier.createdAt,
    updatedAt: fichier.updatedAt
  };
}

// ──────────────────────────────────────────────
// NORMALISATIONS (partageable client/server)
// ──────────────────────────────────────────────
export function normalizeSector(s?: string): string {
  if (!s) return "-";
  
  const SECTEURS_CANONICAL: Record<string, string> = {
    "secteur nord": "Secteur Nord",
    "secteur sud": "Secteur Sud",
    "secteur est": "Secteur Est",
    "secteur ouest": "Secteur Ouest",
    "secteur centre": "Secteur Centre"
  };
  
  const key = s.toString().trim().toLowerCase();
  if (SECTEURS_CANONICAL[key]) return SECTEURS_CANONICAL[key];
  
  const values = Object.values(SECTEURS_CANONICAL);
  if (values.includes(s)) return s;
  
  return s.charAt(0).toUpperCase() + s.slice(1);
}
