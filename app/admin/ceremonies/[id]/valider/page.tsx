//app/admin/ceremonies/[id]/valider/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

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
    url: string;
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
  motifRejet?: string;
}

export default function ValidateCeremonyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [ceremony, setCeremony] = useState<Ceremony | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  // Form fields
  const [motifRejet, setMotifRejet] = useState('');
  const [filePreviewMode, setFilePreviewMode] = useState<'download' | 'preview'>('preview');

  // Vérifier accès admin
  useEffect(() => {
    if (user && user.role?.nom !== 'admin') {
      router.push('/403');
    }
  }, [user, router]);

  // Récupérer la cérémonie
  useEffect(() => {
    const fetchCeremony = async () => {
      try {
        setLoading(true);
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const res = await fetch(`/api/ceremonies/${id}`);
        
        if (!res.ok) {
          toast({
            title: "Erreur",
            description: "Impossible de charger la cérémonie",
            variant: "destructive",
          });
          router.push('/admin/ceremonies');
          return;
        }

        const data = await res.json();
        setCeremony(data);
        setMotifRejet(data.motifRejet || '');
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCeremony();
    }
  }, [params.id, router, toast]);

  const handleValidate = async () => {
    try {
      setSaving(true);
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      
      const res = await fetch(`/api/ceremonies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statut: 'valide',
          action: 'validate'
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la validation');
      }

      toast({
        title: "✅ Succès",
        description: "La cérémonie a été validée avec succès",
      });

      setTimeout(() => {
        router.push('/admin/ceremonies');
      }, 1000);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la validation",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!motifRejet.trim()) {
      toast({
        title: "Erreur",
        description: "Le motif du rejet est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      
      const res = await fetch(`/api/ceremonies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statut: 'rejete',
          motifRejet: motifRejet.trim(),
          action: 'reject'
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors du rejet');
      }

      toast({
        title: "✅ Rejet enregistré",
        description: "L'utilisateur a été notifié du rejet",
      });

      setTimeout(() => {
        router.push('/admin/ceremonies');
      }, 1000);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors du rejet",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const downloadFile = () => {
    if (ceremony?.courrierScanne) {
      window.open(`/api/fichiers/${ceremony.courrierScanne._id}/download`, '_blank');
    }
  };

  const renderFilePreview = () => {
    if (!ceremony?.courrierScanne) {
      return <div className="text-center text-gray-500 py-8">Aucun fichier attaché</div>;
    }

    const file = ceremony.courrierScanne;

    if (filePreviewMode === 'download') {
      return (
        <div className="text-center py-8 space-y-4">
          <div className="text-4xl">📄</div>
          <div>
            <p className="font-semibold">{file.nom}</p>
            <p className="text-sm text-gray-500">{file.type}</p>
          </div>
          <Button onClick={downloadFile} className="w-full">
            ⬇️ Télécharger le fichier
          </Button>
        </div>
      );
    }

    // Prévisualisation
    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={`/api/fichiers/${file._id}/download`}
          className="w-full h-96 border rounded"
          title={file.nom}
        />
      );
    } else if (file.type.startsWith('image/')) {
      return (
        <img
          src={`/api/fichiers/${file._id}/download`}
          alt={file.nom}
          className="max-w-full h-auto border rounded"
        />
      );
    } else {
      return (
        <div className="text-center py-8 space-y-4">
          <div className="text-4xl">📎</div>
          <p className="text-gray-500">Prévisualisation non disponible pour ce type de fichier</p>
          <Button onClick={downloadFile} className="w-full">
            ⬇️ Télécharger
          </Button>
        </div>
      );
    }
  };

  if (!user || user.role?.nom !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!ceremony) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cérémonie introuvable</p>
        <Button onClick={() => router.push('/admin/ceremonies')} className="mt-4">
          ← Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Validation Cérémonie</h1>
          <p className="text-gray-500 mt-2">
            {ceremony.paroisse} • {ceremony.Secteur}
          </p>
        </div>
        
        <div className="text-right">
          {ceremony.statut === 'valide' && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">✅ Validée</span>
          )}
          {ceremony.statut === 'rejete' && (
            <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium">❌ Rejetée</span>
          )}
          {ceremony.statut === 'en_attente' && (
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium">⏳ En attente</span>
          )}
        </div>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-2 gap-6">
        {/* Colonne gauche: Détails */}
        <div className="space-y-6">
          {/* Demandeur */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Demandeur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs uppercase text-gray-500">Nom</Label>
                <p className="font-semibold">{ceremony.utilisateur?.prenom} {ceremony.utilisateur?.nom}</p>
              </div>
              <div>
                <Label className="text-xs uppercase text-gray-500">Email</Label>
                <p className="text-sm">{ceremony.utilisateur?.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Détails cérémonie */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails Cérémonie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs uppercase text-gray-500">Paroisse</Label>
                <p className="font-semibold">{ceremony.paroisse}</p>
              </div>
              <div>
                <Label className="text-xs uppercase text-gray-500">Secteur</Label>
                <p className="font-semibold">{ceremony.Secteur}</p>
              </div>
              <div>
                <Label className="text-xs uppercase text-gray-500">Date</Label>
                <p className="font-semibold">{new Date(ceremony.dateCeremonie).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</p>
              </div>
              <div>
                <Label className="text-xs uppercase text-gray-500">Lieu</Label>
                <p className="font-semibold">{ceremony.lieuxCeremonie}</p>
              </div>
            </CardContent>
          </Card>

          {/* Foulards */}
          {ceremony.foulards && ceremony.foulards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">👕 Foulards ({ceremony.foulards.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {ceremony.foulards.map((f, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded flex justify-between">
                      <span>{f.prenom}</span>
                      <span className="font-medium">{f.nom}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dates */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">📅 Soumis:</span>
                <span className="font-medium">{new Date(ceremony.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</span>
              </div>
              {ceremony.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">🔄 Modifié:</span>
                  <span className="font-medium">{new Date(ceremony.updatedAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite: Fichier et Actions */}
        <div className="space-y-6">
          {/* Prévisualisation fichier */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📎 Courrier Attaché</CardTitle>
              {ceremony.courrierScanne && (
                <CardDescription>
                  {ceremony.courrierScanne.type} • {(ceremony.courrierScanne.taille / 1024).toFixed(2)} KB
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {ceremony.courrierScanne && (
                <div className="space-y-3 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilePreviewMode(filePreviewMode === 'preview' ? 'download' : 'preview')}
                    className="w-full"
                  >
                    {filePreviewMode === 'preview' ? '📥 Télécharger' : '👁️ Aperçu'}
                  </Button>
                </div>
              )}
              
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                {renderFilePreview()}
              </div>
            </CardContent>
          </Card>

          {/* Actions (Validation/Rejet) */}
          {ceremony.statut === 'en_attente' && !showRejectionForm && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg">✅ Valider</CardTitle>
                <CardDescription>Approuver cette cérémonie</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={handleValidate}
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? '⏳ Validation...' : '✅ Valider'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectionForm(true)}
                    className="flex-1"
                  >
                    ❌ Rejeter
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulaire rejet */}
          {showRejectionForm && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg">❌ Rejeter</CardTitle>
                <CardDescription>Indiquer le motif du rejet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="motif">Motif du rejet *</Label>
                  <textarea
                    id="motif"
                    placeholder="Ex: Document manquant, dates incompatibles..."
                    value={motifRejet}
                    onChange={(e) => setMotifRejet(e.target.value)}
                    className="w-full mt-2 p-3 border rounded-lg min-h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleReject}
                    disabled={saving || !motifRejet.trim()}
                    variant="destructive"
                    className="flex-1"
                  >
                    {saving ? '⏳ Rejet...' : '❌ Confirmer rejet'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectionForm(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* État validé/rejeté */}
          {ceremony.statut === 'valide' && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl">✅</div>
                  <p className="font-semibold">Cérémonie Validée</p>
                </div>
              </CardContent>
            </Card>
          )}

          {ceremony.statut === 'rejete' && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="font-semibold">Rejetée</p>
                  {ceremony.motifRejet && (
                    <div className="p-3 bg-red-100 rounded text-sm">
                      <p className="text-red-800">{ceremony.motifRejet}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Retour */}
          <Button
            variant="outline"
            onClick={() => router.push('/admin/ceremonies')}
            className="w-full"
          >
            ← Retour à la liste
          </Button>
        </div>
      </div>
    </div>
  );
}
