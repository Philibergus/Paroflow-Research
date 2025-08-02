import type { 
  CreatePatientInput, 
  UpdatePatientInput, 
  CreateCorrespondantInput, 
  UpdateCorrespondantInput,
  CreateTraitementInput,
  UpdateTraitementInput,
  CreateEtapeTraitementInput,
  CreateCharteDentaireInput,
  UpdateCharteDentaireInput,
  CreateFileAttenteInput,
  UpdateFileAttenteInput,
  ApiResponse,
  PaginatedResponse 
} from '../../app/types'

const API_BASE = '/api'

export interface Patient {
  id: string
  nom: string
  prenom: string
  email?: string
  telephone?: string
  dateNaissance: string
  adresse?: string
  numeroSecurite?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Correspondant {
  id: string
  nom: string
  specialite: string
  email?: string
  telephone?: string
  adresse?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Traitement {
  id: string
  patientId: string
  patient?: Patient
  type: string
  dents?: string
  statut: 'planifie' | 'en_cours' | 'termine' | 'suspendu'
  dateDebut?: string
  dateFin?: string
  cout?: number
  notes?: string
  createdAt: string
  updatedAt: string
  etapes?: EtapeTraitement[]
}

export interface EtapeTraitement {
  id: string
  traitementId: string
  titre: string
  description?: string
  date: string
  statut: 'planifie' | 'termine' | 'reporte'
  duree?: number
  cout?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CharteDentaire {
  id: string
  patientId: string
  traitementId?: string
  numeroDent: number
  statut: 'present' | 'extracted' | 'implant' | 'crown' | 'filling' | 'missing'
  etat?: 'healthy' | 'caries' | 'restoration' | 'inflammation' | 'infection'
  notes?: string
  couleur?: string
  dateModification: string
  createdAt: string
  updatedAt: string
  patient?: Patient
  traitement?: Traitement
}

export interface FileAttente {
  id: string
  patientId: string
  type: 'periodontal' | 'implant' | 'followup' | 'emergency'
  priorite: number
  statut: 'waiting' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  dateAjout: string
  dateDebut?: string
  dateFin?: string
  createdAt: string
  updatedAt: string
  patient?: Patient
}

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Patients
  async getPatients(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<Patient>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)
    
    const query = searchParams.toString()
    return this.request<PaginatedResponse<Patient>>(`/patients${query ? `?${query}` : ''}`)
  }

  async getPatient(id: string): Promise<ApiResponse<Patient>> {
    return this.request<ApiResponse<Patient>>(`/patients/${id}`)
  }

  async createPatient(data: CreatePatientInput): Promise<ApiResponse<Patient>> {
    return this.request<ApiResponse<Patient>>('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePatient(id: string, data: UpdatePatientInput): Promise<ApiResponse<Patient>> {
    return this.request<ApiResponse<Patient>>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deletePatient(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/patients/${id}`, {
      method: 'DELETE',
    })
  }

  // Correspondants
  async getCorrespondants(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<Correspondant>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)
    
    const query = searchParams.toString()
    return this.request<PaginatedResponse<Correspondant>>(`/correspondants${query ? `?${query}` : ''}`)
  }

  async getCorrespondant(id: string): Promise<ApiResponse<Correspondant>> {
    return this.request<ApiResponse<Correspondant>>(`/correspondants/${id}`)
  }

  async createCorrespondant(data: CreateCorrespondantInput): Promise<ApiResponse<Correspondant>> {
    return this.request<ApiResponse<Correspondant>>('/correspondants', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCorrespondant(id: string, data: UpdateCorrespondantInput): Promise<ApiResponse<Correspondant>> {
    return this.request<ApiResponse<Correspondant>>(`/correspondants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteCorrespondant(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/correspondants/${id}`, {
      method: 'DELETE',
    })
  }

  // Traitements
  async getTraitements(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    patientId?: string
  }): Promise<PaginatedResponse<Traitement>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)
    if (params?.patientId) searchParams.append('patientId', params.patientId)
    
    const query = searchParams.toString()
    return this.request<PaginatedResponse<Traitement>>(`/traitements${query ? `?${query}` : ''}`)
  }

  async getTraitement(id: string): Promise<ApiResponse<Traitement>> {
    return this.request<ApiResponse<Traitement>>(`/traitements/${id}`)
  }

  async createTraitement(data: CreateTraitementInput): Promise<ApiResponse<Traitement>> {
    return this.request<ApiResponse<Traitement>>('/traitements', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTraitement(id: string, data: UpdateTraitementInput): Promise<ApiResponse<Traitement>> {
    return this.request<ApiResponse<Traitement>>(`/traitements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTraitement(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/traitements/${id}`, {
      method: 'DELETE',
    })
  }

  async getTraitementEtapes(traitementId: string): Promise<ApiResponse<EtapeTraitement[]>> {
    return this.request<ApiResponse<EtapeTraitement[]>>(`/traitements/${traitementId}/etapes`)
  }

  async createTraitementEtape(data: CreateEtapeTraitementInput): Promise<ApiResponse<EtapeTraitement>> {
    return this.request<ApiResponse<EtapeTraitement>>(`/traitements/${data.traitementId}/etapes`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Dental Charts
  async getDentalCharts(params?: {
    page?: number
    limit?: number
    patientId?: string
    traitementId?: string
  }): Promise<PaginatedResponse<CharteDentaire>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.patientId) searchParams.append('patientId', params.patientId)
    if (params?.traitementId) searchParams.append('traitementId', params.traitementId)
    
    const query = searchParams.toString()
    return this.request<PaginatedResponse<CharteDentaire>>(`/chartes-dentaires${query ? `?${query}` : ''}`)
  }

  async getDentalChart(id: string): Promise<ApiResponse<CharteDentaire>> {
    return this.request<ApiResponse<CharteDentaire>>(`/chartes-dentaires/${id}`)
  }

  async createDentalChart(data: CreateCharteDentaireInput): Promise<ApiResponse<CharteDentaire>> {
    return this.request<ApiResponse<CharteDentaire>>('/chartes-dentaires', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateDentalChart(id: string, data: UpdateCharteDentaireInput): Promise<ApiResponse<CharteDentaire>> {
    return this.request<ApiResponse<CharteDentaire>>(`/chartes-dentaires/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteDentalChart(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/chartes-dentaires/${id}`, {
      method: 'DELETE',
    })
  }

  // Queue Management
  async getQueue(params?: {
    page?: number
    limit?: number
    search?: string
    type?: string
    statut?: string
    priorite?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<FileAttente>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.type) searchParams.append('type', params.type)
    if (params?.statut) searchParams.append('statut', params.statut)
    if (params?.priorite) searchParams.append('priorite', params.priorite.toString())
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)
    
    const query = searchParams.toString()
    return this.request<PaginatedResponse<FileAttente>>(`/file-attente${query ? `?${query}` : ''}`)
  }

  async getQueueItem(id: string): Promise<ApiResponse<FileAttente>> {
    return this.request<ApiResponse<FileAttente>>(`/file-attente/${id}`)
  }

  async addToQueue(data: CreateFileAttenteInput): Promise<ApiResponse<FileAttente>> {
    return this.request<ApiResponse<FileAttente>>('/file-attente', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateQueueItem(id: string, data: UpdateFileAttenteInput): Promise<ApiResponse<FileAttente>> {
    return this.request<ApiResponse<FileAttente>>(`/file-attente/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async removeFromQueue(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/file-attente/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()