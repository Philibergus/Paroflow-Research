-- AlterTable
ALTER TABLE "traitements" ADD COLUMN "scenarioEtapeCourante" TEXT;
ALTER TABLE "traitements" ADD COLUMN "scenariotype" TEXT;

-- CreateTable
CREATE TABLE "chartes_dentaires" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "traitementId" TEXT,
    "numeroDent" INTEGER NOT NULL,
    "statut" TEXT NOT NULL,
    "etat" TEXT,
    "notes" TEXT,
    "couleur" TEXT,
    "dateModification" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "chartes_dentaires_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "chartes_dentaires_traitementId_fkey" FOREIGN KEY ("traitementId") REFERENCES "traitements" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scenario_types" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "etapesTemplate" JSONB NOT NULL,
    "dureeEstimee" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "files_attente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priorite" INTEGER NOT NULL DEFAULT 1,
    "statut" TEXT NOT NULL DEFAULT 'waiting',
    "notes" TEXT,
    "dateAjout" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateDebut" DATETIME,
    "dateFin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "files_attente_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documents_patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "cheminFichier" TEXT NOT NULL,
    "mimeType" TEXT,
    "tailleFichier" INTEGER,
    "dateDocument" DATETIME,
    "tags" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "documents_patients_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "chartes_dentaires_patientId_numeroDent_key" ON "chartes_dentaires"("patientId", "numeroDent");

-- CreateIndex
CREATE UNIQUE INDEX "scenario_types_nom_key" ON "scenario_types"("nom");
