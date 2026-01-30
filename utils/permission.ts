// // utils/permission.ts - VERSION SIMPLIFIÉE ET COHÉRENTE

import { IUtilisateur } from "@/models/utilisateur";

// ============================================================================
// DÉFINITION DES PERMISSIONS PAR RÔLE - SYSTÈME POSSESSIF/GLOBAL
// ============================================================================

const PERMISSIONS: Record<string, string[]> = {
  // --------------------------------------------------------------------------
  // UTILISATEUR : Permissions sur SES propres données uniquement
  // --------------------------------------------------------------------------
  utilisateur: [

    //tableau de bord et statistiques
    "voir_tableau_de_bord",
    "voir_statistiques",
    // Mes demandes d'attestation
    "creer_mes_demandes_attestations",
    "modifier_mes_demandes_attestations",
    "supprimer_mes_demandes_attestations",
    "voir_mes_demandes_attestations",
    "telecharger_mes_attestations_validees",
    
    // Mes demandes de cérémonie
    "creer_mes_demandes_ceremonies",
    "modifier_mes_demandes_ceremonies",
    "supprimer_mes_demandes_ceremonies",
    "voir_mes_demandes_ceremonies",
    
    // Mes militants (ceux que j'ai créés dans ma zone)
    "voir_mes_militants",
    "creer_mes_militants",
    "modifier_mes_militants",
    "supprimer_mes_militants",
    
    // Mes fichiers
    "voir_mes_fichiers",
    "telecharger_mes_fichiers",
    "uploader_mes_fichiers",
    "supprimer_mes_fichiers",
    "modifier_mes_fichiers",
    
    // Mes notifications
    "voir_mes_notifications",
    "marquer_mes_notifications_comme_lues",
  ],

  // --------------------------------------------------------------------------
  // ADMIN : Permissions GLOBALES sur TOUTES les données
  // --------------------------------------------------------------------------
  admin: [
    // Gestion globale des utilisateurs
    "creer_tout_utilisateur",
    "modifier_tout_utilisateur",
    "supprimer_tout_utilisateur",
    "voir_tout_utilisateur",
    
    // Gestion des rôles et permissions
    "creer_tout_role",
    "modifier_tout_role",
    "supprimer_tout_role",
    "voir_tout_role",
    
    // Logs et audit
    "voir_tout_logs_actions",
    "voir_tout_logs_erreurs",
    
    // Gestion globale des militants
    "creer_tout_militant",
    "modifier_tout_militant",
    "supprimer_tout_militant",
    "voir_tout_militant",
    
    // Gestion globale des attestations
    "voir_toutes_demandes_attestation",
    "valider_toute_demande_attestation",
    "rejeter_toute_demande_attestation",
    "generer_toute_attestation_pdf",
    "modifier_toute_demande_attestation",
    
    // Gestion globale des cérémonies
    "voir_toutes_demandes_ceremonie",
    "valider_toute_demande_ceremonie",
    "rejeter_toute_demande_ceremonie",
    "modifier_toute_demande_ceremonie",
    
    // Paramètres système
    "voir_tout_parametre_systeme",
    "modifier_tout_parametre_systeme",
    
    // Gestion globale des fichiers
    "voir_tout_fichier",
    "supprimer_tout_fichier",
    "telecharger_tout_fichier",
    "uploader_tout_fichier",
    "modifier_tout_fichier",
    
    // Gestion globale des notifications
    "voir_toute_notification",
    "creer_toute_notification",
    "modifier_toute_notification",
    "supprimer_toute_notification",
    "marquer_toute_notification_comme_lue",

    //tableau de bord et statistiques
    "voir_tableau_de_bord",
    "voir_statistiques",
  ],
};

// ============================================================================
// LISTE GLOBALE DE TOUTES LES PERMISSIONS
// ============================================================================
const ALL_PERMISSIONS: string[] = Array.from(
  new Set([
    ...PERMISSIONS.utilisateur,
    ...PERMISSIONS.admin,
  ])
).sort();

// ============================================================================
// FONCTION DE VÉRIFICATION DES PERMISSIONS
// ============================================================================

/**
 * Vérifie si un utilisateur a une permission spécifique
 * 
 * @param utilisateur - L'utilisateur à vérifier
 * @param action - L'action/permission à vérifier (ex: "voir_tout_militant")
 * @returns true si l'utilisateur a la permission, false sinon
 * 
 * @example
 * voirPermission(user, "creer_mes_militants") // true si utilisateur peut créer des militants
 * voirPermission(user, "voir_tout_utilisateur") // true uniquement si admin
 */
export function voirPermission(
  utilisateur: IUtilisateur | null, 
  action: string
): boolean {
  // Vérifications de base
  if (!utilisateur || !utilisateur.role) {
    console.warn('⚠️ Permission check: utilisateur ou role manquant');
    return false;
  }

  let roleNom: string | null = null;
  let rolePermissions: string[] = [];

  // Déterminer le rôle et ses permissions
  if (typeof utilisateur.role === "object" && utilisateur.role !== null && "nom" in utilisateur.role) {
    // Rôle peuplé (objet)
    const roleObj = utilisateur.role as unknown as { nom: string; permissions: string[] };
    roleNom = roleObj.nom?.toLowerCase() || null;
    rolePermissions = roleObj.permissions || [];
  } else {
    // Rôle non peuplé (ID ou string)
    roleNom = String(utilisateur.role).toLowerCase();
    rolePermissions = PERMISSIONS[roleNom] || [];
  }

  if (!roleNom) {
    console.warn('⚠️ Permission check: roleNom invalide');
    return false;
  }

  // Vérification du joker (super admin)
  if (rolePermissions.includes("*")) {
    return true;
  }

  // Vérification de la permission spécifique
  const hasPermission = rolePermissions.includes(action);
  
  // Log en mode développement
  if (process.env.NODE_ENV === 'development') {
    if (!hasPermission) {
      console.debug(`🔒 Permission refusée: ${roleNom} n'a pas "${action}"`);
    }
  }

  return hasPermission;
}

// ============================================================================
// HELPERS UTILES
// ============================================================================

/**
 * Vérifie si un utilisateur est admin
 */
export function estAdmin(utilisateur: IUtilisateur | null): boolean {
  if (!utilisateur || !utilisateur.role) return false;
  
  const roleNom = typeof utilisateur.role === "object" && "nom" in utilisateur.role
    ? (utilisateur.role as any).nom
    : String(utilisateur.role);
    
  return roleNom?.toLowerCase() === "admin";
}

/**
 * Récupère toutes les permissions d'un utilisateur
 */
export function getUtilisateurPermissions(utilisateur: IUtilisateur | null): string[] {
  if (!utilisateur || !utilisateur.role) return [];
  
  if (typeof utilisateur.role === "object" && "permissions" in utilisateur.role) {
    return (utilisateur.role as any).permissions || [];
  }
  
  const roleNom = String(utilisateur.role).toLowerCase();
  return PERMISSIONS[roleNom] || [];
}

/**
 * Vérifie plusieurs permissions (l'utilisateur doit avoir AU MOINS UNE)
 */
export function voirAuMoinsUnePermission(
  utilisateur: IUtilisateur | null,
  actions: string[]
): boolean {
  return actions.some(action => voirPermission(utilisateur, action));
}

/**
 * Vérifie plusieurs permissions (l'utilisateur doit avoir TOUTES)
 */
export function voirToutesPermissions(
  utilisateur: IUtilisateur | null,
  actions: string[]
): boolean {
  return actions.every(action => voirPermission(utilisateur, action));
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ALL_PERMISSIONS, PERMISSIONS };