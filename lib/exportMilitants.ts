// lib/exportMilitants.ts - Export des militants au format Excel
import * as XLSX from "xlsx";
import { Militant } from "@/types/militant";
import { normalizeSector } from "@/lib/fileUtils";

// ──────────────────────────────────────────────
// EXPORT MILITANTS AU FORMAT EXCEL
// ──────────────────────────────────────────────
export const exportToExcel = (militants: Militant[]) => {
  const data = militants.map(m => ({
    Prénom: m.prenom,
    Nom: m.nom,
    Sexe: m.sexe === "M" ? "Homme" : "Femme",
    Paroisse: m.paroisse,
    Secteur: normalizeSector(m.secteur),
    Grade: m.grade,
    Quartier: m.quartier || "-",
    Téléphone: m.telephone || "-",
    "Date ajout": m.createdAt ? new Date(m.createdAt).toLocaleDateString("fr-FR") : "-",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Militants");
  
  // Formatage des colonnes
  ws["!cols"] = [
    { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 25 }, 
    { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 15 }
  ];

  // Téléchargement du fichier
  XLSX.writeFile(wb, `Militants_CVAV_${new Date().toISOString().slice(0, 10)}.xlsx`);
};