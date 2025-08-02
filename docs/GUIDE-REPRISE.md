# 🚀 GUIDE DE REPRISE - PAROFLOW

## ⚡ DÉMARRAGE RAPIDE (2 minutes)

### 1. Reprendre le développement
```bash
cd /home/viann/ProjectsDev/Paroflow
claude
# Puis: /init pour recharger le contexte
```

### 2. Lancer l'application
```bash
# Terminal 1 - Backend (port 3000)
npm run dev:api

# Terminal 2 - Frontend (port 8080)  
npm run dev:frontend
```

### 3. Accès rapide
- **App principale**: http://localhost:8080
- **API docs**: http://localhost:3000
- **Base de données**: `npm run db:studio`

## 📊 ÉTAT ACTUEL DU PROJET

### ✅ CE QUI FONCTIONNE
- ✅ **Architecture complète** : Next.js + React + SQLite
- ✅ **Pages fonctionnelles** : Patients, Correspondants, Rapports
- ✅ **API robuste** : Toutes les opérations CRUD
- ✅ **Interface professionnelle** : Design cabinet dentaire
- ✅ **Données de test** : 5 patients, 3 correspondants, 5 traitements

### 🚨 BUG CRITIQUE CONNU
- ❌ **Recherche cassée** : SQLite incompatible avec `mode: 'insensitive'`
- **Fichiers à corriger** : `/app/api/*/route.ts` (supprimer mode insensitive)

### 📋 TODO PRIORITAIRE
1. **Corriger le bug de recherche** (30 min) - SQLite mode insensitive

## 🎯 MODIFICATIONS COMPLÉTÉES ✅

### Dernières modifications (1er août 2025):
1. ✅ **Supprimé** chiffres d'affaires/business du dashboard
2. ✅ **Ajouté** onglet "Statistiques" pour tracker temps équipe
3. ✅ **Ajouté** onglet "Todo" pour pense-bêtes liés aux patients/correspondants
4. ✅ **Configuré** rappels de sauvegarde GitHub automatiques
5. ✅ **Configuré** Context7 MCP Server pour documentation à jour

### 🧠 Context7 MCP Server
- **Status**: ✓ Connected et fonctionnel
- **Usage**: Ajouter **"use context7"** dans vos prompts pour docs à jour
- **Config**: `.claude/context7-config.md`
- **Exemples**: `.claude/context7-usage-examples.md`

## 🔧 COMMANDES UTILES

```bash
# Développement
npm run dev:api          # Backend seul
npm run dev:frontend     # Frontend seul
npm run dev             # Les deux (si configuré)

# Base de données
npm run db:studio       # Interface graphique
npm run db:push         # Appliquer changements schema
npm run db:seed         # Réinitialiser données test

# Build & Test
npm run build           # Build complet
npm run lint            # Vérifier code

# Git
git add . && git commit -m "Description" && git push
```

## 📁 STRUCTURE PROJET

```
Paroflow/
├── app/                    # Backend Next.js
│   ├── api/               # Routes API
│   ├── lib/               # Utilitaires backend
│   └── types/             # Types TypeScript
├── src/                   # Frontend React
│   ├── views/             # Pages principales
│   ├── components/        # Composants UI
│   ├── hooks/             # Hooks React Query
│   └── lib/               # Utilitaires frontend
├── prisma/                # Base de données
│   ├── schema.prisma      # Schéma DB
│   └── seed.ts            # Données test
└── .claude/agents/        # Agents installés
```

## 🚨 RAPPELS IMPORTANTS

### Sauvegardes GitHub
- **TOUJOURS** sauvegarder après gros changements
- **Commande** : `git add . && git commit -m "Description" && git push`
- **Configuré** : Rappel automatique après implémentations importantes

### Tests avant fermeture session
1. `npm run build` - Vérifier que ça compile
2. Tester pages principales en local
3. Git push pour sauvegarder

## 💡 AGENTS DISPONIBLES

Dans `.claude/agents/` :
- **typescript-pro** - Code TypeScript/React
- **backend-architect** - Architecture système  
- **database-admin** - Gestion BDD
- **frontend-developer** - Interface utilisateur
- **test-automator** - Tests et debugging
- **code-reviewer** - Revue de code

## 🎯 PROCHAINE SESSION

**Priorité 1** : Corriger le bug de recherche
**Priorité 2** : Nettoyer dashboard + ajouter Todo/Stats
**Priorité 3** : Tester interface complète

---
*Dernière mise à jour : 1er août 2025*  
*Version : Paroflow v1.0 - Premier module complet*