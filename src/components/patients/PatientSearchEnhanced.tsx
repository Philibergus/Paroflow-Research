import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { usePatients } from '@/hooks/usePatients'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  User, 
  Clock, 
  Phone, 
  Calendar,
  ArrowRight,
  Plus
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Patient } from '@/lib/api'

interface RecentPatient {
  id: string
  nom: string
  prenom: string
  lastVisit: string
}

interface PatientSearchEnhancedProps {
  onPatientSelect: (patient: Patient) => void
  onNewPatient?: () => void
  placeholder?: string
  autoFocus?: boolean
  showRecentPatients?: boolean
  showQueue?: boolean
}

export default function PatientSearchEnhanced({
  onPatientSelect,
  onNewPatient,
  placeholder = "Rechercher un patient...",
  autoFocus = true,
  showRecentPatients = true,
  showQueue = true
}: PatientSearchEnhancedProps) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Search results
  const { data: searchResults, isLoading } = usePatients({
    search: search.length >= 2 ? search : undefined,
    limit: 8
  })

  // Recent patients (mock data for now - should come from localStorage or API)
  const recentPatients = [
    { id: '1', nom: 'Martin', prenom: 'Jean', lastVisit: '2025-01-30' },
    { id: '2', nom: 'Dubois', prenom: 'Marie', lastVisit: '2025-01-29' },
    { id: '3', nom: 'Bernard', prenom: 'Pierre', lastVisit: '2025-01-28' },
  ]

  // Current appointments (mock data)
  const currentAppointments = [
    { id: '4', nom: 'Leroy', prenom: 'Sophie', appointmentTime: '14:30', type: 'Contrôle' },
    { id: '5', nom: 'Moreau', prenom: 'Michel', appointmentTime: '15:00', type: 'Implant' },
  ]

  const patients = searchResults?.data || []
  const suggestions = search.length >= 2 ? patients : []
  
  // Combine suggestions with recent/appointments
  const allSuggestions = [
    ...suggestions,
    ...(search.length < 2 && showRecentPatients ? recentPatients.slice(0, 4) : []),
    ...(search.length < 2 && showQueue ? currentAppointments : [])
  ]

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    setSelectedIndex(0)
  }, [allSuggestions.length])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
        break
      case 'Enter':
        e.preventDefault()
        if (allSuggestions[selectedIndex]) {
          handlePatientSelect(allSuggestions[selectedIndex] as Patient)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSearch('')
        break
      case 'Tab':
        if (allSuggestions[selectedIndex]) {
          e.preventDefault()
          handlePatientSelect(allSuggestions[selectedIndex] as Patient)
        }
        break
    }
  }

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient)
    setSearch('')
    setIsOpen(false)
    
    // Save to recent patients (localStorage)
    const recent = JSON.parse(localStorage.getItem('recentPatients') || '[]')
    const updated = [
      { id: patient.id, nom: patient.nom, prenom: patient.prenom, lastVisit: new Date().toISOString() },
      ...recent.filter((p: RecentPatient) => p.id !== patient.id)
    ].slice(0, 10)
    localStorage.setItem('recentPatients', JSON.stringify(updated))
  }

  const handleFocus = () => {
    setIsOpen(true)
  }

  const handleBlur = () => {
    // Delay to allow clicks on suggestions
    setTimeout(() => setIsOpen(false), 200)
  }

  const getSuggestionIcon = (suggestion: Patient | RecentPatient) => {
    if (suggestion.appointmentTime) return Clock
    if (suggestion.lastVisit) return Calendar
    return User
  }

  const getSuggestionSubtext = (suggestion: Patient | RecentPatient) => {
    if (suggestion.appointmentTime) {
      return `${suggestion.appointmentTime} • ${suggestion.type}`
    }
    if (suggestion.lastVisit) {
      return `Dernière visite: ${formatDate(suggestion.lastVisit)}`
    }
    if (suggestion.telephone) {
      return suggestion.telephone
    }
    if (suggestion.dateNaissance) {
      return `Né(e) le ${formatDate(suggestion.dateNaissance)}`
    }
    return null
  }

  const getSuggestionBadge = (suggestion: Patient | RecentPatient) => {
    if (suggestion.appointmentTime) return 'Aujourd\'hui'
    if (suggestion.lastVisit) return 'Récent'
    return null
  }

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-12"
          autoComplete="off"
        />
        {onNewPatient && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewPatient}
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <Card className="absolute top-full z-50 mt-1 w-full shadow-lg">
          <CardContent className="p-0">
            <div ref={listRef} className="max-h-80 overflow-y-auto">
              {isLoading && search.length >= 2 && (
                <div className="p-3 text-center text-sm text-gray-500">
                  Recherche en cours...
                </div>
              )}

              {allSuggestions.length === 0 && !isLoading && (
                <div className="p-3 text-center">
                  {search.length >= 2 ? (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Aucun patient trouvé pour "{search}"
                      </p>
                      {onNewPatient && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onNewPatient}
                          className="text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Créer un nouveau patient
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Tapez au moins 2 caractères pour rechercher
                    </p>
                  )}
                </div>
              )}

              {/* Section headers */}
              {search.length < 2 && showRecentPatients && recentPatients.length > 0 && (
                <div className="border-b bg-gray-50 px-3 py-2">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Patients récents
                  </h4>
                </div>
              )}

              {search.length < 2 && showQueue && currentAppointments.length > 0 && (
                <div className="border-b bg-gray-50 px-3 py-2">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Rendez-vous d'aujourd'hui
                  </h4>
                </div>
              )}

              {search.length >= 2 && suggestions.length > 0 && (
                <div className="border-b bg-gray-50 px-3 py-2">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Résultats de recherche ({suggestions.length})
                  </h4>
                </div>
              )}

              {/* Suggestions */}
              {allSuggestions.map((suggestion, index) => {
                const Icon = getSuggestionIcon(suggestion)
                const subtext = getSuggestionSubtext(suggestion)
                const badge = getSuggestionBadge(suggestion)
                
                return (
                  <div
                    key={suggestion.id}
                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-blue-50 border-r-2 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handlePatientSelect(suggestion as Patient)}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon className={`h-4 w-4 flex-shrink-0 ${
                        index === selectedIndex ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900">
                          {suggestion.prenom} {suggestion.nom}
                        </div>
                        {subtext && (
                          <div className="text-sm text-gray-500 truncate">
                            {subtext}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {badge && (
                        <Badge variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      )}
                      {index === selectedIndex && (
                        <ArrowRight className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Keyboard shortcuts hint */}
            {isOpen && allSuggestions.length > 0 && (
              <div className="border-t bg-gray-50 px-3 py-2">
                <p className="text-xs text-gray-500">
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">↑↓</kbd> naviguer •{' '}
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Entrée</kbd> sélectionner •{' '}
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Échap</kbd> fermer
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}