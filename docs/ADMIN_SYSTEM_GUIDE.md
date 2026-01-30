# Architecture Fichiers & Système Admin - Guide Complet

## 📁 Où sont stockés les fichiers soumis

### Stockage physique (serveur)
```
c:\Users\cesar\Documents\cv-av\public\uploads\
├── 1706593200-abc1234.pdf      (Bulletin scanné)
├── 1706593200-def5678.jpg      (Photo)
├── 1706593200-ghi9012.png      (Capture écran)
└── ...
```

**Règles de nommage:**
- Format: `{timestamp}-{randomString}.{ext}`
- Exemple: `1706593200-abc1234.pdf`
- Empêche les collisions et les surcharges
- Timestamps permettent le tri chronologique

### Accès via API/URL
```
GET /api/fichiers/{id}/download
↓ Envoie le fichier physique avec les bons headers
Content-Disposition: attachment; filename={nomOriginal}
```

### Structure BD (MongoDB)
```
Fichier
├── _id: ObjectId
├── nom: "bulletin.pdf"              (nom original, fourni par l'utilisateur)
├── nomUnique: "1706593200-abc1234"  (identifiant unique, sans extension)
├── url: "/uploads/1706593200-abc1234.pdf"
├── type: "application/pdf"
├── taille: 245632                   (bytes)
├── uploadePar: {userId}             (qui a uploader)
├── createdAt: 2024-01-30T10:30:00Z
└── updatedAt: 2024-01-30T10:30:00Z
```

---

## 📨 Notifications Admin

### Quand l'admin est notifié

#### 1️⃣ Création de brouillon (pas de notif)
```typescript
POST /api/attestations { soumise: false }
// ❌ Admin N'EST PAS notifié
```

#### 2️⃣ Soumission de demande (notif créée)
```typescript
POST /api/attestations { soumise: true, bulletinScanne: "fichier123" }
// ✅ Admin EST notifié
Notification créée:
{
  utilisateur: {adminId},
  titre: "Nouvelle demande d'attestation",
  message: "Jean Dupont a soumis une demande pour Paul Martin",
  lien: "/admin/attestations/{demandeId}",
  type: "info"
}
```

#### 3️⃣ Email à l'admin (optionnel)
```typescript
sendEmail({
  to: admin.email,
  subject: "Nouvelle demande d'attestation",
  template: "newRequestAdmin"
})
```

### Accès aux notifs
```
Admin Dashboard → 🔔 Notifications
→ Clic sur notif
→ Redirige vers /admin/attestations/{id}/valider
```

---

## 👨‍💼 Dashboard Admin vs Utilisateur Normal

### Routes Différentes

#### Utilisateur Normal
```
/dashboard/attestations           → Voir ses brouillons + soumises
/dashboard/attestations/creer     → Créer nouvelle attestation
/dashboard/attestations/{id}      → Voir détails (lecture seule)
/api/attestations                 → Filtre: utilisateur: currentUser._id
```

#### Admin
```
/admin/attestations               → Voir TOUTES les demandes soumises
/admin/attestations/{id}/valider  → Formulaire validation/rejet
/admin/attestations/{id}/modifier → Modifier avant validation
/api/attestations?view=soumises   → Filtre: soumise: true (toutes)
```

### Différences Clés

| Feature | Utilisateur | Admin |
|---------|-------------|-------|
| Voir ses brouillons | ✅ | ❌ |
| Voir ses soumises | ✅ | ❌ |
| Voir toutes les demandes soumises | ❌ | ✅ |
| Modifier ses brouillons | ✅ | ❌ |
| Valider/Rejeter demandes | ❌ | ✅ |
| Modifier détails avant validation | ❌ | ✅ |
| Consulter fichiers associés | ✅ (siens) | ✅ (tous) |
| Exporter rapports | ❌ | ✅ |

---

## 🖼️ Comment Admin Voit les Fichiers

### Visualisation des Fichiers

```
/admin/attestations/{demandeId}/valider
│
├── 📄 Détails demande
│   ├── Prénom: Paul
│   ├── Nom: Martin
│   └── Paroisse: Saint-Pierre
│
├── 📎 Fichiers attachés
│   ├── 📄 Bulletin scanné
│   │   ├── Nom: bulletin.pdf
│   │   ├── Taille: 245 KB
│   │   ├── 🔍 Aperçu (embeds PDF dans iframe)
│   │   └── ⬇️ Télécharger
│   │
│   ├── 🖼️ Photo justificative
│   │   ├── Nom: photo.jpg
│   │   ├── 🔍 Aperçu (image inline)
│   │   └── ⬇️ Télécharger
│   │
│   └── 📸 Autre document
│       ├── Nom: document.png
│       └── ⬇️ Télécharger
│
└── ⚙️ Actions
    ├── ✅ Valider (attribuer N° attestation)
    ├── ❌ Rejeter (motif requis)
    └── 💾 Sauvegarder modifications
```

### Types de fichiers gérés

| Type | Extension | Affichage | Accès |
|------|-----------|-----------|-------|
| PDF | .pdf | iFrame PDF viewer | download |
| Image JPEG | .jpg, .jpeg | `<img src>` | download |
| Image PNG | .png | `<img src>` | download |

### Code pour afficher les fichiers

```typescript
// Dans /admin/attestations/{id}/valider
if (file.type === 'application/pdf') {
  return <iframe src={`/api/fichiers/${file._id}/download`} />;
} else if (file.type.startsWith('image/')) {
  return <img src={`/api/fichiers/${file._id}/download`} alt={file.nom} />;
}
```

---

## 🔀 Sidebar avec Affichage Différencié

### Layout Actuel (Non-Admin)

```
Dashboard
├── Attestations          → /dashboard/attestations
├── Cérémonies           → /dashboard/ceremonies
├── Militants            → /dashboard/militants
└── Statistiques         → /dashboard/statistiques
```

### Layout Admin (Nouveau)

```
Admin Dashboard
├── Attestations (Validation)  → /admin/attestations
├── Cérémonies (Validation)    → /admin/ceremonies
├── Militants                  → /dashboard/militants
├── Statistiques               → /dashboard/statistiques
├── Notifications              → /dashboard/notifications
└── Gestion Utilisateurs       → /admin/utilisateurs
```

### Code Sidebar avec Distinction

```typescript
export function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role?.nom === 'Admin';

  return (
    <nav>
      {isAdmin ? (
        <>
          <Link href="/admin/attestations">
            📋 Attestations (Validation)
          </Link>
          <Link href="/admin/ceremonies">
            🎉 Cérémonies (Validation)
          </Link>
          <Link href="/admin/utilisateurs">
            👥 Gestion Utilisateurs
          </Link>
        </>
      ) : (
        <>
          <Link href="/dashboard/attestations">
            📋 Mes Attestations
          </Link>
          <Link href="/dashboard/ceremonies">
            🎉 Mes Cérémonies
          </Link>
        </>
      )}
    </nav>
  );
}
```

---

## 📊 Flux Complet : Utilisateur → Admin → Validation

```
┌─ UTILISATEUR ──────────────────────────────────────┐
│                                                    │
│ 1. Crée brouillon (private, non sauvegardé)       │
│    POST /api/attestations { soumise: false }      │
│                                                    │
│ 2. Ajoute fichiers (PDF/JPG/PNG)                  │
│    POST /api/upload                               │
│    ✅ Stockés dans: /public/uploads/              │
│                                                    │
│ 3. Soumet la demande                              │
│    PUT /api/attestations/{id}                     │
│    { soumise: true, bulletinScanne: "file123" }  │
└────────────────────────────────────────────────────┘
                        ↓
        📨 Email + Notification créée
        ✉️ To: admin@example.com
        🔔 Notification: "Nouvelle demande de Paul M."
                        ↓
┌─ ADMIN ────────────────────────────────────────┐
│                                                │
│ 1. Voit notif dans /dashboard/notifications   │
│                                                │
│ 2. Clique → Redirige à /admin/attestations/id │
│                                                │
│ 3. Voit:                                       │
│    • Détails demande (prénom, nom, secteur)   │
│    • Fichiers associés:                        │
│      - 📄 bulletin.pdf (aperçu PDF)           │
│      - 🖼️ photo.jpg (image inline)            │
│      - 📸 document.png (téléchargeable)       │
│                                                │
│ 4. Actions:                                    │
│    ✅ Valider → Attribue N° attestation       │
│    ❌ Rejeter → Motif obligatoire              │
│    ✏️ Modifier → Change détails avant validat  │
│                                                │
│ 5. Sauvegarde → Notif envoyée à utilisateur   │
└────────────────────────────────────────────────┘
                        ↓
┌─ UTILISATEUR ──────────────────────────────────┐
│                                                │
│ Reçoit notification:                           │
│ ✅ "Attestation validée N°ATT-2024-001"       │
│    Peut télécharger le PDF final               │
│ ou                                             │
│ ❌ "Attestation rejetée: fichier manquant"    │
│    Peut corriger et soumettre à nouveau       │
└────────────────────────────────────────────────┘
```

---

## 🗄️ Structure BD avec Fichiers

### Dépendances d'Objets

```
Utilisateur
└── DemandeAttestation
    ├── bulletinScanne: Fichier._id  (optionnel pour brouillon)
    └── fichierAttestationPDF: Fichier._id (créé après validation)

Fichier
├── uploadePar: Utilisateur._id
├── nom: "bulletin.pdf"
├── nomUnique: "1706593200-abc1234"
├── type: "application/pdf"
└── url: "/uploads/1706593200-abc1234.pdf"
```

### Permissions d'Accès Fichier

```typescript
// User voit un fichier si:
1. Il l'a uploadé (uploadePar: user._id) OU
2. C'est un admin

// Admin voit tous les fichiers associés aux demandes soumises
GET /api/attestations?view=soumises
→ Récupère toutes les demandes
→ Accède aux fichiers via demande.bulletinScanne._id
```

---

## ✅ Checklist Implémentation

- [ ] Créer `/admin/attestations` page (listage demandes soumises)
- [ ] Créer `/admin/attestations/{id}/valider` page (formulaire validation)
- [ ] Créer `/admin/ceremonies/{id}/valider` page
- [ ] Mettre à jour sidebar pour montrer routes différentes par rôle
- [ ] Ajouter visualisation PDF/images dans page de validation
- [ ] Email notification à admin quand demande soumise
- [ ] Notification email à utilisateur quand demande validée/rejetée
- [ ] API: Récupérer fichiers associés à une demande
- [ ] API: Permission vérification (admin only pour /admin/*)
- [ ] Tests d'intégration: flux complet soumission → validation

---

## 🔐 Sécurité

### Qui peut accéder aux fichiers

```typescript
// GET /api/fichiers/{id}
if (user.role === 'Admin') {
  // ✅ Voir tout fichier
} else if (fichier.uploadePar === user._id) {
  // ✅ Voir son propre fichier
} else {
  // ❌ Accès refusé
}
```

### Qui peut voir les demandes

```typescript
// GET /api/attestations
if (user.role === 'Admin') {
  filtre = { soumise: true } // Voir toutes soumises
} else {
  filtre = { utilisateur: user._id } // Voir les siennes
}
```
