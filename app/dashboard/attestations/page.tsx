// "use client";

// import { useState } from 'react';
// import { 
//   FileText, 
//   Plus, 
//   Search, 
//   Filter,
//   Edit,
//   Trash2,
//   Download,
//   MoreVertical,
//   Eye,
//   CheckCircle,
//   Clock,
//   XCircle,
//   MapPin,
//   Calendar,
//   User,
//   Award,
//   Send,
//   AlertCircle
// } from "lucide-react";

// // Types basés sur vos modèles MongoDB
// interface DemandeAttestation {
//   _id: string;
//   prenom: string;
//   nom: string;
//   paroisse: string;
//   secteur: string;
//   anneeFinFormation: number;
//   lieuDernierCamp: string;
//   bulletinScanne?: string;
//   statut: "en_attente" | "valide" | "rejete";
//   commentaireAdmin?: string;
//   numeroAttestation?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Notification {
//   _id: string;
//   titre: string;
//   message: string;
//   type: "info" | "succes" | "erreur";
//   lu: boolean;
//   createdAt: string;
// }

// export default function AttestationsPage() {
//   // Données mockées basées sur vos modèles
//   const demandesAttestation: DemandeAttestation[] = [
//     {
//       _id: "1",
//       prenom: "Jean",
//       nom: "Dupont",
//       paroisse: "Saint-Pierre",
//       secteur: "Nord",
//       anneeFinFormation: 2024,
//       lieuDernierCamp: "Camp de la Forêt",
//       statut: "en_attente",
//       createdAt: "2024-01-15T10:30:00",
//       updatedAt: "2024-01-15T10:30:00"
//     },
//     {
//       _id: "2",
//       prenom: "Marie",
//       nom: "Curie",
//       paroisse: "Saint-Paul",
//       secteur: "Sud",
//       anneeFinFormation: 2023,
//       lieuDernierCamp: "Camp du Lac",
//       statut: "valide",
//       numeroAttestation: "ATT-2024-002",
//       commentaireAdmin: "Documentation complète et valide",
//       createdAt: "2024-01-14T14:20:00",
//       updatedAt: "2024-01-14T16:45:00"
//     },
//     {
//       _id: "3",
//       prenom: "Paul",
//       nom: "Martin",
//       paroisse: "Saint-Jean",
//       secteur: "Est",
//       anneeFinFormation: 2024,
//       lieuDernierCamp: "Camp de la Montagne",
//       statut: "rejete",
//       commentaireAdmin: "Bulletin manquant",
//       createdAt: "2024-01-13T09:15:00",
//       updatedAt: "2024-01-13T11:30:00"
//     },
//     {
//       _id: "4",
//       prenom: "Sophie",
//       nom: "Laurent",
//       paroisse: "Saint-Pierre",
//       secteur: "Nord",
//       anneeFinFormation: 2023,
//       lieuDernierCamp: "Camp de la Rivière",
//       statut: "valide",
//       numeroAttestation: "ATT-2024-001",
//       createdAt: "2024-01-12T16:40:00",
//       updatedAt: "2024-01-12T16:40:00"
//     },
//     {
//       _id: "5",
//       prenom: "Luc",
//       nom: "Bernard",
//       paroisse: "Saint-Paul",
//       secteur: "Sud",
//       anneeFinFormation: 2024,
//       lieuDernierCamp: "Camp de la Plaine",
//       statut: "en_attente",
//       createdAt: "2024-01-11T08:20:00",
//       updatedAt: "2024-01-11T08:20:00"
//     }
//   ];

//   const notifications: Notification[] = [
//     {
//       _id: "1",
//       titre: "Nouvelle demande d'attestation",
//       message: "Jean Dupont a soumis une demande d'attestation",
//       type: "info",
//       lu: false,
//       createdAt: "2024-01-15T10:30:00"
//     },
//     {
//       _id: "2",
//       titre: "Attestation validée",
//       message: "L'attestation de Marie Curie a été approuvée",
//       type: "succes",
//       lu: true,
//       createdAt: "2024-01-14T16:45:00"
//     },
//     {
//       _id: "3",
//       titre: "Document manquant",
//       message: "Bulletin manquant pour la demande de Paul Martin",
//       type: "erreur",
//       lu: true,
//       createdAt: "2024-01-13T11:30:00"
//     }
//   ];

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatut, setSelectedStatut] = useState("Tous");
//   const [selectedSecteur, setSelectedSecteur] = useState("Tous");

//   // Filtrage des demandes
//   const filteredDemandes = demandesAttestation.filter(demande => {
//     const matchesSearch = 
//       demande.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       demande.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       demande.paroisse.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (demande.numeroAttestation && demande.numeroAttestation.toLowerCase().includes(searchTerm.toLowerCase()));
    
//     const matchesStatut = selectedStatut === "Tous" || demande.statut === selectedStatut;
//     const matchesSecteur = selectedSecteur === "Tous" || demande.secteur === selectedSecteur;

//     return matchesSearch && matchesStatut && matchesSecteur;
//   });

//   // Statistiques
//   const stats = {
//     total: demandesAttestation.length,
//     enAttente: demandesAttestation.filter(d => d.statut === "en_attente").length,
//     validees: demandesAttestation.filter(d => d.statut === "valide").length,
//     rejetees: demandesAttestation.filter(d => d.statut === "rejete").length,
//   };

//   // Options de filtres
//   const statuts = ["Tous", "en_attente", "valide", "rejete"];
//   const secteurs = ["Tous", ...new Set(demandesAttestation.map(d => d.secteur))];

//   const getStatutIcon = (statut: string) => {
//     switch (statut) {
//       case "valide": return <CheckCircle className="h-4 w-4" />;
//       case "en_attente": return <Clock className="h-4 w-4" />;
//       case "rejete": return <XCircle className="h-4 w-4" />;
//       default: return <Clock className="h-4 w-4" />;
//     }
//   };

//   const getStatutColor = (statut: string) => {
//     switch (statut) {
//       case "valide": return "bg-green-100 text-green-800 border-green-200";
//       case "en_attente": return "bg-orange-100 text-orange-800 border-orange-200";
//       case "rejete": return "bg-red-100 text-red-800 border-red-200";
//       default: return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getSecteurColor = (secteur: string) => {
//     switch (secteur) {
//       case "Nord": return "text-blue-600";
//       case "Sud": return "text-green-600";
//       case "Est": return "text-purple-600";
//       default: return "text-gray-600";
//     }
//   };

//   const getNotificationColor = (type: string) => {
//     switch (type) {
//       case "succes": return "bg-green-50 border-l-green-500";
//       case "erreur": return "bg-red-50 border-l-red-500";
//       default: return "bg-blue-50 border-l-blue-500";
//     }
//   };

//   return (
//     <div className="p-6 space-y-6 font-sans">
//       {/* En-tête */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Demandes d'Attestation</h1>
//           <p className="text-gray-600 mt-2 tracking-tight">
//             Gestion des attestations de formation CVAV
//           </p>
//         </div>
//         <div className="flex space-x-3">
//           <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors tracking-tight">
//             <Download className="h-4 w-4" />
//             <span>Exporter</span>
//           </button>
//           <button className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl px-4 py-2 hover:from-blue-700 hover:to-blue-800 transition-all tracking-tight">
//             <Plus className="h-4 w-4" />
//             <span>Nouvelle Demande</span>
//           </button>
//         </div>
//       </div>

//       {/* Cartes de statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium tracking-tight">Total Demandes</p>
//               <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{stats.total}</p>
//             </div>
//             <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
//               <FileText className="h-6 w-6" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium tracking-tight">En Attente</p>
//               <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{stats.enAttente}</p>
//             </div>
//             <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
//               <Clock className="h-6 w-6" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium tracking-tight">Validées</p>
//               <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{stats.validees}</p>
//             </div>
//             <div className="p-3 rounded-xl bg-green-100 text-green-600">
//               <CheckCircle className="h-6 w-6" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium tracking-tight">Rejetées</p>
//               <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{stats.rejetees}</p>
//             </div>
//             <div className="p-3 rounded-xl bg-red-100 text-red-600">
//               <XCircle className="h-6 w-6" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Barre de recherche et filtres */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
//           <div className="flex flex-col lg:flex-row gap-4">
//             {/* Barre de recherche */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder="Rechercher par nom, prénom, paroisse ou numéro..."
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* Filtre statut */}
//             <div className="flex items-center space-x-2">
//               <Filter className="h-4 w-4 text-gray-400" />
//               <select
//                 className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
//                 value={selectedStatut}
//                 onChange={(e) => setSelectedStatut(e.target.value)}
//               >
//                 {statuts.map(statut => (
//                   <option key={statut} value={statut}>
//                     {statut === "en_attente" ? "En attente" : 
//                      statut === "valide" ? "Validées" :
//                      statut === "rejete" ? "Rejetées" : "Tous les statuts"}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Filtre secteur */}
//             <div className="flex items-center space-x-2">
//               <MapPin className="h-4 w-4 text-gray-400" />
//               <select
//                 className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
//                 value={selectedSecteur}
//                 onChange={(e) => setSelectedSecteur(e.target.value)}
//               >
//                 {secteurs.map(secteur => (
//                   <option key={secteur} value={secteur}>{secteur}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Notifications récentes */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Notifications Récentes</h3>
//             <span className="text-sm text-blue-600 font-medium cursor-pointer">Voir tout</span>
//           </div>
//           <div className="space-y-3">
//             {notifications.slice(0, 3).map((notification) => (
//               <div 
//                 key={notification._id}
//                 className={`p-3 rounded-xl border-l-4 ${getNotificationColor(notification.type)} ${
//                   !notification.lu ? 'ring-2 ring-blue-200' : ''
//                 }`}
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm font-medium text-gray-900 tracking-tight">{notification.titre}</p>
//                     <p className="text-xs text-gray-600 mt-1 tracking-tight">{notification.message}</p>
//                   </div>
//                   {!notification.lu && (
//                     <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-400 mt-2 tracking-tight">
//                   {new Date(notification.createdAt).toLocaleDateString('fr-FR')}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Tableau des demandes */}
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200 bg-gray-50">
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Demandeur</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Localisation</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Formation</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Dernier Camp</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Statut</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Date</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredDemandes.map((demande) => (
//                 <tr key={demande._id} className="hover:bg-gray-50 transition-colors">
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                         {demande.prenom[0]}{demande.nom[0]}
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-900 tracking-tight">
//                           {demande.prenom} {demande.nom}
//                         </p>
//                         {demande.numeroAttestation && (
//                           <p className="text-sm text-blue-600 tracking-tight">{demande.numeroAttestation}</p>
//                         )}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="space-y-1">
//                       <div className="flex items-center space-x-1">
//                         <MapPin className="h-3 w-3 text-gray-400" />
//                         <span className="text-gray-900 tracking-tight">{demande.paroisse}</span>
//                       </div>
//                       <span className={`text-xs px-2 py-1 rounded-full ${getSecteurColor(demande.secteur)} bg-opacity-10`}>
//                         {demande.secteur}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-2">
//                       <Award className="h-4 w-4 text-gray-400" />
//                       <span className="text-gray-900 tracking-tight">Fin {demande.anneeFinFormation}</span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6">
//                     <span className="text-gray-900 tracking-tight">{demande.lieuDernierCamp}</span>
//                   </td>
//                   <td className="py-4 px-6">
//                     <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(demande.statut)}`}>
//                       {getStatutIcon(demande.statut)}
//                       <span>
//                         {demande.statut === "en_attente" ? "En attente" :
//                          demande.statut === "valide" ? "Validée" : "Rejetée"}
//                       </span>
//                     </span>
//                     {demande.commentaireAdmin && (
//                       <div className="mt-1 flex items-start space-x-1">
//                         <AlertCircle className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
//                         <span className="text-xs text-gray-500 truncate max-w-xs">
//                           {demande.commentaireAdmin}
//                         </span>
//                       </div>
//                     )}
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="space-y-1">
//                       <div className="flex items-center space-x-1">
//                         <Calendar className="h-3 w-3 text-gray-400" />
//                         <span className="text-gray-500 text-sm tracking-tight">
//                           {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
//                         </span>
//                       </div>
//                       {demande.statut === "valide" && (
//                         <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
//                           Validée le {new Date(demande.updatedAt).toLocaleDateString('fr-FR')}
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-2">
//                       <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Voir détails">
//                         <Eye className="h-4 w-4" />
//                       </button>
//                       {demande.statut === "en_attente" && (
//                         <>
//                           <button className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors" title="Valider">
//                             <CheckCircle className="h-4 w-4" />
//                           </button>
//                           <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Rejeter">
//                             <XCircle className="h-4 w-4" />
//                           </button>
//                         </>
//                       )}
//                       <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors" title="Plus d'options">
//                         <MoreVertical className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pied de tableau */}
//         {filteredDemandes.length === 0 && (
//           <div className="text-center py-12">
//             <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Aucune demande trouvée</h3>
//             <p className="text-gray-500 mt-2 tracking-tight">
//               Aucune demande ne correspond à vos critères de recherche.
//             </p>
//           </div>
//         )}

//         {filteredDemandes.length > 0 && (
//           <div className="border-t border-gray-200 px-6 py-4">
//             <div className="flex justify-between items-center">
//               <p className="text-sm text-gray-600 tracking-tight">
//                 Affichage de <span className="font-semibold">{filteredDemandes.length}</span> demande(s) sur <span className="font-semibold">{demandesAttestation.length}</span>
//               </p>
//               <div className="flex space-x-2">
//                 <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors tracking-tight">
//                   Précédent
//                 </button>
//                 <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors tracking-tight">
//                   Suivant
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Actions rapides */}
//       <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-6 text-white">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-xl font-bold tracking-tight">Actions Rapides</h3>
//             <p className="text-blue-100 mt-2 tracking-tight">Gestion des demandes en attente</p>
//           </div>
//           <div className="flex space-x-4">
//             <button className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors tracking-tight">
//               <CheckCircle className="h-5 w-5" />
//               <span>Valider en lot</span>
//             </button>
//             <button className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors tracking-tight">
//               <Send className="h-5 w-5" />
//               <span>Générer attestations</span>
//             </button>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//           <div className="text-center bg-blue-500/30 rounded-xl p-4">
//             <p className="text-2xl font-bold tracking-tight">{stats.enAttente}</p>
//             <p className="text-blue-100 text-sm tracking-tight">En attente de validation</p>
//           </div>
//           <div className="text-center bg-green-500/30 rounded-xl p-4">
//             <p className="text-2xl font-bold tracking-tight">{stats.validees}</p>
//             <p className="text-blue-100 text-sm tracking-tight">Attestations délivrées</p>
//           </div>
//           <div className="text-center bg-red-500/30 rounded-xl p-4">
//             <p className="text-2xl font-bold tracking-tight">{stats.rejetees}</p>
//             <p className="text-blue-100 text-sm tracking-tight">Demandes rejetées</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Award,
  Download,
  Eye,
  MoreVertical,
  Send,
  AlertCircle,
  User
} from "lucide-react";

// Types pour les attestations
interface DemandeAttestation {
  _id: string;
  prenom: string;
  nom: string;
  paroisse: string;
  secteur: string;
  anneeFinFormation: number;
  lieuDernierCamp: string;
  bulletinScanne?: string;
  statut: "en_attente" | "valide" | "rejete";
  commentaireAdmin?: string;
  numeroAttestation?: string;
  createdAt: string;
  updatedAt: string;
}

// Types pour les notifications d'attestations
interface NotificationAttestation {
  _id: string;
  titre: string;
  message: string;
  type: "info" | "succes" | "erreur";
  lu: boolean;
  createdAt: string;
  lien?: string;
}

export default function AttestationsPage() {
  // Données mockées pour les attestations
  const demandesAttestation: DemandeAttestation[] = [
    {
      _id: "1",
      prenom: "Jean",
      nom: "Dupont",
      paroisse: "Saint-Pierre",
      secteur: "Nord",
      anneeFinFormation: 2024,
      lieuDernierCamp: "Camp de la Forêt",
      statut: "en_attente",
      createdAt: "2024-01-15T10:30:00",
      updatedAt: "2024-01-15T10:30:00"
    },
    {
      _id: "2",
      prenom: "Marie",
      nom: "Curie",
      paroisse: "Saint-Paul",
      secteur: "Sud",
      anneeFinFormation: 2023,
      lieuDernierCamp: "Camp du Lac",
      statut: "valide",
      numeroAttestation: "ATT-2024-002",
      commentaireAdmin: "Documentation complète et valide",
      createdAt: "2024-01-14T14:20:00",
      updatedAt: "2024-01-14T16:45:00"
    }
  ];

  // Notifications spécifiques aux attestations
  const notificationsAttestation: NotificationAttestation[] = [
    {
      _id: "1",
      titre: "Nouvelle demande d'attestation",
      message: "Jean Dupont a soumis une demande d'attestation",
      type: "info",
      lu: false,
      createdAt: "2024-01-15T10:30:00",
      lien: "/attestations/1"
    },
    {
      _id: "2",
      titre: "Attestation validée",
      message: "L'attestation de Marie Curie a été approuvée",
      type: "succes",
      lu: true,
      createdAt: "2024-01-14T16:45:00",
      lien: "/attestations/2"
    },
    {
      _id: "3",
      titre: "Document manquant",
      message: "Bulletin manquant pour la demande de Paul Martin",
      type: "erreur",
      lu: true,
      createdAt: "2024-01-13T11:30:00",
      lien: "/attestations/3"
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("Tous");
  const [selectedSecteur, setSelectedSecteur] = useState("Tous");

  // Filtrage des demandes d'attestation
  const filteredDemandes = demandesAttestation.filter(demande => {
    const matchesSearch = 
      demande.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.paroisse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (demande.numeroAttestation && demande.numeroAttestation.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatut = selectedStatut === "Tous" || demande.statut === selectedStatut;
    const matchesSecteur = selectedSecteur === "Tous" || demande.secteur === selectedSecteur;

    return matchesSearch && matchesStatut && matchesSecteur;
  });

  // Statistiques pour les attestations
  const statsAttestations = {
    total: demandesAttestation.length,
    enAttente: demandesAttestation.filter(d => d.statut === "en_attente").length,
    validees: demandesAttestation.filter(d => d.statut === "valide").length,
    rejetees: demandesAttestation.filter(d => d.statut === "rejete").length,
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Demandes d'Attestation</h1>
          <p className="text-gray-600 mt-2 tracking-tight">
            Gestion des attestations de formation CVAV
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors tracking-tight">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
          <button className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl px-4 py-2 hover:from-blue-700 hover:to-blue-800 transition-all tracking-tight">
            <Plus className="h-4 w-4" />
            <span>Nouvelle Demande</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, paroisse ou numéro..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-4">
              <select
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
                value={selectedStatut}
                onChange={(e) => setSelectedStatut(e.target.value)}
              >
                <option value="Tous">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="valide">Validées</option>
                <option value="rejete">Rejetées</option>
              </select>

              <select
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
                value={selectedSecteur}
                onChange={(e) => setSelectedSecteur(e.target.value)}
              >
                <option value="Tous">Tous les secteurs</option>
                <option value="Nord">Nord</option>
                <option value="Sud">Sud</option>
                <option value="Est">Est</option>
                <option value="Ouest">Ouest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications des attestations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Notifications Attestations</h3>
            <span className="text-sm text-blue-600 font-medium cursor-pointer">Voir tout</span>
          </div>
          <div className="space-y-3">
            {notificationsAttestation.slice(0, 3).map((notification) => (
              <div 
                key={notification._id}
                className={`p-3 rounded-xl border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.lu ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900 tracking-tight">{notification.titre}</p>
                    <p className="text-xs text-gray-600 mt-1 tracking-tight">{notification.message}</p>
                  </div>
                  {!notification.lu && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
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

      {/* Le reste de votre code pour le tableau des attestations reste identique */}
      {/* ... (tableau, statistiques, etc.) */}
    </div>
  );
}