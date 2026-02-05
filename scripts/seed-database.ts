// scripts/seed-database.ts - SEED COMPLET (RÔLES + ADMIN + USER)
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// ============================================
// CONFIGURATION
// ============================================

const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  console.error('❌ MONGO_URI manquant dans .env');
  process.exit(1);
}

// ============================================
// CONNEXION
// ============================================

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error);
    process.exit(1);
  }
}

// ============================================
// SEED DES RÔLES
// ============================================

async function seedRoles() {
  console.log('\n🎭 Création des rôles...\n');

  const Role = mongoose.connection.collection('roles');

  // Supprimer les rôles existants
  await Role.deleteMany({});
  console.log('  🗑️  Anciens rôles supprimés');

  // Créer les rôles
  const roles = await Role.insertMany([
    {
      nom: 'admin',
      permissions: [
        "creer_utilisateur",
        "modifier_tout_utilisateur",
        "supprimer_tout_utilisateur",
        "voir_tout_utilisateur",
        "creer_role",
        "modifier_tout_role",
        "supprimer_tout_role",
        "voir_tout_role",
        "creer_militant",
        "modifier_tout_militant",
        "supprimer_tout_militant",
        "voir_tout_militant",
        "voir_toute_demande_attestation",
        "valider_demande_attestation",
        "supprimer_toute_demande_attestation",
        "voir_toute_demande_ceremonie",
        "valider_demande_ceremonie",
        "supprimer_toute_demande_ceremonie",
        "voir_toute_notification",
        "creer_toute_notification",
        "modifier_toute_notification",
        "supprimer_toute_notification",
        "marquer_toute_notification_comme_lue",
        "voir_dashboard",
        "voir_statistiques_avancees",
        "voir_logs_actions",
        "exporter_donnees",
        "gerer_parametres_systeme",
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nom: 'utilisateur',
      permissions: [
        "voir_dashboard",
        "creer_mes_demandes_attestations",
        "modifier_mes_demandes_attestations",
        "supprimer_mes_demandes_attestations",
        "voir_mes_demandes_attestations",
        "creer_mes_demandes_ceremonies",
        "modifier_mes_demandes_ceremonies",
        "supprimer_mes_demandes_ceremonies",
        "voir_mes_demandes_ceremonies",
        "voir_mes_militants",
        "creer_militant",
        "modifier_mes_militants",
        "supprimer_mes_militants",
        "voir_mes_notifications",
        "marquer_mes_notifications_comme_lues",
        "voir_mon_utilisateur",
        "modifier_mon_utilisateur",
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const adminRole = roles.insertedIds[0];
  const userRole = roles.insertedIds[1];

  console.log(`  ✅ Rôle 'admin' créé (ID: ${adminRole})`);
  console.log(`  ✅ Rôle 'utilisateur' créé (ID: ${userRole})\n`);

  return { adminRole, userRole };
}

// ============================================
// SEED DES UTILISATEURS
// ============================================

async function seedUsers(adminRoleId: any, userRoleId: any) {
  console.log('👥 Création des utilisateurs...\n');

  const Utilisateur = mongoose.connection.collection('utilisateurs');

  // Supprimer les utilisateurs existants
  await Utilisateur.deleteMany({});
  console.log('  🗑️  Anciens utilisateurs supprimés');

  // Hash des mots de passe
  const adminPassword = await bcrypt.hash('12345678', 10);
  const userPassword = await bcrypt.hash('12345678', 10);

  // Créer les utilisateurs
  const users = await Utilisateur.insertMany([
    {
      email: 'cesakouassi5@gmail.com',
      motDePasse: adminPassword,
      prenom: 'Admin',
      nom: 'CVAV',
      telephone: '+225 00 00 00 00 00',
      paroisse: 'Administration',
      secteur: 'Administration',
      role: adminRoleId,
      actif: true,
      doitChangerMotDePasse: false,
      tentativesConnexion: 0,
      dernierChangementMotDePasse: new Date(),
      dateCreation: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'onixdev2@gmail.com',
      motDePasse: userPassword,
      prenom: 'Utilisateur',
      nom: 'Test',
      telephone: '+225 01 02 03 04 05',
      paroisse: 'Saint-Pierre',
      secteur: 'Secteur Nord',
      role: userRoleId,
      actif: true,
      doitChangerMotDePasse: false,
      tentativesConnexion: 0,
      dernierChangementMotDePasse: new Date(),
      dateCreation: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  console.log(`  ✅ Admin créé : cesakouassi5@gmail.com (${users.insertedIds[0]})`);
  console.log(`  ✅ User créé  : onixdev2@gmail.com (${users.insertedIds[1]})\n`);

  return users.insertedIds;
}

// ============================================
// MISE À JOUR DU FICHIER .ENV
// ============================================

async function updateEnvFile(userRoleId: any) {
 

  try {
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (envContent.includes('DEFAULT_USER_ROLE_ID=')) {
      envContent = envContent.replace(
        /DEFAULT_USER_ROLE_ID=.*/,
        `DEFAULT_USER_ROLE_ID=${userRoleId}`
      );
    } else {
      envContent += `\nDEFAULT_USER_ROLE_ID=${userRoleId}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Fichier .env mis à jour\n');
  } catch (error) {
    console.error('⚠️  Erreur mise à jour .env:', error);
    console.log(`⚠️  Ajoutez manuellement: DEFAULT_USER_ROLE_ID=${userRoleId}\n`);
  }
}

// ============================================
// FONCTION PRINCIPALE
// ============================================

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🌱 SEED DE LA BASE DE DONNÉES');
  console.log('='.repeat(60) + '\n');

  try {
    // 1. Connexion
    await connectDB();

    // 2. Seed des rôles
    const { adminRole, userRole } = await seedRoles();

    // 3. Seed des utilisateurs
    await seedUsers(adminRole, userRole);

    // 4. Mise à jour .env
    await updateEnvFile(userRole);

    // 5. Résumé
    console.log('='.repeat(60));
    console.log('✅ SEED TERMINÉ AVEC SUCCÈS !');
    console.log('='.repeat(60) + '\n');

    console.log('📋 Comptes créés :\n');
    
    console.log('👑 ADMINISTRATEUR :');
    console.log('   📧 Email      : cesakouassi5@gmail.com');
    console.log('   🔒 Mot de passe: 12345678');
    console.log('   🎭 Rôle       : admin\n');

    console.log('👤 UTILISATEUR TEST :');
    console.log('   📧 Email      : onixdev2@gmail.com');
    console.log('   🔒 Mot de passe: 12345678');
    console.log('   🎭 Rôle       : utilisateur\n');

    console.log('🚀 Prochaines étapes :');
    console.log('   1. Démarrez le serveur : npm run dev');
    console.log('   2. Connectez-vous avec un des comptes');
    console.log('   3. Testez les fonctionnalités\n');

    console.log('⚠️  SÉCURITÉ : Changez les mots de passe en production !\n');

  } catch (error: any) {
    console.error('\n❌ Erreur lors du seed:', error.message || error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB\n');
  }
}

// ============================================
// EXÉCUTION
// ============================================

main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});