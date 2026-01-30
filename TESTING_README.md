# 🧪 Admin Dashboard - Testing & Verification

## Quick Reference

| Tâche | Commande | Temps |
|-------|----------|-------|
| Tests rapides | `bash scripts/test-admin-quick.sh` | 2 min |
| Tests auto | `npm run test:admin-dashboard` | 5 min |
| Tests manuels | Voir checklist ci-dessous | 30 min |
| Vérifier TypeScript | `npx tsc --noEmit` | 1 min |

---

## ⚡ Quick Start (5 minutes)

### 1. Vérifier que le serveur tourne
```bash
curl http://localhost:3000/api/check-db
# Résultat attendu: {"connected": true}
```

### 2. Tester les pages admin (sans auth)
```bash
# Ces URLs vont rediriger vers login si non authentifié
curl http://localhost:3000/admin
curl http://localhost:3000/admin/dashboard
curl http://localhost:3000/admin/attestations
curl http://localhost:3000/admin/ceremonies
```

### 3. Vérifier TypeScript
```bash
npx tsc --noEmit
# Résultat attendu: 0 errors
```

---

## ✅ Test Checklist - 30 minutes

### Setup (5 min)
- [ ] Serveur démarré (`npm run dev`)
- [ ] Base de données connectée (`npx tsx scripts/test-db.ts`)
- [ ] Compte admin existant

### Pages Admin (10 min)
- [ ] `/admin` charge
- [ ] `/admin/dashboard` affiche les stats
- [ ] `/admin/attestations` affiche la liste
- [ ] `/admin/ceremonies` affiche la liste
- [ ] Layout admin visible (header + footer)

### Workflow Attestation (8 min)
1. Trouver une attestation avec `statut: "en_attente"`
2. Cliquer dessus
3. Voir le formulaire de validation
4. Entrer un "Numéro d'attestation"
5. Cliquer "Valider"
6. Vérifier le message de succès
7. Vérifier le statut change

### Workflow Rejet (5 min)
1. Trouver une autre attestation "en_attente"
2. Cliquer "Rejeter"
3. Entrer un motif
4. Confirmer
5. Vérifier le message de succès

### Notifications (2 min)
- [ ] Admin voit notification après soumission user
- [ ] User voit notification après validation admin
- [ ] User voit notification après rejet admin

---

## 🔬 Test Détaillé par Composant

### Admin Dashboard Stats
```bash
# Devrait retourner une liste d'attestations
curl "http://localhost:3000/api/attestations?limit=1000" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Vérifier les compteurs:
# - Total
# - En Attente (statut='en_attente' && soumise=true)
# - Validées (statut='valide')
# - Rejetées (statut='rejete')
```

### Notifications
```bash
# Vérifier les notifications de l'admin
curl "http://localhost:3000/api/notifications" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Résultat attendu:
# [{
#   "_id": "...",
#   "titre": "Nouvelle demande d'attestation",
#   "type": "info",
#   "lien": "/admin/attestations/..."
# }]
```

### File Upload & Preview
```bash
# Vérifier que les fichiers s'affichent
curl "http://localhost:3000/api/fichiers/FILE_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Résultat: metadata du fichier
```

---

## 🔐 Security Tests

### Permissions
```bash
# Non-admin accès /admin/attestations
curl http://localhost:3000/admin/attestations \
  -H "Authorization: Bearer USER_TOKEN"
# Résultat attendu: Redirection vers 403

# Admin accès /admin/attestations
curl http://localhost:3000/admin/attestations \
  -H "Authorization: Bearer ADMIN_TOKEN"
# Résultat attendu: Page 200 OK
```

### Validation
```bash
# Tenter valider sans numéro d'attestation
curl -X PUT "http://localhost:3000/api/attestations/ID" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"validate","statut":"valide"}'
# Résultat attendu: 400 Bad Request (numéro manquant)
```

---

## 📊 Performance Tests

### Pagination
```bash
# Tester avec 50 items
curl "http://localhost:3000/api/attestations?limit=50" \
  -H "Authorization: Bearer ADMIN_TOKEN"
# Temps réponse attendu: < 500ms
```

### Filtrage
```bash
# Tester filtrage par statut
curl "http://localhost:3000/api/attestations?status=en_attente" \
  -H "Authorization: Bearer ADMIN_TOKEN"
# Temps réponse attendu: < 500ms
```

---

## 🐛 Troubleshooting

### Pages ne chargent pas
```bash
# Vérifier auth
curl -I http://localhost:3000/admin -H "Authorization: Bearer TOKEN"

# Vérifier DB
npx tsx scripts/test-db.ts

# Vérifier erreurs
grep -i "error" .next/build-manifest.json
```

### Notifications ne s'affichent pas
```bash
# Vérifier les logs
tail -f .next/server/logs

# Vérifier que createNotification existe
grep -r "Notification.create" app/api/

# Vérifier la base de données
npx mongodb-shell "db.notifications.find().limit(5)"
```

### Stat cards mal comptées
```bash
# Vérifier les statuts en BD
db.demandeattestation.aggregate([
  { $group: { _id: "$statut", count: { $sum: 1 } } }
])

# Vérifier soumise flag
db.demandeattestation.find({ soumise: false }).count()
```

---

## 📈 Métriques de Validation

| Métrique | Min | Target | Max |
|----------|-----|--------|-----|
| Page Load Time | — | < 500ms | 2s |
| API Response | — | < 200ms | 1s |
| Memory Usage | — | < 200MB | 500MB |
| Errors | 0 | 0 | — |
| Test Pass Rate | 95% | 100% | — |

---

## 🚀 Automated Testing

### Run All Tests
```bash
npm run test:admin-dashboard
```

### Expected Output
```
✅ Tests complétés avec succès!
✅ API attestations accessible
✅ Système notifications fonctionnel
✅ Pages admin accessibles

📊 Données:
   • Attestations: 42
   • Notifications: 7
```

### Add to CI/CD
```yaml
# .github/workflows/test.yml
- name: Run Admin Tests
  run: npm run test:admin-dashboard
```

---

## 📝 Test Report Template

```markdown
## Admin Dashboard Test Report - [DATE]

### Environment
- Node Version: [output of node -v]
- DB: [mongo version]
- Status: [✅ PASS / ❌ FAIL]

### Test Results
- [ ] Pages Load
- [ ] Stats Correct
- [ ] Notifications Work
- [ ] Validation Works
- [ ] Permissions Enforced
- [ ] Performance OK

### Issues Found
- [None] / [List]

### Recommendations
- [None] / [List]

### Signature
Tested by: [Name]  
Date: [Date]  
Time: [Time]  
```

---

## 🎓 Next Steps After Testing

1. ✅ All tests pass → Deploy to staging
2. ✅ Staging tests pass → Deploy to production
3. ✅ Monitor notifications for 24h
4. ✅ Collect feedback from admins
5. ✅ Iterate on improvements

---

## 📞 Support

**Issues?** Check:
1. `docs/ADMIN_TESTING_GUIDE.md` - Full guide
2. `ADMIN_IMPROVEMENTS_COMPLETED.md` - Summary
3. `scripts/test-admin-quick.sh` - Quick tests

**Questions?** Contact:
- Admin Dashboard Owner: [Name]
- System Admin: [Name]

---

**Last Updated**: 30 January 2026  
**Version**: 1.0  
**Status**: ✅ READY FOR TESTING

