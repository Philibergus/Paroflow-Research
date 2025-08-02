# Paroflow Backend Architecture

Backend complet pour le système de gestion de cabinet dentaire Paroflow, construit avec Next.js 15, TypeScript, Prisma et SQLite.

## ✅ Configuration Complète

### Technologies Utilisées
- **Next.js 15+** avec App Router
- **TypeScript** en mode strict
- **Prisma ORM** avec base de données SQLite
- **Zod** pour la validation des données
- **API REST** complète avec gestion d'erreurs

### Structure du Projet
```
/home/viann/ProjectsDev/Paroflow/
├── app/
│   ├── api/
│   │   ├── patients/                 # API CRUD patients
│   │   ├── correspondants/          # API CRUD correspondants  
│   │   └── traitements/            # API CRUD traitements + étapes
│   ├── lib/
│   │   ├── prisma.ts               # Configuration Prisma Client
│   │   └── api-utils.ts            # Utilitaires API (validation, responses)
│   ├── types/
│   │   └── index.ts                # Types TypeScript et schémas Zod
│   ├── layout.tsx                  # Layout Next.js
│   └── page.tsx                    # Page d'accueil API documentation
├── prisma/
│   ├── schema.prisma               # Schéma de base de données
│   ├── migrations/                 # Migrations Prisma
│   └── seed.ts                     # Script de données test
├── dev.db                          # Base de données SQLite
└── next.config.js                  # Configuration Next.js
```

## 🗄️ Schéma de Base de Données

### Tables Créées
1. **patients** - Informations patients (nom, prénom, contact, date naissance)
2. **correspondants** - Correspondants médicaux (nom, spécialité, contact)
3. **traitements** - Traitements dentaires (type, dents, statut, dates, coût)
4. **etapes_traitement** - Étapes des traitements (titre, description, date, statut)

### Relations
- `patients` 1→N `traitements`
- `traitements` 1→N `etapes_traitement`

## 🚀 Commandes Disponibles

```bash
# Développement Next.js
npm run dev              # Démarre le serveur de développement

# Build et production  
npm run build           # Build de production
npm run start           # Démarre le serveur de production

# Base de données
npm run db:generate     # Génère le client Prisma
npm run db:push         # Synchronise le schéma avec la DB
npm run db:migrate      # Crée et applique les migrations
npm run db:seed         # Peuple la DB avec des données test
npm run db:studio       # Interface graphique Prisma Studio

# Autres
npm run lint            # Linting ESLint
```

## 📡 API Endpoints

### Patients (`/api/patients`)
- `GET /api/patients` - Liste paginée avec recherche
- `POST /api/patients` - Créer un patient
- `GET /api/patients/[id]` - Détails patient avec traitements
- `PUT /api/patients/[id]` - Mettre à jour un patient  
- `DELETE /api/patients/[id]` - Supprimer un patient

### Correspondants (`/api/correspondants`)
- `GET /api/correspondants` - Liste paginée avec recherche
- `POST /api/correspondants` - Créer un correspondant
- `GET /api/correspondants/[id]` - Détails correspondant
- `PUT /api/correspondants/[id]` - Mettre à jour un correspondant
- `DELETE /api/correspondants/[id]` - Supprimer un correspondant

### Traitements (`/api/traitements`)
- `GET /api/traitements` - Liste paginée avec recherche et filtre patient
- `POST /api/traitements` - Créer un traitement
- `GET /api/traitements/[id]` - Détails traitement avec patient et étapes
- `PUT /api/traitements/[id]` - Mettre à jour un traitement
- `DELETE /api/traitements/[id]` - Supprimer un traitement
- `GET /api/traitements/[id]/etapes` - Étapes d'un traitement
- `POST /api/traitements/[id]/etapes` - Créer une étape

### Paramètres de Requête
- `page` - Numéro de page (défaut: 1)
- `limit` - Nombre d'éléments par page (défaut: 10, max: 100)
- `search` - Terme de recherche
- `sortBy` - Champ de tri (défaut: createdAt)
- `sortOrder` - Ordre de tri: asc|desc (défaut: desc)
- `patientId` - Filtre par patient (traitements uniquement)

## 📊 Données de Test

La base de données est pré-remplie avec :
- **5 patients** avec données réalistes françaises
- **3 correspondants** (orthodontiste, chirurgien-dentiste, parodontologue)
- **5 traitements** avec différents statuts (planifié, en cours, terminé, suspendu)
- **7 étapes de traitement** liées aux traitements

### Exemples de Données
- **Patients** : Marie Dupont, Jean Bernard, Catherine Moreau, Michel Leroy, Sylvie Petit
- **Types de traitement** : Orthodontie, Implantologie, Couronnes, Détartrage, Endodontie
- **Statuts** : planifié, en_cours, terminé, suspendu

## 🔒 Validation et Sécurité

### Validation Zod
- Validation complète des entrées avec messages d'erreur en français
- Types TypeScript générés automatiquement
- Gestion des formats de date flexible
- Validation des emails et numéros de téléphone

### Gestion d'Erreurs
- Responses API standardisées avec format `ApiResponse<T>`
- Codes d'erreur HTTP appropriés
- Messages d'erreur descriptifs
- Logging des erreurs serveur

## 🏃‍♂️ Démarrage Rapide

1. **Installer les dépendances** (déjà fait)
   ```bash
   npm install
   ```

2. **Configurer la base de données** (déjà fait)
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Démarrer le serveur**
   ```bash
   npm run dev
   ```

4. **Tester l'API**
   - Ouvrir http://localhost:3000
   - Utiliser Prisma Studio : `npm run db:studio`
   - Tester les endpoints avec curl/Postman

## 📝 Exemple d'Utilisation

### Créer un Patient
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Martin",
    "prenom": "Paul", 
    "email": "paul.martin@email.com",
    "telephone": "06 12 34 56 78",
    "dateNaissance": "1990-05-15"
  }'
```

### Lister les Patients
```bash
curl "http://localhost:3000/api/patients?page=1&limit=5&search=Martin"
```

## 🎯 Fonctionnalités Clés

- ✅ **CRUD complet** pour toutes les entités
- ✅ **Pagination** avec métadonnées
- ✅ **Recherche** textuelle multi-champs
- ✅ **Validation** stricte avec Zod
- ✅ **Relations** base de données avec cascade
- ✅ **TypeScript strict** pour la sécurité des types
- ✅ **API REST** standard avec codes HTTP appropriés
- ✅ **Données de test** réalistes
- ✅ **Configuration locale** SQLite (pas de cloud requis)

## 📈 Performance

- Configuration optimisée pour **300 patients/an**, **20 rapports/mois**
- SQLite adapté pour le développement local
- Index automatiques Prisma sur les clés primaires et étrangères
- Pagination pour éviter les requêtes trop lourdes

## 🔧 Architecture

### Pattern Repository
- Prisma Client centralisé dans `app/lib/prisma.ts`
- Utilitaires API réutilisables dans `app/lib/api-utils.ts`
- Types centralisés avec validation Zod

### Error Handling
- Gestion centralisée des erreurs dans `handleApiError`
- Validation des requêtes avec `validateRequestBody`
- Responses standardisées avec `successResponse` et `errorResponse`

Le backend est maintenant **100% opérationnel** et prêt pour l'intégration frontend!