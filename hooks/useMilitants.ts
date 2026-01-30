// hooks/useMilitants.ts

import { useState, useEffect, useCallback } from 'react';
import type { Militant, MilitantResponse } from '@/types/militant';
import toast from 'react-hot-toast';

interface UseMilitantsOptions {
  page?: number;
  limit?: number;
  search?: string;
  secteur?: string;
  grade?: string;
  autoFetch?: boolean;
}

export function useMilitants(options: UseMilitantsOptions = {}) {
  const {
    page = 1,
    limit = 10,
    search = '',
    secteur = '',
    grade = '',
    autoFetch = true,
  } = options;

  const [militants, setMilitants] = useState<Militant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchMilitants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Construction des paramètres de requête
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append('search', search);
      if (secteur) params.append('secteur', secteur);
      if (grade) params.append('grade', grade);

      const response = await fetch(`/api/militants?${params.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des militants');
      }

      const data: MilitantResponse = await response.json();
      setMilitants(data.data);
      setPagination(data.pagination);
    } catch (err: any) {
      console.error('Erreur fetchMilitants:', err);
      setError(err.message);
      toast.error(err.message || 'Erreur lors du chargement des militants');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, secteur, grade]);

  const deleteMilitant = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/militants?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      toast.success('Militant supprimé avec succès');
      await fetchMilitants(); // Recharger la liste
      return true;
    } catch (err: any) {
      console.error('Erreur deleteMilitant:', err);
      toast.error(err.message || 'Erreur lors de la suppression');
      return false;
    }
  }, [fetchMilitants]);

  const refresh = useCallback(() => {
    fetchMilitants();
  }, [fetchMilitants]);

  useEffect(() => {
    if (autoFetch) {
      fetchMilitants();
    }
  }, [autoFetch, fetchMilitants]);

  return {
    militants,
    isLoading,
    error,
    pagination,
    fetchMilitants,
    deleteMilitant,
    refresh,
  };
}