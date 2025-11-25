"use client";

import { ChevronFirst, ChevronLast, MoreVertical, User, LogOut, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useContext, useState } from "react";
import { useAuth } from "@/lib/AuthContext";

// Contexte pour savoir si la sidebar est étendue
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isLoading , logout } = useAuth();

  const toggleSidebar = () => {
    setExpanded((curr) => !curr);
  };
  const toggleDropdown = () => {
    setDropdownOpen((curr) => !curr);
  }

if (isLoading) {
    return (
      <aside className="h-screen w-80 fixed left-0 top-0 bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </aside>
    );
  }

  // Couleurs selon le rôle
  const roleConfig = {
    admin: { label: "Administrateur", icon: <Crown className="w-4 h-4" />, gradient: "from-blue-500 to-orange-600" },
    default: { label: user?.role?.nom || "Utilisateur", icon: <User className="w-4 h-4" />, gradient: "from-orange-500 to-amber-500" },
  };

  const role = user?.role?.nom === "admin" ? roleConfig.admin :
              roleConfig.default;

  if (isLoading) {
    return (
      <aside className="h-screen w-80 fixed left-0 top-0 bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Chargement du profil...</div>
      </aside>
    );
  }

  return (
    <>
      {/* Logo flottant quand sidebar réduite */}
      {!expanded && (
        <div className="fixed top-6 left-6 z-50">
          <Image
            src="/photo1.png"
            alt="Cœurs Vaillants"
            width={48}
            height={48}
            className="rounded-full ring-4 ring-orange-500/20 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-2xl"
            onClick={toggleSidebar}
          />
        </div>
      )}

      {/* Sidebar principale */}
      <aside className={`h-screen fixed inset-y-0 left-0 z-40 transition-all duration-500 ease-in-out ${
        expanded ? 'w-80' : 'w-0 overflow-hidden'
      }`}>
        <nav className="h-full flex flex-col bg-linear-to-b from-white to-gray-50 border-r border-gray-200 shadow-2xl">
          {/* Header - Logo + Bouton réduire */}
          <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-100 bg-white/80 backdrop-blur-sm">
            <div 
              className="flex items-center gap-4 cursor-pointer group"
              onClick={toggleSidebar}
            >
              <Image
                src="/photo1.png"
                alt="Cœurs Vaillants"
                width={52}
                height={52}
                className="rounded-full ring-4 ring-orange-500/20 group-hover:ring-orange-500/40 transition-all duration-300 group-hover:scale-105"
              />
              <div className="overflow-hidden transition-all duration-500 ease-in-out">
                <h1 className="font-bold text-2xl bg-linear-to-r from-blue-700 to-orange-600 bg-clip-text text-transparent">
                  Cœurs Vaillants
                </h1>
                <p className="text-sm text-gray-600 font-semibold mt-1">Âmes Vaillantes</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
              className="p-3 rounded-xl bg-linear-to-r from-blue-50 to-orange-50 hover:from-blue-100 hover:to-orange-100 text-blue-700 hover:text-orange-600 transition-all duration-300 hover:scale-110 shadow-lg border border-gray-200/50"
            >
              {expanded ? <ChevronFirst size={24} /> : <ChevronLast size={24} />}
            </button>
          </div>

          {/* Contenu du menu */}
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-5 py-6 space-y-2 overflow-y-auto scrollbar-thin">
              {children}
            </ul>
          </SidebarContext.Provider>

          {/* Profil utilisateur en bas */}
          <div className="border-t border-gray-200 p-5 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={
                    (user && 'photo' in user && (user as any).photo)
                      ? (user as any).photo
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          `${user?.prenom || ''} ${user?.nom || ''}`
                        )}&background=0066cc&color=fff&bold=true&rounded=true`
                  }
                  alt="Profil"
                  width={48}
                  height={48}
                  className="rounded-full ring-4 ring-blue-100 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1 overflow-hidden transition-all duration-500">
                <h4 className="font-bold text-gray-800 text-sm">{user?.prenom} {user?.nom}</h4>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <span className={`inline-flex items-center gap-1 mt-2 px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r ${role.gradient}`}>
                  {role.icon} 
                  {role.label}
                </span>
              </div>
              
             {/* Dropdown menu  vertical */}
             <button
             onClick={toggleDropdown}
             className="p-2 rounded-lg hover:bg-gray-200/50 transition-all hover:scale-110">
              <MoreVertical size={20} className="text-gray-500" />
             </button>
            </div>

            {/* Dropdown content */}
            {dropdownOpen && (
              <div className="absolute bottom-20 left-5 right-5 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                <button
                  onClick={async () => {
                    setDropdownOpen(false);
                    await logout();
                  }}
                 className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-red-50 text-red-600 font-medium transition-colors"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Overlay pour mobile */}
      {expanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={toggleSidebar}


        />
      )}
      {/* Overlay pour fermer le dropdown en cliquant dehors */}
      {dropdownOpen  && (
        <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />)}
    </>
  );
}

// Composant SidebarItem - Menu avec href
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  href?: string;
  active?: boolean;
  alert?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ icon, text, href, active, alert, onClick }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);
  const pathname = usePathname();
  
  // Déterminer si l'item est actif basé sur l'URL actuelle
  const isActive = active || (href && pathname === href);

  const content = (
    <>
      {/* Barre latérale indicateur */}
      <div className={`
        absolute -left-2 top-1/2 -translate-y-1/2
        w-1 h-8 bg-linear-to-b from-orange-500 to-orange-600 rounded-full
        transition-all duration-300 ease-out
        ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
        group-hover:opacity-100 group-hover:scale-100
      `}></div>

      {/* Icône + badge alerte */}
      <div className="relative">
        <div className={`transition-transform duration-300 ${
          isActive ? 'scale-110' : 'group-hover:scale-110'
        }`}>
          {icon}
        </div>
        {alert && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse ring-2 ring-white shadow-lg"></div>
        )}
      </div>

      {/* Texte */}
      <span
        className={`ml-4 overflow-hidden transition-all duration-500 ease-in-out whitespace-nowrap ${
          expanded ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      >
        {text}
      </span>

      {/* Tooltip quand sidebar réduite */}
      {!expanded && (
        <div
          className={`
            absolute left-full top-1/2 -translate-y-1/2
            rounded-xl px-4 py-3 ml-6
            bg-linear-to-r from-gray-900 to-gray-800 text-white text-sm font-semibold
            invisible opacity-0 translate-x-4 transition-all duration-300
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-3
            shadow-2xl whitespace-nowrap z-50
            before:content-[''] before:absolute before:left-0 before:top-1/2 
            before:-translate-y-1/2 before:-translate-x-2
            before:border-4 before:border-transparent before:border-r-gray-800
          `}
        >
          {text}
        </div>
      )}
    </>
  );

  // Si un href est fourni, utiliser Link, sinon utiliser un bouton
  if (href) {
    return (
      <li>
        <Link
          href={href}
          className={`
            relative flex items-center py-4 px-5 my-1
            font-semibold rounded-2xl cursor-pointer
            transition-all duration-300 group
            border-2 border-transparent
            ${
              isActive
                ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-500/40 border-blue-500/20"
                : "text-gray-700 hover:bg-linear-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 hover:border-orange-200 hover:shadow-lg"
            }
          `}
        >
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-4 px-5 my-1
        font-semibold rounded-2xl cursor-pointer
        transition-all duration-300 group
        border-2 border-transparent
        ${
          isActive
            ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-500/40 border-blue-500/20"
            : "text-gray-700 hover:bg-linear-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 hover:border-orange-200 hover:shadow-lg"
        }
      `}
    >
      {content}
    </li>
  );
}

