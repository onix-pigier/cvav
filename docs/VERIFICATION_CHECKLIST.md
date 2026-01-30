# ✅ Checklist de Vérification

## 🧪 Test du Système Secteur/Paroisse

Utilisez cette checklist pour vérifier que le système fonctionne correctement après les modifications.

---

## 1️⃣ Vérification des Fichiers

### Configuration
- [ ] `lib/secteurs-paroisses.ts` existe
- [ ] Contient 5 secteurs
- [ ] Chaque secteur a 4 paroisses
- [ ] Format: "Secteur XXX" et "Paroisse YYY"

### Composant
- [ ] `components/SecteurParoisseSelect.tsx` existe
- [ ] Exporte un composant par défaut
- [ ] Accepte les props requises

### Formulaires
- [ ] `components/MilitantForm.tsx` importe SecteurParoisseSelect
- [ ] `app/dashboard/attestations/creer/page.tsx` importe le composant
- [ ] `app/dashboard/ceremonies/[id]/edit/page.tsx` importe le composant

### Documentation
- [ ] `SECTEURS_COHERENCE.md` existe
- [ ] `GUIDE_SECTEURS.md` existe
- [ ] `IMPLEMENTATION_SUMMARY.md` existe
- [ ] `ARCHITECTURE_DIAGRAM.md` existe

---

## 2️⃣ Vérification du Code

### MilitantForm
```tsx
// ✓ À vérifier:
import SecteurParoisseSelect from './SecteurParoisseSelect';

// ✓ Pas de:
// const secteurs = ["Nord", "Sud", "Est", "Ouest"];
// const paroisses = ["...", "...", "..."];

// ✓ Utilise le composant:
<SecteurParoisseSelect
  secteur={formData.secteur}
  paroisse={formData.paroisse}
  onSecteurChange={(value) => handleChange('secteur', value)}
  onParoisseChange={(value) => handleChange('paroisse', value)}
  // ...
/>
```

### Attestations
```tsx
// ✓ À vérifier:
import SecteurParoisseSelect from '@/components/SecteurParoisseSelect';
import { SECTEURS_PAROISSES } from '@/lib/secteurs-paroisses';

// ✓ Pas de configuration locale de SECTEURS_PAROISSES

// ✓ Utilise le composant de la même façon
```

### Cérémonies
```tsx
// ✓ À vérifier:
import SecteurParoisseSelect from '@/components/SecteurParoisseSelect';

// ✓ Plus d'inputs texte pour secteur/paroisse

// ✓ Utilise le composant
```

---

## 3️⃣ Vérification Fonctionnelle

### Test du Formulaire Militants
1. [ ] Naviguer vers la page des militants
2. [ ] Cliquer sur "Ajouter un militant"
3. [ ] Voir le formulaire
4. [ ] Secteur et Paroisse sont des SELECTS (dropdowns)
5. [ ] Cliquer sur Secteur → liste de 5 secteurs
6. [ ] Sélectionner un secteur
7. [ ] Paroisse s'active et affiche 4 options
8. [ ] Changer de secteur → paroisse se réinitialise
9. [ ] Les paroisses affichées correspondent au secteur

### Test du Formulaire Attestations
1. [ ] Naviguer vers Attestations → Créer
2. [ ] Voir le formulaire
3. [ ] Secteur et Paroisse sont des SELECTS
4. [ ] Répéter les étapes 5-9 du test Militants
5. [ ] Les deux selects sont dans la même section "Localisation"

### Test du Formulaire Cérémonies
1. [ ] Naviguer vers Cérémonies
2. [ ] Cliquer sur une cérémonie existante ou en créer une
3. [ ] Voir le formulaire d'édition
4. [ ] Secteur et Paroisse sont des SELECTS
5. [ ] Répéter les étapes 5-9 du test Militants

---

## 4️⃣ Vérification des Données

### Secteur Nord
- [ ] Paroisse Saint-Pierre
- [ ] Paroisse Saint-Paul
- [ ] Paroisse Notre-Dame
- [ ] Paroisse Saint-Jean

### Secteur Sud
- [ ] Paroisse Sainte-Marie
- [ ] Paroisse Saint-Joseph
- [ ] Paroisse Sacré-Cœur
- [ ] Paroisse Saint-Michel

### Secteur Est
- [ ] Paroisse Saint-Antoine
- [ ] Paroisse Saint-François
- [ ] Paroisse Sainte-Thérèse
- [ ] Paroisse Saint-Louis

### Secteur Ouest
- [ ] Paroisse Saint-Marc
- [ ] Paroisse Saint-Luc
- [ ] Paroisse Saint-Matthieu
- [ ] Paroisse Sainte-Anne

### Secteur Centre
- [ ] Paroisse Cathédrale
- [ ] Paroisse Saint-Esprit
- [ ] Paroisse Sainte-Trinité
- [ ] Paroisse Saint-Augustin

---

## 5️⃣ Vérification de l'UX

### Responsive Design
- [ ] Sur desktop: Les selects sont côte à côte
- [ ] Sur mobile: Les selects sont empilés verticalement
- [ ] Les labels sont toujours visibles
- [ ] Les erreurs s'affichent correctement

### Indicateurs Visuels
- [ ] ❌ Erreur: couleur rouge
- [ ] ✓ Success: couleur verte
- [ ] ℹ️ Info: couleur bleue
- [ ] ⚠️ Warning: couleur orange

### Accessibilité
- [ ] Les labels sont associés aux inputs
- [ ] Les erreurs sont affichées avec icône ⚠️
- [ ] Les messages d'info sont clairs
- [ ] Les selects sont accessibles au clavier

---

## 6️⃣ Vérification de la Validation

### Validation Client
1. [ ] Essayer de soumettre sans sélectionner de secteur
   - Attendu: Message d'erreur "Le secteur est requis"
   
2. [ ] Essayer de soumettre sans sélectionner de paroisse
   - Attendu: Message d'erreur "La paroisse est requise"
   
3. [ ] Sélectionner secteur, puis changer de secteur
   - Attendu: Paroisse est réinitialisée
   
4. [ ] Sélectionner secteur + paroisse, changer de secteur, revenir au premier
   - Attendu: L'ancienne paroisse n'existe pas dans la liste
   
5. [ ] Vérifier le nombre de paroisses affichées
   - Attendu: 4 paroisses pour chaque secteur

---

## 7️⃣ Vérification des Erreurs

### Scenarios d'Erreur
- [ ] Erreur secteur s'affiche en rouge
- [ ] Erreur paroisse s'affiche en rouge
- [ ] Erreurs disparaissent quand on corrige
- [ ] Message d'erreur est clair et utile

### Edge Cases
- [ ] Soumettre un formulaire vide
- [ ] Soumettre avec secteur seulement
- [ ] Soumettre avec paroisse seulement
- [ ] Rafraîchir la page (données persistent?)
- [ ] Tester sur navigateurs différents

---

## 8️⃣ Vérification de l'API

### Insertion en Base de Données
1. [ ] Créer un militant avec secteur + paroisse
2. [ ] Vérifier dans la base de données
3. [ ] Les valeurs sont correctement enregistrées
4. [ ] Format: "Secteur Nord" pas juste "Nord"
5. [ ] Format: "Paroisse X" pas juste "X"

### Modification en Base de Données
1. [ ] Modifier un militant existant
2. [ ] Changer le secteur/paroisse
3. [ ] Sauvegarder
4. [ ] Vérifier en base que c'est à jour
5. [ ] Recharger le formulaire
6. [ ] Les bonnes valeurs sont affichées

---

## 9️⃣ Vérification de la Cohérence

### Tous les Formulaires Utilisent le Même Composant
- [ ] MilitantForm → SecteurParoisseSelect ✓
- [ ] AttestationsCreer → SecteurParoisseSelect ✓
- [ ] CeremoniesEdit → SecteurParoisseSelect ✓

### Configuration Unique
- [ ] SECTEURS_PAROISSES importés depuis lib/secteurs-paroisses.ts
- [ ] Pas de duplication dans d'autres fichiers
- [ ] Pas de listes locales différentes

### Comportement Identique
- [ ] Cascade fonctionne pareil dans tous les formulaires
- [ ] Erreurs affichées de la même façon
- [ ] UX est consistante

---

## 🔟 Vérification de la Performance

- [ ] Aucune requête API pour charger les données (statique)
- [ ] Pas de lag lors de la sélection
- [ ] Pas de flickers lors de la cascade
- [ ] Page charge rapidement
- [ ] Pas d'erreur console

---

## 🆘 Troubleshooting

### Problème: Selects n'apparaissent pas
**Solution:**
```tsx
// Vérifier:
1. Import SecteurParoisseSelect existe
2. Composant est utilisé dans le JSX
3. Props sont passées correctement
4. Pas d'erreur console
```

### Problème: Cascade ne fonctionne pas
**Solution:**
```tsx
// Vérifier:
1. SECTEURS_PAROISSES est importé
2. useEffect du composant se déclenche
3. Changement de secteur appelle onSecteurChange
4. Handler met à jour le state du parent
5. Re-render du composant
```

### Problème: Erreurs ne s'affichent pas
**Solution:**
```tsx
// Vérifier:
1. Props error est passée
2. touched[field] est true
3. error[field] a une valeur
4. CSS n'est pas overridé
```

### Problème: Valeurs ne se sauvegardent pas
**Solution:**
```tsx
// Vérifier:
1. API endpoint reçoit les bonnes données
2. Validation côté serveur ne rejette pas
3. Base de données accepte les formats
4. Pas d'erreur réseau
5. Réponse de l'API est correcte
```

---

## ✅ Checklist Finale

- [ ] Tous les fichiers existent
- [ ] Tous les imports sont corrects
- [ ] Tous les formulaires utilisent le composant
- [ ] Cascade fonctionne
- [ ] Validation fonctionne
- [ ] Sauvegarde fonctionne
- [ ] UX est cohérente
- [ ] Documentation est à jour
- [ ] Aucune erreur console
- [ ] Aucun warning React

---

## 📞 En Cas de Problème

1. Consulter [GUIDE_SECTEURS.md](GUIDE_SECTEURS.md)
2. Vérifier la console du navigateur (F12)
3. Vérifier les logs du serveur
4. Comparer avec les exemples dans [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
5. Vérifier l'architecture dans [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)

---

**Checklist créée:** 29 janvier 2026  
**Version:** 1.0
