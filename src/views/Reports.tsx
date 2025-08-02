import { useState } from 'react'
import { useTraitements, useDeleteTraitement } from '@/hooks/useTraitements'
import { usePatients } from '@/hooks/usePatients'
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
  Calendar,
  FileText,
  Activity,
  Clock,
  TrendingUp,
  Euro,
  Users
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { TreatmentForm, TreatmentTimeline } from '@/components/dental'
import { Traitement } from '@/lib/api'

export default function Reports() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingTraitement, setEditingTraitement] = useState<Traitement | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')

  const { 
    data: traitementsData, 
    isLoading, 
    error 
  } = useTraitements({ 
    page, 
    limit: 10, 
    search: search || undefined,
    patientId: selectedPatientId || undefined
  })

  const { data: patientsData } = usePatients({ limit: 100 })
  const deleteTraitementMutation = useDeleteTraitement()

  const traitements = traitementsData?.data || []
  const pagination = traitementsData?.pagination
  const patients = patientsData?.data || []

  // Calculate statistics
  const stats = {
    total: pagination?.total || 0,
    enCours: traitements.filter(t => t.statut === 'en_cours').length,
    termine: traitements.filter(t => t.statut === 'termine').length,
    revenu: traitements.reduce((sum, t) => sum + (t.cout || 0), 0)
  }

  const getStatusColor = (statut: string) => {
    const colors = {
      'planifie': 'bg-blue-100 text-blue-800',
      'en_cours': 'bg-yellow-100 text-yellow-800',
      'termine': 'bg-green-100 text-green-800',
      'suspendu': 'bg-red-100 text-red-800',
    }
    return colors[statut as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (statut: string) => {
    const labels = {
      'planifie': 'Planifié',
      'en_cours': 'En cours',
      'termine': 'Terminé',
      'suspendu': 'Suspendu',
    }
    return labels[statut as keyof typeof labels] || statut
  }

  const handleEdit = (traitement: Traitement) => {
    setEditingTraitement(traitement)
    setShowForm(true)
  }

  const handleDelete = (traitementId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce traitement ?')) {
      deleteTraitementMutation.mutate(traitementId)
    }
  }

  const handleAddNew = () => {
    setEditingTraitement(null)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTraitement(null)
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Erreur</h3>
          <p className="text-red-700">
            Impossible de charger les traitements: {error.message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports et Traitements</h1>
          <p className="text-gray-600 mt-1">
            Suivez vos traitements et analysez votre activité
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouveau traitement</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total traitements
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">
              Tous les traitements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En cours
            </CardTitle>
            <Activity className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enCours}</div>
            <p className="text-xs text-gray-500 mt-1">
              Traitements actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Terminés
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.termine}</div>
            <p className="text-xs text-gray-500 mt-1">
              Traitements finalisés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Chiffre d'affaires
            </CardTitle>
            <Euro className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenu)}</div>
            <p className="text-xs text-gray-500 mt-1">
              Total des traitements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>
            Recherchez et filtrez vos traitements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un traitement..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="flex h-9 w-full md:w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="">Tous les patients</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.prenom} {patient.nom}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Timeline */}
      {selectedPatientId && (
        <TreatmentTimeline patientId={selectedPatientId} />
      )}

      {/* Treatments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Liste des traitements</span>
          </CardTitle>
          <CardDescription>
            {pagination && (
              <>
                {pagination.total} traitement{pagination.total > 1 ? 's' : ''} au total
                {search && ` • Résultats pour "${search}"`}
                {selectedPatientId && ` • Patient sélectionné`}
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : traitements.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type de traitement</TableHead>
                    <TableHead>Dents</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Coût</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {traitements.map((traitement) => (
                    <TableRow key={traitement.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">
                              {traitement.patient?.prenom} {traitement.patient?.nom}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{traitement.type}</div>
                          {traitement.notes && (
                            <div className="text-sm text-gray-500 truncate max-w-48">
                              {traitement.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {traitement.dents ? (
                          <Badge variant="outline">{traitement.dents}</Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">Non spécifié</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(traitement.statut)}>
                          {getStatusLabel(traitement.statut)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {traitement.dateDebut && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span>Début: {formatDate(traitement.dateDebut)}</span>
                            </div>
                          )}
                          {traitement.dateFin && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span>Fin: {formatDate(traitement.dateFin)}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {traitement.cout ? (
                          <span className="font-medium">{formatCurrency(traitement.cout)}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">Non défini</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(traitement)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(traitement.id)}
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
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun traitement trouvé
              </h3>
              <p className="text-gray-500 mb-4">
                {search || selectedPatientId
                  ? "Aucun traitement ne correspond aux critères sélectionnés"
                  : "Commencez par ajouter votre premier traitement"
                }
              </p>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un traitement
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Treatment Form Dialog */}
      <TreatmentForm
        open={showForm}
        onOpenChange={setShowForm}
        traitement={editingTraitement}
        onSuccess={handleCloseForm}
      />
    </div>
  )
}