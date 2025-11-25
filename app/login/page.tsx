// "use client";

// import { useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useAuth } from '@/lib/AuthContext';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState('');
//   const [motDePasse, setMotDePasse] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
 
//   const  { login} = useAuth();
//   const router = useRouter()

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const result = await login(email, motDePasse);
//       if (result.success) {
//         router.push('/dashboard');
//       } else {
//         setError(result.message || 'Erreur de connexion.');
//       }
//     } catch (error) {
//       setError('un erreur s\'est produite.');
//     } finally {
//       setLoading(false);
//     }
//   };

    
//   return (
//     <div className="min-h-svh bg-gray-50 flex items-center justify-center p-6">
//       {/* Bouton de retour vers l'accueil */}
//       <div className="absolute top-6 left-6">
//         <Link href="/">
//           <button className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50">
//             <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             <span className="text-sm font-medium text-gray-700">
//               Accueil
//             </span>
//           </button>
//         </Link>
//       </div>

//       <div className="w-full max-w-4xl">
//         <div className="apple-card overflow-hidden">
//           <div className="grid md:grid-cols-2">
//             {/* Formulaire */}
//             <div className="p-8 md:p-10">
//               <div className="flex flex-col gap-6">
//                 <div className="text-center">
//                   <h1 className="text-2xl font-semibold text-gray-900 mb-2">
//                     Connexion
//                   </h1>
//                   <p className="text-gray-600 text-sm">
//                     Accédez à votre compte
//                   </p>
//                 </div>

//                  {/* Message d'erreur */}
//                 {error && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//                     {error}
//                   </div>
//                 )}

//                 <form className="space-y-6" onSubmit={handleSubmit}>
//                   {/* Email */}
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                       Email
//                     </label>
//                     <input
//                       id="email"
//                       type="email"
//                       placeholder="votre@email.com"
//                       className="input-apple"
//                       required
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       disabled={loading}
//                     />
//                   </div>

//                   {/* Mot de passe */}
//                   <div>
//                     <div className="flex items-center justify-between mb-2">
//                       <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                         Mot de passe
//                       </label>
//                       <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
//                         Mot de passe oublié ?
//                       </Link>
//                     </div>
//                     <div className="relative">
//                       <input
//                         id="password"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Votre mot de passe"
//                         className="input-apple hide-password-toggle pr-12"
//                         required
//                         value={motDePasse}
//                         onChange={(e) => setMotDePasse(e.target.value)}
//                         disabled={loading}
//                       />
//                       <button
//                         type="button"
//                         onClick={togglePasswordVisibility}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                         disabled={loading}
//                       >
//                         {showPassword ? (
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                         ) : (
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
//                   </div>
                        
//                   <Link href="/dashboard">
//                   <button type="submit" 
//                    className="  inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground shadow-xs h-9 px-4 py-2 has-[>svg]:px-3 w-full bg-blue-300 hover:bg-blue-400/80 rounded-full"
//                     disabled={loading}>
//                     Se connecter
//                   </button>
//                   </Link>
//                 </form>

//                 <div className="text-center text-sm text-gray-600">
//                   <p>
//                     Pas de compte ?{' '}
//                     <a href="#" className="font-medium text-blue-600 hover:text-blue-700">
//                       Contacter l'administration
//                     </a>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Image */}
//             <div className="hidden md:block relative bg-linear-to-br from-blue-500 to-blue-600">
//               <Image 
//                 src="/photo1.png" 
//                 alt="Interface moderne" 
//                 fill
//                 className="object-cover"
//               />
//               <div className="absolute inset-0 bg-black/10"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [ formData, setFormData ] = useState({
    email: '',
    motDePasse: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('donnée du formulaire:', formData);

    try {
      const result = await login(formData.email, formData.motDePasse);
      
      if (result.success) {
        // Redirection basée sur le rôle ou autres conditions
        router.push('/dashboard');
      } else {
        setError(result.message || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center p-6">
      {/* Bouton de retour vers l'accueil */}
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
            {/* Formulaire */}
            <div className="p-8 md:p-10">
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Connexion
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Accédez à votre compte
                  </p>
                </div>

                {/* Message d'erreur */}
                {error && (
  <div className="relative px-4 py-3 rounded-lg text-sm 
                  bg-white/30 backdrop-blur-md 
                  border border-red-300 
                  text-red-600 shadow-lg 
                  animate-fadeIn">
     {error}
  </div>
)}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      className="input-apple"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Mot de passe */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Mot de passe
                      </label>
                      <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="motDePasse"
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        className="input-apple hide-password-toggle pr-12"
                        required
                        value={formData.motDePasse}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                      >
                        {showPassword ? (
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
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </button>
                </form>

                <div className="text-center text-sm text-gray-600">
                  <p>
                    Pas de compte ?{' '}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-700">
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