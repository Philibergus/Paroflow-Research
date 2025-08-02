import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, type Patient } from '@/lib/api'
import type { CreatePatientInput, UpdatePatientInput } from '../../lib/shared-types'
import { toast } from 'sonner'

export function usePatients(params?: {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: async () => {
      try {
        return await apiClient.getPatients(params)
      } catch (error) {
        // Mode dégradé avec données mock en cas d'erreur backend
        console.warn('Backend indisponible, utilisation de données mock pour les patients')
        return {
          data: [
            {
              id: 'mock-1',
              nom: 'Dupont',
              prenom: 'Jean',
              email: 'jean.dupont@email.com',
              telephone: '01 23 45 67 89',
              dateNaissance: '1980-05-15',
              numeroSecurite: '1234567890123',
              notes: 'Patient mock pour test',
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

export function usePatient(id: string) {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => apiClient.getPatient(id),
    enabled: !!id,
  })
}

export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePatientInput) => apiClient.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      toast.success('Patient créé avec succès')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création: ${error.message}`)
    },
  })
}

export function useUpdatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePatientInput }) =>
      apiClient.updatePatient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['patients', id] })
      toast.success('Patient mis à jour avec succès')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`)
    },
  })
}

export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      toast.success('Patient supprimé avec succès')
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`)
    },
  })
}