# 💾 SYSTÈME DE RAPPEL DE SAUVEGARDE

## Configuration pour Claude Code

Ce fichier configure des rappels automatiques de sauvegarde après les implémentations importantes.

### Déclencheurs automatiques :
- Après création/modification de plusieurs fichiers
- Après implémentation de nouvelles fonctionnalités  
- Avant fermeture de session importante
- Sur demande explicite

### Message de rappel standard :
```
🚨 RAPPEL : N'oubliez pas de sauvegarder sur GitHub !
Commandes : git add . && git commit -m "Description" && git push
```

### Instructions pour Claude :
1. Afficher le rappel après toute implémentation > 5 fichiers modifiés
2. Rappeler la sauvegarde avant les conclusions de session
3. Proposer des messages de commit appropriés  
4. Vérifier que les changements sont bien poussés

---
*Activé pour aider l'apprentissage de la programmation*