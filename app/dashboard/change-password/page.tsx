//app/dashboard/change-password/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChangePasswordVoluntaryPage() {
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
  const [activeField, setActiveField] = useState<string | null>(null);

  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Redirection si non authentifié
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
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.motDePasseActuel) {
      setError('Veuillez entrer votre mot de passe actuel');
      setLoading(false);
      return;
    }

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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          motDePasseActuel: formData.motDePasseActuel,
          nouveauMotDePasse: formData.nouveauMotDePasse,
          isForcedChange: false
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Mot de passe mis à jour avec succès !');
        setTimeout(() => router.push('/profil'), 1500);
      } else {
        setError(data.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/profil');
  };

  // Animations personnalisées
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.05 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-cyan-400 text-lg font-light">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background animé avec gradient dynamique */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/10"></div>
      
      {/* Éléments décoratifs animés */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Container principal */}
      <motion.div
        ref={containerRef}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        className="relative z-10 min-h-screen flex items-center justify-center p-6"
      >
        <div className="w-full max-w-2xl">
          {/* En-tête */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-cyan-500/25"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              Sécurité
            </motion.h1>
            
            <motion.p 
              className="text-gray-400 text-lg font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Mettez à jour votre mot de passe
            </motion.p>
          </motion.div>

          {/* Carte du formulaire */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8 shadow-2xl"
          >
            {/* Messages d'état */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-red-400 text-sm font-medium">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">{success}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                {
                  id: 'motDePasseActuel',
                  label: 'Mot de passe actuel',
                  placeholder: '••••••••',
                  field: 'actuel' as const
                },
                {
                  id: 'nouveauMotDePasse',
                  label: 'Nouveau mot de passe',
                  placeholder: 'Votre nouveau mot de passe',
                  field: 'nouveau' as const
                },
                {
                  id: 'confirmationMotDePasse',
                  label: 'Confirmation',
                  placeholder: 'Confirmez le mot de passe',
                  field: 'confirmation' as const
                }
              ].map((fieldConfig, index) => (
                <motion.div
                  key={fieldConfig.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">
                    {fieldConfig.label}
                  </label>
                  
                  <motion.div 
                    className={`relative transition-all duration-300 ${
                      activeField === fieldConfig.id ? 'transform scale-105' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <input
                      id={fieldConfig.id}
                      type={showPassword[fieldConfig.field] ? "text" : "password"}
                      placeholder={fieldConfig.placeholder}
                      className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm"
                      required
                      value={formData[fieldConfig.id as keyof typeof formData]}
                      onChange={handleChange}
                      onFocus={() => setActiveField(fieldConfig.id)}
                      onBlur={() => setActiveField(null)}
                      disabled={loading}
                    />
                    
                    <motion.button
                      type="button"
                      onClick={() => togglePasswordVisibility(fieldConfig.field)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword[fieldConfig.field] ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}

              {/* Boutons d'action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex space-x-4 pt-4"
              >
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-800/50 text-gray-400 py-4 px-6 rounded-xl border border-gray-700 hover:border-gray-600 hover:text-white transition-all duration-300 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Annuler
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%]"
                    whileHover={{ translateX: "200%" }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  {loading ? (
                    <motion.span className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Mise à jour...</span>
                    </motion.span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Sécuriser</span>
                    </span>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          {/* Indicateur de sécurité */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-8"
          >
            <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>Connexion sécurisée • Cryptage AES-256</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}