import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create correspondants
  const correspondants = await Promise.all([
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Martin Dubois',
        specialite: 'Orthodontiste',
        email: 'martin.dubois@orthodontie-paris.fr',
        telephone: '01 42 85 76 93',
        adresse: '15 Avenue des Champs-Élysées, 75008 Paris',
        notes: 'Spécialisé en orthodontie invisible et appareil dentaire pour adultes',
      },
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Sophie Lemaire',
        specialite: 'Chirurgien-dentiste',
        email: 'sophie.lemaire@dental-clinic.fr',
        telephone: '01 47 23 89 45',
        adresse: '28 Rue de Rivoli, 75004 Paris',
        notes: 'Expertise en implantologie et chirurgie orale',
      },
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Pierre Moreau',
        specialite: 'Parodontologue',
        email: 'pierre.moreau@paro-sante.fr',
        telephone: '01 56 78 34 12',
        adresse: '42 Boulevard Saint-Germain, 75005 Paris',
        notes: 'Traitement des maladies parodontales et greffe gingivale',
      },
    }),
  ])

  // Create patients with realistic French names and data
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        nom: 'Dupont',
        prenom: 'Marie',
        email: 'marie.dupont@gmail.com',
        telephone: '06 12 34 56 78',
        dateNaissance: new Date('1985-03-15'),
        adresse: '12 Rue de la Paix, 75001 Paris',
        numeroSecurite: '1850315123456',
        notes: 'Patiente régulière, préfère les rendez-vous le matin',
      },
    }),
    prisma.patient.create({
      data: {
        nom: 'Bernard',
        prenom: 'Jean',
        email: 'jean.bernard@hotmail.fr',
        telephone: '06 87 65 43 21',
        dateNaissance: new Date('1978-11-22'),
        adresse: '45 Avenue Montaigne, 75008 Paris',
        numeroSecurite: '1781122234567',
        notes: 'Anxieux lors des soins, nécessite une approche douce',
      },
    }),
    prisma.patient.create({
      data: {
        nom: 'Moreau',
        prenom: 'Catherine',
        email: 'catherine.moreau@yahoo.fr',
        telephone: '06 23 45 67 89',
        dateNaissance: new Date('1992-07-08'),
        adresse: '78 Rue Saint-Honoré, 75001 Paris',
        numeroSecurite: '2920708345678',
        notes: 'Étudiante, préfère les rendez-vous en fin de journée',
      },
    }),
    prisma.patient.create({
      data: {
        nom: 'Leroy',
        prenom: 'Michel',
        email: 'michel.leroy@gmail.com',
        telephone: '06 34 56 78 90',
        dateNaissance: new Date('1965-12-03'),
        adresse: '23 Boulevard Haussmann, 75009 Paris',
        numeroSecurite: '1651203456789',
        notes: 'Diabétique, contrôles réguliers nécessaires',
      },
    }),
    prisma.patient.create({
      data: {
        nom: 'Petit',
        prenom: 'Sylvie',
        email: 'sylvie.petit@orange.fr',
        telephone: '06 45 67 89 01',
        dateNaissance: new Date('1989-04-17'),
        adresse: '56 Rue du Faubourg Saint-Antoine, 75012 Paris',
        numeroSecurite: '2890417567890',
        notes: 'Allergie à la pénicilline, préfère les traitements naturels',
      },
    }),
  ])

  console.log(`✅ Created ${patients.length} patients and ${correspondants.length} correspondants`)

  // Create traitements with different statuses
  const traitements = [
    // Marie Dupont - Orthodontie
    {
      patientId: patients[0].id,
      type: 'Orthodontie - Appareil dentaire',
      dents: '11, 12, 13, 21, 22, 23',
      statut: 'en_cours',
      dateDebut: new Date('2024-01-15'),
      dateFin: new Date('2025-01-15'),
      cout: 2800.0,
      notes: 'Traitement orthodontique complet avec bagues métalliques'
    },
    // Jean Bernard - Implants
    {
      patientId: patients[1].id,
      type: 'Implantologie',
      dents: '36, 37',
      statut: 'planifie',
      dateDebut: new Date('2024-09-01'),
      cout: 3200.0,
      notes: 'Pose d\'implants molaires mandibulaires droites'
    },
    // Catherine Moreau - Couronnes
    {
      patientId: patients[2].id,
      type: 'Prothèse fixe - Couronnes',
      dents: '14, 15',
      statut: 'termine',
      dateDebut: new Date('2023-11-10'),
      dateFin: new Date('2024-01-20'),
      cout: 1600.0,
      notes: 'Couronnes céramique sur molaires maxillaires'
    },
    // Michel Leroy - Détartrage
    {
      patientId: patients[3].id,
      type: 'Soins conservateurs',
      statut: 'termine',
      dateDebut: new Date('2024-06-15'),
      dateFin: new Date('2024-06-15'),
      cout: 120.0,
      notes: 'Détartrage complet et polissage'
    },
    // Sylvie Petit - Traitement canalaire
    {
      patientId: patients[4].id,
      type: 'Endodontie',
      dents: '26',
      statut: 'suspendu',
      dateDebut: new Date('2024-07-01'),
      cout: 450.0,
      notes: 'Traitement canalaire molaire maxillaire, suspendu à la demande de la patiente'
    },
  ]

  const createdTraitements = []
  for (const traitement of traitements) {
    const created = await prisma.traitement.create({ data: traitement })
    createdTraitements.push(created)
  }

  console.log(`✅ Created ${createdTraitements.length} traitements`)

  // Create etapes for some traitements
  const etapes = [
    // Étapes pour l'orthodontie de Marie Dupont
    {
      traitementId: createdTraitements[0].id,
      titre: 'Consultation initiale et moulages',
      description: 'Prise d\'empreintes et analyse orthodontique complète',
      date: new Date('2024-01-15'),
      statut: 'termine',
      duree: 60,
      cout: 200.0,
    },
    {
      traitementId: createdTraitements[0].id,
      titre: 'Pose de l\'appareil dentaire',
      description: 'Installation des bagues et du fil orthodontique',
      date: new Date('2024-02-01'),
      statut: 'termine',
      duree: 90,
      cout: 800.0,
    },
    {
      traitementId: createdTraitements[0].id,
      titre: 'Contrôle et ajustement - 3 mois',
      description: 'Changement du fil et vérification de l\'évolution',
      date: new Date('2024-08-15'),
      statut: 'planifie',
      duree: 30,
      cout: 80.0,
    },
    // Étapes pour les implants de Jean Bernard
    {
      traitementId: createdTraitements[1].id,
      titre: 'Consultation pré-implantaire',
      description: 'Scanner 3D et planification implantaire',
      date: new Date('2024-08-15'),
      statut: 'planifie',
      duree: 45,
      cout: 150.0,
    },
    {
      traitementId: createdTraitements[1].id,
      titre: 'Chirurgie implantaire',
      description: 'Pose des implants dentaires',
      date: new Date('2024-09-01'),
      statut: 'planifie',
      duree: 120,
      cout: 2000.0,
    },
    // Étapes pour les couronnes de Catherine Moreau (terminées)
    {
      traitementId: createdTraitements[2].id,
      titre: 'Préparation dentaire',
      description: 'Taille des dents et prise d\'empreintes',
      date: new Date('2023-11-10'),
      statut: 'termine',
      duree: 75,
      cout: 400.0,
    },
    {
      traitementId: createdTraitements[2].id,
      titre: 'Pose des couronnes définitives',
      description: 'Scellement des couronnes céramique',
      date: new Date('2024-01-20'),
      statut: 'termine',
      duree: 60,
      cout: 1200.0,
    },
  ]

  for (const etape of etapes) {
    await prisma.etapeTraitement.create({ data: etape })
  }

  console.log(`✅ Created ${etapes.length} étapes de traitement`)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })