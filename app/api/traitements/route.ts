import { NextRequest } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { 
  successResponse, 
  errorResponse, 
  paginatedResponse, 
  validateRequestBody, 
  getSearchParams,
  handleApiError 
} from '@/app/lib/api-utils'
import { createTraitementSchema } from '@/app/types'

// GET /api/traitements - List traitements with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { page, limit, search, sortBy, sortOrder } = getSearchParams(request)
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    
    const where = {
      ...(patientId && { patientId }),
      ...(search && {
        OR: [
          { type: { contains: search, mode: 'insensitive' as const } },
          { dents: { contains: search, mode: 'insensitive' as const } },
          { statut: { contains: search, mode: 'insensitive' as const } },
          { patient: { 
            OR: [
              { nom: { contains: search, mode: 'insensitive' as const } },
              { prenom: { contains: search, mode: 'insensitive' as const } },
            ]
          }},
        ],
      }),
    }

    const orderBy = { [sortBy]: sortOrder }

    const [traitements, total] = await Promise.all([
      prisma.traitement.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          patient: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              telephone: true,
            },
          },
          _count: {
            select: { etapes: true },
          },
        },
      }),
      prisma.traitement.count({ where }),
    ])

    return paginatedResponse(traitements, page, limit, total)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/traitements - Create new traitement
export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequestBody(request, createTraitementSchema)
    
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: validation.data.patientId },
    })

    if (!patient) {
      return errorResponse('Patient non trouvé', 404)
    }

    const traitement = await prisma.traitement.create({
      data: validation.data,
      include: {
        patient: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
        _count: {
          select: { etapes: true },
        },
      },
    })

    return successResponse(traitement, 'Traitement créé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}