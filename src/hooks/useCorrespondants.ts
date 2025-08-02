import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, type Correspondant } from '@/lib/api'
import type { CreateCorrespondantInput, UpdateCorrespondantInput } from '../../lib/shared-types'
import { toast } from 'sonner'

export function useCorrespondants(params?: {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: ['correspondants', params],
    queryFn: async () => {
      try {
        return await apiClient.getCorrespondants(params)
      } catch (error) {
        // Mode dégradé avec données mock en cas d'erreur backend
        console.warn('Backend indisponible, utilisation de données mock pour les correspondants')
        return {
          data: [
            {
              id: 'mock-corresp-1',
              nom: 'Dr. Martin',
              prenom: 'Sophie',
              specialite: 'Orthodontie',
              telephone: '01 98 76 54 32',
              email: 'dr.martin@exemple.com',
              adresse: '123 Rue de la Santé, 75014 Paris',
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

export function useCorrespondant(id: string) {
  return useQuery({
    queryKey: ['correspondants', id],
    queryFn: () => apiClient.getCorrespondant(id),
    enabled: !!id,
  })
}

export function useCreateCorrespondant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCorrespondantInput) => apiClient.createCorrespondant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['correspondants'] })
      toast.success('Correspondant créé avec succès')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création: ${error.message}`)
    },
  })
}

export function useUpdateCorrespondant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCorrespondantInput }) =>
      apiClient.updateCorrespondant(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['correspondants'] })
      queryClient.invalidateQueries({ queryKey: ['correspondants', id] })
      toast.success('Correspondant mis à jour avec succès')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`)
    },
  })
}

export function useDeleteCorrespondant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteCorrespondant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['correspondants'] })
      toast.success('Correspondant supprimé avec succès')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`)
    },
  })
}