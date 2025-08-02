import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function completerComposants() {
  console.log('🔧 Ajout des composants manquants (Multi-Units, Empreinte, Visserie)...')
  
  // Récupérer les systèmes et types existants
  const systemes = await prisma.systemeImplant.findMany({
    include: { marque: true }
  })
  
  const types = await prisma.typeComposant.findMany()
  const typeEmpreinte = types.find(t => t.categorie === 'EMPREINTE')
  const typeVisserie = types.find(t => t.categorie === 'VISSERIE')
  const typeMultiUnit = types.find(t => t.nom === 'Pilier multi-unit')
  const typePilierDroit = types.find(t => t.nom === 'Pilier droit')
  
  // ===========================================
  // NOBEL BIOCARE - Compléments
  // ===========================================
  const nobelSystems = systemes.filter(s => s.marque.codeMarque === 'NOBEL')
  
  for (const systeme of nobelSystems) {
    // Multi-Unit Abutments
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typeMultiUnit!.id,
        codeCommande: `MUA-${systeme.codeSysteme}-15`,
        nom: `Multi-Unit ${systeme.nom} 15°`,
        description: 'Pilier multi-unit angulé 15° pour bridges',
        materiau: 'Titane Grade 4',
        dimensions: 'H4.5mm 15°',
        diametresCompatibles: 'ALL',
        plateformesCompatibles: 'CC,NP,RP,WP',
        prixUnitaire: 290.0,
        coupleSerrage: 35.0,
        hauteurGencive: 4.5
      }
    })

    // Transfert empreinte
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typeEmpreinte!.id,
        codeCommande: `IMP-${systeme.codeSysteme}`,
        nom: `Transfert empreinte ${systeme.nom}`,
        description: 'Transfert empreinte conventionnelle',
        materiau: 'Acier inoxydable',
        dimensions: 'Standard',
        diametresCompatibles: 'ALL',
        plateformesCompatibles: 'CC,NP,RP,WP',
        prixUnitaire: 65.0,
        coupleSerrage: 10.0,
        hauteurGencive: 0.0
      }
    })

    // Vis prothétique
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typeVisserie!.id,
        codeCommande: `SCREW-${systeme.codeSysteme}`,
        nom: `Vis prothétique ${systeme.nom}`,
        description: 'Vis fixation pilier',
        materiau: 'Titane Grade 4',
        dimensions: 'M1.6',
        diametresCompatibles: 'ALL',
        plateformesCompatibles: 'CC,NP,RP,WP',
        prixUnitaire: 25.0,
        coupleSerrage: 35.0,
        hauteurGencive: 0.0
      }
    })
  }

  // ===========================================
  // STRAUMANN - Compléments  
  // ===========================================
  const straumannSystems = systemes.filter(s => s.marque.codeMarque === 'STRAUMANN')
  
  for (const systeme of straumannSystems) {
    // Piliers droits Straumann
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typePilierDroit!.id,
        codeCommande: `048.${systeme.codeSysteme}`,
        nom: `Pilier droit ${systeme.nom} RC`,
        description: 'Pilier droit Regular CrossFit',
        materiau: 'Titane Grade 4',
        dimensions: 'H4.5mm',
        diametresCompatibles: '4.1,4.8',
        plateformesCompatibles: 'RC,WN',
        prixUnitaire: 195.0,
        coupleSerrage: 35.0,
        hauteurGencive: 4.5
      }
    })

    // Multi-Unit Straumann
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typeMultiUnit!.id,
        codeCommande: `046.${systeme.codeSysteme}`,
        nom: `Multi-Unit ${systeme.nom} 15°`,
        description: 'Pilier multi-unit synOcta',
        materiau: 'Titane Grade 4',
        dimensions: 'H5.5mm 15°',
        diametresCompatibles: 'ALL',
        plateformesCompatibles: 'RC,WN',
        prixUnitaire: 315.0,
        coupleSerrage: 35.0,
        hauteurGencive: 5.5
      }
    })

    // Transfert empreinte Straumann
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typeEmpreinte!.id,
        codeCommande: `047.${systeme.codeSysteme}`,
        nom: `Transfert empreinte ${systeme.nom}`,
        description: 'Transfert empreinte fermée',
        materiau: 'Acier inoxydable',
        dimensions: 'Standard',
        diametresCompatibles: 'ALL',
        plateformesCompatibles: 'RC,WN',
        prixUnitaire: 75.0,
        coupleSerrage: 10.0,
        hauteurGencive: 0.0
      }
    })

    // Vis prothétique Straumann
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typeVisserie!.id,
        codeCommande: `022.${systeme.codeSysteme}`,
        nom: `Vis prothétique ${systeme.nom}`,
        description: 'Vis fixation synOcta',
        materiau: 'Titane Grade 4',
        dimensions: 'M2.0',
        diametresCompatibles: 'ALL',
        plateformesCompatibles: 'RC,WN',
        prixUnitaire: 28.0,
        coupleSerrage: 35.0,
        hauteurGencive: 0.0
      }
    })
  }

  // ===========================================
  // BIOTECH DENTAL - Compléments
  // ===========================================
  const biotechSystems = systemes.filter(s => s.marque.codeMarque === 'BIOTECH')
  
  for (const systeme of biotechSystems) {
    // Piliers droits Biotech
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typePilierDroit!.id,
        codeCommande: `KPA${systeme.codeSysteme.slice(-3)}`,
        nom: `Pilier droit ${systeme.nom}`,
        description: 'Pilier droit Kontact cône morse',
        materiau: 'Titane Grade 4',
        dimensions: 'H4mm',
        diametresCompatibles: '3.6,4.2,5.0',
        plateformesCompatibles: 'KONTACT',
        prixUnitaire: 165.0,
        coupleSerrage: 30.0,
        hauteurGencive: 4.0
      }
    })

    // Multi-Unit Biotech
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typeMultiUnit!.id,
        codeCommande: `KMU${systeme.codeSysteme.slice(-3)}`,
        nom: `Multi-Unit ${systeme.nom} 15°`,
        description: 'Pilier multi-unit Kontact',
        materiau: 'Titane Grade 4',
        dimensions: 'H4.5mm 15°',
        diametresCompatibles: 'ALL',
        plateformesCompatibles: 'KONTACT',
        prixUnitaire: 275.0,
        coupleSerrage: 30.0,
        hauteurGencive: 4.5
      }
    })

    // Transfert empreinte Biotech
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typeEmpreinte!.id,
        codeCommande: `KTE${systeme.codeSysteme.slice(-3)}`,
        nom: `Transfert empreinte ${systeme.nom}`,
        description: 'Transfert empreinte Kontact',
        materiau: 'Acier inoxydable',
        dimensions: 'Standard',
        diametresCompatibles: 'ALL',
        plateformesCompatibles: 'KONTACT',
        prixUnitaire: 55.0,
        coupleSerrage: 8.0,
        hauteurGencive: 0.0
      }
    })

    // Vis prothétique Biotech
    await prisma.composantProsthetique.create({
      data: {
        systemeId: systeme.id,
        typeComposantId: typeVisserie!.id,
        codeCommande: `KVP${systeme.codeSysteme.slice(-3)}`,
        nom: `Vis prothétique ${systeme.nom}`,
        description: 'Vis fixation Kontact',
        materiau: 'Titane Grade 4',
        dimensions: 'M1.8',
        diametresCompatibles: 'ALL',
        plateformesCompatibles: 'KONTACT',
        prixUnitaire: 22.0,
        coupleSerrage: 30.0,
        hauteurGencive: 0.0
      }
    })
  }

  console.log('✅ Composants complémentaires ajoutés avec succès!')
  
  // Vérification finale
  const total = await prisma.composantProsthetique.count()
  console.log(`📊 Total composants: ${total}`)
  
  await prisma.$disconnect()
}

completerComposants().catch(console.error)