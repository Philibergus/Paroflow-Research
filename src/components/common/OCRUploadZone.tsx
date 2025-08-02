import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, Image, FileText, Loader2, CheckCircle, AlertCircle, Copy, Trash2, Sparkles, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import Tesseract, { createWorker } from 'tesseract.js'

interface OCRResult {
  text: string
  confidence: number
  detectedType: 'patient' | 'correspondant' | 'commercial' | 'unknown'
  extractedData: {
    nom?: string
    prenom?: string
    email?: string
    telephone?: string
    adresse?: string
    specialite?: string
    dateNaissance?: string
    numeroSecurite?: string
  }
  correctedText?: string
  aiClassification?: string
  aiConfidence?: number
}

interface OCRUploadZoneProps {
  onDataExtracted: (data: OCRResult['extractedData'], type: OCRResult['detectedType']) => void
  onTextExtracted?: (text: string) => void
  className?: string
}

export default function OCRUploadZone({ 
  onDataExtracted, 
  onTextExtracted, 
  className = '' 
}: OCRUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAiProcessing, setIsAiProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  // Handle paste events
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) {
            await processFile(file)
          }
          break
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    const files = Array.from(e.dataTransfer.files)
    const imageOrPdfFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    )

    if (imageOrPdfFiles.length > 0) {
      await processFile(imageOrPdfFiles[0])
    }
  }, [])

  // File input handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  // Smart content detection
  const detectContentType = (text: string): OCRResult['detectedType'] => {
    const lowercaseText = text.toLowerCase()
    
    // Patient indicators
    const patientIndicators = [
      'né(e) le', 'date de naissance', 'sécurité sociale', 'n° ss', 'patient',
      'assuré social', 'carte vitale', 'mutuelle'
    ]
    
    // Correspondant indicators
    const correspondantIndicators = [
      'dr.', 'dr ', 'docteur', 'cabinet', 'orthodontiste', 'dentiste',
      'chirurgien', 'orl', 'cardiologue', 'rhumatologue', 'spécialiste',
      'consultation', 'ordonnance', 'signature', 'cordialement'
    ]
    
    // Commercial indicators
    const commercialIndicators = [
      'société', 'sarl', 'sas', 'commercial', 'vente', 'tarif', 'devis',
      'facture', 'tva', 'siret', 'représentant'
    ]

    const patientScore = patientIndicators.reduce((score, indicator) => 
      lowercaseText.includes(indicator) ? score + 1 : score, 0
    )
    
    const correspondantScore = correspondantIndicators.reduce((score, indicator) => 
      lowercaseText.includes(indicator) ? score + 1 : score, 0
    )
    
    const commercialScore = commercialIndicators.reduce((score, indicator) => 
      lowercaseText.includes(indicator) ? score + 1 : score, 0
    )

    if (correspondantScore > patientScore && correspondantScore > commercialScore) {
      return 'correspondant'
    } else if (patientScore > correspondantScore && patientScore > commercialScore) {
      return 'patient'
    } else if (commercialScore > 0) {
      return 'commercial'
    }
    
    return 'unknown'
  }

  // AI-powered text correction using Ollama
  const correctTextWithAI = async (text: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/ai/correct-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (response.ok) {
        const data = await response.json()
        return data.correctedText
      }
      return null
    } catch (error) {
      console.error('Erreur correction IA:', error)
      return null
    }
  }

  // AI-powered document classification using Ollama
  const classifyDocumentWithAI = async (text: string): Promise<{ classification: string, confidence: number } | null> => {
    try {
      const response = await fetch('/api/ai/classify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (response.ok) {
        const data = await response.json()
        return {
          classification: data.classification,
          confidence: data.confidence || 0.8
        }
      }
      return null
    } catch (error) {
      console.error('Erreur classification IA:', error)
      return null
    }
  }

  // Enhanced OCR with AI processing
  const enhanceWithAI = async (result: OCRResult): Promise<OCRResult> => {
    setIsAiProcessing(true)
    try {
      // Correct text with AI
      const correctedText = await correctTextWithAI(result.text)
      
      // Classify document with AI
      const aiClassification = await classifyDocumentWithAI(result.text)
      
      return {
        ...result,
        correctedText: correctedText || undefined,
        aiClassification: aiClassification?.classification || undefined,
        aiConfidence: aiClassification?.confidence || undefined
      }
    } catch (error) {
      console.error('Erreur amélioration IA:', error)
      return result
    } finally {
      setIsAiProcessing(false)
    }
  }

  // Extract structured data from text
  const extractStructuredData = (text: string): OCRResult['extractedData'] => {
    const data: OCRResult['extractedData'] = {}
    
    // Email extraction
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
    if (emailMatch) data.email = emailMatch[0]
    
    // Phone extraction (French formats)
    const phoneMatch = text.match(/(?:(?:\+33|0)[1-9](?:[-.\s]?\d{2}){4})/g)
    if (phoneMatch) data.telephone = phoneMatch[0].replace(/[-.\s]/g, ' ')
    
    // Social security number
    const ssnMatch = text.match(/[12]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{3}\s?\d{3}\s?\d{2}/g)
    if (ssnMatch) data.numeroSecurite = ssnMatch[0]
    
    // Date of birth
    const dobMatch = text.match(/(?:né\(e\)\s+le\s+)?(\d{1,2}[/\-.] \d{1,2}[/\-.]\d{4})/gi)
    if (dobMatch) {
      const dateStr = dobMatch[0].replace(/né\(e\)\s+le\s+/gi, '')
      data.dateNaissance = dateStr.replace(/[/\-.]/g, '-')
    }
    
    // Name extraction (basic patterns)
    const drMatch = text.match(/(?:Dr\.?\s+|Docteur\s+)([A-Z][a-zA-Z\s-]+)/g)
    if (drMatch) {
      data.nom = drMatch[0].replace(/(?:Dr\.?\s+|Docteur\s+)/g, '').trim()
    }
    
    // Specialty extraction
    const specialties = [
      'orthodontie', 'orthodontiste', 'parodontologie', 'endodontie', 
      'implantologie', 'chirurgie orale', 'chirurgie maxillo-faciale',
      'orl', 'cardiologie', 'rhumatologie', 'médecine générale'
    ]
    
    for (const specialty of specialties) {
      if (text.toLowerCase().includes(specialty)) {
        data.specialite = specialty.charAt(0).toUpperCase() + specialty.slice(1)
        break
      }
    }
    
    // Address extraction (basic pattern)
    const addressMatch = text.match(/\d+[^\n]*(?:rue|avenue|boulevard|place|chemin)[^\n]*/gi)
    if (addressMatch) data.adresse = addressMatch[0]
    
    return data
  }

  // Main file processing function
  const processFile = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)
    
    try {
      const worker = await createWorker('fra', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        }
      })

      const { data: { text, confidence } } = await worker.recognize(file)
      await worker.terminate()

      const detectedType = detectContentType(text)
      const extractedData = extractStructuredData(text)
      
      const result: OCRResult = {
        text: text.trim(),
        confidence,
        detectedType,
        extractedData
      }

      setExtractedText(text.trim())
      setOcrResult(result)
      onTextExtracted?.(text.trim())
      onDataExtracted(extractedData, detectedType)

      // Enhance with AI in background
      try {
        const enhancedResult = await enhanceWithAI(result)
        setOcrResult(enhancedResult)
        
        // If AI provided better classification, update the callback
        if (enhancedResult.aiClassification && enhancedResult.aiClassification !== detectedType) {
          const aiType = enhancedResult.aiClassification as OCRResult['detectedType']
          if (['patient', 'correspondant', 'commercial'].includes(aiType)) {
            onDataExtracted(extractedData, aiType)
          }
        }
      } catch (error) {
        console.error('Erreur amélioration IA:', error)
      }
      
    } catch (err) {
      console.error('OCR Error:', err)
      setError('Erreur lors du traitement de l\'image. Veuillez réessayer.')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const handleClearResults = () => {
    setExtractedText('')
    setOcrResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCopyText = async () => {
    if (extractedText) {
      await navigator.clipboard.writeText(extractedText)
    }
  }

  const getTypeColor = (type: OCRResult['detectedType']) => {
    switch (type) {
      case 'patient': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'correspondant': return 'bg-green-100 text-green-800 border-green-200'
      case 'commercial': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeLabel = (type: OCRResult['detectedType']) => {
    switch (type) {
      case 'patient': return 'Patient'
      case 'correspondant': return 'Correspondant'
      case 'commercial': return 'Commercial'
      default: return 'Type inconnu'
    }
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>OCR - Extraction de données</span>
          </CardTitle>
          <CardDescription>
            Glissez-déposez une image, utilisez Ctrl+V pour coller une capture, ou cliquez pour sélectionner un fichier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Zone */}
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            `}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {isProcessing ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
                <div>
                  <p className="text-lg font-medium">Traitement en cours...</p>
                  <p className="text-sm text-gray-500">Extraction du texte : {progress}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <Image className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    Glissez votre fichier ici ou cliquez pour sélectionner
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Formats supportés : PNG, JPG, JPEG, PDF
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    💡 Astuce : Utilisez Ctrl+V pour coller une capture d'écran
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {ocrResult && (
            <div className="space-y-4">
              <Separator />
              
              {/* Detection Results */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(ocrResult.detectedType)}>
                    {getTypeLabel(ocrResult.detectedType)}
                  </Badge>
                  {ocrResult.aiClassification && (
                    <Badge variant="outline" className="border-purple-300 text-purple-700">
                      <Sparkles className="h-3 w-3 mr-1" />
                      IA: {ocrResult.aiClassification}
                    </Badge>
                  )}
                  <span className="text-sm text-gray-500">
                    Confiance : {Math.round(ocrResult.confidence)}%
                  </span>
                  {ocrResult.aiConfidence && (
                    <span className="text-sm text-purple-600">
                      IA: {Math.round(ocrResult.aiConfidence * 100)}%
                    </span>
                  )}
                  {isAiProcessing && (
                    <div className="flex items-center space-x-1 text-purple-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Amélioration IA...</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {ocrResult.correctedText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExtractedText(ocrResult.correctedText!)}
                      className="flex items-center space-x-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Wand2 className="h-4 w-4" />
                      <span>Utiliser correction IA</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyText}
                    className="flex items-center space-x-1"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copier</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearResults}
                    className="flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Effacer</span>
                  </Button>
                </div>
              </div>

              {/* Extracted Data Summary */}
              {Object.keys(ocrResult.extractedData).length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Données extraites automatiquement</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {Object.entries(ocrResult.extractedData).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium">
                            {key === 'nom' ? 'Nom' :
                             key === 'prenom' ? 'Prénom' :
                             key === 'email' ? 'Email' :
                             key === 'telephone' ? 'Téléphone' :
                             key === 'adresse' ? 'Adresse' :
                             key === 'specialite' ? 'Spécialité' :
                             key === 'dateNaissance' ? 'Date de naissance' :
                             key === 'numeroSecurite' ? 'Sécurité sociale' :
                             key}:
                          </span>
                          <span className="text-gray-700">{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Text */}
              <div>
                <h4 className="font-medium mb-2">Texte extrait</h4>
                <Textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="min-h-32 text-sm font-mono"
                  placeholder="Le texte extrait apparaîtra ici..."
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}