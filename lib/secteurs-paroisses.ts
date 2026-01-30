// lib/secteurs-paroisses.ts - CONFIGURATION CENTRALISÉE SECTEURS ET PAROISSES
import { useState, useEffect } from 'react';

export const SECTEURS_PAROISSES = {
  "Secteur Nord": [
    "Paroisse Saint-Pierre",
    "Paroisse Saint-Paul",
    "Paroisse Notre-Dame",
    "Paroisse Saint-Jean"
  ],
  "Secteur Sud": [
    "Paroisse Sainte-Marie",
    "Paroisse Saint-Joseph",
    "Paroisse Sacré-Cœur",
    "Paroisse Saint-Michel"
  ],
  "Secteur Est": [
    "Paroisse Saint-Antoine",
    "Paroisse Saint-François",
    "Paroisse Sainte-Thérèse",
    "Paroisse Saint-Louis"
  ],
  "Secteur Ouest": [
    "Paroisse Saint-Marc",
    "Paroisse Saint-Luc",
    "Paroisse Saint-Matthieu",
    "Paroisse Sainte-Anne"
  ],
  "Secteur Centre": [
    "Paroisse Cathédrale",
    "Paroisse Saint-Esprit",
    "Paroisse Sainte-Trinité",
    "Paroisse Saint-Augustin"
  ]
};

// Liste des secteurs
export const SECTEURS = Object.keys(SECTEURS_PAROISSES);

// Fonction pour obtenir les paroisses d'un secteur
export function getParoissesBySecteur(secteur: string): string[] {
  return SECTEURS_PAROISSES[secteur as keyof typeof SECTEURS_PAROISSES] || [];
}

// Hook personnalisé pour gérer secteur/paroisse
export function useSecteurParoisse(initialSecteur = '', initialParoisse = '') {
  const [secteur, setSecteur] = useState(initialSecteur);
  const [paroisse, setParoisse] = useState(initialParoisse);
  const [paroisses, setParoisses] = useState<string[]>([]);

  useEffect(() => {
    if (secteur) {
      const newParoisses = getParoissesBySecteur(secteur);
      setParoisses(newParoisses);
      
      // Si la paroisse actuelle n'est pas dans la nouvelle liste, reset
      if (!newParoisses.includes(paroisse)) {
        setParoisse('');
      }
    } else {
      setParoisses([]);
      setParoisse('');
    }
  }, [secteur, paroisse]);

  return { secteur, setSecteur, paroisse, setParoisse, paroisses };
}
