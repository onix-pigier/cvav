// scripts/reset-database.ts - SCRIPT DE RÉINITIALISATION COMPLÈTE
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import readline from 'readline';
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
// INTERFACE DE CONFIRMATION
// ============================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// ============================================
// CONNEXION À LA BASE DE DONNÉES
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
// SUPPRESSION DE TOUTES LES DONNÉES
// ============================================

async function deleteAllData() {
  console.log('\n🗑️  Suppression de toutes les données...\n');

  const collections = [
    'utilisateurs',
    'roles',
    'militants',
    'demandeattestation',
    'demandeceremonies',
    'notifications',
    'actions',
    'fichiers'
  ];

  for (const collectionName of collections) {
    try {
      const collection = mongoose.connection.collection(collectionName);
      const count = await collection.countDocuments();
      
      if (count > 0) {
        await collection.deleteMany({});
        console.log(`  ✅ ${collectionName}: ${count} document(s) supprimé(s)`);
      } else {
        console.log(`  ⚪ ${collectionName}: Déjà vide`);
      }
    } catch (error) {
      console.log(`  ⚠️  ${collectionName}: Collection n'existe pas (OK)`);
    }
  }

  console.log('\n✅ Toutes les données ont été supprimées\n');
}

// ============================================
// CRÉATION DES RÔLES PAR DÉFAUT
// ============================================

async function createDefaultRoles() {
  console.log('🎭 Création des rôles par défaut...\n');

  const Role = mongoose.connection.collection('roles');

  // Rôle Admin
  const adminRole = await Role.insertOne({
    nom: 'admin',
    permissions: [
      // Utilisateurs
      "creer_utilisateur",
      "modifier_tout_utilisateur",
      "supprimer_tout_utilisateur",
      "voir_tout_utilisateur",
      
      // Rôles
      "creer_role",
      "modifier_tout_role",
      "supprimer_tout_role",
      "voir_tout_role",
      
      // Militants
      "creer_militant",
      "modifier_tout_militant",
      "supprimer_tout_militant",
      "voir_tout_militant",
      
      // Attestations
      "voir_toute_demande_attestation",
      "valider_demande_attestation",
      "supprimer_toute_demande_attestation",
      
      // Cérémonies
      "voir_toute_demande_ceremonie",
      "valider_demande_ceremonie",
      "supprimer_toute_demande_ceremonie",
      
      // Notifications
      "voir_toute_notification",
      "creer_toute_notification",
      "modifier_toute_notification",
      "supprimer_toute_notification",
      "marquer_toute_notification_comme_lue",
      
      // Système
      "voir_dashboard",
      "voir_statistiques_avancees",
      "voir_logs_actions",
      "exporter_donnees",
      "gerer_parametres_systeme",
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log(`  ✅ Rôle 'admin' créé (ID: ${adminRole.insertedId})`);

  // Rôle Utilisateur
  const userRole = await Role.insertOne({
    nom: 'utilisateur',
    permissions: [
      // Dashboard
      "voir_dashboard",
      
      // Mes demandes
      "creer_mes_demandes_attestations",
      "modifier_mes_demandes_attestations",
      "supprimer_mes_demandes_attestations",
      "voir_mes_demandes_attestations",
      "creer_mes_demandes_ceremonies",
      "modifier_mes_demandes_ceremonies",
      "supprimer_mes_demandes_ceremonies",
      "voir_mes_demandes_ceremonies",
      
      // Mes militants
      "voir_mes_militants",
      "creer_militant",
      "modifier_mes_militants",
      "supprimer_mes_militants",
      
      // Mes notifications
      "voir_mes_notifications",
      "marquer_mes_notifications_comme_lues",
      
      // Mon profil
      "voir_mon_utilisateur",
      "modifier_mon_utilisateur",
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log(`  ✅ Rôle 'utilisateur' créé (ID: ${userRole.insertedId})\n`);

  return { adminRoleId: adminRole.insertedId, userRoleId: userRole.insertedId };
}

// ============================================
// CRÉATION DU COMPTE ADMIN PAR DÉFAUT
// ============================================

async function createDefaultAdmin(adminRoleId: any) {
  console.log('👤 Création du compte administrateur...\n');

  const Utilisateur = mongoose.connection.collection('utilisateurs');

  // Demander les informations admin
  const email = await question('  📧 Email admin (défaut: kouassicesariokouassi@gmail.com): ') || 'kouassicesariokouassi@gmail.com';
  const password = await question('  🔒 Mot de passe (défaut: Admin@2024): ') || 'Admin@2024';
  const prenom = await question('  👤 Prénom (défaut: Admin): ') || 'Admin';
  const nom = await question('  👤 Nom (défaut: CVAV): ') || 'CVAV';

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Utilisateur.insertOne({
    email,
    motDePasse: hashedPassword,
    prenom,
    nom,
    role: adminRoleId,
    telephone: '+225 00 00 00 00 00',
    paroisse: 'Administration',
    secteur: 'Administration',
    actif: true,
    dateCreation: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log('\n  ✅ Compte admin créé avec succès!');
  console.log(`     📧 Email: ${email}`);
  console.log(`     🔒 Mot de passe: ${password}`);
  console.log(`     🆔 ID: ${admin.insertedId}\n`);

  return admin.insertedId;
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

    // Vérifier si DEFAULT_USER_ROLE_ID existe déjà
    if (envContent.includes('DEFAULT_USER_ROLE_ID=')) {
      // Remplacer
      envContent = envContent.replace(
        /DEFAULT_USER_ROLE_ID=.*/,
        `DEFAULT_USER_ROLE_ID=${userRoleId}`
      );
    } else {
      // Ajouter
      envContent += `\nDEFAULT_USER_ROLE_ID=${userRoleId}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Fichier .env mis à jour avec DEFAULT_USER_ROLE_ID\n');
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
  console.log('🔄 RÉINITIALISATION COMPLÈTE DE LA BASE DE DONNÉES');
  console.log('='.repeat(60) + '\n');

  console.log('⚠️  ATTENTION : Cette action va :');
  console.log('   1. Supprimer TOUTES les données existantes');
  console.log('   2. Recréer les rôles par défaut (admin, utilisateur)');
  console.log('   3. Créer un nouveau compte administrateur');
  console.log('   4. Mettre à jour le fichier .env\n');

  const confirm = await question('❓ Voulez-vous continuer ? (oui/non): ');

  if (confirm.toLowerCase() !== 'oui' && confirm.toLowerCase() !== 'o') {
    console.log('\n❌ Opération annulée\n');
    rl.close();
    process.exit(0);
  }

  const doubleConfirm = await question('\n❓ Êtes-vous VRAIMENT sûr ? Tapez "SUPPRIMER" pour confirmer: ');

  if (doubleConfirm !== 'SUPPRIMER') {
    console.log('\n❌ Opération annulée\n');
    rl.close();
    process.exit(0);
  }

  console.log('\n🚀 Démarrage de la réinitialisation...\n');

  try {
    // 1. Connexion
    await connectDB();

    // 2. Suppression des données
    await deleteAllData();

    // 3. Création des rôles
    const { adminRoleId, userRoleId } = await createDefaultRoles();

    // 4. Création de l'admin
    await createDefaultAdmin(adminRoleId);

    // 5. Mise à jour .env
    await updateEnvFile(userRoleId);

    // 6. Résumé
    console.log('='.repeat(60));
    console.log('✅ RÉINITIALISATION TERMINÉE AVEC SUCCÈS !');
    console.log('='.repeat(60) + '\n');

    console.log('📋 Résumé :');
    console.log('  ✅ Base de données vidée');
    console.log('  ✅ Rôles créés (admin, utilisateur)');
    console.log('  ✅ Compte admin créé');
    console.log('  ✅ Fichier .env mis à jour\n');

    console.log('🚀 Prochaines étapes :');
    console.log('  1. Redémarrez le serveur : npm run dev');
    console.log('  2. Connectez-vous avec le compte admin');
    console.log('  3. Créez vos premiers utilisateurs\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de la réinitialisation:', error);
    process.exit(1);
  } finally {
    rl.close();
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