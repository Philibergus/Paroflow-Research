import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkComponents() {
  console.log('🔍 Vérification des composants prothétiques existants...\n')
  
  // Compter les composants par marque et type
  const composants = await prisma.composantProsthetique.findMany({
    include: {
      systeme: {
        include: {
          marque: true
        }
      },
      typeComposant: true
    }
  })

  const stats = {}
  
  composants.forEach(comp => {
    const marque = comp.systeme.marque.nom
    const type = comp.typeComposant.categorie
    
    if (!stats[marque]) stats[marque] = {}
    if (!stats[marque][type]) stats[marque][type] = 0
    stats[marque][type]++
  })

  console.log('📊 Répartition actuelle par marque et catégorie:\n')
  Object.keys(stats).forEach(marque => {
    console.log(`🏭 ${marque}:`)
    Object.keys(stats[marque]).forEach(type => {
      console.log(`   ${type}: ${stats[marque][type]} composants`)
    })
    console.log('')
  })

  // Vérifier les types manquants critiques
  console.log('🔍 Vérification composants critiques...\n')
  
  const marquesMain = ['Nobel Biocare', 'Straumann', 'Biotech Dental']
  const typesEssentiels = ['PILIER', 'EMPREINTE', 'VISSERIE']
  
  for (const marque of marquesMain) {
    console.log(`🔧 ${marque}:`)
    for (const type of typesEssentiels) {
      const count = stats[marque]?.[type] || 0
      if (count === 0) {
        console.log(`   ❌ MANQUE: ${type}`)
      } else {
        console.log(`   ✅ ${type}: ${count} composants`)
      }
    }
    console.log('')
  }

  console.log(`📈 Total: ${composants.length} composants prothétiques`)
  
  await prisma.$disconnect()
}

checkComponents().catch(console.error)