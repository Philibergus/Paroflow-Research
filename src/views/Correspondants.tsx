import { useState } from 'react'
import { useCorrespondants, useDeleteCorrespondant } from '@/hooks/useCorrespondants'
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
  UserCheck,
  MapPin,
  Stethoscope
} from 'lucide-react'
import { formatDate, getSpecialtyBadgeClasses } from '@/lib/utils'
import { CorrespondantForm } from '@/components/common'
import { Correspondant } from '@/lib/api'

export default function Correspondants() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingCorrespondant, setEditingCorrespondant] = useState<Correspondant | null>(null)

  const { 
    data: correspondantsData, 
    isLoading, 
    error 
  } = useCorrespondants({ 
    page, 
    limit: 10, 
    search: search || undefined 
  })

  const deleteCorrespondantMutation = useDeleteCorrespondant()

  const correspondants = correspondantsData?.data || []
  const pagination = correspondantsData?.pagination

  const handleEdit = (correspondant: Correspondant) => {
    setEditingCorrespondant(correspondant)
    setShowForm(true)
  }

  const handleDelete = (correspondantId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce correspondant ?')) {
      deleteCorrespondantMutation.mutate(correspondantId)
    }
  }

  const handleAddNew = () => {
    setEditingCorrespondant(null)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCorrespondant(null)
  }


  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Erreur</h3>
          <p className="text-red-700">
            Impossible de charger les correspondants: {error.message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Correspondants</h1>
          <p className="text-gray-600 mt-1">
            Gérez votre réseau de correspondants médicaux
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouveau correspondant</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher</CardTitle>
          <CardDescription>
            Recherchez parmi vos correspondants par nom, spécialité ou email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un correspondant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filtres par spécialité
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Correspondants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Liste des correspondants</span>
          </CardTitle>
          <CardDescription>
            {pagination && (
              <>
                {pagination.total} correspondant{pagination.total > 1 ? 's' : ''} au total
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
          ) : correspondants.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Correspondant</TableHead>
                    <TableHead>Spécialité</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Ajouté le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {correspondants.map((correspondant) => (
                    <TableRow key={correspondant.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            <Stethoscope className="h-4 w-4 text-gray-400" />
                            <span>{correspondant.nom}</span>
                          </div>
                          {correspondant.notes && (
                            <div className="text-sm text-gray-500 truncate max-w-48 mt-1">
                              {correspondant.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSpecialtyBadgeClasses(correspondant.specialite)}>
                          {correspondant.specialite}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {correspondant.email && (
                            <div className="flex items-center space-x-1 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="truncate max-w-32">{correspondant.email}</span>
                            </div>
                          )}
                          {correspondant.telephone && (
                            <div className="flex items-center space-x-1 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span>{correspondant.telephone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {correspondant.adresse ? (
                          <div className="flex items-center space-x-1 text-sm">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="truncate max-w-32">{correspondant.adresse}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Non renseignée</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {formatDate(correspondant.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(correspondant)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(correspondant.id)}
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
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun correspondant trouvé
              </h3>
              <p className="text-gray-500 mb-4">
                {search 
                  ? `Aucun correspondant ne correspond à "${search}"`
                  : "Commencez par ajouter votre premier correspondant médical"
                }
              </p>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un correspondant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Correspondant Form Dialog */}
      <CorrespondantForm
        open={showForm}
        onOpenChange={setShowForm}
        correspondant={editingCorrespondant}
        onSuccess={handleCloseForm}
      />
    </div>
  )
}