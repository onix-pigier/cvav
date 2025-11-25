// scripts/seed-admin.ts
import 'dotenv/config';
import { connectDB } from '@/lib/db';        // ← alias Next.js (ou "../lib/db" si tu préfères)
import Role from '@/models/role';            // ← modèle Mongoose bien exporté
import Utilisateur from '@/models/utilisateur';
import { voirPermission } from '@/utils/permission';

// Fonction principale
async function seedAdmin() {
  try {
    // 1. Connexion à la base
    await connectDB();
    console.log('Connexion à MongoDB OK');

    // 2. Créer ou récupérer le rôle Admin
    let adminRole = await Role.findOne({ nom: 'Admin' });

    if (!adminRole) {
      adminRole = await Role.create({
        nom: 'Admin',
        permissions: ['*'], // toutes les permissions
      });
      console.log('Rôle Admin créé avec toutes les permissions');
    } else {
      console.log('Rôle Admin déjà existant');
    }

    // 3. Créer ou récupérer l'utilisateur admin
    const emailAdmin = 'admin@cvav.com';
    let adminUser = await Utilisateur.findOne({ email: emailAdmin });

    if (!adminUser) {
      // Attention : si tu hashes le mot de passe ailleurs (ex: pre-save hook), tu peux le mettre en clair ici
      adminUser = await Utilisateur.create({
        prenom: 'Admin',
        nom: 'CVAV',
        email: emailAdmin,
        motDePasse: 'Admin@2025', // sera hashé automatiquement par ton hook mongoose si tu en as un
        role: adminRole._id,
        actif: true,
        creerPar: null,
        doitChangerMotDePasse: false, // recommandé : forcer le changement au 1er login
        tentativesConnexion: 0,
        dernierChangementMotDePasse: new Date(),
      });
      console.log(`Utilisateur Admin créé : ${emailAdmin}`);
    } else {
      console.log(`Utilisateur Admin déjà existant : ${emailAdmin}`);
    }

    console.log('Seed admin terminé avec succès');
    process.exit(0);
  } catch (err: any) {
    console.error('Erreur lors du seed admin :', err.message || err);
    process.exit(1);
  }
}

seedAdmin();