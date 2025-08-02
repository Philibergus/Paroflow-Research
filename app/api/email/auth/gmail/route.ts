import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email/email-service'

// GET /api/email/auth/gmail - Obtenir l'URL d'autorisation Gmail
export async function GET() {
  try {
    const authUrl = emailService.getGmailAuthUrl()
    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Erreur génération URL auth Gmail:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'URL d\'autorisation Gmail' },
      { status: 500 }
    )
  }
}

// POST /api/email/auth/gmail - Échanger le code d'autorisation contre des tokens
export async function POST(request: NextRequest) {
  try {
    const { code, nom } = await request.json()
    
    if (!code) {
      return NextResponse.json(
        { error: 'Code d\'autorisation requis' },
        { status: 400 }
      )
    }

    const tokens = await emailService.exchangeCodeForTokens(code)
    
    // Sauvegarder la configuration automatiquement
    const configuration = await emailService.saveEmailConfiguration({
      nom: nom || 'Compte Gmail',
      email: tokens.email,
      provider: 'gmail',
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      isDefault: true
    })

    return NextResponse.json({ 
      success: true, 
      email: tokens.email,
      configuration 
    })
  } catch (error) {
    console.error('Erreur échange code Gmail:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'échange du code d\'autorisation' },
      { status: 500 }
    )
  }
}