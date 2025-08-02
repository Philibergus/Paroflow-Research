# CLAUDE.md

Ce fichier guide Claude Code pour travailler efficacement sur le projet Paroflow.

## 🚨 PREMIÈRE CHOSE À FAIRE APRÈS /init

**IMPORTANT** : Lire immédiatement le fichier `GUIDE-REPRISE.md` pour comprendre l'état actuel du projet.

```bash
# Commande prioritaire à chaque session :
Read le fichier GUIDE-REPRISE.md
```

## 🧠 Context7 MCP Server

**IMPORTANT** : Context7 fournit de la documentation à jour.
- Ajoutez **"use context7"** dans vos prompts pour les dernières docs
- Particulièrement utile pour : Next.js 15, React 18, Prisma, TypeScript, shadcn/ui

## 🎯 PAROFLOW - ÉTAT ACTUEL

### Architecture Clean v2.0 ✅
- **Frontend** : React 18 + TypeScript + Vite (port 8080)
- **Backend** : Next.js 15 + Prisma + SQLite (port 3001)
- **UI** : shadcn/ui + Tailwind CSS médical
- **Types** : Unifiés dans `/lib/shared-types.ts`
- **Structure** : Modulaire par domaine métier

### Modules Fonctionnels ✅
- **Gestion Dentaire** (`/dental`) - Module révolutionnaire avec :
  - Schéma dentaire interactif (32 dents FDI)
  - Timeline avec 5 scénariotypes cliniques
  - File d'attente parodontie/implantologie
  - Recherche intelligente patients
- **Module Implants** (`/implants`) - **NOUVEAU** Base de données complète :
  - **3 marques** : Nobel Biocare, Straumann, Biotech Dental
  - **110+ références implants** avec codes de commande exacts
  - **47 composants prothétiques** (vis, piliers, accessoires)
  - **Gestion stock automatisée** avec alertes et traçabilité
  - **Sélecteur intelligent** : Marque → Système → Diamètre → Longueur
- **Patients** (`/patients`) - CRUD complet avec recherche
- **Correspondants** (`/correspondants`) - Réseau médical
- **Dashboard** (`/`) - Statistiques et actions rapides

## 🧪 SYSTÈME DE TESTS ET DEBUG

### Tests Automatiques
```bash
npm run monitor           # Monitoring rapide (30s)
npm run test:core         # Tests essentiels Playwright
npm run health-check      # Check complet monitoring + tests
```

### Debug Intelligent pour Claude
```bash
# Logs accessibles à Claude Code :
cat tests/logs/latest-simple-report.txt     # Rapport lisible
cat tests/logs/simple-monitor-report.json   # Données structurées

# Vérifier erreurs JavaScript :
npm run monitor  # Détecte automatiquement les bugs
```

### Protection Anti-Bugs ✅
- **Error Boundaries** sur chaque route
- **Fallbacks robustes** dans tous les hooks
- **Types unifiés** frontend/backend
- **Monitoring automatique** des erreurs

## 🔧 Commandes de Développement

### Serveurs
```bash
npm run dev:frontend      # Frontend Vite (port 8080)
npm run dev:api           # Backend Next.js (port 3001)
npm run dev               # Les deux simultanément
```

### Base de Données
```bash
npm run db:studio         # Interface graphique Prisma
npm run db:push           # Appliquer schéma
npm run db:seed           # Données de test patients
npm run db:seed:realistic # Données patients réelles anonymisées
npx tsx prisma/seed-implants.ts    # Catalogue implants complet
npx tsx prisma/seed-composants.ts  # Composants prothétiques
```

### Production
```bash
npm run build             # Build complet
npm run lint              # Vérification code
```

## 📁 Structure Propre et Minimaliste

```
Paroflow/
├── lib/shared-types.ts           # 🎯 Types unifiés (source unique)
├── app/                          # Backend Next.js + API REST
├── src/
│   ├── views/                    # Pages principales par domaine
│   │   ├── DentalManagement.tsx  # Module dentaire révolutionnaire
│   │   ├── Dashboard.tsx         # Page d'accueil
│   │   └── Patients.tsx          # Gestion patients
│   ├── components/               # Organisés par domaine
│   │   ├── dental/              # DentalChart, Timeline
│   │   ├── patients/            # PatientForm, Search
│   │   ├── queue/               # PatientQueue
│   │   └── common/              # Layout, CommandBar, ErrorBoundary
│   └── hooks/                   # React Query avec fallbacks
├── tests/                       # Tests E2E + Monitoring
└── docs/                        # Documentation technique
```

## 🚀 WORKFLOW CLAUDE CODE

### Diagnostic Automatique
1. **Toujours commencer par** : `npm run monitor`
2. **Lire les logs** : `cat tests/logs/latest-simple-report.txt`
3. **Identifier le problème** précisément
4. **Corriger** avec les types unifiés
5. **Valider** avec `npm run monitor`

### Bonnes Pratiques
- ✅ **Types** : Toujours utiliser `/lib/shared-types.ts`
- ✅ **Imports** : Paths absolus avec `@/`
- ✅ **Composants** : Wrapper dans ErrorBoundary
- ✅ **Hooks** : Prévoir fallbacks MOCK_DATA
- ✅ **Tests** : Valider avec monitoring avant commit

### Agents Spécialisés Disponibles
- **Debugger Agent** : Pour bugs complexes (utilise Opus)
- **Code Reviewer** : Reviews architecture et qualité
- **EPCT Workflow** : Pour nouvelles fonctionnalités majeures
- **TypeScript Pro** : Types avancés et patterns

## 🎯 OBJECTIFS PROCHAINES SESSIONS

### Immédiat
1. **Finaliser tests browser** : Brave/Chrome/Firefox
2. **Scraping correspondants** : Auto-remplissage infos web
3. **Corrections UX** : Retours utilisateur module dentaire

### Court Terme
1. **Migration PostgreSQL** : Recherche full-text native
2. **Gestion documents** : Upload PDF, radios, images
3. **Rapports intelligents** : Génération automatique IA

### Moyen Terme
1. **Application mobile** : Version tablet consultations
2. **Intégration imagerie** : DICOM, radios panoramiques
3. **IA diagnostique** : Assistance traitement et prédictions

## 🧠 ARCHITECTURE VISION LONG TERME

**Paroflow** vise à révolutionner la gestion des cabinets de parodontologie/implantologie avec :
- **IA intégrée** pour diagnostics et planning
- **Workflows spécialisés** par scénariotypes cliniques
- **Interface moderne** tablet-first pour consultations
- **Automatisation complète** tâches administratives

## 🔐 Sécurité et Conformité

- **HIPAA Ready** : Architecture préparée pour données médicales
- **Chiffrement** : Données patients sécurisées
- **Audit Logs** : Traçabilité complète des actions
- **Accès Role-Based** : Permissions par profil médical

---

**Version** : Paroflow v2.0 - Architecture Clean et Système de Tests Robuste  
**Status** : ✅ Opérationnel - Prêt pour développement modules avancés  
**Dernière Update** : 2 août 2025