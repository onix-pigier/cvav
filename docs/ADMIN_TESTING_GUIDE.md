# 🧪 Guide de Test - Admin Dashboard

## 📋 Vue d'ensemble

Ce guide explique comment tester le système complet d'administration pour les attestations et cérémonies.

## ✅ Checklist de Test Manuel

### 1️⃣ Authentification Admin

- [ ] Se connecter avec un compte admin
- [ ] Vérifier que le rôle est "Admin"
- [ ] Vérifier l'accès au dashboard admin

### 2️⃣ Accès aux Pages

#### Dashboard
- [ ] Accéder à `/dashboard/admin` ou `/admin/dashboard`
- [ ] Voir les statistiques des attestations (Total, En Attente, Validées, Rejetées)
- [ ] Voir les statistiques des cérémonies
- [ ] Cliquer sur une stat → redirection vers la liste filtrée

#### Attestations
- [ ] Accéder à `/admin/attestations`
- [ ] Voir la liste des attestations soumises
- [ ] Voir les statistiques en haut (cards colorées)
- [ ] Filtrer par statut (En attente, Validées, Rejetées)
- [ ] Cliquer sur une card stat → filtrage automatique
- [ ] Cliquer sur une attestation → voir détails + visualisation fichier

#### Cérémonies
- [ ] Même test qu'attestations mais pour `/admin/ceremonies`

### 3️⃣ Processus de Validation - Attestation

**Prérequis**: Une attestation "en_attente" doit exister

- [ ] Accéder à `/admin/attestations`
- [ ] Cliquer sur attestation avec statut "⏳ En attente"
- [ ] Vérifier affichage du fichier PDF/image
- [ ] Entrer un "Numéro d'attestation" (ex: "ATT-2026-001")
- [ ] Cliquer "Valider"
- [ ] Vérifier le message de succès
- [ ] Vérifier que le statut change à "✅ Validée"
- [ ] **Vérifier que l'utilisateur reçoit une notification** (voir section Notifications)
- [ ] **Vérifier que l'utilisateur reçoit un email** (voir section Emails)

### 4️⃣ Processus de Rejet - Attestation

**Prérequis**: Une attestation "en_attente" doit exister

- [ ] Accéder à `/admin/attestations`
- [ ] Cliquer sur attestation avec statut "⏳ En attente"
- [ ] Cliquer "Rejeter"
- [ ] Entrer un motif (ex: "Bulletin incomplet")
- [ ] Cliquer "Confirmer rejet"
- [ ] Vérifier le message de succès
- [ ] Vérifier que le statut change à "❌ Rejetée"
- [ ] **Vérifier que l'utilisateur reçoit une notification** avec le motif
- [ ] **Vérifier que l'utilisateur reçoit un email** avec le motif

### 5️⃣ Notifications Admin

**Prérequis**: Être connecté en tant qu'admin

Quand un utilisateur **soumet** une demande:
- [ ] Admin voit une notification "info" dans le dashboard
- [ ] Admin reçoit un email de notification

Quand admin **valide**:
- [ ] Utilisateur voit notification "succes"
- [ ] Notification contient le numéro d'attestation

Quand admin **rejette**:
- [ ] Utilisateur voit notification "erreur"
- [ ] Notification contient le motif du rejet

### 6️⃣ Visualisation des Fichiers

- [ ] Attestation avec PDF → affiche en iframe
- [ ] Attestation avec PNG/JPG → affiche en img
- [ ] Fichier absent → message "Fichier non disponible"
- [ ] Cliquer "Télécharger" → télécharge le fichier

### 7️⃣ Permissions & Sécurité

#### Accès Admin
- [ ] Admin voit `/admin/attestations` ✅
- [ ] Admin voit `/admin/ceremonies` ✅
- [ ] Admin voit statistiques ✅

#### Accès Non-Admin
- [ ] Non-admin accède `/admin/attestations` → redirection `/403`
- [ ] Non-admin accède `/admin/ceremonies` → redirection `/403`

#### Restrictions de Modification
- [ ] Admin ne peut valider une attestation "validée"
- [ ] Admin ne peut valider si "numéro d'attestation" manquant
- [ ] Admin ne peut rejeter si "motif" manquant

### 8️⃣ Pagination & Performance

- [ ] Lister 50+ attestations → pagination correcte
- [ ] Filtres rapides (< 1s)
- [ ] Aucune erreur console

---

## 🔧 Tests Automatisés

### Command
```bash
npm run test:admin-dashboard
```

### Ou Manual
```bash
npx ts-node scripts/test-admin-dashboard.ts
```

### Résultat attendu
```
✅ Tests complétés avec succès!
✅ API attestations accessible
✅ Système notifications fonctionnel
✅ Pages admin accessibles
```

---

## 📊 Test de Charge

Pour tester avec plusieurs demandes:

```bash
# Créer 10 attestations de test
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/attestations \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"prenom":"Test","nom":"User'$i'","paroisse":"Paroisse","secteur":"Secteur","anneeFinFormation":2020,"lieuDernierCamp":"Camp"}'
done
```

---

## 🐛 Troubleshooting

### Problème: Les notifications admin ne s'affichent pas

**Solution**:
1. Vérifier que l'utilisateur a le rôle "Admin"
2. Vérifier la section `API attestations/ceremonies route.ts` ligne 420+
3. S'assurer que `Notification.create()` est appelé

### Problème: Les pages ne chargent pas

**Solution**:
1. Vérifier authentification (token JWT valide)
2. Vérifier base de données connectée
3. Voir console pour erreurs

### Problème: Les stats sont incorrectes

**Solution**:
1. Vérifier les filtres (soumise=true)
2. Vérifier le statut des demandes
3. Recharger la page

---

## 📈 Métriques de Succès

- ✅ 0 erreurs TypeScript
- ✅ 100% des pages admin accessibles
- ✅ Notifications envoyées < 1s après action
- ✅ Emails envoyés avec succès
- ✅ Pas de fuite de données (non-admin ne peut pas voir)
- ✅ Performance < 500ms par page

---

## 📝 Notes

- Les notifications admin sont de type "info"
- Les notifications utilisateur sont "succes" ou "erreur"
- Les emails utilisent le template `newRequestAdmin` pour admins
- Les fichiers sont stockés dans `/public/uploads/`

