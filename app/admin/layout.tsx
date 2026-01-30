'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    if (user && user.role?.nom !== 'Admin') {
      router.push('/403');
    }
  }, [user, router]);

  if (!user || user.role?.nom !== 'Admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">🎛️ Administration</h2>
              <p className="text-xs text-gray-500">Gestion des demandes et validations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              👤 {user.prenom} {user.nom}
            </div>
            <Link 
              href="/dashboard"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 text-center">
            © 2026 CV-AV Admin. Tous les droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
