import { NextRequest } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { 
  successResponse, 
  errorResponse, 
  validateRequestBody, 
  handleApiError 
} from '@/app/lib/api-utils'
import { createEtapeTraitementSchema } from '@/app/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/traitements/[id]/etapes - Get all etapes for a traitement
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    // Verify traitement exists
    const traitement = await prisma.traitement.findUnique({
      where: { id },
    })

    if (!traitement) {
      return errorResponse('Traitement non trouvé', 404)
    }

    const etapes = await prisma.etapeTraitement.findMany({
      where: { traitementId: id },
      orderBy: { date: 'asc' },
    })

    return successResponse(etapes)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/traitements/[id]/etapes - Create new etape for traitement
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const validation = await validateRequestBody(request, createEtapeTraitementSchema)
    
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    // Verify traitement exists and matches the route param
    const traitement = await prisma.traitement.findUnique({
      where: { id },
    })

    if (!traitement) {
      return errorResponse('Traitement non trouvé', 404)
    }

    if (validation.data.traitementId !== id) {
      return errorResponse('ID traitement ne correspond pas à la route', 400)
    }

    const etape = await prisma.etapeTraitement.create({
      data: validation.data,
    })

    return successResponse(etape, 'Étape créée avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}