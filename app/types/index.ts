import { z } from 'zod'

// Patient schemas
export const createPatientSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  telephone: z.string().optional(),
  dateNaissance: z.string().or(z.date()).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ),
  adresse: z.string().optional(),
  numeroSecurite: z.string().optional(),
  notes: z.string().optional(),
})

export const updatePatientSchema = createPatientSchema.partial()

export type CreatePatientInput = z.infer<typeof createPatientSchema>
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>

// Correspondant schemas
export const createCorrespondantSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  specialite: z.string().min(1, 'La spécialité est requise'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  notes: z.string().optional(),
})

export const updateCorrespondantSchema = createCorrespondantSchema.partial()

export type CreateCorrespondantInput = z.infer<typeof createCorrespondantSchema>
export type UpdateCorrespondantInput = z.infer<typeof updateCorrespondantSchema>

// Traitement schemas
export const traitementStatuts = ['planifie', 'en_cours', 'termine', 'suspendu'] as const
export const etapeStatuts = ['planifie', 'termine', 'reporte'] as const

export const createTraitementSchema = z.object({
  patientId: z.string().cuid('ID patient invalide'),
  type: z.string().min(1, 'Le type de traitement est requis'),
  dents: z.string().optional(),
  statut: z.enum(traitementStatuts).default('planifie'),
  dateDebut: z.string().or(z.date()).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ).optional(),
  dateFin: z.string().or(z.date()).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ).optional(),
  cout: z.number().positive('Le coût doit être positif').optional(),
  notes: z.string().optional(),
})

export const updateTraitementSchema = createTraitementSchema.partial()

export type CreateTraitementInput = z.infer<typeof createTraitementSchema>
export type UpdateTraitementInput = z.infer<typeof updateTraitementSchema>

// Dental Chart schemas
export const dentStatuts = ['present', 'extracted', 'implant', 'crown', 'filling', 'missing'] as const
export const dentEtats = ['healthy', 'caries', 'restoration', 'inflammation', 'infection'] as const

export const createCharteDentaireSchema = z.object({
  patientId: z.string().cuid('ID patient invalide'),
  traitementId: z.string().cuid('ID traitement invalide').optional(),
  numeroDent: z.number().int().min(1).max(48, 'Numéro de dent invalide'),
  statut: z.enum(dentStatuts),
  etat: z.enum(dentEtats).optional(),
  notes: z.string().optional(),
  couleur: z.string().optional(),
})

export const updateCharteDentaireSchema = createCharteDentaireSchema.partial()

export type CreateCharteDentaireInput = z.infer<typeof createCharteDentaireSchema>
export type UpdateCharteDentaireInput = z.infer<typeof updateCharteDentaireSchema>

// Scenario Type schemas
export const scenarioNoms = [
  'wisdom_extraction',
  'periodontal_nonsurgical', 
  'periodontal_surgical',
  'periimplantitis_treatment',
  'standard_implant'
] as const

export const createScenarioTypeSchema = z.object({
  nom: z.enum(scenarioNoms),
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  etapesTemplate: z.record(z.unknown()), // JSON object
  dureeEstimee: z.number().int().positive('La durée doit être positive').optional(),
  isActive: z.boolean().default(true),
})

export const updateScenarioTypeSchema = createScenarioTypeSchema.partial()

export type CreateScenarioTypeInput = z.infer<typeof createScenarioTypeSchema>
export type UpdateScenarioTypeInput = z.infer<typeof updateScenarioTypeSchema>

// File Attente schemas
export const fileAttenteTypes = ['periodontal', 'implant', 'followup', 'emergency'] as const
export const fileAttenteStatuts = ['waiting', 'in_progress', 'completed', 'cancelled'] as const

export const createFileAttenteSchema = z.object({
  patientId: z.string().cuid('ID patient invalide'),
  type: z.enum(fileAttenteTypes),
  priorite: z.number().int().min(1).max(4, 'Priorité doit être entre 1 et 4').default(1),
  statut: z.enum(fileAttenteStatuts).default('waiting'),
  notes: z.string().optional(),
})

export const updateFileAttenteSchema = createFileAttenteSchema.partial()

export type CreateFileAttenteInput = z.infer<typeof createFileAttenteSchema>
export type UpdateFileAttenteInput = z.infer<typeof updateFileAttenteSchema>

// Document Patient schemas
export const documentTypes = ['report', 'estimate', 'xray', 'photo', 'correspondence'] as const

export const createDocumentPatientSchema = z.object({
  patientId: z.string().cuid('ID patient invalide'),
  type: z.enum(documentTypes),
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  cheminFichier: z.string().min(1, 'Le chemin du fichier est requis'),
  mimeType: z.string().optional(),
  tailleFichier: z.number().int().positive().optional(),
  dateDocument: z.string().or(z.date()).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ).optional(),
  tags: z.string().optional(),
  isVisible: z.boolean().default(true),
})

export const updateDocumentPatientSchema = createDocumentPatientSchema.partial()

export type CreateDocumentPatientInput = z.infer<typeof createDocumentPatientSchema>
export type UpdateDocumentPatientInput = z.infer<typeof updateDocumentPatientSchema>

// Etape Traitement schemas
export const createEtapeTraitementSchema = z.object({
  traitementId: z.string().cuid('ID traitement invalide'),
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  date: z.string().or(z.date()).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ),
  statut: z.enum(etapeStatuts).default('planifie'),
  duree: z.number().int().positive('La durée doit être positive').optional(),
  cout: z.number().positive('Le coût doit être positif').optional(),
  notes: z.string().optional(),
})

export const updateEtapeTraitementSchema = createEtapeTraitementSchema.partial()

export type CreateEtapeTraitementInput = z.infer<typeof createEtapeTraitementSchema>
export type UpdateEtapeTraitementInput = z.infer<typeof updateEtapeTraitementSchema>

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Common query parameters
export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default('10'),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type PaginationQuery = z.infer<typeof paginationSchema>