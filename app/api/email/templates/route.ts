import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email/email-service'

// GET /api/email/templates - Obtenir les templates d'email
export async function GET() {
  try {
    const templates = await emailService.getEmailTemplates()
    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Erreur récupération templates email:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des templates email' },
      { status: 500 }
    )
  }
}

// POST /api/email/templates/init - Créer les templates par défaut
export async function POST() {
  try {
    await emailService.createDefaultTemplates()
    const templates = await emailService.getEmailTemplates()
    return NextResponse.json({ 
      success: true, 
      message: 'Templates par défaut créés',
      templates 
    })
  } catch (error) {
    console.error('Erreur création templates par défaut:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création des templates par défaut' },
      { status: 500 }
    )
  }
}