// app/dashboard/attestations/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Send, Loader2, FileText, User, MapPin, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SecteurParoisseSelect from '@/components/SecteurParoisseSelect';

export default function EditAttestationPage() {
  const router = useRouter();
  const params = useParams();
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    paroisse: '',
    secteur: '',
    anneeFinFormation: new Date().getFullYear() - 1,
    lieuDernierCamp: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [soumise, setSoumise] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchDemande();
  }, [params.id]);

  const fetchDemande = async () => {
    try {
      const res = await fetch(`/api/attestations/${params.id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Non trouvée');
      
      const data = await res.json();
      
      // Vérifier si déjà soumise
      if (data.soumise) {
        toast.error('Cette demande a déjà été soumise et ne peut plus être modifiée');
        router.push('/dashboard/attestations');
        return;
      }
      
      setFormData({
        prenom: data.prenom,
        nom: data.nom,
        paroisse: data.paroisse,
        secteur: data.secteur,
        anneeFinFormation: data.anneeFinFormation,
        lieuDernierCamp: data.lieuDernierCamp
      });
      setSoumise(data.soumise);
    } catch (error) {
      toast.error('Erreur chargement');
      router.push('/dashboard/attestations');
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
    setFormData(prev => ({ ...prev, secteur: value }));
    if (errors.secteur) {
      setErrors(prev => ({ ...prev, secteur: '' }));
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

  const handleSubmit = async (shouldSubmit: boolean) => {
    if (!formData.prenom || !formData.nom || !formData.paroisse || !formData.secteur) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.anneeFinFormation >= new Date().getFullYear()) {
      toast.error('L\'année de formation doit être dans le passé');
      return;
    }

    const loadingToast = toast.loading(shouldSubmit ? 'Soumission...' : 'Sauvegarde...');
    setSaving(true);

    try {
      const res = await fetch(`/api/attestations/${params.id}`, {
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

      toast.success(
        shouldSubmit ? 'Demande soumise avec succès !' : 'Modifications sauvegardées',
        { id: loadingToast }
      );
      
      router.push('/dashboard/attestations');
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Modifier la Demande</h1>
              <p className="text-sm text-slate-600 mt-1">Modifiez les informations ci-dessous</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Informations du Militant</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="prenom" value={formData.prenom} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Prénom" required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="nom" value={formData.nom} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Nom" required
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Localisation</h2>
              </div>
              <SecteurParoisseSelect
                secteur={formData.secteur}
                paroisse={formData.paroisse}
                onSecteurChange={handleSecteurChange}
                onParoisseChange={handleParoisseChange}
                onBlur={handleBlur}
                error={{
                  secteur: touched.secteur ? errors.secteur : '',
                  paroisse: touched.paroisse ? errors.paroisse : ''
                }}
                required
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Formation</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Année de fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" name="anneeFinFormation" value={formData.anneeFinFormation} onChange={handleChange}
                    min="1950" max={new Date().getFullYear() - 1}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lieu dernier camp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="lieuDernierCamp" value={formData.lieuDernierCamp} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Camp de..." required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => router.back()} 
              className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              disabled={saving}
            >
              Annuler
            </button>
            
            <button 
              onClick={() => handleSubmit(false)} 
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Sauvegarder
            </button>
            
            <button 
              onClick={() => handleSubmit(true)} 
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              Soumettre
            </button>
          </div>
        </div>
      </div>
    </>
  );
}