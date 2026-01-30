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
import { exportAttestationToPDF } from '@/lib/exportPdf';

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
  numeroAttestation?: string;
  motifRejet?: string;
}

export default function ValidateAttestationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [attestation, setAttestation] = useState<Attestation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  // Form fields
  const [numeroAttestation, setNumeroAttestation] = useState('');
  const [motifRejet, setMotifRejet] = useState('');
  const [filePreviewMode, setFilePreviewMode] = useState<'download' | 'preview'>('preview');

  // Vérifier accès admin
  useEffect(() => {
    if (user && user.role?.nom !== 'Admin') {
      router.push('/403');
    }
  }, [user, router]);

  // Récupérer l'attestation
  useEffect(() => {
    const fetchAttestation = async () => {
      try {
        setLoading(true);
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const res = await fetch(`/api/attestations/${id}`);
        
        if (!res.ok) {
          toast({
            title: "Erreur",
            description: "Impossible de charger l'attestation",
            variant: "destructive",
          });
          router.push('/admin/attestations');
          return;
        }

        const data = await res.json();
        setAttestation(data);
        setNumeroAttestation(data.numeroAttestation || '');
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
      fetchAttestation();
    }
  }, [params.id, router, toast]);

  const handleValidate = async () => {
    if (!numeroAttestation.trim()) {
      toast({
        title: "Erreur",
        description: "Le numéro d'attestation est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      
      const res = await fetch(`/api/attestations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statut: 'valide',
          numeroAttestation: numeroAttestation.trim(),
          action: 'validate'
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la validation');
      }

      toast({
        title: "✅ Succès",
        description: "L'attestation a été validée avec succès",
      });

      setTimeout(() => {
        router.push('/admin/attestations');
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
      
      const res = await fetch(`/api/attestations/${id}`, {
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
        router.push('/admin/attestations');
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
    if (attestation?.bulletinScanne) {
      window.open(`/api/fichiers/${attestation.bulletinScanne._id}/download`, '_blank');
    }
  };

  const renderFilePreview = () => {
    if (!attestation?.bulletinScanne) {
      return <div className="text-center text-gray-500 py-8">Aucun fichier attaché</div>;
    }

    const file = attestation.bulletinScanne;

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

  if (!user || user.role?.nom !== 'Admin') {
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

  if (!attestation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Attestation introuvable</p>
        <Button onClick={() => router.push('/admin/attestations')} className="mt-4">
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
          <h1 className="text-3xl font-bold">Validation Attestation</h1>
          <p className="text-gray-500 mt-2">
            {attestation.prenom} {attestation.nom} • {attestation.paroisse}
          </p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (!attestation) return;
                try {
                  setExporting(true);
                  await exportAttestationToPDF(attestation as any);
                  toast({ title: 'PDF généré', description: 'Téléchargement démarré' });
                } catch (e) {
                  toast({ title: 'Erreur', description: 'Impossible de générer le PDF', variant: 'destructive' });
                } finally {
                  setExporting(false);
                }
              }}
            >
              {exporting ? '⏳ Export...' : '📄 Exporter PDF'}
            </Button>
          </div>
          {attestation.statut === 'valide' && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">✅ Validée</span>
          )}
          {attestation.statut === 'rejete' && (
            <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium">❌ Rejetée</span>
          )}
          {attestation.statut === 'en_attente' && (
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
                <p className="font-semibold">{attestation.utilisateur?.prenom} {attestation.utilisateur?.nom}</p>
              </div>
              <div>
                <Label className="text-xs uppercase text-gray-500">Email</Label>
                <p className="text-sm">{attestation.utilisateur?.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Détails personne */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails Personne</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs uppercase text-gray-500">Prénom</Label>
                <p className="font-semibold">{attestation.prenom}</p>
              </div>
              <div>
                <Label className="text-xs uppercase text-gray-500">Nom</Label>
                <p className="font-semibold">{attestation.nom}</p>
              </div>
              <div>
                <Label className="text-xs uppercase text-gray-500">Paroisse</Label>
                <p className="font-semibold">{attestation.paroisse}</p>
              </div>
              <div>
                <Label className="text-xs uppercase text-gray-500">Secteur</Label>
                <p className="font-semibold">{attestation.secteur}</p>
              </div>
              {attestation.anneeFinFormation && (
                <div>
                  <Label className="text-xs uppercase text-gray-500">Année Fin Formation</Label>
                  <p className="font-semibold">{attestation.anneeFinFormation}</p>
                </div>
              )}
              {attestation.lieuDernierCamp && (
                <div>
                  <Label className="text-xs uppercase text-gray-500">Lieu Dernier Camp</Label>
                  <p className="font-semibold">{attestation.lieuDernierCamp}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dates */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">📅 Soumis:</span>
                <span className="font-medium">{new Date(attestation.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</span>
              </div>
              {attestation.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">🔄 Modifié:</span>
                  <span className="font-medium">{new Date(attestation.updatedAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</span>
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
              <CardTitle className="text-lg">📎 Fichier Attaché</CardTitle>
              {attestation.bulletinScanne && (
                <CardDescription>
                  {attestation.bulletinScanne.type} • {(attestation.bulletinScanne.taille / 1024).toFixed(2)} KB
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {attestation.bulletinScanne && (
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
          {attestation.statut === 'en_attente' && !showRejectionForm && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg">✅ Valider</CardTitle>
                <CardDescription>Approuver cette demande d'attestation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="numero">Numéro d'attestation</Label>
                  <Input
                    id="numero"
                    placeholder="ATT-2024-001"
                    value={numeroAttestation}
                    onChange={(e) => setNumeroAttestation(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleValidate}
                    disabled={saving || !numeroAttestation.trim()}
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
                    placeholder="Ex: Document illisible, données manquantes..."
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
          {attestation.statut === 'valide' && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl">✅</div>
                  <p className="font-semibold">Attestation Validée</p>
                  {attestation.numeroAttestation && (
                    <p className="text-lg font-mono text-green-700">{attestation.numeroAttestation}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {attestation.statut === 'rejete' && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="font-semibold">Rejetée</p>
                  {attestation.motifRejet && (
                    <div className="p-3 bg-red-100 rounded text-sm">
                      <p className="text-red-800">{attestation.motifRejet}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Retour */}
          <Button
            variant="outline"
            onClick={() => router.push('/admin/attestations')}
            className="w-full"
          >
            ← Retour à la liste
          </Button>
        </div>
      </div>
    </div>
  );
}



/*il y'a aussi un truc lorsque le sidebar est restreint il faudrait que l'element affiché à coté c'est à dire la oage à côté prenne tout l'espace disponible et lorsque le sidebar revient à la normale , l'autre page reviennent à la normal. et aussi il faudrait que les formarmulire prennent un peu de largeur */