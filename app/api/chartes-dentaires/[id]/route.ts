import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { 
  updateCharteDentaireSchema,
  type ApiResponse 
} from '@/app/types'
import { z } from 'zod'

// GET /api/chartes-dentaires/[id] - Get a specific dental chart entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const charte = await prisma.charteDentaire.findUnique({
      where: { id: params.id },
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

    if (!charte) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Charte dentaire non trouvée'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<typeof charte> = {
      success: true,
      data: charte
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching dental chart:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur interne du serveur'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

// PUT /api/chartes-dentaires/[id] - Update a dental chart entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateCharteDentaireSchema.parse(body)

    // Check if dental chart exists
    const existing = await prisma.charteDentaire.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Charte dentaire non trouvée'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Update the dental chart entry
    const charte = await prisma.charteDentaire.update({
      where: { id: params.id },
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
      message: 'Charte dentaire mise à jour avec succès'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating dental chart:', error)

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

// DELETE /api/chartes-dentaires/[id] - Delete a dental chart entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if dental chart exists
    const existing = await prisma.charteDentaire.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Charte dentaire non trouvée'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Delete the dental chart entry
    await prisma.charteDentaire.delete({
      where: { id: params.id }
    })

    const response: ApiResponse<null> = {
      success: true,
      message: 'Charte dentaire supprimée avec succès'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting dental chart:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur interne du serveur'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}