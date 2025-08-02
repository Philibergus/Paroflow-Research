-- CreateTable
CREATE TABLE "rendez_vous" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "dateHeure" DATETIME NOT NULL,
    "duree" INTEGER NOT NULL DEFAULT 30,
    "statut" TEXT NOT NULL DEFAULT 'planifie',
    "type" TEXT NOT NULL DEFAULT 'consultation',
    "salle" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "rendez_vous_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
