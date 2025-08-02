import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Nettoyage de la base de données...')
  
  // Nettoyer les tables dans le bon ordre
  await prisma.traitement.deleteMany()
  await prisma.rendezVous.deleteMany()
  await prisma.fileAttente.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.correspondant.deleteMany()

  console.log('✅ Base nettoyée')

  // ===========================================
  // CORRESPONDANTS (Basés sur vos vraies données mais anonymisés)
  // ===========================================
  console.log('👨‍⚕️ Création des correspondants (inspirés des vrais)...')

  const correspondants = await Promise.all([
    // Orthodontistes
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Agathe BRES',
        specialite: 'Pédodontie',
        telephone: '01 40 44 XX XX',
        email: 'dr.agathe.test@example.fr',
        adresse: '52 Avenue du Général Leclerc, 75014 Paris',
        notes: 'Spécialiste enfants et adolescents'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Eric ESCALIER',
        specialite: 'Dentiste',
        telephone: '06 73 32 XX XX',
        email: 'dr.escalier.test@example.fr',
        adresse: '75 rue de Turenne, 75003 Paris',
        notes: 'Omnipratique, soins conservateurs'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Marie MEUNIER',
        specialite: 'Dentiste',
        telephone: '06 12 57 XX XX',
        email: 'dr.meunier.test@example.fr',
        adresse: '75 rue de Turenne, 75003 Paris',
        notes: 'Prothèses et implantologie'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Paul WORTHALTER',
        specialite: 'Dentiste',
        telephone: '06 84 15 XX XX',
        email: 'dr.worthalter.test@example.fr',
        adresse: '75 rue de Turenne, 75003 Paris',
        notes: 'Chirurgie orale et implants'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Trinh Dinh DUI',
        specialite: 'ORL',
        telephone: '01 42 33 XX XX',
        email: 'dr.dui.test@example.fr',
        adresse: '27 Rue de Turin, 75008 Paris',
        notes: 'Pathologies sinusiennes et implantologie'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Bruno CHABERT',
        specialite: 'ORL',
        telephone: '01 47 20 XX XX',
        email: 'dr.chabert.test@example.fr',
        adresse: '32 Avenue Georges Mandel, 75016 Paris',
        notes: 'Sinus lift et greffes osseuses'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Laurent LECOCQ',
        specialite: 'Dentiste',
        telephone: '06 02 31 XX XX',
        email: 'dr.lecocq.test@example.fr',
        adresse: '75 rue de Turenne, 75003 Paris',
        notes: 'Endodontie et retraitements'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Nicolas SMILENKO',
        specialite: 'Orthodontiste',
        telephone: '01 55 25 XX XX',
        email: 'dr.smilenko.test@example.fr',
        adresse: '1 Square de la Mutualité, 75005 Paris',
        notes: 'Orthodontie adulte et préparation implantaire'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Alain LAROCHE',
        specialite: 'Orthodontiste',
        telephone: '01 83 62 XX XX',
        email: 'dr.laroche.test@example.fr',
        adresse: '11-15 Rue Alexandre Dumas, 75011 Paris',
        notes: 'Invisalign et techniques linguales'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Claire DECEUNINCK',
        specialite: 'Dentiste',
        telephone: '01 43 57 XX XX',
        email: 'dr.deceuninck.test@example.fr',
        adresse: '16 Rue de la Fontaine au Roi, 75011 Paris',
        notes: 'Implantologie et régénération osseuse'
      }
    })
  ])

  console.log(`✅ ${correspondants.length} correspondants créés`)

  // ===========================================
  // PATIENTS IMPLANTOLOGIE (Anonymisés basés sur vos vrais cas)
  // ===========================================
  console.log('👥 Création des patients implantologie...')

  const patients = await Promise.all([
    // Cas basés sur votre fichier Excel mais anonymisés
    prisma.patient.create({
      data: {
        nom: 'FAURE',
        prenom: 'Nadine',
        dateNaissance: new Date('1969-02-14'), // Calculé depuis l'âge 55
        telephone: '06 XX XX XX 01',
        email: 'nfaure.test@example.fr',
        adresse: '123 Rue Test, 75001 Paris',
        numeroSecurite: '269XXXXXXX',
        notes: 'Implant 4.2*8 - Correspondant: Elisa - Âge: 55 ans - Torque: 40 Ncm'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'MBARKI',
        prenom: 'Amin',
        dateNaissance: new Date('1984-03-09'), // Calculé depuis l'âge 40
        telephone: '06 XX XX XX 02',
        email: 'ambarki.test@example.fr',
        adresse: '456 Avenue Test, 75002 Paris',
        numeroSecurite: '184XXXXXXX',
        notes: 'Implant 4.2*10 - Correspondant: Théophanie - Âge: 40 ans - Torque: 40 Ncm'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'KLEIN',
        prenom: 'Sophie',
        dateNaissance: new Date('1986-03-17'), // Calculé depuis l'âge 38
        telephone: '06 XX XX XX 03',
        email: 'sklein.test@example.fr',
        adresse: '789 Boulevard Test, 75003 Paris',
        numeroSecurite: '286XXXXXXX',
        notes: 'Implant 4.8*10 - Correspondant: Elisa - Âge: 38 ans - Torque: 40 Ncm'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'BELLEC',
        prenom: 'Catherine',
        dateNaissance: new Date('1964-04-07'), // Calculé depuis l'âge 60
        telephone: '06 XX XX XX 04',
        email: 'cbellec.test@example.fr',
        adresse: '321 Rue Test, 75004 Paris',
        numeroSecurite: '264XXXXXXX',
        notes: 'Implant 3.6*8 - Correspondant: Elisa - Âge: 60 ans - Torque: 40 Ncm'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'SIMON',
        prenom: 'Marc',
        dateNaissance: new Date('1963-04-11'), // Calculé depuis l'âge 61
        telephone: '06 XX XX XX 05',
        email: 'msimon.test@example.fr',
        adresse: '654 Avenue Test, 75005 Paris',
        numeroSecurite: '163XXXXXXX',
        notes: 'Implant 4.2*10 - Correspondant: Elisa - Âge: 61 ans - Torque: 40 Ncm'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'BERTRAND',
        prenom: 'Aude',
        dateNaissance: new Date('1964-04-11'), // Calculé depuis l'âge 60
        telephone: '06 XX XX XX 06',
        email: 'abertrand.test@example.fr',
        adresse: '987 Rue Test, 75006 Paris',
        numeroSecurite: '264XXXXXXX',
        notes: 'Implant 3.6*10 - Correspondant: Elisa - Âge: 60 ans - Torque: 40 Ncm'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'REGNIER',
        prenom: 'Muriel',
        dateNaissance: new Date('1965-05-09'), // Calculé depuis l'âge 59
        telephone: '06 XX XX XX 07',
        email: 'mregnier.test@example.fr',
        adresse: '147 Boulevard Test, 75007 Paris',
        numeroSecurite: '265XXXXXXX',
        notes: 'Implant 4.8*8 - Correspondant: Théophanie - Âge: 59 ans - Torque: 40 Ncm'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'BIANCO',
        prenom: 'Danilo',
        dateNaissance: new Date('1987-01-01'), // Calculé depuis l'âge 37
        telephone: '06 XX XX XX 08',
        email: 'dbianco.test@example.fr',
        adresse: '258 Avenue Test, 75008 Paris',
        numeroSecurite: '187XXXXXXX',
        notes: 'OK pour lui - Correspondant: Théophanie - Âge: 37 ans - Prévu le 23/06/2025'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'MAURICE',
        prenom: 'Christine',
        dateNaissance: new Date('1970-01-01'), // Estimé
        telephone: '06 XX XX XX 09',
        email: 'cmaurice.test@example.fr',
        adresse: '369 Rue Test, 75009 Paris',
        numeroSecurite: '270XXXXXXX',
        notes: 'Implant Elisa - Correspondant: Elisa'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'LAVOUE',
        prenom: 'Eddy',
        dateNaissance: new Date('1975-01-01'), // Estimé
        telephone: '06 XX XX XX 10',
        email: 'elavoue.test@example.fr',
        adresse: '741 Boulevard Test, 75010 Paris',
        numeroSecurite: '175XXXXXXX',
        notes: 'Implant Elisa - Correspondant: Elisa'
      }
    })
  ])

  console.log(`✅ ${patients.length} patients créés`)

  // ===========================================
  // TRAITEMENTS IMPLANTOLOGIE (basés sur vos données Excel)
  // ===========================================
  console.log('💊 Création des traitements...')

  const traitements = await Promise.all([
    // FAURE Nadine - Implant 4.2*8
    prisma.traitement.create({
      data: {
        patientId: patients[0].id,
        type: 'Implant unitaire',
        dateDebut: new Date('2024-10-14'),
        statut: 'en_cours',
        cout: 2500,
        dents: '35', // Position probable pour 4.2*8
        notes: 'Implant 4.2*8 - Torque 40 Ncm - Correspondant Elisa'
      }
    }),
    // MBARKI Amin - Implant 4.2*10
    prisma.traitement.create({
      data: {
        patientId: patients[1].id,
        type: 'Implant unitaire',
        dateDebut: new Date('2024-12-03'),
        statut: 'planifie',
        cout: 2500,
        dents: '24', // Position probable pour 4.2*10
        notes: 'Implant 4.2*10 - Torque 40 Ncm - Correspondant Théophanie'
      }
    }),
    // KLEIN Sophie - Implant 4.8*10
    prisma.traitement.create({
      data: {
        patientId: patients[2].id,
        type: 'Implant unitaire',
        dateDebut: new Date('2025-03-17'),
        statut: 'planifie',
        cout: 2500,
        dents: '27', // Position probable pour 4.8*10
        notes: 'Implant 4.8*10 - Torque 40 Ncm - Correspondant Elisa'
      }
    }),
    // BELLEC Catherine - Implant 3.6*8
    prisma.traitement.create({
      data: {
        patientId: patients[3].id,
        type: 'Implant unitaire',
        dateDebut: new Date('2025-04-07'),
        statut: 'planifie',
        cout: 2200,
        dents: '14', // Position probable pour 3.6*8 petit diamètre
        notes: 'Implant 3.6*8 - Torque 40 Ncm - Correspondant Elisa'
      }
    }),
    // SIMON Marc - Implant 4.2*10
    prisma.traitement.create({
      data: {
        patientId: patients[4].id,
        type: 'Implant unitaire',
        dateDebut: new Date('2025-04-11'),
        statut: 'planifie',
        cout: 2500,
        dents: '45', // Position probable mandibule
        notes: 'Implant 4.2*10 - Torque 40 Ncm - Correspondant Elisa'
      }
    }),
    // BERTRAND Aude - Implant 3.6*10
    prisma.traitement.create({
      data: {
        patientId: patients[5].id,
        type: 'Implant unitaire',
        dateDebut: new Date('2025-04-11'),
        statut: 'planifie',
        cout: 2200,
        dents: '38', // Position probable pour 3.6*10
        notes: 'Implant 3.6*10 - Torque 40 Ncm - Correspondant Elisa'
      }
    }),
    // REGNIER Muriel - Implant 4.8*8
    prisma.traitement.create({
      data: {
        patientId: patients[6].id,
        type: 'Implant unitaire',
        dateDebut: new Date('2025-05-09'),
        statut: 'planifie',
        cout: 2500,
        dents: '16', // Position probable molaire maxillaire
        notes: 'Implant 4.8*8 - Torque 40 Ncm - Correspondant Théophanie'
      }
    }),
    // BIANCO Danilo - Prévu 23/06/2025
    prisma.traitement.create({
      data: {
        patientId: patients[7].id,
        type: 'Implant unitaire',
        dateDebut: new Date('2025-06-23'),
        statut: 'planifie',
        cout: 2500,
        dents: '24', // Position à déterminer
        notes: 'OK pour lui - Prévu 23/06/2025 - Correspondant Théophanie'
      }
    }),
    // MAURICE Christine - Implant Elisa
    prisma.traitement.create({
      data: {
        patientId: patients[8].id,
        type: 'Implant unitaire',
        dateDebut: new Date('2025-01-15'),
        statut: 'planifie',
        cout: 2500,
        dents: '36',
        notes: 'Implant Elisa - À programmer'
      }
    }),
    // LAVOUE Eddy - Implant Elisa
    prisma.traitement.create({
      data: {
        patientId: patients[9].id,
        type: 'Implant unitaire',
        dateDebut: new Date('2025-02-01'),
        statut: 'planifie',
        cout: 2500,
        dents: '46',
        notes: 'Implant Elisa - À programmer'
      }
    })
  ])

  console.log(`✅ ${traitements.length} traitements créés`)

  // ===========================================
  // RENDEZ-VOUS basés sur les dates des implants
  // ===========================================
  console.log('📅 Création des rendez-vous...')

  const today = new Date()
  const rendezVous = await Promise.all([
    // RDV prochains basés sur les planifications Excel
    prisma.rendezVous.create({
      data: {
        patientId: patients[0].id, // FAURE Nadine
        titre: 'Contrôle implant 4.2*8',
        dateHeure: new Date('2025-01-14'), // 3 mois après pose
        duree: 30,
        type: 'controle',
        statut: 'planifie',
        notes: 'Contrôle cicatrisation et ostéointégration'
      }
    }),
    prisma.rendezVous.create({
      data: {
        patientId: patients[1].id, // MBARKI Amin
        titre: 'Pose implant 4.2*10',
        dateHeure: new Date('2024-12-03'),
        duree: 90,
        type: 'chirurgie',
        statut: 'planifie',
        notes: 'Pose implant selon planning Théophanie'
      }
    }),
    prisma.rendezVous.create({
      data: {
        patientId: patients[7].id, // BIANCO Danilo
        titre: 'Consultation pré-implantaire',
        dateHeure: new Date('2025-06-23'),
        duree: 60,
        type: 'consultation',
        statut: 'planifie',
        notes: 'OK pour lui - Consultation avec Théophanie'
      }
    })
  ])

  console.log(`✅ ${rendezVous.length} rendez-vous créés`)

  // ===========================================
  // FILES D'ATTENTE basées sur les correspondants
  // ===========================================
  console.log('⏳ Création des files d\'attente...')

  const filesAttente = await Promise.all([
    // Patients Elisa
    prisma.fileAttente.create({
      data: {
        patientId: patients[2].id, // KLEIN Sophie
        type: 'implantologie',
        priorite: 2, // medium
        dateAjout: new Date(),
        notes: 'Attente planning Elisa - Implant 4.8*10',
        statut: 'waiting'
      }
    }),
    // Patients Théophanie
    prisma.fileAttente.create({
      data: {
        patientId: patients[6].id, // REGNIER Muriel
        type: 'implantologie',
        priorite: 2, // medium
        dateAjout: new Date(),
        notes: 'Attente planning Théophanie - Implant 4.8*8',
        statut: 'waiting'
      }
    }),
    // Patients en attente de consultation
    prisma.fileAttente.create({
      data: {
        patientId: patients[8].id, // MAURICE Christine
        type: 'implantologie',
        priorite: 1, // low
        dateAjout: new Date(),
        notes: 'À programmer avec Elisa',
        statut: 'waiting'
      }
    })
  ])

  console.log(`✅ ${filesAttente.length} entrées en file d'attente créées`)

  console.log('\n🎉 Base de données Paroflow initialisée avec VOS vraies données anonymisées !')
  console.log('📊 Résumé basé sur vos fichiers Excel :')
  console.log(`  - ${correspondants.length} correspondants (inspirés de votre carnet)`)
  console.log(`  - ${patients.length} patients implantologie (anonymisés de votre fichier)`)
  console.log(`  - ${traitements.length} traitements avec types d'implants réels`)
  console.log(`  - ${rendezVous.length} rendez-vous planifiés selon vos dates`)
  console.log(`  - ${filesAttente.length} patients en file d'attente par correspondant`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })