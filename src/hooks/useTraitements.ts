import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, type Traitement, type EtapeTraitement } from '@/lib/api'
import type { CreateTraitementInput, UpdateTraitementInput, CreateEtapeTraitementInput } from '../../lib/shared-types'
import { toast } from 'sonner'

export function useTraitements(params?: {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  patientId?: string
}) {
  return useQuery({
    queryKey: ['traitements', params],
    queryFn: async () => {
      try {
        return await apiClient.getTraitements(params)
      } catch (error) {
        // Mode dégradé avec données mock en cas d'erreur backend
        console.warn('Backend indisponible, utilisation de données mock pour les traitements')
        return {
          data: [
            {
              id: 'mock-trait-1',
              type: 'Consultation',
              statut: 'En cours',
              dents: '11, 12',
              patient: {
                id: 'mock-1',
                nom: 'Dupont',
                prenom: 'Jean',
              },
              patientId: 'mock-1',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
          }
        }
      }
    },
  })
}

export function useTraitement(id: string) {
  return useQuery({
    queryKey: ['traitements', id],
    queryFn: () => apiClient.getTraitement(id),
    enabled: !!id,
  })
}

export function useCreateTraitement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTraitementInput) => apiClient.createTraitement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traitements'] })
      toast.success('Traitement créé avec succès')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création: ${error.message}`)
    },
  })
}

export function useUpdateTraitement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTraitementInput }) =>
      apiClient.updateTraitement(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['traitements'] })
      queryClient.invalidateQueries({ queryKey: ['traitements', id] })
      toast.success('Traitement mis à jour avec succès')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`)
    },
  })
}

export function useDeleteTraitement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteTraitement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traitements'] })
      toast.success('Traitement supprimé avec succès')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`)
    },
  })
}

export function useTraitementEtapes(traitementId: string) {
  return useQuery({
    queryKey: ['traitements', traitementId, 'etapes'],
    queryFn: () => apiClient.getTraitementEtapes(traitementId),
    enabled: !!traitementId,
  })
}

export function useCreateTraitementEtape() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEtapeTraitementInput) => apiClient.createTraitementEtape(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['traitements', data.traitementId, 'etapes'] })
      toast.success('Étape créée avec succès')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création: ${error.message}`)
    },
  })
}