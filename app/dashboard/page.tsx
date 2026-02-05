// // "use client";

// // import { 
// //   Users, 
// //   FileText, 
// //   Calendar,
// //   Award,
// //   Bell,
// //   TrendingUp,
// //   ArrowUp,
// //   ArrowDown,
// //   Download,
// //   MoreHorizontal,
// //   Eye,
// //   CheckCircle,
// //   Clock,
// //   XCircle
// // } from "lucide-react";
// // import { 
// //   BarChart, 
// //   Bar, 
// //   XAxis, 
// //   YAxis, 
// //   CartesianGrid, 
// //   Tooltip, 
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell
// // } from 'recharts';

// // // Types basés sur vos modèles MongoDB
// // interface DemandeAttestation {
// //   _id: string;
// //   prenom: string;
// //   nom: string;
// //   paroisse: string;
// //   secteur: string;
// //   anneeFinFormation: number;
// //   statut: "en_attente" | "valide" | "rejete";
// //   createdAt: string;
// // }

// // interface DemandeCeremonie {
// //   _id: string;
// //   nomSectionOuSecteur: string;
// //   foulardsBenjamins: number;
// //   foulardsCadets: number;
// //   foulardsAines: number;
// //   dateCeremonie: string;
// //   statut: "en_attente" | "valide" | "rejete";
// //   createdAt: string;
// // }

// // interface Militant {
// //   _id: string;
// //   prenom: string;
// //   nom: string;
// //   paroisse: string;
// //   secteur: string;
// //   grade: string;
// //   telephone: string;
// //   createdAt: string;
// // }

// // interface Notification {
// //   _id: string;
// //   titre: string;
// //   message: string;
// //   lu: boolean;
// //   type: "info" | "succes" | "erreur";
// //   createdAt: string;
// // }

// // export default function DashboardPage() {
// //   // Données mockées basées sur vos modèles
// //   const demandesAttestation: DemandeAttestation[] = [
// //     {
// //       _id: "1",
// //       prenom: "Jean",
// //       nom: "Dupont",
// //       paroisse: "Saint-Pierre",
// //       secteur: "Nord",
// //       anneeFinFormation: 2024,
// //       statut: "en_attente",
// //       createdAt: "2024-01-15"
// //     },
// //     {
// //       _id: "2",
// //       prenom: "Marie",
// //       nom: "Curie",
// //       paroisse: "Saint-Paul",
// //       secteur: "Sud",
// //       anneeFinFormation: 2023,
// //       statut: "valide",
// //       createdAt: "2024-01-14"
// //     }
// //   ];

// //   const demandesCeremonie: DemandeCeremonie[] = [
// //     {
// //       _id: "1",
// //       nomSectionOuSecteur: "Section Jeunesse Nord",
// //       foulardsBenjamins: 15,
// //       foulardsCadets: 12,
// //       foulardsAines: 8,
// //       dateCeremonie: "2024-02-15",
// //       statut: "en_attente",
// //       createdAt: "2024-01-15"
// //     }
// //   ];

// //   const militants: Militant[] = [
// //     {
// //       _id: "1",
// //       prenom: "Paul",
// //       nom: "Martin",
// //       paroisse: "Saint-Pierre",
// //       secteur: "Nord",
// //       grade: "Chef de secteur",
// //       telephone: "+33 1 23 45 67 89",
// //       createdAt: "2024-01-10"
// //     },
// //     {
// //       _id: "2",
// //       prenom: "Sophie",
// //       nom: "Laurent",
// //       paroisse: "Saint-Paul",
// //       secteur: "Sud",
// //       grade: "Responsable jeunesse",
// //       telephone: "+33 1 34 56 78 90",
// //       createdAt: "2024-01-12"
// //     }
// //   ];

// //   const notifications: Notification[] = [
// //     {
// //       _id: "1",
// //       titre: "Nouvelle demande d'attestation",
// //       message: "Jean Dupont a soumis une demande d'attestation",
// //       lu: false,
// //       type: "info",
// //       createdAt: "2024-01-15T10:30:00"
// //     },
// //     {
// //       _id: "2",
// //       titre: "Cérémonie validée",
// //       message: "La cérémonie de la Section Nord a été approuvée",
// //       lu: true,
// //       type: "succes",
// //       createdAt: "2024-01-14T15:45:00"
// //     }
// //   ];

// //   // Statistiques calculées
// //   const statsAttestations = {
// //     total: demandesAttestation.length,
// //     enAttente: demandesAttestation.filter(d => d.statut === "en_attente").length,
// //     validees: demandesAttestation.filter(d => d.statut === "valide").length,
// //     rejetees: demandesAttestation.filter(d => d.statut === "rejete").length,
// //   };

// //   const statsCeremonies = {
// //     total: demandesCeremonie.length,
// //     enAttente: demandesCeremonie.filter(d => d.statut === "en_attente").length,
// //     validees: demandesCeremonie.filter(d => d.statut === "valide").length,
// //     rejetees: demandesCeremonie.filter(d => d.statut === "rejete").length,
// //   };

// //   // Données pour les graphiques
// //   const dataAttestationsParStatut = [
// //     { name: 'En attente', value: statsAttestations.enAttente },
// //     { name: 'Validées', value: statsAttestations.validees },
// //     { name: 'Rejetées', value: statsAttestations.rejetees },
// //   ];

// //   const dataCeremoniesParMois = [
// //     { mois: 'Jan', ceremonies: 3 },
// //     { mois: 'Fév', ceremonies: 5 },
// //     { mois: 'Mar', ceremonies: 2 },
// //     { mois: 'Avr', ceremonies: 4 },
// //     { mois: 'Mai', ceremonies: 6 },
// //   ];

// //   const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

// //   // Cartes de statistiques
// //   const statsCards = [
// //     {
// //       title: "Militants Actifs",
// //       value: militants.length.toString(),
// //       change: "+5.2%",
// //       trend: "up",
// //       icon: <Users className="h-6 w-6" />,
// //       color: "bg-linear-to-r from-blue-500 to-cyan-600"
// //     },
// //     {
// //       title: "Attestations en Attente",
// //       value: statsAttestations.enAttente.toString(),
// //       change: "+2.1%",
// //       trend: "up",
// //       icon: <FileText className="h-6 w-6" />,
// //       color: "bg-linear-to-r from-orange-500 to-amber-600"
// //     },
// //     {
// //       title: "Cérémonies Programmes",
// //       value: statsCeremonies.total.toString(),
// //       change: "+8.7%",
// //       trend: "up",
// //       icon: <Calendar className="h-6 w-6" />,
// //       color: "bg-linear-to-r from-green-500 to-emerald-600"
// //     },
// //     {
// //       title: "Notifications Non Lues",
// //       value: notifications.filter(n => !n.lu).length.toString(),
// //       change: "-3.4%",
// //       trend: "down",
// //       icon: <Bell className="h-6 w-6" />,
// //       color: "bg-linear-to-r from-purple-500 to-pink-600"
// //     }
// //   ];

// //   const getStatutIcon = (statut: string) => {
// //     switch (statut) {
// //       case "valide": return <CheckCircle className="h-4 w-4 text-green-600" />;
// //       case "en_attente": return <Clock className="h-4 w-4 text-orange-500" />;
// //       case "rejete": return <XCircle className="h-4 w-4 text-red-600" />;
// //       default: return <Clock className="h-4 w-4 text-gray-500" />;
// //     }
// //   };

// //   const getStatutColor = (statut: string) => {
// //     switch (statut) {
// //       case "valide": return "text-green-600 bg-green-100";
// //       case "en_attente": return "text-orange-600 bg-orange-100";
// //       case "rejete": return "text-red-600 bg-red-100";
// //       default: return "text-gray-600 bg-gray-100";
// //     }
// //   };

// //   return (
// //     <div className="p-6 space-y-6 font-sans">
// //       {/* En-tête */}
// //       <div className="flex justify-between items-center">
// //         <div>
// //           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tableau de Bord CVAV</h1>
// //           <p className="text-gray-600 mt-2 tracking-tight">Gestion des attestations, cérémonies et militants</p>
// //         </div>
// //         <div className="flex space-x-3">
// //           <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors tracking-tight">
// //             <Calendar className="h-4 w-4" />
// //             <span>Filtrer</span>
// //           </button>
// //           <button className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl px-4 py-2 hover:from-blue-700 hover:to-blue-800 transition-all tracking-tight">
// //             <Download className="h-4 w-4" />
// //             <span>Exporter</span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Cartes de statistiques */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //         {statsCards.map((card, index) => (
// //           <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
// //             <div className="flex justify-between items-start">
// //               <div>
// //                 <p className="text-gray-600 text-sm font-medium tracking-tight">{card.title}</p>
// //                 <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{card.value}</p>
// //                 <div className={`flex items-center space-x-1 mt-2 ${
// //                   card.trend === 'up' ? 'text-green-600' : 'text-red-600'
// //                 }`}>
// //                   {card.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
// //                   <span className="text-sm font-medium tracking-tight">{card.change}</span>
// //                 </div>
// //               </div>
// //               <div className={`p-3 rounded-xl text-white ${card.color}`}>
// //                 {card.icon}
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Graphiques principaux */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //         {/* Graphique des cérémonies */}
// //         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
// //           <div className="flex justify-between items-center mb-6">
// //             <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Cérémonies par Mois</h3>
// //             <MoreHorizontal className="h-5 w-5 text-gray-400 cursor-pointer" />
// //           </div>
// //           <div className="h-80">
// //             <ResponsiveContainer width="100%" height="100%">
// //               <BarChart data={dataCeremoniesParMois}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
// //                 <XAxis dataKey="mois" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip 
// //                   contentStyle={{ 
// //                     backgroundColor: 'white', 
// //                     border: 'none', 
// //                     borderRadius: '12px',
// //                     boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
// //                   }}
// //                 />
// //                 <Bar 
// //                   dataKey="ceremonies" 
// //                   fill="#007AFF"
// //                   radius={[4, 4, 0, 0]}
// //                 />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </div>
// //         </div>

// //         {/* Répartition des attestations */}
// //         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
// //           <div className="flex justify-between items-center mb-6">
// //             <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Statut des Attestations</h3>
// //             <MoreHorizontal className="h-5 w-5 text-gray-400 cursor-pointer" />
// //           </div>
// //           <div className="h-80">
// //             <ResponsiveContainer width="100%" height="100%">
// //               <PieChart>
// //                 <Pie
// //                   data={dataAttestationsParStatut}
// //                   cx="50%"
// //                   cy="50%"
// //                   innerRadius={60}
// //                   outerRadius={80}
// //                   paddingAngle={5}
// //                   dataKey="value"
// //                 >
// //                   {dataAttestationsParStatut.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </div>
// //           <div className="space-y-3 mt-4">
// //             {dataAttestationsParStatut.map((item, index) => (
// //               <div key={index} className="flex items-center justify-between">
// //                 <div className="flex items-center space-x-2">
// //                   <div 
// //                     className="w-3 h-3 rounded-full" 
// //                     style={{ backgroundColor: COLORS[index] }}
// //                   />
// //                   <span className="text-sm text-gray-600 tracking-tight">{item.name}</span>
// //                 </div>
// //                 <span className="text-sm font-semibold text-gray-900 tracking-tight">{item.value}</span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Section inférieure */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //         {/* Demandes récentes */}
// //         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
// //           <div className="flex justify-between items-center mb-6">
// //             <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Demandes Récentes</h3>
// //             <button className="text-blue-600 hover:text-blue-700 text-sm font-medium tracking-tight">
// //               Voir tout
// //             </button>
// //           </div>
// //           <div className="space-y-4">
// //             {[
// //               ...demandesAttestation.map(d => ({...d, _type: 'attestation'})),
// //               ...demandesCeremonie.map(d => ({...d, _type: 'ceremonie'}))
// //             ].slice(0, 5).map((demande) => (
// //               <div key={`${demande._type}-${demande._id}`} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
// //                 <div className="flex items-center space-x-3">
// //                   <div className={`p-2 rounded-lg ${
// //                     'anneeFinFormation' in demande ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
// //                   }`}>
// //                     {'anneeFinFormation' in demande ? <FileText className="h-4 w-4" /> : <Award className="h-4 w-4" />}
// //                   </div>
// //                   <div>
// //                     <p className="text-gray-900 font-medium tracking-tight">
// //                       {'prenom' in demande ? `${demande.prenom} ${demande.nom}` : demande.nomSectionOuSecteur}
// //                     </p>
// //                     <p className="text-gray-500 text-sm tracking-tight">
// //                       {'anneeFinFormation' in demande ? 'Attestation' : 'Cérémonie'}
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(demande.statut)}`}>
// //                   {demande.statut}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Notifications récentes */}
// //         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
// //           <div className="flex justify-between items-center mb-6">
// //             <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Notifications</h3>
// //             <button className="text-blue-600 hover:text-blue-700 text-sm font-medium tracking-tight">
// //               Voir tout
// //             </button>
// //           </div>
// //           <div className="space-y-4">
// //             {notifications.slice(0, 5).map((notification) => (
// //               <div key={notification._id} className={`p-3 rounded-xl border-l-4 ${
// //                 notification.type === 'succes' ? 'border-l-green-500 bg-green-50' :
// //                 notification.type === 'erreur' ? 'border-l-red-500 bg-red-50' :
// //                 'border-l-blue-500 bg-blue-50'
// //               }`}>
// //                 <div className="flex justify-between items-start">
// //                   <div>
// //                     <p className="text-gray-900 font-medium tracking-tight">{notification.titre}</p>
// //                     <p className="text-gray-600 text-sm mt-1 tracking-tight">{notification.message}</p>
// //                   </div>
// //                   {!notification.lu && (
// //                     <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
// //                   )}
// //                 </div>
// //                 <p className="text-gray-400 text-xs mt-2 tracking-tight">
// //                   {new Date(notification.createdAt).toLocaleDateString('fr-FR')}
// //                 </p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Section militants */}
// //       <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-6 text-white">
// //         <div className="flex justify-between items-center mb-6">
// //           <div>
// //             <h3 className="text-xl font-bold tracking-tight">Militants Actifs</h3>
// //             <p className="text-blue-100 mt-2 tracking-tight">Gestion des membres de la communauté</p>
// //           </div>
// //           <div className="text-right">
// //             <p className="text-3xl font-bold tracking-tight">{militants.length}</p>
// //             <p className="text-blue-100 tracking-tight">Militants enregistrés</p>
// //           </div>
// //         </div>
        
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
// //           <div className="text-center">
// //             <p className="text-2xl font-bold tracking-tight">
// //               {militants.filter(m => m.grade.includes('Chef')).length}
// //             </p>
// //             <p className="text-blue-100 text-sm tracking-tight">Chefs de secteur</p>
// //           </div>
// //           <div className="text-center">
// //             <p className="text-2xl font-bold tracking-tight">
// //               {militants.filter(m => m.secteur === 'Nord').length}
// //             </p>
// //             <p className="text-blue-100 text-sm tracking-tight">Secteur Nord</p>
// //           </div>
// //           <div className="text-center">
// //             <p className="text-2xl font-bold tracking-tight">
// //               {militants.filter(m => m.secteur === 'Sud').length}
// //             </p>
// //             <p className="text-blue-100 text-sm tracking-tight">Secteur Sud</p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // app/dashboard/page.tsx - TABLEAU DE BORD MODERNE
// "use client";

// import { useState, useEffect } from 'react';
// import { 
//   Users, FileText, Calendar, Award, Bell, TrendingUp, ArrowUp, 
//   ArrowDown, Eye, CheckCircle, Clock, XCircle, Sparkles,
//   Activity, Target, Zap
// } from "lucide-react";
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, AreaChart, Area
// } from 'recharts';

// export default function DashboardPage() {
//   const [stats, setStats] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const res = await fetch('/api/stats', { credentials: 'include' });
//       if (res.ok) {
//         const data = await res.json();
//         setStats(data);
//       }
//     } catch (error) {
//       console.error('Erreur stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading || !stats) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-600 font-medium">Chargement...</p>
//         </div>
//       </div>
//     );
//   }

//   const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

//   const statsCards = [
//     {
//       title: "Mes Attestations",
//       value: stats.statsAttestations.total,
//       change: "+5.2%",
//       trend: "up",
//       icon: FileText,
//       gradient: "from-blue-500 via-blue-600 to-indigo-600",
//       lightBg: "bg-blue-50",
//       darkText: "text-blue-700",
//       pending: stats.statsAttestations.enAttente
//     },
//     {
//       title: "Mes Cérémonies",
//       value: stats.statsCeremonies.total,
//       change: "+8.7%",
//       trend: "up",
//       icon: Calendar,
//       gradient: "from-purple-500 via-purple-600 to-pink-600",
//       lightBg: "bg-purple-50",
//       darkText: "text-purple-700",
//       pending: stats.statsCeremonies.enAttente
//     },
//     {
//       title: "Validées",
//       value: stats.statsAttestations.validees + stats.statsCeremonies.validees,
//       change: "+12.3%",
//       trend: "up",
//       icon: CheckCircle,
//       gradient: "from-emerald-500 via-green-600 to-teal-600",
//       lightBg: "bg-emerald-50",
//       darkText: "text-emerald-700",
//       pending: 0
//     },
//     {
//       title: "Notifications",
//       value: stats.statsGenerales.notificationsNonLues,
//       change: "-3.4%",
//       trend: "down",
//       icon: Bell,
//       gradient: "from-orange-500 via-amber-600 to-yellow-600",
//       lightBg: "bg-orange-50",
//       darkText: "text-orange-700",
//       pending: stats.statsGenerales.totalNotifications
//     }
//   ];

//   const dataStatutAttestations = [
//     { name: 'En attente', value: stats.statsAttestations.enAttente, color: '#f59e0b' },
//     { name: 'Validées', value: stats.statsAttestations.validees, color: '#10b981' },
//     { name: 'Rejetées', value: stats.statsAttestations.rejetees, color: '#ef4444' },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
//       <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
//         {/* En-tête avec animation */}
//         <div className="relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl" />
//           <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-xl p-6 sm:p-8">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="flex items-center gap-2 mb-2">
//                   <Sparkles className="h-5 w-5 text-blue-600" />
//                   <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">Tableau de Bord</span>
//                 </div>
//                 <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
//                   Bienvenue sur CVAV
//                 </h1>
//                 <p className="text-gray-600 mt-2 text-sm sm:text-base">Gérez vos attestations et cérémonies en toute simplicité</p>
//               </div>
//               <div className="hidden sm:block">
//                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
//                   <Activity className="h-8 w-8 text-white" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Cards Stats - Style iPhone */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {statsCards.map((card, index) => (
//             <div
//               key={index}
//               className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
//             >
//               {/* Gradient Background */}
//               <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
//               <div className="relative p-6">
//                 {/* Icon */}
//                 <div className={`inline-flex p-3 rounded-2xl ${card.lightBg} mb-4`}>
//                   <card.icon className={`h-6 w-6 ${card.darkText}`} />
//                 </div>

//                 {/* Content */}
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium text-gray-600">{card.title}</p>
//                   <div className="flex items-baseline gap-2">
//                     <p className="text-3xl font-bold text-gray-900">{card.value}</p>
//                     <div className={`flex items-center gap-1 text-xs font-semibold ${
//                       card.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
//                     }`}>
//                       {card.trend === 'up' ? (
//                         <ArrowUp className="h-3 w-3" />
//                       ) : (
//                         <ArrowDown className="h-3 w-3" />
//                       )}
//                       <span>{card.change}</span>
//                     </div>
//                   </div>
                  
//                   {card.pending > 0 && (
//                     <div className="flex items-center gap-1.5 pt-2">
//                       <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
//                       <span className="text-xs text-gray-500">{card.pending} en attente</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Hover Effect Line */}
//               <div className={`h-1 w-full bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
//             </div>
//           ))}
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
//           {/* Évolution Mensuelle */}
//           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h3 className="text-lg font-bold text-gray-900">Évolution Mensuelle</h3>
//                 <p className="text-sm text-gray-500 mt-1">6 derniers mois</p>
//               </div>
//               <div className="p-2 rounded-xl bg-blue-50">
//                 <BarChart className="h-5 w-5 text-blue-600" />
//               </div>
//             </div>
            
//             <div className="h-72">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={stats.evolutionMensuelle}>
//                   <defs>
//                     <linearGradient id="colorAttestations" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
//                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
//                     </linearGradient>
//                     <linearGradient id="colorCeremonies" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
//                       <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="mois" stroke="#9ca3af" style={{ fontSize: '12px' }} />
//                   <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
//                   <Tooltip 
//                     contentStyle={{ 
//                       backgroundColor: 'white',
//                       border: 'none',
//                       borderRadius: '16px',
//                       boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
//                     }}
//                   />
//                   <Area 
//                     type="monotone" 
//                     dataKey="attestations" 
//                     stroke="#3b82f6" 
//                     fillOpacity={1}
//                     fill="url(#colorAttestations)"
//                     strokeWidth={2}
//                   />
//                   <Area 
//                     type="monotone" 
//                     dataKey="ceremonies" 
//                     stroke="#8b5cf6" 
//                     fillOpacity={1}
//                     fill="url(#colorCeremonies)"
//                     strokeWidth={2}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Répartition Statuts */}
//           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h3 className="text-lg font-bold text-gray-900">Statut des Demandes</h3>
//                 <p className="text-sm text-gray-500 mt-1">Répartition actuelle</p>
//               </div>
//               <div className="p-2 rounded-xl bg-purple-50">
//                 <Target className="h-5 w-5 text-purple-600" />
//               </div>
//             </div>
            
//             <div className="h-72">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={dataStatutAttestations}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={70}
//                     outerRadius={100}
//                     paddingAngle={3}
//                     dataKey="value"
//                   >
//                     {dataStatutAttestations.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="grid grid-cols-3 gap-4 mt-4">
//               {dataStatutAttestations.map((item, index) => (
//                 <div key={index} className="text-center p-3 rounded-2xl bg-gray-50">
//                   <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }} />
//                   <p className="text-xs text-gray-600 mb-1">{item.name}</p>
//                   <p className="text-lg font-bold text-gray-900">{item.value}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Demandes Récentes */}
//         <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-lg font-bold text-gray-900">Activité Récente</h3>
//               <p className="text-sm text-gray-500 mt-1">Vos dernières demandes</p>
//             </div>
//             <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
//               Tout voir
//               <ArrowUp className="h-4 w-4 rotate-45" />
//             </button>
//           </div>

//           <div className="space-y-3">
//             {[...stats.demandesRecentes.attestations, ...stats.demandesRecentes.ceremonies]
//               .slice(0, 5)
//               .map((demande: any, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className={`p-3 rounded-xl ${
//                       'prenom' in demande ? 'bg-blue-100' : 'bg-purple-100'
//                     }`}>
//                       {'prenom' in demande ? (
//                         <FileText className="h-5 w-5 text-blue-600" />
//                       ) : (
//                         <Calendar className="h-5 w-5 text-purple-600" />
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900 text-sm">
//                         {'prenom' in demande 
//                           ? `${demande.prenom} ${demande.nom}`
//                           : demande.Secteur
//                         }
//                       </p>
//                       <p className="text-xs text-gray-500 mt-0.5">
//                         {'prenom' in demande ? 'Attestation' : 'Cérémonie'} · {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       demande.statut === 'valide' 
//                         ? 'bg-emerald-100 text-emerald-700'
//                         : demande.statut === 'en_attente'
//                         ? 'bg-orange-100 text-orange-700'
//                         : 'bg-red-100 text-red-700'
//                     }`}>
//                       {demande.statut === 'valide' ? 'Validée' : demande.statut === 'en_attente' ? 'En attente' : 'Rejetée'}
//                     </span>
//                     <Eye className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>

//         {/* Taux de validation */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <p className="text-blue-100 text-sm font-medium">Taux de Validation</p>
//                 <p className="text-3xl font-bold mt-1">Attestations</p>
//               </div>
//               <div className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl">
//                 <Zap className="h-6 w-6" />
//               </div>
//             </div>
//             <div className="flex items-baseline gap-2">
//               <p className="text-5xl font-bold">{stats.statsAttestations.tauxValidation}%</p>
//               <TrendingUp className="h-6 w-6" />
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 text-white">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <p className="text-purple-100 text-sm font-medium">Taux de Validation</p>
//                 <p className="text-3xl font-bold mt-1">Cérémonies</p>
//               </div>
//               <div className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl">
//                 <Award className="h-6 w-6" />
//               </div>
//             </div>
//             <div className="flex items-baseline gap-2">
//               <p className="text-5xl font-bold">{stats.statsCeremonies.tauxValidation}%</p>
//               <TrendingUp className="h-6 w-6" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/dashboard/page.tsx - DASHBOARD QUOTIDIEN OPTIMISÉ
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, FileText, Calendar, Bell, TrendingUp, ArrowRight,
  CheckCircle, Clock, XCircle, AlertCircle, Plus, BarChart3,
  Zap, Activity, Target, Eye, Send
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats?period=30', { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur chargement');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      toast.error('Erreur chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-600 animate-pulse">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Données graphique évolution
  const evolutionData = stats.evolutionMensuelle.slice(-30); // 30 derniers jours

  // Données pie chart
  const pieData = [
    { name: 'Validées', value: stats.statsAttestations.validees, color: '#10b981' },
    { name: 'En attente', value: stats.statsAttestations.enAttente, color: '#f59e0b' },
    { name: 'Rejetées', value: stats.statsAttestations.rejetees, color: '#ef4444' },
  ];

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* En-tête Moderne */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 blur-3xl" />
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase">En Direct</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent leading-tight">
                    Tableau de Bord
                  </h1>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base font-medium">
                    Vue d'ensemble de votre activité CVAV
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/dashboard/statistiques')}
                    className="group flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                  >
                    <BarChart3 className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    <span className="font-semibold text-gray-700 group-hover:text-blue-600 hidden sm:inline">Statistiques</span>
                  </button>
                  
                  <button
                    onClick={() => router.push('/dashboard/attestations/creer')}
                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-bold hidden sm:inline">Nouvelle Demande</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Métriques Clés - Style iOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Attestations */}
            <MetricCard
              title="Mes Attestations"
              value={stats.statsAttestations.total}
              subtitle={`${stats.statsAttestations.enAttente} en attente`}
              icon={FileText}
              gradient="from-blue-500 to-cyan-600"
              bgColor="bg-blue-50"
              textColor="text-blue-700"
              trend={`+${stats.statsAttestations.tauxValidation}%`}
              onClick={() => router.push('/dashboard/attestations')}
            />

            {/* Cérémonies */}
            <MetricCard
              title="Mes Cérémonies"
              value={stats.statsCeremonies.total}
              subtitle={`${stats.statsCeremonies.enAttente} en attente`}
              icon={Calendar}
              gradient="from-purple-500 to-pink-600"
              bgColor="bg-purple-50"
              textColor="text-purple-700"
              trend={`+${stats.statsCeremonies.tauxValidation}%`}
              onClick={() => router.push('/dashboard/ceremonies')}
            />

            {/* Validées */}
            <MetricCard
              title="Demandes Validées"
              value={stats.statsAttestations.validees + stats.statsCeremonies.validees}
              subtitle="Ce mois"
              icon={CheckCircle}
              gradient="from-emerald-500 to-green-600"
              bgColor="bg-emerald-50"
              textColor="text-emerald-700"
              trend="+12%"
            />

            {/* Notifications */}
            <MetricCard
              title="Notifications"
              value={stats.statsGenerales.notificationsNonLues}
              subtitle={`${stats.statsGenerales.totalNotifications} total`}
              icon={Bell}
              gradient="from-orange-500 to-amber-600"
              bgColor="bg-orange-50"
              textColor="text-orange-700"
              badge={stats.statsGenerales.notificationsNonLues}
              onClick={() => router.push('/dashboard/notifications')}
            />
          </div>

          {/* Section Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Évolution (2 colonnes) */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Activité Récente</h3>
                  <p className="text-sm text-gray-500 mt-1">30 derniers jours</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs font-medium text-gray-600">Attestations</span>
                  <div className="w-3 h-3 rounded-full bg-purple-500 ml-3" />
                  <span className="text-xs font-medium text-gray-600">Cérémonies</span>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={evolutionData}>
                    <defs>
                      <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCer" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="mois" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        borderRadius: '16px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Area type="monotone" dataKey="attestations" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAtt)" strokeWidth={3} />
                    <Area type="monotone" dataKey="ceremonies" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCer)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Répartition Statuts (1 colonne) */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Statuts</h3>
                  <p className="text-sm text-gray-500 mt-1">Répartition</p>
                </div>
                <Target className="h-6 w-6 text-purple-600" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                {pieData.map((item, i) => (
                  <div key={i} className="text-center p-3 rounded-2xl bg-gray-50">
                    <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }} />
                    <p className="text-xs text-gray-600 font-medium mb-1">{item.name}</p>
                    <p className="text-lg font-bold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activités Récentes */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Activités Récentes</h3>
                <p className="text-sm text-gray-500 mt-1">Vos dernières demandes</p>
              </div>
              <button 
                onClick={() => router.push('/dashboard/attestations')}
                className="group flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                Tout voir
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid gap-3">
              {[...stats.demandesRecentes.attestations, ...stats.demandesRecentes.ceremonies]
                .slice(0, 5)
                .map((demande: any, i: number) => (
                  <ActivityItem key={i} demande={demande} />
                ))}
            </div>
          </div>

          {/* Actions Rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <QuickActionCard
              title="Créer une Attestation"
              description="Nouvelle demande d'attestation de formation"
              icon={FileText}
              gradient="from-blue-500 to-cyan-600"
              onClick={() => router.push('/dashboard/attestations/creer')}
            />
            <QuickActionCard
              title="Créer une Cérémonie"
              description="Organiser une cérémonie de foulards"
              icon={Calendar}
              gradient="from-purple-500 to-pink-600"
              onClick={() => router.push('/dashboard/ceremonies/creer')}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Composants réutilisables
function MetricCard({ title, value, subtitle, icon: Icon, gradient, bgColor, textColor, trend, badge, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl ${bgColor}`}>
            <Icon className={`h-6 w-6 ${textColor}`} />
          </div>
          {badge && badge > 0 && (
            <div className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {badge}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-600">{title}</p>
          <p className="text-4xl font-black text-gray-900">{value}</p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
            {trend && (
              <div className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-bold">{trend}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ demande }: any) {
  const isAttestation = 'prenom' in demande;
  
  return (
    <div className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`p-3 rounded-xl ${isAttestation ? 'bg-blue-100' : 'bg-purple-100'}`}>
          {isAttestation ? (
            <FileText className="h-5 w-5 text-blue-600" />
          ) : (
            <Calendar className="h-5 w-5 text-purple-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">
            {isAttestation ? `${demande.prenom} ${demande.nom}` : demande.Secteur}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {isAttestation ? 'Attestation' : 'Cérémonie'} • {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge statut={demande.statut} />
        <Eye className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

function StatusBadge({ statut }: any) {
  const config = {
    valide: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Validée' },
    en_attente: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'En attente' },
    rejete: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejetée' }
  };
  
  const c = config[statut as keyof typeof config] || config.en_attente;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function QuickActionCard({ title, description, icon: Icon, gradient, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
      
      <div className="relative flex items-center gap-4">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white`}>
          <Icon className="h-8 w-8" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-2 transition-all" />
      </div>
    </div>
  );

}

//.div$*7