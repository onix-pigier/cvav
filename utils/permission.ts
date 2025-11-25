// middleware/permission.ts

import { IUtilisateur } from "@/models/utilisateur";

// Définition des permissions par rôle
const PERMISSIONS: Record<string, string[]> = {
  utilisateur: [
    "creer_demande_ceremonie",
    "modifier_demande_ceremonie",
    "supprimer_demande_ceremonie",
    "voir_mes_demandes_ceremonie",
    "creer_demande_attestation",
    "modifier_demande_attestation",
    "supprimer_demande_attestation",
    "voir_mes_demandes_attestation",
    "voir_militants",
    "creer_militant",
    "modifier_militant",
    "supprimer_militant",
    "voir_fichiers",
    "telecharger_fichiers",
    "uploader_fichiers",
    "supprimer_fichiers",
    "modifier_fichier",
    "creer_notification",
    "modifier_notification",
    "supprimer_notification",
    "voir_notifications",
    "marquer_notification_comme_lue"
  ],
  admin: [
    "creer_utilisateur",
    "modifier_utilisateur",
    "supprimer_utilisateur",
    "voir_utilisateur",
    "creer_role",
    "modifier_role",
    "supprimer_role",
    "voir_role",
    "voir_les_logs_actions",
    "voir_les_logs_erreurs",
    "creer_militant",
    "modifier_militant",
    "supprimer_militant",
    "voir_militants",
    "valider_demande_attestation",
    "rejeter_demande_attestation",
    "voir_les_params_systeme",
    "modifier_les_params_systeme",
    "voir_demande_ceremonies",
    "valider_demande_ceremonie",
    "rejeter_demande_ceremonie",
    "voir_demande_attestations",
    "voir_fichiers",
    "supprimer_fichiers",
    "voir_notifications",
    "creer_notification",
    "modifier_notification",
    "supprimer_notification",
    "marquer_notification_comme_lue",
    "telecharger_fichiers",
    "uploader_fichiers",
    "modifier_fichier"
  ]
};

/**
 * Vérifie si un utilisateur a la permission pour une action donnée
 * @param utilisateur L'utilisateur connecté
 * @param action L'action à vérifier (string)
 * @returns boolean
 */
export function voirPermission(utilisateur: IUtilisateur | null, action: string): boolean {
  if (!utilisateur || !utilisateur.role) return false;

  // Récupère le nom du rôle si l'objet role contient la propriété 'nom' (ex: population), sinon on essaie de convertir role en string
  let roleNom: string | null = null;

  if (typeof utilisateur.role === "object" && utilisateur.role !== null && "nom" in utilisateur.role) {
    const maybeNom = (utilisateur.role as any).nom;
    if (typeof maybeNom === "string" && maybeNom.length > 0) {
      roleNom = maybeNom.toLowerCase();
    }
  } else {
    // role peut être un ObjectId ou une chaîne ; on convertit en chaîne
    roleNom = String(utilisateur.role).toLowerCase();
  }

  if (!roleNom) return false;

  // Récupère la liste des permissions pour le rôle
  const permissions = PERMISSIONS[roleNom] || [];

  // Vérifie si l'action est permise
  return permissions.includes(action);
}
