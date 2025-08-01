-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "dateNaissance" DATETIME NOT NULL,
    "adresse" TEXT,
    "numeroSecurite" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "correspondants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "specialite" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "traitements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dents" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'planifie',
    "dateDebut" DATETIME,
    "dateFin" DATETIME,
    "cout" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "traitements_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "etapes_traitement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "traitementId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'planifie',
    "duree" INTEGER,
    "cout" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "etapes_traitement_traitementId_fkey" FOREIGN KEY ("traitementId") REFERENCES "traitements" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
