import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { 
  createFileAttenteSchema, 
  paginationSchema,
  type PaginatedResponse,
  type ApiResponse 
} from '@/app/types'
import { z } from 'zod'

// GET /api/file-attente - Get queue items with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams)
    
    const {
      page,
      limit,
      search,
      sortBy = 'priorite',
      sortOrder = 'desc'
    } = paginationSchema.parse(queryParams)

    const type = searchParams.get('type')
    const statut = searchParams.get('statut')
    const priorite = searchParams.get('priorite')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (type) where.type = type
    if (statut) where.statut = statut
    if (priorite) where.priorite = parseInt(priorite)
    
    if (search) {
      where.patient = {
        OR: [
          { nom: { contains: search, mode: 'insensitive' } },
          { prenom: { contains: search, mode: 'insensitive' } }
        ]
      }
    }

    // Get total count
    const total = await prisma.fileAttente.count({ where })

    // Build order by
    const orderBy: any = {}
    if (sortBy === 'priorite') {
      orderBy.priorite = sortOrder
    } else if (sortBy === 'dateAjout') {
      orderBy.dateAjout = sortOrder
    } else {
      orderBy.dateAjout = 'desc'
    }

    // Get queue items
    const fileAttente = await prisma.fileAttente.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
            dateNaissance: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: [orderBy, { dateAjout: 'asc' }] // Secondary sort by date added
    })

    const response: PaginatedResponse<typeof fileAttente[0]> = {
      success: true,
      data: fileAttente,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching queue:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur interne du serveur'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

// POST /api/file-attente - Add a patient to the queue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createFileAttenteSchema.parse(body)

    // Check if patient is already in queue for the same type
    const existing = await prisma.fileAttente.findFirst({
      where: {
        patientId: validatedData.patientId,
        type: validatedData.type,
        statut: {
          in: ['waiting', 'in_progress']
        }
      }
    })

    if (existing) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Patient déjà en file d\'attente pour ce type de traitement'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Create the queue entry
    const fileAttente = await prisma.fileAttente.create({
      data: validatedData,
      include: {
        patient: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
            dateNaissance: true
          }
        }
      }
    })

    const response: ApiResponse<typeof fileAttente> = {
      success: true,
      data: fileAttente,
      message: 'Patient ajouté à la file d\'attente'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error adding to queue:', error)

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