/**
 * TYPES PARTAGÉS PAROFLOW
 * Types unifiés pour frontend et backend
 * Basés sur le schéma Prisma et les validations Zod
 */

// ========================================
// ENTITÉS PRINCIPALES
// ========================================

export interface Patient {
  id: string
  nom: string
  prenom: string
  email?: string | null
  telephone?: string | null
  dateNaissance: string
  adresse?: string | null
  numeroSecurite?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  
  // Relations (optionnelles selon le contexte)
  traitements?: Traitement[]
  rendezVous?: RendezVous[]
  chartesDentaires?: CharteDentaire[]
  documentsPatient?: DocumentPatient[]
  filesAttente?: FileAttente[]
  _count?: { traitements: number }
}

export interface Correspondant {
  id: string
  nom: string
  specialite: string
  email?: string | null
  telephone?: string | null
  adresse?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface Traitement {
  id: string
  patientId: string
  type: string
  dents?: string | null
  statut: 'planifie' | 'en_cours' | 'termine' | 'suspendu'
  dateDebut?: string | null
  dateFin?: string | null
  cout?: number | null
  notes?: string | null
  scenariotype?: string | null
  scenarioEtapeCourante?: string | null
  createdAt: string
  updatedAt: string
  
  // Relations
  patient?: Patient
  etapes?: EtapeTraitement[]
  chartesDentaires?: CharteDentaire[]
}

export interface EtapeTraitement {
  id: string
  traitementId: string
  titre: string
  description?: string | null
  date: string
  statut: 'planifie' | 'termine' | 'reporte'
  duree?: number | null
  cout?: number | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  
  // Relations
  traitement?: Traitement
}

export interface RendezVous {
  id: string
  patientId: string
  titre: string
  description?: string | null
  dateHeure: string
  duree: number
  statut: 'planifie' | 'confirme' | 'annule' | 'termine'
  type: 'consultation' | 'chirurgie' | 'controle' | 'urgence'
  salle?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  
  // Relations
  patient?: Patient
}

export interface CharteDentaire {
  id: string
  patientId: string
  traitementId?: string | null
  numeroDent: number
  statut: 'present' | 'extracted' | 'implant' | 'crown' | 'filling' | 'missing'
  etat?: 'healthy' | 'caries' | 'restoration' | 'inflammation' | 'infection' | null
  notes?: string | null
  couleur?: string | null
  dateModification: string
  createdAt: string
  updatedAt: string
  
  // Relations
  patient?: Patient
  traitement?: Traitement
}

export interface ScenarioType {
  id: string
  nom: 'wisdom_extraction' | 'periodontal_nonsurgical' | 'periodontal_surgical' | 'periimplantitis_treatment' | 'standard_implant'
  titre: string
  description?: string | null
  etapesTemplate: Record<string, unknown>
  dureeEstimee?: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface FileAttente {
  id: string
  patientId: string
  type: 'periodontal' | 'implant' | 'followup' | 'emergency'
  priorite: number
  statut: 'waiting' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string | null
  dateAjout: string
  dateDebut?: string | null
  dateFin?: string | null
  createdAt: string
  updatedAt: string
  
  // Relations
  patient?: Patient
}

export interface DocumentPatient {
  id: string
  patientId: string
  type: 'report' | 'estimate' | 'xray' | 'photo' | 'correspondence'
  titre: string
  description?: string | null
  cheminFichier: string
  mimeType?: string | null
  tailleFichier?: number | null
  dateDocument?: string | null
  tags?: string | null
  isVisible: boolean
  createdAt: string
  updatedAt: string
  
  // Relations
  patient?: Patient
}

// ========================================
// TYPES POUR LES FORMULAIRES (INPUT)
// ========================================

export interface CreatePatientInput {
  nom: string
  prenom: string
  email?: string
  telephone?: string
  dateNaissance: string | Date
  adresse?: string
  numeroSecurite?: string
  notes?: string
}

export interface UpdatePatientInput extends Partial<CreatePatientInput> {}

export interface CreateCorrespondantInput {
  nom: string
  specialite: string
  email?: string
  telephone?: string
  adresse?: string
  notes?: string
}

export interface UpdateCorrespondantInput extends Partial<CreateCorrespondantInput> {}

export interface CreateTraitementInput {
  patientId: string
  type: string
  dents?: string
  statut?: 'planifie' | 'en_cours' | 'termine' | 'suspendu'
  dateDebut?: string | Date
  dateFin?: string | Date
  cout?: number
  notes?: string
  scenariotype?: string
  scenarioEtapeCourante?: string
}

export interface UpdateTraitementInput extends Partial<CreateTraitementInput> {}

export interface CreateEtapeTraitementInput {
  traitementId: string
  titre: string
  description?: string
  date: string | Date
  statut?: 'planifie' | 'termine' | 'reporte'
  duree?: number
  cout?: number
  notes?: string
}

export interface UpdateEtapeTraitementInput extends Partial<CreateEtapeTraitementInput> {}

export interface CreateCharteDentaireInput {
  patientId: string
  traitementId?: string
  numeroDent: number
  statut: 'present' | 'extracted' | 'implant' | 'crown' | 'filling' | 'missing'
  etat?: 'healthy' | 'caries' | 'restoration' | 'inflammation' | 'infection'
  notes?: string
  couleur?: string
}

export interface UpdateCharteDentaireInput extends Partial<CreateCharteDentaireInput> {}

export interface CreateFileAttenteInput {
  patientId: string
  type: 'periodontal' | 'implant' | 'followup' | 'emergency'
  priorite?: number
  statut?: 'waiting' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
}

export interface UpdateFileAttenteInput extends Partial<CreateFileAttenteInput> {}

// ========================================
// TYPES POUR LES RÉPONSES API
// ========================================

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

// ========================================
// TYPES POUR LES REQUÊTES
// ========================================

export interface PaginationQuery {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PatientQuery extends PaginationQuery {
  // Queries spécifiques aux patients si nécessaire
}

export interface CorrespondantQuery extends PaginationQuery {
  // Queries spécifiques aux correspondants si nécessaire
}

export interface TraitementQuery extends PaginationQuery {
  patientId?: string
  statut?: string
}

export interface FileAttenteQuery extends PaginationQuery {
  type?: string
  statut?: string
  priorite?: number
}

export interface CharteDentaireQuery extends PaginationQuery {
  patientId?: string
  traitementId?: string
}

// ========================================
// CONSTANTES PARTAGÉES
// ========================================

export const TRAITEMENT_STATUTS = ['planifie', 'en_cours', 'termine', 'suspendu'] as const
export const ETAPE_STATUTS = ['planifie', 'termine', 'reporte'] as const
export const RENDEZ_VOUS_STATUTS = ['planifie', 'confirme', 'annule', 'termine'] as const
export const RENDEZ_VOUS_TYPES = ['consultation', 'chirurgie', 'controle', 'urgence'] as const
export const DENT_STATUTS = ['present', 'extracted', 'implant', 'crown', 'filling', 'missing'] as const
export const DENT_ETATS = ['healthy', 'caries', 'restoration', 'inflammation', 'infection'] as const
export const FILE_ATTENTE_TYPES = ['periodontal', 'implant', 'followup', 'emergency'] as const
export const FILE_ATTENTE_STATUTS = ['waiting', 'in_progress', 'completed', 'cancelled'] as const
export const DOCUMENT_TYPES = ['report', 'estimate', 'xray', 'photo', 'correspondence'] as const
export const SCENARIO_NOMS = [
  'wisdom_extraction',
  'periodontal_nonsurgical', 
  'periodontal_surgical',
  'periimplantitis_treatment',
  'standard_implant'
] as const

// ========================================
// TYPES UTILITAIRES
// ========================================

export type TraitementStatut = typeof TRAITEMENT_STATUTS[number]
export type EtapeStatut = typeof ETAPE_STATUTS[number]
export type RendezVousStatut = typeof RENDEZ_VOUS_STATUTS[number]
export type RendezVousType = typeof RENDEZ_VOUS_TYPES[number]
export type DentStatut = typeof DENT_STATUTS[number]
export type DentEtat = typeof DENT_ETATS[number]
export type FileAttenteType = typeof FILE_ATTENTE_TYPES[number]
export type FileAttenteStatut = typeof FILE_ATTENTE_STATUTS[number]
export type DocumentType = typeof DOCUMENT_TYPES[number]
export type ScenarioNom = typeof SCENARIO_NOMS[number]

// ========================================
// INTERFACES COMPOSÉES POUR L'UI
// ========================================

export interface PatientWithStats extends Patient {
  stats?: {
    totalTraitements: number
    traitements: {
      planifies: number
      enCours: number
      termines: number
      suspendus: number
    }
    prochainRdv?: RendezVous
    dernierTraitement?: Traitement
  }
}

export interface TraitementWithDetails extends Traitement {
  patient: Patient
  etapes: EtapeTraitement[]
  chartesDentaires: CharteDentaire[]
}

export interface FileAttenteWithPatient extends FileAttente {
  patient: Patient
}

// ========================================
// TYPES POUR LES STATISTIQUES/ANALYTICS
// ========================================

export interface DashboardStats {
  patients: {
    total: number
    nouveaux: number
    actifs: number
  }
  traitements: {
    total: number
    planifies: number
    enCours: number
    termines: number
  }
  rendezVous: {
    aujourd_hui: number
    semaine: number
    mois: number
  }
  fileAttente: {
    total: number
    urgents: number
    parType: Record<FileAttenteType, number>
  }
}

export interface PerformanceStats {
  tempsMoyen: {
    consultation: number
    traitement: number
    intervention: number
  }
  productivite: {
    patientsParJour: number
    revenusParJour: number
    tauxRemplissage: number
  }
}