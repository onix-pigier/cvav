'use client';

import React from 'react';
import { SECTEURS, getParoissesBySecteur } from '@/lib/secteurs-paroisses';

interface SecteurParoisseSelectCascadeProps {
  secteur: string;
  setSecteur: (value: string) => void;
  paroisse: string;
  setParoisse: (value: string) => void;
  secteurLabel?: string;
  paroisseLabel?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SecteurParoisseSelectCascade({
  secteur,
  setSecteur,
  paroisse,
  setParoisse,
  secteurLabel = 'Secteur',
  paroisseLabel = 'Paroisse',
  required = false,
  disabled = false,
  className = 'space-y-4'
}: SecteurParoisseSelectCascadeProps) {
  const paroisses = secteur ? getParoissesBySecteur(secteur) : [];

  // Réinitialiser paroisse si le secteur change
  React.useEffect(() => {
    if (!paroisses.includes(paroisse)) {
      setParoisse('');
    }
  }, [secteur]);

  return (
    <div className={className}>
      {/* Secteur Select */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {secteurLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          value={secteur}
          onChange={(e) => setSecteur(e.target.value)}
          disabled={disabled}
          required={required}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">-- Sélectionner un secteur --</option>
          {SECTEURS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Paroisse Select */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {paroisseLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          value={paroisse}
          onChange={(e) => setParoisse(e.target.value)}
          disabled={disabled || !secteur}
          required={required && !!secteur}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {!secteur ? '-- Sélectionner un secteur d\'abord --' : '-- Sélectionner une paroisse --'}
          </option>
          {paroisses.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {!secteur && <p className="text-xs text-gray-500 mt-1">Choisissez d'abord un secteur</p>}
      </div>
    </div>
  );
}
