// scripts/seed-admin.ts - VERSION FINALE SANS ERREURS
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import readline from 'readline';

// ✅ Import des permissions depuis la source unique
import { getAdminPermissions, getUserPermissions } from '../utils/permission';

const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  console.error('❌ MONGO_URI manquant dans .env');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error);
    process.exit(1);
  }
}

async function seedAdmin() {
  console.log('\n' + '='.repeat(60));
  console.log('👑 CRÉATION DU COMPTE ADMINISTRATEUR');
  console.log('='.repeat(60) + '\n');

  try {
    await connectDB();

    const Role = mongoose.connection.collection('roles');
    const Utilisateur = mongoose.connection.collection('utilisateurs');

    // ============================================
    // CRÉER OU METTRE À JOUR LES RÔLES
    // ============================================
    console.log('🎭 Configuration des rôles...\n');

    const adminPermissions = getAdminPermissions();
    const userPermissions = getUserPermissions();
    
    // Rôle Admin
    await Role.updateOne(
      { nom: 'admin' },
      {
        $set: {
          nom: 'admin',
          permissions: adminPermissions,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    // ✅ CORRECTION : Vérifier que le rôle existe après upsert
    const adminRole = await Role.findOne({ nom: 'admin' });
    
    if (!adminRole) {
      throw new Error('Impossible de créer ou récupérer le rôle admin');
    }

    console.log(`  ✅ Rôle 'admin' configuré avec ${adminPermissions.length} permissions`);

    // Rôle Utilisateur
    await Role.updateOne(
      { nom: 'utilisateur' },
      {
        $set: {
          nom: 'utilisateur',
          permissions: userPermissions,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log(`  ✅ Rôle 'utilisateur' configuré avec ${userPermissions.length} permissions\n`);

    // ============================================
    // CONFIGURATION DU COMPTE ADMIN
    // ============================================
    console.log('👤 Configuration du compte administrateur\n');

    const useDefaults = await question('  ❓ Utiliser les valeurs par défaut ? (oui/non): ');
    
    let email, password, prenom, nom, telephone, paroisse, secteur;

    if (useDefaults.toLowerCase() === 'oui' || useDefaults.toLowerCase() === 'o') {
      email = 'kouassicesariokouassi2@gmail.com';
      password = '20252026';
      prenom = 'Admin';
      nom = 'CVAV';
      telephone = '+225 00 00 00 00 00';
      paroisse = 'Administration';
      secteur = 'Administration';
      
      console.log('\n  ✅ Utilisation des valeurs par défaut\n');
    } else {
      email = await question('  📧 Email admin: ') || 'kouassicesariokouassi2@gmail.com';
      password = await question('  🔒 Mot de passe: ') || '20252026';
      prenom = await question('  👤 Prénom: ') || 'Admin';
      nom = await question('  👤 Nom: ') || 'CVAV';
      telephone = await question('  📱 Téléphone: ') || '+225 00 00 00 00 00';
      paroisse = await question('  ⛪ Paroisse: ') || 'Administration';
      secteur = await question('  🗺️  Secteur: ') || 'Administration';
    }

    // ============================================
    // CRÉER OU METTRE À JOUR L'ADMIN
    // ============================================
    console.log('\n🔍 Vérification de l\'utilisateur...\n');

    const existingUser = await Utilisateur.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      console.log('  ⚠️  Un utilisateur avec cet email existe déjà !');
      console.log(`     Email: ${existingUser.email}`);
      console.log(`     Nom: ${existingUser.prenom} ${existingUser.nom}\n`);
      
      const overwrite = await question('  ❓ Voulez-vous le mettre à jour ? (oui/non): ');
      
      if (overwrite.toLowerCase() !== 'oui' && overwrite.toLowerCase() !== 'o') {
        console.log('\n❌ Opération annulée\n');
        rl.close();
        await mongoose.disconnect();
        process.exit(0);
      }

      await Utilisateur.updateOne(
        { email },
        {
          $set: {
            motDePasse: hashedPassword,
            prenom,
            nom,
            telephone,
            paroisse,
            secteur,
            role: adminRole._id,
            actif: true,
            doitChangerMotDePasse: false,
            tentativesConnexion: 0,
            dernierChangementMotDePasse: new Date(),
            updatedAt: new Date()
          }
        }
      );

      console.log('\n  ✅ Utilisateur admin mis à jour avec succès !\n');
    } else {
      await Utilisateur.insertOne({
        email,
        motDePasse: hashedPassword,
        prenom,
        nom,
        telephone,
        paroisse,
        secteur,
        role: adminRole._id,
        actif: true,
        doitChangerMotDePasse: false,
        tentativesConnexion: 0,
        dernierChangementMotDePasse: new Date(),
        dateCreation: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('\n  ✅ Utilisateur admin créé avec succès !\n');
    }

    // ============================================
    // RÉSUMÉ
    // ============================================
    console.log('='.repeat(60));
    console.log('✅ COMPTE ADMINISTRATEUR CONFIGURÉ');
    console.log('='.repeat(60) + '\n');

    console.log('📋 Informations de connexion :');
    console.log(`   📧 Email      : ${email}`);
    console.log(`   🔒 Mot de passe: ${password}`);
    console.log(`   👤 Nom        : ${prenom} ${nom}`);
    console.log(`   📱 Téléphone  : ${telephone}`);
    console.log(`   ⛪ Paroisse   : ${paroisse}`);
    console.log(`   🗺️  Secteur    : ${secteur}`);
    console.log(`   🎭 Rôle       : admin`);
    console.log(`   🔑 Permissions: ${adminPermissions.length}\n`);

    console.log('🚀 Prochaines étapes :');
    console.log('   1. Démarrez le serveur : npm run dev');
    console.log('   2. Connectez-vous avec ces identifiants');
    console.log('   3. Changez le mot de passe après première connexion\n');

    if (password === '20252026' || password === 'Admin@2024') {
      console.log('⚠️  ATTENTION : Vous utilisez le mot de passe par défaut !');
      console.log('   🔒 Changez-le IMMÉDIATEMENT après connexion !\n');
    }

  } catch (error: any) {
    console.error('\n❌ Erreur lors du seed admin:', error.message || error);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB\n');
  }
}

seedAdmin().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});