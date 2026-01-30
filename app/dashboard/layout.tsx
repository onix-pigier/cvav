"use client";

import { Toaster } from "@/components/ui/sonner"
import Sidebar, { SidebarItem, useSidebarContext } from "@/components/sidebar";
import { 
  BarChart, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Award, 
  Bell,
  UserCircle, 
  LifeBuoy, 
  Settings, 
  Shield, 
  UsersRound, 
  FileCheck, 
  Crown
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { voirPermission } from "@/utils/permission";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isLoggingOut } = useAuth();
  const { count: notifCount } = useNotifications();

  if (isLoading || isLoggingOut) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {isLoggingOut ? "Déconnexion en cours..." : "Chargement..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const can = (action: string) => voirPermission(user as any, action);
  const isAdmin = user?.role?.nom?.toLowerCase() === "admin";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar>
        {/* ==================== SECTION PRINCIPALE ==================== */}
        <div className="mb-6">
          <div className="px-5 mb-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Principal
            </p>
          </div>
          
          {can("voir_tableau_de_bord") && (
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Tableau de bord" 
              href="/dashboard"
            />
          )}
          
          {can("voir_statistiques") && (
            <SidebarItem
              icon={<BarChart size={20} />} 
              text="Statistiques" 
              href="/dashboard/statistiques"
            />
          )}
        </div>

        {/* ==================== SECTION MILITANTS ==================== */}
        {(can("voir_tout_militant") || can("voir_mes_militants")) && (
          <div className="mb-6">
            <div className="px-5 mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Militants
              </p>
            </div>
            
            <SidebarItem 
              icon={<Users size={20} />} 
              text="Gestion Militants" 
              href="/dashboard/militants"
            />
          </div>
        )}

        {/* ==================== SECTION DEMANDES ==================== */}
        <div className="mb-6">
          <div className="px-5 mb-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {isAdmin ? "Validation" : "Mes Demandes"}
            </p>
          </div>
          
          {isAdmin ? (
            <>
              <SidebarItem 
                icon={<FileCheck size={20} />} 
                text="Attestations à valider" 
                href="/admin/attestations"
              />
              <SidebarItem 
                icon={<FileCheck size={20} />} 
                text="Cérémonies à valider" 
                href="/admin/ceremonies"
              />
            </>
          ) : (
            <>
              {can("voir_mes_demandes_attestations") && (
                <SidebarItem 
                  icon={<FileText size={20} />} 
                  text="Mes Attestations" 
                  href="/dashboard/attestations"
                />
              )}
              
              {can("voir_mes_demandes_ceremonies") && (
                <SidebarItem 
                  icon={<Award size={20} />} 
                  text="Mes Cérémonies" 
                  href="/dashboard/ceremonies"
                />
              )}
            </>
          )}
        </div>

        {/* ==================== SECTION ADMINISTRATION ==================== */}
        {isAdmin && (
          <div className="mb-6 border-t pt-4 border-blue-200/30">
            <div className="px-5 mb-3">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                <Crown size={14} className="text-blue-600" />
                Gestion
              </p>
            </div>
            
            {can("voir_tout_utilisateur") && (
              <SidebarItem 
                icon={<UsersRound size={20} />} 
                text="Utilisateurs" 
                href="/dashboard/admin/users"
              />
            )}

            {can("voir_tout_role") && (
              <SidebarItem 
                icon={<Shield size={20} />} 
                text="Rôles & Permissions" 
                href="/dashboard/admin/roles"
              />
            )}

            {can("voir_tout_parametre_systeme") && (
              <SidebarItem 
                icon={<Settings size={20} />} 
                text="Paramètres système" 
                href="/dashboard/admin/parametres"
              />
            )}
          </div>
        )}

        {/* ==================== SECTION NOTIFICATIONS ==================== */}
        {(can("voir_toute_notification") || can("voir_mes_notifications")) && (
          <div className="mb-6">
            <div className="px-5 mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Notifications
              </p>
            </div>
            
            <SidebarItem 
              icon={<Bell size={20} />} 
              text="Notifications" 
              href="/dashboard/notifications"
              badge={notifCount}
              alert={notifCount > 0}
            />
          </div>
        )}

        {/* ==================== SECTION MON COMPTE ==================== */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="px-5 mb-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Mon Compte
            </p>
          </div>
          
          <SidebarItem 
            icon={<UserCircle size={20} />} 
            text="Mon Profil" 
            href="/dashboard/profil"
          />
          
          <SidebarItem 
            icon={<LifeBuoy size={20} />} 
            text="Support" 
            href="/dashboard/change-password"
          />
        </div>
      </Sidebar>

      {/* Contenu principal - Responsive à la sidebar */}
      <ResponsiveMain>
        {children}
      </ResponsiveMain>
    </div>
  );
}

// Composant pour gérer le responsive du main
function ResponsiveMain({ children }: { children: React.ReactNode }) {
  const { expanded } = useSidebarContext();
  
  return (
    <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
      expanded ? 'ml-80' : 'ml-0'
    } bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100`}>
      <div className="p-6">
        {children}
      </div>
      <Toaster position="top-right" />
    </main>
  );
}
