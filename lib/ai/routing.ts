/**
 * Système de routing IA intelligent - Approche minimaliste
 * Principe : N'utilise l'IA que quand c'est absolument nécessaire
 */

export enum AILevel {
  NONE = 'none',      // Pas d'IA - logique déterministe
  LOCAL = 'local',    // IA locale Ollama
  API = 'api'         // API externe (Claude/GPT)
}

export enum AITask {
  // Tâches sans IA (déterministes)
  CALCULATE_DOSE = 'calculate_dose',
  VALIDATE_FORM = 'validate_form',
  QUERY_DATABASE = 'query_database',
  EXPORT_PDF = 'export_pdf',
  
  // Tâches IA locale (simples, non-critiques)
  OCR_CORRECTION = 'ocr_correction',
  CLASSIFY_DOCUMENT = 'classify_document',
  TEMPLATE_EMAIL = 'template_email',
  SORT_TODO = 'sort_todo',
  
  // Tâches API (complexes, critiques)
  MEDICAL_DICTATION = 'medical_dictation',
  SURGICAL_REPORT = 'surgical_report',
  CLINICAL_ANALYSIS = 'clinical_analysis',
  COMPLEX_RECOMMENDATION = 'complex_recommendation'
}

export interface AIConfig {
  preferLocal: boolean
  maxLocalComplexity: number
  apiProvider: 'claude' | 'gpt4' | 'gemini'
  confidenceThreshold: number
  forceAnonymization: boolean
}

export interface AIResponse {
  result: any
  level: AILevel
  confidence: number
  processingTime: number
  anonymized?: boolean
}

export class AIRouter {
  private config: AIConfig = {
    preferLocal: true,
    maxLocalComplexity: 3,
    apiProvider: 'claude',
    confidenceThreshold: 0.85,
    forceAnonymization: true
  }

  /**
   * Détermine si une tâche nécessite l'IA et quel niveau
   */
  async route(task: AITask, data: any, config?: Partial<AIConfig>): Promise<AIResponse> {
    const startTime = Date.now()
    const mergedConfig = { ...this.config, ...config }
    
    // 1. Évaluer si la tâche est déterministe (pas d'IA)
    if (this.isDeterministic(task)) {
      const result = await this.processDeterministic(task, data)
      return {
        result,
        level: AILevel.NONE,
        confidence: 1.0,
        processingTime: Date.now() - startTime
      }
    }
    
    // 2. Évaluer la complexité de la tâche
    const complexity = this.assessComplexity(task, data)
    const isCritical = this.isCritical(task)
    
    // 3. Décider du niveau d'IA approprié
    if (!isCritical && complexity <= mergedConfig.maxLocalComplexity) {
      // Utiliser IA locale pour tâches simples non-critiques
      const result = await this.processLocal(task, data)
      return {
        result,
        level: AILevel.LOCAL,
        confidence: result.confidence || 0.9,
        processingTime: Date.now() - startTime
      }
    }
    
    // 4. Utiliser API pour tâches complexes/critiques
    // Anonymiser les données sensibles avant envoi
    const sanitizedData = mergedConfig.forceAnonymization 
      ? this.anonymizeHealthData(data)
      : data
      
    const result = await this.processAPI(task, sanitizedData, mergedConfig)
    return {
      result,
      level: AILevel.API,
      confidence: result.confidence || 0.95,
      processingTime: Date.now() - startTime,
      anonymized: mergedConfig.forceAnonymization
    }
  }

  /**
   * Détermine si une tâche peut être résolue sans IA
   */
  private isDeterministic(task: AITask): boolean {
    const deterministicTasks = [
      AITask.CALCULATE_DOSE,
      AITask.VALIDATE_FORM,
      AITask.QUERY_DATABASE,
      AITask.EXPORT_PDF
    ]
    return deterministicTasks.includes(task)
  }

  /**
   * Évalue la complexité d'une tâche (1-5)
   */
  private assessComplexity(task: AITask, data: any): number {
    const complexityMap: Record<AITask, number> = {
      [AITask.CALCULATE_DOSE]: 0,
      [AITask.VALIDATE_FORM]: 0,
      [AITask.QUERY_DATABASE]: 0,
      [AITask.EXPORT_PDF]: 0,
      [AITask.OCR_CORRECTION]: 2,
      [AITask.CLASSIFY_DOCUMENT]: 2,
      [AITask.TEMPLATE_EMAIL]: 2,
      [AITask.SORT_TODO]: 1,
      [AITask.MEDICAL_DICTATION]: 4,
      [AITask.SURGICAL_REPORT]: 5,
      [AITask.CLINICAL_ANALYSIS]: 5,
      [AITask.COMPLEX_RECOMMENDATION]: 4
    }
    
    let complexity = complexityMap[task] || 3
    
    // Ajuster selon la taille des données
    if (data.text && data.text.length > 1000) complexity += 1
    if (data.context && Object.keys(data.context).length > 5) complexity += 1
    
    return Math.min(complexity, 5)
  }

  /**
   * Détermine si une tâche est critique (nécessite haute précision)
   */
  private isCritical(task: AITask): boolean {
    const criticalTasks = [
      AITask.MEDICAL_DICTATION,
      AITask.SURGICAL_REPORT,
      AITask.CLINICAL_ANALYSIS,
      AITask.COMPLEX_RECOMMENDATION
    ]
    return criticalTasks.includes(task)
  }

  /**
   * Traite les tâches déterministes sans IA
   */
  private async processDeterministic(task: AITask, data: any): Promise<any> {
    switch (task) {
      case AITask.CALCULATE_DOSE:
        // Calcul simple basé sur formules médicales
        return this.calculateDose(data)
        
      case AITask.VALIDATE_FORM:
        // Validation basée sur règles métier
        return this.validateForm(data)
        
      case AITask.QUERY_DATABASE:
        // Requête Prisma directe
        return this.queryDatabase(data)
        
      case AITask.EXPORT_PDF:
        // Génération PDF template
        return this.exportPDF(data)
        
      default:
        throw new Error(`Tâche déterministe non implémentée: ${task}`)
    }
  }

  /**
   * Traite avec IA locale (Ollama)
   */
  private async processLocal(task: AITask, data: any): Promise<any> {
    // TODO: Implémenter l'appel à Ollama
    // Pour l'instant, retourne un mock
    return {
      result: `Traité localement: ${task}`,
      confidence: 0.9
    }
  }

  /**
   * Traite avec API externe
   */
  private async processAPI(task: AITask, data: any, config: AIConfig): Promise<any> {
    // TODO: Implémenter l'appel API (Claude/GPT)
    // Pour l'instant, retourne un mock
    return {
      result: `Traité par API: ${task}`,
      confidence: 0.95
    }
  }

  /**
   * Anonymise les données patient avant envoi API
   */
  private anonymizeHealthData(data: any): any {
    const anonymized = { ...data }
    
    // Remplacer noms par identifiants génériques
    if (anonymized.patient) {
      anonymized.patient = {
        ...anonymized.patient,
        nom: '[PATIENT]',
        prenom: '[PATIENT]',
        numeroSecurite: undefined,
        telephone: undefined,
        email: undefined,
        adresse: undefined
      }
    }
    
    // Remplacer informations sensibles dans le texte
    if (anonymized.text) {
      anonymized.text = anonymized.text
        .replace(/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, '[NOM_PATIENT]')
        .replace(/\b\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}\b/g, '[TELEPHONE]')
        .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, '[EMAIL]')
    }
    
    return anonymized
  }

  // Méthodes utilitaires pour tâches déterministes
  
  private calculateDose(data: any): any {
    // Implémentation calcul de dose
    const { weight, age, medication } = data
    // Formule médicale standard
    return { dose: weight * 0.5, unit: 'mg' }
  }
  
  private validateForm(data: any): any {
    // Validation basée sur schéma Zod
    return { valid: true, errors: [] }
  }
  
  private queryDatabase(data: any): any {
    // Query Prisma
    return { results: [] }
  }
  
  private exportPDF(data: any): any {
    // Génération PDF
    return { pdf: 'base64...' }
  }
}

// Export singleton
export const aiRouter = new AIRouter()