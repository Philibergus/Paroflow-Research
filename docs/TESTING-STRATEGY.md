# 🧪 Stratégie de Tests Paroflow

## Philosophie VibeCoding Adaptée

### Principes Fondamentaux
- **Simple et Fiable** : Tests qui détectent vraiment les problèmes
- **Économique en Tokens** : Maximum d'efficacité, minimum de complexité
- **Feedback Rapide** : Détection immédiate des régressions
- **Accessible à Claude** : Logs et rapports lisibles par l'IA

---

## 🎯 Stack de Tests

### 1. Tests Core (Playwright)
```bash
npm run test:core          # Tests essentiels de rendu
npm run test:ui            # Interface graphique debugging
```

**Couvrent :**
- Chargement sans erreur JavaScript
- Rendu de toutes les pages principales 
- Navigation fonctionnelle
- Composants avec Error Boundaries

### 2. Console Monitoring
```bash
npm run monitor            # Capture logs navigateur en temps réel
npm run debug:logs         # Affiche dernier rapport JSON
```

**Capture :**
- `console.log/error/warn` automatiquement
- Erreurs JavaScript (pageerror)
- Échecs de requêtes réseau
- Stack traces complètes

### 3. Health Check Global
```bash
npm run health-check       # Monitor + Tests core combinés
```

---

## 📊 Système de Logs pour Claude

### Fichiers Générés
```
tests/logs/
├── browser-console.json     # Logs temps réel navigateur
├── latest-report.json       # Rapport santé application
└── latest-test-session.json # Logs session de tests
```

### Format des Logs
```json
{
  "timestamp": "2025-08-02T08:30:00.000Z",
  "type": "error|warning|info",
  "message": "Description erreur",
  "location": { "url": "...", "line": 42 },
  "context": "composant/page concerné"
}
```

### Accès pour Claude
1. **Logs temps réel** : `cat tests/logs/latest-report.json`
2. **Erreurs localStorage** : Sauvées automatiquement par ErrorBoundary
3. **Screenshots** : Auto-générés sur échec de tests

---

## 🚨 Error Boundaries Intelligents

### Déployés sur :
- Chaque route principale (`/`, `/dental`, `/patients`, etc.)
- Composants complexes (DentalChart, Timeline)
- Hooks de données (usePatients, useTraitements)

### Fonctionnalités :
- **Fallback gracieux** : Interface dégradée mais fonctionnelle
- **Logging automatique** : Erreurs sauvées pour Claude
- **Mode dev** : Stack traces détaillées
- **Recovery** : Boutons "Réessayer" et "Recharger"

---

## 🔧 Workflow de Debugging

### 1. Détection Automatique
```bash
# Lance monitoring en continu
npm run monitor

# Tests sur chaque commit
npm run test:core
```

### 2. Investigation Claude
```bash
# Claude peut lire ces fichiers directement :
cat tests/logs/latest-report.json
cat tests/logs/latest-test-session.json

# Ou utiliser :
npm run debug:logs
```

### 3. Correction Ciblée
- Logs pointent vers ligne/composant exact
- Stack traces complètes disponibles
- Context d'erreur (quelle page, quel action)

---

## 📈 Métriques de Santé

### Green Flags ✅
- 0 erreur JavaScript sur pages principales
- Temps de chargement < 3s
- Tous les composants s'affichent
- Navigation fluide

### Red Flags 🚨
- Erreurs console répétées
- Pages blanches/vides
- Requêtes API échouées
- Components qui ne se montent pas

---

## 💡 Bonnes Pratiques Spécifiques

### Pour les Composants
```tsx
// Toujours wrapper dans ErrorBoundary
<ErrorBoundary context="DentalChart">
  <DentalChart patientId={id} />
</ErrorBoundary>
```

### Pour les Hooks
```tsx
// Toujours prévoir fallback
const usePatients = () => {
  try {
    const { data, error } = useQuery('/api/patients')
    return data || MOCK_PATIENTS
  } catch (err) {
    console.error('usePatients error:', err)
    return MOCK_PATIENTS
  }
}
```

### Pour les Imports
```tsx
// Vérifier exports explicitement
import { Activity, Search } from 'lucide-react'
// Éviter les imports * ou destructuring complexe
```

---

## 🎯 Tests Minimalistes mais Efficaces

### Tests à NE PAS Écrire
- Tests unitaires de chaque fonction
- Tests de CSS/styling détaillés  
- Tests de logique métier complexe
- Mocks exhaustifs

### Tests à ÉCRIRE
- **Smoke tests** : Pages se chargent sans erreur
- **Happy path** : Navigation principale fonctionne
- **Error boundaries** : Composants récupèrent des erreurs
- **Console propre** : Pas d'erreurs JavaScript

### ROI Maximum
- **20% effort, 80% détection bugs**
- **Détection rapide régressions majeures**
- **Logs accessibles à Claude pour debug**
- **Minimal maintenance required**

---

## 🚀 Commandes Rapides

```bash
# Debugging quotidien
npm run health-check       # Vérification complète
npm run monitor           # Monitoring continu 

# Development
npm run test:core         # Tests essentiels
npm run debug:logs        # Voir erreurs récentes

# Emergency debugging
npm run test:debug        # Mode debug interactif
cat tests/logs/latest-report.json  # Logs pour Claude
```

Cette stratégie garantit une détection rapide des bugs avec un effort minimal, tout en fournissant à Claude toutes les informations nécessaires pour un debugging efficace.