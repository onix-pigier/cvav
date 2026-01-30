// // //app/dashboard/admin/users/page.tsx
// // 'use client'

// // import Link from 'next/link'
// // import { useEffect, useState } from 'react'

// // export default function UtilisateursPage() {
// //   const [countdown, setCountdown] = useState(10)

// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setCountdown((prev) => {
// //         if (prev <= 1) {
// //           clearInterval(timer)
// //           window.location.href = '/'
// //           return 0
// //         }
// //         return prev - 1
// //       })
// //     }, 1000)

// //     return () => clearInterval(timer)
// //   }, [])

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-600 via-blue-600 to-cyan-500">
// //       <div className="text-center text-white p-8">
// //         {/* Effet de lumières */}
// //         <div className="absolute inset-0 overflow-hidden">
// //           <div className="absolute -inset-10 opacity-20 bg-linear-to-r from-transparent via-white to-transparent transform rotate-12 animate-pulse"></div>
// //         </div>

// //         {/* Contenu principal */}
// //         <div className="relative z-10">
// //           {/* Chiffres 404 avec dégradé */}
// //           <div className="mb-8">
// //             <h1 className="text-9xl md:text-[12rem] font-black mb-4 leading-none">
// //               <span className="bg-linear-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent animate-pulse">
// //                 4
// //               </span>
// //               <span className="bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
// //                 0
// //               </span>
// //               <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent animate-pulse">
// //                 4
// //               </span>
// //             </h1>
// //           </div>

// //           {/* Message */}
// //           <div className="mb-12">
// //             <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-linear-to-r from-white to-gray-200 bg-clip-text text-transparent">
// //               PAGE NON TROUVÉE
// //             </h2>
// //             <p className="text-xl md:text-2xl text-gray-200 mb-2">
// //               Oups ! La page que vous recherchez s'est égarée dans le cosmos.
// //             </p>
// //             <p className="text-lg text-gray-300">
// //               Redirection automatique dans {countdown} secondes...
// //             </p>
// //           </div>

// //           {/* Illustration/Icone */}
// //           <div className="mb-12 text-8xl animate-bounce">
// //             🚀
// //           </div>

// //           {/* Boutons d'action */}
// //           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
// //             <Link 
// //               href="/"
// //               className="bg-white text-blue-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
// //             >
// //               🏠 Retour à l'accueil
// //             </Link>
            
// //             <button 
// //               onClick={() => window.history.back()}
// //               className="border-2 border-white text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
// //             >
// //               ↩️ Retour arrière
// //             </button>
// //           </div>

// //           {/* Message amusant */}
// //           <div className="mt-12 p-6 bg-black bg-opacity-20 rounded-2xl backdrop-blur-sm">
// //             <p className="text-lg text-gray-200 italic">
// //               "Même les astronautes se perdent parfois dans l'espace..."
// //             </p>
// //           </div>
// //         </div>

// //         {/* Étoiles animées en arrière-plan */}
// //         <div className="fixed inset-0 pointer-events-none">
// //           {[...Array(20)].map((_, i) => (
// //             <div
// //               key={i}
// //               className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
// //               style={{
// //                 top: `${Math.random() * 100}%`,
// //                 left: `${Math.random() * 100}%`,
// //                 animationDelay: `${Math.random() * 5}s`,
// //                 animationDuration: `${2 + Math.random() * 3}s`
// //               }}
// //             />
// //           ))}
// //         </div>
// //       </div>

// //       {/* Styles CSS pour l'animation des étoiles */}
// //       <style jsx>{`
// //         @keyframes twinkle {
// //           0%, 100% { opacity: 0.2; transform: scale(0.8); }
// //           50% { opacity: 1; transform: scale(1.2); }
// //         }
// //         .animate-twinkle {
// //           animation: twinkle 3s infinite;
// //         }
// //       `}</style>
// //     </div>
// //   )
// // }

// // app/dashboard/admin/users/page.tsx - LISTE COMPLÈTE
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { 
//   Users, 
//   Plus, 
//   Search, 
//   Edit, 
//   Trash2, 
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   Mail,
//   Phone,
//   MapPin,
//   Shield
// } from 'lucide-react';

// // Types
// interface Utilisateur {
//   _id: string;
//   prenom: string;
//   nom: string;
//   email: string;
//   telephone?: string;
//   paroisse: string;
//   secteur: string;
//   role: {
//     _id: string;
//     nom: string;
//     permissions: string[];
//   };
//   createdAt: string;
// }

// interface Pagination {
//   page: number;
//   limit: number;
//   total: number;
//   pages: number;
//   hasNext: boolean;
//   hasPrev: boolean;
// }

// export default function UtilisateursPage() {
//   const router = useRouter();
  
//   const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
//   const [pagination, setPagination] = useState<Pagination>({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 0,
//     hasNext: false,
//     hasPrev: false
//   });
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   // Fetch utilisateurs
//   const fetchUtilisateurs = async (page: number = 1, search: string = '') => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: '10',
//         ...(search && { search })
//       });

//       const response = await fetch(`/api/users?${params}`, {
//         credentials: 'include'
//       });

//       if (!response.ok) {
//         throw new Error('Erreur lors du chargement des utilisateurs');
//       }

//       const data = await response.json();
//       setUtilisateurs(data.data);
//       setPagination(data.pagination);
//     } catch (err: any) {
//       setError(err.message);
//       console.error('Erreur fetch utilisateurs:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUtilisateurs(currentPage, searchTerm);
//   }, [currentPage]);

//   // Recherche avec debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setCurrentPage(1);
//       fetchUtilisateurs(1, searchTerm);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // Suppression
//   const handleDelete = async (id: string, nom: string) => {
//     if (!confirm(`Voulez-vous vraiment supprimer ${nom} ?`)) return;

//     try {
//       const response = await fetch(`/api/users/${id}`, {
//         method: 'DELETE',
//         credentials: 'include'
//       });

//       if (!response.ok) {
//         throw new Error('Erreur lors de la suppression');
//       }

//       fetchUtilisateurs(currentPage, searchTerm);
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   // Couleurs de rôle
//   const getRoleBadgeColor = (role: string) => {
//     switch (role.toLowerCase()) {
//       case 'admin':
//         return 'bg-purple-100 text-purple-800 border-purple-200';
//       case 'coordinateur':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'responsable':
//         return 'bg-green-100 text-green-800 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   if (loading && utilisateurs.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Chargement des utilisateurs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* En-tête */}
//         <header className="mb-8 animate-fade-in">
//           <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-100 rounded-xl">
//                   <Users className="h-8 w-8 text-blue-600" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                     Gestion des Utilisateurs
//                   </h1>
//                   <p className="text-gray-600 mt-1">{pagination.total} utilisateur(s) enregistré(s)</p>
//                 </div>
//               </div>

//               <Link
//                 href="/dashboard/admin/users/creer"
//                 className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-medium"
//               >
//                 <Plus className="h-5 w-5" />
//                 Nouvel Utilisateur
//               </Link>
//             </div>
//           </div>
//         </header>

//         {/* Messages */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 animate-slide-down">
//             <span className="text-xl">⚠️</span>
//             <span className="flex-1">{error}</span>
//             <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
//               ✕
//             </button>
//           </div>
//         )}

//         {/* Barre de recherche */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 mb-6 animate-fade-in-up">
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//             <input
//               type="text"
//               placeholder="Rechercher par nom, prénom ou email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             />
//           </div>
//         </div>

//         {/* Tableau */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden animate-fade-in-up" style={{animationDelay: '0.1s'}}>
//           {utilisateurs.length === 0 ? (
//             <div className="text-center py-12">
//               <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900">Aucun utilisateur trouvé</h3>
//               <p className="text-gray-500 mt-2">Essayez de modifier vos critères de recherche</p>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-gray-50 border-b border-gray-200">
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Utilisateur</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Localisation</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rôle</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {utilisateurs.map((user, index) => (
//                       <tr 
//                         key={user._id} 
//                         className="hover:bg-blue-50 transition-colors animate-fade-in"
//                         style={{animationDelay: `${index * 0.05}s`}}
//                       >
//                         {/* Utilisateur */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
//                               {user.prenom[0]}{user.nom[0]}
//                             </div>
//                             <div>
//                               <p className="font-semibold text-gray-900">
//                                 {user.prenom} {user.nom}
//                               </p>
//                               <p className="text-sm text-gray-500">ID: {user._id.slice(-8)}</p>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Contact */}
//                         <td className="px-6 py-4">
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-2 text-sm text-gray-700">
//                               <Mail className="h-4 w-4 text-gray-400" />
//                               {user.email}
//                             </div>
//                             {user.telephone && (
//                               <div className="flex items-center gap-2 text-sm text-gray-500">
//                                 <Phone className="h-4 w-4 text-gray-400" />
//                                 {user.telephone}
//                               </div>
//                             )}
//                           </div>
//                         </td>

//                         {/* Localisation */}
//                         <td className="px-6 py-4">
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-2 text-sm text-gray-700">
//                               <MapPin className="h-4 w-4 text-gray-400" />
//                               {user.paroisse}
//                             </div>
//                             <p className="text-sm text-gray-500 pl-6">{user.secteur}</p>
//                           </div>
//                         </td>

//                         {/* Rôle */}
//                         <td className="px-6 py-4">
//                           <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(user.role.nom)}`}>
//                             <Shield className="h-3 w-3 mr-1" />
//                             {user.role.nom}
//                           </span>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => router.push(`/dashboard/admin/users/${user._id}`)}
//                               className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
//                               title="Modifier"
//                             >
//                               <Edit className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDelete(user._id, `${user.prenom} ${user.nom}`)}
//                               className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
//                               title="Supprimer"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-gray-600">
//                     Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{' '}
//                     {Math.min(pagination.page * pagination.limit, pagination.total)} sur{' '}
//                     {pagination.total} utilisateur(s)
//                   </p>

//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                       disabled={!pagination.hasPrev}
//                       className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <ChevronLeft className="h-4 w-4" />
//                       Précédent
//                     </button>

//                     <span className="text-sm text-gray-600">
//                       Page {pagination.page} / {pagination.pages}
//                     </span>

//                     <button
//                       onClick={() => setCurrentPage(prev => prev + 1)}
//                       disabled={!pagination.hasNext}
//                       className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Suivant
//                       <ChevronRight className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Styles */}
//       <style jsx>{`
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes fade-in-up {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes slide-down {
//           from { opacity: 0; transform: translateY(-20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in { animation: fade-in 0.5s ease-out; }
//         .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
//         .animate-slide-down { animation: slide-down 0.3s ease-out; }
//       `}</style>
//     </div>
//   );
// }

// app/dashboard/admin/users/page.tsx - VERSION CORRIGÉE
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, Plus, Search, Eye, Edit, Trash2, Loader2,
  ChevronLeft, ChevronRight, Mail, Phone, MapPin, Shield, 
  X, CheckCircle2, AlertCircle, ShieldAlert
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Utilisateur {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  paroisse: string;
  secteur: string;
  role: {
    _id: string;
    nom: string;
    permissions: string[];
  };
  estActif: boolean;
  estAdminSysteme?: boolean; // Protection admin système
  createdAt: string;
}

interface Stats {
  total: number;
  parRole: { [key: string]: number };
  actifs: number;
  inactifs: number;
}

export default function UsersListPage() {
  const router = useRouter();
  
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, roleFilter]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.utilisateur);
      }
    } catch (error) {
      console.error('Erreur récupération user actuel:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && { role: roleFilter })
      });

      const res = await fetch(`/api/users?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur chargement');
      
      const data = await res.json();
      
      // Marquer l'admin système (premier admin créé)
      const usersWithProtection = data.data.map((u: Utilisateur, idx: number) => ({
        ...u,
        estAdminSysteme: u.role.nom.toLowerCase() === 'admin' && u.email === 'admin@cvav.com'
      }));
      
      setUsers(usersWithProtection);
      setTotalPages(data.pagination.pages);
      
      // Calculer stats
      const actifs = data.data.filter((u: Utilisateur) => u.estActif !== false).length;
      const parRole = data.data.reduce((acc: any, u: Utilisateur) => {
        acc[u.role.nom] = (acc[u.role.nom] || 0) + 1;
        return acc;
      }, {});
      
      setStats({
        total: data.pagination.total,
        actifs,
        inactifs: data.pagination.total - actifs,
        parRole
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, nom: string, estAdminSysteme: boolean) => {
    if (estAdminSysteme) {
      toast.error('L\'administrateur système ne peut pas être supprimé', {
        icon: '🔒',
        duration: 4000
      });
      return;
    }

    if (currentUser && id === currentUser._id) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte', {
        icon: '⚠️',
        duration: 4000
      });
      return;
    }
    
    if (!confirm(`Supprimer définitivement ${nom} ?`)) return;
    
    const loadingToast = toast.loading('Suppression en cours...');
    
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (res.ok) {
        toast.success('Utilisateur supprimé avec succès', {
          id: loadingToast,
          icon: '✅',
          duration: 3000
        });
        fetchUsers();
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Erreur suppression');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression', {
        id: loadingToast,
        icon: '❌',
        duration: 4000
      });
    }
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: 'bg-violet-50 text-violet-700 border-violet-200',
      coordinateur: 'bg-blue-50 text-blue-700 border-blue-200',
      responsable: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      utilisateur: 'bg-slate-50 text-slate-700 border-slate-200'
    };
    return colors[role.toLowerCase()] || colors.utilisateur;
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500'
          },
          success: {
            style: {
              borderColor: '#10b981',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              borderColor: '#ef4444',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* En-tête responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                Utilisateurs
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {stats?.total || 0} membres enregistrés
              </p>
            </div>

            <Link
              href="/dashboard/admin/users/creer"
              className="group flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Nouveau
            </Link>
          </div>

          {/* Stats Cards - Responsive grid */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard label="Total" value={stats.total} color="slate" />
              <StatCard label="Actifs" value={stats.actifs} color="emerald" />
              <StatCard label="Inactifs" value={stats.inactifs} color="amber" />
              <StatCard 
                label="Admins" 
                value={stats.parRole['admin'] || stats.parRole['Admin'] || 0} 
                color="violet" 
              />
            </div>
          )}

          {/* Filtres responsive */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            >
              <option value="">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="coordinateur">Coordinateur</option>
              <option value="responsable">Responsable</option>
              <option value="utilisateur">Utilisateur</option>
            </select>
          </div>

          {/* Grille utilisateurs - Responsive */}
          {users.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 text-sm">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  currentUserId={currentUser?._id}
                  onDelete={handleDelete}
                  getRoleColor={getRoleColor}
                />
              ))}
            </div>
          )}

          {/* Pagination responsive */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <p className="text-sm text-slate-600 order-2 sm:order-1">
                Page {page} sur {totalPages}
              </p>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-600" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`min-w-[32px] h-8 px-2 text-xs font-medium rounded-lg transition-colors ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Composant Card utilisateur - Responsive et protégé
function UserCard({ 
  user, 
  currentUserId,
  onDelete, 
  getRoleColor 
}: { 
  user: Utilisateur; 
  currentUserId?: string;
  onDelete: (id: string, nom: string, estAdminSysteme: boolean) => void;
  getRoleColor: (role: string) => string;
}) {
  const router = useRouter();

  return (
    <div className="group bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
      {/* En-tête avec avatar */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {user.prenom[0]}{user.nom[0]}
            </div>
            {user.estActif !== false && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            )}
            {user.estAdminSysteme && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                <ShieldAlert className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm truncate">
              {user.prenom} {user.nom}
            </h3>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        <span className={`px-2.5 py-1 text-xs font-medium rounded-md border whitespace-nowrap flex-shrink-0 ${getRoleColor(user.role.nom)}`}>
          {user.role.nom}
        </span>
      </div>

      {/* Informations - Responsive */}
      <div className="space-y-2 mb-4">
        {user.telephone && (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{user.telephone}</span>
          </div>
        )}
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{user.paroisse} • {user.secteur}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={() => router.push(`/dashboard/admin/users/${user._id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Voir</span>
        </button>
        
        <button
          onClick={() => router.push(`/dashboard/admin/users/${user._id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Edit className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Éditer</span>
        </button>
        
        {!user.estAdminSysteme && (
          <button
            onClick={() => onDelete(user._id, `${user.prenom} ${user.nom}`, user.estAdminSysteme || false)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
        
        {user.estAdminSysteme && (
          <div className="p-2 text-slate-300" title="Admin système protégé">
            <ShieldAlert className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
    </div>
  );
}

// Composant StatCard responsive
function StatCard({ 
  label, 
  value, 
  color 
}: { 
  label: string; 
  value: number; 
  color: string;
}) {
  const colors: { [key: string]: string } = {
    slate: 'bg-slate-50 border-slate-200 text-slate-900',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    violet: 'bg-violet-50 border-violet-200 text-violet-900'
  };

  return (
    <div className={`${colors[color]} rounded-xl border p-4`}>
      <p className="text-xs font-medium opacity-70 mb-1 truncate">{label}</p>
      <p className="text-xl sm:text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}