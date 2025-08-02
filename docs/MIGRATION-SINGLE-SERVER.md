# 🔄 Guide de Migration vers Single Server

## Problème Actuel
Paroflow utilise actuellement une architecture dual-server complexe :
- Backend Next.js sur port 3000
- Frontend Vite sur port 8080 avec proxy

Cette configuration nécessite 2 terminaux et complique le développement/déploiement.

## Solution Proposée
Migration vers un seul serveur Next.js full-stack avec serving des assets React.

## Étapes de Migration

### 1. Préparation
```bash
# Backup de la configuration actuelle
cp next.config.js next.config.js.backup
cp vite.config.ts vite.config.ts.backup
cp package.json package.json.backup
```

### 2. Configuration Next.js Unifiée
```bash
# Remplacer la configuration
cp next.config.unified.js next.config.js
```

### 3. TypeScript Configuration
Unifier les configs TypeScript :
```bash
# Merger tsconfig.backend.json dans tsconfig.json
# Ajouter les paths pour @/* alias
```

### 4. Scripts Package.json
Simplifier les scripts :
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:studio": "prisma studio"
  }
}
```

### 5. Page SPA Next.js
Créer `app/spa/page.tsx` qui serve l'app React :
```typescript
import { ReactSPA } from '@/src/App'

export default function SPAPage() {
  return <ReactSPA />
}
```

### 6. Migration des Assets
```bash
# Déplacer assets publics
mv src/assets/* public/
```

### 7. Update Imports
Mettre à jour tous les imports pour pointer vers les nouveaux paths.

## Avantages

### ✅ Simplicité Opérationnelle
- Un seul serveur à lancer
- Un seul processus de build
- Configuration unifiée

### ✅ Déploiement Facilité
- Une seule image Docker
- Un seul domaine nécessaire
- Pas de configuration CORS

### ✅ Performance
- Pas de proxy overhead
- Server-side rendering possible
- Assets optimisés par Next.js

### ✅ Développement
- Un seul terminal
- Hot reload unifié
- Debugging simplifié

## Inconvénients Temporaires

### ⚠️ Migration Effort
- Modification de nombreux fichiers
- Tests nécessaires
- Période d'adaptation

### ⚠️ Flexibilité
- Moins de séparation stricte front/back
- Couplage plus fort des déploiements

## Plan d'Implémentation

### Phase 1 - Préparation (30 min)
1. Backup configurations
2. Tests de l'état actuel
3. Branch dédiée migration

### Phase 2 - Configuration (45 min)
1. Next.js config unifiée
2. TypeScript merge
3. Package.json simplification

### Phase 3 - Code Migration (60 min)
1. Page SPA Next.js
2. Update imports
3. Assets migration

### Phase 4 - Tests (30 min)
1. Tests fonctionnels
2. Performance check
3. Rollback si nécessaire

## Commandes de Test

```bash
# Avant migration
npm run dev  # 2 serveurs

# Après migration
npm run dev  # 1 serveur sur :3000

# Vérifications
curl http://localhost:3000/api/patients  # API
curl http://localhost:3000/dental        # Frontend
```

## Rollback Strategy

Si problèmes :
```bash
# Restaurer configurations
cp next.config.js.backup next.config.js
cp vite.config.ts.backup vite.config.ts  
cp package.json.backup package.json

# Relancer ancien système
npm run dev:api & npm run dev:frontend
```

## Décision

**Recommandation** : Reporter cette migration après stabilisation du code métier.
**Priorité** : Moyenne (amélioration DevX, pas critique)
**Timeline** : Prochaine session de refactoring

Cette migration améliore significativement l'expérience développeur mais n'est pas critique pour les fonctionnalités métier.