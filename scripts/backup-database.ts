// scripts/backup-database.ts - SCRIPT DE SAUVEGARDE
import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// ============================================
// CONFIGURATION
// ============================================

const MONGO_URI = process.env.MONGO_URI || '';
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const BACKUP_FILENAME = `backup-${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.json`;

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
// SAUVEGARDE
// ============================================

async function backupDatabase() {
  console.log('\n💾 Sauvegarde de la base de données...\n');

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

  const backup: any = {
    timestamp: new Date().toISOString(),
    database: mongoose.connection.name,
    collections: {}
  };

  for (const collectionName of collections) {
    try {
      const collection = mongoose.connection.collection(collectionName);
      const documents = await collection.find({}).toArray();
      
      backup.collections[collectionName] = documents;
      console.log(`  ✅ ${collectionName}: ${documents.length} document(s) sauvegardé(s)`);
    } catch (error) {
      console.log(`  ⚠️  ${collectionName}: Collection n'existe pas (ignoré)`);
      backup.collections[collectionName] = [];
    }
  }

  // Créer le dossier backups s'il n'existe pas
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Sauvegarder dans un fichier
  const backupPath = path.join(BACKUP_DIR, BACKUP_FILENAME);
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

  console.log('\n✅ Sauvegarde terminée !');
  console.log(`📁 Fichier: ${backupPath}\n`);

  return backupPath;
}

// ============================================
// FONCTION PRINCIPALE
// ============================================

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('💾 SAUVEGARDE DE LA BASE DE DONNÉES');
  console.log('='.repeat(60) + '\n');

  try {
    await connectDB();
    await backupDatabase();

    console.log('='.repeat(60));
    console.log('✅ SAUVEGARDE COMPLÉTÉE !');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de la sauvegarde:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB\n');
  }
}

main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});