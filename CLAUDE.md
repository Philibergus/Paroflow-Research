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

## 🤖 STRATÉGIE IA HYBRIDE - APPROCHE MINIMALISTE

### Philosophie : "IA seulement quand nécessaire"
**Principe fondamental** : Si une tâche peut être réalisée parfaitement sans IA (calculs, requêtes DB, logique métier), on n'utilise **JAMAIS** d'IA.

### Architecture à 3 Niveaux

#### 1️⃣ **Sans IA (80% des cas)** - Coût : 0€
- ✅ Calculs médicaux (doses, prix, stocks)
- ✅ Requêtes base de données
- ✅ Logique métier déterministe
- ✅ Validation formulaires
- ✅ Navigation et routage
- ✅ Gestion des états React
- ✅ Export PDF/Excel basique

#### 2️⃣ **IA Locale avec Ollama (15% des cas)** - Coût : 0€
```bash
# Modèles installés localement (32GB RAM)
- Llama 3.2:3b        # 2GB - Tâches ultra-rapides (<1s)
- Mistral 7B:Q6       # 5GB - Français médical excellent
- Phi-3.5:mini        # 3GB - Classification et tri
```

**Cas d'usage IA locale** :
- OCR amélioré (correction après Tesseract)
- Classification documents (ordonnance vs compte-rendu)
- Templates emails personnalisés
- Tri intelligent to-do lists
- Suggestions basiques (sans contexte médical complexe)

#### 3️⃣ **IA Cloud API (5% des cas)** - Coût : ~7€/mois
**Uniquement pour** :
- Dictée médicale complexe avec contexte
- Génération compte-rendus chirurgicaux détaillés
- Analyse de cas cliniques ambigus
- Recommandations critiques nécessitant expertise

### Routing Intelligent - Décision Automatique

```typescript
// lib/ai/routing.ts
function shouldUseAI(task: string): AILevel {
  // Pas d'IA si résultat déterministe
  if (isDeterministic(task)) return AILevel.NONE
  
  // IA locale si simple et non-critique
  if (isSimple(task) && !isCritical(task)) return AILevel.LOCAL
  
  // API seulement si complexe ET critique
  if (isComplex(task) && isCritical(task)) return AILevel.API
  
  return AILevel.NONE // Par défaut : pas d'IA
}
```

### Sécurité RGPD/HIPAA Stricte

```typescript
// JAMAIS de données patient vers API externes
// Anonymisation OBLIGATOIRE si API nécessaire
patient: "Mme Bertrand, 45 ans" → "[PATIENT_F_45]"
implant: "Nobel 4.3×10 pos 26" → "[IMPLANT_TYPE_A]"
```

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

## 🔧 COMMANDES IA LOCALE (OLLAMA)

### Installation et Configuration
```bash
# Installation Ollama (une seule fois)
curl -fsSL https://ollama.com/install.sh | sh

# Télécharger modèles optimisés pour Paroflow
ollama pull llama3.2:3b-instruct-q6_K    # 2GB - Ultra-rapide
ollama pull mistral:7b-instruct-q6_K      # 5GB - Français médical
ollama pull phi3.5:3.8b-mini-instruct-q6_K # 3GB - Classification

# Vérifier modèles installés
ollama list

# Lancer service Ollama (si pas déjà actif)
ollama serve
```

### Configuration Système Recommandée
```bash
# Allocation mémoire optimale (32GB total)
export OLLAMA_MAX_LOADED_MODELS=2      # Max 2 modèles simultanés
export OLLAMA_NUM_PARALLEL=2           # 2 requêtes parallèles max
export OLLAMA_HOST=127.0.0.1:11434    # Local uniquement
```

## 🧪 SYSTÈME DE TESTS ET DEBUG

### Tests Automatiques
```bash
pnpm monitor              # Monitoring rapide (30s)
pnpm test:core            # Tests essentiels Playwright
pnpm health-check         # Check complet monitoring + tests
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

## 📦 GESTIONNAIRE DE PAQUETS : PNPM

**IMPORTANT** : Utiliser **PNPM** exclusivement (pas NPM/Yarn)
```bash
# Installation PNPM si nécessaire
npm install -g pnpm

# Installer dépendances
pnpm install

# Ajouter une dépendance
pnpm add [package]

# Ajouter une dépendance dev
pnpm add -D [package]
```

### Avantages PNPM
- ⚡ **3x plus rapide** que NPM
- 💾 **50% moins d'espace disque** (liens symboliques)
- 🔒 **Dépendances strictes** (pas de fantômes)
- ✅ **Compatible** avec package.json existant

## 🔧 Commandes de Développement

### Serveurs
```bash
pnpm dev:frontend         # Frontend Vite (port 8080)
pnpm dev:api              # Backend Next.js (port 3001)
pnpm dev                  # Les deux simultanément
```

### Base de Données
```bash
pnpm db:studio            # Interface graphique Prisma
pnpm db:push              # Appliquer schéma
pnpm db:seed              # Données de test patients
pnpm db:seed:realistic    # Données patients réelles anonymisées
pnpm tsx prisma/seed-implants.ts    # Catalogue implants complet
pnpm tsx prisma/seed-composants.ts  # Composants prothétiques
```

### Production
```bash
pnpm build                # Build complet
pnpm lint                 # Vérification code
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
1. **Toujours commencer par** : `pnpm monitor`
2. **Lire les logs** : `cat tests/logs/latest-simple-report.txt`
3. **Identifier le problème** précisément
4. **Corriger** avec les types unifiés
5. **Valider** avec `pnpm monitor`

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