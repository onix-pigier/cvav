# 📚 Guide d'Utilisation - Système Secteur/Paroisse

## Vue d'ensemble

Le système secteur/paroisse est conçu pour assurer la **cohérence** et la **réutilisabilité** dans toute l'application. Chaque formulaire qui demande un secteur et une paroisse utilise maintenant le **même composant standardisé**.

---

## 🎯 Pour les Développeurs

### Ajouter le composant à un nouveau formulaire

#### Étape 1: Importer le composant et les données
```tsx
import SecteurParoisseSelect from '@/components/SecteurParoisseSelect';
import { SECTEURS_PAROISSES } from '@/lib/secteurs-paroisses';
```

#### Étape 2: Initialiser le state
```tsx
const [formData, setFormData] = useState({
  secteur: '',
  paroisse: '',
  // ...autres champs
});

const [errors, setErrors] = useState<Record<string, string>>({});
const [touched, setTouched] = useState<Record<string, boolean>>({});
```

#### Étape 3: Créer les handlers
```tsx
const handleSecteurChange = (value: string) => {
  setFormData(prev => ({ ...prev, secteur: value }));
  // Nettoyer les erreurs
  if (errors.secteur) {
    setErrors(prev => ({ ...prev, secteur: '' }));
  }
};

const handleParoisseChange = (value: string) => {
  setFormData(prev => ({ ...prev, paroisse: value }));
  if (errors.paroisse) {
    setErrors(prev => ({ ...prev, paroisse: '' }));
  }
};

const handleBlur = (field: string) => {
  setTouched(prev => ({ ...prev, [field]: true }));
};
```

#### Étape 4: Utiliser le composant
```tsx
<SecteurParoisseSelect
  secteur={formData.secteur}
  paroisse={formData.paroisse}
  onSecteurChange={handleSecteurChange}
  onParoisseChange={handleParoisseChange}
  onBlur={handleBlur}
  error={{
    secteur: touched.secteur ? errors.secteur : '',
    paroisse: touched.paroisse ? errors.paroisse : ''
  }}
  required
/>
```

---

## ✅ Validation

### Côté Client (formulaire)
```tsx
const validateForm = () => {
  let isValid = true;
  
  if (!formData.secteur) {
    setErrors(prev => ({ ...prev, secteur: 'Le secteur est requis' }));
    isValid = false;
  }
  
  if (!formData.paroisse) {
    setErrors(prev => ({ ...prev, paroisse: 'La paroisse est requise' }));
    isValid = false;
  }
  
  return isValid;
};
```

### Côté Serveur (API)
```tsx
// Optionnel - le composant empêche déjà les selections invalides
const validateSecteurParoisse = (secteur: string, paroisse: string) => {
  const paroissesValides = SECTEURS_PAROISSES[secteur] || [];
  
  if (!paroissesValides.includes(paroisse)) {
    throw new Error('Combinaison secteur/paroisse invalide');
  }
};
```

---

## 🎨 Personnalisation

### Rendre optionnel
```tsx
<SecteurParoisseSelect
  // ...
  required={false}
/>
```

### Désactiver
```tsx
<SecteurParoisseSelect
  // ...
  disabled={true}
/>
```

### Custom error handling
```tsx
<SecteurParoisseSelect
  // ...
  error={{
    secteur: 'Erreur personnalisée pour secteur',
    paroisse: 'Erreur personnalisée pour paroisse'
  }}
/>
```

---

## 📊 Données Disponibles

### Secteurs (5 au total)
- Secteur Nord
- Secteur Sud
- Secteur Est
- Secteur Ouest
- Secteur Centre

### Paroisses (4 par secteur, 20 au total)

**Secteur Nord:**
- Paroisse Saint-Pierre
- Paroisse Saint-Paul
- Paroisse Notre-Dame
- Paroisse Saint-Jean

**Secteur Sud:**
- Paroisse Sainte-Marie
- Paroisse Saint-Joseph
- Paroisse Sacré-Cœur
- Paroisse Saint-Michel

**Secteur Est:**
- Paroisse Saint-Antoine
- Paroisse Saint-François
- Paroisse Sainte-Thérèse
- Paroisse Saint-Louis

**Secteur Ouest:**
- Paroisse Saint-Marc
- Paroisse Saint-Luc
- Paroisse Saint-Matthieu
- Paroisse Sainte-Anne

**Secteur Centre:**
- Paroisse Cathédrale
- Paroisse Saint-Esprit
- Paroisse Sainte-Trinité
- Paroisse Saint-Augustin

---

## 🔄 Mettre à jour les secteurs/paroisses

Tous les secteurs et paroisses sont définis dans **un seul fichier**:

**Fichier:** `lib/secteurs-paroisses.ts`

Pour ajouter/modifier/supprimer un secteur ou une paroisse:

1. Ouvrez `lib/secteurs-paroisses.ts`
2. Modifiez l'objet `SECTEURS_PAROISSES`
3. Toutes les pages utilisant le composant se mettront à jour **automatiquement**

Exemple - Ajouter une paroisse:
```typescript
"Secteur Nord": [
  "Paroisse Saint-Pierre",
  "Paroisse Saint-Paul",
  "Paroisse Notre-Dame",
  "Paroisse Saint-Jean",
  "Paroisse Nouvelle"  // ← Nouvelle paroisse
]
```

---

## 🧪 Exemples Complets

### Formulaire Simple
```tsx
'use client';

import { useState } from 'react';
import SecteurParoisseSelect from '@/components/SecteurParoisseSelect';

export default function SimpleForm() {
  const [secteur, setSecteur] = useState('');
  const [paroisse, setParoisse] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secteur || !paroisse) {
      setErrors({
        secteur: !secteur ? 'Requis' : '',
        paroisse: !paroisse ? 'Requis' : ''
      });
      return;
    }
    
    console.log({ secteur, paroisse });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SecteurParoisseSelect
        secteur={secteur}
        paroisse={paroisse}
        onSecteurChange={setSecteur}
        onParoisseChange={setParoisse}
        error={errors}
        required
      />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

---

## 🚨 Pièges à Éviter

❌ **NE PAS**: Créer une liste de secteurs/paroisses dans chaque formulaire
```tsx
// ❌ MAUVAIS
const secteurs = ["Nord", "Sud", "Est", "Ouest"];
const paroisses = ["Paroisse 1", "Paroisse 2"];
```

✅ **À LA PLACE**: Utiliser la configuration centralisée
```tsx
// ✅ BON
import { SECTEURS_PAROISSES } from '@/lib/secteurs-paroisses';
```

---

❌ **NE PAS**: Stocker la liste des paroisses dans un state
```tsx
// ❌ MAUVAIS
useEffect(() => {
  setParoisses(SECTEURS_PAROISSES[secteur] || []);
}, [secteur]);
```

✅ **À LA PLACE**: Laisser le composant gérer cela
```tsx
// ✅ BON - Le composant gère la cascade automatiquement
<SecteurParoisseSelect ... />
```

---

## 📱 Responsive Design

Le composant est **fully responsive**:
- Sur mobile: Les selects prennent 100% de la largeur
- Sur desktop: Layout optimisé (2 colonnes quand possible)

---

## 🔐 Sécurité

### Validation de la cascade
Le composant **empêche** d'avoir une paroisse invalide pour un secteur:
- Si l'utilisateur change le secteur, la paroisse est réinitialisée
- Il est **impossible** de soumettre une combinaison invalide sans toucher au code

### Côté serveur
Bien que le composant empêche les erreurs côté client, **vérifiez toujours** côté serveur:
```typescript
// route.ts
const { secteur, paroisse } = await request.json();

// Validation
const valid = SECTEURS_PAROISSES[secteur]?.includes(paroisse);
if (!valid) {
  return Response.json(
    { error: 'Combinaison secteur/paroisse invalide' },
    { status: 400 }
  );
}
```

---

## 📞 Support

Pour des questions ou des modifications:

1. **Consulter**: `SECTEURS_COHERENCE.md`
2. **Modifier les données**: `lib/secteurs-paroisses.ts`
3. **Modifier le composant**: `components/SecteurParoisseSelect.tsx`

---

**Document créé:** 29 janvier 2026  
**Version:** 1.0
