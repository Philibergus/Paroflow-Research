import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User,
  Phone,
  Calendar,
  ArrowRight,
  Play,
  Pause,
  X,
  Plus,
  Filter,
  Search
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface QueueItem {
  id: string
  patient: {
    id: string
    nom: string
    prenom: string
    telephone?: string
    dateNaissance: string
  }
  type: 'periodontal' | 'implant' | 'followup' | 'emergency'
  priorite: 1 | 2 | 3 | 4 // 1=low, 2=medium, 3=high, 4=urgent
  statut: 'waiting' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  dateAjout: string
  dateDebut?: string
  dateFin?: string
  estimatedDuration?: number // in minutes
}

interface PatientQueueProps {
  onPatientSelect?: (patient: any) => void
  onAddToQueue?: (patientId: string, type: string, priority: number) => void
  onUpdateStatus?: (queueId: string, status: string) => void
}

// Mock data révolutionnaire avec exemples patients réalistes
const mockQueueData: QueueItem[] = [
  {
    id: '1',
    patient: {
      id: 'p1',
      nom: 'Bertrand',
      prenom: 'Sophie',
      telephone: '06 12 34 56 78',
      dateNaissance: '1978-11-15'
    },
    type: 'implant',
    priorite: 3,
    statut: 'waiting',
    notes: 'Pose implant 26 - Consultation préalable effectuée. Patient anxieux, prévoir sédation.',
    dateAjout: '2025-02-03T08:30:00Z',
    estimatedDuration: 120
  },
  {
    id: '2',
    patient: {
      id: 'p2',
      nom: 'Moreau',
      prenom: 'Antoine',
      telephone: '01 45 78 96 32',
      dateNaissance: '1965-04-22'
    },
    type: 'periodontal',
    priorite: 2,
    statut: 'in_progress',
    notes: 'Détartrage sous-gingival secteur 1-2. Hygiène à améliorer.',
    dateAjout: '2025-02-03T09:00:00Z',
    dateDebut: '2025-02-03T10:15:00Z',
    estimatedDuration: 75
  },
  {
    id: '3',
    patient: {
      id: 'p3',
      nom: 'Lefebvre',
      prenom: 'Catherine',
      telephone: '06 98 76 54 21',
      dateNaissance: '1982-08-09'
    },
    type: 'emergency',
    priorite: 4,
    statut: 'waiting',
    notes: '🚨 URGENCE - Douleur sévère 37, possible pulpite. Patient présent depuis 1h.',
    dateAjout: '2025-02-03T11:15:00Z',
    estimatedDuration: 45
  },
  {
    id: '4',
    patient: {
      id: 'p4',
      nom: 'Dupont',
      prenom: 'Michel',
      telephone: '01 23 45 67 89',
      dateNaissance: '1955-12-03'
    },
    type: 'followup',
    priorite: 1,
    statut: 'waiting',
    notes: 'Contrôle cicatrisation implant 46 (6 semaines post-op). RAS attendu.',
    dateAjout: '2025-02-03T07:45:00Z',
    estimatedDuration: 20
  },
  {
    id: '5',
    patient: {
      id: 'p5',
      nom: 'Rousseau',
      prenom: 'Claire',
      telephone: '06 87 65 43 21',
      dateNaissance: '1990-03-18'
    },
    type: 'implant',
    priorite: 2,
    statut: 'waiting',
    notes: 'Dépose implant 15 - Échec d\'ostéointégration. Repose à prévoir dans 3 mois.',
    dateAjout: '2025-02-03T08:15:00Z',
    estimatedDuration: 90
  },
  {
    id: '6',
    patient: {
      id: 'p6',
      nom: 'Garcia',
      prenom: 'Carlos',
      telephone: '01 56 78 90 12',
      dateNaissance: '1975-07-25'
    },
    type: 'periodontal',
    priorite: 3,
    statut: 'waiting',
    notes: 'Surfaçage quadrant 3-4. Patient diabétique, surveiller glycémie.',
    dateAjout: '2025-02-03T09:30:00Z',
    estimatedDuration: 60
  },
  {
    id: '7',
    patient: {
      id: 'p7',
      nom: 'Lemoine',
      prenom: 'Isabelle',
      telephone: '06 34 56 78 90',
      dateNaissance: '1988-01-12'
    },
    type: 'followup',
    priorite: 1,
    statut: 'completed',
    notes: 'Contrôle greffe osseuse 14. Excellent résultat.',
    dateAjout: '2025-02-03T08:00:00Z',
    dateDebut: '2025-02-03T09:45:00Z',
    dateFin: '2025-02-03T10:00:00Z',
    estimatedDuration: 15
  }
]

const QUEUE_TYPES = {
  periodontal: { 
    label: 'Parodontal', 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: '🦷',
    gradient: 'from-blue-50 to-blue-100',
    accent: 'border-l-blue-500'
  },
  implant: { 
    label: 'Implant', 
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
    icon: '⚡',
    gradient: 'from-emerald-50 to-emerald-100',
    accent: 'border-l-emerald-500'
  },
  followup: { 
    label: 'Suivi', 
    color: 'bg-amber-100 text-amber-800 border-amber-200', 
    icon: '👁️',
    gradient: 'from-amber-50 to-amber-100',
    accent: 'border-l-amber-500'
  },
  emergency: { 
    label: 'URGENCE', 
    color: 'bg-red-100 text-red-800 border-red-300', 
    icon: '🚨',
    gradient: 'from-red-50 to-red-100',
    accent: 'border-l-red-500',
    pulse: 'animate-pulse'
  }
}

const PRIORITY_CONFIG = {
  1: { label: 'Basse', color: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
  2: { label: 'Normale', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  3: { label: 'Haute', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  4: { label: 'URGENTE', color: 'bg-red-100 text-red-700', dot: 'bg-red-500 animate-pulse' }
}

const VIEW_MODES = {
  compact: { label: 'Compact', icon: '☰' },
  cards: { label: 'Cartes', icon: '⚏' },
  timeline: { label: 'Timeline', icon: '⧗' }
}

export default function PatientQueue({
  onPatientSelect,
  onAddToQueue,
  onUpdateStatus
}: PatientQueueProps) {
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'compact' | 'cards' | 'timeline'>('cards')
  const [queueData, setQueueData] = useState<QueueItem[]>(mockQueueData)

  // Filter and sort queue data
  const filteredQueue = queueData
    .filter(item => {
      if (filter !== 'all' && item.type !== filter) return false
      if (search && !`${item.patient.prenom} ${item.patient.nom}`.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      // Sort by priority (urgent first), then by date added
      if (a.priorite !== b.priorite) {
        return b.priorite - a.priorite
      }
      return new Date(a.dateAjout).getTime() - new Date(b.dateAjout).getTime()
    })

  const handleStatusUpdate = (queueId: string, newStatus: string) => {
    setQueueData(prev => prev.map(item => 
      item.id === queueId 
        ? { 
            ...item, 
            statut: newStatus as any,
            dateDebut: newStatus === 'in_progress' ? new Date().toISOString() : item.dateDebut,
            dateFin: newStatus === 'completed' ? new Date().toISOString() : item.dateFin
          }
        : item
    ))
    onUpdateStatus?.(queueId, newStatus)
  }

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'waiting': return <Clock className="h-4 w-4 text-blue-600" />
      case 'in_progress': return <Play className="h-4 w-4 text-green-600" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelled': return <X className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (statut: string) => {
    const colors = {
      'waiting': 'bg-blue-100 text-blue-800 border-blue-200',
      'in_progress': 'bg-green-100 text-green-800 border-green-200',
      'completed': 'bg-gray-100 text-gray-800 border-gray-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
    }
    return colors[statut as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getTotalWaitTime = (item: QueueItem): string => {
    const now = new Date()
    const added = new Date(item.dateAjout)
    const diffMs = now.getTime() - added.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    }
    return `${diffMinutes}m`
  }

  const queueStats = {
    total: queueData.length,
    waiting: queueData.filter(i => i.statut === 'waiting').length,
    inProgress: queueData.filter(i => i.statut === 'in_progress').length,
    urgent: queueData.filter(i => i.priorite === 4).length
  }

  return (
    <div className="space-y-6">
      {/* En-tête révolutionnaire avec stats en temps réel */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span>File d'Attente</span>
            <Badge variant="secondary" className="ml-2">
              {queueStats.total} patients
            </Badge>
          </h2>
          <p className="text-gray-600 mt-1">
            Gestion intelligente et vue temps réel
          </p>
        </div>
        
        {/* Sélecteur de vue révolutionnaire */}
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
          {Object.entries(VIEW_MODES).map(([key, mode]) => (
            <Button
              key={key}
              variant={viewMode === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode(key as any)}
              className={`px-3 py-1 text-sm ${
                viewMode === key ? 'bg-white shadow-sm' : 'hover:bg-gray-50'
              }`}
            >
              <span className="mr-1">{mode.icon}</span>
              {mode.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats dynamiques avec indicateurs visuels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">En attente</p>
              <p className="text-2xl font-bold text-blue-900">{queueStats.waiting}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-blue-200 rounded-full opacity-20" />
        </div>
        
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">En cours</p>
              <p className="text-2xl font-bold text-emerald-900">{queueStats.inProgress}</p>
            </div>
            <Play className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-emerald-200 rounded-full opacity-20" />
        </div>
        
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Urgences</p>
              <p className="text-2xl font-bold text-red-900">{queueStats.urgent}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-red-200 rounded-full opacity-20" />
        </div>
        
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total</p>
              <p className="text-2xl font-bold text-purple-900">{queueStats.total}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-purple-200 rounded-full opacity-20" />
        </div>
      </div>

      {/* Filtres et recherche optimisés */}
      <Card className="border-0 shadow-sm bg-gray-50/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="🔍 Recherche rapide par nom, téléphone ou notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">📋 Tous les types</option>
              {Object.entries(QUEUE_TYPES).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Interface révolutionnaire selon le mode de vue */}
      {viewMode === 'cards' && (
        <div className="grid gap-4">
          {filteredQueue.length > 0 ? (
            filteredQueue.map((item) => (
              <Card 
                key={item.id} 
                className={`
                  group hover:shadow-lg transition-all duration-200 cursor-pointer
                  border-l-4 ${QUEUE_TYPES[item.type].accent}
                  ${item.priorite === 4 ? `${QUEUE_TYPES[item.type].pulse} ring-2 ring-red-200/50` : ''}
                  ${item.statut === 'in_progress' ? 'ring-2 ring-emerald-200 bg-emerald-50/30' : ''}
                `}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Indicateur de priorité modernisé */}
                      <div className="flex flex-col items-center space-y-1 pt-1">
                        <div className={`w-3 h-3 rounded-full ${PRIORITY_CONFIG[item.priorite].dot}`} />
                        <div className="w-px h-8 bg-gray-200" />
                      </div>
                      
                      {/* Informations patient optimisées */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {item.patient.prenom} {item.patient.nom}
                          </h4>
                          <Badge className={`${QUEUE_TYPES[item.type].color} font-medium px-2 py-1`}>
                            {QUEUE_TYPES[item.type].icon} {QUEUE_TYPES[item.type].label}
                          </Badge>
                          <Badge variant="outline" className={PRIORITY_CONFIG[item.priorite].color}>
                            {PRIORITY_CONFIG[item.priorite].label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                          {item.patient.telephone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{item.patient.telephone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-green-500" />
                            <span>Ajouté {formatDate(item.dateAjout)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="font-medium">Attente: {getTotalWaitTime(item)}</span>
                          </div>
                        </div>
                        
                        {item.notes && (
                          <div className={`text-sm p-3 rounded-lg border-l-3 ${
                            item.priorite === 4 ? 'bg-red-50 border-red-200 text-red-800' :
                            'bg-gray-50 border-gray-200 text-gray-700'
                          }`}>
                            <p className="leading-relaxed">{item.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions révolutionnaires */}
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.statut)}
                        <Badge className={`${getStatusColor(item.statut)} font-medium`}>
                          {item.statut === 'waiting' ? 'En attente' :
                           item.statut === 'in_progress' ? 'En cours' :
                           item.statut === 'completed' ? 'Terminé' : 'Annulé'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {item.statut === 'waiting' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'in_progress')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Démarrer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onPatientSelect?.(item.patient)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        
                        {item.statut === 'in_progress' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'completed')}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Terminer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'waiting')}
                              className="border-orange-200 text-orange-600 hover:bg-orange-50"
                            >
                              <Pause className="h-3 w-3 mr-1" />
                              Pause
                            </Button>
                          </>
                        )}
                        
                        {(item.statut === 'waiting' || item.statut === 'in_progress') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusUpdate(item.id, 'cancelled')}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      {item.estimatedDuration && (
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          ⏱️ {item.estimatedDuration}min
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="text-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      File d'attente vide
                    </h3>
                    <p className="text-gray-500 mb-4 max-w-md">
                      {search || filter !== 'all' 
                        ? "Aucun patient ne correspond aux critères de recherche"
                        : "Aucun patient en attente pour le moment. Profitez-en pour organiser votre journée !"
                      }
                    </p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un patient
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Mode compact (liste dense) */}
      {viewMode === 'compact' && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredQueue.map((item, index) => (
                <div 
                  key={item.id}
                  className={`
                    flex items-center justify-between p-4 hover:bg-gray-50 transition-colors
                    ${item.priorite === 4 ? 'bg-red-50 border-l-4 border-red-500' : ''}
                    ${item.statut === 'in_progress' ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''}
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 w-8">#{index + 1}</span>
                      <div className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[item.priorite].dot}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.patient.prenom} {item.patient.nom}
                      </p>
                      <p className="text-sm text-gray-500">
                        {QUEUE_TYPES[item.type].icon} {QUEUE_TYPES[item.type].label}
                        {item.patient.telephone && ` • ${item.patient.telephone}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">
                      ⏱️ {getTotalWaitTime(item)}
                    </span>
                    <Badge className={getStatusColor(item.statut)}>
                      {item.statut === 'waiting' ? 'Attente' :
                       item.statut === 'in_progress' ? 'En cours' :
                       item.statut === 'completed' ? 'Terminé' : 'Annulé'}
                    </Badge>
                    <div className="flex space-x-1">
                      {item.statut === 'waiting' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(item.id, 'in_progress')}>
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      {item.statut === 'in_progress' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(item.id, 'completed')}>
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mode timeline (vue chronologique) */}
      {viewMode === 'timeline' && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {filteredQueue.map((item, index) => (
                <div key={item.id} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${PRIORITY_CONFIG[item.priorite].dot} ring-4 ring-white shadow`} />
                    {index < filteredQueue.length - 1 && (
                      <div className="w-px h-16 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {item.patient.prenom} {item.patient.nom}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {QUEUE_TYPES[item.type].icon} {QUEUE_TYPES[item.type].label} •
                          Ajouté {formatDate(item.dateAjout)} • 
                          Attente: {getTotalWaitTime(item)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(item.statut)}>
                        {item.statut}
                      </Badge>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}