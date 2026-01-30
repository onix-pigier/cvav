// app/dashboard/ceremonies/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Send, Loader2, MapPin, Gift, Users, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SecteurParoisseSelect from '@/components/SecteurParoisseSelect';

export default function EditCeremoniePage() {
  const router = useRouter();
  const params = useParams();
  
  const [formData, setFormData] = useState({
    Secteur: '',
    paroisse: '',
    foulardsBenjamins: 0,
    foulardsCadets: 0,
    foulardsAines: 0,
    dateCeremonie: '',
    lieuxCeremonie: '',
    nombreParrains: 0,
    nombreMarraines: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchDemande();
  }, [params.id]);

  const fetchDemande = async () => {
    try {
      const res = await fetch(`/api/ceremonies/${params.id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Non trouvée');
      
      const data = await res.json();
      
      if (data.soumise) {
        toast.error('Cette demande a déjà été soumise et ne peut plus être modifiée');
        router.push('/dashboard/ceremonies');
        return;
      }
      
      setFormData({
        Secteur: data.Secteur,
        paroisse: data.paroisse,
        foulardsBenjamins: data.foulardsBenjamins,
        foulardsCadets: data.foulardsCadets,
        foulardsAines: data.foulardsAines,
        dateCeremonie: data.dateCeremonie ? data.dateCeremonie.split('T')[0] : '',
        lieuxCeremonie: data.lieuxCeremonie,
        nombreParrains: data.nombreParrains,
        nombreMarraines: data.nombreMarraines
      });
    } catch (error) {
      toast.error('Erreur chargement');
      router.push('/dashboard/ceremonies');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSecteurChange = (value: string) => {
    setFormData(prev => ({ ...prev, Secteur: value }));
    if (errors.Secteur) {
      setErrors(prev => ({ ...prev, Secteur: '' }));
    }
  };

  const handleParoisseChange = (value: string) => {
    setFormData(prev => ({ ...prev, paroisse: value }));
    if (errors.paroisse) {
      setErrors(prev => ({ ...prev, paroisse: '' }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleNumberChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmit = async (shouldSubmit: boolean) => {
    if (!formData.Secteur || !formData.paroisse || !formData.dateCeremonie || !formData.lieuxCeremonie) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const loadingToast = toast.loading(shouldSubmit ? 'Soumission...' : 'Sauvegarde...');
    setSaving(true);

    try {
      const res = await fetch(`/api/ceremonies/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          ...formData, 
          soumise: shouldSubmit 
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur');
      }

      toast.success(shouldSubmit ? 'Demande soumise !' : 'Modifications sauvegardées', { id: loadingToast });
      router.push('/dashboard/ceremonies');
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const totalFoulards = formData.foulardsBenjamins + formData.foulardsCadets + formData.foulardsAines;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Modifier la Cérémonie</h1>
              <p className="text-sm text-slate-600 mt-1">Modifiez les informations ci-dessous</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            
            {/* Localisation */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-900">Localisation</h2>
              </div>
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
              <div className="flex items-center gap-2 mb-4">
                <Gift className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-900">Foulards</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Benjamins</label>
                  <input
                    type="number" name="foulardsBenjamins" value={formData.foulardsBenjamins} onChange={handleNumberChange}
                    min="0"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">Cadets</label>
                  <input
                    type="number" name="foulardsCadets" value={formData.foulardsCadets} onChange={handleNumberChange}
                    min="0"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">Ainés</label>
                  <input
                    type="number" name="foulardsAines" value={formData.foulardsAines} onChange={handleNumberChange}
                    min="0"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
              {totalFoulards > 0 && (
                <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">Total : {totalFoulards} foulards</p>
                </div>
              )}
            </div>

            {/* Cérémonie */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-900">Détails Cérémonie</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date" name="dateCeremonie" value={formData.dateCeremonie} onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lieu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="lieuxCeremonie" value={formData.lieuxCeremonie} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Parrains/Marraines */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-900">Accompagnateurs</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Parrains</label>
                  <input
                    type="number" name="nombreParrains" value={formData.nombreParrains} onChange={handleNumberChange}
                    min="0"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Marraines</label>
                  <input
                    type="number" name="nombreMarraines" value={formData.nombreMarraines} onChange={handleNumberChange}
                    min="0"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => router.back()} className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50" disabled={saving}>
              Annuler
            </button>
            <button onClick={() => handleSubmit(false)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50" disabled={saving}>
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Sauvegarder
            </button>
            <button onClick={() => handleSubmit(true)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50" disabled={saving}>
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              Soumettre
            </button>
          </div>
        </div>
      </div>
    </>
  );
}