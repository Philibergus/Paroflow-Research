/**
 * Service Email pour Paroflow
 * Gère l'envoi d'emails via Gmail OAuth2 et autres providers
 */

import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import { prisma } from '@/app/lib/prisma'
import type { ConfigurationEmail, TemplateEmail, Patient } from '@prisma/client'

export interface EmailData {
  to: string
  subject: string
  html?: string
  text?: string
  templateId?: string
  variables?: Record<string, string>
  patientId?: string
  type?: 'manuel' | 'automatique' | 'rappel'
  trigger?: string
}

export interface EmailConfig {
  id: string
  nom: string
  email: string
  provider: 'gmail' | 'outlook' | 'custom'
  clientId?: string
  refreshToken?: string
  accessToken?: string
  tokenExpiry?: Date
  smtpHost?: string
  smtpPort?: number
  smtpSecure?: boolean
  smtpUsername?: string
  smtpPasswordHash?: string
  signatureHtml?: string
  isActive: boolean
  isDefault: boolean
}

export class EmailService {
  private oauth2Client: any

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    )
  }

  /**
   * Obtient l'URL d'autorisation OAuth2 pour Gmail
   */
  getGmailAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/userinfo.email'
    ]

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    })
  }

  /**
   * Échange le code d'autorisation contre des tokens
   */
  async exchangeCodeForTokens(code: string): Promise<{
    accessToken: string
    refreshToken: string
    email: string
  }> {
    const { tokens } = await this.oauth2Client.getAccessToken(code)
    
    // Obtenir l'email de l'utilisateur
    this.oauth2Client.setCredentials(tokens)
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client })
    const profile = await gmail.users.getProfile({ userId: 'me' })
    
    return {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      email: profile.data.emailAddress!
    }
  }

  /**
   * Crée ou met à jour une configuration email
   */
  async saveEmailConfiguration(config: {
    nom: string
    email: string
    provider: 'gmail' | 'outlook' | 'custom'
    clientId?: string
    refreshToken?: string
    accessToken?: string
    tokenExpiry?: Date
    smtpHost?: string
    smtpPort?: number
    smtpSecure?: boolean
    smtpUsername?: string
    smtpPassword?: string
    signatureHtml?: string
    isDefault?: boolean
  }): Promise<ConfigurationEmail> {
    // Si c'est le compte par défaut, désactiver les autres
    if (config.isDefault) {
      await prisma.configurationEmail.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      })
    }

    // Hash du mot de passe SMTP si fourni
    let smtpPasswordHash: string | undefined
    if (config.smtpPassword) {
      const crypto = await import('crypto')
      smtpPasswordHash = crypto.createHash('sha256').update(config.smtpPassword).digest('hex')
    }

    return await prisma.configurationEmail.upsert({
      where: { email: config.email },
      update: {
        nom: config.nom,
        provider: config.provider,
        clientId: config.clientId,
        refreshToken: config.refreshToken,
        accessToken: config.accessToken,
        tokenExpiry: config.tokenExpiry,
        smtpHost: config.smtpHost,
        smtpPort: config.smtpPort,
        smtpSecure: config.smtpSecure,
        smtpUsername: config.smtpUsername,
        smtpPasswordHash,
        signatureHtml: config.signatureHtml,
        isDefault: config.isDefault || false
      },
      create: {
        nom: config.nom,
        email: config.email,
        provider: config.provider,
        clientId: config.clientId,
        refreshToken: config.refreshToken,
        accessToken: config.accessToken,
        tokenExpiry: config.tokenExpiry,
        smtpHost: config.smtpHost,
        smtpPort: config.smtpPort,
        smtpSecure: config.smtpSecure,
        smtpUsername: config.smtpUsername,
        smtpPasswordHash,
        signatureHtml: config.signatureHtml,
        isDefault: config.isDefault || false
      }
    })
  }

  /**
   * Obtient toutes les configurations email
   */
  async getEmailConfigurations(): Promise<EmailConfig[]> {
    const configs = await prisma.configurationEmail.findMany({
      where: { isActive: true },
      orderBy: [
        { isDefault: 'desc' },
        { nom: 'asc' }
      ]
    })

    return configs.map(config => ({
      id: config.id,
      nom: config.nom,
      email: config.email,
      provider: config.provider as 'gmail' | 'outlook' | 'custom',
      clientId: config.clientId || undefined,
      refreshToken: config.refreshToken || undefined,
      accessToken: config.accessToken || undefined,
      tokenExpiry: config.tokenExpiry || undefined,
      smtpHost: config.smtpHost || undefined,
      smtpPort: config.smtpPort || undefined,
      smtpSecure: config.smtpSecure || undefined,
      smtpUsername: config.smtpUsername || undefined,
      smtpPasswordHash: config.smtpPasswordHash || undefined,
      signatureHtml: config.signatureHtml || undefined,
      isActive: config.isActive,
      isDefault: config.isDefault
    }))
  }

  /**
   * Obtient la configuration email par défaut
   */
  async getDefaultEmailConfiguration(): Promise<EmailConfig | null> {
    const config = await prisma.configurationEmail.findFirst({
      where: { isActive: true, isDefault: true }
    })

    if (!config) return null

    return {
      id: config.id,
      nom: config.nom,
      email: config.email,
      provider: config.provider as 'gmail' | 'outlook' | 'custom',
      clientId: config.clientId || undefined,
      refreshToken: config.refreshToken || undefined,
      accessToken: config.accessToken || undefined,
      tokenExpiry: config.tokenExpiry || undefined,
      smtpHost: config.smtpHost || undefined,
      smtpPort: config.smtpPort || undefined,
      smtpSecure: config.smtpSecure || undefined,
      smtpUsername: config.smtpUsername || undefined,
      smtpPasswordHash: config.smtpPasswordHash || undefined,
      signatureHtml: config.signatureHtml || undefined,
      isActive: config.isActive,
      isDefault: config.isDefault
    }
  }

  /**
   * Crée un transporteur nodemailer pour Gmail OAuth2
   */
  private async createGmailTransporter(config: EmailConfig): Promise<nodemailer.Transporter> {
    if (!config.refreshToken) {
      throw new Error('Token de rafraîchissement manquant pour Gmail')
    }

    this.oauth2Client.setCredentials({
      refresh_token: config.refreshToken
    })

    // Obtenir un nouveau token d'accès
    const { credentials } = await this.oauth2Client.refreshAccessToken()
    
    // Mettre à jour le token en base
    await prisma.configurationEmail.update({
      where: { id: config.id },
      data: {
        accessToken: credentials.access_token!,
        tokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : undefined
      }
    })

    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config.email,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: config.refreshToken,
        accessToken: credentials.access_token
      }
    })
  }

  /**
   * Crée un transporteur nodemailer pour SMTP
   */
  private async createSmtpTransporter(config: EmailConfig): Promise<nodemailer.Transporter> {
    if (!config.smtpHost || !config.smtpPort || !config.smtpUsername) {
      throw new Error('Configuration SMTP incomplète')
    }

    // Déchiffrer le mot de passe (ici simplifié - en production utiliser un vrai chiffrement)
    let smtpPassword = ''
    if (config.smtpPasswordHash) {
      // TODO: Implémenter le déchiffrement sécurisé
      smtpPassword = 'mot_de_passe_a_dechiffrer'
    }

    return nodemailer.createTransporter({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUsername,
        pass: smtpPassword
      }
    })
  }

  /**
   * Envoie un email
   */
  async sendEmail(emailData: EmailData, configId?: string): Promise<boolean> {
    try {
      // Obtenir la configuration email
      const config = configId 
        ? await prisma.configurationEmail.findUnique({ where: { id: configId } })
        : await prisma.configurationEmail.findFirst({ where: { isActive: true, isDefault: true } })

      if (!config) {
        throw new Error('Aucune configuration email trouvée')
      }

      const emailConfig: EmailConfig = {
        id: config.id,
        nom: config.nom,
        email: config.email,
        provider: config.provider as 'gmail' | 'outlook' | 'custom',
        clientId: config.clientId || undefined,
        refreshToken: config.refreshToken || undefined,
        accessToken: config.accessToken || undefined,
        tokenExpiry: config.tokenExpiry || undefined,
        smtpHost: config.smtpHost || undefined,
        smtpPort: config.smtpPort || undefined,
        smtpSecure: config.smtpSecure || undefined,
        smtpUsername: config.smtpUsername || undefined,
        smtpPasswordHash: config.smtpPasswordHash || undefined,
        signatureHtml: config.signatureHtml || undefined,
        isActive: config.isActive,
        isDefault: config.isDefault
      }

      // Traiter le template si spécifié
      let finalHtml = emailData.html
      let finalText = emailData.text
      let finalSubject = emailData.subject

      if (emailData.templateId) {
        const template = await prisma.templateEmail.findUnique({
          where: { id: emailData.templateId }
        })

        if (template) {
          finalSubject = this.processTemplate(template.objet, emailData.variables || {})
          finalHtml = this.processTemplate(template.contenuHtml, emailData.variables || {})
          finalText = template.contenuTexte ? this.processTemplate(template.contenuTexte, emailData.variables || {}) : undefined
        }
      }

      // Ajouter la signature
      if (emailConfig.signatureHtml && finalHtml) {
        finalHtml += `<br><br>${emailConfig.signatureHtml}`
      }

      // Créer le transporteur approprié
      let transporter: nodemailer.Transporter
      if (emailConfig.provider === 'gmail') {
        transporter = await this.createGmailTransporter(emailConfig)
      } else {
        transporter = await this.createSmtpTransporter(emailConfig)
      }

      // Envoyer l'email
      const info = await transporter.sendMail({
        from: `${emailConfig.nom} <${emailConfig.email}>`,
        to: emailData.to,
        subject: finalSubject,
        html: finalHtml,
        text: finalText
      })

      // Enregistrer l'envoi en base
      await prisma.emailEnvoye.create({
        data: {
          configurationEmailId: emailConfig.id,
          templateEmailId: emailData.templateId,
          patientId: emailData.patientId,
          destinataire: emailData.to,
          objet: finalSubject,
          contenuHtml: finalHtml,
          contenuTexte: finalText,
          statut: 'sent',
          dateEnvoi: new Date(),
          messageId: info.messageId,
          typeEnvoi: emailData.type || 'manuel',
          declencheur: emailData.trigger
        }
      })

      return true
    } catch (error) {
      console.error('Erreur envoi email:', error)
      
      // Enregistrer l'échec en base si possible
      try {
        const config = configId 
          ? await prisma.configurationEmail.findUnique({ where: { id: configId } })
          : await prisma.configurationEmail.findFirst({ where: { isActive: true, isDefault: true } })

        if (config) {
          await prisma.emailEnvoye.create({
            data: {
              configurationEmailId: config.id,
              templateEmailId: emailData.templateId,
              patientId: emailData.patientId,
              destinataire: emailData.to,
              objet: emailData.subject,
              contenuHtml: emailData.html,
              contenuTexte: emailData.text,
              statut: 'failed',
              messageErreur: error instanceof Error ? error.message : 'Erreur inconnue',
              typeEnvoi: emailData.type || 'manuel',
              declencheur: emailData.trigger
            }
          })
        }
      } catch (dbError) {
        console.error('Erreur enregistrement échec email:', dbError)
      }

      return false
    }
  }

  /**
   * Traite un template en remplaçant les variables
   */
  private processTemplate(template: string, variables: Record<string, string>): string {
    let processed = template
    
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g')
      processed = processed.replace(regex, value)
    }
    
    return processed
  }

  /**
   * Obtient les templates d'email
   */
  async getEmailTemplates(): Promise<TemplateEmail[]> {
    return await prisma.templateEmail.findMany({
      where: { isActive: true },
      orderBy: { nom: 'asc' }
    })
  }

  /**
   * Crée les templates par défaut
   */
  async createDefaultTemplates(): Promise<void> {
    const defaultTemplates = [
      {
        nom: 'rappel_rdv',
        titre: 'Rappel de rendez-vous',
        objet: 'Rappel: RDV le {{date}} à {{heure}}',
        contenuHtml: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Rappel de rendez-vous</h2>
            <p>Bonjour {{patient}},</p>
            <p>Nous vous rappelons votre rendez-vous :</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <strong>Date :</strong> {{date}}<br>
              <strong>Heure :</strong> {{heure}}<br>
              <strong>Type :</strong> {{type}}<br>
              <strong>Praticien :</strong> {{praticien}}
            </div>
            <p>En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance.</p>
            <p>Cordialement,</p>
          </div>
        `,
        contenuTexte: `Bonjour {{patient}},

Nous vous rappelons votre rendez-vous :
- Date : {{date}}
- Heure : {{heure}}
- Type : {{type}}
- Praticien : {{praticien}}

En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance.

Cordialement,`,
        variables: JSON.stringify(['patient', 'date', 'heure', 'type', 'praticien']),
        categorie: 'rappel',
        description: 'Template pour les rappels de rendez-vous',
        isSysteme: true
      },
      {
        nom: 'ordonnance',
        titre: 'Transmission d\'ordonnance',
        objet: 'Ordonnance - {{patient}}',
        contenuHtml: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Ordonnance</h2>
            <p>Bonjour {{patient}},</p>
            <p>Suite à votre consultation du {{date}}, veuillez trouver votre ordonnance :</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              {{contenu_ordonnance}}
            </div>
            <p><strong>Instructions :</strong></p>
            <ul>
              <li>Respectez scrupuleusement les dosages indiqués</li>
              <li>Prenez les médicaments aux heures indiquées</li>
              <li>En cas d'effet indésirable, contactez-nous immédiatement</li>
            </ul>
            <p>N'hésitez pas à nous contacter pour toute question.</p>
            <p>Cordialement,</p>
          </div>
        `,
        contenuTexte: `Bonjour {{patient}},

Suite à votre consultation du {{date}}, veuillez trouver votre ordonnance :

{{contenu_ordonnance}}

Instructions :
- Respectez scrupuleusement les dosages indiqués
- Prenez les médicaments aux heures indiquées
- En cas d'effet indésirable, contactez-nous immédiatement

N'hésitez pas à nous contacter pour toute question.

Cordialement,`,
        variables: JSON.stringify(['patient', 'date', 'contenu_ordonnance']),
        categorie: 'medical',
        description: 'Template pour l\'envoi d\'ordonnances',
        isSysteme: true
      },
      {
        nom: 'compte_rendu',
        titre: 'Compte-rendu de consultation',
        objet: 'Compte-rendu - {{patient}} - {{date}}',
        contenuHtml: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Compte-rendu de consultation</h2>
            <p>Bonjour {{patient}},</p>
            <p>Voici le compte-rendu de votre consultation du {{date}} :</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Motif de consultation :</h3>
              <p>{{motif}}</p>
              
              <h3>Examen clinique :</h3>
              <p>{{examen}}</p>
              
              <h3>Diagnostic :</h3>
              <p>{{diagnostic}}</p>
              
              <h3>Traitement proposé :</h3>
              <p>{{traitement}}</p>
            </div>
            <p>{{instructions}}</p>
            <p>Prochain rendez-vous : {{prochain_rdv}}</p>
            <p>Cordialement,</p>
          </div>
        `,
        contenuTexte: `Bonjour {{patient}},

Voici le compte-rendu de votre consultation du {{date}} :

Motif de consultation :
{{motif}}

Examen clinique :
{{examen}}

Diagnostic :
{{diagnostic}}

Traitement proposé :
{{traitement}}

{{instructions}}

Prochain rendez-vous : {{prochain_rdv}}

Cordialement,`,
        variables: JSON.stringify(['patient', 'date', 'motif', 'examen', 'diagnostic', 'traitement', 'instructions', 'prochain_rdv']),
        categorie: 'medical',
        description: 'Template pour les comptes-rendus de consultation',
        isSysteme: true
      }
    ]

    for (const template of defaultTemplates) {
      await prisma.templateEmail.upsert({
        where: { nom: template.nom },
        update: template,
        create: template
      })
    }
  }
}

// Export singleton
export const emailService = new EmailService()