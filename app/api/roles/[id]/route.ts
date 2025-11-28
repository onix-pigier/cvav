import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import { voirPermission } from "@/utils/permission";
import Role from "@/models/role";
import LogAction from "@/models/action";
import Utilisateur from "@/models/utilisateur";
import { ALL_PERMISSIONS } from "@/utils/permission";

//  CONFIGURATION
const ROLES_SYSTEME_PROTEGES = ['admin', 'utilisateur'];

// Fonction utilitaire
function estRoleSysteme(nomRole: string): boolean {
  return ROLES_SYSTEME_PROTEGES.includes(nomRole.toLowerCase());
}

// ──────────────────────────────────────────────
// GET → Récupérer un rôle par ID
// ──────────────────────────────────────────────
export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } //  Déclarer comme Promise
) {
  try {
    //  CORRECTION CRITIQUE : AWAITER LES PARAMS
    const { id } = await params;
    console.log(" GET Rôle ID:", id);
    
    await connectDB();
    const currentUser = await getUserFromToken(request);

    if (!currentUser || !voirPermission(currentUser, "voir_role")) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
    }

    const role = await Role.findById(id);
    
    if (!role) {
      return NextResponse.json({ message: "Rôle non trouvé." }, { status: 404 });
    }

    //  MASQUER LES PERMISSIONS AUX NON-ADMINS
    const roleAEnvoyer = currentUser.role.nom.toLowerCase() === 'admin' 
      ? role.toObject()
      : { ...role.toObject(), permissions: undefined };

    return NextResponse.json(roleAEnvoyer);

  } catch (error) {
    console.error("Erreur lecture rôle:", error);
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PATCH → Modifier un rôle
// ──────────────────────────────────────────────
export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } //  Déclarer comme Promise
) {
  try {
    //  CORRECTION CRITIQUE : AWAITER LES PARAMS
    const { id } = await params;
    console.log(" PATCH Rôle ID:", id);
    
    await connectDB();
    const currentUser = await getUserFromToken(request);

    if (!currentUser || !voirPermission(currentUser, "modifier_role")) {
      return NextResponse.json({ 
        message: "Accès refusé. Permission 'modifier_role' requise." 
      }, { status: 403 });
    }

    const { nom, permissions } = await request.json();
    const roleId = id;
    
    console.log(" Données reçues modification rôle:", { nom, permissions, roleId });
    
    //  RÉCUPÉRATION ET VÉRIFICATION DU RÔLE
    const role = await Role.findById(roleId);
    if (!role) {
      return NextResponse.json({ message: "Rôle non trouvé." }, { status: 404 });
    }

    console.log(" Rôle à modifier:", role.nom);

    //  BLOQUER MODIFICATION RÔLES SYSTÈME
    if (estRoleSysteme(role.nom)) {
      return NextResponse.json({ 
        message: `Le rôle "${role.nom}" est un rôle système et ne peut être modifié.` 
      }, { status: 403 });
    }

    const updateData: any = {};
    
    //  VALIDATION NOM
    if (nom && nom.trim() !== '') {
      const nomLower = String(nom).trim().toLowerCase();
      
      if (nomLower.length < 2) {
        return NextResponse.json({ 
          message: "Le nom doit contenir au moins 2 caractères." 
        }, { status: 400 });
      }

      if (estRoleSysteme(nomLower)) {
        return NextResponse.json({ 
          message: `Le nom "${nomLower}" est réservé au système.` 
        }, { status: 400 });
      }

      if (nomLower !== role.nom.toLowerCase()) {
        const roleExiste = await Role.findOne({ nom: nomLower });
        if (roleExiste) {
          return NextResponse.json({ 
            message: `Le nom de rôle "${nomLower}" existe déjà.` 
          }, { status: 400 });
        }
        updateData.nom = nomLower;
      }
    }

    //  CORRECTION : AUTORISER LES PERMISSIONS VIDES
    if (permissions !== undefined) {
      if (!Array.isArray(permissions)) {
        return NextResponse.json({ 
          message: "Permissions doit être un tableau." 
        }, { status: 400 });
      }

      const permissionsValides = permissions
        .map(p => String(p).trim())
        .filter(permission => ALL_PERMISSIONS.includes(permission));

      updateData.permissions = permissionsValides;
    }

    console.log(" Données de mise à jour:", updateData);

    //  MISE À JOUR SÉCURISÉE
    const roleMisAJour = await Role.findByIdAndUpdate(
      roleId, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!roleMisAJour) {
      return NextResponse.json({ message: "Erreur lors de la mise à jour du rôle." }, { status: 500 });
    }

    //  LOG D'AUDIT
    await LogAction.create({
      admin: currentUser._id,
      action: "modifier_role",
      module: "Role",
      donnees: { 
        roleId: roleMisAJour._id, 
        ancienNom: role.nom,
        nouveauNom: roleMisAJour.nom,
        modifications: Object.keys(updateData)
      }
    });

    return NextResponse.json({
      message: `Rôle "${roleMisAJour.nom}" modifié avec succès.`,
      data: roleMisAJour
    });

  } catch (error) {
    console.error(" Erreur modification rôle:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la modification du rôle." 
    }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE → Supprimer un rôle
// ──────────────────────────────────────────────
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } //  Déclarer comme Promise
) {
  try {
    //  CORRECTION CRITIQUE : AWAITER LES PARAMS
    const { id } = await params;
    console.log("DELETE Rôle ID:", id);
    
    await connectDB();
    const currentUser = await getUserFromToken(request);
    const roleId = id;
    
    console.log(" Tentative suppression rôle:", roleId);
    
    if (!currentUser || !voirPermission(currentUser, "supprimer_role")) {
      return NextResponse.json({ 
        message: "Accès refusé. Permission 'supprimer_role' requise." 
      }, { status: 403 });
    }

    //  VÉRIFICATION RÔLE EXISTANT
    const role = await Role.findById(roleId);
    if (!role) {
      return NextResponse.json({ message: "Rôle non trouvé." }, { status: 404 });
    }

    console.log(" Rôle à supprimer:", role.nom);

    //  BLOQUER SUPPRESSION RÔLES SYSTÈME
    if (estRoleSysteme(role.nom)) {
      return NextResponse.json({ 
        message: `Le rôle "${role.nom}" est un rôle système et ne peut être supprimé.` 
      }, { status: 403 });
    }

    //  VÉRIFICATION CRITIQUE : VARIABLE ENVIRONNEMENT
    const ID_DU_ROLE_PAR_DEFAUT = process.env.DEFAULT_USER_ROLE_ID;
    if (!ID_DU_ROLE_PAR_DEFAUT) {
      console.error(" DEFAULT_USER_ROLE_ID non défini");
      return NextResponse.json({ 
        message: "Configuration manquante: DEFAULT_USER_ROLE_ID non défini" 
      }, { status: 500 });
    }

    console.log(" Rôle par défaut:", ID_DU_ROLE_PAR_DEFAUT);

    //  VÉRIFIER QUE LE RÔLE PAR DÉFAUT EXISTE
    const roleParDefaut = await Role.findById(ID_DU_ROLE_PAR_DEFAUT);
    if (!roleParDefaut) {
      console.error(" Rôle par défaut non trouvé:", ID_DU_ROLE_PAR_DEFAUT);
      return NextResponse.json({ 
        message: "Le rôle par défaut spécifié n'existe pas." 
      }, { status: 500 });
    }

    console.log(" Rôle par défaut trouvé:", roleParDefaut.nom);

    //  RÉAFFECTATION DES UTILISATEURS
    const utilisateursMisAJour = await Utilisateur.updateMany(
      { role: roleId },
      { $set: { role: ID_DU_ROLE_PAR_DEFAUT } }
    );

    console.log(" Utilisateurs réaffectés:", utilisateursMisAJour.modifiedCount);

    //  SUPPRESSION
    const roleSupprime = await Role.findByIdAndDelete(roleId);

    if (!roleSupprime) {
      return NextResponse.json({ message: "Erreur lors de la suppression du rôle." }, { status: 500 });
    }

    console.log(" Rôle supprimé:", roleSupprime.nom);

    //  LOG D'AUDIT
    await LogAction.create({
      admin: currentUser._id,
      action: "supprimer_role",
      module: "Role",
      donnees: { 
        roleId: roleSupprime._id, 
        nom: roleSupprime.nom, 
        utilisateursAffectes: utilisateursMisAJour.modifiedCount
      }
    });

    return NextResponse.json({ 
      message: `Rôle "${roleSupprime.nom}" supprimé avec succès. ${utilisateursMisAJour.modifiedCount} utilisateur(s) réaffecté(s).` 
    });

  } catch (error) {
    console.error(" Erreur suppression rôle:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la suppression du rôle." 
    }, { status: 500 });
  }
}