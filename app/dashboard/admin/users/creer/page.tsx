//app/dashboard/admin/users/creer/page.tsx - AVEC SECTEURS/PAROISSES
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { SECTEURS, useSecteurParoisse } from '@/lib/secteurs-paroisses';

interface Role {
  _id: string;
  nom: string;
  permissions: string[];
}

interface UtilisateurFormData {
  prenom: string;
  nom: string;
  email: string;
  roleId: string;
  telephone: string;
}

interface ValidationErrors {
  prenom?: string;
  nom?: string;
  email?: string;
  roleId?: string;
  telephone?: string;
  secteur?: string;
  paroisse?: string;
}

export default function CreationUtilisateurPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // ✅ Hook pour gérer secteur/paroisse
  const { secteur, setSecteur, paroisse, setParoisse, paroisses } = useSecteurParoisse();

  const [formData, setFormData] = useState<UtilisateurFormData>({
    prenom: '',
    nom: '',
    email: '',
    roleId: '',
    telephone: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles', { credentials: 'include' });
        if (!response.ok) throw new Error('Erreur lors du chargement des rôles');
        const data = await response.json();
        setRoles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const validateField = (name: keyof (UtilisateurFormData & { secteur: string; paroisse: string }), value: string): string => {
    switch (name) {
      case 'prenom':
        if (!value.trim()) return 'Le prénom est requis';
        if (value.length < 2) return 'Le prénom doit contenir au moins 2 caractères';
        return '';
      
      case 'nom':
        if (!value.trim()) return 'Le nom est requis';
        if (value.length < 2) return 'Le nom doit contenir au moins 2 caractères';
        return '';
      
      case 'email':
        if (!value.trim()) return 'L\'email est requis';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Format d\'email invalide';
        return '';
      
      case 'roleId':
        if (!value) return 'Le rôle est requis';
        return '';
      
      case 'telephone':
        if (value && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/.test(value)) {
          return 'Format de téléphone invalide';
        }
        return '';
      
      case 'secteur':
        if (!value.trim()) return 'Le secteur est requis';
        return '';
      
      case 'paroisse':
        if (!value.trim()) return 'La paroisse est requise';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (field: keyof UtilisateurFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (step === 1) {
      ['prenom', 'nom', 'email', 'roleId'].forEach(field => {
        const error = validateField(field as keyof UtilisateurFormData, formData[field as keyof UtilisateurFormData]);
        if (error) newErrors[field as keyof ValidationErrors] = error;
      });
    } else if (step === 2) {
      const secteurError = validateField('secteur', secteur);
      if (secteurError) newErrors.secteur = secteurError;
      
      const paroisseError = validateField('paroisse', paroisse);
      if (paroisseError) newErrors.paroisse = paroisseError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!validateStep(1) || !validateStep(2)) {
      setError('Veuillez corriger les erreurs dans le formulaire');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          secteur,
          paroisse
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(`Utilisateur ${formData.prenom} ${formData.nom} créé avec succès !`);
        
        setTimeout(() => {
          router.push('/dashboard/admin/users');
        }, 2000);
      } else {
        setError(result.message || 'Erreur lors de la création');
      }
    } catch (err) {
      setError('Erreur réseau lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: '👤' },
    { number: 2, title: 'Localisation', icon: '📍' },
    { number: 3, title: 'Confirmation', icon: '✓' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-lg border border-blue-100">
            <div className="p-3 bg-blue-100 rounded-xl">
              <span className="text-3xl">👥</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nouvel Utilisateur
              </h1>
              <p className="text-gray-600 mt-2">Ajoutez un nouveau membre à votre équipe</p>
            </div>
          </div>
        </header>

        {/* Barre de progression */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className={`flex flex-col items-center relative z-10 ${
                  step.number === currentStep ? 'scale-110' : ''
                } transition-transform duration-300`}>
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300
                    ${step.number === currentStep 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                      : step.number < currentStep
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-400 border-gray-300'
                    }
                  `}>
                    {step.number < currentStep ? '✓' : step.icon}
                  </div>
                  <span className={`
                    text-sm font-medium mt-2 text-center transition-colors duration-300
                    ${step.number === currentStep ? 'text-blue-600 font-semibold' : 'text-gray-500'}
                  `}>
                    {step.title}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-green-500 transition-all duration-500 ease-out ${
                        step.number < currentStep ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="animate-slide-down mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="animate-slide-down mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3">
            <span className="text-xl">🎉</span>
            <span className="flex-1">{success}</span>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8 animate-fade-in-up">
          
          {/* STEP 1: Informations personnelles */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.prenom ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Jean"
                  />
                  {errors.prenom && (
                    <p className="text-red-500 text-sm mt-2 animate-pulse">⚠️ {errors.prenom}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nom"
                    type="text"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.nom ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Dupont"
                  />
                  {errors.nom && (
                    <p className="text-red-500 text-sm mt-2 animate-pulse">⚠️ {errors.nom}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="jean.dupont@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 animate-pulse">⚠️ {errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle <span className="text-red-500">*</span>
                </label>
                <select
                  id="roleId"
                  value={formData.roleId}
                  onChange={(e) => handleInputChange('roleId', e.target.value)}
                  className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.roleId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionnez un rôle</option>
                  {roles.map(role => (
                    <option key={role._id} value={role._id}>
                      {role.nom.toUpperCase()} ({role.permissions.length} permissions)
                    </option>
                  ))}
                </select>
                {errors.roleId && (
                  <p className="text-red-500 text-sm mt-2 animate-pulse">⚠️ {errors.roleId}</p>
                )}
              </div>

              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="+225 00 00 00 00 00"
                />
                {errors.telephone && (
                  <p className="text-red-500 text-sm mt-2 animate-pulse">⚠️ {errors.telephone}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Localisation avec Secteur/Paroisse */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ✅ Secteur (liste déroulante) */}
                <div>
                  <label htmlFor="secteur" className="block text-sm font-medium text-gray-700 mb-2">
                    Secteur <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="secteur"
                    value={secteur}
                    onChange={(e) => {
                      setSecteur(e.target.value);
                      const error = validateField('secteur', e.target.value);
                      setErrors(prev => ({ ...prev, secteur: error }));
                    }}
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.secteur ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez un secteur</option>
                    {SECTEURS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.secteur && (
                    <p className="text-red-500 text-sm mt-2 animate-pulse">⚠️ {errors.secteur}</p>
                  )}
                </div>

                {/* ✅ Paroisse (dépend du secteur) */}
                <div>
                  <label htmlFor="paroisse" className="block text-sm font-medium text-gray-700 mb-2">
                    Paroisse <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="paroisse"
                    value={paroisse}
                    onChange={(e) => {
                      setParoisse(e.target.value);
                      const error = validateField('paroisse', e.target.value);
                      setErrors(prev => ({ ...prev, paroisse: error }));
                    }}
                    disabled={!secteur}
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.paroisse ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">
                      {secteur ? 'Sélectionnez une paroisse' : 'Sélectionnez d\'abord un secteur'}
                    </option>
                    {paroisses.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.paroisse && (
                    <p className="text-red-500 text-sm mt-2 animate-pulse">⚠️ {errors.paroisse}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmation */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800">Récapitulatif</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-600">Nom complet:</span>
                      <p className="text-gray-800">{formData.prenom} {formData.nom}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <p className="text-gray-800">{formData.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Rôle:</span>
                      <p className="text-gray-800 capitalize">
                        {roles.find(r => r._id === formData.roleId)?.nom}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-600">Téléphone:</span>
                      <p className="text-gray-800">{formData.telephone || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Secteur:</span>
                      <p className="text-gray-800">{secteur}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Paroisse:</span>
                      <p className="text-gray-800">{paroisse}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">ℹ️</span>
                  <h4 className="font-semibold text-blue-800">Information</h4>
                </div>
                <p className="text-blue-700 text-sm">
                  Un email de bienvenue avec un mot de passe temporaire sera envoyé à l'utilisateur.
                  Il devra changer son mot de passe lors de sa première connexion.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-8 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              ← Précédent
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium transform hover:scale-105"
              >
                Suivant →
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium transform hover:scale-105 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Création en cours...
                  </span>
                ) : (
                  '🎉 Créer l\'utilisateur'
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
    </div>
  );
}