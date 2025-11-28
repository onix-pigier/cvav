import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import Utilisateur from "@/models/utilisateur";
import LogAction from "@/models/action";

export async function POST(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    console.log('🔐 DEBUG CHANGE PASSWORD - Début');
    console.log(' - User authentifié:', currentUser?.email);
    
    if (!currentUser) {
      console.log('❌ DEBUG: Utilisateur non authentifié');
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    const body = await request.json();
    const { motDePasseActuel, nouveauMotDePasse, isForcedChange } = body;

    console.log('📥 DEBUG: Données reçues:', {
      motDePasseActuel: motDePasseActuel ? '***' + motDePasseActuel.slice(-4) : 'MANQUANT',
      nouveauMotDePasse: nouveauMotDePasse ? '***' + nouveauMotDePasse.slice(-4) : 'MANQUANT',
      isForcedChange: isForcedChange || false
    });

    if (!motDePasseActuel || !nouveauMotDePasse) {
      console.log('❌ DEBUG: Champs manquants');
      return NextResponse.json({ 
        message: "Mot de passe actuel et nouveau mot de passe requis." 
      }, { status: 400 });
    }

    // Vérifier la force du nouveau mot de passe
    if (nouveauMotDePasse.length < 6) {
      console.log('❌ DEBUG: Mot de passe trop court');
      return NextResponse.json({ 
        message: "Le mot de passe doit contenir au moins 6 caractères." 
      }, { status: 400 });
    }

    // Charger l'utilisateur avec le mot de passe
    const utilisateur = await Utilisateur.findById(currentUser._id)
      .select("+motDePasse +doitChangerMotDePasse");

    console.log('👤 DEBUG: Utilisateur trouvé:', {
      email: utilisateur?.email,
      doitChangerMotDePasse: utilisateur?.doitChangerMotDePasse,
      hasMotDePasse: !!utilisateur?.motDePasse
    });

    if (!utilisateur) {
      console.log('❌ DEBUG: Utilisateur non trouvé en base');
      return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
    }

    // 🔄 LOGIQUE ADAPTÉE POUR LES DEUX MODES
    console.log('🔑 DEBUG: Avant comparaison mot de passe');
    
    if (isForcedChange) {
      // 🎯 MODE FORCÉ : Vérification du mot de passe temporaire
      console.log('🎯 MODE FORCÉ - Vérification mot de passe temporaire');
      const motDePasseTemporaireCorrect = await utilisateur.compareMotDePasse(motDePasseActuel);
      console.log('🔑 DEBUG: Résultat comparaison temporaire:', motDePasseTemporaireCorrect);
      
      if (!motDePasseTemporaireCorrect) {
        console.log('❌ DEBUG: Mot de passe temporaire incorrect');
        console.log('   - Fourni:', motDePasseActuel);
        console.log('   - Stocké (hash):', utilisateur.motDePasse?.substring(0, 20) + '...');
        return NextResponse.json({ 
          message: "Mot de passe temporaire incorrect." 
        }, { status: 400 });
      }
    } else {
      // 🎯 MODE VOLONTAIRE : Vérification du mot de passe actuel
      console.log('🎯 MODE VOLONTAIRE - Vérification mot de passe actuel');
      const motDePasseActuelCorrect = await utilisateur.compareMotDePasse(motDePasseActuel);
      console.log('🔑 DEBUG: Résultat comparaison actuel:', motDePasseActuelCorrect);
      
      if (!motDePasseActuelCorrect) {
        console.log('❌ DEBUG: Mot de passe actuel incorrect');
        console.log('   - Fourni:', motDePasseActuel);
        console.log('   - Stocké (hash):', utilisateur.motDePasse?.substring(0, 20) + '...');
        return NextResponse.json({ 
          message: "Mot de passe actuel incorrect." 
        }, { status: 400 });
      }
    }

    // Empêcher la réutilisation du même mot de passe
    const memeMotDePasse = await utilisateur.compareMotDePasse(nouveauMotDePasse);
    console.log('🔄 DEBUG: Même mot de passe que ancien?', memeMotDePasse);
    
    if (memeMotDePasse) {
      console.log('❌ DEBUG: Nouveau mot de passe identique à ancien');
      return NextResponse.json({ 
        message: "Le nouveau mot de passe doit être différent de l'actuel." 
      }, { status: 400 });
    }

    // ✅ Mettre à jour le mot de passe
    console.log('✅ DEBUG: Mise à jour du mot de passe');
    utilisateur.motDePasse = nouveauMotDePasse;
    
    // Seulement en mode forcé, on désactive le flag
    if (isForcedChange) {
      utilisateur.doitChangerMotDePasse = false;
      utilisateur.tentativesConnexion = 0;
      utilisateur.bloqueJusquA = undefined;
    }
    
    await utilisateur.save();
    console.log('✅ DEBUG: Mot de passe mis à jour avec succès');

    // 📝 Log d'audit adapté
    await LogAction.create({
      admin: currentUser._id,
      action: "changer_mot_de_passe",
      module: "Auth",
      donnees: { 
        userId: currentUser._id,
        changementForce: isForcedChange || false,
        mode: isForcedChange ? "forcé" : "volontaire"
      }
    });

    console.log('📝 DEBUG: Log d audit créé');
    console.log('🎉 DEBUG: Changement mot de passe TERMINÉ avec succès - Mode:', isForcedChange ? 'FORCÉ' : 'VOLONTAIRE');

    return NextResponse.json({ 
      message: "Mot de passe changé avec succès." 
    });

  } catch (error) {
    console.error("💥 DEBUG: Erreur changement mot de passe:", error);
    return NextResponse.json({ 
      message: "Erreur lors du changement de mot de passe." 
    }, { status: 500 });
  }
}