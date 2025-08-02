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

// Mock data - should come from API
const mockQueueData: QueueItem[] = [
  {
    id: '1',
    patient: {
      id: 'p1',
      nom: 'Martin',
      prenom: 'Jean',
      telephone: '01 23 45 67 89',
      dateNaissance: '1985-03-15'
    },
    type: 'periodontal',
    priorite: 3,
    statut: 'in_progress',
    notes: 'Détartrage complet nécessaire',
    dateAjout: '2025-02-01T09:00:00Z',
    dateDebut: '2025-02-02T10:30:00Z',
    estimatedDuration: 90
  },
  {
    id: '2',
    patient: {
      id: 'p2',
      nom: 'Dubois',
      prenom: 'Marie',
      telephone: '01 98 76 54 32',
      dateNaissance: '1972-11-28'
    },
    type: 'implant',
    priorite: 2,
    statut: 'waiting',
    notes: 'Consultation implant 46',
    dateAjout: '2025-02-01T14:20:00Z',
    estimatedDuration: 60
  },
  {
    id: '3',
    patient: {
      id: 'p3',
      nom: 'Bernard',
      prenom: 'Pierre',
      telephone: '01 11 22 33 44',
      dateNaissance: '1990-07-12'
    },
    type: 'emergency',
    priorite: 4,
    statut: 'waiting',
    notes: 'Douleur aiguë 37',
    dateAjout: '2025-02-02T11:45:00Z',
    estimatedDuration: 30
  },
  {
    id: '4',
    patient: {
      id: 'p4',
      nom: 'Leroy',
      prenom: 'Sophie',
      dateNaissance: '1988-04-03'
    },
    type: 'followup',
    priorite: 1,
    statut: 'waiting',
    notes: 'Contrôle post-opératoire',
    dateAjout: '2025-02-01T16:00:00Z',
    estimatedDuration: 20
  }
]

const QUEUE_TYPES = {
  periodontal: { label: 'Parodontal', color: 'bg-blue-100 text-blue-800', icon: '🦷' },
  implant: { label: 'Implant', color: 'bg-green-100 text-green-800', icon: '⚙️' },
  followup: { label: 'Suivi', color: 'bg-yellow-100 text-yellow-800', icon: '👁️' },
  emergency: { label: 'Urgence', color: 'bg-red-100 text-red-800', icon: '🚨' }
}

const PRIORITY_CONFIG = {
  1: { label: 'Basse', color: 'bg-gray-100 text-gray-800' },
  2: { label: 'Moyenne', color: 'bg-blue-100 text-blue-800' },
  3: { label: 'Haute', color: 'bg-orange-100 text-orange-800' },
  4: { label: 'Urgente', color: 'bg-red-100 text-red-800' }
}

export default function PatientQueue({
  onPatientSelect,
  onAddToQueue,
  onUpdateStatus
}: PatientQueueProps) {
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>File d'attente</span>
        </CardTitle>
        <CardDescription>
          Gestion des patients en attente de traitement
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{queueStats.total}</div>
            <div className="text-sm text-blue-700">Total</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{queueStats.waiting}</div>
            <div className="text-sm text-yellow-700">En attente</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{queueStats.inProgress}</div>
            <div className="text-sm text-green-700">En cours</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{queueStats.urgent}</div>
            <div className="text-sm text-red-700">Urgence</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher un patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">Tous les types</option>
              {Object.entries(QUEUE_TYPES).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Queue Items */}
        <div className="space-y-3">
          {filteredQueue.length > 0 ? (
            filteredQueue.map((item) => (
              <Card 
                key={item.id} 
                className={`transition-all hover:shadow-md ${
                  item.priorite === 4 ? 'ring-2 ring-red-200 bg-red-50' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Priority indicator */}
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        item.priorite === 4 ? 'bg-red-500' :
                        item.priorite === 3 ? 'bg-orange-500' :
                        item.priorite === 2 ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                      
                      {/* Patient info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {item.patient.prenom} {item.patient.nom}
                          </h4>
                          <Badge className={QUEUE_TYPES[item.type].color}>
                            {QUEUE_TYPES[item.type].icon} {QUEUE_TYPES[item.type].label}
                          </Badge>
                          <Badge className={PRIORITY_CONFIG[item.priorite].color}>
                            {PRIORITY_CONFIG[item.priorite].label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                          {item.patient.telephone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{item.patient.telephone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Ajouté: {formatDate(item.dateAjout)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Attente: {getTotalWaitTime(item)}</span>
                          </div>
                        </div>
                        
                        {item.notes && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Status and actions */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.statut)}
                        <Badge className={getStatusColor(item.statut)}>
                          {item.statut}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {item.statut === 'waiting' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'in_progress')}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Commencer
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onPatientSelect?.(item.patient)}
                            >
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        
                        {item.statut === 'in_progress' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'completed')}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Terminer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'waiting')}
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
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                File d'attente vide
              </h3>
              <p className="text-gray-500 mb-4">
                {search || filter !== 'all' 
                  ? "Aucun patient ne correspond aux filtres sélectionnés"
                  : "Aucun patient en attente pour le moment"
                }
              </p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter à la file
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}