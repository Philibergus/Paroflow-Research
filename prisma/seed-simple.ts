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

  // Correspondants d'implantologie
  const correspondants = await Promise.all([
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Martin LEFEBVRE',
        specialite: 'Orthodontiste',
        telephone: '01 XX XX XX 01',
        email: 'ortho.test@example.fr',
        adresse: '15 Avenue Test, 75008 Paris',
        notes: 'Spécialiste adultes et adolescents'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Pr. Jean DUBOIS',
        specialite: 'Chirurgien Maxillo-Facial',
        telephone: '01 XX XX XX 03',
        email: 'cmf.test@example.fr',
        adresse: 'Hôpital Test, Service CMF, 75010 Paris',
        notes: 'Greffes osseuses complexes, PRF'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Marie PETIT',
        specialite: 'Parodontologue',
        telephone: '01 XX XX XX 07',
        email: 'paro.test@example.fr',
        adresse: '12 Rue Test, 75004 Paris',
        notes: 'Spécialiste régénération tissulaire'
      }
    })
  ])

  // Patients d'implantologie anonymisés
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        nom: 'DUPONT',
        prenom: 'Michel',
        dateNaissance: new Date('1965-03-15'),
        telephone: '06 XX XX XX 01',
        email: 'patient1@test.fr',
        adresse: '123 Rue Test, 75001 Paris',
        numeroSecurite: '1650375XXX',
        notes: 'Implant 11 suite trauma - CMF: Pr. Dubois - Antécédents: RAS - Allergies: Aucune'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'MARTIN',
        prenom: 'Isabelle',
        dateNaissance: new Date('1958-07-22'),
        telephone: '06 XX XX XX 02',
        email: 'patient2@test.fr',
        adresse: '456 Avenue Test, 75002 Paris',
        numeroSecurite: '2580775XXX',
        notes: 'Bridge 34-36 sur implants - Paro: Dr. Petit - Antécédents: Diabète type 2 - Allergies: Pénicilline'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'BERNARD',
        prenom: 'Jacques',
        dateNaissance: new Date('1952-11-08'),
        telephone: '06 XX XX XX 03',
        email: 'patient3@test.fr',
        adresse: '789 Boulevard Test, 75003 Paris',
        numeroSecurite: '1521175XXX',
        notes: 'All-on-6 maxillaire - CMF: Pr. Dubois - Antécédents: HTA - Allergies: Latex'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'DURAND',
        prenom: 'Catherine',
        dateNaissance: new Date('1970-04-12'),
        telephone: '06 XX XX XX 04',
        email: 'patient4@test.fr',
        adresse: '321 Rue Test, 75004 Paris',
        numeroSecurite: '2700475XXX',
        notes: 'Sinus lift bilatéral + 4 implants - Ortho: Dr. Lefebvre - Antécédents: Ex-tabac - Allergies: Aucune'
      }
    }),
    prisma.patient.create({
      data: {
        nom: 'ROBERT',
        prenom: 'Pierre',
        dateNaissance: new Date('1975-09-30'),
        telephone: '06 XX XX XX 05',
        email: 'patient5@test.fr',
        adresse: '654 Avenue Test, 75005 Paris',
        numeroSecurite: '1750975XXX',
        notes: 'Extraction 36 + implant immédiat - Paro: Dr. Petit - Antécédents: RAS - Allergies: Iode'
      }
    })
  ])

  // Traitements d'implantologie
  const traitements = await Promise.all([
    prisma.traitement.create({
      data: {
        patientId: patients[0].id,
        type: 'Implant unitaire',
        dateDebut: new Date('2024-06-15'),
        dateFin: new Date('2024-12-15'),
        statut: 'en_cours',
        cout: 2500,
        dents: '11',
        notes: 'Pose implant 11 + couronne céramique - Phase temporisation'
      }
    }),
    prisma.traitement.create({
      data: {
        patientId: patients[1].id,
        type: 'Bridge implanto-porté',
        dateDebut: new Date('2024-09-01'),
        statut: 'planifie',
        cout: 4800,
        dents: '34,35,36',
        notes: 'Bridge 34-35-36 sur implants 34 et 36 - Attente cicatrisation'
      }
    }),
    prisma.traitement.create({
      data: {
        patientId: patients[2].id,
        type: 'Réhabilitation complète',
        dateDebut: new Date('2024-03-01'),
        dateFin: new Date('2024-10-01'),
        statut: 'en_cours',
        cout: 18000,
        dents: '11,12,13,14,15,16,21,22,23,24,25,26',
        notes: 'All-on-6 maxillaire avec MCI - Prothèse provisoire en place'
      }
    }),
    prisma.traitement.create({
      data: {
        patientId: patients[3].id,
        type: 'Sinus lift',
        dateDebut: new Date('2024-07-10'),
        statut: 'en_cours',
        cout: 6500,
        dents: '15,16,25,26',
        notes: 'Sinus lift bilatéral + 4 implants - Phase 1 terminée'
      }
    }),
    prisma.traitement.create({
      data: {
        patientId: patients[4].id,
        type: 'Implant immédiat',
        dateDebut: new Date('2024-11-20'),
        dateFin: new Date('2025-03-20'),
        statut: 'planifie',
        cout: 2200,
        dents: '36',
        notes: 'Extraction 36 + implant immédiat - Protocole EII'
      }
    })
  ])

  // Rendez-vous
  const today = new Date()
  const rendezVous = await Promise.all([
    prisma.rendezVous.create({
      data: {
        patientId: patients[0].id,
        titre: 'Contrôle cicatrisation implant 11',
        dateHeure: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        duree: 30,
        type: 'controle',
        statut: 'planifie',
        notes: 'Vérifier ostéointégration'
      }
    }),
    prisma.rendezVous.create({
      data: {
        patientId: patients[1].id,
        titre: 'Empreintes bridge 34-36',
        dateHeure: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        duree: 60,
        type: 'prothese',
        statut: 'planifie',
        notes: 'Empreintes définitives'
      }
    })
  ])

  // Files d'attente
  const filesAttente = await Promise.all([
    prisma.fileAttente.create({
      data: {
        patientId: patients[1].id,
        type: 'parodontologie',
        priorite: 2, // medium
        dateAjout: new Date(),
        notes: 'Maintenance parodontale pré-implantaire',
        statut: 'waiting'
      }
    }),
    prisma.fileAttente.create({
      data: {
        patientId: patients[3].id,
        type: 'implantologie',
        priorite: 2, // medium
        dateAjout: new Date(),
        notes: 'Suite sinus lift - pose implants',
        statut: 'waiting'
      }
    })
  ])

  console.log('\n🎉 Base de données Paroflow initialisée !')
  console.log(`📊 ${correspondants.length} correspondants, ${patients.length} patients, ${traitements.length} traitements`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })