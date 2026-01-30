'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Attestation {
  _id: string;
  prenom: string;
  nom: string;
  paroisse: string;
  secteur: string;
  anneeFinFormation?: number;
  lieuDernierCamp?: string;
  bulletinScanne?: {
    _id: string;
    nom: string;
    type: string;
    taille: number;
  };
  soumise: boolean;
  statut?: 'en_attente' | 'valide' | 'rejete';
  createdAt: string;
  updatedAt: string;
  utilisateur?: {
    _id: string;
    prenom: string;
    nom: string;
    email: string;
  };
}

export default function AdminAttestationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'en_attente' | 'valide' | 'rejete' | 'tous'>('en_attente');

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    if (user && user.role?.nom !== 'Admin') {
      router.push('/403');
    }
  }, [user, router]);

  // Récupérer les attestations
  useEffect(() => {
    const fetchAttestations = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/attestations?view=soumises');
        
        if (!res.ok) {
          console.error('Erreur lors de la récupération');
          setAttestations([]);
          return;
        }

        const data = await res.json();
        setAttestations(data || []);
      } catch (error) {
        console.error('Erreur:', error);
        setAttestations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttestations();
  }, []);

  // Filtrer les attestations
  const filtered = filter === 'tous' 
    ? attestations
    : attestations.filter(a => a.statut === filter);

  const handleValidate = (id: string) => {
    router.push(`/admin/attestations/${id}/valider`);
  };

  const getStatutBadge = (statut?: string) => {
    switch (statut) {
      case 'valide':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">✅ Validée</span>;
      case 'rejete':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-medium">❌ Rejetée</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">⏳ En attente</span>;
    }
  };

  const getFileSize = (bytes?: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (!user || user.role?.nom !== 'Admin') {
    return null;
  }

  const stats = {
    total: attestations.length,
    enAttente: attestations.filter(a => a.statut === 'en_attente').length,
    validees: attestations.filter(a => a.statut === 'valide').length,
    rejetees: attestations.filter(a => a.statut === 'rejete').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">📋 Validation Attestations</h1>
        <p className="text-gray-500 mt-2">Examinez et validez les demandes d'attestation soumises</p>
      </div>

      {/* Statistiques */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-yellow-200 bg-yellow-50 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('en_attente')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{stats.enAttente}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('valide')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Validées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.validees}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-200 bg-red-50 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('rejete')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Rejetées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{stats.rejetees}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'en_attente' ? 'default' : 'outline'}
          onClick={() => setFilter('en_attente')}
        >
          ⏳ En attente ({attestations.filter(a => a.statut === 'en_attente').length})
        </Button>
        <Button
          variant={filter === 'valide' ? 'default' : 'outline'}
          onClick={() => setFilter('valide')}
        >
          ✅ Validées ({attestations.filter(a => a.statut === 'valide').length})
        </Button>
        <Button
          variant={filter === 'rejete' ? 'default' : 'outline'}
          onClick={() => setFilter('rejete')}
        >
          ❌ Rejetées ({attestations.filter(a => a.statut === 'rejete').length})
        </Button>
        <Button
          variant={filter === 'tous' ? 'default' : 'outline'}
          onClick={() => setFilter('tous')}
        >
          📋 Tous ({attestations.length})
        </Button>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {loading ? (
          // Skeleton loaders
          <>
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              Aucune attestation à afficher
            </CardContent>
          </Card>
        ) : (
          filtered.map(attestation => (
            <Card key={attestation._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Demandeur */}
                    <div>
                      <p className="text-sm text-gray-500">Demandeur</p>
                      <p className="font-semibold">
                        {attestation.utilisateur?.prenom} {attestation.utilisateur?.nom}
                      </p>
                      <p className="text-sm text-gray-600">{attestation.utilisateur?.email}</p>
                    </div>

                    {/* Détails */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-sm text-gray-500">Pour</p>
                        <p className="font-medium">{attestation.prenom} {attestation.nom}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Paroisse</p>
                        <p className="font-medium">{attestation.paroisse}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Secteur</p>
                        <p className="font-medium">{attestation.secteur}</p>
                      </div>
                      {attestation.anneeFinFormation && (
                        <div>
                          <p className="text-sm text-gray-500">Année formation</p>
                          <p className="font-medium">{attestation.anneeFinFormation}</p>
                        </div>
                      )}
                    </div>

                    {/* Fichier */}
                    {attestation.bulletinScanne && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-500 mb-1">📎 Fichier attaché</p>
                        <p className="font-medium text-sm">{attestation.bulletinScanne.nom}</p>
                        <p className="text-xs text-gray-500">
                          {attestation.bulletinScanne.type} • {getFileSize(attestation.bulletinScanne.taille)}
                        </p>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex gap-4 text-xs text-gray-500 pt-2">
                      <span>📅 Soumis: {new Date(attestation.createdAt).toLocaleDateString('fr-FR')}</span>
                      {attestation.updatedAt && (
                        <span>🔄 Modifié: {new Date(attestation.updatedAt).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 items-end">
                    <div>{getStatutBadge(attestation.statut)}</div>
                    
                    {attestation.statut === 'en_attente' && (
                      <Button
                        onClick={() => handleValidate(attestation._id)}
                        className="w-full"
                      >
                        Valider →
                      </Button>
                    )}
                    
                    {attestation.statut !== 'en_attente' && (
                      <Button
                        variant="outline"
                        onClick={() => handleValidate(attestation._id)}
                        className="w-full"
                      >
                        Voir détails
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      {!loading && attestations.length > 0 && (
        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {attestations.filter(a => a.statut === 'en_attente').length}
              </p>
              <p className="text-sm text-gray-500">En attente de validation</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-green-600">
                {attestations.filter(a => a.statut === 'valide').length}
              </p>
              <p className="text-sm text-gray-500">Validées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-red-600">
                {attestations.filter(a => a.statut === 'rejete').length}
              </p>
              <p className="text-sm text-gray-500">Rejetées</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
