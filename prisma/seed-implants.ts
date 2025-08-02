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
        nom: 'BioHorizons',
        codeMarque: 'BIOHORIZONS',
        pays: 'USA',
        siteWeb: 'https://www.biohorizons.com',
        notes: 'Innovation surface Laser-Lok. Excellent rapport qualité-prix.'
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
  // 4. CRÉATION DES SYSTÈMES BIOHORIZONS
  // ===========================================
  console.log('🔧 Création des systèmes BioHorizons...')

  const systemesBioHorizons = await Promise.all([
    prisma.systemeImplant.create({
      data: {
        marqueId: marques[2].id, // BioHorizons
        nom: 'Tapered Internal',
        codeSysteme: 'TLX',
        description: 'Système conique universel avec Laser-Lok',
        typeConnexion: 'Interne Hexagonale',
        surface: 'RBT + Laser-Lok',
        materiau: 'Ti-6Al-4V ELI',
        indicationsPrincipales: 'Polyvalence, gestion péri-implantaire'
      }
    }),
    prisma.systemeImplant.create({
      data: {
        marqueId: marques[2].id,
        nom: 'Tapered Pro',
        codeSysteme: 'TPR',
        description: 'Optimisé placement immédiat post-extraction',
        typeConnexion: 'Interne Hexagonale',
        surface: 'RBT + Laser-Lok',
        materiau: 'Ti-6Al-4V ELI',
        indicationsPrincipales: 'Post-extraction immédiate'
      }
    })
  ])

  console.log(`✅ ${systemesNobel.length + systemesStaumann.length + systemesBioHorizons.length} systèmes créés`)

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
  // 7. RÉFÉRENCES BIOHORIZONS TAPERED INTERNAL
  // ===========================================
  console.log('📋 Création des références BioHorizons Tapered Internal...')

  const referencesBioHorizons = []
  const diametresTLX = [3.0, 3.4, 3.8, 4.6, 5.8]
  const longueursTLX = [7.5, 9.0, 10.5, 12.0, 15.0, 18.0]

  for (const diametre of diametresTLX) {
    for (const longueur of longueursTLX) {
      const codeReference = `TLX${diametre.toString().replace('.', '')}${longueur.toString().replace('.', '')}`
      const connexionDiametre = 
        diametre <= 3.4 ? 3.0 :
        diametre === 3.8 ? 3.5 :
        diametre === 4.6 ? 4.5 : 5.7

      const reference = await prisma.referenceImplant.create({
        data: {
          systemeId: systemesBioHorizons[0].id, // Tapered Internal
          codeReference: codeReference,
          diametre: diametre,
          longueur: longueur,
          plateformeProsthetique: connexionDiametre.toString(),
          connexionDiametre: connexionDiametre,
          prixUnitaire: 280.0, // Prix indicatif
          notes: `Tapered Internal ${diametre}mm x ${longueur}mm - RBT + Laser-Lok`
        }
      })
      referencesBioHorizons.push(reference)
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
    { referenceId: referencesBioHorizons[10].id, quantite: 6, emplacement: 'Tiroir B-1' },
    { referenceId: referencesBioHorizons[15].id, quantite: 4, emplacement: 'Tiroir B-1' }
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
  // RÉSUMÉ FINAL
  // ===========================================
  const totalReferences = referencesNobelActive.length + referencesBLT.length + referencesBioHorizons.length

  console.log('\\n🎉 Catalogue d\'implants initialisé avec succès !')
  console.log('📊 Résumé du catalogue :')
  console.log(`  - 3 marques principales`)
  console.log(`  - ${systemesNobel.length + systemesStaumann.length + systemesBioHorizons.length} systèmes d'implants`)
  console.log(`  - ${totalReferences} références complètes`)
  console.log(`  - ${exemplesStock.length} références en stock`)
  console.log('\\n📋 Détail par marque :')
  console.log(`  • Nobel Biocare: ${referencesNobelActive.length} références NobelActive`)
  console.log(`  • Straumann: ${referencesBLT.length} références BLT`)
  console.log(`  • BioHorizons: ${referencesBioHorizons.length} références Tapered Internal`)
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