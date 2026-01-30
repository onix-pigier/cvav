//app/change-password/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function ChangePasswordPage() {
  const [showPassword, setShowPassword] = useState({
    actuel: false,
    nouveau: false,
    confirmation: false
  });
  const [formData, setFormData] = useState({
    motDePasseActuel: '',
    nouveauMotDePasse: '',
    confirmationMotDePasse: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirection si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const togglePasswordVisibility = (field: 'actuel' | 'nouveau' | 'confirmation') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validations
    if (formData.nouveauMotDePasse.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (formData.nouveauMotDePasse !== formData.confirmationMotDePasse) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          motDePasseActuel: formData.motDePasseActuel,
          nouveauMotDePasse: formData.nouveauMotDePasse
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Mot de passe changé avec succès ! Redirection...');
        // Redirection après 2 secondes
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-svh bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-svh bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600">Redirection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center p-6">
      {/* Bouton de retour vers l'accueil - IDENTIQUE au login */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <button className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Accueil
            </span>
          </button>
        </Link>
      </div>

      <div className="w-full max-w-4xl">
        <div className="apple-card overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Formulaire - MÊME DESIGN que login */}
            <div className="p-8 md:p-10">
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Changer le mot de passe
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Bonjour <strong>{user?.prenom || 'Utilisateur'}</strong>, veuillez définir votre nouveau mot de passe
                  </p>
                </div>

                {/* Message d'erreur - STYLE IDENTIQUE */}
                {error && (
                  <div className="relative px-4 py-3 rounded-lg text-sm 
                                bg-white/30 backdrop-blur-md 
                                border border-red-300 
                                text-red-600 shadow-lg 
                                animate-fadeIn">
                    {error}
                  </div>
                )}

                {/* Message de succès */}
                {success && (
                  <div className="relative px-4 py-3 rounded-lg text-sm 
                                bg-white/30 backdrop-blur-md 
                                border border-green-300 
                                text-green-600 shadow-lg 
                                animate-fadeIn">
                    {success}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Mot de passe actuel */}
                  <div>
                    <label htmlFor="motDePasseActuel" className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe temporaire
                    </label>
                    <div className="relative">
                      <input
                        id="motDePasseActuel"
                        type={showPassword.actuel ? "text" : "password"}
                        placeholder="Votre mot de passe temporaire"
                        className="input-apple hide-password-toggle pr-12"
                        required
                        value={formData.motDePasseActuel}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('actuel')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                      >
                        {showPassword.actuel ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Nouveau mot de passe */}
                  <div>
                    <label htmlFor="nouveauMotDePasse" className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="nouveauMotDePasse"
                        type={showPassword.nouveau ? "text" : "password"}
                        placeholder="Votre nouveau mot de passe"
                        className="input-apple hide-password-toggle pr-12"
                        required
                        value={formData.nouveauMotDePasse}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('nouveau')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                      >
                        {showPassword.nouveau ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
                  </div>

                  {/* Confirmation mot de passe */}
                  <div>
                    <label htmlFor="confirmationMotDePasse" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="confirmationMotDePasse"
                        type={showPassword.confirmation ? "text" : "password"}
                        placeholder="Confirmez votre nouveau mot de passe"
                        className="input-apple hide-password-toggle pr-12"
                        required
                        value={formData.confirmationMotDePasse}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirmation')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                      >
                        {showPassword.confirmation ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bouton - MÊME STYLE que login */}
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground shadow-xs h-9 px-4 py-2 has-[>svg]:px-3 w-full bg-blue-500 hover:bg-blue-600 rounded-full"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Changement...
                      </>
                    ) : (
                      'Changer le mot de passe'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Image - EXACTEMENT LA MÊME que login */}
            <div className="hidden md:block relative bg-linear-to-br from-blue-500 to-blue-600">
              <Image 
                src="/photo1.png" 
                alt="Interface moderne" 
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}