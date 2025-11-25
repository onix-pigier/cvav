'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function UtilisateursPage() {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = '/'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-600 via-blue-600 to-cyan-500">
      <div className="text-center text-white p-8">
        {/* Effet de lumières */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-20 bg-linear-to-r from-transparent via-white to-transparent transform rotate-12 animate-pulse"></div>
        </div>

        {/* Contenu principal */}
        <div className="relative z-10">
          {/* Chiffres 404 avec dégradé */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-black mb-4 leading-none">
              <span className="bg-linear-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent animate-pulse">
                4
              </span>
              <span className="bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
                0
              </span>
              <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent animate-pulse">
                4
              </span>
            </h1>
          </div>

          {/* Message */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-linear-to-r from-white to-gray-200 bg-clip-text text-transparent">
              PAGE NON TROUVÉE
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-2">
              Oups ! La page que vous recherchez s'est égarée dans le cosmos.
            </p>
            <p className="text-lg text-gray-300">
              Redirection automatique dans {countdown} secondes...
            </p>
          </div>

          {/* Illustration/Icone */}
          <div className="mb-12 text-8xl animate-bounce">
            🚀
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/"
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              🏠 Retour à l'accueil
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              ↩️ Retour arrière
            </button>
          </div>

          {/* Message amusant */}
          <div className="mt-12 p-6 bg-black bg-opacity-20 rounded-2xl backdrop-blur-sm">
            <p className="text-lg text-gray-200 italic">
              "Même les astronautes se perdent parfois dans l'espace..."
            </p>
          </div>
        </div>

        {/* Étoiles animées en arrière-plan */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Styles CSS pour l'animation des étoiles */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 3s infinite;
        }
      `}</style>
    </div>
  )
}