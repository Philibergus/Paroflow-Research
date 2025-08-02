# 🦷 Paroflow - Système de Gestion Dentaire

> **Application moderne de gestion pour cabinets de parodontologie et implantologie**

Paroflow est un système complet développé avec React 18, Next.js 15 et une architecture clean pour optimiser la gestion des cabinets dentaires spécialisés.

## 🚀 Démarrage Rapide

```bash
# Installation
git clone https://github.com/votre-repo/paroflow.git
cd Paroflow && npm install

# Développement
npm run dev          # Lance backend (:3000) + frontend (:8080)

# Base de données
npm run db:push      # Initialiser la DB
npm run db:seed      # Données de test
```

**Interface** : http://localhost:8080/dental

## ✨ Fonctionnalités Principales

- 🔍 **Recherche intelligente** patients (Ctrl+K)
- 🦷 **Schéma dentaire** interactif (32 dents FDI)
- ⏱️ **Timeline traitements** avec scénarios prédéfinis
- 📋 **Files d'attente** parodontie/implantologie/urgence
- 📊 **Dashboard** temps réel avec statistiques

## 🏗️ Architecture

### Stack Technique
- **Frontend**: React 18 + TypeScript + Vite + shadcn/ui
- **Backend**: Next.js 15 + Prisma + SQLite
- **State**: TanStack Query + React Hook Form
- **Tests**: Playwright E2E

### Structure Clean
```
Paroflow/
├── lib/shared-types.ts    # 🎯 Types unifiés front/back
├── app/                   # Backend Next.js + API
├── src/                   # Frontend React
│   ├── components/
│   │   ├── patients/      # Domaine patients
│   │   ├── dental/        # Domaine dentaire
│   │   ├── queue/         # Files d'attente
│   │   └── common/        # Composants partagés
│   └── views/             # Pages principales
├── prisma/                # DB schema + seed
└── docs/                  # Documentation
```

### Points Forts
- ✅ **Types unifiés** : Une source de vérité pour front/back
- ✅ **Composants par domaine** : Organisation claire et maintenable
- ✅ **API standardisée** : Patterns consistants avec pagination
- ✅ **Tests E2E** : Couverture Playwright du workflow principal

## 🔧 Commandes Essentielles

```bash
# Développement
npm run dev              # Dual server (recommandé)
npm run dev:api         # Backend seul (:3000)
npm run dev:frontend    # Frontend seul (:8080)

# Base de données
npm run db:studio       # Interface Prisma
npm run db:seed         # Reset données test

# Tests & Build
npm run test            # Tests Playwright
npm run build           # Build production
```

## 🧬 Modèles Métier

```prisma
Patient              # Infos patient + relations
├── Traitement[]     # Traitements avec étapes
├── CharteDentaire[] # État de chaque dent
├── FileAttente[]    # Historique files d'attente
└── RendezVous[]     # Planning RDV

Correspondant        # Réseau médical
ScenarioType         # Workflows cliniques
```

## 📋 Module Principal : Gestion Dentaire

**Route** : `/dental`

### Workflow Type
1. **Recherche patient** (auto-suggestion)
2. **Sélection** → Vue patient détaillée
3. **Schéma dentaire** ↔ **Timeline traitements**
4. **Ajout file d'attente** → Planification

### Scénarios Cliniques Intégrés
- Maintenance parodontale (3-6-12 mois)
- Implantologie simple/complexe
- Traitement parodontal complet
- Orthodontie adulte

## 🎯 Roadmap

### ✅ Implémenté (v2.0)
- Module dentaire complet
- CRUD patients/correspondants/traitements
- Recherche intelligente + navigation
- Tests E2E Playwright

### 🔄 En Cours
- Migration types unifiés (lib/shared-types.ts)
- Refactoring architecture clean
- Documentation technique

### 📋 Prochaines Sessions
1. **Tests browser** + corrections UX
2. **Migration PostgreSQL** (recherche full-text)
3. **Upload documents** (PDF, radios)
4. **Rapports automatisés** + statistiques

## 🛠️ Architecture Review - Améliorations Récentes

### ✅ Types Unifiés
- Création `lib/shared-types.ts` : 300+ lignes de types partagés
- Suppression duplication frontend/backend
- Import unifié dans `src/lib/api.ts`

### ✅ Structure Clean
- Composants organisés par domaine métier
- Index files pour exports propres
- Documentation technique centralisée dans `docs/`

### ✅ Documentation Moderne
- `docs/ARCHITECTURE.md` : Vue d'ensemble technique
- Suppression folders de recherche (`analysis/`, `deep_research/`)
- Guide migration single-server préparé

## 📚 Documentation

- `docs/ARCHITECTURE.md` - Architecture détaillée
- `docs/GUIDE-REPRISE.md` - Guide développement
- `CLAUDE.md` - Instructions Claude Code

---

**Paroflow v2.0** - Architecture clean et moderne  
**Dernière mise à jour** : 2 août 2025