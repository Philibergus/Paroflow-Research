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
import { createPatientSchema } from '@/app/types'

// GET /api/patients - List patients with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { page, limit, search, sortBy, sortOrder } = getSearchParams(request)
    
    const where = search
      ? {
          OR: [
            { nom: { contains: search, mode: 'insensitive' as const } },
            { prenom: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { telephone: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const orderBy = { [sortBy]: sortOrder }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { traitements: true },
          },
        },
      }),
      prisma.patient.count({ where }),
    ])

    return paginatedResponse(patients, page, limit, total)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/patients - Create new patient
export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequestBody(request, createPatientSchema)
    
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    const patient = await prisma.patient.create({
      data: validation.data,
      include: {
        _count: {
          select: { traitements: true },
        },
      },
    })

    return successResponse(patient, 'Patient créé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}