// // app/api/stats/route.ts - API STATISTIQUES COMPLÈTE
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/utils/auth";
import { estAdmin } from "@/utils/permission";
import Utilisateur from "@/models/utilisateur";
import Militant from "@/models/militant";
import DemandeCeremonie from "@/models/ceremonie";
import DemandeAttestation from "@/models/attestation";
import LogAction from "@/models/action";
import Notification from "@/models/notification";

export async function GET(request: Request) {
  try {
    await connectDB();
    const currentUser = await getUserFromToken(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
    }

    const isAdmin = estAdmin(currentUser);
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // jours

    // ============================================
    // 1. STATISTIQUES GÉNÉRALES
    // ============================================
    const [
      totalUtilisateurs,
      utilisateursActifs,
      totalMilitants,
      totalAttestations,
      totalCeremonies,
      totalNotifications
    ] = await Promise.all([
      Utilisateur.countDocuments(),
      Utilisateur.countDocuments({ actif: true }),
      Militant.countDocuments(),
      DemandeAttestation.countDocuments(
        isAdmin ? {} : { utilisateur: currentUser._id }
      ),
      DemandeCeremonie.countDocuments(
        isAdmin ? {} : { utilisateur: currentUser._id }
      ),
      Notification.countDocuments({ utilisateur: currentUser._id })
    ]);

    // ============================================
    // 2. ATTESTATIONS PAR STATUT
    // ============================================
    const filtreAttestation = isAdmin ? {} : { utilisateur: currentUser._id };
    
    const [attestationsEnAttente, attestationsValidees, attestationsRejetees] = await Promise.all([
      DemandeAttestation.countDocuments({ ...filtreAttestation, statut: "en_attente" }),
      DemandeAttestation.countDocuments({ ...filtreAttestation, statut: "valide" }),
      DemandeAttestation.countDocuments({ ...filtreAttestation, statut: "rejete" })
    ]);

    // ============================================
    // 3. CÉRÉMONIES PAR STATUT
    // ============================================
    const filtreCeremonie = isAdmin ? {} : { utilisateur: currentUser._id };
    
    const [ceremoniesEnAttente, ceremoniesValidees, ceremoniesRejetees] = await Promise.all([
      DemandeCeremonie.countDocuments({ ...filtreCeremonie, statut: "en_attente" }),
      DemandeCeremonie.countDocuments({ ...filtreCeremonie, statut: "valide" }),
      DemandeCeremonie.countDocuments({ ...filtreCeremonie, statut: "rejete" })
    ]);

    // ============================================
    // 4. STATISTIQUES FOULARDS (Admin seulement)
    // ============================================
    let statsFoulards = { totalBenjamins: 0, totalCadets: 0, totalAines: 0, totalFoulards: 0 };
    
    if (isAdmin) {
      const ceremonies = await DemandeCeremonie.find({ statut: "valide" }).lean();
      statsFoulards = {
        totalBenjamins: ceremonies.reduce((sum, c) => sum + (c.foulardsBenjamins || 0), 0),
        totalCadets: ceremonies.reduce((sum, c) => sum + (c.foulardsCadets || 0), 0),
        totalAines: ceremonies.reduce((sum, c) => sum + (c.foulardsAines || 0), 0),
        totalFoulards: ceremonies.reduce((sum, c) => 
          sum + (c.foulardsBenjamins || 0) + (c.foulardsCadets || 0) + (c.foulardsAines || 0), 0
        )
      };
    }

    // ============================================
    // 5. RÉPARTITION PAR SECTEUR (Admin seulement)
    // ============================================
    let repartitionParSecteur: any[] = [];
    
    if (isAdmin) {
      const secteurs = ["Secteur Nord", "Secteur Sud", "Secteur Est", "Secteur Ouest", "Secteur Centre"];
      
      repartitionParSecteur = await Promise.all(
        secteurs.map(async (secteur) => ({
          secteur,
          militants: await Militant.countDocuments({ secteur }),
          attestations: await DemandeAttestation.countDocuments({ secteur }),
          ceremonies: await DemandeCeremonie.countDocuments({ Secteur: secteur })
        }))
      );
    }

    // ============================================
    // 6. RÉPARTITION PAR PAROISSE (Admin seulement)
    // ============================================
    let repartitionParParoisse: any[] = [];
    
    if (isAdmin) {
      const militantsGroupes = await Militant.aggregate([
        { $group: { _id: "$paroisse", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      repartitionParParoisse = await Promise.all(
        militantsGroupes.map(async (item) => ({
          paroisse: item._id,
          militants: item.count,
          attestations: await DemandeAttestation.countDocuments({ paroisse: item._id })
        }))
      );
    }

    // ============================================
    // 7. ÉVOLUTION MENSUELLE (6 derniers mois)
    // ============================================
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const evolutionMensuelle = await Promise.all(
      Array.from({ length: 6 }, async (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        
        const filtreDate = {
          createdAt: { $gte: date, $lt: nextMonth }
        };
        
        const [attestations, ceremonies, militants] = await Promise.all([
          DemandeAttestation.countDocuments({ ...filtreDate, ...(isAdmin ? {} : { utilisateur: currentUser._id }) }),
          DemandeCeremonie.countDocuments({ ...filtreDate, ...(isAdmin ? {} : { utilisateur: currentUser._id }) }),
          isAdmin ? Militant.countDocuments(filtreDate) : 0
        ]);
        
        return {
          mois: date.toLocaleDateString('fr-FR', { month: 'short' }),
          attestations,
          ceremonies,
          militants
        };
      })
    );

    // ============================================
    // 8. RÉPARTITION PAR GRADE (Admin seulement)
    // ============================================
    let repartitionParGrade: any[] = [];
    
    if (isAdmin) {
      repartitionParGrade = await Militant.aggregate([
        { $group: { _id: "$grade", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { grade: "$_id", count: 1, _id: 0 } }
      ]);
    }

    // ============================================
    // 9. ACTIVITÉS RÉCENTES (Admin seulement)
    // ============================================
    let activitesRecentes: any[] = [];
    
    if (isAdmin) {
      activitesRecentes = await LogAction.find()
        .populate("admin", "prenom nom email")
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
    }

    // ============================================
    // 10. NOTIFICATIONS NON LUES
    // ============================================
    const notificationsNonLues = await Notification.countDocuments({
      utilisateur: currentUser._id,
      lu: false
    });

    // ============================================
    // 11. DEMANDES RÉCENTES (Utilisateur)
    // ============================================
    const demandesRecentes = await Promise.all([
      DemandeAttestation.find(filtreAttestation)
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      DemandeCeremonie.find(filtreCeremonie)
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    // ============================================
    // 12. TAUX DE VALIDATION
    // ============================================
    const totalDemandesAttestations = attestationsEnAttente + attestationsValidees + attestationsRejetees;
    const totalDemandesCeremonies = ceremoniesEnAttente + ceremoniesValidees + ceremoniesRejetees;
    
    const tauxValidationAttestations = totalDemandesAttestations > 0 
      ? Math.round((attestationsValidees / totalDemandesAttestations) * 100) 
      : 0;
      
    const tauxValidationCeremonies = totalDemandesCeremonies > 0
      ? Math.round((ceremoniesValidees / totalDemandesCeremonies) * 100)
      : 0;

    // ============================================
    // RÉPONSE FINALE
    // ============================================
    return NextResponse.json({
      // Générales
      statsGenerales: {
        totalUtilisateurs,
        utilisateursActifs,
        totalMilitants,
        totalAttestations,
        totalCeremonies,
        totalNotifications,
        notificationsNonLues
      },

      // Attestations
      statsAttestations: {
        total: totalAttestations,
        enAttente: attestationsEnAttente,
        validees: attestationsValidees,
        rejetees: attestationsRejetees,
        tauxValidation: tauxValidationAttestations
      },

      // Cérémonies
      statsCeremonies: {
        total: totalCeremonies,
        enAttente: ceremoniesEnAttente,
        validees: ceremoniesValidees,
        rejetees: ceremoniesRejetees,
        tauxValidation: tauxValidationCeremonies
      },

      // Foulards (admin only)
      statsFoulards,

      // Géographique (admin only)
      repartitionParSecteur,
      repartitionParParoisse,

      // Temporel
      evolutionMensuelle,

      // Grades (admin only)
      repartitionParGrade,

      // Activités (admin only)
      activitesRecentes,

      // Demandes récentes
      demandesRecentes: {
        attestations: demandesRecentes[0],
        ceremonies: demandesRecentes[1]
      },

      // Métadonnées
      meta: {
        isAdmin,
        period: parseInt(period),
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("💥 Erreur stats:", error);
    return NextResponse.json({ 
      message: "Erreur lors de la récupération des statistiques." 
    }, { status: 500 });
  }
}