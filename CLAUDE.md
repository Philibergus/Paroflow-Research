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

### Architecture IA Hybride v3.0 ✅
- **Frontend** : React 18 + TypeScript + Vite (port 8080)
- **Backend** : Next.js 15 + Prisma + SQLite (port 3001)
- **UI** : shadcn/ui + Tailwind CSS médical
- **IA Locale** : Ollama avec 3 modèles optimisés (11GB total)
- **Email** : OAuth2 Gmail + Nodemailer intégré
- **Types** : Unifiés dans `/lib/shared-types.ts`
- **Structure** : Modulaire par domaine métier

### Modules Fonctionnels ✅
- **Gestion Dentaire** (`/dental`) - Module révolutionnaire avec :
  - Schéma dentaire interactif (32 dents FDI)
  - Timeline avec 5 scénariotypes cliniques
  - File d'attente parodontie/implantologie
  - Recherche intelligente patients
- **Module Implants** (`/implants`) - Base de données complète :
  - **3 marques** : Nobel Biocare, Straumann, Biotech Dental
  - **110+ références implants** avec codes de commande exacts
  - **56 composants prothétiques** (vis, piliers, Multi-Units)
  - **Gestion stock automatisée** avec alertes et traçabilité
  - **Sélecteur intelligent** : Marque → Système → Diamètre → Longueur
- **Module IA & OCR** (`/ai`) - **NOUVEAU** Intelligence artificielle locale :
  - **OCR intelligent** avec correction automatique par IA
  - **Classification documents** (ordonnance, compte-rendu, courrier)
  - **Templates email** générés intelligemment
  - **Tri automatique** to-do lists par priorité médicale
- **Module Email** (`/email`) - **NOUVEAU** Communication intégrée :
  - **OAuth2 Gmail** sécurisé (tokens chiffrés)
  - **Templates automatiques** : Rappels, ordonnances, comptes-rendus
  - **Envoi depuis l'app** avec variables patient dynamiques
  - **Multi-comptes** avec gestion centralisée
- **Patients** (`/patients`) - CRUD complet avec email intégré
- **Correspondants** (`/correspondants`) - Réseau médical avec communication
- **Paramètres** (`/settings`) - **NOUVEAU** Configuration email et IA
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

### Vérifier Installation
```bash
# Vérifier service Ollama actif
ollama list

# Tester un modèle
ollama run llama3.2:3b-instruct-q6_K "Bonjour, comment ça va ?"

# Logs Ollama (si problème)
journalctl -u ollama -f
```

## 📧 SYSTÈME EMAIL INTÉGRÉ

### Configuration Gmail OAuth2
1. **Suivre le guide** : `/docs/GUIDE-EMAIL-GMAIL.md`
2. **Google Cloud Console** : Créer projet + OAuth2 credentials
3. **Variables d'environnement** : Copier `.env.example` → `.env`
4. **Interface Paroflow** : Paramètres → Configuration Email

### Fonctionnalités Email
- **Envoi depuis patients** : Bouton email dans liste patients
- **Templates automatiques** : Rappels RDV, ordonnances, comptes-rendus
- **Variables dynamiques** : {patient_nom}, {rdv_date}, {praticien}
- **Multi-comptes** : Gmail, Outlook (prochainement)
- **Sécurité** : Tokens OAuth2 chiffrés en base

### Test Email (sans envoi réel)
```bash
# Test configuration
pnpm test:email

# Logs email
cat logs/email-debug.log
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

## 🎯 NOUVELLES FONCTIONNALITÉS DISPONIBLES

### ✅ IA Locale Ollama (Prêt à l'utilisation)
- **OCR intelligent** : Upload image → Correction automatique des erreurs
- **Classification auto** : Documents triés par type (patient/correspondant/commercial)
- **Templates IA** : Emails personnalisés générés intelligemment
- **Tri automatique** : To-do lists organisées par priorité médicale
- **Coût** : 0€ (tout en local, données sécurisées)

### ✅ Système Email Gmail (Prêt après config)
- **OAuth2 sécurisé** : Configuration simple via guide utilisateur
- **Envoi depuis l'app** : Boutons email dans liste patients
- **Templates prêts** : Rappels RDV, ordonnances, comptes-rendus
- **Variables dynamiques** : Personnalisation automatique patient
- **Multi-comptes** : Gestion centralisée de plusieurs emails

### 📝 Configuration Nécessaire
1. **Gmail OAuth2** : Suivre `/docs/GUIDE-EMAIL-GMAIL.md` (5 min)
2. **Variables env** : Copier `.env.example` → `.env`
3. **Test IA** : Tester OCR upload dans interface

## 🎯 OBJECTIFS PROCHAINES SESSIONS

### Immédiat
1. **Tests utilisateur IA** : OCR + Classification sur vrais documents
2. **Configuration email** : Gmail OAuth2 + premiers envois
3. **Optimisations UX** : Retours sur nouveaux modules

### Court Terme
1. **Dictée vocale** : Whisper local + parsing médical intelligent
2. **Autres providers email** : Outlook, Yahoo, SMTP générique
3. **IA avancée** : Recommandations implants contextuelles

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

**Version** : Paroflow v3.0 - IA Hybride + Email Intégré  
**Status** : ✅ Production Ready - IA locale + Communication automatisée  
**Dernière Update** : 2 août 2025

## 🔗 LIENS RAPIDES

- **Guide Email Gmail** : [/docs/GUIDE-EMAIL-GMAIL.md](/docs/GUIDE-EMAIL-GMAIL.md)
- **Tests Ollama** : `ollama list` et `ollama run llama3.2:3b-instruct-q6_K`
- **Interface Paramètres** : http://localhost:8080/settings
- **OCR Intelligent** : Upload dans formulaires Patient/Correspondant
- **Envoi Email** : Boutons dans liste patients (si email configuré)