//app/dashboard/roles/page.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';

// --- TYPES ---
interface Role {
  _id: string;
  nom: string;
  permissions: string[];
  nombreUtilisateurs: number;
  createdAt?: string;
}

interface EditFormState {
  roleId: string;
  nom: string;
  permissions: string[];
}

// --- COMPOSANT PRINCIPAL AMÉLIORÉ ---
export default function GestionRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [nouveauRoleNom, setNouveauRoleNom] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editState, setEditState] = useState<EditFormState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation de chargement
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [loading]);

  // Récupération des données
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        fetch('/api/roles', { credentials: 'include' }),
        fetch('/api/permissions', { credentials: 'include' })
      ]);

      if (!rolesRes.ok) throw new Error("Échec de la récupération des rôles");
      if (!permissionsRes.ok) throw new Error("Échec de la récupération des permissions");

      const [rolesData, permissionsData] = await Promise.all([
        rolesRes.json(),
        permissionsRes.json()
      ]);

      setRoles(rolesData);
      setAllPermissions(permissionsData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Création d'un rôle
  const handleCreateRole = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!nouveauRoleNom.trim()) {
      setError("Le nom du rôle ne peut être vide.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          nom: nouveauRoleNom.trim(), 
          permissions: []
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setNouveauRoleNom('');
        setSuccess(`Rôle "${result.data.nom}" créé avec succès !`);
        await fetchData();
      } else {
        setError(result.message || "Erreur lors de la création");
      }
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion de la modification
  const startEdit = (role: Role) => {
    setEditState({
      roleId: role._id,
      nom: role.nom,
      permissions: [...role.permissions],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditState(null);
    setError(null);
  };

  const handlePermissionChange = (permission: string, isChecked: boolean) => {
    if (!editState) return;

    setEditState(prev => {
      if (!prev) return null;
      
      const newPermissions = isChecked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission);
      
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editState) return;
    
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/roles/${editState.roleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          nom: editState.nom.trim(), 
          permissions: editState.permissions 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(`Rôle "${editState.nom}" modifié avec succès !`);
        closeModal();
        await fetchData();
      } else {
        setError(result.message || "Erreur lors de la modification");
      }
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Suppression d'un rôle
  const handleDeleteRole = async (roleId: string, roleNom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le rôle "${roleNom.toUpperCase()}" ?\n\nLes utilisateurs associés seront réaffectés.`)) {
      return;
    }

    setError(null);
    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message || "Rôle supprimé avec succès");
        await fetchData();
      } else {
        setError(result.message || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Erreur réseau lors de la suppression");
    }
  };

  // Fonction pour formater les permissions
  const formatPermission = (permission: string): string => {
    return permission
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Animation de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement des données de sécurité...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête avec animation */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-blue-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">👑</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gestion des Rôles
              </h1>
              <p className="text-gray-600 mt-1">Configurez les permissions et accès de l'application</p>
            </div>
          </div>
        </header>

        {/* Messages d'alerte */}
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
            <span className="text-xl"></span>
            <span className="flex-1">{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
              ✕
            </button>
          </div>
        )}

        {/* Section création de rôle */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-xl">🆕</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Créer un nouveau rôle</h2>
          </div>
          
          <form onSubmit={handleCreateRole} className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <label htmlFor="nouveauRoleNom" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du rôle
              </label>
              <input 
                id="nouveauRoleNom"
                type="text" 
                value={nouveauRoleNom} 
                onChange={(e) => setNouveauRoleNom(e.target.value)} 
                placeholder="Ex: Secrétaire, Manager, Modérateur..." 
                required 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting || !nouveauRoleNom.trim()}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none mt-6 md:mt-7"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Création...
                </span>
              ) : (
                'Créer le rôle'
              )}
            </button>
          </form>
        </section>

        {/* Section liste des rôles */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Rôles existants</h2>
              <p className="text-gray-600 mt-1">{roles.length} rôle(s) configuré(s)</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role, index) => (
              <div 
                key={role._id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{animationDelay: `${0.2 + index * 0.1}s`}}
              >
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 capitalize">{role.nom}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {role.nombreUtilisateurs} utilisateur(s)
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {role.permissions.length} perm.
                  </div>
                </div>

                {/* Permissions (aperçu) */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Permissions accordées :
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map(permission => (
                      <span 
                        key={permission} 
                        className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                      >
                        {formatPermission(permission)}
                      </span>
                    ))}
                    {role.permissions.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        +{role.permissions.length - 3} autres
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => startEdit(role)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role._id, role.nom)}
                    className="px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium text-sm"
                    title="Supprimer le rôle"
                  >
                    
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal d'édition */}
      {isModalOpen && editState && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
            <form onSubmit={handleSaveEdit}>
              {/* En-tête du modal */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Modifier le rôle</h2>
                    <p className="text-blue-100 mt-1">
                      {editState.permissions.length} permission(s) sélectionnée(s) sur {allPermissions.length}
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="text-white hover:text-blue-200 text-2xl transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Nom du rôle */}
                <div className="mb-6">
                  <label htmlFor="editRoleNom" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du rôle
                  </label>
                  <input 
                    id="editRoleNom"
                    type="text" 
                    value={editState.nom} 
                    onChange={(e) => setEditState(prev => prev ? ({ ...prev, nom: e.target.value }) : null)} 
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Permissions ({editState.permissions.length}/{allPermissions.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allPermissions.map(permission => (
                      <label 
                        key={permission} 
                        className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                          editState.permissions.includes(permission)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={editState.permissions.includes(permission)}
                          onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {formatPermission(permission)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions du modal */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sauvegarde...
                      </span>
                    ) : (
                      `Sauvegarder (${editState.permissions.length} perm.)`
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </main>
  );
}