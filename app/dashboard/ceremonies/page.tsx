"use client";

import { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Users,
  Gift,
  Download,
  Eye,
  MoreVertical,
  Send,
  AlertCircle,
  FileText
} from "lucide-react";

// Types pour les cérémonies basés sur votre modèle
interface DemandeCeremonie {
  _id: string;
  utilisateur: string;
  nomSectionOuSecteur: string;
  foulardsBenjamins: number;
  foulardsCadets: number;
  foulardsAines: number;
  dateCeremonie: string;
  lieuxCeremonie: string;
  nombreParrains: number;
  nombreMarraines: number;
  statut: "en_attente" | "valide" | "rejete";
  commentaireAdmin?: string;
  validePar?: string;
  dateValidation?: string;
  createdAt: string;
  updatedAt: string;
}

// Types pour les notifications de cérémonies
interface NotificationCeremonie {
  _id: string;
  titre: string;
  message: string;
  type: "info" | "succes" | "erreur";
  lu: boolean;
  createdAt: string;
  lien?: string;
}

export default function CeremoniesPage() {
  // Données mockées pour les cérémonies
  const demandesCeremonie: DemandeCeremonie[] = [
    {
      _id: "1",
      utilisateur: "user1",
      nomSectionOuSecteur: "Secteur Nord",
      foulardsBenjamins: 15,
      foulardsCadets: 12,
      foulardsAines: 8,
      dateCeremonie: "2024-02-15T18:00:00",
      lieuxCeremonie: "Église Saint-Pierre",
      nombreParrains: 5,
      nombreMarraines: 5,
      statut: "en_attente",
      createdAt: "2024-01-15T10:30:00",
      updatedAt: "2024-01-15T10:30:00"
    },
    {
      _id: "2",
      utilisateur: "user2",
      nomSectionOuSecteur: "Section Jeannettes",
      foulardsBenjamins: 20,
      foulardsCadets: 0,
      foulardsAines: 0,
      dateCeremonie: "2024-02-20T17:30:00",
      lieuxCeremonie: "Salle paroissiale",
      nombreParrains: 3,
      nombreMarraines: 3,
      statut: "valide",
      commentaireAdmin: "Cérémonie approuvée",
      validePar: "admin1",
      dateValidation: "2024-01-14T16:45:00",
      createdAt: "2024-01-14T14:20:00",
      updatedAt: "2024-01-14T16:45:00"
    }
  ];

  // Notifications spécifiques aux cérémonies
  const notificationsCeremonie: NotificationCeremonie[] = [
    {
      _id: "1",
      titre: "Nouvelle demande de cérémonie",
      message: "Secteur Nord a demandé une cérémonie de foulards",
      type: "info",
      lu: false,
      createdAt: "2024-01-15T10:30:00",
      lien: "/ceremonies/1"
    },
    {
      _id: "2",
      titre: "Cérémonie validée",
      message: "La cérémonie des Jeannettes a été approuvée",
      type: "succes",
      lu: true,
      createdAt: "2024-01-14T16:45:00",
      lien: "/ceremonies/2"
    },
    {
      _id: "3",
      titre: "Document manquant",
      message: "Courrier manquant pour la cérémonie du Secteur Est",
      type: "erreur",
      lu: true,
      createdAt: "2024-01-13T11:30:00",
      lien: "/ceremonies/3"
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("Tous");
  const [selectedType, setSelectedType] = useState("Tous");

  // Filtrage des demandes de cérémonie
  const filteredDemandes = demandesCeremonie.filter(demande => {
    const matchesSearch = 
      demande.nomSectionOuSecteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.lieuxCeremonie.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatut = selectedStatut === "Tous" || demande.statut === selectedStatut;
    const matchesType = selectedType === "Tous" || true; // Adaptez selon vos besoins

    return matchesSearch && matchesStatut && matchesType;
  });

  // Statistiques pour les cérémonies
  const statsCeremonies = {
    total: demandesCeremonie.length,
    enAttente: demandesCeremonie.filter(d => d.statut === "en_attente").length,
    validees: demandesCeremonie.filter(d => d.statut === "valide").length,
    rejetees: demandesCeremonie.filter(d => d.statut === "rejete").length,
    totalFoulards: demandesCeremonie.reduce((sum, d) => sum + d.foulardsBenjamins + d.foulardsCadets + d.foulardsAines, 0)
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "valide": return <CheckCircle className="h-4 w-4" />;
      case "en_attente": return <Clock className="h-4 w-4" />;
      case "rejete": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "valide": return "bg-green-100 text-green-800 border-green-200";
      case "en_attente": return "bg-orange-100 text-orange-800 border-orange-200";
      case "rejete": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "succes": return "bg-green-50 border-l-green-500";
      case "erreur": return "bg-red-50 border-l-red-500";
      default: return "bg-blue-50 border-l-blue-500";
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Demandes de Cérémonie</h1>
          <p className="text-gray-600 mt-2 tracking-tight">
            Gestion des cérémonies de foulards CVAV
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors tracking-tight">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
          <button className="flex items-center space-x-2 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-xl px-4 py-2 hover:from-purple-700 hover:to-purple-800 transition-all tracking-tight">
            <Plus className="h-4 w-4" />
            <span>Nouvelle Demande</span>
          </button>
        </div>
      </div>

      {/* Cartes de statistiques pour cérémonies */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium tracking-tight">Total Demandes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{statsCeremonies.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium tracking-tight">Foulards Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{statsCeremonies.totalFoulards}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Gift className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium tracking-tight">Validées</p>
              <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{statsCeremonies.validees}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium tracking-tight">En Attente</p>
              <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{statsCeremonies.enAttente}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Barre de recherche et filtres pour cérémonies */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par section, lieu..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all tracking-tight"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-4">
              <select
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all tracking-tight"
                value={selectedStatut}
                onChange={(e) => setSelectedStatut(e.target.value)}
              >
                <option value="Tous">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="valide">Validées</option>
                <option value="rejete">Rejetées</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications des cérémonies */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Notifications Cérémonies</h3>
            <span className="text-sm text-purple-600 font-medium cursor-pointer">Voir tout</span>
          </div>
          <div className="space-y-3">
            {notificationsCeremonie.slice(0, 3).map((notification) => (
              <div 
                key={notification._id}
                className={`p-3 rounded-xl border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.lu ? 'ring-2 ring-purple-200' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900 tracking-tight">{notification.titre}</p>
                    <p className="text-xs text-gray-600 mt-1 tracking-tight">{notification.message}</p>
                  </div>
                  {!notification.lu && (
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2 tracking-tight">
                  {new Date(notification.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau des demandes de cérémonie */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Section/Secteur</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Foulards</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Date & Lieu</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Parrains/Marraines</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Statut</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Date Demande</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDemandes.map((demande) => (
                <tr key={demande._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-linear-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {demande.nomSectionOuSecteur[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 tracking-tight">
                          {demande.nomSectionOuSecteur}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-blue-600">B: {demande.foulardsBenjamins}</span>
                        <span className="text-green-600">C: {demande.foulardsCadets}</span>
                        <span className="text-purple-600">A: {demande.foulardsAines}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ 
                            width: `${((demande.foulardsBenjamins + demande.foulardsCadets + demande.foulardsAines) / 50) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-900 tracking-tight">
                          {new Date(demande.dateCeremonie).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500 text-sm tracking-tight">{demande.lieuxCeremonie}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <Users className="h-4 w-4 text-blue-600 mx-auto" />
                        <span className="text-gray-900">{demande.nombreParrains}</span>
                        <p className="text-xs text-gray-500">Parrains</p>
                      </div>
                      <div className="text-center">
                        <Users className="h-4 w-4 text-pink-600 mx-auto" />
                        <span className="text-gray-900">{demande.nombreMarraines}</span>
                        <p className="text-xs text-gray-500">Marraines</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(demande.statut)}`}>
                      {getStatutIcon(demande.statut)}
                      <span>
                        {demande.statut === "en_attente" ? "En attente" :
                         demande.statut === "valide" ? "Validée" : "Rejetée"}
                      </span>
                    </span>
                    {demande.commentaireAdmin && (
                      <div className="mt-1 flex items-start space-x-1">
                        <AlertCircle className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-500 truncate max-w-xs">
                          {demande.commentaireAdmin}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500 text-sm tracking-tight">
                          {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {demande.statut === "valide" && demande.dateValidation && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          Validée le {new Date(demande.dateValidation).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Voir détails">
                        <Eye className="h-4 w-4" />
                      </button>
                      {demande.statut === "en_attente" && (
                        <>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors" title="Valider">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Rejeter">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors" title="Plus d'options">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}