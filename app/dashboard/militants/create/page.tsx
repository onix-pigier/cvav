// app/dashboard/militants/create/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import MilitantForm from '@/components/MilitantForm';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateMilitantPage() {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success('Militant créé avec succès !');
    router.push('/dashboard/militants');
    router.refresh();
  };

  const handleClose = () => {
    router.push('/dashboard/militants');
  };

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
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
}