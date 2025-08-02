import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, type FileAttente } from '@/lib/api'
import type { CreateFileAttenteInput, UpdateFileAttenteInput } from '../../app/types'
import { toast } from 'sonner'

export function useQueue(params?: {
  page?: number
  limit?: number
  search?: string
  type?: string
  statut?: string
  priorite?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: ['queue', params],
    queryFn: () => apiClient.getQueue(params),
  })
}

export function useQueueItem(id: string) {
  return useQuery({
    queryKey: ['queue', id],
    queryFn: () => apiClient.getQueueItem(id),
    enabled: !!id,
  })
}

export function useAddToQueue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFileAttenteInput) => apiClient.addToQueue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      toast.success('Patient ajouté à la file d\'attente')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'ajout: ${error.message}`)
    },
  })
}

export function useUpdateQueueItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFileAttenteInput }) =>
      apiClient.updateQueueItem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      queryClient.invalidateQueries({ queryKey: ['queue', id] })
      toast.success('File d\'attente mise à jour')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`)
    },
  })
}

export function useRemoveFromQueue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.removeFromQueue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      toast.success('Patient retiré de la file d\'attente')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`)
    },
  })
}