// app/dashboard/militants/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MilitantForm from '@/components/MilitantForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Militant } from '@/types/militant';

export default function EditMilitantPage() {
  const router = useRouter();
  const params = useParams();
  const [militant, setMilitant] = useState<Militant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleSuccess = () => {
    toast.success('Militant modifié avec succès !');
    router.push('/dashboard/militants');
    router.refresh();
  };

  const handleClose = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-6">{error || 'Militant non trouvé'}</p>
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8 px-4">
      {/* Bouton retour */}
      <div className="max-w-2xl mx-auto mb-6">
        <button
          onClick={handleClose}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Retour à la liste</span>
        </button>
      </div>

      {/* Formulaire */}
      <MilitantForm
        militantToEdit={militant}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
}