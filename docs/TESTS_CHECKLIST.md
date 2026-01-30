# 🧪 CHECKLIST DE TESTS - SYSTÈME DE FICHIERS

## Format: [ ] = À tester | [x] = Testé ✅ | [⚠️] = À vérifier en prod

---

## SECTION 1 : UPLOAD DE FICHIERS

### Upload Simple (/api/upload)
- [ ] Upload PDF valide (< 10 MB)
  - Vérifier : fichier apparaît dans `/public/uploads/`
  - Vérifier : BD enregistre `nom`, `nomUnique`, `url`, `type`, `taille`, `uploadePar`
  - Réponse : `{ message: "Fichier uploadé...", fichier: {...} }`

- [ ] Upload JPG/PNG valide
  - Même vérifications que PDF

- [ ] Rejet fichier trop volumineux (> 10 MB)
  - Réponse HTTP : 400
  - Message : "Fichier trop volumineux"

- [ ] Rejet type non supporté (.docx, .txt, .zip)
  - Réponse HTTP : 400
  - Message : "Type de fichier non supporté"

- [ ] Aucun fichier fourni
  - Réponse HTTP : 400
  - Message : "Aucun fichier fourni"

### Upload Admin (/api/fichiers POST)
- [ ] Upload avec permission `uploader_fichiers`
  - Même flux que `/api/upload`
  
- [ ] Rejet sans permission
  - Réponse HTTP : 403
  - Message : "Accès refusé"

- [ ] Rejet non authentifié
  - Réponse HTTP : 401
  - Message : "Non authentifié"

### Unicité des Noms
- [ ] Deux uploads même fichier = deux noms uniques différents
  - Exemple : `1706593200-abc1234.pdf` vs `1706593201-xyz9876.pdf`

- [ ] Nom unique jamais modifié en BD
  - ✅ Attribut `unique: true` en schéma

---

## SECTION 2 : LISTING DES FICHIERS

### GET /api/fichiers
- [ ] Admin : voir TOUS les fichiers
  - Query : `GET /api/fichiers`
  - Réponse : array de tous les fichiers

- [ ] User normal : voir uniquement ses fichiers
  - Query : `GET /api/fichiers`
  - Réponse : array filtrés par `uploadePar: currentUser._id`

- [ ] Pagination fonctionne
  - Query : `GET /api/fichiers?page=2&limit=10`
  - Réponse contient : `pagination: { page, limit, total, pages }`

- [ ] Filtrage par uploader (Admin only)
  - Query : `GET /api/fichiers?uploader=userId`
  - Réponse : fichiers de cet utilisateur uniquement

- [ ] Tri par date décroissante (plus récent d'abord)
  - Vérifier : `createdAt: -1`

- [ ] Non authentifié = rejet
  - Réponse HTTP : 401

---

## SECTION 3 : RÉCUPÉRATION FICHIER

### GET /api/fichiers/[id]
- [ ] Récupérer métadonnées d'un fichier existant
  - Réponse : `{ _id, nom, nomUnique, url, type, taille, uploadePar, createdAt }`

- [ ] Fichier non trouvé
  - Réponse HTTP : 404

- [ ] Permissions : User voit ses fichiers
  - ✅ Autoriser

- [ ] Permissions : User ne voit pas fichiers d'autres
  - ❌ Bloquer avec 403

- [ ] Permissions : Admin voit tous
  - ✅ Autoriser

---

## SECTION 4 : TÉLÉCHARGEMENT RÉEL

### GET /api/fichiers/[id]/download ⭐ NOUVEAU
- [ ] Télécharger fichier PDF valide
  - Headers correct : `Content-Type: application/pdf`
  - Headers correct : `Content-Disposition: attachment; filename=...`
  - Données : flux binaire du fichier

- [ ] Télécharger fichier image valide
  - Headers correct : `Content-Type: image/png` (ou jpeg)
  - Données : flux binaire

- [ ] Fichier non trouvé en BD
  - Réponse HTTP : 404
  - Message : "Fichier non trouvé"

- [ ] Fichier en BD mais absent du disque
  - Réponse HTTP : 404
  - Message : "Fichier non trouvé sur le serveur"

- [ ] Permissions : User télécharge ses fichiers
  - ✅ Autoriser

- [ ] Permissions : User ne peut pas télécharger fichier d'autre
  - ❌ Bloquer avec 403

- [ ] Permissions : Admin télécharge tout
  - ✅ Autoriser

- [ ] Non authentifié = rejet
  - Réponse HTTP : 401

---

## SECTION 5 : MODIFICATION MÉTADONNÉES

### PUT /api/fichiers/[id]
- [ ] Modifier nom d'un fichier
  - Body : `{ "nom": "Nouveau nom" }`
  - Réponse : fichier modifié

- [ ] Tentative modifier sans permission
  - Réponse HTTP : 403
  - Message : "Accès refusé"

- [ ] Fichier non trouvé
  - Réponse HTTP : 404

---

## SECTION 6 : SUPPRESSION COMPLÈTE

### DELETE /api/fichiers/[id] ⭐ NOUVEAU
- [ ] Supprimer fichier existant
  - ✅ Fichier supprimé de `/public/uploads/`
  - ✅ Enregistrement supprimé de BD
  - ✅ Action loggée en BD (`action` collection)
  - Réponse : "Fichier supprimé avec succès"

- [ ] Suppression physique échoue mais BD succède
  - Console : avertissement ⚠️
  - BD : toujours supprimée ✅
  - Réponse : succès (BD = source de vérité)

- [ ] Fichier non trouvé en BD
  - Réponse HTTP : 404

- [ ] Permissions : User supprime ses fichiers
  - ✅ Autoriser

- [ ] Permissions : User ne peut pas supprimer fichier d'autre
  - ❌ Bloquer avec 403

- [ ] Permissions : Admin supprime tout
  - ✅ Autoriser

- [ ] Non authentifié = rejet
  - Réponse HTTP : 401

---

## SECTION 7 : COMPOSANT FILEUPLOAD

### FileUpload.tsx
- [ ] Upload via composant dans formulaire
  - Vérifier : appel à `/api/upload`
  - Toast succès : "Fichier téléchargé avec succès"

- [ ] Upload échoue = afficher erreur
  - Toast error avec message API

- [ ] Affichage fichier uploadé
  - Icône ✅ + nom fichier + bouton supprimer

- [ ] Supprimer fichier de la sélection
  - Bouton ❌ enlève fichier de l'UI
  - `onFileUploaded('')` appelé

- [ ] Validation taille client-side
  - Taille > 5 MB (défaut)
  - Toast : "Le fichier ne doit pas dépasser 5MB"

---

## SECTION 8 : EXPORTS (EXCEL + PDF)

### Page Militants (/dashboard/militants)

#### Bouton "PDF"
- [ ] Clic sur "PDF" lance export
  - Toast : "Préparation de l'export PDF..."
  - Attendre...
  - Toast : "Export PDF terminé"
  - Fichier téléchargé : `Militants_CVAV_2026-01-30.pdf`

- [ ] PDF contient tous les militants visibles
  - En-tête : logo + "CVAV"
  - Tableau : Prénom, Nom, Sexe, Paroisse, Secteur, Grade, Quartier, Tel, Date
  - Pied de page : numéros de page
  - Total : compté correctement

- [ ] Secteurs normalisés dans PDF
  - ✅ "secteur nord" → "Secteur Nord"
  - ✅ Pas de variantes mal formattées

- [ ] Format date cohérent
  - ✅ "30/01/2026" (fr-FR)
  - ❌ Pas de "fr-CD"

#### Bouton "Excel"
- [ ] Clic sur "Excel" lance export
  - Toast : "Préparation de l'export Excel..."
  - Fichier téléchargé : `Militants_CVAV_2026-01-30.xlsx`

- [ ] Excel contient tous les militants
  - Colonnes : Prénom, Nom, Sexe, Paroisse, Secteur, Grade, Quartier, Téléphone, Date ajout
  - Largeurs colonnes ajustées

- [ ] Secteurs normalisés dans Excel
  - ✅ "Secteur Nord" (pas "secteur nord")

- [ ] Format date cohérent
  - ✅ "30/01/2026" (fr-FR)

### Page Statistiques (/dashboard/statistiques)

#### Bouton "Export PDF"
- [ ] Télécharge PDF : `Statistiques_CVAV_2026-01-30.pdf`

- [ ] PDF contient :
  - En-tête : logo + CVAV
  - Métriques : Utilisateurs, Militants, Attestations, Cérémonies
  - Tableau répartition secteurs (normalisés)
  - Tableau top paroisses

- [ ] Secteurs normalisés dans PDF
  - ✅ "Secteur Nord", "Secteur Sud", etc.

---

## SECTION 9 : UTILS CENTRALISÉS

### lib/fileUtils.ts
- [ ] `validateFileType()` accepte les bons types
  - application/pdf, image/jpeg, image/png ✅

- [ ] `validateFileType()` rejette les mauvais types
  - image/gif, application/msword ❌

- [ ] `validateFileSize()` accepte fichiers valides
  - 5 MB ✅

- [ ] `validateFileSize()` rejette fichiers trop gros
  - 15 MB ❌

- [ ] `generateUniqueFileName()` produit noms uniques
  - Appel deux fois = deux noms différents ✅

- [ ] `normalizeSector()` normalise tous les cas
  - 'secteur nord' → 'Secteur Nord' ✅
  - 'SECTEUR NORD' → 'Secteur Nord' ✅
  - 'Secteur Nord' → 'Secteur Nord' ✅
  - undefined → '-' ✅

- [ ] `deletePhysicalFile()` supprime fichier
  - Fichier existe : supprimé ✅
  - Fichier n'existe pas : retourne true (gracieux) ✅

---

## SECTION 10 : SÉCURITÉ

### Authentification
- [ ] Endpoint sans token = rejet 401
  - `GET /api/fichiers`
  - `POST /api/upload`
  - `DELETE /api/fichiers/[id]`

### Permissions
- [ ] User sans `uploader_fichiers` ne peut pas POST
  - Réponse : 403 "Accès refusé"

- [ ] User sans `voir_fichiers` ne peut pas GET
  - Réponse : 403

- [ ] User sans `telecharger_fichiers` ne peut pas télécharger
  - Réponse : 403

- [ ] User sans `supprimer_fichiers` ne peut pas DELETE
  - Réponse : 403

### Isolation des Données
- [ ] User A ne voit pas fichiers User B
  - GET /api/fichiers → filtre par uploadePar

- [ ] User A ne peut pas télécharger fichier User B
  - GET /api/fichiers/[id]/download → vérif permissions

- [ ] User A ne peut pas supprimer fichier User B
  - DELETE /api/fichiers/[id] → vérif permissions

### Noms Uniques
- [ ] Pas de collision entre fichiers
  - `generateUniqueFileName()` utilise timestamp + random

---

## SECTION 11 : LOGS D'AUDIT

### Action Collection
- [ ] Upload loggé
  - `action: "uploader_fichiers"`
  - `donnees: { fichierId, nom, taille }`

- [ ] Modification loggée
  - `action: "modifier_fichier"`

- [ ] Suppression loggée
  - `action: "supprimer_fichiers"`
  - `donnees: { fichierId, nom, nomUnique, taille }`

---

## SECTION 12 : CONSOLE LOGS

### Debugging
- [ ] Upload: `✅ Fichier uploadé: [id] [nom]`
- [ ] Download: `✅ Fichier téléchargé: [id] [nom]`
- [ ] Delete: `✅ Fichier supprimé: [id] [nom]`
- [ ] Delete physique échoue: `⚠️  Suppression physique échouée pour: [nomUnique]`
- [ ] Erreurs: `❌ Erreur upload:`

---

## SECTION 13 : PERFORMANCE

- [ ] Upload 100 MB → timeout (expected, > 10 MB)
- [ ] List 1000 fichiers → réponse rapide (indexed)
- [ ] Download gros fichier → pas de RAM spike (stream)
- [ ] Export 1000 militants PDF → 2-3 secondes

---

## SECTION 14: RÉGRESSION (Vérifier que rien n'a cassé)

- [ ] Page login fonctionne
- [ ] Page militants charge (GET /api/militants)
- [ ] Page statistiques charge (GET /api/stats)
- [ ] Créer militant fonctionne (POST /api/militants)
- [ ] Autres exports (attestations, cérémonies) fonctionne

---

## 📊 RÉSUMÉ

```
Total Tests: 80+
Secteurs Clés:
  ✅ Upload
  ✅ Listing
  ✅ Téléchargement (NEW)
  ✅ Suppression (NEW)
  ✅ Exports
  ✅ Sécurité
  ✅ Logs
  ✅ Regression
```

---

## ⚡ PRIORITÉ

**MUST DO (Avant production):**
1. Test upload/delete complet
2. Test téléchargement des fichiers
3. Test permissions utilisateur
4. Test suppression physique

**SHOULD DO:**
5. Tests exports (PDF + Excel)
6. Tests imports/imports dans formulaires

**NICE TO HAVE:**
7. Tests performance
8. Tests edge cases

---

*Template créé 30 janvier 2026*
*À adapter selon votre environnement de test*
