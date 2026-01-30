# 🔧 GUIDE D'INTÉGRATION - SYSTÈME DE FICHIERS

## Vue Générale des Changements

Ce document explique comment le nouveau système de fichiers s'intègre dans votre application.

---

## 📁 Structure des Fichiers Modifiés

```
cv-av/
├── lib/
│   ├── fileUtils.ts          ← NOUVEAU - Utilitaires centralisés
│   ├── exportPdf.ts          ← MODIFIÉ - Utilise normalizeSector()
│   └── exportMilitants.ts    ← MODIFIÉ - Utilise normalizeSector()
│
├── models/
│   └── fichier.ts            ← MODIFIÉ - Schéma harmonisé
│
├── app/api/
│   ├── upload/
│   │   └── route.ts          ← MODIFIÉ - Utilise fileUtils
│   ├── fichiers/
│   │   ├── routes.ts         ← MODIFIÉ - Harmonisé avec upload
│   │   └── [id]/
│   │       ├── route.ts      ← MODIFIÉ - DELETE physique
│   │       └── download/
│   │           └── route.ts  ← MODIFIÉ - NOUVEAU téléchargement
│
├── app/dashboard/
│   └── militants/
│       └── page.tsx          ← MODIFIÉ - Boutons PDF + Excel
│
├── FICHIERS_IMPORT_EXPORT.md ← NOUVEAU - Docs détaillées
├── RESUME_FICHIERS.md        ← NOUVEAU - Vue exécutive
└── TESTS_CHECKLIST.md        ← NOUVEAU - Suite de tests
```

---

## 🔌 Comment Utiliser le Nouveau Système

### 1. UPLOAD DE FICHIERS

#### Depuis un Composant React
```tsx
import { FileUpload } from '@/components/FileUpload';

export default function MonFormulaire() {
  const handleFileUploaded = (fileId: string) => {
    console.log('Fichier uploadé:', fileId);
    // Enregistrer fileId dans votre formulaire
  };

  return (
    <FileUpload
      label="Choisissez un fichier"
      accept=".pdf,.jpg,.jpeg,.png"
      maxSize={5} // MB
      onFileUploaded={handleFileUploaded}
      required={true}
    />
  );
}
```

#### Directement vers l'API
```javascript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/upload', {
  method: 'POST',
  credentials: 'include',
  body: formData
});

const data = await response.json();
// data.fichier._id = ID du fichier pour la BD
```

---

### 2. LISTER LES FICHIERS

```typescript
// Récupérer les fichiers de l'utilisateur
const res = await fetch('/api/fichiers?page=1&limit=20', {
  credentials: 'include'
});

const { fichiers, pagination } = await res.json();

fichiers.forEach(f => {
  console.log(f.nom); // Nom original
  console.log(f.url);  // /uploads/timestamp-random.pdf
  console.log(f.taille); // en bytes
});
```

---

### 3. TÉLÉCHARGER UN FICHIER

```typescript
// Déclencher le téléchargement
const downloadFile = async (fileId: string) => {
  const res = await fetch(`/api/fichiers/${fileId}/download`, {
    credentials: 'include'
  });
  
  if (!res.ok) throw new Error('Erreur téléchargement');
  
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mon-fichier.pdf'; // Ajuster selon le fichier
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};
```

---

### 4. SUPPRIMER UN FICHIER

```typescript
const deleteFile = async (fileId: string) => {
  const res = await fetch(`/api/fichiers/${fileId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  
  if (res.ok) {
    console.log('Fichier supprimé');
    // Mettre à jour l'UI
  }
};
```

---

### 5. EXPORTER DES DONNÉES

#### Export PDF (Militants)
```typescript
import { exportToPDF } from '@/lib/exportPdf';

const handleExport = async () => {
  try {
    await exportToPDF(militants);
    // PDF téléchargé automatiquement
  } catch (error) {
    console.error('Erreur export:', error);
  }
};
```

#### Export Excel (Militants)
```typescript
import { exportToExcel } from '@/lib/exportMilitants';

const handleExport = () => {
  exportToExcel(militants);
  // Excel téléchargé automatiquement
};
```

#### Export PDF (Statistiques)
```typescript
import { exportStatsToPDF } from '@/lib/exportPdf';

const handleExport = async () => {
  await exportStatsToPDF(stats);
};
```

---

## 🛠️ Utiliser `lib/fileUtils.ts`

### Validation
```typescript
import { 
  validateFileType, 
  validateFileSize,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE
} from '@/lib/fileUtils';

// Vérifier type
if (!validateFileType(file.type)) {
  throw new Error('Type non supporté');
}

// Vérifier taille (defaut 10MB)
if (!validateFileSize(file.size)) {
  throw new Error('Fichier trop volumineux');
}

// Valeurs constantes
console.log(ALLOWED_MIME_TYPES); // ['application/pdf', 'image/jpeg', ...]
console.log(MAX_FILE_SIZE); // 10485760 bytes = 10 MB
```

### Génération Noms
```typescript
import { generateUniqueFileName } from '@/lib/fileUtils';

const originalName = 'mon-fichier.pdf';
const uniqueName = generateUniqueFileName(originalName);
// Result: '1706593200-abc1234.pdf'

// Jamais de collision !
generateUniqueFileName(originalName); // '1706593201-xyz9876.pdf'
```

### Chemins de Fichiers
```typescript
import { 
  getUploadDir,
  getFilePath,
  getFileUrl
} from '@/lib/fileUtils';

const dir = getUploadDir();
// Result: '/home/user/project/public/uploads'

const path = getFilePath('1706593200-abc1234.pdf');
// Result: '/home/user/project/public/uploads/1706593200-abc1234.pdf'

const url = getFileUrl('1706593200-abc1234.pdf');
// Result: '/uploads/1706593200-abc1234.pdf'
```

### Normalisation Secteurs
```typescript
import { normalizeSector } from '@/lib/fileUtils';

normalizeSector('secteur nord');    // 'Secteur Nord'
normalizeSector('SECTEUR SUD');     // 'Secteur Sud'
normalizeSector('Secteur Est');     // 'Secteur Est'
normalizeSector(undefined);         // '-'
normalizeSector('');                // '-'
```

### Suppression Physique
```typescript
import { deletePhysicalFile } from '@/lib/fileUtils';

const success = await deletePhysicalFile('1706593200-abc1234.pdf');
if (success) {
  console.log('Fichier supprimé');
} else {
  console.warn('Erreur suppression');
}
// Note: Retourne toujours true ou false, jamais throw
```

---

## 🔐 Vérifier les Permissions

Le système utilise `voirPermission()` avec ces permutations :
- `uploader_fichiers` - Pouvoir uploader
- `voir_fichiers` - Lister les fichiers
- `telecharger_fichiers` - Télécharger
- `modifier_fichier` - Modifier métadonnées
- `supprimer_fichiers` - Supprimer

À vérifier dans votre système de rôles !

```typescript
// Dans vos API routes
import { voirPermission } from '@/utils/permission';

if (!voirPermission(currentUser, "uploader_fichiers")) {
  return NextResponse.json({ message: "Accès refusé" }, { status: 403 });
}
```

---

## 📊 Schéma Fichier (MongoDB)

```javascript
{
  _id: ObjectId,
  nom: String,              // Nom original donné par l'utilisateur
  nomUnique: String,        // Unique : timestamp-random.ext
  url: String,              // /uploads/timestamp-random.ext
  type: String,             // MIME type: application/pdf, image/jpeg, etc.
  taille: Number,           // Bytes
  uploadePar: ObjectId,     // Référence à Utilisateur
  createdAt: Date,          // Automatique
  updatedAt: Date           // Automatique
}
```

**Indexes:**
```javascript
{ uploadePar: 1, createdAt: -1 }  // Pour filtrer par user
{ nomUnique: 1 }                   // Pour éviter duplicatas
{ createdAt: -1 }                  // Pour tri chronologique
```

---

## 🚀 Passage à Production

### 1. Vérifier les Dossiers
```bash
# Créer le dossier uploads s'il n'existe pas
mkdir -p public/uploads

# Permissions correctes
chmod 755 public/uploads
```

### 2. Vérifier les Limites
```typescript
// Dans next.config.ts
module.exports = {
  // Augmenter si besoin pour uploads
  pageExtensions: ['ts', 'tsx'],
};

// Dans votre API (déjà fait)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
```

### 3. Backup Plan
Avant déploiement :
```bash
# Sauvegarder la BD
mongodump --db cv-av --out ./backup

# Sauvegarder les fichiers
cp -r public/uploads public/uploads.backup
```

### 4. Migration Future vers S3
Quand vous changerez de stockage :
```typescript
// Modifier seulement ces fonctions dans lib/fileUtils.ts
export async function saveToStorage(buffer, filename) {
  // Actuellement: writeFile(filepath, buffer)
  // À l'avenir: await s3.upload({ Key: filename, Body: buffer })
}

export async function deleteFromStorage(filename) {
  // Actuellement: unlink(filepath)
  // À l'avenir: await s3.deleteObject({ Key: filename })
}

// Toutes les APIs restent identiques !
```

---

## 📈 Monitoring Recommandé

### Logs à Vérifier
```bash
# Uploads
tail -f logs/upload.log | grep "✅ Fichier uploadé"

# Téléchargements
tail -f logs/download.log | grep "✅ Fichier téléchargé"

# Erreurs
tail -f logs/errors.log | grep "❌"
```

### Métriques
- Nombre fichiers uploadés par jour
- Taille totale utilisée `/public/uploads`
- Taux d'erreur upload/download
- Temps moyen téléchargement

```sql
-- MongoDB Aggregation
db.Fichier.aggregate([
  { $group: {
    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    count: { $sum: 1 },
    totalSize: { $sum: "$taille" }
  }},
  { $sort: { _id: -1 }},
  { $limit: 30 }
])
```

---

## ⚠️ Problèmes Courants & Solutions

### "Fichier non trouvé sur le serveur"
**Cause:** BD dit que le fichier existe mais pas sur disque
**Solution:** 
```bash
# Vérifier /public/uploads/
ls -la public/uploads/

# Vérifier permissions
chmod 755 public/uploads/
```

### "Fichier trop volumineux"
**Cause:** Fichier > 10 MB
**Solution:** 
- Augmenter `MAX_FILE_SIZE` dans `lib/fileUtils.ts`
- OU demander à l'utilisateur de compresser

### "Type de fichier non supporté"
**Cause:** Extension non dans `ALLOWED_MIME_TYPES`
**Solution:** 
- Ajouter type à `lib/fileUtils.ts`
- Vérifier le vrai MIME type du fichier

### "Accès refusé (403)"
**Cause:** Permissions manquantes
**Solution:**
- Vérifier le rôle de l'utilisateur
- Vérifier les permissions du rôle
- Vérifier `voirPermission()` retourne true

---

## 🔄 Flux Complet - Exemple Réel

### Scénario: Utilisateur upload et télécharge un PDF

```
1. USER INTERFACE
   ↓
   FileUpload.tsx
   └─ User sélectionne mon-rapport.pdf

2. VALIDATION CLIENT
   ├─ Type supporté ? (PDF) ✅
   └─ Taille < 5 MB ? ✅

3. UPLOAD
   ├─ POST /api/upload avec FormData
   ├─ Serveur:
   │  ├─ Authentification ✅
   │  ├─ validateFileType(application/pdf) ✅
   │  ├─ validateFileSize(500KB) ✅
   │  ├─ generateUniqueFileName('mon-rapport.pdf')
   │  │  → '1706593200-abc1234.pdf'
   │  ├─ writeFile('/uploads/1706593200-abc1234.pdf', buffer)
   │  ├─ Fichier.create({
   │  │    nom: 'mon-rapport.pdf',
   │  │    nomUnique: '1706593200-abc1234.pdf',
   │  │    url: '/uploads/1706593200-abc1234.pdf',
   │  │    type: 'application/pdf',
   │  │    taille: 512000,
   │  │    uploadePar: userId
   │  │  })
   │  └─ action.create({ action: 'uploader_fichiers', ... })
   └─ Response: { fichier: { _id: '...' } }

4. AFFICHAGE
   ├─ FileUpload show: nom + ✅ icon
   └─ Form enregistre fileId

5. TÉLÉCHARGEMENT ULTÉRIEUR
   ├─ GET /api/fichiers/[fileId]/download
   ├─ Serveur:
   │  ├─ Authentification ✅
   │  ├─ Vérifier permissions ✅
   │  ├─ Chercher en BD → trouvé ✅
   │  ├─ readFile('/uploads/1706593200-abc1234.pdf')
   │  └─ Stream avec headers
   │     Content-Type: application/pdf
   │     Content-Disposition: attachment; filename=mon-rapport.pdf
   └─ Browser: lance téléchargement ✅

6. SUPPRESSION
   ├─ DELETE /api/fichiers/[fileId]
   ├─ Serveur:
   │  ├─ Authentification ✅
   │  ├─ Vérifier permissions ✅
   │  ├─ deletePhysicalFile('1706593200-abc1234.pdf')
   │  │  → unlink('/uploads/1706593200-abc1234.pdf')
   │  ├─ Fichier.findByIdAndDelete(fileId)
   │  └─ action.create({ action: 'supprimer_fichiers', ... })
   └─ Response: "Fichier supprimé"

7. VÉRIFICATION
   ├─ Fichier n'existe plus sur disque ✅
   └─ BD n'a plus d'enregistrement ✅
```

---

## 📚 Références Rapides

| Besoin | Fonction | Fichier |
|--------|----------|---------|
| Upload | POST /api/upload | app/api/upload/route.ts |
| List | GET /api/fichiers | app/api/fichiers/routes.ts |
| Details | GET /api/fichiers/[id] | app/api/fichiers/[id]/route.ts |
| Download | GET /api/fichiers/[id]/download | app/api/fichiers/[id]/download/route.ts |
| Modify | PUT /api/fichiers/[id] | app/api/fichiers/[id]/route.ts |
| Delete | DELETE /api/fichiers/[id] | app/api/fichiers/[id]/route.ts |
| Validation | lib/fileUtils.ts | Tous |
| Export PDF | lib/exportPdf.ts | app/dashboard/militants/page.tsx |
| Export Excel | lib/exportMilitants.ts | app/dashboard/militants/page.tsx |

---

## ✅ Checklist Intégration

- [ ] Lire FICHIERS_IMPORT_EXPORT.md
- [ ] Lire RESUME_FICHIERS.md
- [ ] Lire ce document (INTEGRATION.md)
- [ ] Exécuter TESTS_CHECKLIST.md
- [ ] Vérifier les dossiers `/public/uploads/`
- [ ] Vérifier permissions MongoDB
- [ ] Tester upload/download/delete localement
- [ ] Tester exports (PDF + Excel)
- [ ] Déployer en staging
- [ ] Valider en production
- [ ] Documenter pour l'équipe

---

*Document créé 30 janvier 2026*
*Système production-ready* ✅
