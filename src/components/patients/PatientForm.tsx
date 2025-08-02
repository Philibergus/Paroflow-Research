import { useState, useEffect } from 'react'
import { useCreatePatient, useUpdatePatient } from '@/hooks/usePatients'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Patient } from '@/lib/api'
import type { CreatePatientInput } from '../../../lib/shared-types'
import { OCRUploadZone } from '@/components/common'

interface PatientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient?: Patient | null
  onSuccess?: () => void
}

interface FormData {
  nom: string
  prenom: string
  email: string
  telephone: string
  dateNaissance: string
  adresse: string
  numeroSecurite: string
  notes: string
}

const initialFormData: FormData = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  dateNaissance: '',
  adresse: '',
  numeroSecurite: '',
  notes: '',
}

export default function PatientForm({ 
  open, 
  onOpenChange, 
  patient, 
  onSuccess 
}: PatientFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const createPatientMutation = useCreatePatient()
  const updatePatientMutation = useUpdatePatient()

  const isEditing = !!patient
  const isLoading = createPatientMutation.isPending || updatePatientMutation.isPending

  useEffect(() => {
    if (patient) {
      setFormData({
        nom: patient.nom || '',
        prenom: patient.prenom || '',
        email: patient.email || '',
        telephone: patient.telephone || '',
        dateNaissance: patient.dateNaissance ? 
          new Date(patient.dateNaissance).toISOString().split('T')[0] : '',
        adresse: patient.adresse || '',
        numeroSecurite: patient.numeroSecurite || '',
        notes: patient.notes || '',
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [patient, open])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis'
    }

    if (!formData.dateNaissance) {
      newErrors.dateNaissance = 'La date de naissance est requise'
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

    const submitData: CreatePatientInput = {
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      email: formData.email.trim() || undefined,
      telephone: formData.telephone.trim() || undefined,
      dateNaissance: formData.dateNaissance,
      adresse: formData.adresse.trim() || undefined,
      numeroSecurite: formData.numeroSecurite.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    }

    try {
      if (isEditing && patient) {
        await updatePatientMutation.mutateAsync({
          id: patient.id,
          data: submitData
        })
      } else {
        await createPatientMutation.mutateAsync(submitData)
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

  const handleOCRDataExtracted = (extractedData: Record<string, unknown>, detectedType: 'patient' | 'correspondant' | 'commercial' | 'unknown') => {
    // Only auto-fill if it's detected as patient data or unknown (could be patient)
    if (detectedType === 'patient' || detectedType === 'unknown') {
      setFormData(prev => ({
        ...prev,
        ...(extractedData.nom && { nom: extractedData.nom }),
        ...(extractedData.prenom && { prenom: extractedData.prenom }),
        ...(extractedData.email && { email: extractedData.email }),
        ...(extractedData.telephone && { telephone: extractedData.telephone }),
        ...(extractedData.adresse && { adresse: extractedData.adresse }),
        ...(extractedData.dateNaissance && { dateNaissance: extractedData.dateNaissance }),
        ...(extractedData.numeroSecurite && { numeroSecurite: extractedData.numeroSecurite }),
      }))
      
      // Clear any related errors
      setErrors({})
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le patient' : 'Nouveau patient'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations du patient' 
              : 'Ajoutez un nouveau patient au système'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Formulaire</TabsTrigger>
            <TabsTrigger value="ocr">OCR - Extraction</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="space-y-4 mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={errors.prenom ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {errors.prenom && (
                    <p className="text-sm text-red-600">{errors.prenom}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={errors.nom ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {errors.nom && (
                    <p className="text-sm text-red-600">{errors.nom}</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateNaissance">Date de naissance *</Label>
                  <Input
                    id="dateNaissance"
                    name="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    className={errors.dateNaissance ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {errors.dateNaissance && (
                    <p className="text-sm text-red-600">{errors.dateNaissance}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numeroSecurite">Numéro de sécurité sociale</Label>
                  <Input
                    id="numeroSecurite"
                    name="numeroSecurite"
                    value={formData.numeroSecurite}
                    onChange={handleChange}
                    placeholder="1 23 45 67 890 123 45"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
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
                  placeholder="Notes médicales, allergies, informations importantes..."
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
          </TabsContent>
          
          <TabsContent value="ocr" className="mt-6">
            <OCRUploadZone 
              onDataExtracted={handleOCRDataExtracted}
              className="mb-4"
            />
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p className="font-medium mb-1">💡 Conseils pour une meilleure extraction :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Utilisez des images claires et bien éclairées</li>
                <li>Assurez-vous que le texte est lisible</li>
                <li>Les données extraites rempliront automatiquement le formulaire</li>
                <li>Vous pouvez modifier les données dans l'onglet "Formulaire"</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}