import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email/email-service'

// POST /api/email/send - Envoyer un email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      to,
      subject,
      html,
      text,
      templateId,
      variables,
      patientId,
      type,
      trigger,
      configId
    } = body

    // Validation basique
    if (!to || !subject) {
      return NextResponse.json(
        { error: 'Destinataire et objet sont requis' },
        { status: 400 }
      )
    }

    if (!html && !text && !templateId) {
      return NextResponse.json(
        { error: 'Contenu HTML, texte ou template requis' },
        { status: 400 }
      )
    }

    const success = await emailService.sendEmail({
      to,
      subject,
      html,
      text,
      templateId,
      variables,
      patientId,
      type,
      trigger
    }, configId)

    if (success) {
      return NextResponse.json({ success: true, message: 'Email envoyé avec succès' })
    } else {
      return NextResponse.json(
        { success: false, error: 'Échec de l\'envoi de l\'email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erreur envoi email:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}