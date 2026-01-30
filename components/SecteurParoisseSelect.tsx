'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { SECTEURS_PAROISSES, SECTEURS } from '@/lib/secteurs-paroisses';

interface SecteurParoisseSelectProps {
  secteur: string;
  paroisse: string;
  onSecteurChange: (value: string) => void;
  onParoisseChange: (value: string) => void;
  error?: {
    secteur?: string;
    paroisse?: string;
  };
  onBlur?: (field: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function SecteurParoisseSelect({
  secteur,
  paroisse,
  onSecteurChange,
  onParoisseChange,
  error = {},
  onBlur,
  disabled = false,
  required = true,
}: SecteurParoisseSelectProps) {
  const [paroisses, setParoisses] = useState<string[]>([]);

  // Mettre à jour la liste des paroisses quand le secteur change
  useEffect(() => {
    if (secteur) {
      const newParoisses = SECTEURS_PAROISSES[secteur as keyof typeof SECTEURS_PAROISSES] || [];
      setParoisses(newParoisses);

      // Reset paroisse si elle n'est plus valide pour ce secteur
      if (!newParoisses.includes(paroisse)) {
        onParoisseChange('');
      }
    } else {
      setParoisses([]);
      onParoisseChange('');
    }
  }, [secteur, paroisse, onParoisseChange]);

  return (
    <div className="space-y-4">
      {/* Sélection du secteur */}
      <div className="space-y-2">
        <label htmlFor="secteur" className="block text-sm font-semibold text-gray-700">
          Secteur {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            id="secteur"
            value={secteur}
            onChange={(e) => onSecteurChange(e.target.value)}
            onBlur={() => onBlur?.('secteur')}
            disabled={disabled}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
              error.secteur
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''}`}
          >
            <option value="">Sélectionnez un secteur...</option>
            {SECTEURS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
        {error.secteur && (
          <p className="text-red-600 text-sm flex items-center space-x-1">
            <span>⚠</span>
            <span>{error.secteur}</span>
          </p>
        )}
      </div>

      {/* Sélection de la paroisse - visible seulement si un secteur est sélectionné */}
      {secteur && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <label htmlFor="paroisse" className="block text-sm font-semibold text-gray-700">
            Paroisse {required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              id="paroisse"
              value={paroisse}
              onChange={(e) => onParoisseChange(e.target.value)}
              onBlur={() => onBlur?.('paroisse')}
              disabled={disabled || paroisses.length === 0}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                error.paroisse
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''}`}
            >
              <option value="">Sélectionnez une paroisse...</option>
              {paroisses.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
          {error.paroisse && (
            <p className="text-red-600 text-sm flex items-center space-x-1">
              <span>⚠</span>
              <span>{error.paroisse}</span>
            </p>
          )}
          {paroisses.length > 0 && !paroisse && (
            <p className="text-sm text-blue-600">
              ℹ️ {paroisses.length} paroisse(s) disponible(s) dans le secteur {secteur}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
