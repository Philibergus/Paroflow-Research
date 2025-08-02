import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🦷 Initialisation des composants prothétiques implantaires...')
  
  // Nettoyer les tables composants dans le bon ordre
  console.log('🧹 Nettoyage des tables composants...')
  await prisma.composantUtilise.deleteMany()
  await prisma.mouvementStockComposant.deleteMany()
  await prisma.stockComposant.deleteMany()
  await prisma.composantProsthetique.deleteMany()
  await prisma.typeComposant.deleteMany()

  console.log('✅ Tables composants nettoyées')

  // ===========================================
  // 1. CRÉATION DES TYPES DE COMPOSANTS
  // ===========================================
  console.log('📋 Création des types de composants...')

  const typesComposants = await Promise.all([
    // Composants de cicatrisation
    prisma.typeComposant.create({
      data: {
        nom: 'Vis de cicatrisation',
        categorie: 'CICATRISATION',
        description: 'Vis temporaires pour façonnage gingival pendant cicatrisation'
      }
    }),
    prisma.typeComposant.create({
      data: {
        nom: 'Vis de couverture',
        categorie: 'CICATRISATION', 
        description: 'Vis de protection implant pendant cicatrisation fermée'
      }
    }),
    
    // Piliers prothétiques
    prisma.typeComposant.create({
      data: {
        nom: 'Pilier droit',
        categorie: 'PILIER',
        description: 'Piliers droits standards pour prothèse unitaire'
      }
    }),
    prisma.typeComposant.create({
      data: {
        nom: 'Pilier angulé',
        categorie: 'PILIER',
        description: 'Piliers avec angulation pour compensation axe implant'
      }
    }),
    prisma.typeComposant.create({
      data: {
        nom: 'Pilier multi-unit',
        categorie: 'PILIER',
        description: 'Piliers pour prothèses multiples et barres'
      }
    }),
    prisma.typeComposant.create({
      data: {
        nom: 'Pilier temporaire',
        categorie: 'PILIER',
        description: 'Piliers provisoires pour prothèses temporaires'
      }
    }),
    
    // Composants d\'empreinte
    prisma.typeComposant.create({
      data: {
        nom: 'Transfert empreinte',
        categorie: 'EMPREINTE',
        description: 'Transferts pour empreintes conventionnelles'
      }
    }),
    prisma.typeComposant.create({
      data: {
        nom: 'Scan body',
        categorie: 'EMPREINTE',
        description: 'Éléments pour empreintes numériques'
      }
    }),
    prisma.typeComposant.create({
      data: {
        nom: 'Analogue laboratoire',
        categorie: 'EMPREINTE',
        description: 'Répliques d\'implant pour modèles de travail'
      }
    }),
    
    // Visserie et accessoires
    prisma.typeComposant.create({
      data: {
        nom: 'Vis prothétique',
        categorie: 'VISSERIE',
        description: 'Vis de fixation piliers et prothèses'
      }
    }),
    prisma.typeComposant.create({
      data: {
        nom: 'Tournevis',
        categorie: 'ACCESSOIRE',
        description: 'Outils de manipulation et serrage'
      }
    }),
    prisma.typeComposant.create({
      data: {
        nom: 'Accessoire divers',
        categorie: 'ACCESSOIRE',
        description: 'Autres composants spécialisés'
      }
    })
  ])

  console.log(`✅ ${typesComposants.length} types de composants créés`)

  // Récupérer les systèmes existants pour les liaisons
  const systemes = await prisma.systemeImplant.findMany({
    include: { marque: true }
  })

  // ===========================================
  // 2. COMPOSANTS NOBEL BIOCARE
  // ===========================================
  console.log('🔧 Création des composants Nobel Biocare...')

  const nobelSystems = systemes.filter(s => s.marque.codeMarque === 'NOBEL')
  
  for (const systeme of nobelSystems) {
    // Vis de cicatrisation Nobel
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typesComposants[0].id, // Vis de cicatrisation
        codeCommande: `${systeme.codeSysteme}-HC-NP-3`,
        nom: `Vis cicatrisation ${systeme.nom} NP H3mm`,
        description: 'Vis de cicatrisation plateforme étroite 3mm hauteur',
        materiau: 'Titane Grade 4',
        dimensions: 'H3mm Ø3.8mm',
        diametresCompatibles: '3.5',
        plateformesCompatibles: 'NP',
        prixUnitaire: 45.0,
        coupleSerrage: 15.0,
        hauteurGencive: 3.0
      }
    })

    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typesComposants[0].id, // Vis de cicatrisation
        codeCommande: `${systeme.codeSysteme}-HC-RP-4`,
        nom: `Vis cicatrisation ${systeme.nom} RP H4mm`,
        description: 'Vis de cicatrisation plateforme régulière 4mm hauteur',
        materiau: 'Titane Grade 4',
        dimensions: 'H4mm Ø4.8mm',
        diametresCompatibles: '4.3',
        plateformesCompatibles: 'RP',
        prixUnitaire: 45.0,
        coupleSerrage: 15.0,
        hauteurGencive: 4.0
      }
    })

    // Vis de couverture
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typesComposants[1].id, // Vis de couverture
        codeCommande: `${systeme.codeSysteme}-CS-STD`,
        nom: `Vis couverture ${systeme.nom}`,
        description: 'Vis de couverture standard pour cicatrisation fermée',
        materiau: 'Titane Grade 4',
        dimensions: 'Standard',
        diametresCompatibles: 'ALL',
        plateformesCompatibles: 'ALL',
        prixUnitaire: 25.0,
        coupleSerrage: 10.0
      }
    })

    // Pilier droit
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typesComposants[2].id, // Pilier droit
        codeCommande: `${systeme.codeSysteme}-SA-RP-4`,
        nom: `Pilier droit ${systeme.nom} RP`,
        description: 'Pilier droit plateforme régulière',
        materiau: 'Titane Grade 4',
        dimensions: 'H4mm Ø4.5mm',
        diametresCompatibles: '4.3',
        plateformesCompatibles: 'RP',
        prixUnitaire: 180.0,
        coupleSerrage: 35.0,
        hauteurGencive: 4.0
      }
    })
  }

  // ===========================================
  // 3. COMPOSANTS STRAUMANN
  // ===========================================
  console.log('🔧 Création des composants Straumann...')

  const straumannSystems = systemes.filter(s => s.marque.codeMarque === 'STRAUMANN')
  
  for (const systeme of straumannSystems) {
    if (systeme.codeSysteme === 'BLT') {
      // Vis de cicatrisation BLT avec codes réels
      await prisma.composantProsthetique.create({
        data: {
          systemeId: systeme.id,
          typeComposantId: typesComposants[0].id,
          codeCommande: '024.4236S',
          nom: 'Vis cicatrisation BLT RC H3mm',
          description: 'Healing abutment RC conical shape',
          materiau: 'Titane Grade 4',
          dimensions: 'H3mm Ø4.5mm',
          diametresCompatibles: '4.1',
          plateformesCompatibles: 'RC',
          prixUnitaire: 52.0,
          coupleSerrage: 15.0,
          hauteurGencive: 3.0
        }
      })

      // Vis de couverture BLT
      await prisma.composantProsthetique.create({
        data: {
          systemeId: systeme.id,
          typeComposantId: typesComposants[1].id,
          codeCommande: '024.4100',
          nom: 'Vis couverture BLT RC',
          description: 'RC Closure Screw H0mm',
          materiau: 'Titane',
          dimensions: 'H0mm',
          diametresCompatibles: 'ALL',
          plateformesCompatibles: 'RC',
          prixUnitaire: 28.0,
          coupleSerrage: 10.0
        }
      })
    }

    if (systeme.codeSysteme === 'BLX') {
      // Vis de cicatrisation BLX
      await prisma.composantProsthetique.create({
        data: {
          systemeId: systeme.id,
          typeComposantId: typesComposants[0].id,
          codeCommande: '064.4100S',
          nom: 'Vis cicatrisation BLX RB H2.5mm',
          description: 'BLX Healing abutment Regular Base',
          materiau: 'Titane Grade 4',
          dimensions: 'H2.5mm Ø4.5mm',
          diametresCompatibles: '4.0,4.5',
          plateformesCompatibles: 'RB',
          prixUnitaire: 55.0,
          coupleSerrage: 15.0,
          hauteurGencive: 2.5
        }
      })

      // Vis de couverture BLX
      await prisma.composantProsthetique.create({
        data: {
          systemeId: systeme.id,
          typeComposantId: typesComposants[1].id,
          codeCommande: '064.4000S',
          nom: 'Vis couverture BLX RB',
          description: 'BLX Closure Cap Regular Base',
          materiau: 'Titane',
          dimensions: 'Standard',
          diametresCompatibles: 'ALL',
          plateformesCompatibles: 'RB',
          prixUnitaire: 30.0,
          coupleSerrage: 10.0
        }
      })
    }
  }

  // ===========================================
  // 4. COMPOSANTS BIOTECH KONTACT
  // ===========================================
  console.log('🔧 Création des composants Biotech Kontact...')

  const biotechSystems = systemes.filter(s => s.marque.codeMarque === 'BIOHORIZONS')
  
  // Ajouter système Biotech Kontact s'il n'existe pas
  let kontactSystem = systemes.find(s => s.marque.codeMarque === 'BIOHORIZONS' && s.codeSysteme === 'KONTACT')
  
  if (!kontactSystem) {
    // Trouver la marque Biotech (actuellement BioHorizons dans notre seed)
    const biotechMarque = await prisma.marqueImplant.findFirst({
      where: { codeMarque: 'BIOHORIZONS' }
    })
    
    if (biotechMarque) {
      // Mettre à jour la marque pour Biotech Dental
      await prisma.marqueImplant.update({
        where: { id: biotechMarque.id },
        data: {
          nom: 'Biotech Dental',
          codeMarque: 'BIOTECH',
          pays: 'France',
          siteWeb: 'https://www.biotechdental.com',
          notes: 'Fabricant français. Système Kontact avec connexion cône morse 5°.'
        }
      })

      // Créer le système Kontact
      kontactSystem = await prisma.systemeImplant.create({
        data: {
          marqueId: biotechMarque.id,
          nom: 'Kontact S',
          codeSysteme: 'KONTACT',
          description: 'Système conique avec connexion cône morse 5°',
          typeConnexion: 'Cône morse 5° + indexation étoile',
          surface: 'Anodisation',
          materiau: 'TA6V ELI',
          indicationsPrincipales: 'Tous protocoles, connexion universelle'
        }
      })
    }
  }

  if (kontactSystem) {
    // Vis de cicatrisation Kontact avec codes réels
    const diametres = ['3.0', '3.6', '4.2', '4.8', '5.4']
    const hauteurs = ['2', '3', '4', '5']

    for (const diametre of diametres) {
      for (const hauteur of hauteurs) {
        await prisma.composantProsthetique.create({
          data: {
            systemeId: kontactSystem.id,
            typeComposantId: typesComposants[0].id,
            codeCommande: `KHS${diametre.replace('.', '')}${hauteur}`,
            nom: `Vis cicatrisation Kontact Ø${diametre} H${hauteur}mm`,
            description: `Healing screw Kontact diamètre ${diametre}mm hauteur ${hauteur}mm`,
            materiau: 'TA6V ELI',
            dimensions: `H${hauteur}mm Ø${diametre}mm`,
            diametresCompatibles: diametre,
            plateformesCompatibles: 'KONTACT',
            prixUnitaire: 38.0,
            coupleSerrage: 10.0,
            hauteurGencive: parseFloat(hauteur)
          }
        })
      }
    }

    // Vis de couverture Kontact
    await prisma.composantProsthetique.create({
      data: {
        systemeId: kontactSystem.id,
        typeComposantId: typesComposants[1].id,
        codeCommande: 'KCS-STD',
        nom: 'Vis couverture Kontact universelle',
        description: 'Closure screw Kontact tous diamètres',
        materiau: 'TA6V ELI',
        dimensions: 'Standard',
        diametresCompatibles: 'ALL',
        plateformesCompatibles: 'KONTACT',
        prixUnitaire: 22.0,
        coupleSerrage: 10.0
      }
    })

    // Piliers droits Kontact
    for (const diametre of diametres) {
      await prisma.composantProsthetique.create({
        data: {
          systemeId: kontactSystem.id,
          typeComposantId: typesComposants[2].id,
          codeCommande: `KSA${diametre.replace('.', '')}4`,
          nom: `Pilier droit Kontact Ø${diametre} H4mm`,
          description: `Straight abutment Kontact ${diametre}mm`,
          materiau: 'TA6V ELI',
          dimensions: `H4mm Ø${diametre}mm`,
          diametresCompatibles: diametre,
          plateformesCompatibles: 'KONTACT',
          prixUnitaire: 165.0,
          coupleSerrage: 35.0,
          hauteurGencive: 4.0
        }
      })
    }

    // Pilier angulé 15° Zircone (référence réelle KPAZ501)
    await prisma.composantProsthetique.create({
      data: {
        systemeId: kontactSystem.id,
        typeComposantId: typesComposants[3].id,
        codeCommande: 'KPAZ501',
        nom: 'Pilier angulé Kontact 15° Zircone',
        description: 'Cera-Post 15° angulated Zirconium abutment',
        materiau: 'Zircone',
        dimensions: '15° H5mm',
        diametresCompatibles: 'ALL',
        plateformesCompatibles: 'KONTACT',
        prixUnitaire: 280.0,
        coupleSerrage: 35.0,
        angulation: 15.0,
        hauteurGencive: 5.0
      }
    })
  }

  // ===========================================
  // 5. CRÉATION D'EXEMPLES DE STOCK
  // ===========================================
  console.log('📦 Création d\'exemples de stock composants...')

  const composants = await prisma.composantProsthetique.findMany()
  
  // Stock pour quelques composants essentiels
  const composantsEnStock = composants.slice(0, 15) // Premiers 15 composants

  for (const composant of composantsEnStock) {
    const quantite = Math.floor(Math.random() * 10) + 1 // 1-10 unités
    await prisma.stockComposant.create({
      data: {
        composantId: composant.id,
        quantiteStock: quantite,
        seuilAlerte: 2,
        quantiteCommande: 5,
        emplacement: 'Armoire Prothèse A-1',
        dateInventaire: new Date()
      }
    })
  }

  console.log('✅ Stock composants créé')

  // ===========================================
  // RÉSUMÉ FINAL
  // ===========================================
  const totalComposants = await prisma.composantProsthetique.count()
  const totalStock = await prisma.stockComposant.count()

  console.log('\\n🎉 Composants prothétiques initialisés avec succès !')
  console.log('📊 Résumé des composants :')
  console.log(`  - ${typesComposants.length} types de composants`)
  console.log(`  - ${totalComposants} composants avec codes de commande`)
  console.log(`  - ${totalStock} références en stock`)
  console.log('\\n📋 Catégories disponibles :')
  console.log(`  • Cicatrisation: Vis cicatrisation, vis couverture`)
  console.log(`  • Piliers: Droits, angulés, multi-unit, temporaires`)
  console.log(`  • Empreinte: Transferts, scan bodies, analogues`)
  console.log(`  • Visserie: Vis prothétiques, tournevis`)
  console.log('\\n✅ Prêt pour workflow chirurgie complet !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de l\'initialisation des composants:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })