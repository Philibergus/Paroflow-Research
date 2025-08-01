import { useState, useEffect } from 'react'
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
  Clock, 
  Play, 
  Pause, 
  Square, 
  Users,
  Scissors,
  Stethoscope,
  FileText,
  Calculator,
  Camera,
  Plus,
  Calendar
} from 'lucide-react'
import { formatters } from '@/lib/french-terms'

interface TimeEntry {
  id: string
  staffName: string
  activity: 'sterilization' | 'surgery' | 'admin' | 'accounting' | 'photo_sorting'
  startTime: Date
  endTime?: Date
  duration?: number
  notes?: string
  date: string
}

const activityConfig = {
  sterilization: {
    label: 'Stérilisation',
    icon: Scissors,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  surgery: {
    label: 'Chirurgie',
    icon: Stethoscope,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  admin: {
    label: 'Administration',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  accounting: {
    label: 'Comptabilité',
    icon: Calculator,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  photo_sorting: {
    label: 'Tri photos',
    icon: Camera,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
}

export default function Statistics() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [activeTimers, setActiveTimers] = useState<Map<string, TimeEntry>>(new Map())
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedActivity, setSelectedActivity] = useState<string>('')
  const [staffName, setStaffName] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  // Load saved data from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('paroflow-time-entries')
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        startTime: new Date(entry.startTime),
        endTime: entry.endTime ? new Date(entry.endTime) : undefined
      }))
      setTimeEntries(parsedEntries)
    }
  }, [])

  // Save to localStorage whenever timeEntries changes
  useEffect(() => {
    localStorage.setItem('paroflow-time-entries', JSON.stringify(timeEntries))
  }, [timeEntries])

  const handleStartTimer = () => {
    if (!selectedActivity || !staffName) return

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      staffName,
      activity: selectedActivity as any,
      startTime: new Date(),
      date: selectedDate,
      notes
    }

    setActiveTimers(prev => new Map(prev.set(newEntry.id, newEntry)))
    setNotes('')
  }

  const handleStopTimer = (entryId: string) => {
    const activeEntry = activeTimers.get(entryId)
    if (!activeEntry) return

    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - activeEntry.startTime.getTime()) / 1000 / 60) // minutes

    const completedEntry: TimeEntry = {
      ...activeEntry,
      endTime,
      duration
    }

    setTimeEntries(prev => [...prev, completedEntry])
    setActiveTimers(prev => {
      const newMap = new Map(prev)
      newMap.delete(entryId)
      return newMap
    })
  }

  const handleDeleteEntry = (entryId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      setTimeEntries(prev => prev.filter(entry => entry.id !== entryId))
    }
  }

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayEntries = timeEntries.filter(entry => entry.date === today)
    
    const stats = {
      totalTime: todayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0),
      byActivity: {} as Record<string, number>
    }

    Object.keys(activityConfig).forEach(activity => {
      stats.byActivity[activity] = todayEntries
        .filter(entry => entry.activity === activity)
        .reduce((sum, entry) => sum + (entry.duration || 0), 0)
    })

    return stats
  }

  const getFilteredEntries = () => {
    return timeEntries
      .filter(entry => entry.date === selectedDate)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  }

  const todayStats = getTodayStats()
  const filteredEntries = getFilteredEntries()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques de temps</h1>
          <p className="text-gray-600 mt-1">
            Suivi du temps de travail par activité
          </p>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total aujourd'hui
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatters.formatDuration(todayStats.totalTime)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Temps total travaillé
            </p>
          </CardContent>
        </Card>

        {Object.entries(activityConfig).map(([key, config]) => {
          const Icon = config.icon
          const time = todayStats.byActivity[key] || 0
          
          return (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {config.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {formatters.formatDuration(time)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Temps passé
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Active Timers */}
      {activeTimers.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-green-600" />
              <span>Minuteurs actifs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(activeTimers.values()).map((entry) => {
                const config = activityConfig[entry.activity]
                const Icon = config.icon
                
                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div>
                        <p className="font-medium">{config.label}</p>
                        <p className="text-sm text-gray-600">{entry.staffName}</p>
                        <p className="text-xs text-gray-500">
                          Démarré à {entry.startTime.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleStopTimer(entry.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Square className="h-4 w-4" />
                      <span>Arrêter</span>
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Tracking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Nouveau suivi de temps</CardTitle>
          <CardDescription>
            Démarrez un minuteur pour une activité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Membre de l'équipe
              </label>
              <Input
                placeholder="Nom du staff"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activité
              </label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="">Sélectionner une activité</option>
                {Object.entries(activityConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <Input
                placeholder="Notes sur l'activité"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleStartTimer}
                disabled={!selectedActivity || !staffName}
                className="w-full flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Démarrer</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Filter and History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Historique des temps</span>
          </CardTitle>
          <CardDescription>
            Consultez les temps enregistrés par date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
            </div>
          </div>

          {filteredEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead>Activité</TableHead>
                  <TableHead>Heure début</TableHead>
                  <TableHead>Heure fin</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => {
                  const config = activityConfig[entry.activity]
                  const Icon = config.icon
                  
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{entry.staffName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded ${config.bgColor}`}>
                            <Icon className={`h-3 w-3 ${config.color}`} />
                          </div>
                          <span>{config.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {entry.startTime.toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        {entry.endTime ? entry.endTime.toLocaleTimeString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {entry.duration ? formatters.formatDuration(entry.duration) : '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {entry.notes || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune entrée pour cette date
              </h3>
              <p className="text-gray-500">
                Commencez par démarrer un minuteur pour une activité
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}