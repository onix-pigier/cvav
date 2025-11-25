// app/dashboard/militants/page.tsx
"use client";

import { useState, useMemo, useCallback } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Download,
  MoreVertical,
  Eye,
  Phone,
  MapPin,
  Award,
  ChevronDown,
  ChevronUp
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

// Type basé sur votre modèle MongoDB
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

export default function MilitantsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedMilitant, setSelectedMilitant] = useState<Militant | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Données mockées (remplacer par appel API)
  const data: Militant[] = [
    {
      _id: "1",
      prenom: "Jean",
      nom: "Dupont",
      paroisse: "Saint-Pierre",
      secteur: "Nord",
      grade: "Chef de secteur",
      telephone: "+33 1 23 45 67 89",
      createdAt: "2024-01-15"
    },
    {
      _id: "2",
      prenom: "Marie",
      nom: "Curie",
      paroisse: "Saint-Paul",
      secteur: "Sud",
      grade: "Responsable jeunesse",
      telephone: "+33 1 34 56 78 90",
      createdAt: "2024-01-14"
    },
    // ... autres données
  ];

  // Définition des colonnes
  const columns: ColumnDef<Militant>[] = useMemo(() => [
    {
      accessorKey: 'prenom',
      header: 'Militant',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {row.original.prenom[0]}{row.original.nom[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900 tracking-tight">
              {row.original.prenom} {row.original.nom}
            </p>
            <p className="text-sm text-gray-500 tracking-tight">ID: {row.original._id}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'paroisse',
      header: 'Paroisse',
      cell: ({ getValue  }) => (
        <span className="text-gray-900 tracking-tight">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'secteur',
      header: 'Secteur',
      cell: ({ getValue }) => {
        const secteur = getValue() as string;
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
      cell: ({ getValue }) => (
        <div className="flex items-center space-x-2 text-gray-900 tracking-tight">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{getValue() as string}</span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date d\'ajout',
      cell: ({ getValue }) => (
        <span className="text-gray-500 text-sm tracking-tight">
          {new Date(getValue() as string).toLocaleDateString('fr-FR')}
        </span>
      ),
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
    data,
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
  });

  // Handlers
  const handleView = useCallback((militant: Militant) => {
    // Naviguer vers la page de détail
    router.push(`/dashboard/militants/${militant._id}`);
  }, [router]);

  const handleEdit = useCallback((militant: Militant) => {
    // Naviguer vers la page d'édition
    router.push(`/dashboard/militants/${militant._id}/edit`);
  }, [router]);

  const handleDeleteClick = useCallback((militant: Militant) => {
    setSelectedMilitant(militant);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedMilitant) return;
    
    try {
      // Appel API DELETE
      const response = await fetch(`/api/militants?id=${selectedMilitant._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        // Toast de succès
        showToast('Militant supprimé avec succès', 'success');
        // Recharger les données ou optimistically remove
        setIsDeleteModalOpen(false);
        setSelectedMilitant(null);
      } else {
        const error = await response.json();
        showToast(error.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      showToast('Erreur réseau', 'error');
    }
  }, [selectedMilitant]);

  const handleCreate = useCallback(() => {
    router.push('/dashboard/militants/create');
  }, [router]);

  // Fonctions utilitaires
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "Chef de secteur": return "bg-blue-100 text-blue-800";
      case "Responsable jeunesse": return "bg-green-100 text-green-800";
      case "Animateur": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSecteurColor = (secteur: string) => {
    switch (secteur) {
      case "Nord": return "text-blue-600";
      case "Sud": return "text-green-600";
      case "Est": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  // Statistiques
  const stats = useMemo(() => ({
    total: data.length,
    parSecteur: {
      Nord: data.filter(m => m.secteur === "Nord").length,
      Sud: data.filter(m => m.secteur === "Sud").length,
      Est: data.filter(m => m.secteur === "Est").length,
    },
    parGrade: {
      chefs: data.filter(m => m.grade.includes("Chef")).length,
      responsables: data.filter(m => m.grade.includes("Responsable")).length,
      animateurs: data.filter(m => m.grade.includes("Animateur")).length,
    }
  }), [data]);

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
          <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors tracking-tight">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
          <button 
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl px-4 py-2 hover:from-blue-700 hover:to-blue-800 transition-all tracking-tight"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Militant</span>
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* ... (identique à ton code actuel) */}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barre de recherche globale */}
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

          {/* Filtres individuels des colonnes */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
              value={(table.getColumn('secteur')?.getFilterValue() as string) ?? ''}
              onChange={(e) => table.getColumn('secteur')?.setFilterValue(e.target.value)}
            >
              <option value="">Tous les secteurs</option>
              <option value="Nord">Nord</option>
              <option value="Sud">Sud</option>
              <option value="Est">Est</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-gray-400" />
            <select
              className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-tight"
              value={(table.getColumn('grade')?.getFilterValue() as string) ?? ''}
              onChange={(e) => table.getColumn('grade')?.setFilterValue(e.target.value)}
            >
              <option value="">Tous les grades</option>
              <option value="Chef de secteur">Chef de secteur</option>
              <option value="Responsable jeunesse">Responsable jeunesse</option>
              <option value="Animateur">Animateur</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau TanStack */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
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
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Aucun militant trouvé</h3>
            <p className="text-gray-500 mt-2 tracking-tight">
              Aucun militant ne correspond à vos critères de recherche.
            </p>
          </div>
        )}

        {/* Pagination */}
        {table.getRowModel().rows.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 tracking-tight">
                Affichage de{' '}
                <span className="font-semibold">
                  {table.getRowModel().rows.length}
                </span>{' '}
                militant(s) sur{' '}
                <span className="font-semibold">{table.getFilteredRowModel().rows.length}</span>
              </p>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 tracking-tight">
                  Page {table.getState().pagination.pageIndex + 1} sur{' '}
                  {table.getPageCount()}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors tracking-tight"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors tracking-tight"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          </div>
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

      {/* Sections récapitulatives */}
      {/* ... (identique à ton code actuel) */}
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
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
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
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook pour les toasts (à créer séparément)
function showToast(message: string, type: 'success' | 'error' | 'warning') {
  // Implémentation avec votre librairie de toast préférée
  console.log(`Toast ${type}: ${message}`);
}