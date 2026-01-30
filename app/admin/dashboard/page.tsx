'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Clock, FileText, Award } from 'lucide-react';

interface Stats {
  attestations: {
    total: number;
    enAttente: number;
    validees: number;
    rejetees: number;
  };
  ceremonies: {
    total: number;
    enAttente: number;
    validees: number;
    rejetees: number;
  };
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  href 
}: { 
  title: string; 
  value: number; 
  icon: any;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  href?: string;
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const content = (
    <Card className={`${colorClasses[color]} border-2 cursor-pointer hover:shadow-lg transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <Icon className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    if (user && user.role?.nom !== 'Admin') {
      router.push('/403');
    }
  }, [user, router]);

  // Charger les stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [attestationsRes, ceremoniesRes] = await Promise.all([
          fetch('/api/attestations?limit=1000'),
          fetch('/api/ceremonies?limit=1000')
        ]);

        const attestationsData = await attestationsRes.json();
        const ceremoniesData = await ceremoniesRes.json();

        const attestations = attestationsData.data || [];
        const ceremonies = ceremoniesData.data || [];

        setStats({
          attestations: {
            total: attestations.length,
            enAttente: attestations.filter((a: any) => a.statut === 'en_attente' && a.soumise).length,
            validees: attestations.filter((a: any) => a.statut === 'valide').length,
            rejetees: attestations.filter((a: any) => a.statut === 'rejete').length,
          },
          ceremonies: {
            total: ceremonies.length,
            enAttente: ceremonies.filter((c: any) => c.statut === 'en_attente' && c.soumise).length,
            validees: ceremonies.filter((c: any) => c.statut === 'valide').length,
            rejetees: ceremonies.filter((c: any) => c.statut === 'rejete').length,
          }
        });
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role?.nom === 'Admin') {
      fetchStats();
    }
  }, [user]);

  if (!user || user.role?.nom !== 'Admin') {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 Tableau de Bord Admin</h1>
        <p className="text-gray-500 mt-2">Vue d'ensemble des demandes en attente de validation</p>
      </div>

      {/* Attestations Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Attestations</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total" 
              value={stats?.attestations.total || 0}
              icon={FileText}
              color="purple"
            />
            <StatCard 
              title="En Attente"
              value={stats?.attestations.enAttente || 0}
              icon={Clock}
              color="yellow"
              href="/admin/attestations?filter=en_attente"
            />
            <StatCard 
              title="Validées"
              value={stats?.attestations.validees || 0}
              icon={CheckCircle}
              color="green"
              href="/admin/attestations?filter=valide"
            />
            <StatCard 
              title="Rejetées"
              value={stats?.attestations.rejetees || 0}
              icon={AlertCircle}
              color="red"
              href="/admin/attestations?filter=rejete"
            />
          </div>
        )}
      </div>

      {/* Ceremonies Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Cérémonies</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total"
              value={stats?.ceremonies.total || 0}
              icon={Award}
              color="purple"
            />
            <StatCard 
              title="En Attente"
              value={stats?.ceremonies.enAttente || 0}
              icon={Clock}
              color="yellow"
              href="/admin/ceremonies?filter=en_attente"
            />
            <StatCard 
              title="Validées"
              value={stats?.ceremonies.validees || 0}
              icon={CheckCircle}
              color="green"
              href="/admin/ceremonies?filter=valide"
            />
            <StatCard 
              title="Rejetées"
              value={stats?.ceremonies.rejetees || 0}
              icon={AlertCircle}
              color="red"
              href="/admin/ceremonies?filter=rejete"
            />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">🚀 Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link 
            href="/admin/attestations?filter=en_attente"
            className="block p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-gray-900">📋 Attester</div>
            <div className="text-sm text-gray-600">Valider les attestations en attente</div>
          </Link>
          <Link 
            href="/admin/ceremonies?filter=en_attente"
            className="block p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-gray-900">🎊 Cérémonies</div>
            <div className="text-sm text-gray-600">Valider les cérémonies en attente</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
