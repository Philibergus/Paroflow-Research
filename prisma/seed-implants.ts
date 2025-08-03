import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🦷 Initialisation du catalogue d\'implants dentaires...')
  
  // Nettoyer les tables implants dans le bon ordre
  console.log('🧹 Nettoyage des tables implants...')
  await prisma.suiviImplant.deleteMany()
  await prisma.implantUtilise.deleteMany() 
  await prisma.mouvementStock.deleteMany()
  await prisma.stockImplant.deleteMany()
  await prisma.referenceImplant.deleteMany()
  await prisma.systemeImplant.deleteMany()
  await prisma.marqueImplant.deleteMany()

  console.log('✅ Tables implants nettoyées')

  // ===========================================
  // 1. CRÉATION DES MARQUES
  // ===========================================
  console.log('🏭 Création des marques d\'implants...')

  const marques = await Promise.all([
    prisma.marqueImplant.create({
      data: {
        nom: 'Nobel Biocare',
        codeMarque: 'NOBEL',
        pays: 'Suède',
        siteWeb: 'https://www.nobelbiocare.com',
        notes: 'Leader mondial innovation implantaire. Précurseur placement immédiat et chirurgie guidée.'
      }
    }),
    prisma.marqueImplant.create({
      data: {
        nom: 'Straumann',
        codeMarque: 'STRAUMANN', 
        pays: 'Suisse',
        siteWeb: 'https://www.straumann.com',
        notes: 'Référence mondiale recherche clinique. Surface SLActive et alliage Roxolid.'
      }
    }),
    prisma.marqueImplant.create({
      data: {
        nom: 'Biotech Dental',
        codeMarque: 'BIOTECH',
        pays: 'France',
        siteWeb: 'https://www.biotech-dental.com',
        notes: 'Implants français haut de gamme. Système Kontact et Kontact+ avec surface OsseoSpeed.'
      }
    })
  ])

  console.log(`✅ ${marques.length} marques créées`)

  // ===========================================
  // 2. CRÉATION DES SYSTÈMES NOBEL BIOCARE
  // ===========================================
  console.log('🔧 Création des systèmes Nobel Biocare...')

  const systemesNobel = await Promise.all([
    prisma.systemeImplant.create({
      data: {
        marqueId: marques[0].id, // Nobel Biocare
        nom: 'NobelActive',
        codeSysteme: 'NA',
        description: 'Implant auto-taraudant pour placement immédiat',
        typeConnexion: 'Hexagone + Cône Morse',
        surface: 'TiUnite',
        materiau: 'Titane Grade 4',
        indicationsPrincipales: 'Placement immédiat, tous types d\'os'
      }
    }),
    prisma.systemeImplant.create({
      data: {
        marqueId: marques[0].id,
        nom: 'NobelParallel CC',
        codeSysteme: 'NP',
        description: 'Implant cylindrique connexion conique',
        typeConnexion: 'Hexagone + Cône Morse',
        surface: 'TiUnite',
        materiau: 'Titane Grade 4',
        indicationsPrincipales: 'Protocole conventionnel, stabilité primaire'
      }
    }),
    prisma.systemeImplant.create({
      data: {
        marqueId: marques[0].id,
        nom: 'NobelReplace Tapered',
        codeSysteme: 'NRT',
        description: 'Implant conique zones esthétiques',
        typeConnexion: 'Hexagone + Cône Morse',
        surface: 'TiUnite',
        materiau: 'Titane Grade 4',
        indicationsPrincipales: 'Zones esthétiques, remplacement unitaire'
      }
    }),
    prisma.systemeImplant.create({
      data: {
        marqueId: marques[0].id,
        nom: 'Nobel N1 System',
        codeSysteme: 'N1',
        description: 'Nouvelle génération connexion Trioval',
        typeConnexion: 'Trioval Conique',
        surface: 'TiUltra',
        materiau: 'Titane Grade 4',
        indicationsPrincipales: 'Innovation 2024, polyvalence maximale'
      }
    })
  ])

  // ===========================================
  // 3. CRÉATION DES SYSTÈMES STRAUMANN
  // ===========================================
  console.log('🔧 Création des systèmes Straumann...')

  const systemesStaumann = await Promise.all([
    prisma.systemeImplant.create({
      data: {
        marqueId: marques[1].id, // Straumann
        nom: 'Bone Level Tapered (BLT)',
        codeSysteme: 'BLT',
        description: 'Référence mondiale implantologie conventionnelle',
        typeConnexion: 'CrossFit',
        surface: 'SLActive',
        materiau: 'Roxolid (Ti-Zr)',
        indicationsPrincipales: 'Gold standard, tous protocoles'
      }
    }),
    prisma.systemeImplant.create({
      data: {
        marqueId: marques[1].id,
        nom: 'BLX System',
        codeSysteme: 'BLX',
        description: 'Système conique placement immédiat',
        typeConnexion: 'TorcFit (7° + étoile)',
        surface: 'SLActive',
        materiau: 'Roxolid (Ti-Zr)',
        indicationsPrincipales: 'Placement immédiat tous types os'
      }
    }),
    prisma.systemeImplant.create({
      data: {
        marqueId: marques[1].id,
        nom: 'BLC - Bone Level Conical',
        codeSysteme: 'BLC',
        description: 'Nouveauté 2024 - Système iEXCEL',
        typeConnexion: 'TorcFit court (3mm)',
        surface: 'SLActive',
        materiau: 'Roxolid (Ti-Zr)',
        indicationsPrincipales: 'Innovation 2024, permet implants 6mm'
      }
    })
  ])

  // ===========================================
  // 4. CRÉATION DES SYSTÈMES BIOTECH DENTAL
  // ===========================================
  console.log('🔧 Création des systèmes Biotech Dental...')

  const systemesBiotech = await Promise.all([
    prisma.systemeImplant.create({
      data: {
        marqueId: marques[2].id, // Biotech Dental
        nom: 'Kontact',
        codeSysteme: 'KONTACT',
        description: 'Système implantaire français haut de gamme',
        typeConnexion: 'Interne Hexagonale',
        surface: 'OsseoSpeed',
        materiau: 'Titane Grade 4',
        indicationsPrincipales: 'Placement conventionnel, excellent rapport qualité-prix'
      }
    }),
    prisma.systemeImplant.create({
      data: {
        marqueId: marques[2].id,
        nom: 'Kontact+',
        codeSysteme: 'KONTACT_PLUS',
        description: 'Version améliorée du système Kontact',
        typeConnexion: 'Interne Hexagonale',
        surface: 'OsseoSpeed+',
        materiau: 'Ti-6Al-4V ELI',
        indicationsPrincipales: 'Post-extraction immédiate'
      }
    })
  ])

  console.log(`✅ ${systemesNobel.length + systemesStaumann.length + systemesBiotech.length} systèmes créés`)

  // ===========================================
  // 5. RÉFÉRENCES NOBEL BIOCARE - NOBELACTIVE
  // ===========================================
  console.log('📋 Création des références NobelActive...')

  const referencesNobelActive = []
  const diametresNA = [3.5, 4.3, 5.0]
  const longueursNA = [8, 10, 11.5, 13, 16]

  for (const diametre of diametresNA) {
    for (const longueur of longueursNA) {
      const plateformeProsthetique = diametre === 3.5 ? 'NP' : diametre === 4.3 ? 'RP' : 'WP'
      const reference = await prisma.referenceImplant.create({
        data: {
          systemeId: systemesNobel[0].id, // NobelActive
          codeReference: `NA-${diametre}-${longueur}`,
          diametre: diametre,
          longueur: longueur,
          plateformeProsthetique: plateformeProsthetique,
          connexionDiametre: diametre === 3.5 ? 3.5 : diametre === 4.3 ? 4.3 : 5.0,
          prixUnitaire: 350.0, // Prix indicatif
          notes: `NobelActive ${diametre}mm x ${longueur}mm - Placement immédiat`
        }
      })
      referencesNobelActive.push(reference)
    }
  }

  // ===========================================
  // 6. RÉFÉRENCES STRAUMANN BLT
  // ===========================================
  console.log('📋 Création des références Straumann BLT...')

  const referencesBLT = []
  const diametresBLT = [3.3, 4.1, 4.8]
  const longueursBLT = [6, 8, 10, 12, 14, 16]

  for (const diametre of diametresBLT) {
    for (const longueur of longueursBLT) {
      const reference = await prisma.referenceImplant.create({
        data: {
          systemeId: systemesStaumann[0].id, // BLT
          codeReference: `BLT-${diametre.toString().replace('.', '')}-${longueur}`,
          diametre: diametre,
          longueur: longueur,
          plateformeProsthetique: diametre === 3.3 ? 'NC' : diametre === 4.1 ? 'RC' : 'WC',
          connexionDiametre: 4.1, // CrossFit standard
          prixUnitaire: 380.0, // Prix indicatif
          notes: `Straumann BLT ${diametre}mm x ${longueur}mm - Roxolid SLActive`
        }
      })
      referencesBLT.push(reference)
    }
  }

  // ===========================================
  // 7. RÉFÉRENCES BIOTECH DENTAL KONTACT® - CATALOGUE OFFICIEL
  // ===========================================
  console.log('📋 Création des références Biotech Dental Kontact® (catalogue officiel)...')

  const referencesBiotech = []
  
  // Implants Kontact® - Diametres et longueurs du catalogue officiel
  const diametresKontact = [3.0, 3.6, 4.2, 4.8, 5.4]
  const longueursKontact = [6, 8, 10, 12, 14, 16]

  // Création des références Kontact® standard
  for (const diametre of diametresKontact) {
    for (const longueur of longueursKontact) {
      // Code référence selon catalogue : K + diamètre sans point + longueur
      const codeReference = `K${diametre.toString().replace('.', '')}${longueur.toString().padStart(2, '0')}`
      
      const reference = await prisma.referenceImplant.create({
        data: {
          systemeId: systemesBiotech[0].id, // Kontact
          codeReference: codeReference,
          diametre: diametre,
          longueur: longueur,
          plateformeProsthetique: `Ø${diametre}mm`,
          connexionDiametre: diametre === 3.0 ? 2.8 : diametre === 3.6 ? 3.3 : diametre === 4.2 ? 3.8 : diametre === 4.8 ? 4.3 : 4.8,
          prixUnitaire: 280.0,
          notes: `Kontact® Ø${diametre}mm L${longueur}mm - Surface OsseoSpeed`
        }
      })
      referencesBiotech.push(reference)
    }
  }

  // Création des références Kontact S® (version switch-platform)
  for (const diametre of diametresKontact) {
    for (const longueur of longueursKontact) {
      // Code référence Kontact S® : K + diamètre sans point + longueur + S
      const codeReference = `K${diametre.toString().replace('.', '')}${longueur.toString().padStart(2, '0')}S`
      
      const reference = await prisma.referenceImplant.create({
        data: {
          systemeId: systemesBiotech[1].id, // Kontact+
          codeReference: codeReference,
          diametre: diametre,
          longueur: longueur,
          plateformeProsthetique: `Ø${diametre}mm`,
          connexionDiametre: diametre === 3.0 ? 2.8 : diametre === 3.6 ? 3.3 : diametre === 4.2 ? 3.8 : diametre === 4.8 ? 4.3 : 4.8,
          prixUnitaire: 320.0,
          notes: `Kontact S® Ø${diametre}mm L${longueur}mm - Switch-platform, Surface OsseoSpeed`
        }
      })
      referencesBiotech.push(reference)
    }
  }

  // ===========================================
  // 8. CRÉATION D'EXEMPLES DE STOCK
  // ===========================================
  console.log('📦 Création d\'exemples de stock...')

  const exemplesStock = [
    // Quelques références populaires avec stock
    { referenceId: referencesNobelActive[0].id, quantite: 5, emplacement: 'Armoire A-1' },
    { referenceId: referencesNobelActive[5].id, quantite: 3, emplacement: 'Armoire A-1' },
    { referenceId: referencesBLT[6].id, quantite: 8, emplacement: 'Armoire A-2' },
    { referenceId: referencesBLT[12].id, quantite: 2, emplacement: 'Armoire A-2' },
    { referenceId: referencesBiotech[10].id, quantite: 6, emplacement: 'Tiroir B-1' },
    { referenceId: referencesBiotech[15].id, quantite: 4, emplacement: 'Tiroir B-1' }
  ]

  for (const stockItem of exemplesStock) {
    await prisma.stockImplant.create({
      data: {
        referenceId: stockItem.referenceId,
        quantiteStock: stockItem.quantite,
        seuilAlerte: 2,
        quantiteCommande: 5,
        emplacement: stockItem.emplacement,
        fournisseurPrincipal: 'Henry Schein Dental',
        dateInventaire: new Date()
      }
    })
  }

  console.log('✅ Exemples de stock créés')

  // ===========================================
  // 9. INSTRUMENTS CHIRURGICAUX BIOTECH DENTAL
  // ===========================================
  console.log('🔧 Création des instruments chirurgicaux Biotech Dental...')

  // Instruments de base pour système Kontact® selon catalogue officiel
  const instrumentsChirurgicaux = [
    // Forets spiralés
    { code: 'FS20', nom: 'Foret spiralé Ø2.0mm', type: 'Foret', usage: 'Perçage initial' },
    { code: 'FS28', nom: 'Foret spiralé Ø2.8mm', type: 'Foret', usage: 'Préparation implant Ø3.0mm' },
    { code: 'FS33', nom: 'Foret spiralé Ø3.3mm', type: 'Foret', usage: 'Préparation implant Ø3.6mm' },
    { code: 'FS38', nom: 'Foret spiralé Ø3.8mm', type: 'Foret', usage: 'Préparation implant Ø4.2mm' },
    { code: 'FS43', nom: 'Foret spiralé Ø4.3mm', type: 'Foret', usage: 'Préparation implant Ø4.8mm' },
    { code: 'FS48', nom: 'Foret spiralé Ø4.8mm', type: 'Foret', usage: 'Préparation implant Ø5.4mm' },
    
    // Tarauds
    { code: 'T30', nom: 'Taraud Ø3.0mm', type: 'Taraud', usage: 'Filetage implant Ø3.0mm' },
    { code: 'T36', nom: 'Taraud Ø3.6mm', type: 'Taraud', usage: 'Filetage implant Ø3.6mm' },
    { code: 'T42', nom: 'Taraud Ø4.2mm', type: 'Taraud', usage: 'Filetage implant Ø4.2mm' },
    { code: 'T48', nom: 'Taraud Ø4.8mm', type: 'Taraud', usage: 'Filetage implant Ø4.8mm' },
    { code: 'T54', nom: 'Taraud Ø5.4mm', type: 'Taraud', usage: 'Filetage implant Ø5.4mm' },
    
    // Instruments de pose
    { code: 'TORR', nom: 'Clé dynamométrique', type: 'Pose', usage: 'Pose contrôlée 15-45 Ncm' },
    { code: 'RATCHET', nom: 'Ratchet chirurgical', type: 'Pose', usage: 'Pose manuelle implants' },
    { code: 'MOUNT', nom: 'Porte-implant', type: 'Pose', usage: 'Manipulation stérile implant' },
    
    // Instruments prothétiques
    { code: 'HEX12', nom: 'Tournevis hexagonal 1.2mm', type: 'Prothétique', usage: 'Serrage vis prothétiques' },
    { code: 'HEX20', nom: 'Tournevis hexagonal 2.0mm', type: 'Prothétique', usage: 'Serrage piliers' },
    { code: 'CONTRA', nom: 'Contre-angle chirurgical', type: 'Pose', usage: 'Pose implant assistée' }
  ]

  // Créer les instruments comme références spéciales
  for (const instrument of instrumentsChirurgicaux) {
    await prisma.referenceImplant.create({
      data: {
        systemeId: systemesBiotech[0].id, // Associé au système Kontact
        codeReference: instrument.code,
        diametre: 0, // Pas applicable pour instruments
        longueur: 0, // Pas applicable pour instruments
        plateformeProsthetique: 'Instrument',
        connexionDiametre: 0,
        prixUnitaire: instrument.type === 'Foret' ? 45.0 : 
                     instrument.type === 'Taraud' ? 85.0 :
                     instrument.type === 'Pose' ? 120.0 : 65.0,
        notes: `${instrument.nom} - ${instrument.usage}`
      }
    })
  }

  console.log(`✅ ${instrumentsChirurgicaux.length} instruments chirurgicaux créés`)

  // ===========================================
  // RÉSUMÉ FINAL
  // ===========================================
  const totalReferences = referencesNobelActive.length + referencesBLT.length + referencesBiotech.length
  const totalInstruments = instrumentsChirurgicaux.length

  console.log('\\n🎉 Catalogue d\'implants initialisé avec succès !')
  console.log('📊 Résumé du catalogue :')
  console.log(`  - 3 marques principales`)
  console.log(`  - ${systemesNobel.length + systemesStaumann.length + systemesBiotech.length} systèmes d'implants`)
  console.log(`  - ${totalReferences} références implants`)
  console.log(`  - ${totalInstruments} instruments chirurgicaux Biotech`)
  console.log(`  - ${exemplesStock.length} références en stock`)
  console.log('\\n📋 Détail par marque :')
  console.log(`  • Nobel Biocare: ${referencesNobelActive.length} références NobelActive`)
  console.log(`  • Straumann: ${referencesBLT.length} références BLT`)
  console.log(`  • Biotech Dental: ${referencesBiotech.length} références Kontact® + ${totalInstruments} instruments`)
  console.log('\\n🔧 Instruments Biotech Dental inclus :')
  console.log(`  • Forets spiralés (6 diamètres)`)
  console.log(`  • Tarauds (5 diamètres)`)
  console.log(`  • Instruments de pose (3 types)`)
  console.log(`  • Instruments prothétiques (3 types)`)
  console.log('\\n✅ Prêt pour utilisation clinique !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de l\'initialisation du catalogue:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })