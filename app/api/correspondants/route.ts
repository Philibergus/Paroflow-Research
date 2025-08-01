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
import { createCorrespondantSchema } from '@/app/types'

// GET /api/correspondants - List correspondants with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { page, limit, search, sortBy, sortOrder } = getSearchParams(request)
    
    const where = search
      ? {
          OR: [
            { nom: { contains: search, mode: 'insensitive' as const } },
            { specialite: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { telephone: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const orderBy = { [sortBy]: sortOrder }

    const [correspondants, total] = await Promise.all([
      prisma.correspondant.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.correspondant.count({ where }),
    ])

    return paginatedResponse(correspondants, page, limit, total)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/correspondants - Create new correspondant
export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequestBody(request, createCorrespondantSchema)
    
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    const correspondant = await prisma.correspondant.create({
      data: validation.data,
    })

    return successResponse(correspondant, 'Correspondant créé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}