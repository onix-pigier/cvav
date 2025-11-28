import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromToken } from '@/utils/auth';
import { voirPermission } from '@/utils/permission';
import Role from '@/models/role';
import Utilisateur from '@/models/utilisateur';
import LogAction from '@/models/action';
import { ALL_PERMISSIONS } from '@/utils/permission';

//  CONFIGURATION CENTRALISÉE
const ROLES_SYSTEME_PROTEGES = ['admin', 'utilisateur'];
const NOMS_RESERVES = [...ROLES_SYSTEME_PROTEGES, 'user', 'administrator', 'moderator'];

// ──────────────────────────────────────────────
// POST → Créer un rôle (RBAC: 'creer_role')
// ──────────────────────────────────────────────
export const POST = async (request: Request) => {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser || !voirPermission(currentUser, "creer_role")) {
      return NextResponse.json({ 
        message: "Accès refusé. Permission 'creer_role' requise." 
      }, { status: 403 });
    }

    //  CORRECTION : D'ABORD récupérer les données, ENSUITE logger
    const { nom, permissions } = await request.json();
    console.log("Données reçues pour création rôle:", { nom, permissions });

    const nomLower = String(nom).trim().toLowerCase();

    //  VALIDATION RENFORCÉE
    if (!nomLower || nomLower.length < 2) {
      return NextResponse.json({ 
        message: "Le nom du rôle doit contenir au moins 2 caractères." 
      }, { status: 400 });
    }

    if (!permissions || !Array.isArray(permissions)) {
      return NextResponse.json({ 
        message: "Permissions doit être un tableau." 
      }, { status: 400 });
    }

    //  BLOQUER LES NOMS RÉSERVÉS
    if (NOMS_RESERVES.includes(nomLower)) {
      return NextResponse.json({ 
        message: `Le nom "${nomLower}" est réservé au système.` 
      }, { status: 400 });
    }

    //  VÉRIFICATION UNICITÉ
    const roleExiste = await Role.findOne({ nom: nomLower });
    if (roleExiste) {
      return NextResponse.json({ 
        message: `Le rôle "${nomLower}" existe déjà.` 
      }, { status: 400 });
    }

    //  FILTRAGE DES PERMISSIONS VALIDES
    const permissionsValides = permissions
      .map(p => String(p).trim())
      .filter(permission => ALL_PERMISSIONS.includes(permission));

    // if (permissionsValides.length === 0) {
    //   return NextResponse.json({ 
    //     message: "Aucune permission valide fournie." 
    //   }, { status: 400 });
    // }

    //  CRÉATION SÉCURISÉE
    const nouveauRole = await Role.create({
      nom: nomLower, 
      permissions: permissionsValides
    });
    
    //  LOG D'AUDIT
    await LogAction.create({
      admin: currentUser._id,
      action: "creer_role",
      module: "Role",
      donnees: { 
        roleId: nouveauRole._id, 
        nom: nouveauRole.nom,
        permissions: permissionsValides.length
      }
    });

    return NextResponse.json(
      { 
        message: `Rôle '${nouveauRole.nom}' créé avec succès.`,
        data: nouveauRole
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Erreur création rôle:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la création du rôle." 
    }, { status: 500 });
  }
};

// ──────────────────────────────────────────────
// GET → Lister tous les rôles avec comptes utilisateurs
// ──────────────────────────────────────────────
export const GET = async (request: Request) => {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);

    //  CORRECTION : Vérification insensible à la casse
    if (!currentUser || !voirPermission(currentUser, "voir_role")) {
      console.log(' Accès refusé - Rôle actuel:', currentUser?.role?.nom);
      return NextResponse.json({ 
        message: "Accès refusé. Permission 'voir_role' requise." 
      }, { status: 403 });
    }

    //  AGRÉGATION SÉCURISÉE
    const rolesAvecComptes = await Role.aggregate([
      {
        $lookup: {
          from: 'utilisateurs', 
          localField: '_id', 
          foreignField: 'role', 
          as: 'utilisateurs_lies',
        }
      },
      {
        $addFields: {
          nombreUtilisateurs: { $size: '$utilisateurs_lies' },
          //  MASQUER LES PERMISSIONS SENSIBLES POUR LES NON-ADMINS
          permissions: {
            $cond: {
              if: { 
                $or: [
                  { $eq: [currentUser.role.nom, 'admin'] },
                  { $eq: [currentUser.role.nom, 'Admin'] }
                ]
              },
              then: '$permissions',
              else: '$$REMOVE'
            }
          }
        }
      },
      {
        $unset: ['utilisateurs_lies']
      },
      {
        $sort: { nom: 1 }
      }
    ]);
    
    return NextResponse.json(rolesAvecComptes);

  } catch (error) {
    console.error("Erreur liste rôles:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération des rôles." 
    }, { status: 500 });
  }
};