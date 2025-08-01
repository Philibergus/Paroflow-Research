import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, type Correspondant } from '@/lib/api'
import type { CreateCorrespondantInput, UpdateCorrespondantInput } from '../../app/types'
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
    queryFn: () => apiClient.getCorrespondants(params),
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