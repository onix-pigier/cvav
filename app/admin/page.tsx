'use client';

import Link from 'next/link';
import { BarChart3, FileText, Award, Settings, Users, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminHomePage() {
  const adminSections = [
    {
      title: '📊 Dashboard',
      description: 'Vue d\'ensemble des statistiques et actions prioritaires',
      icon: BarChart3,
      href: '/admin/dashboard',
      color: 'blue'
    },
    {
      title: '📋 Attestations',
      description: 'Valider et gérer les demandes d\'attestation',
      icon: FileText,
      href: '/admin/attestations',
      color: 'green'
    },
    {
      title: '🎊 Cérémonies',
      description: 'Valider et gérer les demandes de cérémonies',
      icon: Award,
      href: '/admin/ceremonies',
      color: 'purple'
    },
    {
      title: '👥 Utilisateurs',
      description: 'Gérer les utilisateurs et leurs permissions',
      icon: Users,
      href: '/dashboard/admin/utilisateurs',
      color: 'amber'
    },
    {
      title: '🔔 Notifications',
      description: 'Consulter les notifications système',
      icon: Bell,
      href: '/dashboard/notifications',
      color: 'red'
    },
    {
      title: '⚙️ Paramètres',
      description: 'Configurer le système',
      icon: Settings,
      href: '/dashboard/admin/parametres',
      color: 'gray'
    },
  ];

  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
    green: 'border-green-200 bg-green-50 hover:bg-green-100',
    purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
    amber: 'border-amber-200 bg-amber-50 hover:bg-amber-100',
    red: 'border-red-200 bg-red-50 hover:bg-red-100',
    gray: 'border-gray-200 bg-gray-50 hover:bg-gray-100',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎛️ Panneau d'Administration
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gérez les demandes d'attestation et de cérémonies, validez les soumissions et supervisez l'ensemble du système.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Status Système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-blue-900">Opérationnel</span>
              </div>
              <p className="text-xs text-blue-600 mt-2">Tous les services actifs</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Actions Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">→</div>
              <p className="text-xs text-green-600 mt-2">Consultez le dashboard pour plus de détails</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Aide</CardTitle>
            </CardHeader>
            <CardContent>
              <a href="/docs/ADMIN_TESTING_GUIDE.md" className="text-purple-600 font-semibold text-sm hover:text-purple-900">
                Voir le guide de test →
              </a>
              <p className="text-xs text-purple-600 mt-2">Documentation complète</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {adminSections.slice(0, 3).map((section, idx) => {
            const Icon = section.icon;
            return (
              <Link key={idx} href={section.href}>
                <Card className={`border-2 ${colorClasses[section.color as keyof typeof colorClasses]} cursor-pointer transition-all hover:shadow-lg h-full`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <CardDescription className="text-sm mt-2">{section.description}</CardDescription>
                      </div>
                      <Icon className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Accéder →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Secondary Sections */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres Outils</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.slice(3).map((section, idx) => {
              const Icon = section.icon;
              return (
                <Link key={idx} href={section.href}>
                  <Card className={`border-2 ${colorClasses[section.color as keyof typeof colorClasses]} cursor-pointer transition-all hover:shadow-lg`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <CardDescription className="text-sm mt-2">{section.description}</CardDescription>
                        </div>
                        <Icon className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Documentation Section */}
        <Card className="border-2 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📚 Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <a href="/docs/ADMIN_SYSTEM_GUIDE.md" className="text-amber-600 font-semibold hover:text-amber-900">
                  → Architecture du Système Admin
                </a>
                <p className="text-sm text-amber-600 mt-1">Comprendre l'architecture complète</p>
              </div>
              <div>
                <a href="/docs/ADMIN_TESTING_GUIDE.md" className="text-amber-600 font-semibold hover:text-amber-900">
                  → Guide de Test
                </a>
                <p className="text-sm text-amber-600 mt-1">Comment tester le système complet</p>
              </div>
              <div>
                <a href="/docs/ADMIN_IMPLEMENTATION_COMPLETE.md" className="text-amber-600 font-semibold hover:text-amber-900">
                  → Résumé d'Implémentation
                </a>
                <p className="text-sm text-amber-600 mt-1">Vue d'ensemble des fonctionnalités</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
