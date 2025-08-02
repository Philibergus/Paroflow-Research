import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email/email-service'

// GET /api/email/config - Obtenir les configurations email
export async function GET() {
  try {
    const configurations = await emailService.getEmailConfigurations()
    return NextResponse.json({ configurations })
  } catch (error) {
    console.error('Erreur récupération configurations email:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des configurations email' },
      { status: 500 }
    )
  }
}

// POST /api/email/config - Créer/mettre à jour une configuration email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      nom,
      email,
      provider,
      clientId,
      refreshToken,
      accessToken,
      tokenExpiry,
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUsername,
      smtpPassword,
      signatureHtml,
      isDefault
    } = body

    // Validation basique
    if (!nom || !email || !provider) {
      return NextResponse.json(
        { error: 'Nom, email et provider sont requis' },
        { status: 400 }
      )
    }

    const configuration = await emailService.saveEmailConfiguration({
      nom,
      email,
      provider,
      clientId,
      refreshToken,
      accessToken,
      tokenExpiry: tokenExpiry ? new Date(tokenExpiry) : undefined,
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUsername,
      smtpPassword,
      signatureHtml,
      isDefault
    })

    return NextResponse.json({ configuration })
  } catch (error) {
    console.error('Erreur sauvegarde configuration email:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde de la configuration email' },
      { status: 500 }
    )
  }
}