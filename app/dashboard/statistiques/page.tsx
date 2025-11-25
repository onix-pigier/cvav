"use client";

import { 
  Users, 
  FileText, 
  Calendar,
  Award,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Church,
  Target
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
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

// Types basés sur vos modèles
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

export default function StatistiquesPage() {
  // Données mockées étendues pour les statistiques
  const demandesAttestation: DemandeAttestation[] = [
    { _id: "1", prenom: "Jean", nom: "Dupont", paroisse: "Saint-Pierre", secteur: "Nord", anneeFinFormation: 2024, statut: "en_attente", createdAt: "2024-01-15" },
    { _id: "2", prenom: "Marie", nom: "Curie", paroisse: "Saint-Paul", secteur: "Sud", anneeFinFormation: 2023, statut: "valide", createdAt: "2024-01-14" },
    { _id: "3", prenom: "Paul", nom: "Martin", paroisse: "Saint-Pierre", secteur: "Nord", anneeFinFormation: 2024, statut: "valide", createdAt: "2024-01-10" },
    { _id: "4", prenom: "Sophie", nom: "Laurent", paroisse: "Saint-Jean", secteur: "Est", anneeFinFormation: 2023, statut: "rejete", createdAt: "2024-01-08" },
    { _id: "5", prenom: "Luc", nom: "Bernard", paroisse: "Saint-Paul", secteur: "Sud", anneeFinFormation: 2024, statut: "en_attente", createdAt: "2024-01-05" },
  ];

  const demandesCeremonie: DemandeCeremonie[] = [
    { _id: "1", nomSectionOuSecteur: "Section Jeunesse Nord", foulardsBenjamins: 15, foulardsCadets: 12, foulardsAines: 8, dateCeremonie: "2024-02-15", statut: "en_attente", createdAt: "2024-01-15" },
    { _id: "2", nomSectionOuSecteur: "Section Sud", foulardsBenjamins: 10, foulardsCadets: 8, foulardsAines: 6, dateCeremonie: "2024-03-10", statut: "valide", createdAt: "2024-01-12" },
    { _id: "3", nomSectionOuSecteur: "Section Est", foulardsBenjamins: 20, foulardsCadets: 15, foulardsAines: 10, dateCeremonie: "2024-02-28", statut: "valide", createdAt: "2024-01-08" },
  ];

  const militants: Militant[] = [
    { _id: "1", prenom: "Paul", nom: "Martin", paroisse: "Saint-Pierre", secteur: "Nord", grade: "Chef de secteur", telephone: "+33 1 23 45 67 89", createdAt: "2024-01-10" },
    { _id: "2", prenom: "Sophie", nom: "Laurent", paroisse: "Saint-Paul", secteur: "Sud", grade: "Responsable jeunesse", telephone: "+33 1 34 56 78 90", createdAt: "2024-01-12" },
    { _id: "3", prenom: "Marc", nom: "Dubois", paroisse: "Saint-Jean", secteur: "Est", grade: "Animateur", telephone: "+33 1 45 67 89 01", createdAt: "2024-01-05" },
    { _id: "4", prenom: "Julie", nom: "Moreau", paroisse: "Saint-Pierre", secteur: "Nord", grade: "Chef de secteur", telephone: "+33 1 56 78 90 12", createdAt: "2024-01-03" },
  ];

  // Calcul des statistiques détaillées
  const statsGenerales = {
    totalMilitants: militants.length,
    totalAttestations: demandesAttestation.length,
    totalCeremonies: demandesCeremonie.length,
    attestationsValidees: demandesAttestation.filter(d => d.statut === "valide").length,
    attestationsEnAttente: demandesAttestation.filter(d => d.statut === "en_attente").length,
    ceremoniesValidees: demandesCeremonie.filter(d => d.statut === "valide").length,
  };

  // Répartition par secteur
  const repartitionParSecteur = [
    { secteur: "Nord", militants: militants.filter(m => m.secteur === "Nord").length, attestations: demandesAttestation.filter(d => d.secteur === "Nord").length },
    { secteur: "Sud", militants: militants.filter(m => m.secteur === "Sud").length, attestations: demandesAttestation.filter(d => d.secteur === "Sud").length },
    { secteur: "Est", militants: militants.filter(m => m.secteur === "Est").length, attestations: demandesAttestation.filter(d => d.secteur === "Est").length },
    { secteur: "Ouest", militants: militants.filter(m => m.secteur === "Ouest").length, attestations: demandesAttestation.filter(d => d.secteur === "Ouest").length },
  ];

  // Répartition par paroisse
  const paroisses = [...new Set(militants.map(m => m.paroisse))];
  const repartitionParParoisse = paroisses.map(paroisse => ({
    paroisse,
    militants: militants.filter(m => m.paroisse === paroisse).length,
    attestations: demandesAttestation.filter(d => d.paroisse === paroisse).length,
  }));

  // Évolution mensuelle des demandes
  const evolutionMensuelle = [
    { mois: "Jan", attestations: 12, ceremonies: 3, militants: 8 },
    { mois: "Fév", attestations: 18, ceremonies: 5, militants: 12 },
    { mois: "Mar", attestations: 15, ceremonies: 4, militants: 10 },
    { mois: "Avr", attestations: 22, ceremonies: 6, militants: 15 },
    { mois: "Mai", attestations: 25, ceremonies: 7, militants: 18 },
    { mois: "Jun", attestations: 30, ceremonies: 8, militants: 22 },
  ];

  // Statistiques des foulards
  const statsFoulards = {
    totalBenjamins: demandesCeremonie.reduce((sum, c) => sum + c.foulardsBenjamins, 0),
    totalCadets: demandesCeremonie.reduce((sum, c) => sum + c.foulardsCadets, 0),
    totalAines: demandesCeremonie.reduce((sum, c) => sum + c.foulardsAines, 0),
    totalFoulards: demandesCeremonie.reduce((sum, c) => sum + c.foulardsBenjamins + c.foulardsCadets + c.foulardsAines, 0),
  };

  // Données pour les graphiques
  const dataStatutAttestations = [
    { name: "Validées", value: statsGenerales.attestationsValidees, color: "#10b981" },
    { name: "En attente", value: statsGenerales.attestationsEnAttente, color: "#f59e0b" },
    { name: "Rejetées", value: demandesAttestation.filter(d => d.statut === "rejete").length, color: "#ef4444" },
  ];

  const dataRepartitionGrades = [
    { grade: "Chef de secteur", count: militants.filter(m => m.grade.includes("Chef")).length },
    { grade: "Responsable jeunesse", count: militants.filter(m => m.grade.includes("Responsable")).length },
    { grade: "Animateur", count: militants.filter(m => m.grade.includes("Animateur")).length },
    { grade: "Membre", count: militants.filter(m => !m.grade.includes("Chef") && !m.grade.includes("Responsable") && !m.grade.includes("Animateur")).length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Cartes de métriques principales
  const metricCards = [
    {
      title: "Militants Actifs",
      value: statsGenerales.totalMilitants.toString(),
      change: "+12%",
      trend: "up",
      icon: <Users className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-600",
      description: "Total des membres actifs"
    },
    {
      title: "Attestations Traitées",
      value: statsGenerales.totalAttestations.toString(),
      change: "+8%",
      trend: "up",
      icon: <FileText className="h-6 w-6" />,
      color: "from-green-500 to-emerald-600",
      description: "Demandes d'attestation"
    },
    {
      title: "Cérémonies Programmes",
      value: statsGenerales.totalCeremonies.toString(),
      change: "+15%",
      trend: "up",
      icon: <Calendar className="h-6 w-6" />,
      color: "from-purple-500 to-pink-600",
      description: "Événements planifiés"
    },
    {
      title: "Foulards Distribués",
      value: statsFoulards.totalFoulards.toString(),
      change: "+22%",
      trend: "up",
      icon: <Award className="h-6 w-6" />,
      color: "from-orange-500 to-amber-600",
      description: "Total tous grades"
    }
  ];

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Statistiques CVAV</h1>
          <p className="text-gray-600 mt-2 tracking-tight">Analyse détaillée des données de la communauté</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors tracking-tight">
            <Filter className="h-4 w-4" />
            <span>Filtrer</span>
          </button>
          <button className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl px-4 py-2 hover:from-blue-700 hover:to-blue-800 transition-all tracking-tight">
            <Download className="h-4 w-4" />
            <span>Exporter PDF</span>
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium tracking-tight">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{card.value}</p>
                <div className={`flex items-center space-x-1 mt-2 ${
                  card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium tracking-tight">{card.change}</span>
                </div>
                <p className="text-gray-500 text-xs mt-2 tracking-tight">{card.description}</p>
              </div>
              <div className={`p-3 rounded-xl text-white bg-linear-to-r ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution temporelle */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Évolution Mensuelle</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionMensuelle}>
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
                <Area 
                  type="monotone" 
                  dataKey="attestations" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
                <Area 
                  type="monotone" 
                  dataKey="ceremonies" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.2}
                />
                <Area 
                  type="monotone" 
                  dataKey="militants" 
                  stackId="1"
                  stroke="#8b5cf6" 
                  fill="#8b5cf6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition par statut */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PieChartIcon className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Statut des Attestations</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataStatutAttestations}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataStatutAttestations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {dataStatutAttestations.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600 tracking-tight">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 tracking-tight">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par grade */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Target className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Grades des Militants</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataRepartitionGrades}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="grade" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
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
                  dataKey="count" 
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section géographique */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par secteur */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Répartition par Secteur</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repartitionParSecteur}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="secteur" stroke="#6b7280" />
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
                  dataKey="militants" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Militants"
                />
                <Bar 
                  dataKey="attestations" 
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Attestations"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition par paroisse */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Church className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Activité par Paroisse</h3>
          </div>
          <div className="space-y-4">
            {repartitionParParoisse.map((paroisse, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900 tracking-tight">{paroisse.paroisse}</h4>
                  <div className="flex space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600 tracking-tight">{paroisse.militants} militants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600 tracking-tight">{paroisse.attestations} attestations</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 tracking-tight">
                    {paroisse.militants + paroisse.attestations}
                  </div>
                  <div className="text-sm text-gray-500 tracking-tight">Total</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques détaillées des foulards */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Statistiques des Foulards</h3>
            <p className="text-blue-100 mt-2 tracking-tight">Répartition par grade et secteur</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tracking-tight">{statsFoulards.totalFoulards}</p>
            <p className="text-blue-100 tracking-tight">Foulards au total</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center bg-blue-500/30 rounded-xl p-4">
            <p className="text-2xl font-bold tracking-tight">{statsFoulards.totalBenjamins}</p>
            <p className="text-blue-100 text-sm tracking-tight">Foulards Benjamins</p>
          </div>
          <div className="text-center bg-green-500/30 rounded-xl p-4">
            <p className="text-2xl font-bold tracking-tight">{statsFoulards.totalCadets}</p>
            <p className="text-blue-100 text-sm tracking-tight">Foulards Cadets</p>
          </div>
          <div className="text-center bg-purple-500/30 rounded-xl p-4">
            <p className="text-2xl font-bold tracking-tight">{statsFoulards.totalAines}</p>
            <p className="text-blue-100 text-sm tracking-tight">Foulards Ainés</p>
          </div>
          <div className="text-center bg-orange-500/30 rounded-xl p-4">
            <p className="text-2xl font-bold tracking-tight">{statsGenerales.ceremoniesValidees}</p>
            <p className="text-blue-100 text-sm tracking-tight">Cérémonies Validées</p>
          </div>
        </div>
      </div>

      {/* Tableau de synthèse */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-6">Synthèse des Données</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-50 rounded-xl p-4">
              <Users className="h-8 w-8 text-blue-600 mx-auto" />
              <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{statsGenerales.totalMilitants}</p>
              <p className="text-gray-600 tracking-tight">Militants Enregistrés</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-green-50 rounded-xl p-4">
              <FileText className="h-8 w-8 text-green-600 mx-auto" />
              <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{statsGenerales.attestationsValidees}</p>
              <p className="text-gray-600 tracking-tight">Attestations Validées</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-purple-50 rounded-xl p-4">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto" />
              <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{statsGenerales.ceremoniesValidees}</p>
              <p className="text-gray-600 tracking-tight">Cérémonies Approuvées</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}