// utils/permission.ts - VERSION FINALE CONSOLIDÉE
import { IUtilisateur } from "@/models/utilisateur";

// ============================================================================
// LISTE COMPLÈTE DE TOUTES LES PERMISSIONS (SOURCE UNIQUE DE VÉRITÉ)
// ============================================================================

export const ALL_PERMISSIONS = [
  // 👤 UTILISATEURS (6)
  "creer_utilisateur",
  "voir_tout_utilisateur",
  "modifier_tout_utilisateur",
  "supprimer_tout_utilisateur",
  "voir_mon_utilisateur",
  "modifier_mon_utilisateur",

  // 🎭 RÔLES (4)
  "creer_role",
  "voir_tout_role",
  "modifier_tout_role",
  "supprimer_tout_role",

  // 👥 MILITANTS (7)
  "creer_militant",
  "voir_tout_militant",
  "modifier_tout_militant",
  "supprimer_tout_militant",
  "voir_mes_militants",
  "modifier_mes_militants",
  "supprimer_mes_militants",

  // 📜 ATTESTATIONS (7)
  "creer_mes_demandes_attestations",
  "voir_mes_demandes_attestations",
  "modifier_mes_demandes_attestations",
  "supprimer_mes_demandes_attestations",
  "voir_toute_demande_attestation",
  "valider_demande_attestation",
  "supprimer_toute_demande_attestation",

  // 🎊 CÉRÉMONIES (7)
  "creer_mes_demandes_ceremonies",
  "voir_mes_demandes_ceremonies",
  "modifier_mes_demandes_ceremonies",
  "supprimer_mes_demandes_ceremonies",
  "voir_toute_demande_ceremonie",
  "valider_demande_ceremonie",
  "supprimer_toute_demande_ceremonie",

  // 🔔 NOTIFICATIONS (7)
  "voir_mes_notifications",
  "marquer_mes_notifications_comme_lues",
  "voir_toute_notification",
  "creer_toute_notification",
  "modifier_toute_notification",
  "supprimer_toute_notification",
  "marquer_toute_notification_comme_lue",

  // ⚙️ SYSTÈME (5)
  "voir_dashboard",
  "voir_statistiques_avancees",
  "voir_logs_actions",
  "exporter_donnees",
  "gerer_parametres_systeme",
] as const;

// ============================================================================
// PERMISSIONS PAR RÔLE
// ============================================================================

export const PERMISSIONS_PAR_ROLE: Record<string, string[]> = {
  // UTILISATEUR : Permissions de base
  utilisateur: [
    "voir_dashboard",
    "voir_statistiques_avancees",
    
    "creer_mes_demandes_attestations",
    "voir_mes_demandes_attestations",
    "modifier_mes_demandes_attestations",
    "supprimer_mes_demandes_attestations",
    
    "creer_mes_demandes_ceremonies",
    "voir_mes_demandes_ceremonies",
    "modifier_mes_demandes_ceremonies",
    "supprimer_mes_demandes_ceremonies",
    
    "voir_mes_militants",
    "creer_militant",
    "modifier_mes_militants",
    "supprimer_mes_militants",
    
    "voir_mes_notifications",
    "marquer_mes_notifications_comme_lues",
    
    "voir_mon_utilisateur",
    "modifier_mon_utilisateur",
  ],

  // ADMIN : TOUTES les permissions
  admin: [...ALL_PERMISSIONS],
};

// ============================================================================
// ORGANISATION DES PERMISSIONS PAR CATÉGORIE (pour l'interface)
// ============================================================================

export const PERMISSIONS_CATEGORIES = {
  utilisateurs: {
    nom: "Gestion des Utilisateurs",
    icon: "👤",
    description: "Création, modification et gestion des comptes utilisateurs",
    permissions: [
      { code: "creer_utilisateur", label: "Créer un utilisateur", description: "Créer de nouveaux comptes utilisateurs" },
      { code: "voir_tout_utilisateur", label: "Voir tous les utilisateurs", description: "Accéder à la liste complète des utilisateurs" },
      { code: "modifier_tout_utilisateur", label: "Modifier tout utilisateur", description: "Modifier n'importe quel compte utilisateur" },
      { code: "supprimer_tout_utilisateur", label: "Supprimer tout utilisateur", description: "Supprimer des comptes utilisateurs" },
      { code: "voir_mon_utilisateur", label: "Voir mon profil", description: "Consulter son propre profil" },
      { code: "modifier_mon_utilisateur", label: "Modifier mon profil", description: "Modifier ses propres informations" }
    ]
  },

  roles: {
    nom: "Gestion des Rôles",
    icon: "🎭",
    description: "Configuration des rôles et de leurs permissions",
    permissions: [
      { code: "creer_role", label: "Créer un rôle", description: "Créer de nouveaux rôles personnalisés" },
      { code: "voir_tout_role", label: "Voir tous les rôles", description: "Consulter la liste des rôles" },
      { code: "modifier_tout_role", label: "Modifier tout rôle", description: "Modifier les rôles et leurs permissions" },
      { code: "supprimer_tout_role", label: "Supprimer tout rôle", description: "Supprimer des rôles (sauf système)" }
    ]
  },

  militants: {
    nom: "Gestion des Militants",
    icon: "👥",
    description: "Base de données des militants et membres",
    permissions: [
      { code: "creer_militant", label: "Créer un militant", description: "Enregistrer de nouveaux militants" },
      { code: "voir_tout_militant", label: "Voir tous les militants", description: "Accès complet à la base militants" },
      { code: "modifier_tout_militant", label: "Modifier tout militant", description: "Modifier les fiches militants" },
      { code: "supprimer_tout_militant", label: "Supprimer tout militant", description: "Retirer des militants de la base" },
      { code: "voir_mes_militants", label: "Voir mes militants", description: "Voir uniquement ses militants" },
      { code: "modifier_mes_militants", label: "Modifier mes militants", description: "Modifier ses propres militants" },
      { code: "supprimer_mes_militants", label: "Supprimer mes militants", description: "Supprimer ses propres militants" }
    ]
  },

  attestations: {
    nom: "Demandes d'Attestation",
    icon: "📜",
    description: "Gestion des demandes d'attestation de formation",
    permissions: [
      { code: "creer_mes_demandes_attestations", label: "Créer mes demandes", description: "Soumettre des demandes d'attestation" },
      { code: "voir_mes_demandes_attestations", label: "Voir mes demandes", description: "Consulter ses propres demandes" },
      { code: "modifier_mes_demandes_attestations", label: "Modifier mes brouillons", description: "Modifier ses demandes non soumises" },
      { code: "supprimer_mes_demandes_attestations", label: "Supprimer mes brouillons", description: "Supprimer ses brouillons" },
      { code: "voir_toute_demande_attestation", label: "Voir toutes les attestations", description: "Accès admin aux demandes" },
      { code: "valider_demande_attestation", label: "Valider les attestations", description: "Approuver/rejeter les demandes" },
      { code: "supprimer_toute_demande_attestation", label: "Supprimer toute attestation", description: "Supprimer n'importe quelle demande" }
    ]
  },

  ceremonies: {
    nom: "Demandes de Cérémonie",
    icon: "🎊",
    description: "Organisation et validation des cérémonies de foulards",
    permissions: [
      { code: "creer_mes_demandes_ceremonies", label: "Créer mes demandes", description: "Soumettre des demandes de cérémonie" },
      { code: "voir_mes_demandes_ceremonies", label: "Voir mes demandes", description: "Consulter ses propres demandes" },
      { code: "modifier_mes_demandes_ceremonies", label: "Modifier mes brouillons", description: "Modifier ses demandes non soumises" },
      { code: "supprimer_mes_demandes_ceremonies", label: "Supprimer mes brouillons", description: "Supprimer ses brouillons" },
      { code: "voir_toute_demande_ceremonie", label: "Voir toutes les cérémonies", description: "Accès admin aux demandes" },
      { code: "valider_demande_ceremonie", label: "Valider les cérémonies", description: "Approuver/rejeter les demandes" },
      { code: "supprimer_toute_demande_ceremonie", label: "Supprimer toute cérémonie", description: "Supprimer n'importe quelle demande" }
    ]
  },

  notifications: {
    nom: "Gestion des Notifications",
    icon: "🔔",
    description: "Système de notifications et alertes",
    permissions: [
      { code: "voir_mes_notifications", label: "Voir mes notifications", description: "Consulter ses notifications" },
      { code: "marquer_mes_notifications_comme_lues", label: "Marquer comme lues", description: "Gérer le statut de lecture" },
      { code: "voir_toute_notification", label: "Voir toutes les notifications", description: "Accès admin aux notifications" },
      { code: "creer_toute_notification", label: "Créer des notifications", description: "Envoyer des notifications" },
      { code: "modifier_toute_notification", label: "Modifier toute notification", description: "Modifier les notifications" },
      { code: "supprimer_toute_notification", label: "Supprimer toute notification", description: "Supprimer des notifications" },
      { code: "marquer_toute_notification_comme_lue", label: "Marquer toute comme lue", description: "Gérer toutes les lectures" }
    ]
  },

  systeme: {
    nom: "Administration Système",
    icon: "⚙️",
    description: "Paramètres système et logs d'audit",
    permissions: [
      { code: "voir_dashboard", label: "Voir le tableau de bord", description: "Accès au dashboard principal" },
      { code: "voir_statistiques_avancees", label: "Voir statistiques avancées", description: "Accès à l'analyse complète" },
      { code: "voir_logs_actions", label: "Voir les logs", description: "Consulter l'historique des actions" },
      { code: "exporter_donnees", label: "Exporter les données", description: "Export PDF/Excel des rapports" },
      { code: "gerer_parametres_systeme", label: "Gérer les paramètres", description: "Modifier la configuration système" }
    ]
  }
};

// ============================================================================
// FONCTIONS DE VÉRIFICATION
// ============================================================================

export function voirPermission(
  utilisateur: IUtilisateur | null, 
  action: string
): boolean {
  if (!utilisateur || !utilisateur.role) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Permission check: utilisateur ou role manquant');
    }
    return false;
  }

  let roleNom: string | null = null;
  let rolePermissions: string[] = [];

  if (typeof utilisateur.role === "object" && utilisateur.role !== null && "nom" in utilisateur.role) {
    const roleObj = utilisateur.role as unknown as { nom: string; permissions: string[] };
    roleNom = roleObj.nom?.toLowerCase() || null;
    rolePermissions = roleObj.permissions || [];
  } else {
    roleNom = String(utilisateur.role).toLowerCase();
    rolePermissions = PERMISSIONS_PAR_ROLE[roleNom] || [];
  }

  if (!roleNom) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Permission check: roleNom invalide');
    }
    return false;
  }

  if (rolePermissions.includes("*")) {
    return true;
  }

  const hasPermission = rolePermissions.includes(action);
  
  if (process.env.NODE_ENV === 'development' && !hasPermission) {
    console.debug(`🔒 Permission refusée: ${roleNom} n'a pas "${action}"`);
  }

  return hasPermission;
}

export function estAdmin(utilisateur: IUtilisateur | null): boolean {
  if (!utilisateur || !utilisateur.role) return false;
  
  const roleNom = typeof utilisateur.role === "object" && "nom" in utilisateur.role
    ? (utilisateur.role as any).nom
    : String(utilisateur.role);
    
  return roleNom?.toLowerCase() === "admin";
}

export function getUtilisateurPermissions(utilisateur: IUtilisateur | null): string[] {
  if (!utilisateur || !utilisateur.role) return [];
  
  if (estAdmin(utilisateur)) {
    return [...ALL_PERMISSIONS];
  }
  
  if (typeof utilisateur.role === "object" && "permissions" in utilisateur.role) {
    return (utilisateur.role as any).permissions || [];
  }
  
  const roleNom = String(utilisateur.role).toLowerCase();
  return PERMISSIONS_PAR_ROLE[roleNom] || [];
}

export function voirAuMoinsUnePermission(
  utilisateur: IUtilisateur | null,
  actions: string[]
): boolean {
  if (estAdmin(utilisateur)) return true;
  return actions.some(action => voirPermission(utilisateur, action));
}

export function voirToutesPermissions(
  utilisateur: IUtilisateur | null,
  actions: string[]
): boolean {
  if (estAdmin(utilisateur)) return true;
  return actions.every(action => voirPermission(utilisateur, action));
}

// ============================================
// HELPERS POUR LES SCRIPTS
// ============================================

export function getAdminPermissions(): string[] {
  return [...ALL_PERMISSIONS];
}

export function getUserPermissions(): string[] {
  return PERMISSIONS_PAR_ROLE.utilisateur;
}