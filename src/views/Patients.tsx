import { useState } from 'react'
import { usePatients, useDeletePatient } from '@/hooks/usePatients'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  Calendar,
  User
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { PatientForm } from '@/components/patients'
import { EmailSender } from '@/components/common'
import { Patient } from '@/lib/api'

export default function Patients() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [showEmailSender, setShowEmailSender] = useState(false)
  const [emailingPatient, setEmailingPatient] = useState<Patient | null>(null)

  const { 
    data: patientsData, 
    isLoading, 
    error 
  } = usePatients({ 
    page, 
    limit: 10, 
    search: search || undefined 
  })

  const deletePatientMutation = useDeletePatient()

  const patients = patientsData?.data || []
  const pagination = patientsData?.pagination

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setShowForm(true)
  }

  const handleDelete = (patientId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      deletePatientMutation.mutate(patientId)
    }
  }

  const handleAddNew = () => {
    setEditingPatient(null)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingPatient(null)
  }

  const handleSendEmail = (patient: Patient) => {
    if (!patient.email) {
      alert('Ce patient n\'a pas d\'adresse email renseignée.')
      return
    }
    setEmailingPatient(patient)
    setShowEmailSender(true)
  }

  const handleCloseEmailSender = () => {
    setShowEmailSender(false)
    setEmailingPatient(null)
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Erreur</h3>
          <p className="text-red-700">
            Impossible de charger les patients: {error.message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">
            Gérez les informations de vos patients
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouveau patient</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher</CardTitle>
          <CardDescription>
            Recherchez parmi vos patients par nom, prénom ou email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filtres avancés
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Liste des patients</span>
          </CardTitle>
          <CardDescription>
            {pagination && (
              <>
                {pagination.total} patient{pagination.total > 1 ? 's' : ''} au total
                {search && ` • Résultats pour "${search}"`}
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : patients.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Date de naissance</TableHead>
                    <TableHead>Sécurité sociale</TableHead>
                    <TableHead>Ajouté le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {patient.prenom} {patient.nom}
                          </div>
                          {patient.notes && (
                            <div className="text-sm text-gray-500 truncate max-w-48">
                              {patient.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {patient.email && (
                            <div className="flex items-center space-x-1 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="truncate max-w-32">{patient.email}</span>
                            </div>
                          )}
                          {patient.telephone && (
                            <div className="flex items-center space-x-1 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span>{patient.telephone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span>{formatDate(patient.dateNaissance)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.numeroSecurite ? (
                          <Badge variant="secondary">{patient.numeroSecurite}</Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">Non renseigné</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {formatDate(patient.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {patient.email && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendEmail(patient)}
                              title="Envoyer un email"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(patient)}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(patient.id)}
                            title="Supprimer"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-500">
                    Page {pagination.page} sur {pagination.totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={pagination.page <= 1}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun patient trouvé
              </h3>
              <p className="text-gray-500 mb-4">
                {search 
                  ? `Aucun patient ne correspond à "${search}"`
                  : "Commencez par ajouter votre premier patient"
                }
              </p>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un patient
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Form Dialog */}
      <PatientForm
        open={showForm}
        onOpenChange={setShowForm}
        patient={editingPatient}
        onSuccess={handleCloseForm}
      />

      {/* Email Sender Dialog */}
      <EmailSender
        open={showEmailSender}
        onOpenChange={setShowEmailSender}
        recipientEmail={emailingPatient?.email || ''}
        recipientName={emailingPatient ? `${emailingPatient.prenom} ${emailingPatient.nom}` : ''}
        patientId={emailingPatient?.id}
        defaultVariables={{
          patient: emailingPatient ? `${emailingPatient.prenom} ${emailingPatient.nom}` : '',
          date: new Date().toLocaleDateString('fr-FR'),
          heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          praticien: 'Dr. Martin'
        }}
        onSuccess={handleCloseEmailSender}
      />
    </div>
  )
}