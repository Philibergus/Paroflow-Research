import React, { useState, useEffect } from 'react'
import { 
  Mail, 
  Send, 
  FileText, 
  User, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  Settings,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface EmailTemplate {
  id: string
  nom: string
  titre: string
  objet: string
  contenuHtml: string
  contenuTexte?: string
  categorie: string
  variables: string
}

interface EmailConfiguration {
  id: string
  nom: string
  email: string
  provider: string
  isDefault: boolean
}

interface EmailSenderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipientEmail?: string
  recipientName?: string
  patientId?: string
  defaultTemplate?: string
  defaultSubject?: string
  defaultVariables?: Record<string, string>
  onSuccess?: () => void
}

export default function EmailSender({
  open,
  onOpenChange,
  recipientEmail = '',
  recipientName = '',
  patientId,
  defaultTemplate,
  defaultSubject = '',
  defaultVariables = {},
  onSuccess
}: EmailSenderProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [configurations, setConfigurations] = useState<EmailConfiguration[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    to: recipientEmail,
    subject: defaultSubject,
    templateId: defaultTemplate || '',
    configId: '',
    customHtml: '',
    customText: '',
    variables: defaultVariables
  })

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)

  useEffect(() => {
    if (open) {
      loadData()
      setFormData(prev => ({
        ...prev,
        to: recipientEmail,
        subject: defaultSubject,
        templateId: defaultTemplate || '',
        variables: defaultVariables
      }))
    }
  }, [open, recipientEmail, defaultSubject, defaultTemplate, defaultVariables])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load templates and configurations in parallel
      const [templatesResponse, configurationsResponse] = await Promise.all([
        fetch('/api/email/templates'),
        fetch('/api/email/config')
      ])

      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json()
        setTemplates(templatesData.templates || [])
      }

      if (configurationsResponse.ok) {
        const configurationsData = await configurationsResponse.json()
        setConfigurations(configurationsData.configurations || [])
        
        // Select default configuration
        const defaultConfig = configurationsData.configurations?.find((c: EmailConfiguration) => c.isDefault)
        if (defaultConfig) {
          setFormData(prev => ({ ...prev, configId: defaultConfig.id }))
        }
      }
    } catch (error) {
      console.error('Erreur chargement données email:', error)
      setMessage({ type: 'error', text: 'Erreur lors du chargement des données' })
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    setSelectedTemplate(template || null)
    setFormData(prev => ({
      ...prev,
      templateId,
      subject: template ? processTemplate(template.objet, prev.variables) : prev.subject
    }))
  }

  const handleVariableChange = (key: string, value: string) => {
    const newVariables = { ...formData.variables, [key]: value }
    setFormData(prev => ({ ...prev, variables: newVariables }))
    
    // Update subject if template is selected
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        subject: processTemplate(selectedTemplate.objet, newVariables)
      }))
    }
  }

  const processTemplate = (template: string, variables: Record<string, string>): string => {
    let processed = template
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g')
      processed = processed.replace(regex, value)
    }
    return processed
  }

  const getProcessedContent = () => {
    if (!selectedTemplate) return { html: formData.customHtml, text: formData.customText }
    
    return {
      html: processTemplate(selectedTemplate.contenuHtml, formData.variables),
      text: selectedTemplate.contenuTexte ? processTemplate(selectedTemplate.contenuTexte, formData.variables) : ''
    }
  }

  const handleSend = async () => {
    if (!formData.to || !formData.subject) {
      setMessage({ type: 'error', text: 'Destinataire et objet sont requis' })
      return
    }

    if (!formData.templateId && !formData.customHtml && !formData.customText) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un template ou saisir un contenu' })
      return
    }

    try {
      setSending(true)
      setMessage(null)

      const emailData: any = {
        to: formData.to,
        subject: formData.subject,
        patientId,
        type: 'manuel',
        trigger: 'interface_utilisateur'
      }

      if (formData.templateId) {
        emailData.templateId = formData.templateId
        emailData.variables = formData.variables
      } else {
        emailData.html = formData.customHtml
        emailData.text = formData.customText
      }

      if (formData.configId) {
        emailData.configId = formData.configId
      }

      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Email envoyé avec succès!' })
        onSuccess?.()
        setTimeout(() => {
          onOpenChange(false)
        }, 2000)
      } else {
        setMessage({ type: 'error', text: result.error || 'Erreur lors de l\'envoi' })
      }
    } catch (error) {
      console.error('Erreur envoi email:', error)
      setMessage({ type: 'error', text: 'Erreur lors de l\'envoi de l\'email' })
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    setMessage(null)
    setPreviewMode(false)
    onOpenChange(false)
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const processedContent = getProcessedContent()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Envoyer un Email</span>
          </DialogTitle>
          <DialogDescription>
            {recipientName ? `Envoyer un email à ${recipientName}` : 'Composer et envoyer un email'}
          </DialogDescription>
        </DialogHeader>

        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Configuration et destinataire */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="config">Compte d'envoi</Label>
              <Select value={formData.configId} onValueChange={(value) => setFormData(prev => ({ ...prev, configId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un compte" />
                </SelectTrigger>
                <SelectContent>
                  {configurations.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      <div className="flex items-center space-x-2">
                        <span>{config.nom}</span>
                        <Badge variant="outline">{config.provider}</Badge>
                        {config.isDefault && <Badge variant="secondary">Défaut</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">Destinataire</Label>
              <Input
                id="to"
                type="email"
                value={formData.to}
                onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                placeholder="email@exemple.com"
              />
            </div>
          </div>

          {/* Template et objet */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template">Template d'email</Label>
              <Select value={formData.templateId} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un template ou créer un email personnalisé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Email personnalisé</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>{template.titre}</span>
                        <Badge variant="outline">{template.categorie}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Objet</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Objet de l'email"
              />
            </div>
          </div>

          {/* Variables du template */}
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Variables du template</CardTitle>
                <CardDescription>
                  Personnalisez les variables utilisées dans le template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {JSON.parse(selectedTemplate.variables).map((variable: string) => (
                    <div key={variable} className="space-y-2">
                      <Label htmlFor={variable} className="capitalize">{variable}</Label>
                      <Input
                        id={variable}
                        value={formData.variables[variable] || ''}
                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                        placeholder={`Valeur pour ${variable}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contenu personnalisé */}
          {!formData.templateId && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customHtml">Contenu HTML</Label>
                <Textarea
                  id="customHtml"
                  value={formData.customHtml}
                  onChange={(e) => setFormData(prev => ({ ...prev, customHtml: e.target.value }))}
                  placeholder="Contenu HTML de l'email..."
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customText">Contenu texte (optionnel)</Label>
                <Textarea
                  id="customText"
                  value={formData.customText}
                  onChange={(e) => setFormData(prev => ({ ...prev, customText: e.target.value }))}
                  placeholder="Version texte de l'email..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Aperçu */}
          {(selectedTemplate || formData.customHtml) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>Aperçu de l'email</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {previewMode ? 'Masquer' : 'Voir'} l'aperçu
                  </Button>
                </CardTitle>
              </CardHeader>
              {previewMode && (
                <CardContent>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-sm font-medium mb-2">Objet: {formData.subject}</div>
                    <Separator className="my-2" />
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: processedContent.html }}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={sending}>
            Annuler
          </Button>
          <Button onClick={handleSend} disabled={sending || !configurations.length}>
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}