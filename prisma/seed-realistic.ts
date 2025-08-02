import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Nettoyage de la base de données...')
  
  // Nettoyer les tables dans le bon ordre (dépendances)
  await prisma.traitement.deleteMany()
  await prisma.rendezVous.deleteMany()
  await prisma.charteDentaire.deleteMany()
  await prisma.scenarioType.deleteMany()
  await prisma.fileAttente.deleteMany()
  await prisma.documentPatient.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.correspondant.deleteMany()

  console.log('✅ Base de données nettoyée')

  // ===========================================
  // CORRESPONDANTS MÉDICAUX (Anonymisés)
  // ===========================================
  console.log('👨‍⚕️ Création des correspondants médicaux...')

  const correspondants = await Promise.all([
    // Orthodontistes
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Martin LEFEBVRE',
        specialite: 'Orthodontiste',
        telephone: '01 XX XX XX 01',
        email: 'contact.orthodontie@test.fr',
        adresse: '15 Avenue des Champs, 75008 Paris',
        notes: 'Spécialiste adultes et adolescents'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Sophie BERNARD',
        specialite: 'Orthodontiste',
        telephone: '01 XX XX XX 02',
        email: 'orthodontie.bernard@test.fr',
        adresse: '28 Rue de la République, 75011 Paris',
        notes: 'Technique Invisalign certifiée'
      }
    }),
    
    // Chirurgiens Maxillo-Faciaux
    prisma.correspondant.create({
      data: {
        nom: 'Pr. Jean DUBOIS',
        specialite: 'Chirurgien Maxillo-Facial',
        telephone: '01 XX XX XX 03',
        email: 'cmf.dubois@test.fr',
        adresse: 'Hôpital Saint-Louis, Service CMF, 75010 Paris',
        notes: 'Greffes osseuses complexes, PRF'
      }
    }),
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Marc ROUSSEAU',
        specialite: 'Chirurgien Maxillo-Facial',
        telephone: '01 XX XX XX 04',
        email: 'chirurgie.rousseau@test.fr',
        adresse: 'Clinique du Parc, 92100 Boulogne',
        notes: 'Implantologie avancée, sinus lift'
      }
    }),

    // ORL
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Claire MOREAU',
        specialite: 'ORL',
        telephone: '01 XX XX XX 05',
        email: 'orl.moreau@test.fr',
        adresse: '45 Boulevard Haussmann, 75009 Paris',
        notes: 'Pathologies sinusiennes'
      }
    }),

    // Radiologues
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Paul LEROY',
        specialite: 'Radiologue',
        telephone: '01 XX XX XX 06',
        email: 'imagerie.leroy@test.fr',
        adresse: 'Centre Imagerie Médicale, 75015 Paris',
        notes: 'Cone Beam, Scanner'
      }
    }),

    // Parodontologues
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Marie PETIT',
        specialite: 'Parodontologue',
        telephone: '01 XX XX XX 07',
        email: 'paro.petit@test.fr',
        adresse: '12 Rue de Rivoli, 75004 Paris',
        notes: 'Spécialiste régénération tissulaire'
      }
    }),

    // Endodontiste
    prisma.correspondant.create({
      data: {
        nom: 'Dr. Thomas GARCIA',
        specialite: 'Endodontiste',
        telephone: '01 XX XX XX 08',
        email: 'endo.garcia@test.fr',
        adresse: '67 Avenue Victor Hugo, 75016 Paris',
        notes: 'Retraitements complexes sous microscope'
      }
    })
  ])

  console.log(`✅ ${correspondants.length} correspondants créés`)

  // ===========================================
  // PATIENTS IMPLANTOLOGIE (Anonymisés)
  // ===========================================
  console.log('👥 Création des patients implantologie...')

  const patients = await Promise.all([
    // Cas 1: Implant unitaire antérieur
    prisma.patient.create({
      data: {
        nom: 'DUPONT',
        prenom: 'Michel',
        dateNaissance: new Date('1965-03-15'),
        telephone: '06 XX XX XX 01',
        email: 'patient1@test.fr',
        adresse: '123 Rue de Test, 75001 Paris',
        numeroSecurite: '1650375XXX',
        notes: 'Implant 11 suite à trauma',
        correspondantId: correspondants[2].id // Pr. Dubois (CMF)
      }
    }),

    // Cas 2: Bridge implanto-porté
    prisma.patient.create({
      data: {
        nom: 'MARTIN',
        prenom: 'Isabelle',
        dateNaissance: new Date('1958-07-22'),
        telephone: '06 XX XX XX 02',
        email: 'patient2@test.fr',
        adresse: '456 Avenue Test, 75002 Paris',
        numeroSecu: '2580775XXX',
        mutuelle: 'Test Santé Plus',
        antecedentsMedicaux: 'Diabète type 2 équilibré',
        allergies: 'Pénicilline',
        notes: 'Bridge 34-36 sur 2 implants',
        correspondantId: correspondants[6].id // Dr. Petit (Paro)
      }
    }),

    // Cas 3: Réhabilitation complète maxillaire
    prisma.patient.create({
      data: {
        nom: 'BERNARD',
        prenom: 'Jacques',
        dateNaissance: new Date('1952-11-08'),
        telephone: '06 XX XX XX 03',
        email: 'patient3@test.fr',
        adresse: '789 Boulevard Test, 75003 Paris',
        numeroSecu: '1521175XXX',
        mutuelle: 'Test Prévoyance',
        antecedentsMedicaux: 'HTA, Statines',
        allergies: 'Latex',
        notes: 'All-on-6 maxillaire',
        correspondantId: correspondants[3].id // Dr. Rousseau (CMF)
      }
    }),

    // Cas 4: Sinus lift + implants
    prisma.patient.create({
      data: {
        nom: 'DURAND',
        prenom: 'Catherine',
        dateNaissance: new Date('1970-04-12'),
        telephone: '06 XX XX XX 04',
        email: 'patient4@test.fr',
        adresse: '321 Rue Example, 75004 Paris',
        numeroSecu: '2700475XXX',
        mutuelle: 'Test Assurance',
        antecedentsMedicaux: 'Tabagisme sevré 2020',
        allergies: 'Aucune',
        notes: 'Sinus lift bilatéral + 4 implants postérieurs',
        correspondantId: correspondants[4].id // Dr. Moreau (ORL)
      }
    }),

    // Cas 5: Implant immédiat post-extraction
    prisma.patient.create({
      data: {
        nom: 'ROBERT',
        prenom: 'Pierre',
        dateNaissance: new Date('1975-09-30'),
        telephone: '06 XX XX XX 05',
        email: 'patient5@test.fr',
        adresse: '654 Avenue Demo, 75005 Paris',
        numeroSecu: '1750975XXX',
        mutuelle: 'Test Garantie',
        antecedentsMedicaux: 'RAS',
        allergies: 'Iode',
        notes: 'Extraction 36 + implant immédiat',
        correspondantId: correspondants[7].id // Dr. Garcia (Endo)
      }
    }),

    // Cas 6: Greffe osseuse + implants différés
    prisma.patient.create({
      data: {
        nom: 'LEFEVRE',
        prenom: 'Marie',
        dateNaissance: new Date('1968-12-05'),
        telephone: '06 XX XX XX 06',
        email: 'patient6@test.fr',
        adresse: '987 Rue Sample, 75006 Paris',
        numeroSecu: '2681275XXX',
        mutuelle: 'Test Protection',
        antecedentsMedicaux: 'Ostéoporose',
        allergies: 'Aucune',
        notes: 'ROG secteur 2 + 3 implants différés',
        correspondantId: correspondants[2].id // Pr. Dubois (CMF)
      }
    }),

    // Cas 7: Implants + orthodontie
    prisma.patient.create({
      data: {
        nom: 'MOREAU',
        prenom: 'Sophie',
        dateNaissance: new Date('1985-06-18'),
        telephone: '06 XX XX XX 07',
        email: 'patient7@test.fr',
        adresse: '147 Boulevard Test, 75007 Paris',
        numeroSecu: '2850675XXX',
        mutuelle: 'Test Famille',
        antecedentsMedicaux: 'RAS',
        allergies: 'Nickel',
        notes: 'Orthodontie pré-implantaire + 2 implants 15,25',
        correspondantId: correspondants[0].id // Dr. Lefebvre (Ortho)
      }
    }),

    // Cas 8: Péri-implantite
    prisma.patient.create({
      data: {
        nom: 'PETIT',
        prenom: 'Jean',
        dateNaissance: new Date('1962-02-28'),
        telephone: '06 XX XX XX 08',
        email: 'patient8@test.fr',
        adresse: '258 Avenue Example, 75008 Paris',
        numeroSecu: '1620275XXX',
        mutuelle: 'Test Senior',
        antecedentsMedicaux: 'Bruxisme',
        allergies: 'Aucune',
        notes: 'Traitement péri-implantite 46',
        correspondantId: correspondants[6].id // Dr. Petit (Paro)
      }
    }),

    // Cas 9: Mise en charge immédiate
    prisma.patient.create({
      data: {
        nom: 'ROUSSEAU',
        prenom: 'Anne',
        dateNaissance: new Date('1972-10-14'),
        telephone: '06 XX XX XX 09',
        email: 'patient9@test.fr',
        adresse: '369 Rue Demo, 75009 Paris',
        numeroSecu: '2721075XXX',
        mutuelle: 'Test Confort',
        antecedentsMedicaux: 'Hypothyroïdie',
        allergies: 'Aucune',
        notes: 'Implants 14-16 mise en charge immédiate',
        correspondantId: correspondants[5].id // Dr. Leroy (Radio)
      }
    }),

    // Cas 10: Complication sinusienne
    prisma.patient.create({
      data: {
        nom: 'GARCIA',
        prenom: 'François',
        dateNaissance: new Date('1960-01-20'),
        telephone: '06 XX XX XX 10',
        email: 'patient10@test.fr',
        adresse: '741 Boulevard Sample, 75010 Paris',
        numeroSecu: '1600175XXX',
        mutuelle: 'Test Premium',
        antecedentsMedicaux: 'Sinusite chronique',
        allergies: 'Aspirine',
        notes: 'Communication bucco-sinusienne post-extraction 26',
        correspondantId: correspondants[4].id // Dr. Moreau (ORL)
      }
    })
  ])

  console.log(`✅ ${patients.length} patients créés`)

  // ===========================================
  // TRAITEMENTS IMPLANTOLOGIE
  // ===========================================
  console.log('💊 Création des traitements...')

  const traitements = await Promise.all([
    // Patient 1 - Implant unitaire antérieur
    prisma.traitement.create({
      data: {
        patientId: patients[0].id,
        type: 'Implant unitaire',
        description: 'Pose implant 11 + couronne céramique',
        dateDebut: new Date('2024-06-15'),
        dateFin: new Date('2024-12-15'),
        statut: 'en_cours',
        cout: 2500,
        dents: '11',
        notes: 'Phase de temporisation en cours'
      }
    }),

    // Patient 2 - Bridge implanto-porté
    prisma.traitement.create({
      data: {
        patientId: patients[1].id,
        type: 'Bridge implanto-porté',
        description: 'Bridge 34-35-36 sur implants 34 et 36',
        dateDebut: new Date('2024-09-01'),
        statut: 'planifie',
        cout: 4800,
        dents: '34,35,36',
        notes: 'Attente cicatrisation extraction 35'
      }
    }),

    // Patient 3 - All-on-6
    prisma.traitement.create({
      data: {
        patientId: patients[2].id,
        type: 'Réhabilitation complète',
        description: 'All-on-6 maxillaire avec mise en charge immédiate',
        dateDebut: new Date('2024-03-01'),
        dateFin: new Date('2024-10-01'),
        statut: 'en_cours',
        cout: 18000,
        dents: '11,12,13,14,15,16,21,22,23,24,25,26',
        notes: 'Prothèse provisoire en place'
      }
    }),

    // Patient 4 - Sinus lift
    prisma.traitement.create({
      data: {
        patientId: patients[3].id,
        type: 'Sinus lift',
        description: 'Sinus lift bilatéral + 4 implants',
        dateDebut: new Date('2024-07-10'),
        statut: 'en_cours',
        cout: 6500,
        dents: '15,16,25,26',
        notes: 'Phase 1 (sinus lift) terminée, attente 6 mois'
      }
    }),

    // Patient 5 - Implant immédiat
    prisma.traitement.create({
      data: {
        patientId: patients[4].id,
        type: 'Implant immédiat',
        description: 'Extraction 36 + implant immédiat',
        dateDebut: new Date('2024-11-20'),
        dateFin: new Date('2025-03-20'),
        statut: 'planifie',
        cout: 2200,
        dents: '36',
        notes: 'Protocole extraction-implantation immédiate'
      }
    }),

    // Patient 6 - ROG
    prisma.traitement.create({
      data: {
        patientId: patients[5].id,
        type: 'Greffe osseuse',
        description: 'ROG secteur 2 avec Bio-Oss et membrane',
        dateDebut: new Date('2024-05-15'),
        statut: 'en_cours',
        cout: 3200,
        dents: '23,24,25',
        notes: 'Cicatrisation en cours, implants prévus dans 4 mois'
      }
    }),

    // Patient 7 - Ortho + implants
    prisma.traitement.create({
      data: {
        patientId: patients[6].id,
        type: 'Orthodontie + Implants',
        description: 'Préparation orthodontique + 2 implants',
        dateDebut: new Date('2024-01-10'),
        statut: 'en_cours',
        cout: 5500,
        dents: '15,25',
        notes: 'Phase orthodontique terminée, implants planifiés'
      }
    }),

    // Patient 8 - Péri-implantite
    prisma.traitement.create({
      data: {
        patientId: patients[7].id,
        type: 'Traitement péri-implantite',
        description: 'Débridement + désinfection implant 46',
        dateDebut: new Date('2024-10-05'),
        statut: 'en_cours',
        cout: 800,
        dents: '46',
        notes: 'Protocole CIST + maintenance renforcée'
      }
    }),

    // Patient 9 - MCI
    prisma.traitement.create({
      data: {
        patientId: patients[8].id,
        type: 'Mise en charge immédiate',
        description: 'Implants 14-16 avec bridge provisoire immédiat',
        dateDebut: new Date('2024-08-20'),
        dateFin: new Date('2025-02-20'),
        statut: 'en_cours',
        cout: 4200,
        dents: '14,15,16',
        notes: 'Bridge provisoire en place, définitif prévu février'
      }
    }),

    // Patient 10 - Communication bucco-sinusienne
    prisma.traitement.create({
      data: {
        patientId: patients[9].id,
        type: 'Fermeture CBS',
        description: 'Fermeture communication bucco-sinusienne',
        dateDebut: new Date('2024-09-15'),
        dateFin: new Date('2024-10-15'),
        statut: 'termine',
        cout: 1200,
        dents: '26',
        notes: 'Cicatrisation complète, contrôle ORL OK'
      }
    })
  ])

  console.log(`✅ ${traitements.length} traitements créés`)

  // ===========================================
  // RENDEZ-VOUS
  // ===========================================
  console.log('📅 Création des rendez-vous...')

  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

  const rendezVous = await Promise.all([
    // RDV cette semaine
    prisma.rendezVous.create({
      data: {
        patientId: patients[0].id,
        titre: 'Contrôle cicatrisation',
        dateHeure: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        duree: 30,
        type: 'controle',
        statut: 'planifie',
        notes: 'Vérifier ostéointégration implant 11'
      }
    }),
    prisma.rendezVous.create({
      data: {
        patientId: patients[3].id,
        titre: 'Radio contrôle sinus',
        dateHeure: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        duree: 45,
        type: 'imagerie',
        statut: 'planifie',
        notes: 'Cone beam contrôle sinus lift'
      }
    }),

    // RDV semaine prochaine
    prisma.rendezVous.create({
      data: {
        patientId: patients[1].id,
        titre: 'Empreintes bridge',
        dateHeure: nextWeek,
        duree: 60,
        type: 'prothese',
        statut: 'planifie',
        notes: 'Empreintes pour bridge 34-36'
      }
    }),
    prisma.rendezVous.create({
      data: {
        patientId: patients[7].id,
        titre: 'Maintenance péri-implantite',
        dateHeure: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
        duree: 45,
        type: 'maintenance',
        statut: 'planifie',
        notes: 'Protocole maintenance renforcée'
      }
    }),

    // RDV mois prochain
    prisma.rendezVous.create({
      data: {
        patientId: patients[4].id,
        titre: 'Chirurgie implant 36',
        dateHeure: nextMonth,
        duree: 90,
        type: 'chirurgie',
        statut: 'planifie',
        notes: 'Extraction + implant immédiat'
      }
    })
  ])

  console.log(`✅ ${rendezVous.length} rendez-vous créés`)

  // ===========================================
  // FILES D'ATTENTE
  // ===========================================
  console.log('⏳ Création des files d\'attente...')

  const filesAttente = await Promise.all([
    // File parodontologie
    prisma.fileAttente.create({
      data: {
        patientId: patients[1].id,
        type: 'parodontologie',
        priorite: 'normale',
        dateAjout: new Date(),
        motif: 'Maintenance parodontale pré-implantaire',
        statut: 'en_attente'
      }
    }),
    prisma.fileAttente.create({
      data: {
        patientId: patients[7].id,
        type: 'parodontologie',
        priorite: 'urgente',
        dateAjout: new Date(),
        motif: 'Péri-implantite active',
        statut: 'en_attente'
      }
    }),

    // File implantologie
    prisma.fileAttente.create({
      data: {
        patientId: patients[5].id,
        type: 'implantologie',
        priorite: 'normale',
        dateAjout: new Date(),
        motif: 'Suite ROG - pose implants',
        statut: 'en_attente'
      }
    }),
    prisma.fileAttente.create({
      data: {
        patientId: patients[6].id,
        type: 'implantologie',
        priorite: 'normale',
        dateAjout: new Date(),
        motif: 'Fin ortho - pose implants',
        statut: 'en_attente'
      }
    }),

    // File suivi
    prisma.fileAttente.create({
      data: {
        patientId: patients[2].id,
        type: 'suivi',
        priorite: 'normale',
        dateAjout: new Date(),
        motif: 'Contrôle 6 mois All-on-6',
        statut: 'en_attente'
      }
    })
  ])

  console.log(`✅ ${filesAttente.length} entrées en file d'attente créées`)

  console.log('\n🎉 Base de données Paroflow initialisée avec succès !')
  console.log('📊 Résumé :')
  console.log(`  - ${correspondants.length} correspondants médicaux`)
  console.log(`  - ${patients.length} patients implantologie`)
  console.log(`  - ${traitements.length} traitements en cours`)
  console.log(`  - ${rendezVous.length} rendez-vous planifiés`)
  console.log(`  - ${filesAttente.length} patients en file d'attente`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })