import { useTraitements, useTraitementEtapes } from '@/hooks/useTraitements'
import { usePatient } from '@/hooks/usePatients'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Plus,
  Activity
} from 'lucide-react'
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils'

interface TreatmentTimelineProps {
  patientId: string
}

export default function TreatmentTimeline({ patientId }: TreatmentTimelineProps) {
  const { data: patientData } = usePatient(patientId)
  const { data: traitementsData } = useTraitements({ patientId, limit: 100 })

  const patient = patientData?.data
  const traitements = traitementsData?.data || []

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'termine':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'en_cours':
        return <Activity className="h-4 w-4 text-yellow-600" />
      case 'suspendu':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
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

  if (!patient) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Historique des traitements</span>
        </CardTitle>
        <CardDescription>
          Traitements pour {patient.prenom} {patient.nom}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {traitements.length > 0 ? (
          <div className="space-y-6">
            {traitements.map((traitement) => (
              <div key={traitement.id} className="relative">
                {/* Timeline connector */}
                <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200"></div>
                
                <div className="flex items-start space-x-4">
                  {/* Status icon */}
                  <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                    {getStatusIcon(traitement.statut)}
                  </div>
                  
                  {/* Treatment content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {traitement.type}
                          </h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <Badge className={getStatusColor(traitement.statut)}>
                              {getStatusLabel(traitement.statut)}
                            </Badge>
                            {traitement.dents && (
                              <Badge variant="outline">
                                Dents: {traitement.dents}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {traitement.cout && (
                          <div className="text-right">
                            <div className="text-lg font-semibold">
                              {formatCurrency(traitement.cout)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        {traitement.dateDebut && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Début: {formatDate(traitement.dateDebut)}</span>
                          </div>
                        )}
                        {traitement.dateFin && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>Fin: {formatDate(traitement.dateFin)}</span>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {traitement.notes && (
                        <div className="bg-gray-50 rounded-md p-3">
                          <p className="text-sm text-gray-700">{traitement.notes}</p>
                        </div>
                      )}

                      {/* Treatment steps */}
                      <TreatmentSteps traitementId={traitement.id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun traitement
            </h3>
            <p className="text-gray-500 mb-4">
              Ce patient n'a pas encore de traitement enregistré
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TreatmentSteps({ traitementId }: { traitementId: string }) {
  const { data: etapesData } = useTraitementEtapes(traitementId)
  const etapes = etapesData?.data || []

  if (etapes.length === 0) {
    return null
  }

  const getEtapeStatusIcon = (statut: string) => {
    switch (statut) {
      case 'termine':
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case 'reporte':
        return <AlertCircle className="h-3 w-3 text-orange-600" />
      default:
        return <Clock className="h-3 w-3 text-blue-600" />
    }
  }

  const getEtapeStatusColor = (statut: string) => {
    const colors = {
      'planifie': 'bg-blue-50 text-blue-700',
      'termine': 'bg-green-50 text-green-700',
      'reporte': 'bg-orange-50 text-orange-700',
    }
    return colors[statut as keyof typeof colors] || 'bg-gray-50 text-gray-700'
  }

  const getEtapeStatusLabel = (statut: string) => {
    const labels = {
      'planifie': 'Planifié',
      'termine': 'Terminé',
      'reporte': 'Reporté',
    }
    return labels[statut as keyof typeof labels] || statut
  }

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Étapes du traitement</h4>
      <div className="space-y-2">
        {etapes.map((etape) => (
          <div key={etape.id} className={`p-3 rounded-md ${getEtapeStatusColor(etape.statut)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                {getEtapeStatusIcon(etape.statut)}
                <div className="min-w-0">
                  <div className="text-sm font-medium">{etape.titre}</div>
                  {etape.description && (
                    <div className="text-xs mt-1 opacity-75">{etape.description}</div>
                  )}
                  <div className="flex items-center space-x-3 mt-1 text-xs opacity-75">
                    <span>{formatDateTime(etape.date)}</span>
                    {etape.duree && <span>{etape.duree} min</span>}
                    {etape.cout && <span>{formatCurrency(etape.cout)}</span>}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {getEtapeStatusLabel(etape.statut)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}