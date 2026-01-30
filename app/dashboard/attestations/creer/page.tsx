// // app/dashboard/attestations/creer/page.tsx
// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { ArrowLeft, Save, Send, Loader2, FileText, User, MapPin, Calendar } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';

// export default function CreerAttestationPage() {
//   const router = useRouter();
  
//   const [formData, setFormData] = useState({
//     prenom: '',
//     nom: '',
//     paroisse: '',
//     secteur: '',
//     anneeFinFormation: new Date().getFullYear() - 1,
//     lieuDernierCamp: ''
//   });
  
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (soumise: boolean) => {
//     if (!formData.prenom || !formData.nom || !formData.paroisse || !formData.secteur) {
//       toast.error('Veuillez remplir tous les champs obligatoires');
//       return;
//     }

//     if (formData.anneeFinFormation >= new Date().getFullYear()) {
//       toast.error('L\'année de formation doit être dans le passé');
//       return;
//     }

//     const loadingToast = toast.loading(soumise ? 'Soumission...' : 'Sauvegarde...');
//     setLoading(true);

//     try {
//       const res = await fetch('/api/attestations', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ ...formData, soumise })
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message || 'Erreur');
//       }

//       toast.success(soumise ? 'Demande soumise !' : 'Brouillon sauvegardé', { id: loadingToast });
//       router.push('/dashboard/attestations');
//     } catch (error: any) {
//       toast.error(error.message, { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Toaster position="top-right" />
      
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 sm:p-6 lg:p-8">
//         <div className="max-w-3xl mx-auto space-y-6">
          
//           <div className="flex items-center gap-4">
//             <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-lg">
//               <ArrowLeft className="h-5 w-5 text-slate-600" />
//             </button>
//             <div>
//               <h1 className="text-2xl font-semibold text-slate-900">Nouvelle Demande d'Attestation</h1>
//               <p className="text-sm text-slate-600 mt-1">Remplissez le formulaire ci-dessous</p>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <User className="h-5 w-5 text-blue-600" />
//                 <h2 className="text-lg font-semibold text-slate-900">Informations du Militant</h2>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Prénom <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text" name="prenom" value={formData.prenom} onChange={handleChange}
//                     className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                     placeholder="Prénom" required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Nom <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text" name="nom" value={formData.nom} onChange={handleChange}
//                     className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                     placeholder="Nom" required
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <MapPin className="h-5 w-5 text-blue-600" />
//                 <h2 className="text-lg font-semibold text-slate-900">Localisation</h2>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Paroisse <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text" name="paroisse" value={formData.paroisse} onChange={handleChange}
//                     className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                     placeholder="Paroisse" required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Secteur <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text" name="secteur" value={formData.secteur} onChange={handleChange}
//                     className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                     placeholder="Secteur" required
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <Calendar className="h-5 w-5 text-blue-600" />
//                 <h2 className="text-lg font-semibold text-slate-900">Formation</h2>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Année de fin <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number" name="anneeFinFormation" value={formData.anneeFinFormation} onChange={handleChange}
//                     min="1950" max={new Date().getFullYear() - 1}
//                     className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Lieu dernier camp <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text" name="lieuDernierCamp" value={formData.lieuDernierCamp} onChange={handleChange}
//                     className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                     placeholder="Camp de..." required
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3">
//             <button onClick={() => router.back()} className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50" disabled={loading}>
//               Annuler
//             </button>
//             <button onClick={() => handleSubmit(false)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50" disabled={loading}>
//               {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
//               Brouillon
//             </button>
//             <button onClick={() => handleSubmit(true)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
//               {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
//               Soumettre
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// app/dashboard/attestations/creer/page.tsx - VERSION FINALE COMPLÈTE
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, Loader2, User, MapPin, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import FileUpload from '@/components/FileUpload';
import SecteurParoisseSelect from '@/components/SecteurParoisseSelect';
import { SECTEURS_PAROISSES } from '@/lib/secteurs-paroisses';

export default function CreerAttestationPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    paroisse: '',
    secteur: '',
    anneeFinFormation: new Date().getFullYear() - 1,
    lieuDernierCamp: '',
    bulletinScanne: '' // ID du fichier uploadé
  });
  
  const [paroisses, setParoisses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ✅ Mettre à jour la liste des paroisses quand le secteur change
  useEffect(() => {
    if (formData.secteur) {
      const newParoisses = SECTEURS_PAROISSES[formData.secteur as keyof typeof SECTEURS_PAROISSES] || [];
      setParoisses(newParoisses);

      if (!newParoisses.includes(formData.paroisse)) {
        setFormData(prev => ({ ...prev, paroisse: '' }));
      }
    } else {
      setParoisses([]);
      setFormData(prev => ({ ...prev, paroisse: '' }));
    }
  }, [formData.secteur]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSecteurChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, secteur: value }));
    if (errors.secteur) {
      setErrors(prev => ({ ...prev, secteur: '' }));
    }
  }, [errors.secteur]);

  const handleParoisseChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, paroisse: value }));
    if (errors.paroisse) {
      setErrors(prev => ({ ...prev, paroisse: '' }));
    }
  }, [errors.paroisse]);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleFileUploaded = (fileId: string) => {
    setFormData(prev => ({ ...prev, bulletinScanne: fileId }));
  };

  const handleSubmit = async (soumise: boolean) => {
    // ✅ Validation différente selon le mode
    if (soumise) {
      // Mode soumission : TOUS les champs obligatoires
      if (!formData.prenom || !formData.nom || !formData.paroisse || 
          !formData.secteur || !formData.lieuDernierCamp) {
        toast.error('Tous les champs sont requis pour soumettre');
        return;
      }
    } else {
      // Mode brouillon : MINIMUM nom + prénom
      if (!formData.prenom || !formData.nom) {
        toast.error('Prénom et nom requis pour sauvegarder');
        return;
      }
    }

    // Validation année
    if (formData.anneeFinFormation >= new Date().getFullYear()) {
      toast.error('L\'année de formation doit être dans le passé');
      return;
    }

    const loadingToast = toast.loading(
      soumise ? '📤 Soumission en cours...' : '💾 Sauvegarde du brouillon...'
    );
    setLoading(true);

    try {
      const res = await fetch('/api/attestations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          ...formData, 
          soumise // ✅ Indique si c'est un brouillon ou une soumission
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur serveur');
      }

      const data = await res.json();
      
      toast.success(
        soumise 
          ? '✅ Demande soumise avec succès ! Les admins ont été notifiés.'
          : '✅ Brouillon sauvegardé. Vous pourrez le finaliser plus tard.',
        { id: loadingToast, duration: 4000 }
      );
      
      // Redirection après succès
      setTimeout(() => {
        router.push('/dashboard/attestations');
      }, 1000);
      
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Une erreur est survenue', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 sm:p-6 lg:p-8">
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
                Nouvelle Demande d'Attestation
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Remplissez le formulaire ci-dessous
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            
            {/* Section Militant */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Informations du Militant
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Entrez le prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Entrez le nom"
                  />
                </div>
              </div>
            </div>

            {/* Section Localisation */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Localisation
                </h2>
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

            {/* Section Formation */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Formation
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Année de fin de formation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="anneeFinFormation"
                    value={formData.anneeFinFormation}
                    onChange={handleChange}
                    min="1950"
                    max={new Date().getFullYear() - 1}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lieu du dernier camp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lieuDernierCamp"
                    value={formData.lieuDernierCamp}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Ex: Camp de la Forêt"
                  />
                </div>
              </div>
            </div>

            {/* Section Upload Fichier */}
            <FileUpload
              label="Bulletin scanné (optionnel pour brouillon)"
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={5}
              onFileUploaded={handleFileUploaded}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              Sauvegarder en brouillon
            </button>
            
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              Soumettre aux admins
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900 mb-1">
                  Différence Brouillon / Soumission
                </p>
                <ul className="text-xs text-amber-800 space-y-1">
                  <li>• <strong>Brouillon :</strong> Enregistre votre demande. Vous pourrez la modifier et la soumettre plus tard.</li>
                  <li>• <strong>Soumettre :</strong> Envoie directement la demande aux administrateurs pour validation.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}