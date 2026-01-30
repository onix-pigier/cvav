"use client";

import { useState, useEffect } from 'react';

interface Notification {
  _id: string;
  titre: string;
  message: string;
  lu: boolean;
  type: string;
  createdAt: string;
}

export function useNotifications() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCount();
    // ✅ Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCount = async () => {
    try {
      const res = await fetch('/api/notifications', { 
        credentials: 'include',
        cache: 'no-store' // ✅ Pas de cache
      });
      
      if (res.ok) {
        const data = await res.json();
        // ✅ Compter les notifications non lues
        const nonLues = data.filter((n: Notification) => !n.lu).length;
        setCount(nonLues);
      } else {
        setCount(0);
      }
    } catch (error) {
      console.error('❌ Erreur count notifications:', error);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    count, 
    isLoading,
    refresh: fetchCount 
  };
}