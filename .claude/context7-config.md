# 🧠 CONTEXT7 MCP - CONFIGURATION PAROFLOW

## ✅ Configuration Actuelle
Context7 est installé et connecté : `npx @upstash/context7-mcp`

## 🎯 Meilleures Pratiques pour Paroflow

### 1. **Usage Optimal dans les Prompts**

Ajoutez simplement **"use context7"** dans vos prompts pour obtenir la documentation à jour :

#### Exemples pour Paroflow :
```
# Pour les fonctionnalités React/Next.js
"Améliorer le composant PatientForm avec validation. use context7"

# Pour Prisma/Base de données
"Optimiser les requêtes Prisma pour les patients. use context7"

# Pour les librairies UI
"Implémenter un composant shadcn/ui complexe. use context7"

# Pour les API médicales
"Intégrer l'API FHIR pour dossiers patients. use context7"
```

### 2. **Technologies Clés à Documenter**

Context7 sera particulièrement utile pour ces technologies du projet :
- **Next.js 15** - API Routes, App Router
- **React 18** - Hooks, Server Components  
- **Prisma** - Queries, Relations, Migrations
- **TypeScript** - Types avancés, Génériques
- **shadcn/ui** - Components, Theming
- **React Query (TanStack)** - Cache, Mutations
- **Zod** - Validation schemas

### 3. **Workflow de Développement**

#### Début de session :
```
1. /init → lit CLAUDE.md et GUIDE-REPRISE.md
2. "Vérifier les dernières versions des dépendances. use context7"
3. Continuer avec les todos en cours
```

#### Pendant le développement :
```
# Toujours ajouter "use context7" pour :
- Nouvelles fonctionnalités
- Résolution de bugs
- Mise à jour de dépendances
- Patterns architecturaux
```

### 4. **Commandes Utiles**

#### Vérifier la connexion :
```bash
claude mcp list
# Doit afficher : context7: npx @upstash/context7-mcp - ✓ Connected
```

#### En cas de problème :
```bash
# Réinstaller avec version spécifique
claude mcp remove context7
claude mcp add context7 npx @upstash/context7-mcp@latest

# Alternative avec Bun (plus rapide)
claude mcp add context7 bunx -y @upstash/context7-mcp@latest
```

### 5. **Patterns Spécifiques Paroflow**

#### Pattern 1 : Documentation médicale
```
"Implémenter [fonctionnalité médicale] en suivant les standards HIPAA. use context7"
```

#### Pattern 2 : Optimisation performance
```
"Optimiser les requêtes pour 300 patients/an. use context7"
```

#### Pattern 3 : UI/UX médical
```
"Créer interface tablet-friendly pour consultation. use context7"
```

### 6. **Intégration avec Subagents**

Lors de l'utilisation de subagents, incluez toujours Context7 :
```
Task: "backend-architect agent: Améliorer l'architecture API. use context7"
Task: "typescript-pro agent: Typer les données médicales. use context7"
```

## 🚨 Points d'Attention

1. **Token Limit** : Context7 retourne max 5000 tokens par défaut
2. **Performance** : Utilisez seulement quand nécessaire (nouvelles features, bugs)
3. **Cache** : Les docs sont cachées pendant la session

## 📊 Métriques de Succès

- ✅ Moins d'erreurs de versions obsolètes
- ✅ Code aligné avec les dernières best practices
- ✅ Résolution de bugs plus rapide
- ✅ Patterns architecturaux à jour

## 🔄 Maintenance

Vérifier régulièrement :
```bash
# Mise à jour Context7
npm update -g @upstash/context7-mcp

# Vérifier santé
claude mcp list
```

---
*Configuration optimisée pour Paroflow - Dental Practice Management System*