"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi d'email
    (async () => {
      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        // On affiche le message générique indépendamment du résultat
        setIsSubmitted(true);
      } catch (err) {
        // afficher quand même message générique pour éviter de révéler l'existence d'un email
        setIsSubmitted(true);
      }
    })();
  };

  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Formulaire */}
            <div className="p-8 md:p-10">
              <div className="flex flex-col gap-6">
                
                {/* Bouton Retour */}
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-300 font-medium self-start"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Retour à la connexion
                </Link>

                <div className="text-center">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
                    Mot de passe oublié
                  </h1>
                  <p className="text-gray-600 text-sm leading-6">
                    Veuillez saisir votre email pour réinitialiser votre mot de passe
                  </p>
                </div>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Champ Email */}
                    <div>
                      <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2 tracking-tight">
                        Adresse email
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        placeholder="votre@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-sans"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    {/* Message d'information
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-300 font-sans leading-5">
                        Un email de réinitialisation vous sera envoyé à cette adresse.
                        Contactez l'administrateur si vous ne recevez rien.
                      </p>
                    </div> */}
                    
                    {/* Bouton Envoyer */}
                    <button 
                      type="submit" 
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-300 text-white shadow-xs h-12 px-4 w-full bg-blue-400 hover:bg-blue-500 rounded-xl font-sans tracking-tight"
                    >
                      Envoyer l'email 
                    </button>
                  </form>
                ) : (
                  /* Message de confirmation */
                  <div className="text-center space-y-6 font-sans">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">Email envoyé !</h2>
                      <p className="text-gray-600 text-sm leading-6">
                        Si votre adresse existe dans notre système, vous recevrez un email contenant un lien pour réinitialiser votre mot de passe.
                      </p>
                    </div>
                    <Link 
                      href="/login" 
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all text-white shadow-xs h-12 px-4 w-full bg-blue-400 hover:bg-blue-500 rounded-xl font-sans tracking-tight"
                    >
                      Retour à la connexion
                    </Link>
                  </div>
                )}

                <div className="text-center text-sm text-gray-600 font-sans">
                  <p className="leading-6">
                    Vous n'avez pas de compte ?{' '}
                    <a href="#" className="font-bold text-blue-400 hover:text-blue-500">
                      Contacter l'administration
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="hidden md:block relative bg-linear-to-br from-blue-500 to-blue-600">
              <Image 
                src="/photo1.png" 
                alt="Interface moderne" 
                fill
                className="object-cover"
              />
        
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}