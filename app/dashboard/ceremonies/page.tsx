// //app/dashboard/ceremonies/page.tsx


// //aide moi à compléter le code suivant : et trouver une bon logique pour structurer une page de cérémonies dans un dashboard d'administration d'une application web de gestion de formations CVAV.
// "use client";

// import { useState } from 'react';
// import { 
//   Calendar, 
//   Plus, 
//   Search, 
//   Filter,
//   CheckCircle,
//   Clock,
//   XCircle,
//   MapPin,
//   Users,
//   Gift,
//   Download,
//   Eye,
//   MoreVertical,
//   Send,
//   AlertCircle,
//   FileText
// } from "lucide-react";

// // Types pour les cérémonies basés sur votre modèle
// interface DemandeCeremonie {
//   _id: string;
//   utilisateur: string;
//   nomSectionOuSecteur: string;
//   foulardsBenjamins: number;
//   foulardsCadets: number;
//   foulardsAines: number;
//   dateCeremonie: string;
//   lieuxCeremonie: string;
//   nombreParrains: number;
//   nombreMarraines: number;
//   statut: "en_attente" | "valide" | "rejete";
//   commentaireAdmin?: string;
//   validePar?: string;
//   dateValidation?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// // Types pour les notifications de cérémonies
// interface NotificationCeremonie {
//   _id: string;
//   titre: string;
//   message: string;
//   type: "info" | "succes" | "erreur";
//   lu: boolean;
//   createdAt: string;
//   lien?: string;
// }

// export default function CeremoniesPage() {
//   // Données mockées pour les cérémonies
//   const demandesCeremonie: DemandeCeremonie[] = [
//     {
//       _id: "1",
//       utilisateur: "user1",
//       nomSectionOuSecteur: "Secteur Nord",
//       foulardsBenjamins: 15,
//       foulardsCadets: 12,
//       foulardsAines: 8,
//       dateCeremonie: "2024-02-15T18:00:00",
//       lieuxCeremonie: "Église Saint-Pierre",
//       nombreParrains: 5,
//       nombreMarraines: 5,
//       statut: "en_attente",
//       createdAt: "2024-01-15T10:30:00",
//       updatedAt: "2024-01-15T10:30:00"
//     },
//     {
//       _id: "2",
//       utilisateur: "user2",
//       nomSectionOuSecteur: "Section Jeannettes",
//       foulardsBenjamins: 20,
//       foulardsCadets: 0,
//       foulardsAines: 0,
//       dateCeremonie: "2024-02-20T17:30:00",
//       lieuxCeremonie: "Salle paroissiale",
//       nombreParrains: 3,
//       nombreMarraines: 3,
//       statut: "valide",
//       commentaireAdmin: "Cérémonie approuvée",
//       validePar: "admin1",
//       dateValidation: "2024-01-14T16:45:00",
//       createdAt: "2024-01-14T14:20:00",
//       updatedAt: "2024-01-14T16:45:00"
//     }
//   ];

//   // Notifications spécifiques aux cérémonies
//   const notificationsCeremonie: NotificationCeremonie[] = [
//     {
//       _id: "1",
//       titre: "Nouvelle demande de cérémonie",
//       message: "Secteur Nord a demandé une cérémonie de foulards",
//       type: "info",
//       lu: false,
//       createdAt: "2024-01-15T10:30:00",
//       lien: "/ceremonies/1"
//     },
//     {
//       _id: "2",
//       titre: "Cérémonie validée",
//       message: "La cérémonie des Jeannettes a été approuvée",
//       type: "succes",
//       lu: true,
//       createdAt: "2024-01-14T16:45:00",
//       lien: "/ceremonies/2"
//     },
//     {
//       _id: "3",
//       titre: "Document manquant",
//       message: "Courrier manquant pour la cérémonie du Secteur Est",
//       type: "erreur",
//       lu: true,
//       createdAt: "2024-01-13T11:30:00",
//       lien: "/ceremonies/3"
//     }
//   ];

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatut, setSelectedStatut] = useState("Tous");
//   const [selectedType, setSelectedType] = useState("Tous");

//   // Filtrage des demandes de cérémonie
//   const filteredDemandes = demandesCeremonie.filter(demande => {
//     const matchesSearch = 
//       demande.nomSectionOuSecteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       demande.lieuxCeremonie.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatut = selectedStatut === "Tous" || demande.statut === selectedStatut;
//     const matchesType = selectedType === "Tous" || true; // Adaptez selon vos besoins

//     return matchesSearch && matchesStatut && matchesType;
//   });

//   // Statistiques pour les cérémonies
//   const statsCeremonies = {
//     total: demandesCeremonie.length,
//     enAttente: demandesCeremonie.filter(d => d.statut === "en_attente").length,
//     validees: demandesCeremonie.filter(d => d.statut === "valide").length,
//     rejetees: demandesCeremonie.filter(d => d.statut === "rejete").length,
//     totalFoulards: demandesCeremonie.reduce((sum, d) => sum + d.foulardsBenjamins + d.foulardsCadets + d.foulardsAines, 0)
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
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Demandes de Cérémonie</h1>
//           <p className="text-gray-600 mt-2 tracking-tight">
//             Gestion des cérémonies de foulards CVAV
//           </p>
//         </div>
//         <div className="flex space-x-3">
//           <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors tracking-tight">
//             <Download className="h-4 w-4" />
//             <span>Exporter</span>
//           </button>
//           <button className="flex items-center space-x-2 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-xl px-4 py-2 hover:from-purple-700 hover:to-purple-800 transition-all tracking-tight">
//             <Plus className="h-4 w-4" />
//             <span>Nouvelle Demande</span>
//           </button>
//         </div>
//       </div>

//       {/* Cartes de statistiques pour cérémonies */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium tracking-tight">Total Demandes</p>
//               <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{statsCeremonies.total}</p>
//             </div>
//             <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
//               <Calendar className="h-6 w-6" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium tracking-tight">Foulards Total</p>
//               <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{statsCeremonies.totalFoulards}</p>
//             </div>
//             <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
//               <Gift className="h-6 w-6" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium tracking-tight">Validées</p>
//               <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{statsCeremonies.validees}</p>
//             </div>
//             <div className="p-3 rounded-xl bg-green-100 text-green-600">
//               <CheckCircle className="h-6 w-6" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium tracking-tight">En Attente</p>
//               <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{statsCeremonies.enAttente}</p>
//             </div>
//             <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
//               <Clock className="h-6 w-6" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Barre de recherche et filtres pour cérémonies */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
//           <div className="flex flex-col lg:flex-row gap-4">
//             {/* Barre de recherche */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder="Rechercher par section, lieu..."
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all tracking-tight"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* Filtres */}
//             <div className="flex gap-4">
//               <select
//                 className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all tracking-tight"
//                 value={selectedStatut}
//                 onChange={(e) => setSelectedStatut(e.target.value)}
//               >
//                 <option value="Tous">Tous les statuts</option>
//                 <option value="en_attente">En attente</option>
//                 <option value="valide">Validées</option>
//                 <option value="rejete">Rejetées</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Notifications des cérémonies */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Notifications Cérémonies</h3>
//             <span className="text-sm text-purple-600 font-medium cursor-pointer">Voir tout</span>
//           </div>
//           <div className="space-y-3">
//             {notificationsCeremonie.slice(0, 3).map((notification) => (
//               <div 
//                 key={notification._id}
//                 className={`p-3 rounded-xl border-l-4 ${getNotificationColor(notification.type)} ${
//                   !notification.lu ? 'ring-2 ring-purple-200' : ''
//                 }`}
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm font-medium text-gray-900 tracking-tight">{notification.titre}</p>
//                     <p className="text-xs text-gray-600 mt-1 tracking-tight">{notification.message}</p>
//                   </div>
//                   {!notification.lu && (
//                     <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
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

//       {/* Tableau des demandes de cérémonie */}
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200 bg-gray-50">
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Section/Secteur</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Foulards</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Date & Lieu</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Parrains/Marraines</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Statut</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Date Demande</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredDemandes.map((demande) => (
//                 <tr key={demande._id} className="hover:bg-gray-50 transition-colors">
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-linear-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                         {demande.nomSectionOuSecteur[0]}
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-900 tracking-tight">
//                           {demande.nomSectionOuSecteur}
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="space-y-1">
//                       <div className="flex items-center space-x-2 text-sm">
//                         <span className="text-blue-600">B: {demande.foulardsBenjamins}</span>
//                         <span className="text-green-600">C: {demande.foulardsCadets}</span>
//                         <span className="text-purple-600">A: {demande.foulardsAines}</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div 
//                           className="bg-purple-600 h-2 rounded-full" 
//                           style={{ 
//                             width: `${((demande.foulardsBenjamins + demande.foulardsCadets + demande.foulardsAines) / 50) * 100}%` 
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="space-y-1">
//                       <div className="flex items-center space-x-1">
//                         <Calendar className="h-3 w-3 text-gray-400" />
//                         <span className="text-gray-900 tracking-tight">
//                           {new Date(demande.dateCeremonie).toLocaleDateString('fr-FR')}
//                         </span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <MapPin className="h-3 w-3 text-gray-400" />
//                         <span className="text-gray-500 text-sm tracking-tight">{demande.lieuxCeremonie}</span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-4 text-sm">
//                       <div className="text-center">
//                         <Users className="h-4 w-4 text-blue-600 mx-auto" />
//                         <span className="text-gray-900">{demande.nombreParrains}</span>
//                         <p className="text-xs text-gray-500">Parrains</p>
//                       </div>
//                       <div className="text-center">
//                         <Users className="h-4 w-4 text-pink-600 mx-auto" />
//                         <span className="text-gray-900">{demande.nombreMarraines}</span>
//                         <p className="text-xs text-gray-500">Marraines</p>
//                       </div>
//                     </div>
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
//                       {demande.statut === "valide" && demande.dateValidation && (
//                         <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
//                           Validée le {new Date(demande.dateValidation).toLocaleDateString('fr-FR')}
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
//       </div>
//     </div>
//   );
// }


// app/dashboard/ceremonies/page.tsx - PAGE UTILISATEUR COMPLÈTE
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Plus, Search, Eye, Edit, Trash2, Send, Loader2,
  CheckCircle, Clock, XCircle, AlertCircle, MapPin, Gift, Users
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/lib/AuthContext';

interface DemandeCeremonie {
  _id: string;
  Secteur: string;
  paroisse: string;
  foulardsBenjamins: number;
  foulardsCadets: number;
  foulardsAines: number;
  dateCeremonie: string;
  lieuxCeremonie: string;
  nombreParrains: number;
  nombreMarraines: number;
  soumise: boolean; // ✅ Nouveau champ
  statut: "en_attente" | "valide" | "rejete";
  commentaireAdmin?: string;
  dateSoumission?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CeremoniesPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [demandes, setDemandes] = useState<DemandeCeremonie[]>([]);
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
      let url = '/api/ceremonies';
      if (user?.role?.nom === 'Admin') {
        if (activeTab === 'brouillons') url = '/api/ceremonies?view=brouillons';
        if (activeTab === 'soumises') url = '/api/ceremonies?view=soumises';
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
      const res = await fetch(`/api/ceremonies/${id}`, {
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

  const handleDelete = async (id: string, secteur: string) => {
    if (!confirm(`Supprimer la demande pour ${secteur} ?`)) return;
    
    const loadingToast = toast.loading('Suppression...');
    
    try {
      const res = await fetch(`/api/ceremonies/${id}`, {
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
    d.Secteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.paroisse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.lieuxCeremonie.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                Mes Demandes de Cérémonie
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {demandes.length} demandes · {brouillons.length} brouillons · {soumises.length} soumises
              </p>
            </div>

            <button
              onClick={() => router.push('/dashboard/ceremonies/creer')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-auto"
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
              icon={Calendar}
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
              color="purple" 
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
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Brouillons ({brouillons.length})
              </button>
              <button
                onClick={() => setActiveTab('soumises')}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'soumises'
                    ? 'bg-purple-600 text-white'
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
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Liste des demandes */}
          {demandesFiltrees.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
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
  const totalFoulards = demande.foulardsBenjamins + demande.foulardsCadets + demande.foulardsAines;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-lg transition-all">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {demande.Secteur[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm truncate">
              {demande.Secteur}
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
          <span>{new Date(demande.dateCeremonie).toLocaleDateString('fr-FR')}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span className="truncate">{demande.lieuxCeremonie}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded">
          <Gift className="h-3.5 w-3.5" />
          <span className="font-medium">{totalFoulards} foulards</span>
          <span className="text-slate-500">
            (B:{demande.foulardsBenjamins} C:{demande.foulardsCadets} A:{demande.foulardsAines})
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
          <Users className="h-3.5 w-3.5" />
          <span className="font-medium">
            {demande.nombreParrains}P / {demande.nombreMarraines}M
          </span>
        </div>
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
              onClick={() => router.push(`/dashboard/ceremonies/${demande._id}/edit`)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
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
              onClick={() => onDelete(demande._id, demande.Secteur)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push(`/dashboard/ceremonies/${demande._id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            Voir
          </button>
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
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
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