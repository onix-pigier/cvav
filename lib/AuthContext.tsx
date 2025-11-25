'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Permission {
  nom: string;
  permissions: string[];
}

interface User {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  role: Permission;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, motDePasse: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ⬇️ FONCTION EXTRACTED POUR RÉUTILISATION
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-cache',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.utilisateur);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Erreur de verification de la session:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Vérification de la session au montage
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, motDePasse: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, motDePasse }),
      });

      const data = await res.json();

      if (res.ok) {
        // ⬇️ APPEL checkAuth APRÈS LOGIN RÉUSSI
        await checkAuth();
        return { success: true };
      } else {
        return { 
          success: false, 
          message: data.message || `Erreur ${res.status}` 
        };
      }
    } catch (err) {
      return { 
        success: false, 
        message: 'Erreur réseau. Vérifiez votre connexion.' 
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout serveur échoué, on continue côté client', err);
    } finally {
      setUser(null);
      router.push('/login');
      router.refresh();
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};