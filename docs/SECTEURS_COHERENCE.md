# 🎯 Système Secteur/Paroisse - Cohérence Harmonisée

## ✅ Structure Centralisée

### Configuration Unique (Source de Vérité)
**Fichier:** [`lib/secteurs-paroisses.ts`](lib/secteurs-paroisses.ts)

```typescript
export const SECTEURS_PAROISSES = {
  "Secteur Nord": [
    "Paroisse Saint-Pierre",
    "Paroisse Saint-Paul",
    "Paroisse Notre-Dame",
    "Paroisse Saint-Jean"
  ],
  "Secteur Sud": [...],
  "Secteur Est": [...],
  "Secteur Ouest": [...],
  "Secteur Centre": [...]
};
```

### Secteurs Disponibles
1. **Secteur Nord** - 4 paroisses
2. **Secteur Sud** - 4 paroisses
3. **Secteur Est** - 4 paroisses
4. **Secteur Ouest** - 4 paroisses
5. **Secteur Centre** - 4 paroisses

**Total:** 5 secteurs × 4 paroisses = 20 paroisses

---

## 📦 Composants Réutilisables

### SecteurParoisseSelect
**Fichier:** [`components/SecteurParoisseSelect.tsx`](components/SecteurParoisseSelect.tsx)

#### Fonctionnalités
✅ **Cascade dynamique:** Paroisse dépend du Secteur sélectionné  
✅ **Validation intégrée:** Affiche les erreurs  
✅ **États visuels:** Loading, disabled, erreurs  
✅ **Informations utiles:** Affiche le nombre de paroisses disponibles  
✅ **Accessibilité:** Labels et gestion des états  

#### Utilisation
```tsx
<SecteurParoisseSelect
  secteur={formData.secteur}
  paroisse={formData.paroisse}
  onSecteurChange={(value) => handleSecteurChange(value)}
  onParoisseChange={(value) => handleParoisseChange(value)}
  onBlur={handleBlur}
  error={{
    secteur: errors.secteur,
    paroisse: errors.paroisse
  }}
  required
/>
```

---

## 📝 Pages Harmonisées

### 1. **Militants** 
**Fichier:** [`components/MilitantForm.tsx`](components/MilitantForm.tsx)

✅ Utilise le composant `SecteurParoisseSelect`  
✅ Gère les erreurs de validation  
✅ Permet l'ajout/modification de militants avec secteur et paroisse

### 2. **Attestations - Créer**
**Fichier:** [`app/dashboard/attestations/creer/page.tsx`](app/dashboard/attestations/creer/page.tsx)

✅ Utilise le composant `SecteurParoisseSelect`  
✅ Configuration centralisée de SECTEURS_PAROISSES  
✅ Sélection en cascade dynamique  
✅ Distinction Brouillon / Soumission

### 3. **Cérémonies - Modifier**
**Fichier:** [`app/dashboard/ceremonies/[id]/edit/page.tsx`](app/dashboard/ceremonies/[id]/edit/page.tsx)

✅ Utilise le composant `SecteurParoisseSelect`  
✅ Gère les states d'erreur et touched  
✅ Validation avant soumission

---

## 🗄️ Modèles de Données

### Militant
```typescript
interface IMilitant extends Document {
  prenom: string;
  nom: string;
  paroisse: string;      // Format: "Paroisse XXX"
  secteur: string;       // Format: "Secteur YYY"
  sexe: "M" | "F";
  grade: string;
  quartier: string;
}
```

### Attest attestion
```typescript
interface DemandeAttestation {
  prenom: string;
  nom: string;
  paroisse: string;      // Format: "Paroisse XXX"
  secteur: string;       // Format: "Secteur YYY"
  anneeFinFormation: number;
  lieuDernierCamp: string;
  statut: "en_attente" | "valide" | "rejete";
}
```

### Cérémonie
```typescript
interface DemandeCeremonie {
  Secteur: string;       // Format: "Secteur YYY"
  paroisse: string;      // Format: "Paroisse XXX"
  dateCeremonie: string;
  lieuxCeremonie: string;
}
```

---

## 🔄 Flux de Sélection

```
1. Utilisateur choisit un Secteur
   ↓
2. Composant met à jour la liste des Paroisses
   ↓
3. Paroisses disponibles pour ce secteur s'affichent
   ↓
4. Utilisateur choisit une Paroisse
   ↓
5. Validation et soumission
```

---

## 📋 Checklist de Cohérence

- [x] Configuration centralisée des secteurs/paroisses
- [x] Composant réutilisable pour la cascade
- [x] MilitantForm utilise le composant
- [x] Page attestations/creer utilise le composant
- [x] Page ceremonies/[id]/edit utilise le composant
- [x] Format uniforme des données (ex: "Paroisse X", "Secteur Y")
- [x] Validation intégrée dans le composant
- [x] Messages d'erreur cohérents
- [x] États visuels cohérents

---

## 🚀 Points Forts du Système

1. **Maintenance Facile** - Un seul endroit pour mettre à jour les secteurs/paroisses
2. **Réutilisabilité** - Même composant partout
3. **Cohérence** - Même comportement dans tous les formulaires
4. **Validation** - Impossible de sélectionner une paroisse invalide pour un secteur
5. **UX** - Interface claire avec feedback utilisateur
6. **Performance** - Pas de requêtes API pour charger secteurs/paroisses (données statiques)

---

## 📝 Notes de Développement

- Les données des secteurs/paroisses sont **statiques** et chargées côté client
- Le composant gère **l'état local** de la cascade (secteur → paroisse)
- Les **validations** sont appliquées au level du formulaire parent
- Les erreurs sont **affichées au niveau du composant**
- Le composant est **complètement autonome** pour l'affichage

---

## 🔗 Références Croisées

- **Hook personnalisé** (optionnel): `lib/secteurs-paroisses.ts` export `useSecteurParoisse()`
- **Routes API**: Acceptent les formats `"Secteur X"` et `"Paroisse Y"`
- **Base de données**: MongoDB stocke ces valeurs telles quelles

---

**Dernière mise à jour:** 29 janvier 2026  
**Version:** 1.0 - Cohérence Complète
