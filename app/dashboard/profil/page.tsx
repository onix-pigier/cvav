// app/dashboard/profil/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  User, 
  Mail, 
  Shield, 
  MapPin, 
  Award,
  Calendar,
  Lock,
  Edit2,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfile {
  _id: string;
  email: string;
  nom: string;
  prenom: string;
  role: {
    nom: string;
    permissions: string[];
  };
  paroisse?: string;
  secteur?: string;
  createdAt: string;
  updatedAt: string;
  doitChangerMotDePasse?: boolean;
}

export default function ProfilPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editedData, setEditedData] = useState({
    nom: '',
    prenom: '',
  });

  // Charger le profil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement du profil');
        }

        const data = await response.json();
        setProfile(data.utilisateur);
        setEditedData({
          nom: data.utilisateur.nom,
          prenom: data.utilisateur.prenom,
        });
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Impossible de charger le profil');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchProfile();
    }
  }, [isAuthenticated, authLoading]);

  // Redirection si non authentifié
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditedData({
        nom: profile.nom,
        prenom: profile.prenom,
      });
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      const data = await response.json();
      setProfile(data.utilisateur);
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = () => {
    router.push('/dashboard/change-password');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Impossible de charger le profil</p>
        </div>
      </div>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'coordinateur':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'responsable':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600 mt-1">Gérez vos informations personnelles</p>
          </div>
          
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
            >
              <Edit2 className="h-4 w-4" />
              <span>Modifier</span>
            </button>
          )}
        </div>

        {/* Alerte changement de mot de passe */}
        {profile.doitChangerMotDePasse && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-1">
                Changement de mot de passe requis
              </h3>
              <p className="text-yellow-700 text-sm mb-3">
                Pour des raisons de sécurité, vous devez changer votre mot de passe.
              </p>
              <button
                onClick={() => router.push('/change-password')}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
              >
                Changer maintenant
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Carte principale */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* En-tête de carte avec avatar */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-3xl border-4 border-white/30">
                  {profile.prenom[0]}{profile.nom[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {profile.prenom} {profile.nom}
                  </h2>
                  <p className="text-blue-100">{profile.email}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(profile.role.nom)}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {profile.role.nom}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu de la carte */}
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Informations personnelles
              </h3>

              <div className="space-y-6">
                {/* Prénom */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.prenom}
                      onChange={(e) => setEditedData({ ...editedData, prenom: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Votre prénom"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 font-medium">
                      {profile.prenom}
                    </div>
                  )}
                </div>

                {/* Nom */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    Nom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.nom}
                      onChange={(e) => setEditedData({ ...editedData, nom: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Votre nom"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 font-medium">
                      {profile.nom}
                    </div>
                  )}
                </div>

                {/* Email (non modifiable) */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    Email
                  </label>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-500 italic">
                    {profile.email}
                    <span className="text-xs ml-2">(non modifiable)</span>
                  </div>
                </div>

                {/* Paroisse */}
                {profile.paroisse && (
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      Paroisse
                    </label>
                    <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 font-medium">
                      {profile.paroisse}
                    </div>
                  </div>
                )}

                {/* Secteur */}
                {profile.secteur && (
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      Secteur
                    </label>
                    <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 font-medium">
                      {profile.secteur}
                    </div>
                  </div>
                )}
              </div>

              {/* Boutons d'action en mode édition */}
              {isEditing && (
                <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    <span>Annuler</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 shadow-lg shadow-blue-500/25"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Enregistrer</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Carte Sécurité */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-blue-600" />
                Sécurité
              </h3>
              <button
                onClick={handleChangePassword}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg shadow-blue-500/25"
              >
                <Lock className="h-4 w-4" />
                <span>Changer le mot de passe</span>
              </button>
            </div>

            {/* Carte Informations système */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                Informations
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Membre depuis</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(profile.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Dernière modification</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(profile.updatedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">ID Utilisateur</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 break-all">
                    {profile._id}
                  </code>
                </div>
              </div>
            </div>

            {/* Carte Rôle et Permissions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-purple-600" />
                Rôle et Permissions
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm mb-2">Votre rôle</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(profile.role.nom)}`}>
                    {profile.role.nom}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.role.permissions.slice(0, 3).map((permission, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {permission.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {profile.role.permissions.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                        +{profile.role.permissions.length - 3} autres
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}