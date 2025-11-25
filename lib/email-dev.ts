export async function sendEmail({ to, subject, html }: any) {
  console.log('📧 EMAIL SIMULÉ :');
  console.log('À :', to);
  console.log('Sujet :', subject);
  console.log('Contenu :', html.replace(/<[^>]*>/g, ''));
  console.log('---');
  
  return { success: true, messageId: 'simulated-' + Date.now() };
}

export const emailTemplates = {
    welcomeUser: (user: { prenom: string; email: string; motDePasseTemporaire: string }) => ({
    subject: 'Bienvenue sur la plateforme - Vos identifiants',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Bienvenue ${user.prenom} !</h2>
        <p>Votre compte a été créé avec succès sur notre plateforme.</p>
        
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Vos identifiants :</h3>
          <p><strong>Email :</strong> ${user.email}</p>
          <p><strong>Mot de passe temporaire :</strong> ${user.motDePasseTemporaire}</p>
        </div>
        
        <p><strong>Important :</strong> Vous devrez changer votre mot de passe lors de votre première connexion.</p>
        
        <a href="${process.env.FRONTEND_URL}/login" 
           style="background: #2563eb; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Se connecter
        </a>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
        </p>
      </div>
    `
  }),

  // Email de réinitialisation de mot de passe
  passwordReset: (user: { prenom: string; motDePasseTemporaire: string }) => ({
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Réinitialisation de mot de passe</h2>
        <p>Bonjour ${user.prenom},</p>
        
        <p>Votre demande de réinitialisation de mot de passe a été approuvée par l'administrateur.</p>
        
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Votre mot de passe temporaire :</h3>
          <p style="font-size: 18px; font-weight: bold; text-align: center;">${user.motDePasseTemporaire}</p>
        </div>
        
        <p><strong>Sécurité :</strong> Vous devrez changer ce mot de passe immédiatement après votre connexion.</p>
        
        <a href="${process.env.FRONTEND_URL}/login" 
           style="background: #2563eb; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Se connecter maintenant
        </a>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Si vous n'êtes pas à l'origine de cette demande, contactez immédiatement l'administrateur.
        </p>
      </div>
    `
  }),

  // Notification de nouvelle demande
  newRequestAdmin: (request: { type: string; user: string; date: string }) => ({
    subject: `Nouvelle demande ${request.type} en attente`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nouvelle demande ${request.type}</h2>
        <p>Une nouvelle demande nécessite votre attention.</p>
        
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Utilisateur :</strong> ${request.user}</p>
          <p><strong>Date de soumission :</strong> ${request.date}</p>
          <p><strong>Type :</strong> ${request.type}</p>
        </div>
        
        <a href="${process.env.FRONTEND_URL}/admin/${request.type}s" 
           style="background: #2563eb; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Voir les demandes
        </a>
      </div>
    `
  })
};