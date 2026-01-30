'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Ceremony {
  _id: string;
  Secteur: string;
  paroisse: string;
  foulards?: Array<{
    prenom: string;
    nom: string;
  }>;
  dateCeremonie: string;
  lieuxCeremonie: string;
  courrierScanne?: {
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

export default function AdminCeremoniesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [ceremonies, setCeremonies] = useState<Ceremony[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'en_attente' | 'valide' | 'rejete' | 'tous'>('en_attente');

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    if (user && user.role?.nom !== 'Admin') {
      router.push('/403');
    }
  }, [user, router]);

  // Récupérer les cérémonies
  useEffect(() => {
    const fetchCeremonies = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/ceremonies?view=soumises');
        
        if (!res.ok) {
          console.error('Erreur lors de la récupération');
          setCeremonies([]);
          return;
        }

        const data = await res.json();
        setCeremonies(data || []);
      } catch (error) {
        console.error('Erreur:', error);
        setCeremonies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCeremonies();
  }, []);

  // Filtrer les cérémonies
  const filtered = filter === 'tous' 
    ? ceremonies
    : ceremonies.filter(c => c.statut === filter);

  const handleValidate = (id: string) => {
    router.push(`/admin/ceremonies/${id}/valider`);
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
    total: ceremonies.length,
    enAttente: ceremonies.filter(c => c.statut === 'en_attente').length,
    validees: ceremonies.filter(c => c.statut === 'valide').length,
    rejetees: ceremonies.filter(c => c.statut === 'rejete').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🎊 Validation Cérémonies</h1>
        <p className="text-gray-500 mt-2">Examinez et validez les demandes de cérémonies soumises</p>
      </div>

      {/* Statistiques */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.total}</div>
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
          ⏳ En attente ({ceremonies.filter(c => c.statut === 'en_attente').length})
        </Button>
        <Button
          variant={filter === 'valide' ? 'default' : 'outline'}
          onClick={() => setFilter('valide')}
        >
          ✅ Validées ({ceremonies.filter(c => c.statut === 'valide').length})
        </Button>
        <Button
          variant={filter === 'rejete' ? 'default' : 'outline'}
          onClick={() => setFilter('rejete')}
        >
          ❌ Rejetées ({ceremonies.filter(c => c.statut === 'rejete').length})
        </Button>
        <Button
          variant={filter === 'tous' ? 'default' : 'outline'}
          onClick={() => setFilter('tous')}
        >
          📋 Tous ({ceremonies.length})
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
              Aucune cérémonie à afficher
            </CardContent>
          </Card>
        ) : (
          filtered.map(ceremony => (
            <Card key={ceremony._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Demandeur */}
                    <div>
                      <p className="text-sm text-gray-500">Demandeur</p>
                      <p className="font-semibold">
                        {ceremony.utilisateur?.prenom} {ceremony.utilisateur?.nom}
                      </p>
                      <p className="text-sm text-gray-600">{ceremony.utilisateur?.email}</p>
                    </div>

                    {/* Détails */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-sm text-gray-500">Paroisse</p>
                        <p className="font-medium">{ceremony.paroisse}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Secteur</p>
                        <p className="font-medium">{ceremony.Secteur}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{new Date(ceremony.dateCeremonie).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lieu</p>
                        <p className="font-medium text-sm">{ceremony.lieuxCeremonie}</p>
                      </div>
                    </div>

                    {/* Foulards */}
                    {ceremony.foulards && ceremony.foulards.length > 0 && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-500 mb-1">👕 Foulards ({ceremony.foulards.length})</p>
                        <div className="text-sm space-y-1">
                          {ceremony.foulards.slice(0, 3).map((f, i) => (
                            <p key={i}>{f.prenom} {f.nom}</p>
                          ))}
                          {ceremony.foulards.length > 3 && (
                            <p className="text-gray-500">+{ceremony.foulards.length - 3} autres</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Fichier */}
                    {ceremony.courrierScanne && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-500 mb-1">📎 Fichier attaché</p>
                        <p className="font-medium text-sm">{ceremony.courrierScanne.nom}</p>
                        <p className="text-xs text-gray-500">
                          {ceremony.courrierScanne.type} • {getFileSize(ceremony.courrierScanne.taille)}
                        </p>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex gap-4 text-xs text-gray-500 pt-2">
                      <span>📅 Soumis: {new Date(ceremony.createdAt).toLocaleDateString('fr-FR')}</span>
                      {ceremony.updatedAt && (
                        <span>🔄 Modifié: {new Date(ceremony.updatedAt).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 items-end">
                    <div>{getStatutBadge(ceremony.statut)}</div>
                    
                    {ceremony.statut === 'en_attente' && (
                      <Button
                        onClick={() => handleValidate(ceremony._id)}
                        className="w-full"
                      >
                        Valider →
                      </Button>
                    )}
                    
                    {ceremony.statut !== 'en_attente' && (
                      <Button
                        variant="outline"
                        onClick={() => handleValidate(ceremony._id)}
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
      {!loading && ceremonies.length > 0 && (
        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {ceremonies.filter(c => c.statut === 'en_attente').length}
              </p>
              <p className="text-sm text-gray-500">En attente de validation</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-green-600">
                {ceremonies.filter(c => c.statut === 'valide').length}
              </p>
              <p className="text-sm text-gray-500">Validées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-red-600">
                {ceremonies.filter(c => c.statut === 'rejete').length}
              </p>
              <p className="text-sm text-gray-500">Rejetées</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
