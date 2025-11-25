// scripts/test-db.ts
import "../lib/db";
import Utilisateur from "../models/utilisateur";
import Role from "../models/role";

async function test() {
  console.log("Connexion en cours...");
  
  // Ces 2 lignes FORCENT la création des collections
  await Role.create({ nom: "test-role" });
  await Utilisateur.create({
    prenom: "Test",
    nom: "User",
    email: "test@example.com",
    motDePasse: "123",
    role: null,
  });

  console.log("Collections créées ! Regarde dans VS Code → MongoDB");
  process.exit(0);
}

test();