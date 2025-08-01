import { NextRequest } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { 
  successResponse, 
  errorResponse, 
  validateRequestBody, 
  handleApiError 
} from '@/app/lib/api-utils'
import { updateCorrespondantSchema } from '@/app/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/correspondants/[id] - Get correspondant by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const correspondant = await prisma.correspondant.findUnique({
      where: { id },
    })

    if (!correspondant) {
      return errorResponse('Correspondant non trouvé', 404)
    }

    return successResponse(correspondant)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/correspondants/[id] - Update correspondant
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const validation = await validateRequestBody(request, updateCorrespondantSchema)
    
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    const existingCorrespondant = await prisma.correspondant.findUnique({
      where: { id },
    })

    if (!existingCorrespondant) {
      return errorResponse('Correspondant non trouvé', 404)
    }

    const correspondant = await prisma.correspondant.update({
      where: { id },
      data: validation.data,
    })

    return successResponse(correspondant, 'Correspondant mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/correspondants/[id] - Delete correspondant
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const existingCorrespondant = await prisma.correspondant.findUnique({
      where: { id },
    })

    if (!existingCorrespondant) {
      return errorResponse('Correspondant non trouvé', 404)
    }

    await prisma.correspondant.delete({
      where: { id },
    })

    return successResponse(null, 'Correspondant supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}