import {connectDB} from "@/lib/db";
import Role from "@/models/role";

async function initRoles() {
  await connectDB();

  const roles = [
    {
      nom: "Utilisateur",
      permissions: [
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
      ]
    },
    {
      nom: "Admin",
      permissions: [
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
    }
  ];

  for (const roleData of roles) {
    const existing = await Role.findOne({ nom: roleData.nom });
    if (!existing) {
      await Role.create(roleData);
      console.log(`Rôle "${roleData.nom}" créé.`);
    } else {
      console.log(`Rôle "${roleData.nom}" existe déjà.`);
    }
  }

  console.log("Initialisation terminée !");
  process.exit(0);
}

initRoles().catch((err) => {
  console.error("Erreur :", err);
  process.exit(1);
});
