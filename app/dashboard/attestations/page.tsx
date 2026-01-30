// // "use client";

// // import { useState } from 'react';
// // import { 
// //   FileText, 
// //   Plus, 
// //   Search, 
// //   Filter,
// //   Edit,
// //   Trash2,
// //   Download,
// //   MoreVertical,
// //   Eye,
// //   CheckCircle,
// //   Clock,
// //   XCircle,
// //   MapPin,
// //   Calendar,
// //   User,
// //   Award,
// //   Send,
// //   AlertCircle
// // } from "lucide-react";

// // // Types basés sur vos modèles MongoDB
// // interface DemandeAttestation {
// //   _id: string;
// //   prenom: string;
// //   nom: string;
// //   paroisse: string;
// //   secteur: string;
// //   anneeFinFormation: number;
// //   lieuDernierCamp: string;
// //   bulletinScanne?: string;
// //   statut: "en_attente" | "valide" | "rejete";
// //   commentaireAdmin?: string;
// //   numeroAttestation?: string;
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // interface Notification {
// //   _id: string;
// //   titre: string;
// //   message: string;
// //   type: "info" | "succes" | "erreur";
// //   lu: boolean;
// //   createdAt: string;
// // }

// // export default function AttestationsPage() {
// //   // Données mockées basées sur vos modèles
// //   const demandesAttestation: DemandeAttestation[] = [
// //     {
// //       _id: "1",
// //       prenom: "Jean",
// //       nom: "Dupont",
// //       paroisse: "Saint-Pierre",
// //       secteur: "Nord",
// //       anneeFinFormation: 2024,
// //       lieuDernierCamp: "Camp de la Forêt",
// //       statut: "en_attente",
// //       createdAt: "2024-01-15T10:30:00",
// //       updatedAt: "2024-01-15T10:30:00"
// //     },
// //     {
// //       _id: "2",
// //       prenom: "Marie",
// //       nom: "Curie",
// //       paroisse: "Saint-Paul",
// //       secteur: "Sud",
// //       anneeFinFormation: 2023,
// //       lieuDernierCamp: "Camp du Lac",
// //       statut: "valide",
// //       numeroAttestation: "ATT-2024-002",
// //       commentaireAdmin: "Documentation complète et valide",
// //       createdAt: "2024-01-14T14:20:00",
// //       updatedAt: "2024-01-14T16:45:00"
// //     },
// //     {
// //       _id: "3",
// //       prenom: "Paul",
// //       nom: "Martin",
// //       paroisse: "Saint-Jean",
// //       secteur: "Est",
// //       anneeFinFormation: 2024,
// //       lieuDernierCamp: "Camp de la Montagne",
// //       statut: "rejete",
// //       commentaireAdmin: "Bulletin manquant",
// //       createdAt: "2024-01-13T09:15:00",
// //       updatedAt: "2024-01-13T11:30:00"
// //     },
// //     {
// //       _id: "4",
// //       prenom: "Sophie",
// //       nom: "Laurent",
// //       paroisse: "Saint-Pierre",
// //       secteur: "Nord",
// //       anneeFinFormation: 2023,
// //       lieuDernierCamp: "Camp de la Rivière",
// //       statut: "valide",
// //       numeroAttestation: "ATT-2024-001",
// //       createdAt: "2024-01-12T16:40:00",
// //       updatedAt: "2024-01-12T16:40:00"
// //     },
// //     {
// //       _id: "5",
// //       prenom: "Luc",
// //       nom: "Bernard",
// //       paroisse: "Saint-Paul",
// //       secteur: "Sud",
// //       anneeFinFormation: 2024,
// //       lieuDernierCamp: "Camp de la Plaine",
// //       statut: "en_attente",
// //       createdAt: "2024-01-11T08:20:00",
// //       updatedAt: "2024-01-11T08:20:00"
// //     }
// //   ];

// //   const notifications: Notification[] = [
// //     {
// //       _id: "1",
// //       titre: "Nouvelle demande d'attestation",
// //       message: "Jean Dupont a soumis une demande d'attestation",
// //       type: "info",
// //       lu: false,
// //       createdAt: "2024-01-15T10:30:00"
// //     },
// //     {
// //       _id: "2",
// //       titre: "Attestation validée",
// //       message: "L'attestation de Marie Curie a été approuvée",
// //       type: "succes",
// //       lu: true,
// //       createdAt: "2024-01-14T16:45:00"
// //     },
// //     {
// //       _id: "3",
// //       titre: "Document manquant",
// //       message: "Bulletin manquant pour la demande de Paul Martin",
// //       type: "erreur",
// //       lu: true,
// //       createdAt: "2024-01-13T11:30:00"
// //     }
// //   ];

// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [selectedStatut, setSelectedStatut] = useState("Tous");
// //   const [selectedSecteur, setSelectedSecteur] = useState("Tous");

// //   // Filtrage des demandes
// //   const filteredDemandes = demandesAttestation.filter(demande => {
// //     const matchesSearch = 
// //       demande.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       demande.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       demande.paroisse.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       (demande.numeroAttestation && demande.numeroAttestation.toLowerCase().includes(searchTerm.toLowerCase()));
    
// //     const matchesStatut = selectedStatut === "Tous" || demande.statut === selectedStatut;
// //     const matchesSecteur = selectedSecteur === "Tous" || demande.secteur === selectedSecteur;

// //     return matchesSearch && matchesStatut && matchesSecteur;
// //   });

// //   // Statistiques
// //   const stats = {
// //     total: demandesAttestation.length,
// //     enAttente: demandesAttestation.filter(d => d.statut === "en_attente").length,
// //     validees: demandesAttestation.filter(d => d.statut === "valide").length,
// //     rejetees: demandesAttestation.filter(d => d.statut === "rejete").length,
// //   };

// //   // Options de filtres
// //   const statuts = ["Tous", "en_attente", "valide", "rejete"];
// //   const secteurs = ["Tous", ...new Set(demandesAttestation.map(d => d.secteur))];

// //   const getStatutIcon = (statut: string) => {
// //     switch (statut) {
// //       case "valide": return <CheckCircle className="h-4 w-4" />;
// //       case "en_attente": return <Clock className="h-4 w-4" />;
// //       case "rejete": return <XCircle className="h-4 w-4" />;
// //       default: return <Clock className="h-4 w-4" />;
// //     }
// //   };

// //   const getStatutColor = (statut: string) => {
// //     switch (statut) {
// //       case "valide": return "bg-green-100 text-green-800 border-green-200";
// //       case "en_attente": return "bg-orange-100 text-orange-800 border-orange-200";
// //       case "rejete": return "bg-red-100 text-red-800 border-red-200";
// //       default: return "bg-gray-100 text-gray-800 border-gray-200";
// //     }
// //   };

// //   const getSecteurColor = (secteur: string) => {
// //     switch (secteur) {
// //       case "Nord": return "text-blue-600";
// //       case "Sud": return "text-green-600";
// //       case "Est": return "text-purple-600";
// //       default: return "text-gray-600";
// //     }
// //   };

// //   const getNotificationColor = (type: string) => {
// //     switch (type) {
// //       case "succes": return "bg-green-50 border-l-green-500";
// //       case "erreur": return "bg-red-50 border-l-red-500";
// //       default: return "bg-blue-50 border-l-blue-500";
// //     }
// //   };

// //   return (
// //     <div className="p-6 space-y-6 font-sans">
// //       {/* En-tête */}
// //       <div className="flex justify-between items-center">
// //         <div>
// //           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Demandes d'Attestation</h1>
// //           <p className="text-gray-600 mt-2 tracking-tight">
// //             Gestion des attestations de formation CVAV
// //           </p>
// //         </div>
// //         <div className="flex space-x-3">
// //           <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors tracking-tight">
// //             <Download className="h-4 w-4" />
// //             <span>Exporter</span>
// //           </button>
// //           <button className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl px-4 py-2 hover:from-blue-700 hover:to-blue-800 transition-all tracking-tight">
// //             <Plus className="h-4 w-4" />
// //             <span>Nouvelle Demande</span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Cartes de statistiques */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// //         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-gray-600 text-sm font-medium tracking-tight">Total Demandes</p>
// //               <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{stats.total}</p>
// //             </div>
// //             <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
// //               <FileText className="h-6 w-6" />
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-gray-600 text-sm font-medium tracking-tight">En Attente</p>
// //               <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{stats.enAttente}</p>
// //             </div>
// //             <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
// //               <Clock className="h-6 w-6" />
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-gray-600 text-sm font-medium tracking-tight">Validées</p>
// //               <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{stats.validees}</p>
// //             </div>
// //             <div className="p-3 rounded-xl bg-green-100 text-green-600">
// //               <CheckCircle className="h-6 w-6" />
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-gray-600 text-sm font-medium tracking-tight">Rejetées</p>
// //               <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{stats.rejetees}</p>
// //             </div>
// //             <div className="p-3 rounded-xl bg-red-100 text-red-600">
// //               <XCircle className="h-6 w-6" />
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         {/* Barre de recherche et filtres */}
// //         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
// //           <div className="flex flex-col lg:flex-row gap-4">
// //             {/* Barre de recherche */}
// //             <div className="flex-1 relative">
// //               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
// //               <input
// //                 type="text"
// //                 placeholder="Rechercher par nom, prénom, paroisse ou numéro..."
// //                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //               />
// //             </div>

// //             {/* Filtre statut */}
// //             <div className="flex items-center space-x-2">
// //               <Filter className="h-4 w-4 text-gray-400" />
// //               <select
// //                 className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
// //                 value={selectedStatut}
// //                 onChange={(e) => setSelectedStatut(e.target.value)}
// //               >
// //                 {statuts.map(statut => (
// //                   <option key={statut} value={statut}>
// //                     {statut === "en_attente" ? "En attente" : 
// //                      statut === "valide" ? "Validées" :
// //                      statut === "rejete" ? "Rejetées" : "Tous les statuts"}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* Filtre secteur */}
// //             <div className="flex items-center space-x-2">
// //               <MapPin className="h-4 w-4 text-gray-400" />
// //               <select
// //                 className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
// //                 value={selectedSecteur}
// //                 onChange={(e) => setSelectedSecteur(e.target.value)}
// //               >
// //                 {secteurs.map(secteur => (
// //                   <option key={secteur} value={secteur}>{secteur}</option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Notifications récentes */}
// //         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
// //           <div className="flex items-center justify-between mb-4">
// //             <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Notifications Récentes</h3>
// //             <span className="text-sm text-blue-600 font-medium cursor-pointer">Voir tout</span>
// //           </div>
// //           <div className="space-y-3">
// //             {notifications.slice(0, 3).map((notification) => (
// //               <div 
// //                 key={notification._id}
// //                 className={`p-3 rounded-xl border-l-4 ${getNotificationColor(notification.type)} ${
// //                   !notification.lu ? 'ring-2 ring-blue-200' : ''
// //                 }`}
// //               >
// //                 <div className="flex justify-between items-start">
// //                   <div>
// //                     <p className="text-sm font-medium text-gray-900 tracking-tight">{notification.titre}</p>
// //                     <p className="text-xs text-gray-600 mt-1 tracking-tight">{notification.message}</p>
// //                   </div>
// //                   {!notification.lu && (
// //                     <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
// //                   )}
// //                 </div>
// //                 <p className="text-xs text-gray-400 mt-2 tracking-tight">
// //                   {new Date(notification.createdAt).toLocaleDateString('fr-FR')}
// //                 </p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Tableau des demandes */}
// //       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead>
// //               <tr className="border-b border-gray-200 bg-gray-50">
// //                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Demandeur</th>
// //                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Localisation</th>
// //                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Formation</th>
// //                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Dernier Camp</th>
// //                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Statut</th>
// //                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Date</th>
// //                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-200">
// //               {filteredDemandes.map((demande) => (
// //                 <tr key={demande._id} className="hover:bg-gray-50 transition-colors">
// //                   <td className="py-4 px-6">
// //                     <div className="flex items-center space-x-3">
// //                       <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
// //                         {demande.prenom[0]}{demande.nom[0]}
// //                       </div>
// //                       <div>
// //                         <p className="font-semibold text-gray-900 tracking-tight">
// //                           {demande.prenom} {demande.nom}
// //                         </p>
// //                         {demande.numeroAttestation && (
// //                           <p className="text-sm text-blue-600 tracking-tight">{demande.numeroAttestation}</p>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </td>
// //                   <td className="py-4 px-6">
// //                     <div className="space-y-1">
// //                       <div className="flex items-center space-x-1">
// //                         <MapPin className="h-3 w-3 text-gray-400" />
// //                         <span className="text-gray-900 tracking-tight">{demande.paroisse}</span>
// //                       </div>
// //                       <span className={`text-xs px-2 py-1 rounded-full ${getSecteurColor(demande.secteur)} bg-opacity-10`}>
// //                         {demande.secteur}
// //                       </span>
// //                     </div>
// //                   </td>
// //                   <td className="py-4 px-6">
// //                     <div className="flex items-center space-x-2">
// //                       <Award className="h-4 w-4 text-gray-400" />
// //                       <span className="text-gray-900 tracking-tight">Fin {demande.anneeFinFormation}</span>
// //                     </div>
// //                   </td>
// //                   <td className="py-4 px-6">
// //                     <span className="text-gray-900 tracking-tight">{demande.lieuDernierCamp}</span>
// //                   </td>
// //                   <td className="py-4 px-6">
// //                     <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(demande.statut)}`}>
// //                       {getStatutIcon(demande.statut)}
// //                       <span>
// //                         {demande.statut === "en_attente" ? "En attente" :
// //                          demande.statut === "valide" ? "Validée" : "Rejetée"}
// //                       </span>
// //                     </span>
// //                     {demande.commentaireAdmin && (
// //                       <div className="mt-1 flex items-start space-x-1">
// //                         <AlertCircle className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
// //                         <span className="text-xs text-gray-500 truncate max-w-xs">
// //                           {demande.commentaireAdmin}
// //                         </span>
// //                       </div>
// //                     )}
// //                   </td>
// //                   <td className="py-4 px-6">
// //                     <div className="space-y-1">
// //                       <div className="flex items-center space-x-1">
// //                         <Calendar className="h-3 w-3 text-gray-400" />
// //                         <span className="text-gray-500 text-sm tracking-tight">
// //                           {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
// //                         </span>
// //                       </div>
// //                       {demande.statut === "valide" && (
// //                         <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
// //                           Validée le {new Date(demande.updatedAt).toLocaleDateString('fr-FR')}
// //                         </span>
// //                       )}
// //                     </div>
// //                   </td>
// //                   <td className="py-4 px-6">
// //                     <div className="flex items-center space-x-2">
// //                       <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Voir détails">
// //                         <Eye className="h-4 w-4" />
// //                       </button>
// //                       {demande.statut === "en_attente" && (
// //                         <>
// //                           <button className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors" title="Valider">
// //                             <CheckCircle className="h-4 w-4" />
// //                           </button>
// //                           <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Rejeter">
// //                             <XCircle className="h-4 w-4" />
// //                           </button>
// //                         </>
// //                       )}
// //                       <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors" title="Plus d'options">
// //                         <MoreVertical className="h-4 w-4" />
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Pied de tableau */}
// //         {filteredDemandes.length === 0 && (
// //           <div className="text-center py-12">
// //             <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
// //             <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Aucune demande trouvée</h3>
// //             <p className="text-gray-500 mt-2 tracking-tight">
// //               Aucune demande ne correspond à vos critères de recherche.
// //             </p>
// //           </div>
// //         )}

// //         {filteredDemandes.length > 0 && (
// //           <div className="border-t border-gray-200 px-6 py-4">
// //             <div className="flex justify-between items-center">
// //               <p className="text-sm text-gray-600 tracking-tight">
// //                 Affichage de <span className="font-semibold">{filteredDemandes.length}</span> demande(s) sur <span className="font-semibold">{demandesAttestation.length}</span>
// //               </p>
// //               <div className="flex space-x-2">
// //                 <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors tracking-tight">
// //                   Précédent
// //                 </button>
// //                 <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors tracking-tight">
// //                   Suivant
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Actions rapides */}
// //       <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-6 text-white">
// //         <div className="flex justify-between items-center">
// //           <div>
// //             <h3 className="text-xl font-bold tracking-tight">Actions Rapides</h3>
// //             <p className="text-blue-100 mt-2 tracking-tight">Gestion des demandes en attente</p>
// //           </div>
// //           <div className="flex space-x-4">
// //             <button className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors tracking-tight">
// //               <CheckCircle className="h-5 w-5" />
// //               <span>Valider en lot</span>
// //             </button>
// //             <button className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors tracking-tight">
// //               <Send className="h-5 w-5" />
// //               <span>Générer attestations</span>
// //             </button>
// //           </div>
// //         </div>
        
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
// //           <div className="text-center bg-blue-500/30 rounded-xl p-4">
// //             <p className="text-2xl font-bold tracking-tight">{stats.enAttente}</p>
// //             <p className="text-blue-100 text-sm tracking-tight">En attente de validation</p>
// //           </div>
// //           <div className="text-center bg-green-500/30 rounded-xl p-4">
// //             <p className="text-2xl font-bold tracking-tight">{stats.validees}</p>
// //             <p className="text-blue-100 text-sm tracking-tight">Attestations délivrées</p>
// //           </div>
// //           <div className="text-center bg-red-500/30 rounded-xl p-4">
// //             <p className="text-2xl font-bold tracking-tight">{stats.rejetees}</p>
// //             <p className="text-blue-100 text-sm tracking-tight">Demandes rejetées</p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// //app/dashboard/attestations/page.tsx

// //aide moi à compléter le code suivant : et trouver une bon logique pour structurer une page d'attestations dans un dashboard d'administration d'une application web de gestion de formations CVAV.
// "use client";

// import { useState } from 'react';
// import { 
//   FileText, 
//   Plus, 
//   Search, 
//   Filter,
//   CheckCircle,
//   Clock,
//   XCircle,
//   MapPin,
//   Calendar,
//   Award,
//   Download,
//   Eye,
//   MoreVertical,
//   Send,
//   AlertCircle,
//   User
// } from "lucide-react";

// // Types pour les attestations
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

// // Types pour les notifications d'attestations
// interface NotificationAttestation {
//   _id: string;
//   titre: string;
//   message: string;
//   type: "info" | "succes" | "erreur";
//   lu: boolean;
//   createdAt: string;
//   lien?: string;
// }

// export default function AttestationsPage() {
//   // Données mockées pour les attestations
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
//     }
//   ];

//   // Notifications spécifiques aux attestations
//   const notificationsAttestation: NotificationAttestation[] = [
//     {
//       _id: "1",
//       titre: "Nouvelle demande d'attestation",
//       message: "Jean Dupont a soumis une demande d'attestation",
//       type: "info",
//       lu: false,
//       createdAt: "2024-01-15T10:30:00",
//       lien: "/attestations/1"
//     },
//     {
//       _id: "2",
//       titre: "Attestation validée",
//       message: "L'attestation de Marie Curie a été approuvée",
//       type: "succes",
//       lu: true,
//       createdAt: "2024-01-14T16:45:00",
//       lien: "/attestations/2"
//     },
//     {
//       _id: "3",
//       titre: "Document manquant",
//       message: "Bulletin manquant pour la demande de Paul Martin",
//       type: "erreur",
//       lu: true,
//       createdAt: "2024-01-13T11:30:00",
//       lien: "/attestations/3"
//     }
//   ];

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatut, setSelectedStatut] = useState("Tous");
//   const [selectedSecteur, setSelectedSecteur] = useState("Tous");

//   // Filtrage des demandes d'attestation
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

//   // Statistiques pour les attestations
//   const statsAttestations = {
//     total: demandesAttestation.length,
//     enAttente: demandesAttestation.filter(d => d.statut === "en_attente").length,
//     validees: demandesAttestation.filter(d => d.statut === "valide").length,
//     rejetees: demandesAttestation.filter(d => d.statut === "rejete").length,
//   };

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

//             {/* Filtres */}
//             <div className="flex gap-4">
//               <select
//                 className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
//                 value={selectedStatut}
//                 onChange={(e) => setSelectedStatut(e.target.value)}
//               >
//                 <option value="Tous">Tous les statuts</option>
//                 <option value="en_attente">En attente</option>
//                 <option value="valide">Validées</option>
//                 <option value="rejete">Rejetées</option>
//               </select>

//               <select
//                 className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
//                 value={selectedSecteur}
//                 onChange={(e) => setSelectedSecteur(e.target.value)}
//               >
//                 <option value="Tous">Tous les secteurs</option>
//                 <option value="Nord">Nord</option>
//                 <option value="Sud">Sud</option>
//                 <option value="Est">Est</option>
//                 <option value="Ouest">Ouest</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Notifications des attestations */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Notifications Attestations</h3>
//             <span className="text-sm text-blue-600 font-medium cursor-pointer">Voir tout</span>
//           </div>
//           <div className="space-y-3">
//             {notificationsAttestation.slice(0, 3).map((notification) => (
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

//       {/* Le reste de votre code pour le tableau des attestations reste identique */}
//       {/* ... (tableau, statistiques, etc.) */}
//     </div>
//   );
// }

// app/dashboard/attestations/page.tsx - PAGE UTILISATEUR COMPLÈTE
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  FileText, Plus, Search, Eye, Edit, Trash2, Send, Loader2,
  CheckCircle, Clock, XCircle, AlertCircle, Download, Calendar,
  User, MapPin, Award
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

interface DemandeAttestation {
  _id: string;
  prenom: string;
  nom: string;
  paroisse: string;
  secteur: string;
  anneeFinFormation: number;
  lieuDernierCamp: string;
  soumise: boolean; // ✅ Nouveau champ
  statut: "en_attente" | "valide" | "rejete";
  commentaireAdmin?: string;
  numeroAttestation?: string;
  dateSoumission?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AttestationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [demandes, setDemandes] = useState<DemandeAttestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // ✅ Admins voient les brouillons par défaut, autres utilisateurs voient les soumises
  const defaultTab = user?.role?.nom === 'Admin' ? 'brouillons' : 'soumises';
  const [activeTab, setActiveTab] = useState<'brouillons' | 'soumises'>(defaultTab);

  useEffect(() => {
    fetchDemandes();
  }, [activeTab, user]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      // Construire l'URL en fonction de l'onglet et du rôle
      let url = '/api/attestations';
      if (user?.role?.nom === 'Admin') {
        if (activeTab === 'brouillons') url = '/api/attestations?view=brouillons';
        if (activeTab === 'soumises') url = '/api/attestations?view=soumises';
      }
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur chargement');
      
      const data = await res.json();
      setDemandes(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleSoumettre = async (id: string) => {
    if (!confirm('Soumettre cette demande aux administrateurs ?')) return;
    
    const loadingToast = toast.loading('Soumission en cours...');
    
    try {
      const res = await fetch(`/api/attestations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ soumise: true })
      });

      if (!res.ok) throw new Error('Erreur soumission');
      
      toast.success('Demande soumise avec succès !', { id: loadingToast });
      fetchDemandes();
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    }
  };

  const handleDelete = async (id: string, nom: string) => {
    if (!confirm(`Supprimer la demande pour ${nom} ?`)) return;
    
    const loadingToast = toast.loading('Suppression...');
    
    try {
      const res = await fetch(`/api/attestations/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Erreur suppression');
      
      toast.success('Demande supprimée', { id: loadingToast });
      fetchDemandes();
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    }
  };

  // Filtrer les demandes
  const brouillons = demandes.filter(d => !d.soumise);
  const soumises = demandes.filter(d => d.soumise);
  
  const demandesFiltrees = (activeTab === 'brouillons' ? brouillons : soumises).filter(d =>
    d.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.numeroAttestation && d.numeroAttestation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "valide":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "en_attente":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "rejete":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "valide": return <CheckCircle className="h-4 w-4" />;
      case "en_attente": return <Clock className="h-4 w-4" />;
      case "rejete": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                Mes Demandes d'Attestation
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {demandes.length} demandes · {brouillons.length} brouillons · {soumises.length} soumises
              </p>
            </div>

            <button
              onClick={() => router.push('/dashboard/attestations/creer')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Nouvelle Demande
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              label="Total" 
              value={demandes.length} 
              icon={FileText}
              color="slate" 
            />
            <StatCard 
              label="Brouillons" 
              value={brouillons.length} 
              icon={Edit}
              color="amber" 
            />
            <StatCard 
              label="En attente" 
              value={soumises.filter(d => d.statut === 'en_attente').length} 
              icon={Clock}
              color="blue" 
            />
            <StatCard 
              label="Validées" 
              value={soumises.filter(d => d.statut === 'valide').length} 
              icon={CheckCircle}
              color="emerald" 
            />
          </div>

          {/* Onglets */}
          <div className="bg-white rounded-xl border border-slate-200 p-1">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('brouillons')}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'brouillons'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Brouillons ({brouillons.length})
              </button>
              <button
                onClick={() => setActiveTab('soumises')}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'soumises'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Soumises ({soumises.length})
              </button>
            </div>
          </div>

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Liste des demandes */}
          {demandesFiltrees.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 text-sm">
                {activeTab === 'brouillons' 
                  ? 'Aucun brouillon. Créez une nouvelle demande !'
                  : 'Aucune demande soumise'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {demandesFiltrees.map((demande) => (
                <DemandeCard
                  key={demande._id}
                  demande={demande}
                  onSoumettre={handleSoumettre}
                  onDelete={handleDelete}
                  getStatutBadge={getStatutBadge}
                  getStatutIcon={getStatutIcon}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Composant Card Demande
function DemandeCard({ 
  demande, 
  onSoumettre, 
  onDelete,
  getStatutBadge,
  getStatutIcon
}: any) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-lg transition-all">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {demande.prenom[0]}{demande.nom[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm truncate">
              {demande.prenom} {demande.nom}
            </h3>
            <p className="text-xs text-slate-500 truncate">{demande.paroisse}</p>
          </div>
        </div>

        {demande.soumise && (
          <span className={`px-2.5 py-1 text-xs font-medium rounded-md border flex items-center gap-1 ${getStatutBadge(demande.statut)}`}>
            {getStatutIcon(demande.statut)}
            <span className="capitalize">{demande.statut.replace('_', ' ')}</span>
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>Formation {demande.anneeFinFormation}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span className="truncate">{demande.lieuDernierCamp}</span>
        </div>
        {demande.numeroAttestation && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
            <Award className="h-3.5 w-3.5" />
            <span className="font-medium">{demande.numeroAttestation}</span>
          </div>
        )}
      </div>

      {/* Commentaire admin si rejeté */}
      {demande.statut === 'rejete' && demande.commentaireAdmin && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{demande.commentaireAdmin}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        {!demande.soumise ? (
          <>
            <button
              onClick={() => router.push(`/dashboard/attestations/${demande._id}/edit`)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Edit className="h-3.5 w-3.5" />
              Modifier
            </button>
            <button
              onClick={() => onSoumettre(demande._id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              Soumettre
            </button>
            <button
              onClick={() => onDelete(demande._id, `${demande.prenom} ${demande.nom}`)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push(`/dashboard/attestations/${demande._id}`)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              Voir
            </button>
            {demande.statut === 'valide' && demande.numeroAttestation && (
              <button
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Télécharger
              </button>
            )}
          </>
        )}
      </div>

      {/* Date */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          {demande.soumise && demande.dateSoumission 
            ? `Soumise le ${new Date(demande.dateSoumission).toLocaleDateString('fr-FR')}`
            : `Créée le ${new Date(demande.createdAt).toLocaleDateString('fr-FR')}`
          }
        </p>
      </div>
    </div>
  );
}

// Composant StatCard
function StatCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    slate: 'bg-slate-50 border-slate-200 text-slate-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900'
  };

  return (
    <div className={`${colors[color]} rounded-xl border p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <Icon className="h-5 w-5 opacity-50" />
      </div>
    </div>
  );
}