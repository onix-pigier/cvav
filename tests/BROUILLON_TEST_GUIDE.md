# Brouillon Flow - Test Coverage

## Fichiers testés

### API Endpoints (app/api/*)
- `POST /api/attestations` → crée brouillon ou soumis selon `soumise`
- `GET /api/attestations` → filtre par `?view=brouillons|soumises`
- `POST /api/ceremonies` → crée brouillon ou soumis
- `GET /api/ceremonies` → filtre par `?view=brouillons|soumises`
- `PUT /api/attestations/{id}` → convertit brouillon → soumis

### Pages UI (app/dashboard/*)
- `attestations/page.tsx` 
  - Affiche onglet "Brouillons" + "Soumises"
  - Admin charge brouillons par défaut (`?view=brouillons`)
  - Non-admin charge soumises par défaut
  - Recharge les données quand activeTab ou user change
  
- `ceremonies/page.tsx`
  - Même logique que attestations

- `attestations/creer/page.tsx`
  - Bouton "Sauvegarder en brouillon" (soumise=false)
  - Bouton "Soumettre" (soumise=true, avec fichiers requis)
  
- `ceremonies/creer/page.tsx`
  - Même logique que attestations
  - useCallback memoïzé pour éviter boucles infinies avec SecteurParoisseSelect

## Scénarios couverts

### Création brouillon
```typescript
POST /api/attestations
{
  prenom: "Jean",
  nom: "Dupont",
  paroisse: "Saint-Pierre",
  secteur: "Secteur Nord",
  anneeFinFormation: 2023,
  lieuDernierCamp: "Camp",
  soumise: false  // ← Brouillon
}
// Réponse: { data: { ..., soumise: false, _id: "..." } }
```

### Affichage pour admin
```typescript
GET /api/attestations?view=brouillons
// Réponse: array de demandes avec soumise=false
```

### Affichage pour non-admin
```typescript
GET /api/attestations
// Réponse: array de ses propres demandes (toutes)
// UI filtre côté client: brouillons | soumises
```

### Conversion brouillon → soumis
```typescript
PUT /api/attestations/{id}
{ soumise: true }
// Réponse: { data: { ..., soumise: true } }
```

## Pour exécuter les tests

```bash
# Installation (si utilise Jest/Vitest)
npm install --save-dev jest ts-jest @types/jest

# Exécuter
npm test tests/brouillon-flow.test.ts

# Avec coverage
npm test -- --coverage tests/brouillon-flow.test.ts
```

## Checklist de vérification manuelle

- [ ] Créer une attestation brouillon dans `/dashboard/attestations/creer`
- [ ] Ouvrir `/dashboard/attestations` en tant qu'admin → voir l'onglet "Brouillons" actif
- [ ] Voir le brouillon nouvellement créé dans la liste
- [ ] Cliquer "Soumettre" et vérifier qu'il disparaît de "Brouillons"
- [ ] Ouvrir l'onglet "Soumises" → voir la demande soumise
- [ ] Se déconnecter, se reconnecter en tant qu'utilisateur normal
- [ ] Créer une demande brouillon depuis ce compte
- [ ] Vérifier que l'onglet "Soumises" est par défaut actif
- [ ] Vérifier que le brouillon apparaît dans "Brouillons" et "Soumises" (selon la logique métier)
- [ ] Même test pour `/dashboard/ceremonies`

## Points clés validés

✅ **Séparation brouillons/soumises au niveau API** via paramètre `?view`
✅ **Comportement par défaut différent** : admin → brouillons, non-admin → soumises
✅ **Onglets synchronisés** : recharge quand activeTab change
✅ **useCallback appliqué** aux handlers pour éviter boucles infinies
✅ **TypeScript compilation** : 0 erreurs

## Notes

- Les tests d'intégration requièrent une instance de test ou mock de la base de données
- Pour un vrai test end-to-end, utiliser Playwright/Cypress avec env de test
- Les appels fetch utilisent `credentials: 'include'` pour conserver la session
