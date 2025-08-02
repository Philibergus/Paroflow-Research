# Architecture Base de Données - Module Implants

## 🎯 Objectifs
- **Catalogues complets** : Nobel, Straumann, BioHorizons
- **Sélection intuitive** : Marque > Système > Diamètre > Longueur
- **Gestion stock** : Quantités, alertes, commandes
- **Workflow chirurgie** : Intégration traitement + distribution infos
- **Traçabilité** : Implant utilisé par patient/traitement

## 📊 Modèle de Données

### 1. Table `MarqueImplant`
Fabricants d'implants principaux

```sql
MarqueImplant {
  id: String (CUID)
  nom: String UNIQUE          // "Nobel Biocare", "Straumann", "BioHorizons"
  codeMarque: String UNIQUE   // "NOBEL", "STRAUMANN", "BIOHORIZONS"
  pays: String               // "Suède", "Suisse", "USA"
  siteWeb: String?
  telephone: String?
  email: String?
  notes: String?
  isActive: Boolean DEFAULT true
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  systemes: SystemeImplant[]
}
```

### 2. Table `SystemeImplant`
Systèmes par marque (NobelActive, BLT, etc.)

```sql
SystemeImplant {
  id: String (CUID)
  marqueId: String
  nom: String                 // "NobelActive", "BLT", "Tapered Internal"
  codeSysteme: String         // "NA", "BLT", "TLX"
  description: String?
  typeConnexion: String       // "Hexagone+Morse", "CrossFit", "Interne Hex"
  surface: String            // "TiUnite", "SLActive", "RBT+Laser-Lok"
  materiau: String           // "Ti Grade 4", "Roxolid", "Ti-6Al-4V"
  indicationsPrincipales: String? // "Immédiat", "Esthétique", "Universel"
  dateIntroduction: DateTime?
  isActive: Boolean DEFAULT true
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  marque: MarqueImplant
  references: ReferenceImplant[]
}
```

### 3. Table `ReferenceImplant`
Références spécifiques avec diamètre/longueur

```sql
ReferenceImplant {
  id: String (CUID)
  systemeId: String
  codeReference: String UNIQUE // "NA-4.3-10", "BLT-41-10", "TLX4610"
  diametre: Float             // 3.5, 4.1, 4.6, etc. (en mm)
  longueur: Float             // 8.0, 10.0, 10.5, etc. (en mm)
  plateformeProsthetique: String? // "NP", "RP", "WP", "3.0", "4.5", etc.
  connexionDiametre: Float?   // Diamètre connexion prothétique
  couleurCoding: String?      // Code couleur fabricant
  prixUnitaire: Float?        // Prix d'achat unitaire
  notes: String?
  isActive: Boolean DEFAULT true
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  systeme: SystemeImplant
  stock: StockImplant?
  implantUtilises: ImplantUtilise[]
}
```

### 4. Table `StockImplant`
Gestion des quantités et alertes

```sql
StockImplant {
  id: String (CUID)
  referenceId: String UNIQUE
  quantiteStock: Int DEFAULT 0
  seuilAlerte: Int DEFAULT 2   // Alerte si stock < seuil
  quantiteCommande: Int DEFAULT 5 // Quantité standard commande
  emplacement: String?         // "Armoire A-1", "Tiroir 3", etc.
  datePeremption: DateTime?    // Si applicable
  lotFournisseur: String?
  fournisseurPrincipal: String? // "Henry Schein", "GACD", etc.
  prixDernierAchat: Float?
  dateDernierAchat: DateTime?
  dateInventaire: DateTime?
  notes: String?
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  reference: ReferenceImplant
  mouvements: MouvementStock[]
}
```

### 5. Table `MouvementStock`
Historique entrées/sorties stock

```sql
MouvementStock {
  id: String (CUID)
  stockId: String
  type: String                // "ENTREE", "SORTIE", "INVENTAIRE", "CORRECTION"
  quantite: Int              // Positif pour entrée, négatif pour sortie
  quantiteAvant: Int         // Stock avant mouvement
  quantiteApres: Int         // Stock après mouvement
  motif: String              // "Achat", "Utilisation", "Périmé", "Perdu"
  referenceDocument: String? // Bon commande, facture, etc.
  utilisateurId: String?     // Qui a fait le mouvement
  notes: String?
  dateMovement: DateTime DEFAULT now()
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  stock: StockImplant
}
```

### 6. Table `ImplantUtilise`
Implants utilisés sur patients (traçabilité)

```sql
ImplantUtilise {
  id: String (CUID)
  patientId: String
  traitementId: String?
  referenceId: String
  numeroDent: Int            // Position FDI (11, 21, 36, etc.)
  dateChirurgie: DateTime
  chirurgien: String?        // Nom praticien
  torqueInsertion: Float?    // Couple d'insertion en Ncm
  stabiliteInitiale: String? // "Excellente", "Bonne", "Moyenne"
  techniqueChirurgie: String? // "Conventionnelle", "Guidée", "Immédiate"
  greffesAssociees: String?  // "ROG", "Sinus lift", "Greffe bloc", etc.
  notes: String?
  statut: String DEFAULT "POSE" // "POSE", "ECHEC", "RETRAIT"
  dateStatut: DateTime?      // Date changement statut
  numeroLot: String?         // Lot fabricant pour traçabilité
  isSuccess: Boolean DEFAULT true
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  patient: Patient
  traitement: Traitement?
  reference: ReferenceImplant
  suivis: SuiviImplant[]
}
```

### 7. Table `SuiviImplant`
Suivi post-opératoire implants

```sql
SuiviImplant {
  id: String (CUID)
  implantUtiliseId: String
  dateVisite: DateTime
  typeVisite: String         // "J+7", "1 mois", "3 mois", "6 mois", "1 an"
  cicatrisation: String      // "Excellente", "Bonne", "Retardée", "Problème"
  douleur: Int              // 0-10 échelle
  oedeme: String?           // "Absent", "Léger", "Modéré", "Important"
  mobilite: String?         // "Nulle", "Légère", "Importante"
  radiographie: Boolean?     // Radio prise?
  prescription: String?      // Médicaments prescrits
  prochaineVisite: DateTime?
  notes: String?
  praticien: String?
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  implantUtilise: ImplantUtilise
}
```

## 🔗 Relations avec Tables Existantes

### Modification Table `Traitement`
Ajouter champs spécifiques implantologie :

```sql
// Nouveaux champs à ajouter
implantsPlanifies: Int?      // Nombre implants prévus
implantsPoses: Int?         // Nombre implants posés
typeImplantologie: String?  // "Unitaire", "Multiple", "All-on-4", "All-on-6"
guidageChirurgical: Boolean? // Chirurgie guidée ou non
```

### Liens ImplantUtilise vers Traitement
```sql
ImplantUtilise {
  traitementId: String? // Lien vers traitement principal
}
```

## 📱 Interface Utilisateur - Workflow

### 1. Sélection Implant (Chirurgie)
```
Marque [Dropdown] → Système [Dropdown] → Diamètre [Dropdown] → Longueur [Dropdown]
└─ Affichage : Stock disponible, Prix, Notes techniques
```

### 2. Pose Implant (Traitement)
```
Patient → Traitement → Ajouter Implant
├─ Sélection référence (workflow ci-dessus)
├─ Position dentaire (schéma interactif)
├─ Paramètres chirurgie (torque, technique)
└─ Validation → Stock automatiquement décrémenté
```

### 3. Gestion Stock
```
Vue Stock Globale
├─ Alertes (stock bas)
├─ Mouvements récents
├─ Inventaire
└─ Commandes automatiques
```

## 🔄 Workflow Distribution Informations

### Lors d'une Chirurgie Implant

#### 1. Données Enregistrées
- **Patient** : Implant posé avec traçabilité complète
- **Stock** : Décrémentation automatique
- **Traitement** : Progression avec implant référencé

#### 2. Documents Générés Automatiquement
- **Compte-rendu patient** : Type implant, recommandations post-op
- **Courrier correspondant** : Si applicable, détails techniques
- **Fiche stock** : Mouvement enregistré
- **Planning suivi** : RDV contrôles programmés

#### 3. Alertes Système
- **Stock bas** : Si seuil atteint
- **Suivi patient** : Rappels RDV contrôle
- **Péremption** : Si dates limites approchent

## 🎯 Avantages Architecture

### Pour le Praticien
- ✅ **Sélection rapide** implant pendant chirurgie
- ✅ **Traçabilité complète** patient/implant
- ✅ **Gestion stock** automatisée
- ✅ **Documents automatiques** (compte-rendus, courriers)

### Pour la Gestion
- ✅ **Stock optimisé** : Alertes et commandes automatiques
- ✅ **Coûts maîtrisés** : Suivi prix et rentabilité
- ✅ **Conformité** : Traçabilité réglementaire
- ✅ **Statistiques** : Analyse performance par marque/système

### Pour les Patients
- ✅ **Information précise** : Détails implant utilisé
- ✅ **Suivi structuré** : Planning contrôles automatique
- ✅ **Documents clairs** : Compte-rendus détaillés
- ✅ **Correspondants informés** : Si traitement collaboratif

---
*Architecture conçue pour intégration fluide dans Paroflow avec workflow utilisateur optimisé*