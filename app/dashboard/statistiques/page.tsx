// // app/dashboard/statistiques/page.tsx - TOUR DE CONTRÔLE COMPLÈTE
"use client";

import { useState, useEffect } from 'react';
import { 
  Users, FileText, Calendar, Award, TrendingUp, TrendingDown, Download, 
  Filter, BarChart3, PieChart as PieChartIcon, MapPin, Church, Target,
  Activity, Zap, Gift, AlertCircle, CheckCircle, Clock, XCircle,
  ArrowUp, ArrowDown, Sparkles, Eye, Settings
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { exportStatsToPDF } from '@/lib/exportPdf';

export default function StatistiquesPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stats?period=${period}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      toast.error('Erreur chargement statistiques');
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    const id = toast.loading('Génération du PDF...');
    try {
      await exportStatsToPDF(stats);
      toast.success('PDF téléchargé !', { id });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Erreur génération PDF', { id });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="h-8 w-8 text-purple-500 animate-pulse" />
            </div>
          </div>
          <p className="text-sm font-bold text-purple-300 animate-pulse tracking-wider">CHARGEMENT DES DONNÉES...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const COLORS = {
    blue: ['#3b82f6', '#2563eb', '#1d4ed8'],
    purple: ['#8b5cf6', '#7c3aed', '#6d28d9'],
    green: ['#10b981', '#059669', '#047857'],
    orange: ['#f59e0b', '#d97706', '#b45309'],
    red: ['#ef4444', '#dc2626', '#b91c1c']
  };

  // Données pour les graphiques
  const dataStatutAttestations = [
    { name: 'Validées', value: stats.statsAttestations.validees, color: COLORS.green[0] },
    { name: 'En attente', value: stats.statsAttestations.enAttente, color: COLORS.orange[0] },
    { name: 'Rejetées', value: stats.statsAttestations.rejetees, color: COLORS.red[0] },
  ];

  const dataStatutCeremonies = [
    { name: 'Validées', value: stats.statsCeremonies.validees, color: COLORS.green[0] },
    { name: 'En attente', value: stats.statsCeremonies.enAttente, color: COLORS.orange[0] },
    { name: 'Rejetées', value: stats.statsCeremonies.rejetees, color: COLORS.red[0] },
  ];

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Super En-tête */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-600 uppercase">Tour de Contrôle</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-gray-900 leading-tight mb-1">
                    Statistiques
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Vue synthétique et actions rapides
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  {/* Filtres période */}
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 focus:outline-none focus:border-purple-300 transition-colors"
                  >
                    <option value="7">7 jours</option>
                    <option value="30">30 jours</option>
                    <option value="90">3 mois</option>
                    <option value="180">6 mois</option>
                    <option value="365">1 an</option>
                  </select>

                  <div className="relative">
                    <button onClick={() => setShowFilters(prev => !prev)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:shadow-sm transition-all">
                      <Filter className="h-5 w-5" />
                      <span className="hidden sm:inline">Filtres</span>
                    </button>

                    {showFilters && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-40">
                        <button onClick={() => { setActiveFilter('all'); setShowFilters(false); }} className={`w-full text-left px-4 py-2 text-sm ${activeFilter === 'all' ? 'bg-gray-100' : ''}`}>Tous</button>
                        <button onClick={() => { setActiveFilter('militants'); setShowFilters(false); }} className={`w-full text-left px-4 py-2 text-sm ${activeFilter === 'militants' ? 'bg-gray-100' : ''}`}>Militants</button>
                        <button onClick={() => { setActiveFilter('attestations'); setShowFilters(false); }} className={`w-full text-left px-4 py-2 text-sm ${activeFilter === 'attestations' ? 'bg-gray-100' : ''}`}>Attestations</button>
                        <button onClick={() => { setActiveFilter('ceremonies'); setShowFilters(false); }} className={`w-full text-left px-4 py-2 text-sm ${activeFilter === 'ceremonies' ? 'bg-gray-100' : ''}`}>Cérémonies</button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={exportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:shadow-sm transition-all"
                  >
                    <Download className="h-5 w-5" />
                    <span className="hidden sm:inline">Export PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Métriques Principales - Grid 6 colonnes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SuperMetricCard
              title="Utilisateurs"
              value={stats.statsGenerales.totalUtilisateurs}
              subtitle="actifs"
              icon={Users}
              gradient="from-blue-500 to-cyan-600"
              change="+5.2%"
              trend="up"
            />
            <SuperMetricCard
              title="Militants"
              value={stats.statsGenerales.totalMilitants}
              subtitle="enregistrés"
              icon={Users}
              gradient="from-indigo-500 to-purple-600"
              change="+8.1%"
              trend="up"
            />
            <SuperMetricCard
              title="Attestations"
              value={stats.statsAttestations.total}
              subtitle={`${stats.statsAttestations.tauxValidation}% validées`}
              icon={FileText}
              gradient="from-emerald-500 to-green-600"
              change="+12.3%"
              trend="up"
            />
            <SuperMetricCard
              title="Cérémonies"
              value={stats.statsCeremonies.total}
              subtitle={`${stats.statsCeremonies.tauxValidation}% validées`}
              icon={Calendar}
              gradient="from-purple-500 to-pink-600"
              change="+15.7%"
              trend="up"
            />
            <SuperMetricCard
              title="Foulards"
              value={stats.statsFoulards?.totalFoulards || 0}
              subtitle="distribués"
              icon={Award}
              gradient="from-orange-400 to-orange-500"
              change="+22.4%"
              trend="up"
            />
            <SuperMetricCard
              title="Notifications"
              value={stats.statsGenerales.notificationsNonLues}
              subtitle={`/${stats.statsGenerales.totalNotifications}`}
              icon={Activity}
              gradient="from-red-400 to-red-500"
              change="-3.2%"
              trend="down"
            />
          </div>

          {/* Section Évolution - Grand Graphique */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Évolution Temporelle</h2>
                <p className="text-gray-600 font-medium">Analyse des 6 derniers mois</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">Attestations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-500" />
                  <span className="text-sm font-semibold text-gray-700">Cérémonies</span>
                </div>
                {stats.meta.isAdmin && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500" />
                    <span className="text-sm font-semibold text-gray-700">Militants</span>
                  </div>
                )}
              </div>
            </div>

                <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.evolutionMensuelle}>
                  <defs>
                    <linearGradient id="att" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="cer" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="mil" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mois" stroke="#6b7280" style={{ fontSize: '14px', fontWeight: '600' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '14px', fontWeight: '600' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.98)',
                      border: 'none',
                      borderRadius: '20px',
                      boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
                      padding: '16px'
                    }}
                  />
                  <Area type="monotone" dataKey="attestations" stroke="#3b82f6" fillOpacity={1} fill="url(#att)" strokeWidth={3} />
                  <Area type="monotone" dataKey="ceremonies" stroke="#8b5cf6" fillOpacity={1} fill="url(#cer)" strokeWidth={3} />
                  {stats.meta.isAdmin && (
                    <Area type="monotone" dataKey="militants" stroke="#10b981" fillOpacity={1} fill="url(#mil)" strokeWidth={3} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grid 2 colonnes - Statuts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatutPieChart 
              title="Attestations par Statut" 
              data={dataStatutAttestations}
              total={stats.statsAttestations.total}
            />
            <StatutPieChart 
              title="Cérémonies par Statut" 
              data={dataStatutCeremonies}
              total={stats.statsCeremonies.total}
            />
          </div>

          {/* Section Foulards (Admin only) */}
          {stats.meta.isAdmin && stats.statsFoulards && (
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="h-6 w-6" />
                    <span className="text-sm font-black tracking-wider uppercase opacity-90">Distribution</span>
                  </div>
                  <h2 className="text-3xl font-black mb-2">Statistiques des Foulards</h2>
                  <p className="text-purple-100 font-medium">Répartition par catégorie</p>
                </div>
                <div className="text-right">
                  <p className="text-6xl font-black">{stats.statsFoulards.totalFoulards}</p>
                  <p className="text-purple-200 font-semibold">Total distribués</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FoulardCard
                  label="Benjamins"
                  value={stats.statsFoulards.totalBenjamins}
                  color="bg-blue-500/30"
                />
                <FoulardCard
                  label="Cadets"
                  value={stats.statsFoulards.totalCadets}
                  color="bg-emerald-500/30"
                />
                <FoulardCard
                  label="Aînés"
                  value={stats.statsFoulards.totalAines}
                  color="bg-purple-500/30"
                />
                <FoulardCard
                  label="Cérémonies"
                  value={stats.statsCeremonies.validees}
                  color="bg-pink-500/30"
                />
              </div>
            </div>
          )}

          {/* Sections Géographiques (Admin only) */}
          {stats.meta.isAdmin && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Secteurs */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Répartition par Secteur</h3>
                    <p className="text-sm text-gray-600 font-medium">Militants et attestations</p>
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.repartitionParSecteur}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="secteur" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: '600' }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '16px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                        }}
                      />
                      <Bar dataKey="militants" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="attestations" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Paroisses */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Church className="h-6 w-6 text-purple-600" />
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Top 10 Paroisses</h3>
                    <p className="text-sm text-gray-600 font-medium">Les plus actives</p>
                  </div>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {stats.repartitionParParoisse.map((p: any, i: number) => (
                    <ParoisseItem key={i} paroisse={p} rank={i + 1} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grades (Admin only) */}
          {stats.meta.isAdmin && stats.repartitionParGrade && stats.repartitionParGrade.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 text-purple-600" />
                <div>
                  <h3 className="text-xl font-black text-gray-900">Répartition par Grade</h3>
                  <p className="text-sm text-gray-600 font-medium">Distribution des militants</p>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.repartitionParGrade} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="grade" type="category" stroke="#6b7280" width={150} style={{ fontSize: '12px', fontWeight: '600' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Taux de validation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TauxValidationCard
              title="Attestations"
              taux={stats.statsAttestations.tauxValidation}
              validees={stats.statsAttestations.validees}
              total={stats.statsAttestations.total}
              gradient="from-blue-500 to-cyan-600"
            />
            <TauxValidationCard
              title="Cérémonies"
              taux={stats.statsCeremonies.tauxValidation}
              validees={stats.statsCeremonies.validees}
              total={stats.statsCeremonies.total}
              gradient="from-purple-500 to-pink-600"
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Composants
function SuperMetricCard({ title, value, subtitle, icon: Icon, gradient, change, trend }: any) {
  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 p-5">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />
      
      <div className="relative">
        <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white mb-3`}>
          <Icon className="h-6 w-6" />
        </div>

        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-3xl font-black text-gray-900 mb-1">{value}</p>
        <p className="text-xs text-gray-600 font-medium mb-2">{subtitle}</p>

        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
}

function StatutPieChart({ title, data, total }: any) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-black text-gray-900 mb-6">{title}</h3>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        {data.map((item: any, i: number) => (
          <div key={i} className="text-center p-4 rounded-2xl bg-gray-50">
            <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }} />
            <p className="text-xs text-gray-600 font-semibold mb-1">{item.name}</p>
            <p className="text-2xl font-black text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-500 font-medium">{((item.value / total) * 100).toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FoulardCard({ label, value, color }: any) {
  return (
    <div className={`${color} rounded-2xl p-6 text-center border border-gray-100`}>
      <p className="text-5xl font-black mb-2">{value}</p>
      <p className="text-sm font-bold opacity-90">{label}</p>
    </div>
  );
}

function ParoisseItem({ paroisse, rank }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
        <span className="text-sm font-black text-purple-600">#{rank}</span>
      </div>
      
      <div className="flex-1">
        <p className="font-bold text-gray-900 text-sm">{paroisse.paroisse}</p>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-gray-600 font-semibold">{paroisse.militants}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3 text-green-600" />
            <span className="text-xs text-gray-600 font-semibold">{paroisse.attestations}</span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xl font-black text-gray-900">{paroisse.militants + paroisse.attestations}</p>
        <p className="text-xs text-gray-500 font-semibold">Total</p>
      </div>
    </div>
  );
}

function TauxValidationCard({ title, taux, validees, total, gradient }: any) {
  return (
    <div className={`relative bg-gradient-to-br ${gradient} rounded-xl shadow-sm p-6 text-white overflow-hidden`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-bold opacity-90 uppercase tracking-wider mb-1">Taux de Validation</p>
            <p className="text-3xl font-black">{title}</p>
          </div>
          <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl">
            <Zap className="h-8 w-8" />
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-4">
          <p className="text-4xl sm:text-5xl font-black">{taux}%</p>
          <TrendingUp className="h-6 w-6" />
        </div>

        <p className="text-lg font-semibold opacity-90">{validees} validées sur {total}</p>
      </div>
    </div>
  );
}