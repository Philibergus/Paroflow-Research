/**
 * Service Ollama pour IA locale
 * Gère la communication avec les modèles locaux
 */

import { Ollama } from 'ollama'

// Configuration des modèles disponibles
export const OLLAMA_MODELS = {
  FAST: 'llama3.2:3b-instruct-q6_K',     // 2GB - Ultra-rapide (<1s)
  MEDICAL: 'mistral:7b-instruct-q6_K',    // 5GB - Français médical
  CLASSIFY: 'phi3.5:3.8b-mini-instruct-q6_K' // 3GB - Classification
} as const

export type OllamaModel = typeof OLLAMA_MODELS[keyof typeof OLLAMA_MODELS]

interface OllamaConfig {
  host: string
  timeout: number
  maxRetries: number
}

interface OllamaResponse {
  text: string
  model: string
  processingTime: number
  confidence: number
}

export class OllamaService {
  private ollama: Ollama
  private config: OllamaConfig
  private isAvailable: boolean = false

  constructor(config?: Partial<OllamaConfig>) {
    this.config = {
      host: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',
      timeout: 30000,
      maxRetries: 3,
      ...config
    }
    
    this.ollama = new Ollama({ host: this.config.host })
    // Initialize availability check (async)
    this.initializeAvailability()
  }

  /**
   * Initialize availability check asynchronously
   */
  private async initializeAvailability(): Promise<void> {
    await this.checkAvailability()
  }

  /**
   * Vérifie si Ollama est disponible
   */
  private async checkAvailability(): Promise<void> {
    try {
      const response = await fetch(`${this.config.host}/api/tags`)
      this.isAvailable = response.ok
      
      if (this.isAvailable) {
        console.log('✅ Ollama service disponible')
        const data = await response.json()
        console.log(`📦 Modèles installés: ${data.models?.map((m: any) => m.name).join(', ')}`)
      }
    } catch (error) {
      console.warn('⚠️ Ollama non disponible - Fallback vers API si nécessaire')
      this.isAvailable = false
    }
  }

  /**
   * Ensure Ollama is available before making requests
   */
  async ensureAvailable(): Promise<boolean> {
    if (!this.isAvailable) {
      await this.checkAvailability()
    }
    return this.isAvailable
  }

  /**
   * Génère une réponse avec le modèle approprié
   */
  async generate(
    prompt: string,
    model: OllamaModel = OLLAMA_MODELS.FAST,
    options?: {
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
    }
  ): Promise<OllamaResponse | null> {
    if (!(await this.ensureAvailable())) {
      console.warn('Ollama non disponible')
      return null
    }

    const startTime = Date.now()
    
    try {
      const systemPrompt = options?.systemPrompt || this.getDefaultSystemPrompt()
      
      const response = await this.ollama.generate({
        model,
        prompt: `${systemPrompt}\n\n${prompt}`,
        options: {
          temperature: options?.temperature ?? 0.7,
          num_predict: options?.maxTokens ?? 500,
          top_p: 0.9,
          top_k: 40
        }
      })

      const processingTime = Date.now() - startTime
      
      return {
        text: response.response,
        model,
        processingTime,
        confidence: this.calculateConfidence(response.response, prompt)
      }
    } catch (error) {
      console.error('Erreur Ollama:', error)
      return null
    }
  }

  /**
   * Classification de documents médicaux
   */
  async classifyDocument(text: string): Promise<string | null> {
    const prompt = `Classifie ce document médical en une catégorie:
    - ordonnance
    - compte-rendu
    - courrier
    - résultat-examen
    - consentement
    - autre
    
    Document:
    ${text.substring(0, 500)}
    
    Catégorie (un seul mot):`

    const response = await this.generate(prompt, OLLAMA_MODELS.CLASSIFY, {
      temperature: 0.3,
      maxTokens: 10
    })

    return response?.text.trim().toLowerCase() || null
  }

  /**
   * Correction OCR pour texte médical
   */
  async correctOCR(text: string): Promise<string | null> {
    const prompt = `Corrige les erreurs OCR dans ce texte médical français.
    Garde le même format mais corrige uniquement les fautes évidentes.
    
    Texte OCR:
    ${text}
    
    Texte corrigé:`

    const response = await this.generate(prompt, OLLAMA_MODELS.MEDICAL, {
      temperature: 0.3,
      maxTokens: text.length * 2
    })

    return response?.text || null
  }

  /**
   * Génération de template email
   */
  async generateEmailTemplate(context: {
    type: 'rappel' | 'confirmation' | 'resultat'
    patient: string
    details: any
  }): Promise<string | null> {
    const prompt = `Génère un email professionnel en français pour un cabinet dentaire.
    
    Type: ${context.type}
    Patient: ${context.patient}
    Détails: ${JSON.stringify(context.details)}
    
    Email (format professionnel médical):`

    const response = await this.generate(prompt, OLLAMA_MODELS.MEDICAL, {
      temperature: 0.7,
      maxTokens: 300,
      systemPrompt: 'Tu es assistant dans un cabinet dentaire. Sois professionnel et bienveillant.'
    })

    return response?.text || null
  }

  /**
   * Tri intelligent de tâches
   */
  async sortTodos(todos: string[]): Promise<string[] | null> {
    const prompt = `Trie ces tâches de cabinet dentaire par priorité (urgence médicale d'abord):
    
    ${todos.map((t, i) => `${i+1}. ${t}`).join('\n')}
    
    Liste triée (numéros seulement, séparés par virgules):`

    const response = await this.generate(prompt, OLLAMA_MODELS.FAST, {
      temperature: 0.5,
      maxTokens: 50
    })

    if (!response) return null

    try {
      const order = response.text.match(/\d+/g)?.map(Number) || []
      return order.map(i => todos[i - 1]).filter(Boolean)
    } catch {
      return todos
    }
  }

  /**
   * Prompt système par défaut
   */
  private getDefaultSystemPrompt(): string {
    return `Tu es un assistant IA pour Paroflow, un logiciel de gestion de cabinet dentaire.
    Contexte: parodontologie, implantologie, chirurgie dentaire.
    Langue: français médical professionnel.
    Sois précis, concis et utilise la terminologie médicale appropriée.`
  }

  /**
   * Calcule un score de confiance basique
   */
  private calculateConfidence(response: string, prompt: string): number {
    if (!response || response.length < 10) return 0.5
    
    // Confiance basée sur la longueur et cohérence
    const hasStructure = response.includes('\n') || response.includes('.')
    const lengthRatio = Math.min(response.length / prompt.length, 2) / 2
    const baseConfidence = 0.7
    
    return Math.min(baseConfidence + lengthRatio + (hasStructure ? 0.1 : 0), 0.95)
  }

  /**
   * Vérifie si un modèle est installé
   */
  async isModelInstalled(model: OllamaModel): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.host}/api/tags`)
      const data = await response.json()
      return data.models?.some((m: any) => m.name === model) || false
    } catch {
      return false
    }
  }

  /**
   * Installe un modèle si nécessaire
   */
  async ensureModel(model: OllamaModel): Promise<boolean> {
    if (await this.isModelInstalled(model)) {
      return true
    }

    console.log(`📥 Installation du modèle ${model}...`)
    try {
      await this.ollama.pull({ model })
      console.log(`✅ Modèle ${model} installé`)
      return true
    } catch (error) {
      console.error(`❌ Erreur installation ${model}:`, error)
      return false
    }
  }
}

// Export singleton
export const ollamaService = new OllamaService()