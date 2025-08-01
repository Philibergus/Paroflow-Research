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