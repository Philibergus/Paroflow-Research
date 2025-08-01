# Paroflow Frontend - Système de Gestion de Cabinet Dentaire

## Vue d'ensemble

Interface utilisateur moderne pour Paroflow, construite avec React, TypeScript, Next.js (API) et shadcn/ui. Cette application fournit une interface complète pour la gestion des patients, correspondants et traitements dans un cabinet dentaire.

## Fonctionnalités

### ✅ Fonctionnalités Implémentées

#### 🏠 Tableau de bord
- Vue d'ensemble avec statistiques clés
- Barre de commandes intelligente (Cmd/Ctrl+K)
- Traitements récents et actions rapides
- Interface responsive pour tablettes

#### 👥 Gestion des Patients
- Liste complète avec recherche et pagination
- Formulaires de création/édition avec validation
- Informations détaillées (contact, sécurité sociale, notes)
- Interface médicale professionnelle

#### 🏥 Gestion des Correspondants
- Annuaire des correspondants médicaux
- Gestion par spécialités
- Informations de contact et collaboration
- Interface dédiée aux professionnels de santé

#### 📊 Rapports et Traitements
- Timeline des traitements par patient
- Gestion complète des traitements
- Suivi des étapes de traitement
- Statistiques et chiffre d'affaires
- États des traitements (planifié, en cours, terminé, suspendu)

#### 🎯 Fonctionnalités Avancées
- **Barre de commandes intelligente** : Compréhension du langage naturel
- **Recherche contextuelle** : Recherche dans tous les modules
- **Interface responsive** : Optimisée pour tablettes médicales
- **Gestion d'état avancée** : React Query pour la synchronisation
- **Validation robuste** : Zod pour la validation côté client
- **Notifications toast** : Feedback utilisateur en temps réel

## Architecture Technique

### Stack Technologique
- **Frontend** : React 18 + TypeScript
- **Backend API** : Next.js 15 App Router
- **Base de données** : Prisma + SQLite
- **UI Framework** : shadcn/ui + Tailwind CSS
- **État** : React Query (TanStack Query)
- **Routing** : React Router DOM
- **Validation** : Zod
- **Notifications** : Sonner

### Structure du Projet

```
src/
├── components/           # Composants réutilisables
│   ├── ui/              # Composants UI de base (shadcn/ui)
│   ├── Layout.tsx       # Layout principal avec navigation
│   ├── CommandBar.tsx   # Barre de commandes intelligente
│   ├── PatientForm.tsx  # Formulaire patient
│   ├── CorrespondantForm.tsx
│   ├── TreatmentForm.tsx
│   └── TreatmentTimeline.tsx
├── pages/               # Pages principales
│   ├── Dashboard.tsx    # Tableau de bord
│   ├── Patients.tsx     # Gestion patients
│   ├── Correspondants.tsx
│   └── Reports.tsx      # Rapports et traitements
├── hooks/               # Hooks React Query
│   ├── usePatients.ts
│   ├── useCorrespondants.ts
│   └── useTraitements.ts
├── lib/                 # Utilitaires
│   ├── api.ts          # Client API
│   ├── utils.ts        # Utilitaires UI
│   └── french-terms.ts # Terminologie médicale
├── App.tsx             # Configuration de l'app
├── main.tsx           # Point d'entrée
└── index.css          # Styles globaux
```

## Installation et Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Installer les dépendances
npm install

# Initialiser la base de données
npm run db:push
npm run db:seed

# Démarrer le serveur de développement
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Serveur de développement (port 8080)
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification ESLint
npm run db:generate  # Génération Prisma client
npm run db:push      # Synchronisation base de données
npm run db:migrate   # Migration base de données
npm run db:seed      # Données de test
npm run db:studio    # Interface Prisma Studio
```

## Guide d'Utilisation

### Barre de Commandes Intelligente
- **Raccourci** : `Cmd/Ctrl + K`
- **Langage naturel** : "nouveau patient", "rechercher traitement"
- **Navigation rapide** : Accès direct à toutes les fonctionnalités

### Gestion des Patients
1. **Ajouter un patient** : Bouton "Nouveau patient" ou commande
2. **Rechercher** : Barre de recherche par nom, prénom, email
3. **Modifier** : Clic sur l'icône d'édition
4. **Supprimer** : Clic sur l'icône de suppression (avec confirmation)

### Gestion des Traitements
1. **Créer un traitement** : Sélectionner le patient et le type
2. **Suivre l'évolution** : Timeline interactive par patient
3. **Gérer les étapes** : Ajout d'étapes détaillées
4. **Statistiques** : Vue d'ensemble du chiffre d'affaires

## Terminologie Médicale

L'application utilise la terminologie médicale française standard :

### Types de Traitements
- Soins conservateurs (caries, composites)
- Endodontie (traitements de racines)
- Prothèses (couronnes, bridges)
- Chirurgie (extractions, implants)
- Parodontologie (gencives)
- Orthodontie (appareils dentaires)

### Spécialités Médicales
- Orthodontie, Chirurgie orale, Parodontologie
- Endodontie, Implantologie, Prothèse dentaire
- Médecine générale, ORL, etc.

### Notation Dentaire
- Système FDI (Fédération Dentaire Internationale)
- Numérotation 11-48 pour les dents permanentes

## Responsive Design

L'interface est optimisée pour :
- **Desktop** : Expérience complète avec sidebar
- **Tablette** : Interface adaptée pour les consultations
- **Mobile** : Navigation simplifiée (en développement)

## Sécurité et Validation

- **Validation client** : Zod pour tous les formulaires
- **Validation serveur** : API Next.js avec Prisma
- **Gestion d'erreurs** : Messages d'erreur contextuels
- **États de chargement** : Indicateurs visuels partout

## Performance

- **Pagination** : Chargement par pages pour les grandes listes
- **Cache intelligent** : React Query pour la synchronisation
- **Lazy loading** : Chargement à la demande
- **Bundle optimisé** : Vite pour des builds rapides

## Développement Futur

### Fonctionnalités Prévues
- [ ] Module de rendez-vous/agenda
- [ ] Générateur de documents/ordonnances
- [ ] Statistiques avancées et rapports
- [ ] Mode hors ligne
- [ ] Integration SESAM-Vitale
- [ ] Sauvegarde cloud
- [ ] API mobile

### Améliorations UX
- [ ] Mode sombre
- [ ] Raccourcis clavier avancés
- [ ] Personnalisation interface
- [ ] Tutoriels intégrés

## Support

Pour le support technique ou les questions sur l'utilisation, consultez la documentation complète ou contactez l'équipe de développement.

---

**Version** : 1.0.0  
**Dernière mise à jour** : Août 2025  
**Licence** : Propriétaire