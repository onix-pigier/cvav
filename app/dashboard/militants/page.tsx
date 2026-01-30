// app/dashboard/militants/page.tsx
"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Download,
  Eye,
  Phone,
  MapPin,
  Award,
  ChevronDown,
  ChevronUp,
  Loader2
} from "lucide-react";
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useAuth } from '@/lib/AuthContext';
import { useMilitants } from '@/hooks/useMilitants';
import type { Militant } from '@/types/militant';
import toast from 'react-hot-toast';
import { exportToPDF } from '@/lib/exportPdf';
import { exportToExcel } from '@/lib/exportMilitants';

export default function MilitantsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedMilitant, setSelectedMilitant] = useState<Militant | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Paramètres de recherche
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    secteur: '',
    grade: '',
  });

  // Utilisation du hook personnalisé
  const { militants, isLoading, pagination, deleteMilitant, refresh } = useMilitants({
    ...searchParams,
    autoFetch: true,
  });

  // Appliquer les filtres avec un délai (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(prev => ({ ...prev, search: globalFilter }));
    }, 500);

    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Définition des colonnes
  const columns: ColumnDef<Militant>[] = useMemo(() => [
    {
      accessorKey: 'prenom',
      header: 'Militant',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {row.original.prenom[0]}{row.original.nom[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900 tracking-tight">
              {row.original.prenom} {row.original.nom}
            </p>
            <p className="text-sm text-gray-500 tracking-tight">
              {row.original.sexe === 'M' ? '👨 Homme' : '👩 Femme'}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'paroisse',
      header: 'Paroisse',
      cell: ({ getValue }) => (
        <span className="text-gray-900 tracking-tight">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'secteur',
      header: 'Secteur',
      cell: ({ getValue }) => {
        const raw = getValue() as string;
        const secteur = normalizeSector(raw);
        const colorClass = getSecteurColor(secteur);
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass} bg-opacity-10`}>
            <MapPin className="h-3 w-3 mr-1" />
            {secteur}
          </span>
        );
      },
    },
    {
      accessorKey: 'grade',
      header: 'Grade',
      cell: ({ getValue }) => {
        const grade = getValue() as string;
        const colorClass = getGradeColor(grade);
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
            <Award className="h-3 w-3 mr-1" />
            {grade}
          </span>
        );
      },
    },
    {
      accessorKey: 'telephone',
      header: 'Téléphone',
      cell: ({ getValue }) => {
        const tel = getValue() as string;
        return tel ? (
          <div className="flex items-center space-x-2 text-gray-900 tracking-tight">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{tel}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Non renseigné</span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Date d\'ajout',
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return date ? (
          <span className="text-gray-500 text-sm tracking-tight">
            {new Date(date).toLocaleDateString('fr-FR')}
          </span>
        ) : null;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleView(row.original)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            title="Voir"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleEdit(row.original)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDeleteClick(row.original)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ], []);

  // Configuration de la table
  const table = useReactTable({
    data: militants,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  // Handlers
  const handleView = useCallback((militant: Militant) => {
    router.push(`/dashboard/militants/${militant._id}`);
  }, [router]);

  const handleEdit = useCallback((militant: Militant) => {
    router.push(`/dashboard/militants/${militant._id}/modifier`);
  }, [router]);

  const handleDeleteClick = useCallback((militant: Militant) => {
    setSelectedMilitant(militant);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedMilitant) return;
    
    const success = await deleteMilitant(selectedMilitant._id);
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedMilitant(null);
    }
  }, [selectedMilitant, deleteMilitant]);

  const handleCreate = useCallback(() => {
    router.push('/dashboard/militants/create');
  }, [router]);

  const handleSecteurFilter = useCallback((secteur: string) => {
    setSearchParams(prev => ({ ...prev, secteur, page: 1 }));
  }, []);

  const handleGradeFilter = useCallback((grade: string) => {
    setSearchParams(prev => ({ ...prev, grade, page: 1 }));
  }, []);

  // Fonctions utilitaires
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "Chef de secteur": return "bg-blue-100 text-blue-800";
      case "Responsable jeunesse": return "bg-green-100 text-green-800";
      case "Animateur": return "bg-purple-100 text-purple-800";
      case "Militant": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSecteurColor = (secteur: string) => {
    switch (secteur) {
      case "Secteur Nord": return "text-blue-600";
      case "Secteur Sud": return "text-green-600";
      case "Secteur Est": return "text-purple-600";
      case "Secteur Ouest": return "text-indigo-600";
      case "Secteur Centre": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const SECTEURS_CANONICAL: Record<string, string> = {
    'secteur nord': 'Secteur Nord',
    'secteur sud': 'Secteur Sud',
    'secteur est': 'Secteur Est',
    'secteur ouest': 'Secteur Ouest',
    'secteur centre': 'Secteur Centre'
  };

  const normalizeSector = (s?: string) => {
    if (!s) return '-';
    const key = s.toString().trim().toLowerCase();
    if (SECTEURS_CANONICAL[key]) return SECTEURS_CANONICAL[key];
    const values = Object.values(SECTEURS_CANONICAL);
    if (values.includes(s)) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  // Statistiques
  const stats = useMemo(() => ({
    total: pagination.total,
    parSecteur: {
      'Secteur Nord': militants.filter(m => normalizeSector(m.secteur) === 'Secteur Nord').length,
      'Secteur Sud': militants.filter(m => normalizeSector(m.secteur) === 'Secteur Sud').length,
      'Secteur Est': militants.filter(m => normalizeSector(m.secteur) === 'Secteur Est').length,
      'Secteur Ouest': militants.filter(m => normalizeSector(m.secteur) === 'Secteur Ouest').length,
      'Secteur Centre': militants.filter(m => normalizeSector(m.secteur) === 'Secteur Centre').length,
    },
    parGrade: {
      chefs: militants.filter(m => (m.grade || '').includes('Chef')).length,
      responsables: militants.filter(m => (m.grade || '').includes('Responsable')).length,
      animateurs: militants.filter(m => (m.grade || '').includes('Animateur')).length,
    }
  }), [militants, pagination.total]);
  const handleExport = async () => {
    const id = toast.loading('Préparation de l\'export PDF...');
    try {
      await exportToPDF(militants);
      toast.success('Export PDF terminé', { id });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Erreur lors de l\'export', { id });
    }
  };

  const handleExportExcel = () => {
    const id = toast.loading('Préparation de l\'export Excel...');
    try {
      exportToExcel(militants);
      toast.success('Export Excel terminé', { id });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Erreur lors de l\'export', { id });
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestion des Militants</h1>
          <p className="text-gray-600 mt-2 tracking-tight">
            {stats.total} militants actifs dans la communauté CVAV
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="flex gap-2">
            <button onClick={handleExport} className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors tracking-tight" title="Exporter en PDF">
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </button>
            <button onClick={handleExportExcel} className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors tracking-tight" title="Exporter en Excel">
              <Download className="h-4 w-4" />
              <span>Excel</span>
            </button>
          </div>
          <button 
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl px-4 py-2 hover:from-blue-700 hover:to-blue-800 transition-all tracking-tight shadow-lg shadow-blue-500/25"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Militant</span>
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          title="Total Militants"
          value={stats.total}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Secteur Nord"
          value={stats.parSecteur['Secteur Nord']}
          icon={MapPin}
          color="indigo"
        />
        <StatCard
          title="Secteur Sud"
          value={stats.parSecteur['Secteur Sud']}
          icon={MapPin}
          color="green"
        />
        <StatCard
          title="Secteur Est"
          value={stats.parSecteur['Secteur Est']}
          icon={MapPin}
          color="purple"
        />
        <StatCard
          title="Secteur Ouest"
          value={stats.parSecteur['Secteur Ouest']}
          icon={MapPin}
          color="indigo"
        />
        <StatCard
          title="Secteur Centre"
          value={stats.parSecteur['Secteur Centre']}
          icon={MapPin}
          color="blue"
        />
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un militant par nom, prénom ou paroisse..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
              value={searchParams.secteur}
              onChange={(e) => handleSecteurFilter(e.target.value)}
            >
              <option value="">Tous les secteurs</option>
              <option value="Secteur Nord">Secteur Nord</option>
              <option value="Secteur Sud">Secteur Sud</option>
              <option value="Secteur Est">Secteur Est</option>
              <option value="Secteur Ouest">Secteur Ouest</option>
              <option value="Secteur Centre">Secteur Centre</option>
              
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-gray-400" />
            <select
              className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
              value={searchParams.grade}
              onChange={(e) => handleGradeFilter(e.target.value)}
            >
              <option value="">Tous les grades</option>
              <option value="Chef de secteur">Chef de secteur</option>
              <option value="Responsable jeunesse">Responsable jeunesse</option>
              <option value="Animateur">Animateur</option>
              <option value="Militant">Militant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau TanStack */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Chargement des militants...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50">
                      {headerGroup.headers.map(header => (
                        <th 
                          key={header.id} 
                          className="text-left py-4 px-6 text-sm font-semibold text-gray-900 tracking-tight"
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort() 
                                  ? 'cursor-pointer select-none flex items-center space-x-1' 
                                  : '',
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: <ChevronUp className="h-4 w-4" />,
                                desc: <ChevronDown className="h-4 w-4" />,
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="py-4 px-6">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* État vide */}
            {militants.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Aucun militant trouvé</h3>
                <p className="text-gray-500 mt-2 tracking-tight">
                  Aucun militant ne correspond à vos critères de recherche.
                </p>
              </div>
            )}

            {/* Pagination */}
            {militants.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 tracking-tight">
                    Affichage de{' '}
                    <span className="font-semibold">{militants.length}</span>{' '}
                    militant(s) sur{' '}
                    <span className="font-semibold">{pagination.total}</span>
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 tracking-tight">
                      Page {pagination.page} sur {pagination.totalPages}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSearchParams(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors tracking-tight"
                      >
                        Précédent
                      </button>
                      <button
                        onClick={() => setSearchParams(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors tracking-tight"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de suppression */}
      {isDeleteModalOpen && (
        <DeleteModal
          militant={selectedMilitant}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedMilitant(null);
          }}
        />
      )}
    </div>
  );
}

// Composant StatCard
interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 tracking-tight">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Composant Modal de suppression
interface DeleteModalProps {
  militant: Militant | null;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteModal({ militant, onConfirm, onCancel }: DeleteModalProps) {
  if (!militant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Confirmer la suppression
        </h3>
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer le militant{' '}
          <span className="font-semibold">
            {militant.prenom} {militant.nom}
          </span>
          ? Cette action est irréversible.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/25"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}