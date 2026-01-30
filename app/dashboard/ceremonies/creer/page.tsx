// app/dashboard/ceremonies/creer/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, Loader2, Upload } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SecteurParoisseSelect from '@/components/SecteurParoisseSelect';
import { SECTEURS_PAROISSES } from '@/lib/secteurs-paroisses';

export default function CreerCeremoniePage() {
  const router = useRouter();
  
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    Secteur: '',
    paroisse: '',
    foulardsBenjamins: 0,
    foulardsCadets: 0,
    foulardsAines: 0,
    dateCeremonie: '',
    lieuxCeremonie: '',
    nombreParrains: 0,
    nombreMarraines: 0,
    courrierScanne: null as string | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSecteurChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, Secteur: value }));
    if (errors.Secteur) setErrors(prev => ({ ...prev, Secteur: '' }));
  }, [errors.Secteur]);

  const handleParoisseChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, paroisse: value }));
    if (errors.paroisse) setErrors(prev => ({ ...prev, paroisse: '' }));
  }, [errors.paroisse]);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (soumise: boolean) => {
    // Validation
    if (!formData.Secteur || !formData.paroisse || !formData.lieuxCeremonie || !formData.dateCeremonie) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (soumise && !formData.courrierScanne) {
      toast.error('Le courrier scanné est requis pour soumettre');
      return;
    }

    const loadingToast = toast.loading(
      soumise ? 'Soumission en cours...' : 'Sauvegarde du brouillon...'
    );
    setIsSaving(true);

    try {
      const res = await fetch('/api/ceremonies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          soumise
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur');
      }

      toast.success(
        soumise 
          ? 'Demande soumise avec succès !' 
          : 'Brouillon sauvegardé',
        { id: loadingToast }
      );

      router.push('/dashboard/ceremonies');
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  const totalFoulards = formData.foulardsBenjamins + formData.foulardsCadets + formData.foulardsAines;

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* En-tête */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Nouvelle Demande de Cérémonie
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Remplissez le formulaire ci-dessous
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            
            {/* Localisation */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Localisation
              </h2>
              
              <SecteurParoisseSelect
                secteur={formData.Secteur}
                paroisse={formData.paroisse}
                onSecteurChange={handleSecteurChange}
                onParoisseChange={handleParoisseChange}
                onBlur={handleBlur}
                error={{
                  secteur: touched.Secteur ? errors.Secteur : '',
                  paroisse: touched.paroisse ? errors.paroisse : ''
                }}
                required
              />
            </div>

            {/* Foulards */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Nombre de Foulards
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Benjamins
                  </label>
                  <input
                    type="number"
                    value={formData.foulardsBenjamins}
                    onChange={(e) => setFormData({...formData, foulardsBenjamins: parseInt(e.target.value) || 0})}
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Cadets
                  </label>
                  <input
                    type="number"
                    value={formData.foulardsCadets}
                    onChange={(e) => setFormData({...formData, foulardsCadets: parseInt(e.target.value) || 0})}
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    Ainés
                  </label>
                  <input
                    type="number"
                    value={formData.foulardsAines}
                    onChange={(e) => setFormData({...formData, foulardsAines: parseInt(e.target.value) || 0})}
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              {totalFoulards > 0 && (
                <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">
                    Total : {totalFoulards} foulards
                  </p>
                </div>
              )}
            </div>

            {/* Cérémonie */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Détails de la Cérémonie
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date de la cérémonie <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dateCeremonie}
                      onChange={(e) => setFormData({...formData, dateCeremonie: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Lieu de la cérémonie <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lieuxCeremonie}
                      onChange={(e) => setFormData({...formData, lieuxCeremonie: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Église Saint-Pierre"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Parrains/Marraines */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Accompagnateurs
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre de Parrains
                  </label>
                  <input
                    type="number"
                    value={formData.nombreParrains}
                    onChange={(e) => setFormData({...formData, nombreParrains: parseInt(e.target.value) || 0})}
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre de Marraines
                  </label>
                  <input
                    type="number"
                    value={formData.nombreMarraines}
                    onChange={(e) => setFormData({...formData, nombreMarraines: parseInt(e.target.value) || 0})}
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Document */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Courrier officiel <span className="text-red-500">*</span>
              </h2>
              
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-2">
                  Courrier de demande scanné (PDF)
                </p>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                  Choisir un fichier
                </button>
              </div>
            </div>

            {/* Note */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-800">
                💡 <strong>Astuce :</strong> Vous pouvez sauvegarder en brouillon et soumettre plus tard.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Sauvegarder en brouillon
            </button>
            
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Soumettre
            </button>
          </div>
        </div>
      </div>
    </>
  );
}