import { useState, useEffect } from 'react'
import { useCreateTraitement, useUpdateTraitement } from '@/hooks/useTraitements'
import { usePatients } from '@/hooks/usePatients'
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
import { Traitement } from '@/lib/api'
import type { CreateTraitementInput } from '../../app/types'

interface TreatmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  traitement?: Traitement | null
  onSuccess?: () => void
}

interface FormData {
  patientId: string
  type: string
  dents: string
  statut: 'planifie' | 'en_cours' | 'termine' | 'suspendu'
  dateDebut: string
  dateFin: string
  cout: string
  notes: string
}

const initialFormData: FormData = {
  patientId: '',
  type: '',
  dents: '',
  statut: 'planifie',
  dateDebut: '',
  dateFin: '',
  cout: '',
  notes: '',
}

const typesDeTreatment = [
  'Consultation',
  'Détartrage',
  'Carie simple',
  'Carie complexe',
  'Couronne',
  'Bridge',
  'Implant',
  'Extraction',
  'Orthodontie',
  'Blanchiment',
  'Prothèse',
  'Endodontie',
  'Chirurgie',
  'Autre'
]

const statutOptions = [
  { value: 'planifie', label: 'Planifié' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'termine', label: 'Terminé' },
  { value: 'suspendu', label: 'Suspendu' },
]

export default function TreatmentForm({ 
  open, 
  onOpenChange, 
  traitement, 
  onSuccess 
}: TreatmentFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const createTraitementMutation = useCreateTraitement()
  const updateTraitementMutation = useUpdateTraitement()
  const { data: patientsData } = usePatients({ limit: 100 })

  const isEditing = !!traitement
  const isLoading = createTraitementMutation.isPending || updateTraitementMutation.isPending
  const patients = patientsData?.data || []

  useEffect(() => {
    if (traitement) {
      setFormData({
        patientId: traitement.patientId || '',
        type: traitement.type || '',
        dents: traitement.dents || '',
        statut: traitement.statut,
        dateDebut: traitement.dateDebut ? 
          new Date(traitement.dateDebut).toISOString().split('T')[0] : '',
        dateFin: traitement.dateFin ? 
          new Date(traitement.dateFin).toISOString().split('T')[0] : '',
        cout: traitement.cout ? traitement.cout.toString() : '',
        notes: traitement.notes || '',
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [traitement, open])

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

    if (!formData.patientId) {
      newErrors.patientId = 'Le patient est requis'
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Le type de traitement est requis'
    }

    if (formData.cout && (isNaN(Number(formData.cout)) || Number(formData.cout) < 0)) {
      newErrors.cout = 'Le coût doit être un nombre positif'
    }

    if (formData.dateDebut && formData.dateFin && 
        new Date(formData.dateDebut) > new Date(formData.dateFin)) {
      newErrors.dateFin = 'La date de fin doit être après la date de début'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData: CreateTraitementInput = {
      patientId: formData.patientId,
      type: formData.type.trim(),
      dents: formData.dents.trim() || undefined,
      statut: formData.statut,
      dateDebut: formData.dateDebut || undefined,
      dateFin: formData.dateFin || undefined,
      cout: formData.cout ? Number(formData.cout) : undefined,
      notes: formData.notes.trim() || undefined,
    }

    try {
      if (isEditing && traitement) {
        await updateTraitementMutation.mutateAsync({
          id: traitement.id,
          data: submitData
        })
      } else {
        await createTraitementMutation.mutateAsync(submitData)
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
            {isEditing ? 'Modifier le traitement' : 'Nouveau traitement'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations du traitement' 
              : 'Ajoutez un nouveau traitement au système'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient *</Label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.patientId ? 'border-red-500' : ''}`}
                disabled={isLoading}
              >
                <option value="">Sélectionnez un patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.prenom} {patient.nom}
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <p className="text-sm text-red-600">{errors.patientId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de traitement *</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.type ? 'border-red-500' : ''}`}
                disabled={isLoading}
              >
                <option value="">Sélectionnez un type</option>
                {typesDeTreatment.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dents">Dents concernées</Label>
              <Input
                id="dents"
                name="dents"
                value={formData.dents}
                onChange={handleChange}
                placeholder="Ex: 16, 17 ou 11-21"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <select
                id="statut"
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                disabled={isLoading}
              >
                {statutOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateDebut">Date de début</Label>
              <Input
                id="dateDebut"
                name="dateDebut"
                type="date"
                value={formData.dateDebut}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFin">Date de fin</Label>
              <Input
                id="dateFin"
                name="dateFin"
                type="date"
                value={formData.dateFin}
                onChange={handleChange}
                className={errors.dateFin ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.dateFin && (
                <p className="text-sm text-red-600">{errors.dateFin}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cout">Coût (€)</Label>
            <Input
              id="cout"
              name="cout"
              type="number"
              min="0"
              step="0.01"
              value={formData.cout}
              onChange={handleChange}
              placeholder="0.00"
              className={errors.cout ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.cout && (
              <p className="text-sm text-red-600">{errors.cout}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notes sur le traitement, observations, complications..."
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