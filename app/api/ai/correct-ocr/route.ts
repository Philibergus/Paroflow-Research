import { NextRequest, NextResponse } from 'next/server'
import { ollamaService } from '@/lib/ai/ollama-service'

// POST /api/ai/correct-ocr - Corriger le texte OCR avec Ollama
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json(
        { error: 'Texte requis pour la correction' },
        { status: 400 }
      )
    }

    const correctedText = await ollamaService.correctOCR(text)
    
    if (correctedText) {
      return NextResponse.json({ 
        correctedText,
        original: text,
        success: true 
      })
    } else {
      return NextResponse.json(
        { error: 'Service de correction indisponible' },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('Erreur correction OCR:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la correction du texte' },
      { status: 500 }
    )
  }
}