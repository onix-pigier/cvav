"use client";

import { 
  Users, 
  FileText, 
  Calendar,
  Award,
  Bell,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Download,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Types basés sur vos modèles MongoDB
interface DemandeAttestation {
  _id: string;
  prenom: string;
  nom: string;
  paroisse: string;
  secteur: string;
  anneeFinFormation: number;
  statut: "en_attente" | "valide" | "rejete";
  createdAt: string;
}

interface DemandeCeremonie {
  _id: string;
  nomSectionOuSecteur: string;
  foulardsBenjamins: number;
  foulardsCadets: number;
  foulardsAines: number;
  dateCeremonie: string;
  statut: "en_attente" | "valide" | "rejete";
  createdAt: string;
}

interface Militant {
  _id: string;
  prenom: string;
  nom: string;
  paroisse: string;
  secteur: string;
  grade: string;
  telephone: string;
  createdAt: string;
}

interface Notification {
  _id: string;
  titre: string;
  message: string;
  lu: boolean;
  type: "info" | "succes" | "erreur";
  createdAt: string;
}

export default function DashboardPage() {
  // Données mockées basées sur vos modèles
  const demandesAttestation: DemandeAttestation[] = [
    {
      _id: "1",
      prenom: "Jean",
      nom: "Dupont",
      paroisse: "Saint-Pierre",
      secteur: "Nord",
      anneeFinFormation: 2024,
      statut: "en_attente",
      createdAt: "2024-01-15"
    },
    {
      _id: "2",
      prenom: "Marie",
      nom: "Curie",
      paroisse: "Saint-Paul",
      secteur: "Sud",
      anneeFinFormation: 2023,
      statut: "valide",
      createdAt: "2024-01-14"
    }
  ];

  const demandesCeremonie: DemandeCeremonie[] = [
    {
      _id: "1",
      nomSectionOuSecteur: "Section Jeunesse Nord",
      foulardsBenjamins: 15,
      foulardsCadets: 12,
      foulardsAines: 8,
      dateCeremonie: "2024-02-15",
      statut: "en_attente",
      createdAt: "2024-01-15"
    }
  ];

  const militants: Militant[] = [
    {
      _id: "1",
      prenom: "Paul",
      nom: "Martin",
      paroisse: "Saint-Pierre",
      secteur: "Nord",
      grade: "Chef de secteur",
      telephone: "+33 1 23 45 67 89",
      createdAt: "2024-01-10"
    },
    {
      _id: "2",
      prenom: "Sophie",
      nom: "Laurent",
      paroisse: "Saint-Paul",
      secteur: "Sud",
      grade: "Responsable jeunesse",
      telephone: "+33 1 34 56 78 90",
      createdAt: "2024-01-12"
    }
  ];

  const notifications: Notification[] = [
    {
      _id: "1",
      titre: "Nouvelle demande d'attestation",
      message: "Jean Dupont a soumis une demande d'attestation",
      lu: false,
      type: "info",
      createdAt: "2024-01-15T10:30:00"
    },
    {
      _id: "2",
      titre: "Cérémonie validée",
      message: "La cérémonie de la Section Nord a été approuvée",
      lu: true,
      type: "succes",
      createdAt: "2024-01-14T15:45:00"
    }
  ];

  // Statistiques calculées
  const statsAttestations = {
    total: demandesAttestation.length,
    enAttente: demandesAttestation.filter(d => d.statut === "en_attente").length,
    validees: demandesAttestation.filter(d => d.statut === "valide").length,
    rejetees: demandesAttestation.filter(d => d.statut === "rejete").length,
  };

  const statsCeremonies = {
    total: demandesCeremonie.length,
    enAttente: demandesCeremonie.filter(d => d.statut === "en_attente").length,
    validees: demandesCeremonie.filter(d => d.statut === "valide").length,
    rejetees: demandesCeremonie.filter(d => d.statut === "rejete").length,
  };

  // Données pour les graphiques
  const dataAttestationsParStatut = [
    { name: 'En attente', value: statsAttestations.enAttente },
    { name: 'Validées', value: statsAttestations.validees },
    { name: 'Rejetées', value: statsAttestations.rejetees },
  ];

  const dataCeremoniesParMois = [
    { mois: 'Jan', ceremonies: 3 },
    { mois: 'Fév', ceremonies: 5 },
    { mois: 'Mar', ceremonies: 2 },
    { mois: 'Avr', ceremonies: 4 },
    { mois: 'Mai', ceremonies: 6 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

  // Cartes de statistiques
  const statsCards = [
    {
      title: "Militants Actifs",
      value: militants.length.toString(),
      change: "+5.2%",
      trend: "up",
      icon: <Users className="h-6 w-6" />,
      color: "bg-linear-to-r from-blue-500 to-cyan-600"
    },
    {
      title: "Attestations en Attente",
      value: statsAttestations.enAttente.toString(),
      change: "+2.1%",
      trend: "up",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-linear-to-r from-orange-500 to-amber-600"
    },
    {
      title: "Cérémonies Programmes",
      value: statsCeremonies.total.toString(),
      change: "+8.7%",
      trend: "up",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-linear-to-r from-green-500 to-emerald-600"
    },
    {
      title: "Notifications Non Lues",
      value: notifications.filter(n => !n.lu).length.toString(),
      change: "-3.4%",
      trend: "down",
      icon: <Bell className="h-6 w-6" />,
      color: "bg-linear-to-r from-purple-500 to-pink-600"
    }
  ];

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "valide": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "en_attente": return <Clock className="h-4 w-4 text-orange-500" />;
      case "rejete": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "valide": return "text-green-600 bg-green-100";
      case "en_attente": return "text-orange-600 bg-orange-100";
      case "rejete": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tableau de Bord CVAV</h1>
          <p className="text-gray-600 mt-2 tracking-tight">Gestion des attestations, cérémonies et militants</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors tracking-tight">
            <Calendar className="h-4 w-4" />
            <span>Filtrer</span>
          </button>
          <button className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl px-4 py-2 hover:from-blue-700 hover:to-blue-800 transition-all tracking-tight">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium tracking-tight">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{card.value}</p>
                <div className={`flex items-center space-x-1 mt-2 ${
                  card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span className="text-sm font-medium tracking-tight">{card.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl text-white ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des cérémonies */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Cérémonies par Mois</h3>
            <MoreHorizontal className="h-5 w-5 text-gray-400 cursor-pointer" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataCeremoniesParMois}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="ceremonies" 
                  fill="#007AFF"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition des attestations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Statut des Attestations</h3>
            <MoreHorizontal className="h-5 w-5 text-gray-400 cursor-pointer" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataAttestationsParStatut}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataAttestationsParStatut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {dataAttestationsParStatut.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-gray-600 tracking-tight">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 tracking-tight">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section inférieure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demandes récentes */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Demandes Récentes</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium tracking-tight">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {[...demandesAttestation, ...demandesCeremonie].slice(0, 5).map((demande) => (
              <div key={demande._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    'anneeFinFormation' in demande ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {'anneeFinFormation' in demande ? <FileText className="h-4 w-4" /> : <Award className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium tracking-tight">
                      {'prenom' in demande ? `${demande.prenom} ${demande.nom}` : demande.nomSectionOuSecteur}
                    </p>
                    <p className="text-gray-500 text-sm tracking-tight">
                      {'anneeFinFormation' in demande ? 'Attestation' : 'Cérémonie'}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(demande.statut)}`}>
                  {demande.statut}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications récentes */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Notifications</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium tracking-tight">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {notifications.slice(0, 5).map((notification) => (
              <div key={notification._id} className={`p-3 rounded-xl border-l-4 ${
                notification.type === 'succes' ? 'border-l-green-500 bg-green-50' :
                notification.type === 'erreur' ? 'border-l-red-500 bg-red-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-900 font-medium tracking-tight">{notification.titre}</p>
                    <p className="text-gray-600 text-sm mt-1 tracking-tight">{notification.message}</p>
                  </div>
                  {!notification.lu && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-2 tracking-tight">
                  {new Date(notification.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section militants */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Militants Actifs</h3>
            <p className="text-blue-100 mt-2 tracking-tight">Gestion des membres de la communauté</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tracking-tight">{militants.length}</p>
            <p className="text-blue-100 tracking-tight">Militants enregistrés</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold tracking-tight">
              {militants.filter(m => m.grade.includes('Chef')).length}
            </p>
            <p className="text-blue-100 text-sm tracking-tight">Chefs de secteur</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold tracking-tight">
              {militants.filter(m => m.secteur === 'Nord').length}
            </p>
            <p className="text-blue-100 text-sm tracking-tight">Secteur Nord</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold tracking-tight">
              {militants.filter(m => m.secteur === 'Sud').length}
            </p>
            <p className="text-blue-100 text-sm tracking-tight">Secteur Sud</p>
          </div>
        </div>
      </div>
    </div>
  );
}