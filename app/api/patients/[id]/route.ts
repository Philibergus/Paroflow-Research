import { NextRequest } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { 
  successResponse, 
  errorResponse, 
  validateRequestBody, 
  handleApiError 
} from '@/app/lib/api-utils'
import { updatePatientSchema } from '@/app/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/patients/[id] - Get patient by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        traitements: {
          include: {
            etapes: true,
            _count: {
              select: { etapes: true },
            },
          },
        },
        _count: {
          select: { traitements: true },
        },
      },
    })

    if (!patient) {
      return errorResponse('Patient non trouvé', 404)
    }

    return successResponse(patient)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/patients/[id] - Update patient
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const validation = await validateRequestBody(request, updatePatientSchema)
    
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    })

    if (!existingPatient) {
      return errorResponse('Patient non trouvé', 404)
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: validation.data,
      include: {
        _count: {
          select: { traitements: true },
        },
      },
    })

    return successResponse(patient, 'Patient mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/patients/[id] - Delete patient
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    })

    if (!existingPatient) {
      return errorResponse('Patient non trouvé', 404)
    }

    await prisma.patient.delete({
      where: { id },
    })

    return successResponse(null, 'Patient supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}