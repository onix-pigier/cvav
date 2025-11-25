// scripts/list-all-models.ts
import 'dotenv/config';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

async function listAllModels() {
  try {
    await connectDB();
    const db = mongoose.connection.db;

    console.log('Connexion à MongoDB OK\n');
    console.log(`Base de données : ${db.databaseName.toUpperCase()}\n`);

    // 1. Toutes les collections physiques dans MongoDB
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name).sort();

    if (collectionNames.length === 0) {
      console.log('Aucune collection trouvée dans la base de données.');
      process.exit(0);
    }

    console.log(`Collections physiques dans la DB (${collectionNames.length}) :`);
    console.log(`   → ${collectionNames.join(', ')}\n`);

    // 2. Tous les modèles Mongoose chargés
    const registeredModels = Object.keys(mongoose.models);

    if (registeredModels.length === 0) {
      console.log('Aucun modèle Mongoose n\'est actuellement enregistré.');
      console.log('Tip : Assure-toi d\'avoir importé tous tes fichiers models quelque part (ex: dans lib/db.ts)');
      process.exit(0);
    }

    console.log(`${registeredModels.length} modèle(s) Mongoose chargé(s) :\n`);
    console.log('═'.repeat(90));

    for (const modelName of registeredModels.sort()) {
      const Model = mongoose.model(modelName);
      const collectionName = Model.collection.name;
      const count = await Model.countDocuments();

      console.log(`Modèle        : ${modelName}`);
      console.log(`Collection    : ${collectionName}`);
      console.log(`Documents     : ${count}`);

      if (count === 0) {
        console.log(`Exemple       : (aucun document)`);
      } else {
        try {
          const projection: any = {};
          if (modelName === 'Utilisateur') {
            projection.motDePasse = 0; // on cache le mot de passe
          }

          const samples = await Model.find({})
            .select(projection)
            .limit(3)
            .lean()
            .exec();

          console.log(`Exemple (${samples.length} premier${samples.length > 1 ? 's' : ''}) :`);
          console.log(JSON.stringify(samples, null, 2));
        } catch (sampleError) {
          console.log('Exemple       : impossible de récupérer les documents');
        }
      }

      console.log('─'.repeat(90));
    }

    // 3. Bonus : collections présentes dans MongoDB mais pas de modèle Mongoose
    const modelCollections = registeredModels.map(name => mongoose.model(name).collection.name);
    const orphanedCollections = collectionNames.filter(col => !modelCollections.includes(col));

    if (orphanedCollections.length > 0) {
      console.log(`\nAttention : Collections présentes dans la DB mais sans modèle Mongoose chargé :`);
      orphanedCollections.forEach(col => console.log(`   → ${col}`));
      console.log(`\nTip : Importe le fichier models/${col}.ts quelque part pour les charger !`);
    }

    console.log('\nTout est bon !');
    process.exit(0);

  } catch (err: any) {
    console.error('\nErreur lors de la connexion ou du listage :', err.message || err);
    process.exit(1);
  }
}

listAllModels();