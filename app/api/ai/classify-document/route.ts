import { NextRequest, NextResponse } from 'next/server'
import { ollamaService } from '@/lib/ai/ollama-service'

// POST /api/ai/classify-document - Classifier un document avec Ollama
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json(
        { error: 'Texte requis pour la classification' },
        { status: 400 }
      )
    }

    const classification = await ollamaService.classifyDocument(text)
    
    if (classification) {
      // Mapper les classifications IA aux types du système
      let mappedType = classification
      const confidence = 0.85 // Confiance par défaut pour Ollama
      
      // Mapping des classifications
      const typeMapping: Record<string, string> = {
        'ordonnance': 'correspondant',
        'compte-rendu': 'correspondant', 
        'courrier': 'correspondant',
        'résultat-examen': 'correspondant',
        'consentement': 'patient',
        'autre': 'unknown'
      }
      
      if (typeMapping[classification]) {
        mappedType = typeMapping[classification]
      }
      
      return NextResponse.json({ 
        classification: mappedType,
        originalClassification: classification,
        confidence,
        success: true 
      })
    } else {
      return NextResponse.json(
        { error: 'Service de classification indisponible' },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('Erreur classification document:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la classification du document' },
      { status: 500 }
    )
  }
}