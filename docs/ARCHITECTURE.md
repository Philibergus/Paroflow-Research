# 🏗️ Architecture Paroflow - Documentation Clean

## 📁 Structure du Projet

```
Paroflow/
├── app/                    # 🎯 Backend Next.js 15
│   ├── api/               # Routes API REST
│   │   ├── patients/      # CRUD patients
│   │   ├── correspondants/# CRUD correspondants
│   │   ├── traitements/   # CRUD traitements + étapes
│   │   ├── chartes-dentaires/ # Gestion schéma dentaire
│   │   └── file-attente/  # Gestion files d'attente
│   ├── lib/               # Utilitaires backend
│   │   ├── prisma.ts      # Client Prisma
│   │   └── api-utils.ts   # Helpers API
│   ├── types/             # Schémas Zod + types backend
│   └── page.tsx           # Page d'accueil API
│
├── src/                   # 🎯 Frontend React 18
│   ├── components/        # Composants organisés par domaine
│   │   ├── patients/      # PatientForm, PatientSearch
│   │   ├── dental/        # DentalChart, Timeline
│   │   ├── queue/         # PatientQueue
│   │   ├── common/        # Layout, CommandBar
│   │   └── ui/            # Composants shadcn/ui
│   ├── views/             # Pages principales
│   │   ├── DentalManagement.tsx # 🌟 Module principal
│   │   ├── Patients.tsx
│   │   └── Correspondants.tsx
│   ├── hooks/             # React Query hooks
│   ├── lib/               # Utilitaires frontend
│   │   ├── api.ts         # Client API unifié
│   │   └── utils.ts       # Helpers
│   └── App.tsx            # Router principal
│
├── lib/                   # 🎯 Types Partagés
│   └── shared-types.ts    # Types unifiés front/back
│
├── prisma/                # 🎯 Base de Données
│   ├── schema.prisma      # 9 modèles métier
│   ├── seed.ts            # Données de test
│   └── dev.db             # SQLite (dev)
│
├── tests/                 # 🎯 Tests E2E
│   └── *.spec.ts          # Tests Playwright
│
└── docs/                  # 📚 Documentation
    ├── ARCHITECTURE.md    # Ce fichier
    ├── README-*.md        # Docs techniques
    └── GUIDE-REPRISE.md   # Guide développement
```

## 🛠️ Stack Technologique

### Frontend
- **React 18** + TypeScript + Vite
- **UI** : shadcn/ui + Tailwind CSS + Lucide React
- **State** : TanStack Query + useState local
- **Forms** : React Hook Form + Zod validation
- **Router** : React Router DOM v6

### Backend
- **Next.js 15** avec App Router
- **Database** : Prisma + SQLite (prod: PostgreSQL)
- **Validation** : Zod schemas
- **API** : REST avec pagination et recherche

### DevOps
- **Tests** : Playwright (E2E)
- **Build** : Vite (frontend) + Next.js (backend)
- **Dual Server** : Port 3000 (API) + 8080 (Frontend)

## 🎯 Architecture Patterns

### 1. Séparation Frontend/Backend
```
Frontend (React/Vite:8080) 
    ↓ HTTP/fetch
Backend (Next.js:3000)
    ↓ Prisma
Database (SQLite/PostgreSQL)
```

### 2. Types Unifiés
```typescript
// lib/shared-types.ts - Source unique de vérité
export interface Patient { id: string; nom: string; ... }

// src/lib/api.ts - Frontend
import { Patient } from '../../lib/shared-types'

// app/types/index.ts - Backend
import { Patient } from '../../lib/shared-types'
```

### 3. Composants par Domaine
```
components/
├── patients/    # Tout ce qui concerne les patients
├── dental/      # Schéma dentaire + traitements
├── queue/       # Files d'attente
└── common/      # Layout + navigation
```

### 4. API REST Standardisée
```typescript
// Pattern uniforme pour tous les endpoints
GET    /api/patients      → Liste paginée
POST   /api/patients      → Création
GET    /api/patients/:id  → Détail
PUT    /api/patients/:id  → Mise à jour
DELETE /api/patients/:id  → Suppression
```

## 🔧 Commandes de Développement

```bash
# Installation
npm install

# Développement (2 terminaux)
npm run dev:api      # Backend sur :3000
npm run dev:frontend # Frontend sur :8080

# Développement (1 terminal)
npm run dev          # Les deux simultanément

# Base de données
npm run db:push      # Appliquer le schéma
npm run db:seed      # Réinitialiser données test
npm run db:studio    # Interface graphique

# Tests
npm run test         # Tests Playwright
npm run test:ui      # Tests avec interface

# Production
npm run build        # Build complet
```

## 🌟 Module Principal : DentalManagement

Le module de gestion dentaire (`/dental`) est le cœur de l'application :

### Fonctionnalités
1. **Recherche Patient** : Auto-suggestion avec raccourcis clavier
2. **Schéma Dentaire** : 32 dents FDI avec statuts/traitements
3. **Timeline Traitements** : Drag & drop + scénarios prédéfinis
4. **File d'Attente** : Parodontie/Implantologie/Suivi/Urgence
5. **Dashboard** : Statistiques et navigation

### Workflow
```
Recherche Patient → Sélection → Vue Patient
    ↓
Schéma Dentaire ← → Timeline Traitements
    ↓
File d'Attente → Planification RDV
```

## 📊 Base de Données

### Modèles Principaux (Prisma)
```prisma
Patient          # Informations patient
├── Traitement   # Traitements avec étapes
├── RendezVous   # Système RDV
├── CharteDentaire # État 32 dents
├── FileAttente  # Gestion files d'attente
└── DocumentPatient # Documents/images

Correspondant    # Réseau médical
ScenarioType     # Workflows cliniques prédéfinis
```

### Relations Clés
- `Patient` → `Traitement[]` → `EtapeTraitement[]`
- `Patient` → `CharteDentaire[]` (une par dent)
- `Patient` → `FileAttente[]` (historique attentes)

## 🚀 Points Forts de l'Architecture

### ✅ Simplicité
- Structure claire par domaine
- Types unifiés front/back
- Patterns consistants

### ✅ Maintenabilité
- Composants modulaires
- API standardisée
- Tests E2E intégrés

### ✅ Extensibilité
- Architecture prête pour nouveaux modules
- Types partagés facilitent l'ajout de fonctionnalités
- Base de données normalisée

### ✅ Performance
- React Query pour cache intelligent
- Pagination sur toutes les listes
- Recherche optimisée

## 🎯 Prochaines Améliorations

### Phase 1 - Optimisations Immédiates
1. **Migration PostgreSQL** : Recherche full-text native
2. **Single Server** : Unification avec Next.js full-stack
3. **Tests unitaires** : Compléter les tests Playwright

### Phase 2 - Fonctionnalités Avancées
1. **Documents/Images** : Upload et visualisation
2. **Statistiques Avancées** : Analytics et rapports
3. **Mobile App** : Version tablet/mobile
4. **IA Integration** : Assistance diagnostique

## 📋 Standards de Code

### TypeScript
- Types stricts activés
- Interfaces plutôt que types pour les objets
- Enums pour les constantes métier

### React
- Hooks personnalisés pour la logique métier
- Props interfaces bien définies
- Gestion d'erreur systématique

### API
- Validation Zod sur tous les endpoints
- Gestion d'erreur uniforme
- Responses standardisées

---

**Dernière mise à jour** : 2 août 2025  
**Architecture conçue pour** : Scalabilité, Maintenabilité, Simplicité