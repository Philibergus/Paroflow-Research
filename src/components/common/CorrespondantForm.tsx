import { useState, useEffect } from 'react'
import { useCreateCorrespondant, useUpdateCorrespondant } from '@/hooks/useCorrespondants'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Correspondant } from '@/lib/api'
import type { CreateCorrespondantInput } from '../../app/types'

interface CorrespondantFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  correspondant?: Correspondant | null
  onSuccess?: () => void
}

interface FormData {
  nom: string
  specialite: string
  email: string
  telephone: string
  adresse: string
  notes: string
}

const initialFormData: FormData = {
  nom: '',
  specialite: '',
  email: '',
  telephone: '',
  adresse: '',
  notes: '',
}

const specialites = [
  'Orthodontie',
  'Chirurgie orale',
  'Parodontologie',
  'Endodontie',
  'Implantologie',
  'Chirurgie maxillo-faciale',
  'Médecine générale',
  'ORL',
  'Rhumatologie',
  'Cardiologie',
  'Autre'
]

export default function CorrespondantForm({ 
  open, 
  onOpenChange, 
  correspondant, 
  onSuccess 
}: CorrespondantFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const createCorrespondantMutation = useCreateCorrespondant()
  const updateCorrespondantMutation = useUpdateCorrespondant()

  const isEditing = !!correspondant
  const isLoading = createCorrespondantMutation.isPending || updateCorrespondantMutation.isPending

  useEffect(() => {
    if (correspondant) {
      setFormData({
        nom: correspondant.nom || '',
        specialite: correspondant.specialite || '',
        email: correspondant.email || '',
        telephone: correspondant.telephone || '',
        adresse: correspondant.adresse || '',
        notes: correspondant.notes || '',
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [correspondant, open])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    }

    if (!formData.specialite.trim()) {
      newErrors.specialite = 'La spécialité est requise'
    }

    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Format d\'email invalide'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData: CreateCorrespondantInput = {
      nom: formData.nom.trim(),
      specialite: formData.specialite.trim(),
      email: formData.email.trim() || undefined,
      telephone: formData.telephone.trim() || undefined,
      adresse: formData.adresse.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    }

    try {
      if (isEditing && correspondant) {
        await updateCorrespondantMutation.mutateAsync({
          id: correspondant.id,
          data: submitData
        })
      } else {
        await createCorrespondantMutation.mutateAsync(submitData)
      }
      
      onSuccess?.()
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error('Form submission error:', error)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le correspondant' : 'Nouveau correspondant'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations du correspondant médical' 
              : 'Ajoutez un nouveau correspondant médical au système'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom / Cabinet *</Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Dr. Martin ou Cabinet Dentaire ABC"
                className={errors.nom ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.nom && (
                <p className="text-sm text-red-600">{errors.nom}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialite">Spécialité *</Label>
              <select
                id="specialite"
                name="specialite"
                value={formData.specialite}
                onChange={handleChange}
                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.specialite ? 'border-red-500' : ''}`}
                disabled={isLoading}
              >
                <option value="">Sélectionnez une spécialité</option>
                {specialites.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {errors.specialite && (
                <p className="text-sm text-red-600">{errors.specialite}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                value={formData.telephone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse du cabinet</Label>
            <Input
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="123 Rue de la Santé, 75014 Paris"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Informations sur la collaboration, spécialités particulières, horaires..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Modification...' : 'Création...'}
                </>
              ) : (
                isEditing ? 'Modifier' : 'Créer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}