import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { 
  updateFileAttenteSchema,
  type ApiResponse 
} from '@/app/types'
import { z } from 'zod'

// GET /api/file-attente/[id] - Get a specific queue item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileAttente = await prisma.fileAttente.findUnique({
      where: { id: params.id },
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

    if (!fileAttente) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Élément de file d\'attente non trouvé'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<typeof fileAttente> = {
      success: true,
      data: fileAttente
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching queue item:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur interne du serveur'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

// PUT /api/file-attente/[id] - Update a queue item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateFileAttenteSchema.parse(body)

    // Check if queue item exists
    const existing = await prisma.fileAttente.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Élément de file d\'attente non trouvé'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Handle status changes with automatic timestamps
    const updateData: Record<string, unknown> = { ...validatedData }
    
    if (validatedData.statut) {
      if (validatedData.statut === 'in_progress' && existing.statut === 'waiting') {
        updateData.dateDebut = new Date()
      } else if (validatedData.statut === 'completed' && existing.statut === 'in_progress') {
        updateData.dateFin = new Date()
      } else if (validatedData.statut === 'waiting' && existing.statut === 'in_progress') {
        updateData.dateDebut = null
      }
    }

    // Update the queue item
    const fileAttente = await prisma.fileAttente.update({
      where: { id: params.id },
      data: updateData,
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
      message: 'File d\'attente mise à jour avec succès'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating queue item:', error)

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

// DELETE /api/file-attente/[id] - Remove a queue item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if queue item exists
    const existing = await prisma.fileAttente.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Élément de file d\'attente non trouvé'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Delete the queue item
    await prisma.fileAttente.delete({
      where: { id: params.id }
    })

    const response: ApiResponse<null> = {
      success: true,
      message: 'Élément retiré de la file d\'attente'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting queue item:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur interne du serveur'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}