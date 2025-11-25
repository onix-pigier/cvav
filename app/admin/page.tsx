'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
// Import des icônes Lucide React pour le bouton de retour et les actions rapides
import { 
  ArrowLeft, 
  Users, // Utilisé pour Gestion Utilisateurs
  Bell, // Utilisé pour Notifications
  RotateCw, // Utilisé pour Réinitialisations
  ListChecks, // Utilisé pour Journal des Actions
  UserPlus, // Utilisé pour Nouvel Utilisateur
  KeyRound, // Utilisé pour Reset Mots de Passe
  Download, // Utilisé pour Exporter Données
  Megaphone // Utilisé pour Notification Globale
} from 'lucide-react' 

// Types pour les données
interface StatsData {
  totalUsers: number;
  totalMilitants: number;
  pendingCeremonies: number;
  pendingAttestations: number;
  recentActivities: Activity[];
}

interface Activity {
  _id: string;
  admin: { prenom: string; nom: string };
  action: string;
  module: string;
  createdAt: string;
}

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  // Redirection si pas admin
  useEffect(() => {
    if (user && user.role.nom !== 'Admin') {
      router.push('/dashboard')
    }
  }, [user, router])

  // Charger les statistiques
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Erreur chargement stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    if (user?.role.nom === 'Admin') {
      fetchStats()
    }
  }, [user])

  // Données fictives pour les graphiques (en attendant l'API)
  const userGrowthData = [
    { mois: 'Jan', utilisateurs: 45, militants: 120 },
    { mois: 'Fév', utilisateurs: 52, militants: 145 },
    { mois: 'Mar', utilisateurs: 48, militants: 167 },
    { mois: 'Avr', utilisateurs: 65, militants: 189 },
    { mois: 'Mai', utilisateurs: 72, militants: 210 },
    { mois: 'Juin', utilisateurs: 85, militants: 234 }
  ]

  const requestDistribution = [
    { type: 'Cérémonies validées', count: 45 },
    { type: 'Cérémonies en attente', count: 12 },
    { type: 'Attestations validées', count: 89 },
    { type: 'Attestations en attente', count: 8 },
    { type: 'Rejetées', count: 5 }
  ]

  // Statistiques principales
  const mainStats = [
    { 
      title: 'Utilisateurs', 
      value: stats?.totalUsers || 0, 
      change: '+12%', 
      icon: '👥', // Maintenu pour la carte de stats (petits emojis pour les petites stats)
      color: 'blue',
      link: '/admin/utilisateurs'
    },
    { 
      title: 'Militants', 
      value: stats?.totalMilitants || 0, 
      change: '+8%', 
      icon: '👤', // Maintenu pour la carte de stats
      color: 'green',
      link: '/dashboard/militants'
    },
    { 
      title: 'Cérémonies en attente', 
      value: stats?.pendingCeremonies || 0, 
      change: '+3%', 
      icon: '🎉', // Maintenu pour la carte de stats
      color: 'orange',
      link: '/admin/ceremonies'
    },
    { 
      title: 'Attestations en attente', 
      value: stats?.pendingAttestations || 0, 
      change: '+5%', 
      icon: '📄', // Maintenu pour la carte de stats
      color: 'purple',
      link: '/admin/attestations'
    }
  ]

  

  if (!user || user.role.nom !== 'Admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Bouton de Retour et En-tête */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Bouton de Retour (ArrowLeft - Lucide) */}
            <Link 
              href="/dashboard"
              className="mt-1 p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200 flex items-center justify-center"
              aria-label="Retour au Tableau de Bord Utilisateur"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
              <p className="text-gray-600 mt-2">
                Vue d'ensemble complète de la plateforme - {user.paroisse} {user.secteur && `- Secteur ${user.secteur}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Connecté en tant que</p>
            <p className="font-semibold">{user.prenom} {user.nom}</p>
          </div>
        </div>
      </div>
      {/* Fin Bouton de Retour et En-tête */}

      {/* Navigation rapide - Cartes modernes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Gestion Utilisateurs */}
        <Link 
          href="/admin/utilisateurs"
          className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors text-blue-600">
              <Users className="w-6 h-6" /> {/* Icône Lucide */}
            </div>
            <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">Gestion Utilisateurs</h3>
          <p className="text-gray-600 text-sm">Créer et gérer les comptes utilisateurs</p>
        </Link>
        
        {/* Système de Notifications */}
        <Link 
          href="/admin/notifications"
          className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors text-green-600">
              <Bell className="w-6 h-6" /> {/* Icône Lucide */}
            </div>
            <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">Système de Notifications</h3>
          <p className="text-gray-600 text-sm">Gérer les alertes et notifications</p>
        </Link>
        
        {/* Réinitialisations */}
        <Link 
          href="/admin/forgot-reset"
          className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors text-orange-600">
              <RotateCw className="w-6 h-6" /> {/* Icône Lucide */}
            </div>
            <div className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">Réinitialisations</h3>
          <p className="text-gray-600 text-sm">Gérer les demandes de mot de passe</p>
        </Link>
        
        {/* Journal des Actions */}
        <Link 
          href="/admin/actions"
          className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors text-purple-600">
              <ListChecks className="w-6 h-6" /> {/* Icône Lucide */}
            </div>
            <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">Journal des Actions</h3>
          <p className="text-gray-600 text-sm">Historique complet des activités</p>
        </Link>
      </div>

      {/* Statistiques principales - Design moderne (Éléments non modifiés) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section Graphiques et Distribution (non modifiée) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Graphique croissance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Croissance de la Plateforme</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg">Mensuel</button>
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg">Annuel</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="utilisateurs" 
                fill="#0088FE" 
                name="Utilisateurs" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="militants" 
                fill="#00C49F" 
                name="Militants" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique activité */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Activité des Demandes</h3>
            <div className="text-sm text-gray-500">30 derniers jours</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="utilisateurs" 
                stroke="#0088FE" 
                strokeWidth={3}
                dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#0088FE' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section Distribution et Activités (non modifiée) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Diagramme circulaire */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition des Demandes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={requestDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {requestDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} demandes`, 'Quantité']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Activités récentes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
            <Link href="/admin/actions" className="text-blue-600 text-sm hover:text-blue-700">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-4">
            {stats?.recentActivities?.slice(0, 5).map((activity) => (
              <div key={activity._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.admin.prenom} {activity.admin.nom}</span>
                    <span className="text-gray-600"> {activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )) || (
              // Placeholder si pas d'activités
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides en bas - Mise à jour avec Lucide */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions Administratives Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Nouvel Utilisateur (UserPlus) */}
          <Link 
            href="/admin/utilisateurs/new"
            className="bg-blue-50 text-blue-700 p-4 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200 text-center flex flex-col items-center"
          >
            <UserPlus className="w-6 h-6 mb-2" />
            <div className="font-medium">Nouvel Utilisateur</div>
          </Link>
          
          {/* Reset Mots de Passe (KeyRound) */}
          <Link 
            href="/admin/forgot-reset"
            className="bg-orange-50 text-orange-700 p-4 rounded-xl hover:bg-orange-100 transition-colors border border-orange-200 text-center flex flex-col items-center"
          >
            <KeyRound className="w-6 h-6 mb-2" />
            <div className="font-medium">Reset Mots de Passe</div>
          </Link>
          
          {/* Exporter Données (Download) */}
          <Link 
            href="/api/admin/export"
            className="bg-green-50 text-green-700 p-4 rounded-xl hover:bg-green-100 transition-colors border border-green-200 text-center flex flex-col items-center"
          >
            <Download className="w-6 h-6 mb-2" />
            <div className="font-medium">Exporter Données</div>
          </Link>
          
          {/* Notification Globale (Megaphone) */}
          <Link 
            href="/admin/notifications"
            className="bg-purple-50 text-purple-700 p-4 rounded-xl hover:bg-purple-100 transition-colors border border-purple-200 text-center flex flex-col items-center"
          >
            <Megaphone className="w-6 h-6 mb-2" />
            <div className="font-medium">Notification Globale</div>
          </Link>
        </div>
      </div>
    </div>
  )
}