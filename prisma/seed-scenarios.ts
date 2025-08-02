import { PrismaClient } from '@prisma/client'
import { CLINICAL_SCENARIOS } from '../src/lib/clinical-scenarios'

const prisma = new PrismaClient()

async function seedScenarios() {
  console.log('Seeding clinical scenarios...')

  for (const scenario of Object.values(CLINICAL_SCENARIOS)) {
    try {
      await prisma.scenarioType.upsert({
        where: { nom: scenario.nom },
        update: {
          titre: scenario.titre,
          description: scenario.description,
          etapesTemplate: scenario.steps,
          dureeEstimee: scenario.dureeEstimeeTotal,
          isActive: true,
        },
        create: {
          nom: scenario.nom,
          titre: scenario.titre,
          description: scenario.description,
          etapesTemplate: scenario.steps,
          dureeEstimee: scenario.dureeEstimeeTotal,
          isActive: true,
        },
      })
      console.log(`✓ Seeded scenario: ${scenario.titre}`)
    } catch (error) {
      console.error(`✗ Error seeding scenario ${scenario.nom}:`, error)
    }
  }

  console.log('Clinical scenarios seeding completed!')
}

seedScenarios()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })