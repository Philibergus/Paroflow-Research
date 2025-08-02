# 📧 Guide Configuration Email - Gmail OAuth2

Ce guide vous explique étape par étape comment configurer l'envoi d'emails sécurisé avec Gmail dans Paroflow.

## 🚀 Avantages de Gmail OAuth2

- **Sécurité maximale** : Aucun mot de passe stocké
- **Tokens temporaires** : Accès limité dans le temps
- **Révocation facile** : Désactivation depuis votre compte Google
- **Conformité** : Respect des standards de sécurité Google

## 📋 Prérequis

1. **Compte Gmail actif** : Gmail personnel ou professionnel (Google Workspace)
2. **Accès administrateur** : Pour créer l'application Google Cloud
3. **Paroflow configuré** : Application installée et fonctionnelle

## 🔧 Étape 1 : Configuration Google Cloud Console

### 1.1 Créer un projet Google Cloud

1. Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur **"Nouveau Projet"**
3. Nommez votre projet : `Paroflow-Cabinet-Email`
4. Sélectionnez votre organisation (si applicable)
5. Cliquez sur **"Créer"**

### 1.2 Activer l'API Gmail

1. Dans le menu de gauche, allez à **"APIs & Services" > "Bibliothèque"**
2. Recherchez **"Gmail API"**
3. Cliquez sur **"Gmail API"** puis **"Activer"**

### 1.3 Configurer l'écran de consentement OAuth

1. Allez à **"APIs & Services" > "OAuth consent screen"**
2. Sélectionnez **"External"** (ou "Internal" si Google Workspace)
3. Remplissez les informations obligatoires :
   - **Nom de l'application** : `Paroflow - Gestion Cabinet`
   - **E-mail d'assistance utilisateur** : votre email
   - **Logo de l'application** : (optionnel)
   - **Domaine de l'application** : votre domaine si applicable
   - **E-mail de contact du développeur** : votre email

4. **Étendues (Scopes)** : Ajoutez ces permissions
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/userinfo.email`

5. **Utilisateurs de test** : Ajoutez vos adresses email autorisées

### 1.4 Créer les identifiants OAuth2

1. Allez à **"APIs & Services" > "Identifiants"**
2. Cliquez sur **"+ Créer des identifiants" > "ID client OAuth 2.0"**
3. Type d'application : **"Application Web"**
4. Nom : `Paroflow-Gmail-Client`
5. **URI de redirection autorisés** : 
   - `http://localhost:3001/api/email/auth/gmail/callback` (développement)
   - `https://votre-domaine.com/api/email/auth/gmail/callback` (production)

6. Cliquez sur **"Créer"**
7. **IMPORTANT** : Notez votre **Client ID** et **Client Secret**

## 🔐 Étape 2 : Configuration Paroflow

### 2.1 Variables d'environnement

Créez ou modifiez le fichier `.env` dans le dossier racine de Paroflow :

```bash
# Configuration Gmail OAuth2
GMAIL_CLIENT_ID="votre-client-id.apps.googleusercontent.com"
GMAIL_CLIENT_SECRET="votre-client-secret"
GMAIL_REDIRECT_URI="http://localhost:3001/api/email/auth/gmail/callback"

# Base de données
DATABASE_URL="file:./dev.db"

# Configuration Ollama (déjà configuré)
OLLAMA_HOST="http://127.0.0.1:11434"
```

### 2.2 Redémarrer l'application

```bash
# Arrêter l'application si elle tourne
Ctrl+C

# Redémarrer
pnpm dev
```

## 📱 Étape 3 : Configuration dans l'interface Paroflow

### 3.1 Accéder aux paramètres

1. Ouvrez Paroflow dans votre navigateur : `http://localhost:8080`
2. Cliquez sur **"Paramètres"** dans la sidebar (en bas)
3. Allez à l'onglet **"Configuration Email"**

### 3.2 Configurer Gmail OAuth2

1. Dans la section **"Configuration Gmail (OAuth2)"** :
   - **Nom du compte** : Saisissez `Cabinet Principal` (ou autre nom)
   - Cliquez sur **"Ouvrir la page d'autorisation Gmail"**

2. **Autorisation Google** :
   - Une nouvelle fenêtre s'ouvre sur Google
   - Connectez-vous avec votre compte Gmail
   - **ATTENTION** : Google peut afficher un avertissement car l'app n'est pas vérifiée
   - Cliquez sur **"Paramètres avancés"** puis **"Accéder à Paroflow (dangereux)"**
   - Acceptez les permissions demandées

3. **Code d'autorisation** :
   - Google vous redirige avec un code d'autorisation
   - Copiez ce code (format : `4/0AeaYSHA...`)
   - Retournez dans Paroflow et collez le code
   - Cliquez sur **"Valider"**

### 3.3 Vérification

Si la configuration réussit, vous verrez :
- ✅ Message de succès : `Gmail configuré avec succès pour votre-email@gmail.com`
- Le compte apparaît dans la liste des comptes configurés
- Badge **"Par défaut"** si c'est votre premier compte

## 📤 Étape 4 : Utilisation - Envoyer des emails

### 4.1 Depuis la liste des patients

1. Allez dans **"Patients"**
2. Trouvez un patient avec une adresse email
3. Cliquez sur l'icône **📧** dans la colonne Actions
4. La fenêtre d'envoi d'email s'ouvre automatiquement

### 4.2 Templates disponibles

Paroflow inclut des templates prêts à l'emploi :

- **Rappel de rendez-vous** : Variables `{{patient}}`, `{{date}}`, `{{heure}}`
- **Ordonnance** : Variables `{{patient}}`, `{{contenu_ordonnance}}`
- **Compte-rendu** : Variables `{{patient}}`, `{{diagnostic}}`, `{{traitement}}`

### 4.3 Emails personnalisés

1. Sélectionnez **"Email personnalisé"** dans le template
2. Rédigez votre contenu HTML ou texte
3. Utilisez l'aperçu pour vérifier le rendu
4. Cliquez sur **"Envoyer"**

## 🔧 Dépannage

### Problème : "Erreur OAuth2"

**Causes possibles :**
- Client ID/Secret incorrects
- URI de redirection non autorisé
- Compte de test non ajouté

**Solutions :**
1. Vérifiez vos variables d'environnement
2. Confirmez l'URI de redirection dans Google Cloud Console
3. Ajoutez votre email aux utilisateurs de test

### Problème : "Erreur lors de l'envoi"

**Causes possibles :**
- Token expiré
- Permissions insuffisantes
- Compte email désactivé

**Solutions :**
1. Reconfigurez l'autorisation Gmail
2. Vérifiez les permissions dans Google Cloud Console
3. Testez avec un email simple

### Problème : "Application non vérifiée"

**C'est normal !** Google affiche ce message pour les applications en développement.

**Solutions :**
1. Cliquez sur **"Paramètres avancés"**
2. Puis **"Accéder à Paroflow (dangereux)"**
3. Pour la production, faites vérifier votre app par Google

## 🔒 Sécurité et bonnes pratiques

### Sécurité des tokens

- ✅ Les tokens sont chiffrés en base de données
- ✅ Renouvellement automatique des tokens expirés
- ✅ Révocation possible depuis votre compte Google

### Limites d'envoi

Gmail a des limites quotidiennes :
- **Gmail gratuit** : 500 emails/jour
- **Google Workspace** : 2000 emails/jour

Paroflow respecte ces limites automatiquement.

### Révocation d'accès

Pour révoquer l'accès de Paroflow à votre Gmail :

1. Allez sur [myaccount.google.com/permissions](https://myaccount.google.com/permissions)
2. Trouvez **"Paroflow"** dans la liste
3. Cliquez sur **"Supprimer l'accès"**

## 📞 Support

### Logs de debug

Les logs d'envoi sont visibles dans :
- Console du navigateur (F12)
- Logs serveur Paroflow
- Paramètres > Templates Email > Historique

### Contacts

- **Documentation technique** : `/docs/ARCHITECTURE.md`
- **Issues GitHub** : (si applicable)
- **Support** : Consultez votre administrateur système

## 🆕 Nouveautés

### Version 1.0

- ✅ Configuration Gmail OAuth2
- ✅ Templates email prédéfinis
- ✅ Envoi depuis interface patients
- ✅ Intégration IA Ollama pour correction OCR

### Prochaines versions

- 🔄 Support Outlook/Office 365
- 🔄 Envoi groupé de emails
- 🔄 Statistiques d'ouverture/clics
- 🔄 Templates personnalisés avancés

---

**Dernière mise à jour** : 2 août 2025  
**Version** : 1.0  
**Testé avec** : Gmail, Google Workspace