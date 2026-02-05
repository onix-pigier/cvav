// app/dashboard/admin/users/[id]/page.tsx - AVEC SECTEURS/PAROISSES ET PROTECTION ADMIN
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Edit2, Save, X, Loader2, Mail, Phone, MapPin, Shield,
  Calendar, Key, Power, Activity, Clock, User, ShieldAlert
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { SECTEURS, useSecteurParoisse } from '@/lib/secteurs-paroisses';

interface Utilisateur {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  paroisse: string;
  secteur: string;
  estActif: boolean;
  estAdminSysteme?: boolean;
  role: {
    _id: string;
    nom: string;
    permissions: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface LogAction {
  _id: string;
  action: string;
  module: string;
  createdAt: string;
  donnees?: any;
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [logs, setLogs] = useState<LogAction[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '', nom: '', email: '', telephone: '', roleId: ''
  });

  // ✅ Hook pour gérer secteur/paroisse
  const { secteur, setSecteur, paroisse, setParoisse, paroisses } = useSecteurParoisse();

  useEffect(() => {
    fetchData();
    fetchCurrentUser();
  }, [params.id]);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [userRes, rolesRes] = await Promise.all([
        fetch(`/api/users/${params.id}`, { credentials: 'include' }),
        fetch('/api/roles', { credentials: 'include' }),
      ]);

      if (!userRes.ok) {
        toast.error('Utilisateur non trouvé');
        router.push('/dashboard/admin/users');
        return;
      }
      
      const userData = await userRes.json();
      const rolesData = await rolesRes.json();
      
      // ✅ Marquer admin système (email admin@cvav.com avec rôle admin)
      const userWithProtection = {
        ...userData,
        estAdminSysteme: 
          userData.role.nom.toLowerCase() === 'admin' && 
          userData.email.toLowerCase() === 'admin@cvav.com'
      };
      
      setUser(userWithProtection);
      setRoles(rolesData);
      
      // ✅ Initialiser le formulaire ET secteur/paroisse
      setFormData({
        prenom: userData.prenom,
        nom: userData.nom,
        email: userData.email,
        telephone: userData.telephone || '',
        roleId: userData.role._id
      });

      // ✅ Initialiser secteur/paroisse (important pour la cascade)
      setSecteur(userData.secteur || '');
      setParoisse(userData.paroisse || '');
      try {
        const logsRes = await fetch(`/api/users/${params.id}/logs`, { credentials: 'include' });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.slice(0, 15));
      }} catch (logsError) {
        console.error('Erreur récupération logs:', logsError);
      }
    } catch (error: any) {
      toast.error('Erreur lors du chargement');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // ✅ Protection admin système
    if (user?.estAdminSysteme) {
      toast.error('L\'administrateur système ne peut pas être modifié', {
        icon: '🔒',
        duration: 4000
      });
      return;
    }

    // ✅ Validation secteur/paroisse
    if (!secteur || !paroisse) {
      toast.error('Le secteur et la paroisse sont requis', {
        icon: '⚠️',
        duration: 3000
      });
      return;
    }

    const loadingToast = toast.loading('Enregistrement...');

    try {
      setIsSaving(true);
      
      const res = await fetch(`/api/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          secteur,
          paroisse
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur sauvegarde');
      }
      
      const updated = await res.json();
      setUser({ ...updated.data, estAdminSysteme: user?.estAdminSysteme });
      setIsEditing(false);
      
      toast.success('Modifications enregistrées avec succès', {
        id: loadingToast,
        icon: '✅',
        duration: 3000
      });
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde', {
        id: loadingToast,
        icon: '❌',
        duration: 4000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (user?.estAdminSysteme) {
      toast.error('L\'administrateur système ne peut pas être modifié', {
        icon: '🔒',
        duration: 4000
      });
      return;
    }

    if (!confirm('Réinitialiser le mot de passe de cet utilisateur ?')) return;
    
    const loadingToast = toast.loading('Réinitialisation en cours...');

    try {
      const res = await fetch(`/api/users/${params.id}/reset-password`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur réinitialisation');
      }
      
      toast.success('Mot de passe réinitialisé. Email envoyé à l\'utilisateur.', {
        id: loadingToast,
        icon: '🔑',
        duration: 4000
      });
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la réinitialisation', {
        id: loadingToast,
        icon: '❌',
        duration: 4000
      });
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;

    if (user.estAdminSysteme) {
      toast.error('L\'administrateur système ne peut pas être désactivé', {
        icon: '🔒',
        duration: 4000
      });
      return;
    }

    if (currentUser && user._id === currentUser._id) {
      toast.error('Vous ne pouvez pas désactiver votre propre compte', {
        icon: '⚠️',
        duration: 4000
      });
      return;
    }

    const action = user.estActif !== false ? 'désactiver' : 'activer';
    if (!confirm(`Voulez-vous vraiment ${action} ce compte ?`)) return;
    
    const loadingToast = toast.loading(`${action === 'désactiver' ? 'Désactivation' : 'Activation'} en cours...`);

    try {
      const res = await fetch(`/api/users/${params.id}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Erreur ${action}ation`);
      }
      
      const updated = await res.json();
      setUser({ ...updated.data, estAdminSysteme: user.estAdminSysteme });
      
      toast.success(`Compte ${action}é avec succès`, {
        id: loadingToast,
        icon: action === 'activer' ? '✅' : '🔒',
        duration: 3000
      });
    } catch (error: any) {
      toast.error(error.message || `Erreur lors de l'${action}ation`, {
        id: loadingToast,
        icon: '❌',
        duration: 4000
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

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
            fontWeight: '500',
            maxWidth: '400px'
          },
          success: {
            style: {
              borderColor: '#10b981',
            },
          },
          error: {
            style: {
              borderColor: '#ef4444',
            },
          },
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Navigation responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={() => router.push('/dashboard/admin/users')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Retour</span>
            </button>

            {user.estAdminSysteme && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">
                  Administrateur système protégé
                </span>
              </div>
            )}

            {!user.estAdminSysteme && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                <Edit2 className="h-4 w-4" />
                Modifier
              </button>
            )}
            
            {isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    // Réinitialiser les valeurs
                    setFormData({
                      prenom: user.prenom,
                      nom: user.nom,
                      email: user.email,
                      telephone: user.telephone || '',
                      roleId: user.role._id
                    });
                    setSecteur(user.secteur);
                    setParoisse(user.paroisse);
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Enregistrer
                </button>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Carte profil responsive */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {/* Header avec gradient */}
                <div className="bg-gradient-to-br from-blue-500 to-violet-500 p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-semibold border-2 border-white/30">
                        {user.prenom[0]}{user.nom[0]}
                      </div>
                      {user.estActif !== false && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
                      )}
                      {user.estAdminSysteme && (
                        <div className="absolute -top-1 -left-1 w-6 h-6 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                          <ShieldAlert className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-white flex-1 min-w-0">
                      <h2 className="text-xl font-semibold truncate">{user.prenom} {user.nom}</h2>
                      <p className="text-blue-100 text-sm mt-0.5 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Contenu responsive */}
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Informations */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Informations personnelles
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        icon={User}
                        label="Prénom"
                        value={formData.prenom}
                        onChange={(v: any) => setFormData({...formData, prenom: v})}
                        disabled={!isEditing || user.estAdminSysteme}
                      />
                      <Field
                        icon={User}
                        label="Nom"
                        value={formData.nom}
                        onChange={(v: any) => setFormData({...formData, nom: v})}
                        disabled={!isEditing || user.estAdminSysteme}
                      />
                    </div>

                    <Field
                      icon={Mail}
                      label="Email"
                      value={formData.email}
                      onChange={(v: any) => setFormData({...formData, email: v})}
                      disabled={!isEditing || user.estAdminSysteme}
                    />

                    <Field
                      icon={Phone}
                      label="Téléphone"
                      value={formData.telephone}
                      onChange={(v: any) => setFormData({...formData, telephone: v})}
                      disabled={!isEditing || user.estAdminSysteme}
                      placeholder="Non renseigné"
                    />

                    {/* ✅ SECTEUR ET PAROISSE AVEC CASCADE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Secteur */}
                      <div>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          <MapPin className="h-3.5 w-3.5" />
                          Secteur
                        </label>
                        {isEditing && !user.estAdminSysteme ? (
                          <select
                            value={secteur}
                            onChange={(e) => setSecteur(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                          >
                            <option value="">Sélectionnez un secteur</option>
                            {SECTEURS.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="px-3 py-2.5 bg-slate-50 rounded-lg text-sm text-slate-700">
                            {user.secteur}
                          </div>
                        )}
                      </div>

                      {/* Paroisse (dépend du secteur) */}
                      <div>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          <MapPin className="h-3.5 w-3.5" />
                          Paroisse
                        </label>
                        {isEditing && !user.estAdminSysteme ? (
                          <select
                            value={paroisse}
                            onChange={(e) => setParoisse(e.target.value)}
                            disabled={!secteur}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">
                              {secteur ? 'Sélectionnez une paroisse' : 'Sélectionnez d\'abord un secteur'}
                            </option>
                            {paroisses.map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="px-3 py-2.5 bg-slate-50 rounded-lg text-sm text-slate-700">
                            {user.paroisse}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rôle */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        <Shield className="h-3.5 w-3.5" />
                        Rôle
                      </label>
                      {isEditing && !user.estAdminSysteme ? (
                        <select
                          value={formData.roleId}
                          onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        >
                          {roles.map(role => (
                            <option key={role._id} value={role._id}>{role.nom}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="px-3 py-2.5 bg-slate-50 rounded-lg text-sm text-slate-700">
                          {user.role.nom}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Métadonnées */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">Créé {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">Modifié {new Date(user.updatedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historique responsive */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 text-slate-400" />
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Activité récente
                  </h3>
                </div>
                
                {logs.length > 0 ? (
                  <div className="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
                    {logs.map((log) => (
                      <div key={log._id} className="flex items-start gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-700 break-words">{log.action}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {new Date(log.createdAt).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Aucune activité récente</p>
                )}
              </div>
            </div>

            {/* Colonne latérale responsive */}
            <div className="space-y-6">
              
              {/* Statut */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Statut du compte
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.estActif !== false ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    <span className="text-sm text-slate-700">{user.estActif !== false ? 'Actif' : 'Inactif'}</span>
                  </div>
                  {!user.estAdminSysteme && (
                    <button
                      onClick={handleToggleStatus}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        user.estActif !== false
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {user.estActif !== false ? 'Désactiver' : 'Activer'}
                    </button>
                  )}
                </div>
              </div>

              {/* Actions - Masquées pour admin système */}
              {!user.estAdminSysteme && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    Actions rapides
                  </h3>
                  
                  <button
                    onClick={handleResetPassword}
                    className="w-full flex items-start gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group text-left"
                  >
                    <Key className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">Réinitialiser MDP</p>
                      <p className="text-xs text-slate-500 break-words">Envoie un nouveau mot de passe</p>
                    </div>
                  </button>

                  <button
                    onClick={handleToggleStatus}
                    className="w-full flex items-start gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group text-left"
                  >
                    <Power className="h-4 w-4 text-slate-400 group-hover:text-red-600 transition-colors flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">
                        {user.estActif !== false ? 'Désactiver' : 'Activer'}
                      </p>
                      <p className="text-xs text-slate-500 break-words">
                        {user.estActif !== false ? 'Bloquer l\'accès' : 'Rétablir l\'accès'}
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* Permissions responsive */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Permissions
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  {user.role.permissions?.length || 0} permissions actives
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {(user.role.permissions || []).slice(0, 10).map((perm, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      <span className="break-words">{perm.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                  {(user.role.permissions?.length || 0) > 10 && (
                    <p className="text-xs text-slate-400 pt-2">
                      +{(user.role.permissions?.length || 0) - 10} autres...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Composant Field responsive
function Field({ 
  icon: Icon, 
  label, 
  value, 
  onChange, 
  disabled, 
  placeholder 
}: any) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        <Icon className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="truncate">{label}</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </div>
  );
}