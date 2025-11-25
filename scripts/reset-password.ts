// Crée un script temporaire pour reset le mot de passe
// scripts/reset-admin-password.js
import { connectDB } from '@/lib/db';
import Utilisateur from '@/models/utilisateur';
import bcrypt from 'bcryptjs';

async function resetAdminPassword() {
  try {
    await connectDB();
    
    const newPassword = "Admin@2025";
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const result = await Utilisateur.findOneAndUpdate(
      { email: "admin@cvav.com" },
      { 
        motDePasse: hashedPassword,
        doitChangerMotDePasse: false,
        dernierChangementMotDePasse: new Date()
      },
      { new: true }
    );
    
    if (result) {
      console.log('✅ Mot de passe admin mis à jour avec succès');
      console.log('Nouveau mot de passe:', newPassword);
    } else {
      console.log('❌ Utilisateur admin non trouvé');
    }
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    process.exit();
  }
}

resetAdminPassword();