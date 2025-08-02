import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Plus,
  Activity,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  MapPin,
  Workflow
} from 'lucide-react'
import { formatDate, formatDateTime } from '@/lib/utils'
import { useTraitements, useTraitementEtapes } from '@/hooks/useTraitements'
import { usePatient } from '@/hooks/usePatients'
import { CLINICAL_SCENARIOS, getScenarioTemplate, ScenarioStep } from '@/lib/clinical-scenarios'
import { Traitement, EtapeTraitement } from '@/lib/api'

interface TreatmentTimelineEnhancedProps {
  patientId: string
  onScenarioCreate?: (scenarioType: string) => void
  onStepUpdate?: (step: EtapeTraitement, newStatus: string) => void
  showScenarioBuilder?: boolean
}

interface TimelineCursor {
  date: Date
  position: number // 0-100 percentage
}

export default function TreatmentTimelineEnhanced({
  patientId,
  onScenarioCreate,
  onStepUpdate,
  showScenarioBuilder = true
}: TreatmentTimelineEnhancedProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('')
  const [timelineCursor, setTimelineCursor] = useState<TimelineCursor>({
    date: new Date(),
    position: 50
  })
  const [viewMode, setViewMode] = useState<'timeline' | 'kanban'>('timeline')

  const { data: patientData } = usePatient(patientId)
  const { data: traitementsData } = useTraitements({ patientId, limit: 100 })

  const patient = patientData?.data
  const traitements = traitementsData?.data || []

  // Get all treatment steps for timeline
  const allSteps: Array<EtapeTraitement & { traitement: Traitement }> = []
  
  traitements.forEach(traitement => {
    if (traitement.etapes) {
      traitement.etapes.forEach(etape => {
        allSteps.push({
          ...etape,
          traitement
        })
      })
    }
  })

  // Sort steps by date
  const sortedSteps = allSteps.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Calculate timeline bounds
  const now = new Date()
  const pastSteps = sortedSteps.filter(step => new Date(step.date) < now)
  const futureSteps = sortedSteps.filter(step => new Date(step.date) >= now)
  
  const timelineStart = pastSteps.length > 0 
    ? new Date(Math.min(...pastSteps.map(s => new Date(s.date).getTime())))
    : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    
  const timelineEnd = futureSteps.length > 0
    ? new Date(Math.max(...futureSteps.map(s => new Date(s.date).getTime())))
    : new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000) // 180 days ahead

  const getStepPosition = (date: Date): number => {
    const totalDuration = timelineEnd.getTime() - timelineStart.getTime()
    const stepDuration = date.getTime() - timelineStart.getTime()
    return Math.max(0, Math.min(100, (stepDuration / totalDuration) * 100))
  }

  const getStatusIcon = (statut: string, isScenario = false) => {
    if (isScenario) {
      switch (statut) {
        case 'active': return <Play className="h-4 w-4 text-green-600" />
        case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />
        case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
        default: return <Activity className="h-4 w-4 text-blue-600" />
      }
    }
    
    switch (statut) {
      case 'termine':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'reporte':
        return <RotateCcw className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusColor = (statut: string) => {
    const colors = {
      'planifie': 'bg-blue-100 text-blue-800 border-blue-200',
      'termine': 'bg-green-100 text-green-800 border-green-200',
      'reporte': 'bg-orange-100 text-orange-800 border-orange-200',
    }
    return colors[statut as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const handleCreateScenario = () => {
    if (selectedScenario && onScenarioCreate) {
      onScenarioCreate(selectedScenario)
    }
  }

  const renderTimelineView = () => (
    <div className="relative">
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium">Chronologie des traitements</h3>
          <Badge variant="outline">
            {sortedSteps.length} étape{sortedSteps.length > 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            Kanban
          </Button>
        </div>
      </div>

      {/* Timeline Scale */}
      <div className="relative h-2 bg-gray-200 rounded-full mb-8">
        {/* Current time indicator */}
        <div 
          className="absolute top-0 w-0.5 h-2 bg-red-500 z-10"
          style={{ left: `${getStepPosition(now)}%` }}
        />
        
        {/* Timeline cursor */}
        <div 
          className="absolute top-0 w-1 h-2 bg-blue-600 rounded cursor-pointer z-20"
          style={{ left: `${timelineCursor.position}%` }}
          title={`Curseur: ${formatDate(timelineCursor.date)}`}
        />
        
        {/* Timeline segments */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-blue-200 rounded-l-full" title="Passé" />
          <div className="flex-1 bg-green-200 rounded-r-full" title="Futur" />
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-300" />
        
        {sortedSteps.map((step, index) => {
          const stepDate = new Date(step.date)
          const isPast = stepDate < now
          const isToday = stepDate.toDateString() === now.toDateString()
          
          return (
            <div key={step.id} className="relative flex items-start space-x-4 pb-8">
              {/* Timeline dot */}
              <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                isPast 
                  ? 'bg-green-50 border-green-200' 
                  : isToday
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                {getStatusIcon(step.statut)}
              </div>
              
              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className={`bg-white border rounded-lg p-4 shadow-sm ${
                  isToday ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{step.titre}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {step.traitement.type}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(step.statut)}>
                        {step.statut}
                      </Badge>
                      {step.traitement.scenariotype && (
                        <Badge variant="outline">
                          <Workflow className="h-3 w-3 mr-1" />
                          Scénario
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(step.date)}</span>
                    </div>
                    {step.duree && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{step.duree} min</span>
                      </div>
                    )}
                  </div>
                  
                  {step.description && (
                    <p className="text-sm text-gray-700 mb-3">{step.description}</p>
                  )}
                  
                  {/* Scenario progress if applicable */}
                  {step.traitement.scenariotype && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">
                          Progression du scénario
                        </span>
                        <span className="text-sm text-blue-600">
                          Étape {index + 1} / {sortedSteps.length}
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-blue-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-600 rounded-full transition-all"
                          style={{ width: `${((index + 1) / sortedSteps.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Quick actions */}
                  <div className="flex items-center space-x-2 mt-3">
                    {step.statut === 'planifie' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onStepUpdate?.(step, 'termine')}
                      >
                        Marquer terminé
                      </Button>
                    )}
                    {step.statut === 'termine' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onStepUpdate?.(step, 'planifie')}
                      >
                        Réouvrir
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      Modifier
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderKanbanView = () => {
    const columns = [
      { id: 'planifie', title: 'Planifié', steps: sortedSteps.filter(s => s.statut === 'planifie') },
      { id: 'termine', title: 'Terminé', steps: sortedSteps.filter(s => s.statut === 'termine') },
      { id: 'reporte', title: 'Reporté', steps: sortedSteps.filter(s => s.statut === 'reporte') },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{column.title}</h4>
              <Badge variant="secondary">{column.steps.length}</Badge>
            </div>
            
            <div className="space-y-3">
              {column.steps.map(step => (
                <Card key={step.id} className="p-3">
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">{step.titre}</h5>
                    <p className="text-xs text-gray-600">{step.traitement.type}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(step.date)}</span>
                      {step.duree && <span>{step.duree} min</span>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
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
          <Activity className="h-5 w-5" />
          <span>Timeline des traitements</span>
        </CardTitle>
        <CardDescription>
          Suivi chronologique des traitements pour {patient.prenom} {patient.nom}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Scenario Builder */}
        {showScenarioBuilder && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">Nouveau scénario clinique</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Créez un parcours de soin structuré
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Choisir un scénario..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CLINICAL_SCENARIOS).map(scenario => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          {scenario.titre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleCreateScenario}
                    disabled={!selectedScenario}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Créer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {sortedSteps.length > 0 ? (
          <div>
            {viewMode === 'timeline' ? renderTimelineView() : renderKanbanView()}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun traitement planifié
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer un scénario clinique ou ajouter un traitement manuel
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Traitement manuel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}