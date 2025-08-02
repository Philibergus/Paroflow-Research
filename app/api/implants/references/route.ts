import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const systemeId = searchParams.get('systemeId')

    if (!systemeId) {
      return NextResponse.json(
        { error: 'systemeId est requis' },
        { status: 400 }
      )
    }

    const references = await prisma.referenceImplant.findMany({
      where: {
        systemeId: systemeId,
        isActive: true
      },
      include: {
        stock: {
          select: {
            quantiteStock: true,
            seuilAlerte: true,
            emplacement: true
          }
        },
        systeme: {
          select: {
            nom: true,
            marque: {
              select: {
                nom: true
              }
            }
          }
        }
      },
      orderBy: [
        { diametre: 'asc' },
        { longueur: 'asc' }
      ]
    })

    return NextResponse.json(references)
  } catch (error) {
    console.error('Erreur lors de la récupération des références d\'implants:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des références d\'implants' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}