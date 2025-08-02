import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { 
  createCharteDentaireSchema, 
  paginationSchema,
  type PaginatedResponse,
  type ApiResponse 
} from '@/app/types'
import { z } from 'zod'

// GET /api/chartes-dentaires - Get dental charts with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams)
    
    const {
      page,
      limit,
      patientId,
      traitementId
    } = {
      ...paginationSchema.parse(queryParams),
      patientId: searchParams.get('patientId') || undefined,
      traitementId: searchParams.get('traitementId') || undefined,
    }

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (patientId) where.patientId = patientId
    if (traitementId) where.traitementId = traitementId

    // Get total count
    const total = await prisma.charteDentaire.count({ where })

    // Get dental charts
    const chartes = await prisma.charteDentaire.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            nom: true,
            prenom: true
          }
        },
        traitement: {
          select: {
            id: true,
            type: true,
            statut: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        numeroDent: 'asc'
      }
    })

    const response: PaginatedResponse<typeof chartes[0]> = {
      success: true,
      data: chartes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching dental charts:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur interne du serveur'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

// POST /api/chartes-dentaires - Create a new dental chart entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createCharteDentaireSchema.parse(body)

    // Check if dental chart entry already exists for this patient and tooth
    const existing = await prisma.charteDentaire.findUnique({
      where: {
        patientId_numeroDent: {
          patientId: validatedData.patientId,
          numeroDent: validatedData.numeroDent
        }
      }
    })

    if (existing) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Une entrée existe déjà pour cette dent'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Create the dental chart entry
    const charte = await prisma.charteDentaire.create({
      data: validatedData,
      include: {
        patient: {
          select: {
            id: true,
            nom: true,
            prenom: true
          }
        },
        traitement: {
          select: {
            id: true,
            type: true,
            statut: true
          }
        }
      }
    })

    const response: ApiResponse<typeof charte> = {
      success: true,
      data: charte,
      message: 'Charte dentaire créée avec succès'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating dental chart:', error)

    if (error instanceof z.ZodError) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Données invalides',
        message: error.errors.map(e => e.message).join(', ')
      }
      return NextResponse.json(response, { status: 400 })
    }

    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur interne du serveur'
    }

    return NextResponse.json(response, { status: 500 })
  }
}