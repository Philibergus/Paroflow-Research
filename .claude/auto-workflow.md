# 🤖 AUTO-WORKFLOW DETECTION

## Système de détection automatique de l'état du projet

### 1. **Détection automatique au démarrage**
```bash
# Claude doit automatiquement :
1. Lire .claude/project-status.json
2. Identifier les todos critiques
3. Checker l'état du build (npm run build)
4. Proposer les prochaines actions
```

### 2. **Workflow de reprise standard**
```bash
# Actions automatiques suggérées :
- Si project-status indique "critical_issues" → Les résoudre en priorité
- Si todos "pending" → Les lister et proposer de continuer
- Si build cassé → Debug et corriger
- Si build OK → Passer aux fonctionnalités suivantes
```

### 3. **Mise à jour automatique du status**
```bash
# Après chaque tâche importante :
1. Mettre à jour project-status.json
2. Marquer les todos comme "completed"
3. Ajouter nouveaux todos si nécessaire
4. Git commit automatique si >5 fichiers modifiés
```

### 4. **Signaux de workflow**

**Signaux "session interrompue"** :
- Todos avec status "in_progress"
- Build qui échoue
- Fichiers modifiés non committés

**Signaux "session complète"** :
- Tous todos "completed"
- Build successful
- Git status clean

### 5. **Actions automatiques suggérées**

**Si critique détecté** :
```
🚨 CRITIQUE: [description]
Temps estimé: [X] min
Fichiers: [liste]
Action suggérée: [solution]
```

**Si développement normal** :
```
✅ Projet stable
Prochaines étapes: [liste]
Action suggérée: [continuer todo suivant]
```

## Usage
Ce système permet à Claude de reprendre intelligemment le travail à tout moment, même en cours de session, en se basant sur l'état réel du projet plutôt que sur des instructions statiques.