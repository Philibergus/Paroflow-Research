import { NextRequest } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { 
  successResponse, 
  errorResponse, 
  validateRequestBody, 
  handleApiError 
} from '@/app/lib/api-utils'
import { updateTraitementSchema } from '@/app/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/traitements/[id] - Get traitement by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const traitement = await prisma.traitement.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
            dateNaissance: true,
          },
        },
        etapes: {
          orderBy: { date: 'asc' },
        },
        _count: {
          select: { etapes: true },
        },
      },
    })

    if (!traitement) {
      return errorResponse('Traitement non trouvé', 404)
    }

    return successResponse(traitement)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/traitements/[id] - Update traitement
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const validation = await validateRequestBody(request, updateTraitementSchema)
    
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    const existingTraitement = await prisma.traitement.findUnique({
      where: { id },
    })

    if (!existingTraitement) {
      return errorResponse('Traitement non trouvé', 404)
    }

    const traitement = await prisma.traitement.update({
      where: { id },
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

    return successResponse(traitement, 'Traitement mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/traitements/[id] - Delete traitement
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const existingTraitement = await prisma.traitement.findUnique({
      where: { id },
    })

    if (!existingTraitement) {
      return errorResponse('Traitement non trouvé', 404)
    }

    await prisma.traitement.delete({
      where: { id },
    })

    return successResponse(null, 'Traitement supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}