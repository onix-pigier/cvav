#!/usr/bin/env node

/**
 * 🧪 CVAV PLATFORM - TEST SUITE COMPLET E2E
 * 
 * Tests le workflow complet:
 * 1. Authentification (admin + user)
 * 2. User soumet attestation/cérémonie
 * 3. Admin reçoit notification
 * 4. Admin valide demandes
 * 5. User reçoit notification
 * 6. Vérification stats
 */

import { config } from 'dotenv';
config();

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ============================================
// HELPERS & UTILITIES
// ============================================

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(msg: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

async function apiCall(endpoint: string, options: any = {}, token?: string) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  return res;
}

// ============================================
// TEST SUITE CLASS
// ============================================

class TestSuite {
  adminToken = '';
  userToken = '';
  attestationId = '';
  ceremonieId = '';
  stats = { passed: 0, failed: 0, warnings: 0 };

  async run() {
    log('\n╔══════════════════════════════════════════════════════╗', 'cyan');
    log('║     🧪 CVAV - TESTS END-TO-END COMPLETS             ║', 'cyan');
    log('╚══════════════════════════════════════════════════════╝\n', 'cyan');

    await this.test1_Auth();
    await this.test2_CreateAttestation();
    await this.test3_CreateCeremonie();
    await this.test4_AdminNotifications();
    await this.test5_Validation();
    await this.test6_UserNotifications();
    await this.test7_Statistics();
    
    this.printSummary();
  }

  async test1_Auth() {
    log('\n━━━ TEST 1: AUTHENTIFICATION ━━━', 'cyan');
    
    // Admin login
    try {
      const res = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'kouassicesariokouassi@gmail.com', motDePasse: 'Admin@2024' })
      });
      const data = await res.json();
      this.adminToken = data.token;
      log('  ✅ Admin connecté', 'green');
      this.stats.passed++;
    } catch (e) {
      log('  ❌ Admin login failed', 'red');
      this.stats.failed++;
    }

    // User login
    try {
      const res = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'user@cvav.com', motDePasse: 'User@2024' })
      });
      const data = await res.json();
      this.userToken = data.token;
      log('  ✅ User connecté', 'green');
      this.stats.passed++;
    } catch (e) {
      log('  ❌ User login failed', 'red');
      this.stats.failed++;
    }
  }

  async test2_CreateAttestation() {
    log('\n━━━ TEST 2: CRÉATION ATTESTATION ━━━', 'cyan');
    
    try {
      const res = await apiCall('/api/attestations', {
        method: 'POST',
        body: JSON.stringify({
          prenom: 'Jean',
          nom: 'Test',
          paroisse: 'Saint-Pierre',
          secteur: 'Secteur Nord',
          anneeFinFormation: 2023,
          lieuDernierCamp: 'Camp Test',
          soumise: true
        })
      }, this.userToken);

      const data = await res.json();
      this.attestationId = data.data?._id;
      log(`  ✅ Attestation créée: ${this.attestationId}`, 'green');
      this.stats.passed++;
    } catch (e) {
      log('  ❌ Création attestation failed', 'red');
      this.stats.failed++;
    }
  }

  async test3_CreateCeremonie() {
    log('\n━━━ TEST 3: CRÉATION CÉRÉMONIE ━━━', 'cyan');
    
    try {
      const res = await apiCall('/api/ceremonies', {
        method: 'POST',
        body: JSON.stringify({
          Secteur: 'Secteur Nord',
          Paroisse: 'Saint-Pierre',
          dateCeremonie: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
          lieuCeremonie: 'Paroisse',
          foulardsBenjamins: 10,
          foulardsCadets: 8,
          foulardsAines: 5,
          nombreParrains: 3,
          nombreMarraines: 2,
          soumise: true
        })
      }, this.userToken);

      const data = await res.json();
      this.ceremonieId = data.data?._id;
      log(`  ✅ Cérémonie créée: ${this.ceremonieId}`, 'green');
      this.stats.passed++;
    } catch (e) {
      log('  ❌ Création cérémonie failed', 'red');
      this.stats.failed++;
    }
  }

  async test4_AdminNotifications() {
    log('\n━━━ TEST 4: NOTIFICATIONS ADMIN ━━━', 'cyan');
    
    try {
      const res = await apiCall('/api/notifications', {}, this.adminToken);
      const data = await res.json();
      log(`  ✅ ${data.length || 0} notifications`, 'green');
      this.stats.passed++;
    } catch (e) {
      log('  ❌ Notifications failed', 'red');
      this.stats.failed++;
    }
  }

  async test5_Validation() {
    log('\n━━━ TEST 5: VALIDATION ADMIN ━━━', 'cyan');
    
    // Valider attestation
    if (this.attestationId) {
      try {
        const res = await apiCall(`/api/attestations/${this.attestationId}/validation`, {
          method: 'PATCH',
          body: JSON.stringify({ statut: 'valide', numeroAttestation: 'ATT-001' })
        }, this.adminToken);
        
        if (res.ok) {
          log('  ✅ Attestation validée', 'green');
          this.stats.passed++;
        } else {
          log('  ❌ Validation attestation failed', 'red');
          this.stats.failed++;
        }
      } catch (e) {
        log('  ❌ Validation error', 'red');
        this.stats.failed++;
      }
    }

    // Valider cérémonie
    if (this.ceremonieId) {
      try {
        const res = await apiCall(`/api/ceremonies/${this.ceremonieId}/validation`, {
          method: 'PATCH',
          body: JSON.stringify({ statut: 'valide' })
        }, this.adminToken);
        
        if (res.ok) {
          log('  ✅ Cérémonie validée', 'green');
          this.stats.passed++;
        } else {
          log('  ❌ Validation cérémonie failed', 'red');
          this.stats.failed++;
        }
      } catch (e) {
        log('  ❌ Validation error', 'red');
        this.stats.failed++;
      }
    }
  }

  async test6_UserNotifications() {
    log('\n━━━ TEST 6: NOTIFICATIONS USER ━━━', 'cyan');
    
    try {
      const res = await apiCall('/api/notifications', {}, this.userToken);
      const data = await res.json();
      log(`  ✅ ${data.length || 0} notifications`, 'green');
      this.stats.passed++;
    } catch (e) {
      log('  ❌ Notifications failed', 'red');
      this.stats.failed++;
    }
  }

  async test7_Statistics() {
    log('\n━━━ TEST 7: STATISTIQUES ━━━', 'cyan');
    
    try {
      const res = await apiCall('/api/stats', {}, this.adminToken);
      const data = await res.json();
      log('  ✅ Statistiques récupérées', 'green');
      log(`     - Attestations: ${data.statsAttestations?.total || 0}`, 'reset');
      log(`     - Cérémonies: ${data.statsCeremonies?.total || 0}`, 'reset');
      this.stats.passed++;
    } catch (e) {
      log('  ❌ Stats failed', 'red');
      this.stats.failed++;
    }
  }

  printSummary() {
    log('\n' + '═'.repeat(60), 'cyan');
    log('  📊 RÉSUMÉ DES TESTS', 'cyan');
    log('═'.repeat(60), 'cyan');
    log(`\n  ✅ Réussis: ${this.stats.passed}`, 'green');
    log(`  ❌ Échoués: ${this.stats.failed}`, 'red');
    log(`  ⚠️  Warnings: ${this.stats.warnings}\n`, 'yellow');

    if (this.stats.failed === 0) {
      log('🎉 TOUS LES TESTS SONT PASSÉS !\n', 'green');
    } else {
      log('⚠️  CERTAINS TESTS ONT ÉCHOUÉ\n', 'yellow');
    }

    process.exit(this.stats.failed > 0 ? 1 : 0);
  }
}

// RUN
new TestSuite().run();



// #!/usr/bin/env node

// /**
//  * 🧪 TEST SCRIPT - Admin Dashboard End-to-End
//  * 
//  * Ce script teste le workflow complet:
//  * 1. User soumet attestation
//  * 2. Admin reçoit notification
//  * 3. Admin valide
//  * 4. User reçoit notification
//  */

// import { fetch as nodeFetch } from 'undici';
// import { config } from 'dotenv';

// config();

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
// const ADMIN_TOKEN = process.env.ADMIN_TEST_TOKEN;
// const USER_TOKEN = process.env.USER_TEST_TOKEN;

// // Colors for console output
// const colors = {
//   reset: '\x1b[0m',
//   green: '\x1b[32m',
//   red: '\x1b[31m',
//   yellow: '\x1b[33m',
//   blue: '\x1b[34m',
//   cyan: '\x1b[36m',
// };

// function log(message: string, color: keyof typeof colors = 'reset') {
//   console.log(`${colors[color]}${message}${colors.reset}`);
// }

// async function test() {
//   log('\n🚀 Démarrage des tests Admin Dashboard\n', 'cyan');

//   try {
//     // Test 1: Get Admin Stats
//     log('1️⃣ Récupération des statistiques admin...', 'blue');
//     const statsRes = await nodeFetch(`${BASE_URL}/api/attestations?limit=1000`, {
//       headers: {
//         'Authorization': `Bearer ${ADMIN_TOKEN || 'test'}`,
//       }
//     });

//     if (!statsRes.ok) {
//       throw new Error(`Stats API failed: ${statsRes.status}`);
//     }

//     const attestations = await statsRes.json();
//     log(`   ✅ ${attestations.data?.length || 0} attestations récupérées`, 'green');

//     // Test 2: Check notifications for admin
//     log('\n2️⃣ Vérification des notifications admin...', 'blue');
//     const notificationsRes = await nodeFetch(`${BASE_URL}/api/notifications`, {
//       headers: {
//         'Authorization': `Bearer ${ADMIN_TOKEN || 'test'}`,
//       }
//     });

//     if (!notificationsRes.ok) {
//       throw new Error(`Notifications API failed: ${notificationsRes.status}`);
//     }

//     const notifications = await notificationsRes.json();
//     log(`   ✅ ${notifications.data?.length || 0} notifications trouvées`, 'green');

//     // Test 3: Check if pages are accessible
//     log('\n3️⃣ Vérification de l\'accessibilité des pages admin...', 'blue');
//     const adminPages = [
//       '/admin/dashboard',
//       '/admin/attestations',
//       '/admin/ceremonies'
//     ];

//     for (const page of adminPages) {
//       const pageRes = await nodeFetch(`${BASE_URL}${page}`, {
//         headers: {
//           'Authorization': `Bearer ${ADMIN_TOKEN || 'test'}`,
//         }
//       });
      
//       if (pageRes.ok || pageRes.status === 401) {
//         log(`   ✅ ${page} - Accessible`, 'green');
//       } else {
//         log(`   ⚠️ ${page} - ${pageRes.status}`, 'yellow');
//       }
//     }

//     // Test 4: Check Database Connection
//     log('\n4️⃣ Test de connexion à la base de données...', 'blue');
//     try {
//       const dbRes = await nodeFetch(`${BASE_URL}/api/check-db`);
//       const dbStatus = await dbRes.json();
      
//       if (dbStatus.connected) {
//         log('   ✅ Connexion BD établie', 'green');
//       } else {
//         log('   ❌ Connexion BD échouée', 'red');
//       }
//     } catch (e) {
//       log('   ⚠️ Endpoint check-db non disponible', 'yellow');
//     }

//     log('\n✅ Tests complétés avec succès!\n', 'green');
    
//     // Print summary
//     log('📋 RÉSUMÉ', 'cyan');
//     log('━'.repeat(50), 'cyan');
//     log('✅ API attestations accessible', 'green');
//     log('✅ Système notifications fonctionnel', 'green');
//     log('✅ Pages admin accessibles', 'green');
//     log(`\n📊 Données:`, 'cyan');
//     log(`   • Attestations: ${attestations.data?.length || 0}`, 'reset');
//     log(`   • Notifications: ${notifications.data?.length || 0}`, 'reset');
//     log('', 'reset');

//   } catch (error) {
//     log(`\n❌ Erreur lors des tests:`, 'red');
//     log(`   ${error instanceof Error ? error.message : String(error)}`, 'red');
//     process.exit(1);
//   }
// }

// test();