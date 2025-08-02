import React, { useState, useEffect } from 'react'
import { 
  Settings as SettingsIcon, 
  Mail, 
  Save, 
  Plus, 
  Check, 
  X, 
  ExternalLink,
  Trash2,
  Copy,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface EmailConfiguration {
  id: string
  nom: string
  email: string
  provider: 'gmail' | 'outlook' | 'custom'
  isActive: boolean
  isDefault: boolean
  signatureHtml?: string
}

interface EmailTemplate {
  id: string
  nom: string
  titre: string
  objet: string
  contenuHtml: string
  contenuTexte?: string
  categorie: string
  description?: string
  isSysteme: boolean
  variables: string
}

export default function Settings() {
  const [configurations, setConfigurations] = useState<EmailConfiguration[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Gmail OAuth
  const [gmailAuthUrl, setGmailAuthUrl] = useState<string>('')
  const [gmailCode, setGmailCode] = useState('')
  const [gmailName, setGmailName] = useState('Cabinet Principal')

  // SMTP Configuration
  const [smtpConfig, setSmtpConfig] = useState({
    nom: '',
    email: '',
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: true,
    smtpUsername: '',
    smtpPassword: '',
    signatureHtml: ''
  })

  useEffect(() => {
    loadConfigurations()
    loadTemplates()
    loadGmailAuthUrl()
  }, [])

  const loadConfigurations = async () => {
    try {
      const response = await fetch('/api/email/config')
      const data = await response.json()
      setConfigurations(data.configurations || [])
    } catch (error) {
      console.error('Erreur chargement configurations:', error)
    }
  }

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/email/templates')
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error('Erreur chargement templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadGmailAuthUrl = async () => {
    try {
      const response = await fetch('/api/email/auth/gmail')
      const data = await response.json()
      setGmailAuthUrl(data.authUrl || '')
    } catch (error) {
      console.error('Erreur génération URL Gmail:', error)
    }
  }

  const handleGmailAuth = async () => {
    if (!gmailCode) {
      setMessage({ type: 'error', text: 'Veuillez coller le code d\'autorisation' })
      return
    }

    try {
      const response = await fetch('/api/email/auth/gmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: gmailCode, nom: gmailName })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: `Gmail configuré avec succès pour ${data.email}` })
        setGmailCode('')
        loadConfigurations()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur configuration Gmail' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la configuration Gmail' })
    }
  }

  const handleSaveSmtpConfig = async () => {
    if (!smtpConfig.nom || !smtpConfig.email || !smtpConfig.smtpHost) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' })
      return
    }

    try {
      const response = await fetch('/api/email/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...smtpConfig,
          provider: 'custom'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuration SMTP sauvegardée avec succès' })
        setSmtpConfig({
          nom: '',
          email: '',
          smtpHost: '',
          smtpPort: 587,
          smtpSecure: true,
          smtpUsername: '',
          smtpPassword: '',
          signatureHtml: ''
        })
        loadConfigurations()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur sauvegarde configuration' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
    }
  }

  const createDefaultTemplates = async () => {
    try {
      const response = await fetch('/api/email/templates', {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Templates par défaut créés avec succès' })
        loadTemplates()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur création templates' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la création des templates' })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessage({ type: 'success', text: 'Copié dans le presse-papiers' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>

      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Configuration Email</TabsTrigger>
          <TabsTrigger value="templates">Templates Email</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6">
          {/* Configurations existantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Comptes Email Configurés</span>
              </CardTitle>
              <CardDescription>
                Gérez vos comptes email pour l'envoi automatique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {configurations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucun compte email configuré</p>
              ) : (
                configurations.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{config.nom}</span>
                        {config.isDefault && (
                          <Badge variant="secondary">Par défaut</Badge>
                        )}
                        <Badge variant="outline">{config.provider}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">{config.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${config.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      <Button variant="ghost" size="sm">
                        <SettingsIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Configuration Gmail OAuth2 */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Gmail (OAuth2)</CardTitle>
              <CardDescription>
                Méthode recommandée et sécurisée pour Gmail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gmail-name">Nom du compte</Label>
                <Input
                  id="gmail-name"
                  value={gmailName}
                  onChange={(e) => setGmailName(e.target.value)}
                  placeholder="Ex: Cabinet Principal"
                />
              </div>

              <div className="space-y-2">
                <Label>Étape 1: Autorisation Gmail</Label>
                <Button
                  onClick={() => window.open(gmailAuthUrl, '_blank')}
                  className="w-full"
                  disabled={!gmailAuthUrl}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ouvrir la page d'autorisation Gmail
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gmail-code">Étape 2: Code d'autorisation</Label>
                <div className="flex space-x-2">
                  <Input
                    id="gmail-code"
                    value={gmailCode}
                    onChange={(e) => setGmailCode(e.target.value)}
                    placeholder="Collez le code d'autorisation ici"
                  />
                  <Button onClick={handleGmailAuth} disabled={!gmailCode}>
                    <Check className="mr-2 h-4 w-4" />
                    Valider
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  L'autorisation Gmail permet l'envoi d'emails sécurisé sans stocker de mot de passe.
                  Cliquez sur le lien ci-dessus, autorisez l'accès, puis copiez le code de retour.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Configuration SMTP */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration SMTP</CardTitle>
              <CardDescription>
                Pour les autres providers ou serveurs SMTP personnalisés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-name">Nom du compte</Label>
                  <Input
                    id="smtp-name"
                    value={smtpConfig.nom}
                    onChange={(e) => setSmtpConfig(prev => ({ ...prev, nom: e.target.value }))}
                    placeholder="Ex: Outlook Cabinet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-email">Email</Label>
                  <Input
                    id="smtp-email"
                    type="email"
                    value={smtpConfig.email}
                    onChange={(e) => setSmtpConfig(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre.email@provider.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">Serveur SMTP</Label>
                  <Input
                    id="smtp-host"
                    value={smtpConfig.smtpHost}
                    onChange={(e) => setSmtpConfig(prev => ({ ...prev, smtpHost: e.target.value }))}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={smtpConfig.smtpPort}
                    onChange={(e) => setSmtpConfig(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>SSL/TLS</Label>
                  <div className="flex items-center space-x-2 h-10">
                    <Switch
                      checked={smtpConfig.smtpSecure}
                      onCheckedChange={(checked) => setSmtpConfig(prev => ({ ...prev, smtpSecure: checked }))}
                    />
                    <span className="text-sm">Activé</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">Nom d'utilisateur</Label>
                  <Input
                    id="smtp-username"
                    value={smtpConfig.smtpUsername}
                    onChange={(e) => setSmtpConfig(prev => ({ ...prev, smtpUsername: e.target.value }))}
                    placeholder="Souvent identique à l'email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Mot de passe</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={smtpConfig.smtpPassword}
                    onChange={(e) => setSmtpConfig(prev => ({ ...prev, smtpPassword: e.target.value }))}
                    placeholder="Mot de passe ou mot de passe d'application"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-signature">Signature HTML (optionnel)</Label>
                <Textarea
                  id="smtp-signature"
                  value={smtpConfig.signatureHtml}
                  onChange={(e) => setSmtpConfig(prev => ({ ...prev, signatureHtml: e.target.value }))}
                  placeholder="<p>Dr. Martin Dupont<br>Cabinet Dentaire<br>Tél: 01.23.45.67.89</p>"
                  rows={3}
                />
              </div>

              <Button onClick={handleSaveSmtpConfig} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder la configuration SMTP
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Templates d'Email</span>
                <Button onClick={createDefaultTemplates} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer les templates par défaut
                </Button>
              </CardTitle>
              <CardDescription>
                Gérez vos modèles d'emails réutilisables
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Aucun template d'email configuré</p>
                  <Button onClick={createDefaultTemplates}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer les templates par défaut
                  </Button>
                </div>
              ) : (
                templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{template.titre}</h3>
                        <Badge variant="outline">{template.categorie}</Badge>
                        {template.isSysteme && (
                          <Badge variant="secondary">Système</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(template.nom)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{template.description}</p>
                    
                    <div className="text-sm">
                      <strong>Objet:</strong> {template.objet}
                    </div>
                    
                    <div className="text-sm">
                      <strong>Variables disponibles:</strong>{' '}
                      {JSON.parse(template.variables).map((variable: string, index: number) => (
                        <Badge key={index} variant="outline" className="mr-1 text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}