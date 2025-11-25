import { sendEmail, emailTemplates } from '@/lib/email';

async function testEmailSystem() {
  console.log('🚀 Début des tests du système email...\n');

  // Test 1: Email de bienvenue
  console.log('1. Testing email de bienvenue...');
  const test1 = await sendEmail({
    to: 'test@example.com',
    ...emailTemplates.welcomeUser({
      prenom: 'Jean',
      email: 'jean@example.com',
      motDePasseTemporaire: 'AzErTy123'
    })
  });
  console.log('✅ Email bienvenue:', test1.success);
  if ('previewUrl' in test1 && test1.previewUrl) console.log('📧 Preview:', test1.previewUrl);

  // Test 2: Email reset password
  console.log('\n2. Testing email reset password...');
  const test2 = await sendEmail({
    to: 'test@example.com',
    ...emailTemplates.passwordReset({
      prenom: 'Marie',
      motDePasseTemporaire: 'XyZ987!'
    })
  });
  console.log('✅ Email reset:', test2.success);
  if ('previewUrl' in test2 && test2.previewUrl) console.log('📧 Preview:', test2.previewUrl);

  // Test 3: Email notification admin
  console.log('\n3. Testing email notification admin...');
  const test3 = await sendEmail({
    to: 'admin@example.com',
    ...emailTemplates.newRequestAdmin({
      type: 'cérémonie',
      user: 'Pierre Dupont',
      date: new Date().toLocaleDateString('fr-FR'),
      url: 'http://localhost:3000/admin/ceremonies'
    })
  });
  console.log('✅ Email notification:', test3.success);
  if ('previewUrl' in test3 && test3.previewUrl) console.log('📧 Preview:', test3.previewUrl);

  console.log('\n🎉 Tests email terminés!');
  console.log('📋 Résumé:');
  console.log('   - Bienvenue:', test1.success ? '✅' : '❌');
  console.log('   - Reset:', test2.success ? '✅' : '❌');
  console.log('   - Notification:', test3.success ? '✅' : '❌');

  if (('previewUrl' in test1 && test1.previewUrl) || ('previewUrl' in test2 && test2.previewUrl) || ('previewUrl' in test3 && test3.previewUrl)) {
    console.log('\n🔗 Liens de preview disponibles ci-dessus');
    console.log('💡 En développement, les emails sont envoyés vers Ethereal Email');
    console.log('🌐 Connectez-vous à https://ethereal.email/ pour voir les emails');
  }
}

// Exécuter les tests
testEmailSystem().catch(console.error);