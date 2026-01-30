# 📬 SYSTÈME DE NOTIFICATIONS - GUIDE D'INTÉGRATION

## 🎯 OBJECTIF

Afficher le nombre de notifications non lues dans la sidebar avec un badge dynamique.

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────┐
│   DashboardLayout                   │
│   ├─ useNotifications() hook        │ ← Récupère count
│   └─ Sidebar                        │
│      └─ SidebarItem                 │
│         └─ badge={notifCount}       │ ← Affiche le badge
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│   useNotifications Hook             │
│   ├─ Fetch /api/notifications      │
│   ├─ Filtre les non-lues           │
│   ├─ Rafraîchit toutes les 30s     │
│   └─ return { count, isLoading }   │
└─────────────────────────────────────┘
```

---

## 📂 FICHIERS MODIFIÉS

### 1. **hooks/useNotifications.ts** ✏️ MODIFIÉ
```typescript
export function useNotifications() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCount(); // Chargement initial
    const interval = setInterval(fetchCount, 30000); // Rafraîchir toutes les 30s
    return () => clearInterval(interval);
  }, []);

  const fetchCount = async () => {
    const res = await fetch('/api/notifications', { 
      credentials: 'include',
      cache: 'no-store' // ✅ Pas de cache
    });
    
    if (res.ok) {
      const data = await res.json();
      const nonLues = data.filter((n) => !n.lu).length; // ✅ Compter non-lues
      setCount(nonLues);
    }
  };

  return { count, isLoading, refresh: fetchCount };
}
```

**Améliorations** :
- ✅ Gère l'état `isLoading`
- ✅ Cache désactivé (`cache: 'no-store'`)
- ✅ Rafraîchissement automatique (30s)
- ✅ Gestion d'erreurs

---

### 2. **components/sidebar.tsx** ✏️ MODIFIÉ

#### Interface SidebarItemProps
```typescript
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  href?: string;
  active?: boolean;
  alert?: boolean;
  badge?: number; // ✅ NOUVEAU : compteur
  onClick?: () => void;
}
```

#### SidebarItem Component
```typescript
export function SidebarItem({ 
  icon, 
  text, 
  href, 
  active, 
  alert, 
  badge, // ✅ NOUVEAU
  onClick 
}: SidebarItemProps) {
  // ...
  
  const content = (
    <>
      {/* Badge compteur */}
      {badge && badge > 0 && (
        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] text-center shadow-lg animate-pulse">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      
      {/* Alerte si pas de badge */}
      {alert && (!badge || badge === 0) && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse ring-2 ring-white shadow-lg"></div>
      )}
    </>
  );
}
```

**Améliorations** :
- ✅ Affiche un badge rouge avec le nombre
- ✅ Badge > 99 → "99+"
- ✅ Animation pulse pour l'attention
- ✅ Point d'alerte en fallback

---

### 3. **app/dashboard/layout.tsx** ✏️ MODIFIÉ

#### Import du hook
```typescript
import { useNotifications } from "@/hooks/useNotifications";
```

#### Utilisation dans le component
```typescript
export default function DashboardLayout({ children }: any) {
  const { user, isLoading, isLoggingOut } = useAuth();
  const { count: notifCount } = useNotifications(); // ✅ Hook

  return (
    <Sidebar>
      {/* ... autres items ... */}
      
      {/* ✅ Notifications avec badge dynamique */}
      <SidebarItem 
        icon={<Bell size={20} />} 
        text="Notifications" 
        href="/dashboard/notifications"
        badge={notifCount} // ✅ Afficher le nombre
      />
    </Sidebar>
  );
}
```

---

## 🔌 INTÉGRATION COMPLÈTE

### Flux de données

```
1. Component Monte
   ↓
2. useNotifications() s'exécute
   ├─ Fetch /api/notifications
   ├─ Parse les données
   ├─ Filtre les non-lues
   └─ setCount(nonLues)
   ↓
3. DashboardLayout reçoit count
   ↓
4. SidebarItem affiche badge
   ├─ Si count > 0 → badge rouge
   └─ Si count === 0 → point d'alerte
   ↓
5. Toutes les 30s
   └─ Rafraîchissement automatique
```

---

## 📊 EXEMPLE D'UTILISATION

### Données de l'API

```json
// GET /api/notifications
[
  {
    "_id": "667a5b3c8d7f6e4a2b1c9f00",
    "titre": "Nouvelle demande",
    "message": "Jean a soumis une attestation",
    "lu": false, // ✅ Non lue
    "type": "info",
    "createdAt": "2026-01-29T10:30:00Z"
  },
  {
    "_id": "667a5b3c8d7f6e4a2b1c9f01",
    "titre": "Cérémonie approuvée",
    "message": "Votre demande a été validée",
    "lu": true, // Lue
    "type": "success",
    "createdAt": "2026-01-28T15:45:00Z"
  }
]

// ✅ Count = 1 (une notification non lue)
```

### Affichage dans le Sidebar

```
┌─────────────────────────┐
│ 🔔 Notifications    ① ← Badge rouge avec "1"
└─────────────────────────┘
```

---

## 🎨 STYLING DES BADGES

### Badge avec nombre
```css
/* Classe CSS appliquée automatiquement */
px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold 
rounded-full min-w-[20px] text-center shadow-lg 
animate-pulse
```

**Résultat** :
- 🔴 Rond rouge
- ✨ Animé (pulse)
- 🔤 Texte blanc et gras
- 📏 Responsive

### Point d'alerte (fallback)
```css
w-3 h-3 bg-red-500 rounded-full animate-pulse 
ring-2 ring-white shadow-lg
```

**Résultat** :
- 🔴 Petit point rouge
- ✨ Animé
- 🎯 Visible mais discret

---

## 🔄 REFRESH MANUEL

Si vous voulez rafraîchir manuellement les notifications :

```typescript
// Dans un composant
const { count, refresh } = useNotifications();

// Appeler manuellement
<button onClick={refresh}>
  Rafraîchir
</button>
```

---

## ⚙️ CONFIGURATION

### Changer l'intervalle de rafraîchissement

```typescript
// Dans useNotifications.ts
// Actuellement : 30 secondes
const interval = setInterval(fetchCount, 30000);

// Changer pour 10 secondes :
const interval = setInterval(fetchCount, 10000);

// Ou désactiver le refresh automatique :
// (Commenter la ligne d'interval)
```

### Changer le seuil d'affichage du "99+"

```typescript
// Dans SidebarItem
{badge > 99 ? '99+' : badge}

// Changer le seuil :
{badge > 999 ? '999+' : badge} // Affiche jusqu'à 999
```

---

## 🔒 PERMISSIONS

Les notifications respectent les permissions :

### Utilisateur régulier
```typescript
// utils/permission.ts
utilisateur: [
  "voir_mes_notifications",
  "marquer_mes_notifications_comme_lues",
]
```

### Admin
```typescript
admin: [
  "voir_toute_notification",
  "creer_toute_notification",
  "modifier_toute_notification",
  "supprimer_toute_notification",
  "marquer_toute_notification_comme_lue",
]
```

### Dans le layout
```typescript
{(can("voir_toute_notification") || can("voir_mes_notifications")) && (
  <SidebarItem 
    icon={<Bell size={20} />} 
    text="Notifications" 
    href="/dashboard/notifications"
    badge={notifCount}
  />
)}
```

---

## 🧪 TESTING

### Test local

1. **Créer des notifications** :
   - Via l'API : POST /api/notifications
   - Via l'admin panel

2. **Vérifier le badge** :
   - Sidebar affiche le nombre
   - Badge est rouge et pulse
   - "99+" au-delà de 99

3. **Tester le refresh** :
   - Attendre 30s
   - Badge se met à jour
   - Ou cliquer un bouton de refresh

4. **Marquer comme lu** :
   - Aller sur /dashboard/notifications
   - Cliquer sur une notification
   - Badge doit diminuer

---

## 🐛 TROUBLESHOOTING

### Badge ne s'affiche pas

**Vérifier** :
- [ ] API `/api/notifications` fonctionne
- [ ] Hook `useNotifications` est importé
- [ ] `badge={notifCount}` passé à `SidebarItem`
- [ ] Pas d'erreur console

```bash
# Tester l'API
curl http://localhost:3000/api/notifications \
  -H "Cookie: token=..."
```

### Badge ne se met pas à jour

**Vérifier** :
- [ ] Intervalle de 30s s'est écoulé
- [ ] Cliquer "refresh" manuellement
- [ ] Pas d'erreur réseau
- [ ] `cache: 'no-store'` présent

```typescript
// Forcer le refresh
const { refresh } = useNotifications();
refresh(); // Appel manuel
```

### Trop de requêtes API

**Réduire le refresh** :
```typescript
// De 30 secondes à 60 secondes
const interval = setInterval(fetchCount, 60000);
```

---

## 🚀 PROCHAINES ÉTAPES

1. **WebSockets** : Real-time notifications (vs polling)
2. **Notifications sonores** : Alerte auditive
3. **Desktop notifications** : Push notifications
4. **Groupement** : Regrouper les notifications similaires
5. **Filtrage** : Trier par type/date

---

## 📞 RÉFÉRENCES

- **Hook** : [hooks/useNotifications.ts](../hooks/useNotifications.ts)
- **Component** : [components/sidebar.tsx](../components/sidebar.tsx)
- **Layout** : [app/dashboard/layout.tsx](../app/dashboard/layout.tsx)
- **API** : `/api/notifications`
- **Permissions** : [utils/permission.ts](../utils/permission.ts)

