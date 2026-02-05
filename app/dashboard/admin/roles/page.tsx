// //app/dashboard/roles/page.tsx
// 'use client';

// import React, { useState, useEffect, FormEvent } from 'react';

// // --- TYPES ---
// interface Role {
//   _id: string;
//   nom: string;
//   permissions: string[];
//   nombreUtilisateurs: number;
//   createdAt?: string;
// }

// interface EditFormState {
//   roleId: string;
//   nom: string;
//   permissions: string[];
// }

// // --- COMPOSANT PRINCIPAL AMÉLIORÉ ---
// export default function GestionRolesPage() {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [allPermissions, setAllPermissions] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
  
//   const [nouveauRoleNom, setNouveauRoleNom] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editState, setEditState] = useState<EditFormState | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Animation de chargement
//   useEffect(() => {
//     if (loading) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//   }, [loading]);

//   // Récupération des données
//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [rolesRes, permissionsRes] = await Promise.all([
//         fetch('/api/roles', { credentials: 'include' }),
//         fetch('/api/permissions', { credentials: 'include' })
//       ]);

//       if (!rolesRes.ok) throw new Error("Échec de la récupération des rôles");
//       if (!permissionsRes.ok) throw new Error("Échec de la récupération des permissions");

//       const [rolesData, permissionsData] = await Promise.all([
//         rolesRes.json(),
//         permissionsRes.json()
//       ]);

//       setRoles(rolesData);
//       setAllPermissions(permissionsData);

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Création d'un rôle
//   const handleCreateRole = async (e: FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);
    
//     if (!nouveauRoleNom.trim()) {
//       setError("Le nom du rôle ne peut être vide.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const response = await fetch('/api/roles', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ 
//           nom: nouveauRoleNom.trim(), 
//           permissions: []
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setNouveauRoleNom('');
//         setSuccess(`Rôle "${result.data.nom}" créé avec succès !`);
//         await fetchData();
//       } else {
//         setError(result.message || "Erreur lors de la création");
//       }
//     } catch (err) {
//       setError("Erreur réseau");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Gestion de la modification
//   const startEdit = (role: Role) => {
//     setEditState({
//       roleId: role._id,
//       nom: role.nom,
//       permissions: [...role.permissions],
//     });
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditState(null);
//     setError(null);
//   };

//   const handlePermissionChange = (permission: string, isChecked: boolean) => {
//     if (!editState) return;

//     setEditState(prev => {
//       if (!prev) return null;
      
//       const newPermissions = isChecked
//         ? [...prev.permissions, permission]
//         : prev.permissions.filter(p => p !== permission);
      
//       return { ...prev, permissions: newPermissions };
//     });
//   };

//   const handleSaveEdit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!editState) return;
    
//     setError(null);
//     setIsSubmitting(true);

//     try {
//       const response = await fetch(`/api/roles/${editState.roleId}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ 
//           nom: editState.nom.trim(), 
//           permissions: editState.permissions 
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setSuccess(`Rôle "${editState.nom}" modifié avec succès !`);
//         closeModal();
//         await fetchData();
//       } else {
//         setError(result.message || "Erreur lors de la modification");
//       }
//     } catch (err) {
//       setError("Erreur réseau");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Suppression d'un rôle
//   const handleDeleteRole = async (roleId: string, roleNom: string) => {
//     if (!confirm(`Êtes-vous sûr de vouloir supprimer le rôle "${roleNom.toUpperCase()}" ?\n\nLes utilisateurs associés seront réaffectés.`)) {
//       return;
//     }

//     setError(null);
//     try {
//       const response = await fetch(`/api/roles/${roleId}`, {
//         method: 'DELETE',
//         credentials: 'include',
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setSuccess(result.message || "Rôle supprimé avec succès");
//         await fetchData();
//       } else {
//         setError(result.message || "Erreur lors de la suppression");
//       }
//     } catch (err) {
//       setError("Erreur réseau lors de la suppression");
//     }
//   };

//   // Fonction pour formater les permissions
//   const formatPermission = (permission: string): string => {
//     return permission
//       .replace(/_/g, ' ')
//       .replace(/\b\w/g, l => l.toUpperCase());
//   };

//   // Animation de chargement
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Chargement des données de sécurité...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* En-tête avec animation */}
//         <header className="text-center mb-12 animate-fade-in">
//           <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-blue-100">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <span className="text-2xl">👑</span>
//             </div>
//             <div className="text-left">
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 Gestion des Rôles
//               </h1>
//               <p className="text-gray-600 mt-1">Configurez les permissions et accès de l'application</p>
//             </div>
//           </div>
//         </header>

//         {/* Messages d'alerte */}
//         {error && (
//           <div className="animate-slide-down mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
//             <span className="text-xl">⚠️</span>
//             <span className="flex-1">{error}</span>
//             <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
//               ✕
//             </button>
//           </div>
//         )}

//         {success && (
//           <div className="animate-slide-down mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3">
//             <span className="text-xl"></span>
//             <span className="flex-1">{success}</span>
//             <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
//               ✕
//             </button>
//           </div>
//         )}

//         {/* Section création de rôle */}
//         <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 mb-8 animate-fade-in-up">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-2 bg-green-100 rounded-lg">
//               <span className="text-xl">🆕</span>
//             </div>
//             <h2 className="text-2xl font-semibold text-gray-800">Créer un nouveau rôle</h2>
//           </div>
          
//           <form onSubmit={handleCreateRole} className="flex flex-col md:flex-row gap-4 items-start md:items-center">
//             <div className="flex-1">
//               <label htmlFor="nouveauRoleNom" className="block text-sm font-medium text-gray-700 mb-2">
//                 Nom du rôle
//               </label>
//               <input 
//                 id="nouveauRoleNom"
//                 type="text" 
//                 value={nouveauRoleNom} 
//                 onChange={(e) => setNouveauRoleNom(e.target.value)} 
//                 placeholder="Ex: Secrétaire, Manager, Modérateur..." 
//                 required 
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               />
//             </div>
//             <button 
//               type="submit" 
//               disabled={isSubmitting || !nouveauRoleNom.trim()}
//               className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none mt-6 md:mt-7"
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   Création...
//                 </span>
//               ) : (
//                 'Créer le rôle'
//               )}
//             </button>
//           </form>
//         </section>

//         {/* Section liste des rôles */}
//         <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <span className="text-xl">📊</span>
//             </div>
//             <div>
//               <h2 className="text-2xl font-semibold text-gray-800">Rôles existants</h2>
//               <p className="text-gray-600 mt-1">{roles.length} rôle(s) configuré(s)</p>
//             </div>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {roles.map((role, index) => (
//               <div 
//                 key={role._id}
//                 className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
//                 style={{animationDelay: `${0.2 + index * 0.1}s`}}
//               >
//                 {/* En-tête de la carte */}
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800 capitalize">{role.nom}</h3>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {role.nombreUtilisateurs} utilisateur(s)
//                     </p>
//                   </div>
//                   <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
//                     {role.permissions.length} perm.
//                   </div>
//                 </div>

//                 {/* Permissions (aperçu) */}
//                 <div className="mb-4">
//                   <p className="text-sm text-gray-600 mb-2">
//                     Permissions accordées :
//                   </p>
//                   <div className="flex flex-wrap gap-1">
//                     {role.permissions.slice(0, 3).map(permission => (
//                       <span 
//                         key={permission} 
//                         className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
//                       >
//                         {formatPermission(permission)}
//                       </span>
//                     ))}
//                     {role.permissions.length > 3 && (
//                       <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
//                         +{role.permissions.length - 3} autres
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2">
//                   <button 
//                     onClick={() => startEdit(role)}
//                     className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
//                   >
//                     Modifier
//                   </button>
//                   <button
//                     onClick={() => handleDeleteRole(role._id, role.nom)}
//                     className="px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium text-sm"
//                     title="Supprimer le rôle"
//                   >
                    
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>

//       {/* Modal d'édition */}
//       {isModalOpen && editState && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
//             <form onSubmit={handleSaveEdit}>
//               {/* En-tête du modal */}
//               <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-2xl font-bold">Modifier le rôle</h2>
//                     <p className="text-blue-100 mt-1">
//                       {editState.permissions.length} permission(s) sélectionnée(s) sur {allPermissions.length}
//                     </p>
//                   </div>
//                   <button 
//                     type="button" 
//                     onClick={closeModal}
//                     className="text-white hover:text-blue-200 text-2xl transition-colors"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 max-h-[60vh] overflow-y-auto">
//                 {/* Nom du rôle */}
//                 <div className="mb-6">
//                   <label htmlFor="editRoleNom" className="block text-sm font-medium text-gray-700 mb-2">
//                     Nom du rôle
//                   </label>
//                   <input 
//                     id="editRoleNom"
//                     type="text" 
//                     value={editState.nom} 
//                     onChange={(e) => setEditState(prev => prev ? ({ ...prev, nom: e.target.value }) : null)} 
//                     required
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 {/* Permissions */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                     Permissions ({editState.permissions.length}/{allPermissions.length})
//                   </h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {allPermissions.map(permission => (
//                       <label 
//                         key={permission} 
//                         className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
//                           editState.permissions.includes(permission)
//                             ? 'border-blue-500 bg-blue-50'
//                             : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={editState.permissions.includes(permission)}
//                           onChange={(e) => handlePermissionChange(permission, e.target.checked)}
//                           className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                         />
//                         <span className="ml-3 text-sm font-medium text-gray-700">
//                           {formatPermission(permission)}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Actions du modal */}
//               <div className="border-t border-gray-200 p-6 bg-gray-50">
//                 <div className="flex gap-3 justify-end">
//                   <button 
//                     type="button" 
//                     onClick={closeModal}
//                     className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                   >
//                     Annuler
//                   </button>
//                   <button 
//                     type="submit" 
//                     disabled={isSubmitting}
//                     className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center gap-2">
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         Sauvegarde...
//                       </span>
//                     ) : (
//                       `Sauvegarder (${editState.permissions.length} perm.)`
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Styles d'animation */}
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
//         @keyframes scale-in {
//           from { opacity: 0; transform: scale(0.9); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         .animate-fade-in { animation: fade-in 0.5s ease-out; }
//         .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
//         .animate-slide-down { animation: slide-down 0.3s ease-out; }
//         .animate-scale-in { animation: scale-in 0.3s ease-out; }
//       `}</style>
//     </main>
//   );
// }

// app/dashboard/roles/page.tsx - VERSION AMÉLIORÉE
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Shield, Plus, Edit2, Trash2, Users, Search, Filter,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, Info
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Permission {
  code: string;
  label: string;
  description: string;
}

interface PermissionCategory {
  id: string;
  nom: string;
  icon: string;
  description: string;
  count: number;
  permissions: Permission[];
}

interface Role {
  _id: string;
  nom: string;
  permissions: string[];
  nombreUtilisateurs: number;
  createdAt?: string;
}

interface PermissionsData {
  total: number;
  categories: PermissionCategory[];
  meta: {
    isAdmin: boolean;
    userRole: string;
  };
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function GestionRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionsData, setPermissionsData] = useState<PermissionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [nouveauRoleNom, setNouveauRoleNom] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        fetch('/api/roles', { credentials: 'include' }),
        fetch('/api/permissions?format=organized', { credentials: 'include' })
      ]);

      if (!rolesRes.ok || !permissionsRes.ok) {
        throw new Error("Erreur chargement");
      }

      const [rolesData, permData] = await Promise.all([
        rolesRes.json(),
        permissionsRes.json()
      ]);

      setRoles(rolesData);
      setPermissionsData(permData);

      // Expand toutes les catégories par défaut
      if (permData.categories) {
        setExpandedCategories(new Set(permData.categories.map((c: any) => c.id)));
      }
    } catch (error) {
      toast.error('Erreur chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!nouveauRoleNom.trim()) {
      toast.error("Le nom du rôle est requis");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Création du rôle...');

    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          nom: nouveauRoleNom.trim(), 
          permissions: []
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setNouveauRoleNom('');
        toast.success(`Rôle "${result.data.nom}" créé !`, { id: loadingToast });
        fetchData();
      } else {
        toast.error(result.message, { id: loadingToast });
      }
    } catch (error) {
      toast.error("Erreur réseau", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (role: Role) => {
    setEditRole(role);
    setSelectedPermissions([...role.permissions]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditRole(null);
    setSelectedPermissions([]);
    setSearchTerm('');
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const togglePermission = (permissionCode: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionCode)
        ? prev.filter(p => p !== permissionCode)
        : [...prev, permissionCode]
    );
  };

  const toggleAllInCategory = (category: PermissionCategory) => {
    const categoryPermissions = category.permissions.map(p => p.code);
    const allSelected = categoryPermissions.every(p => selectedPermissions.includes(p));

    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(p => !categoryPermissions.includes(p)));
    } else {
      setSelectedPermissions(prev => {
        const next = new Set([...prev, ...categoryPermissions]);
        return Array.from(next);
      });
    }
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editRole) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading('Sauvegarde...');

    try {
      const res = await fetch(`/api/roles/${editRole._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          nom: editRole.nom,
          permissions: selectedPermissions 
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(`Rôle "${editRole.nom}" modifié !`, { id: loadingToast });
        closeModal();
        fetchData();
      } else {
        toast.error(result.message, { id: loadingToast });
      }
    } catch (error) {
      toast.error("Erreur réseau", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId: string, roleNom: string) => {
    if (!confirm(`Supprimer le rôle "${roleNom}" ?`)) return;

    const loadingToast = toast.loading('Suppression...');

    try {
      const res = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message, { id: loadingToast });
        fetchData();
      } else {
        toast.error(result.message, { id: loadingToast });
      }
    } catch (error) {
      toast.error("Erreur réseau", { id: loadingToast });
    }
  };

  // Filtrage des catégories par recherche
  const filteredCategories = permissionsData?.categories.map(cat => ({
    ...cat,
    permissions: cat.permissions.filter(p =>
      p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.permissions.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-semibold animate-pulse">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* En-tête */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 blur-3xl" />
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-xl p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                    Gestion des Rôles
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium">
                    Configuration des permissions et accès système
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Création rôle */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Créer un nouveau rôle</h2>
            </div>
            
            <form onSubmit={handleCreateRole} className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                value={nouveauRoleNom} 
                onChange={(e) => setNouveauRoleNom(e.target.value)} 
                placeholder="Ex: Secrétaire, Manager..." 
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !nouveauRoleNom.trim()}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-2xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isSubmitting ? 'Création...' : 'Créer'}
              </button>
            </form>
          </div>

          {/* Liste des rôles */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Rôles existants</h2>
                <p className="text-sm text-gray-600 font-medium">{roles.length} rôle(s) configuré(s)</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <RoleCard
                  key={role._id}
                  role={role}
                  onEdit={() => openEditModal(role)}
                  onDelete={() => handleDeleteRole(role._id, role.nom)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal édition */}
      {isModalOpen && editRole && permissionsData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">Modifier "{editRole.nom}"</h2>
                  <p className="text-blue-100 mt-1 font-medium">
                    {selectedPermissions.length}/{permissionsData.total} permission(s) sélectionnée(s)
                  </p>
                </div>
                <button onClick={closeModal} className="text-white hover:text-blue-200 transition-colors">
                  <XCircle className="h-8 w-8" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="flex-1 flex flex-col overflow-hidden">
              {/* Recherche */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une permission..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Liste permissions */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {filteredCategories?.map(category => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    selectedPermissions={selectedPermissions}
                    isExpanded={expandedCategories.has(category.id)}
                    onToggleCategory={() => toggleCategory(category.id)}
                    onTogglePermission={togglePermission}
                    onToggleAll={() => toggleAllInCategory(category)}
                  />
                ))}

                {filteredCategories?.length === 0 && (
                  <div className="text-center py-12">
                    <Info className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucune permission trouvée</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    {isSubmitting ? 'Sauvegarde...' : `Sauvegarder (${selectedPermissions.length})`}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// COMPOSANTS
// ============================================

function RoleCard({ role, onEdit, onDelete }: any) {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 capitalize">{role.nom}</h3>
          <p className="text-sm text-gray-600 font-medium mt-1">
            {role.nombreUtilisateurs} utilisateur(s)
          </p>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
          {role.permissions.length}
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
        >
          <Edit2 className="h-4 w-4" />
          Modifier
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CategorySection({ category, selectedPermissions, isExpanded, onToggleCategory, onTogglePermission, onToggleAll }: any) {
  const allSelected = category.permissions.every((p: any) => selectedPermissions.includes(p.code));
  const someSelected = category.permissions.some((p: any) => selectedPermissions.includes(p.code));
  
  return (
    <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
      <div className="bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onToggleCategory}
            className="flex-1 flex items-center gap-3 text-left"
          >
            <span className="text-2xl">{category.icon}</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{category.nom}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{category.description}</p>
            </div>
            {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
          </button>
          
          <button
            type="button"
            onClick={onToggleAll}
            className={`ml-3 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
              allSelected 
                ? 'bg-blue-600 text-white' 
                : someSelected
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-2">
          {category.permissions.map((permission: any) => (
            <label 
              key={permission.code}
              className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPermissions.includes(permission.code)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permission.code)}
                onChange={() => onTogglePermission(permission.code)}
                className="mt-0.5 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{permission.label}</p>
                <p className="text-xs text-gray-600 mt-0.5">{permission.description}</p>
                <code className="text-xs text-gray-400 mt-1 inline-block">{permission.code}</code>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}