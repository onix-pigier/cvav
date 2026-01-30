// app/dashboard/attestations/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Edit, Download, Loader2, CheckCircle, XCircle, Clock, 
  Calendar, MapPin, User, Award, AlertCircle, Send
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface DemandeAttestation {
  _id: string;
  prenom: string;
  nom: string;
  paroisse: string;
  secteur: string;
  anneeFinFormation: number;
  lieuDernierCamp: string;
  soumise: boolean;
  statut: "en_attente" | "valide" | "rejete";
  commentaireAdmin?: string;
  numeroAttestation?: string;
  dateSoumission?: string;
  dateValidation?: string;
  validePar?: { prenom: string; nom: string };
  createdAt: string;
}

export default function DetailAttestationPage() {
  const router = useRouter();
  const params = useParams();
  const [demande, setDemande] = useState<DemandeAttestation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemande();
  }, [params.id]);

  const fetchDemande = async () => {
    try {
      const res = await fetch(`/api/attestations/${params.id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Non trouvée');
      const data = await res.json();
      setDemande(data);
    } catch (error) {
      toast.error('Erreur chargement');
      router.push('/dashboard/attestations');
    } finally {
      setLoading(false);
    }
  };

  const handleSoumettre = async () => {
    if (!confirm('Soumettre cette demande aux administrateurs ?')) return;
    
    const loadingToast = toast.loading('Soumission en cours...');
    
    try {
      const res = await fetch(`/api/attestations/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ soumise: true })
      });

      if (!res.ok) throw new Error('Erreur soumission');
      
      toast.success('Demande soumise avec succès !', { id: loadingToast });
      fetchDemande();
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "valide": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "en_attente": return "bg-amber-50 text-amber-700 border-amber-200";
      case "rejete": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "valide": return <CheckCircle className="h-5 w-5" />;
      case "en_attente": return <Clock className="h-5 w-5" />;
      case "rejete": return <XCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!demande) return null;

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Détails de la Demande</h1>
                <p className="text-sm text-slate-600 mt-1">{demande.prenom} {demande.nom}</p>
              </div>
            </div>

            {!demande.soumise && (
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/dashboard/attestations/${demande._id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </button>
                <button
                  onClick={handleSoumettre}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Soumettre
                </button>
              </div>
            )}
          </div>

          {/* Statut */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Statut de la demande</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatutBadge(demande.statut)}`}>
                  {getStatutIcon(demande.statut)}
                  <span className="font-semibold capitalize">
                    {demande.statut === 'en_attente' ? 'En attente' : demande.statut === 'valide' ? 'Validée' : 'Rejetée'}
                  </span>
                </div>
              </div>

              {demande.numeroAttestation && (
                <div className="text-left sm:text-right">
                  <p className="text-sm text-slate-600 mb-2">Numéro d'attestation</p>
                  <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                    <Award className="h-5 w-5" />
                    <span className="font-bold">{demande.numeroAttestation}</span>
                  </div>
                </div>
              )}
            </div>

            {demande.statut === 'rejete' && demande.commentaireAdmin && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 mb-1">Raison du rejet</p>
                    <p className="text-sm text-red-700">{demande.commentaireAdmin}</p>
                  </div>
                </div>
              </div>
            )}

            {!demande.soumise && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Brouillon non soumis</p>
                    <p className="text-sm text-amber-700">
                      Cette demande n'a pas encore été soumise aux administrateurs. 
                      Vous pouvez la modifier ou la soumettre.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Militant */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <h2 className="font-semibold text-slate-900">Militant</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Prénom :</span>
                    <span className="font-medium">{demande.prenom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Nom :</span>
                    <span className="font-medium">{demande.nom}</span>
                  </div>
                </div>
              </div>

              {/* Localisation */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h2 className="font-semibold text-slate-900">Localisation</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Paroisse :</span>
                    <span className="font-medium">{demande.paroisse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Secteur :</span>
                    <span className="font-medium">{demande.secteur}</span>
                  </div>
                </div>
              </div>

              {/* Formation */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h2 className="font-semibold text-slate-900">Formation</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Année :</span>
                    <span className="font-medium">{demande.anneeFinFormation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lieu camp :</span>
                    <span className="font-medium">{demande.lieuDernierCamp}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h2 className="font-semibold text-slate-900">Dates</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Créée :</span>
                    <span className="font-medium">{new Date(demande.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {demande.dateSoumission && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Soumise :</span>
                      <span className="font-medium">{new Date(demande.dateSoumission).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                  {demande.dateValidation && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Validée :</span>
                      <span className="font-medium">{new Date(demande.dateValidation).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {demande.statut === 'valide' && demande.numeroAttestation && (
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
              <Download className="h-5 w-5" />
              Télécharger l'attestation PDF
            </button>
          )}
        </div>
      </div>
    </>
  );
}