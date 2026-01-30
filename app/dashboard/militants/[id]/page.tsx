// app/dashboard/militants/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2, 
  User, 
  Phone, 
  MapPin, 
  Award, 
  Home,
  Calendar,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Militant } from '@/types/militant';

export default function MilitantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [militant, setMilitant] = useState<Militant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchMilitant = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/militants/${params.id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Militant non trouvé ou accès refusé');
        }

        const data = await response.json();
        setMilitant(data);
      } catch (err: any) {
        console.error('Erreur chargement militant:', err);
        setError(err.message);
        toast.error(err.message || 'Erreur lors du chargement');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchMilitant();
    }
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/dashboard/militants/${params.id}/edit`);
  };

  const handleDelete = async () => {
    if (!militant) return;

    try {
      const response = await fetch(`/api/militants/${militant._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      toast.success('Militant supprimé avec succès');
      router.push('/dashboard/militants');
      router.refresh();
    } catch (err: any) {
      console.error('Erreur suppression:', err);
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleBack = () => {
    router.push('/dashboard/militants');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error || !militant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-6">{error || 'Militant non trouvé'}</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "Chef de secteur": return "bg-blue-100 text-blue-800";
      case "Responsable jeunesse": return "bg-green-100 text-green-800";
      case "Animateur": return "bg-purple-100 text-purple-800";
      case "Militant": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSecteurColor = (secteur: string) => {
    switch (secteur) {
      case "Nord": return "text-blue-600 bg-blue-50";
      case "Sud": return "text-green-600 bg-green-50";
      case "Est": return "text-purple-600 bg-purple-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header avec navigation */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour à la liste</span>
          </button>

          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center space-x-2 bg-red-600 text-white rounded-xl px-4 py-2 hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Supprimer</span>
            </button>
          </div>
        </div>

        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* En-tête avec avatar */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-3xl border-4 border-white/30">
                {militant.prenom[0]}{militant.nom[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {militant.prenom} {militant.nom}
                </h1>
                <div className="flex items-center space-x-2 text-blue-100">
                  <span className="text-2xl">{militant.sexe === 'M' ? '👨' : '👩'}</span>
                  <span className="text-lg">{militant.sexe === 'M' ? 'Homme' : 'Femme'}</span>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getGradeColor(militant.grade)}`}>
                  <Award className="h-4 w-4 mr-2" />
                  {militant.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations de localisation */}
              <InfoCard
                icon={MapPin}
                label="Paroisse"
                value={militant.paroisse}
                iconColor="text-blue-600"
                bgColor="bg-blue-50"
              />

              <InfoCard
                icon={MapPin}
                label="Secteur"
                value={militant.secteur}
                iconColor={getSecteurColor(militant.secteur).split(' ')[0]}
                bgColor={getSecteurColor(militant.secteur).split(' ')[1]}
              />

              {/* Contact */}
              {militant.telephone && (
                <InfoCard
                  icon={Phone}
                  label="Téléphone"
                  value={militant.telephone}
                  iconColor="text-green-600"
                  bgColor="bg-green-50"
                />
              )}

              {militant.quartier && (
                <InfoCard
                  icon={Home}
                  label="Quartier"
                  value={militant.quartier}
                  iconColor="text-purple-600"
                  bgColor="bg-purple-50"
                />
              )}

              {/* Dates */}
              {militant.createdAt && (
                <InfoCard
                  icon={Calendar}
                  label="Date d'ajout"
                  value={new Date(militant.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  iconColor="text-gray-600"
                  bgColor="bg-gray-50"
                />
              )}

              {militant.updatedAt && (
                <InfoCard
                  icon={Calendar}
                  label="Dernière modification"
                  value={new Date(militant.updatedAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  iconColor="text-gray-600"
                  bgColor="bg-gray-50"
                />
              )}
            </div>

            {/* Informations techniques */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Informations système
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">ID Militant</span>
                  <code className="bg-white px-3 py-1 rounded-lg text-gray-900 font-mono">
                    {militant._id}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de suppression */}
      {isDeleteModalOpen && (
        <DeleteModal
          militant={militant}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

// Composant InfoCard
interface InfoCardProps {
  icon: any;
  label: string;
  value: string;
  iconColor: string;
  bgColor: string;
}

function InfoCard({ icon: Icon, label, value, iconColor, bgColor }: InfoCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className={`${bgColor} ${iconColor} p-3 rounded-lg`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-lg font-semibold text-gray-900 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Composant Modal de suppression
interface DeleteModalProps {
  militant: Militant;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteModal({ militant, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Confirmer la suppression
          </h3>
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer le militant{' '}
            <span className="font-semibold text-gray-900">
              {militant.prenom} {militant.nom}
            </span>
            ? Cette action est irréversible.
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-lg shadow-red-500/25"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}