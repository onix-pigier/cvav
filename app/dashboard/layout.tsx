"use client";

import Sidebar, { SidebarItem } from "@/components/sidebar";
import { 
  BarChart, LayoutDashboard, Users, FileText, Award, Bell,
  UserCircle, LifeBuoy, Settings, Shield, UsersRound, FileCheck, LogOut
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext"; // ton AuthContext
import { voirPermission } from "@/utils/permission"; // ton fichier de permissions

export default function LayoutDashboardPage({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Si on charge encore l'utilisateur → petit loader discret
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Chargement du menu...</div>
      </div>
    );
  }

  // Fonction helper pour vérifier une permission
  const can = (action: string) => voirPermission(user as any, action);

  return (
    <div className="flex h-screen">
      <Sidebar>
        {/* === TOUJOURS VISIBLE POUR TOUT LE MONDE === */}
        <SidebarItem 
          icon={<LayoutDashboard size={20} />} 
          text="Tableau de bord" 
          href="/dashboard"
        />

        { /* === STATISTIQUES === */}
        <SidebarItem 
          icon={<BarChart size={20} />} 
          text="Statistiques" 
          href="/dashboard/statistiques"
        />

        {/* === MILITANTS === */}
        {can("voir_militants") && (
          <SidebarItem 
            icon={<Users size={20} />} 
            text="Militants" 
            href="/dashboard/militants"
          />
        )}

        {/* === MES DEMANDES D'ATTESTATION === */}
        {can("voir_mes_demandes_attestation") && (
          <SidebarItem 
            icon={<FileText size={20} />} 
            text="Mes Attestations" 
            href="/dashboard/attestations"
          />
        )}

        {/* === MES DEMANDES DE CÉRÉMONIE === */}
        {can("voir_mes_demandes_ceremonie") && (
          <SidebarItem 
            icon={<Award size={20} />} 
            text="Mes Cérémonies" 
            href="/dashboard/ceremonies"
          />
        )}

        {/* === ADMIN : Gestion des utilisateurs === */}
        {can("voir_utilisateur") && (
          <SidebarItem 
            icon={<UsersRound size={20} />} 
            text="Utilisateurs" 
            href="/dashboard/admin/users"
          />
        )}

        {/* === ADMIN : Gestion des rôles === */}
        {can("voir_role") && (
          <SidebarItem 
            icon={<Shield size={20} />} 
            text="Rôles & Permissions" 
            href="/dashboard/admin/roles"
          />
        )}

        {/* === ADMIN : Validation des attestations === */}
        {can("valider_demande_attestation") && (
          <SidebarItem 
            icon={<FileCheck size={20} />} 
            text="Valider Attestations" 
            href="/dashboard/admin/attestations"
            alert={true} // petit badge rouge si y'a des demandes en attente
          />
        )}

        {/* === ADMIN : Validation des cérémonies === */}
        {can("valider_demande_ceremonie") && (
          <SidebarItem 
            icon={<Award size={20} />} 
            text="Valider Cérémonies" 
            href="/dashboard/admin/ceremonies"
            alert={true}
          />
        )}

        {/* === NOTIFICATIONS (tout le monde qui peut les voir) === */}
        {can("voir_notifications") && (
          <SidebarItem 
            icon={<Bell size={20} />} 
            text="Notifications" 
            href="/dashboard/notifications"
            alert={true}
          />
        )}

        {/* === PROFIL PERSONNEL (tout le monde) === */}
        <SidebarItem 
          icon={<UserCircle size={20} />} 
          text="Mon Profil" 
          href="/dashboard/moi"
        />

        {/* === SUPPORT (tout le monde) === */}
        <SidebarItem 
          icon={<LifeBuoy size={20} />} 
          text="Support" 
          href="/dashboard/support"
        />

        {/* === PARAMÈTRES (seulement admin ou ceux qui ont le droit) === */}
        {can("voir_les_params_systeme") && (
          <SidebarItem 
            icon={<Settings size={20} />} 
            text="Paramètres" 
            href="/dashboard/admin/parametres"
          />
        )}

       <SidebarItem 
          icon={<Settings size={20} />} 
          text="Administration" 
          href="/admin"
        />


      </Sidebar>
      

      {/* Contenu principal */}
      <main className="flex-1 p-6 overflow-auto ml-0 lg:ml-80 transition-all duration-300 bg-gray-50">
        {children}
      </main>
    </div>
  );
}