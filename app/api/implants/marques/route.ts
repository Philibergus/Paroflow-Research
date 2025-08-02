import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const marques = await prisma.marqueImplant.findMany({
      where: {
        isActive: true
      },
      include: {
        systemes: {
          where: {
            isActive: true
          },
          orderBy: {
            nom: 'asc'
          }
        }
      },
      orderBy: {
        nom: 'asc'
      }
    })

    return NextResponse.json(marques)
  } catch (error) {
    console.error('Erreur lors de la récupération des marques d\'implants:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des marques d\'implants' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}