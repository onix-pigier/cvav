# 🏗️ Architecture du Système Secteur/Paroisse

## 📦 Structure Centralisée

```
┌─────────────────────────────────────────────────────────────┐
│         CONFIGURATION UNIQUE (Source de Vérité)             │
│  lib/secteurs-paroisses.ts                                  │
│  ────────────────────────────────────────────────────────   │
│  SECTEURS_PAROISSES = {                                     │
│    "Secteur Nord": [...],                                   │
│    "Secteur Sud": [...],                                    │
│    "Secteur Est": [...],                                    │
│    "Secteur Ouest": [...],                                  │
│    "Secteur Centre": [...]                                  │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ Importe
            ┌───────────────┴───────────────┐
            │                               │
    ┌───────────────┐           ┌───────────────────┐
    │  COMPOSANT    │           │  PAGES & FORMS    │
    │  RÉUTILISABLE │           │                   │
    └───────────────┘           └───────────────────┘
            │                           │
    ┌───────▼────────┐         ┌───────▼──────────────────┐
    │ SecteurParoise │         │ Utilise le composant:   │
    │ Select.tsx     │         │                          │
    │ ──────────────│         │ ✓ MilitantForm         │
    │ • Cascade     │         │ ✓ Attestations        │
    │ • Validation  │         │ ✓ Cérémonies          │
    │ • Erreurs     │         │ ✓ Futurs formulaires  │
    │ • UX          │         └──────────────────────────┘
    └──────────────┘
```

---

## 🔄 Flux de Données

### 1️⃣ Import de Configuration
```
┌─────────────────────────────────────────┐
│ import { SECTEURS_PAROISSES }           │
│   from '@/lib/secteurs-paroisses'      │
└──────────────┬──────────────────────────┘
               │
               ▼
         Données chargées
         (5 secteurs, 20 paroisses)
```

### 2️⃣ Utilisation du Composant
```
┌──────────────────────────────────────┐
│ <SecteurParoisseSelect                │
│   secteur={secteur}                  │
│   paroisse={paroisse}                │
│   onSecteurChange={handler}          │
│   onParoisseChange={handler}         │
│   error={errors}                     │
│ />                                    │
└──────────────┬───────────────────────┘
               │
        ┌──────▼──────┐
        │ Rendu HTML  │
        └──────┬──────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────┐         ┌──────────┐
│ Select  │         │ Select   │
│ Secteur │         │ Paroisse │
│         │         │ (cascade)│
└─────────┘         └──────────┘
```

### 3️⃣ Gestion de la Cascade
```
Utilisateur sélectionne Secteur
    │
    ▼
useEffect déclenché
    │
    ▼
Récupère paroisses du secteur
    │
    ▼
Met à jour liste des paroisses
    │
    ▼
Réinitialise paroisse précédente
    │
    ▼
Re-render du select paroisse
```

---

## 📋 Pages Impliquées

### Structure Hiérarchique

```
Dashboard
├── Militants
│   └── MilitantForm.tsx
│       └── SecteurParoisseSelect ✅
│
├── Attestations
│   ├── page.tsx (liste)
│   └── creer/
│       └── page.tsx
│           └── SecteurParoisseSelect ✅
│
└── Cérémonies
    ├── page.tsx (liste)
    └── [id]/
        └── edit/
            └── page.tsx
                └── SecteurParoisseSelect ✅
```

---

## 🔗 Dépendances

### Sans Dépendances Externes
```
┌────────────────────────────────────┐
│ SecteurParoisseSelect              │
│ ────────────────────────────────── │
│ Dépend de:                         │
│ • React (useState, useEffect)      │
│ • lucide-react (icônes)           │
│ • SECTEURS_PAROISSES (données)    │
│                                    │
│ NE dépend PAS de:                  │
│ • API externes                     │
│ • Base de données                  │
│ • État global (Redux, etc.)        │
└────────────────────────────────────┘
```

---

## 🔄 Cycle de Vie du Composant

```
┌─────────────────────────────────────────────────────────┐
│                   INITIALIZATION                        │
│  Props reçues: secteur, paroisse, handlers, errors     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   MOUNT / UPDATE                        │
│  useEffect détecte changement de secteur               │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              CALCUL DE LA LISTE DES PAROISSES          │
│  const newParoisses = SECTEURS_PAROISSES[secteur]      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│          VALIDATION DE LA PAROISSE ACTUELLE             │
│  Si paroisse n'existe pas dans le nouveau secteur,    │
│  la réinitialiser                                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   RE-RENDER                            │
│  Affichage du select paroisse avec nouvelle liste     │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Props Interface

```typescript
interface SecteurParoisseSelectProps {
  // Valeurs actuelles
  secteur: string;
  paroisse: string;
  
  // Handlers de changement
  onSecteurChange: (value: string) => void;
  onParoisseChange: (value: string) => void;
  
  // Erreurs et validation
  error?: {
    secteur?: string;
    paroisse?: string;
  };
  
  // Callback optionnel
  onBlur?: (field: string) => void;
  
  // Options
  disabled?: boolean;
  required?: boolean;
}
```

---

## 📊 État Gérés par le Composant Parent

```typescript
// State du formulaire parent
const [formData, setFormData] = useState({
  // ... autres champs ...
  secteur: '',      // Chaîne non-vide = secteur sélectionné
  paroisse: ''      // Dépend du secteur
});

// State des erreurs
const [errors, setErrors] = useState<Record<string, string>>({
  secteur: '',     // Message d'erreur ou vide
  paroisse: ''     // Message d'erreur ou vide
});

// State des champs touchés (pour afficher erreurs)
const [touched, setTouched] = useState<Record<string, boolean>>({
  secteur: false,   // true si utilisateur a cliqué
  paroisse: false   // true si utilisateur a cliqué
});
```

---

## 🔐 Validations

### Niveau Composant
```
✓ Une paroisse invalide pour un secteur?
  → Réinitialiser la paroisse
  
✓ Secteur changé?
  → Mettre à jour la liste des paroisses
  
✓ Paroisse n'existe plus dans nouveau secteur?
  → Réinitialiser la paroisse
```

### Niveau Formulaire (Parent)
```
✓ Avant soumission:
  if (!formData.secteur || !formData.paroisse) {
    // Afficher erreur
  }
```

### Niveau Serveur (API)
```
✓ Validation additionnelle (security):
  const valid = SECTEURS_PAROISSES[secteur]?.includes(paroisse);
  if (!valid) {
    // Rejeter la requête
  }
```

---

## 📱 Responsive Behavior

```
Desktop (≥768px)
┌─────────────────────────────────┐
│ Label: Secteur     │ Label: Paroisse │
│ [Dropdown]         │ [Dropdown]      │
└─────────────────────────────────┘
 (2 colonnes dans une grille)

Mobile (<768px)
┌──────────────┐
│ Label        │
│ Secteur      │
│ [Dropdown]   │
├──────────────┤
│ Label        │
│ Paroisse     │
│ [Dropdown]   │
└──────────────┘
 (1 colonne pleine largeur)
```

---

## 🎯 Points d'Intégration

### 1. Formulaires Existants
```
✅ MilitantForm.tsx
   └── SecteurParoisseSelect
   
✅ Attestations creer/page.tsx
   └── SecteurParoisseSelect
   
✅ Cérémonies [id]/edit/page.tsx
   └── SecteurParoisseSelect
```

### 2. Futurs Formulaires
```
À venir (Template):
┌────────────────────────────────────────┐
│ import SecteurParoisseSelect from ...  │
│                                        │
│ <SecteurParoisseSelect                │
│   secteur={form.secteur}              │
│   paroisse={form.paroisse}            │
│   onSecteurChange={...}               │
│   onParoisseChange={...}              │
│ />                                     │
└────────────────────────────────────────┘
```

---

## 🔄 Mise à Jour Centralisée

### Ajouter une paroisse
```
1. Ouvrir lib/secteurs-paroisses.ts
2. Modifier SECTEURS_PAROISSES
3. Sauvegarder
4. ✨ Tous les formulaires sont mis à jour automatiquement
```

### Ajouter un secteur
```
1. Ouvrir lib/secteurs-paroisses.ts
2. Ajouter nouvelle clé au SECTEURS_PAROISSES
3. Ajouter tableau de paroisses
4. Sauvegarder
5. ✨ Tous les formulaires affichent le nouveau secteur
```

---

## 📈 Cas de Scalabilité

### Actuellement
- 5 secteurs
- 20 paroisses
- 3 formulaires utilisant le système

### À l'avenir
```
+5 secteurs?      → Ajouter 5 entrées dans lib/secteurs-paroisses.ts
+10 formulaires?  → Copier le composant dans 10 autres places
+100 paroisses?   → Ajouter dans la configuration
```

**Tout cela se fait SANS modifier le composant SecteurParoisseSelect**

---

**Diagramme créé:** 29 janvier 2026  
**Version:** 1.0
