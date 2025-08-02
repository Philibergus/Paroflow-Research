import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Circle, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Award,
  Wrench
} from 'lucide-react'

// Dental chart interfaces
interface ToothData {
  number: number
  status: 'present' | 'extracted' | 'implant' | 'crown' | 'filling' | 'missing'
  condition: 'healthy' | 'caries' | 'restoration' | 'inflammation' | 'infection'
  color?: string
  notes?: string
  treatments?: string[]
}

interface Treatment {
  id: string
  type: string
  dents?: string
  statut: string
  dateDebut?: Date
  dateFin?: Date
  cout?: number
  notes?: string
}

interface DentalChartProps {
  patientId: string
  treatments?: Treatment[]
  onToothClick?: (tooth: ToothData) => void
  onToothUpdate?: (tooth: ToothData) => void
  readOnly?: boolean
  showLegend?: boolean
}

// Standard dental numbering (FDI notation)
const ADULT_TEETH = {
  maxillary: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  mandibular: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
}

// Color scheme for tooth statuses
const TOOTH_COLORS = {
  present: '#e5f3ff',
  extracted: '#fee2e2',
  implant: '#dcfce7',
  crown: '#fef3c7',
  filling: '#e0e7ff',
  missing: '#f3f4f6',
  healthy: '#10b981',
  caries: '#ef4444',
  restoration: '#3b82f6',
  inflammation: '#f59e0b',
  infection: '#dc2626'
}

const TOOTH_ICONS = {
  present: Circle,
  extracted: XCircle,
  implant: Activity,
  crown: Award,
  filling: CheckCircle,
  missing: AlertTriangle
}

export default function DentalChart({
  patientId,
  treatments = [],
  onToothClick,
  onToothUpdate,
  readOnly = false,
  showLegend = true
}: DentalChartProps) {
  const [teethData, setTeethData] = useState<Map<number, ToothData>>(new Map())
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [hoveredTooth, setHoveredTooth] = useState<number | null>(null)

  // Initialize teeth data
  useEffect(() => {
    const initialData = new Map<number, ToothData>()
    
    // Initialize all adult teeth as present and healthy
    const allTeeth = [...ADULT_TEETH.maxillary, ...ADULT_TEETH.mandibular]
    allTeeth.forEach(number => {
      initialData.set(number, {
        number,
        status: 'present',
        condition: 'healthy',
        color: TOOTH_COLORS.present,
        treatments: []
      })
    })
    
    // Apply treatment data if available
    treatments.forEach(treatment => {
      if (treatment.dents) {
        const affectedTeeth = treatment.dents.split(',').map((n: string) => parseInt(n.trim()))
        affectedTeeth.forEach((toothNumber: number) => {
          const existing = initialData.get(toothNumber)
          if (existing) {
            // Update tooth based on treatment type
            const updated = updateToothFromTreatment(existing, treatment)
            initialData.set(toothNumber, updated)
          }
        })
      }
    })
    
    setTeethData(initialData)
  }, [treatments, patientId])

  const updateToothFromTreatment = (tooth: ToothData, treatment: Treatment): ToothData => {
    const treatmentType = treatment.type.toLowerCase()
    let newStatus = tooth.status
    let newCondition = tooth.condition
    
    // Update status based on treatment type
    if (treatmentType.includes('extraction')) {
      newStatus = 'extracted'
    } else if (treatmentType.includes('implant')) {
      newStatus = 'implant'
    } else if (treatmentType.includes('couronne') || treatmentType.includes('crown')) {
      newStatus = 'crown'
    } else if (treatmentType.includes('obturation') || treatmentType.includes('filling')) {
      newStatus = 'filling'
    }
    
    // Update condition based on treatment
    if (treatment.statut === 'termine') {
      newCondition = 'healthy'
    }
    
    return {
      ...tooth,
      status: newStatus,
      condition: newCondition,
      color: TOOTH_COLORS[newStatus],
      treatments: [...(tooth.treatments || []), treatment.type]
    }
  }

  const handleToothClick = (toothNumber: number) => {
    if (readOnly) return
    
    const tooth = teethData.get(toothNumber)
    if (!tooth) return
    
    setSelectedTooth(toothNumber)
    onToothClick?.(tooth)
  }

  const getToothIcon = (tooth: ToothData) => {
    const IconComponent = TOOTH_ICONS[tooth.status]
    return IconComponent || Tooth
  }

  const getToothColor = (tooth: ToothData) => {
    if (tooth.condition !== 'healthy') {
      return TOOTH_COLORS[tooth.condition]
    }
    return TOOTH_COLORS[tooth.status]
  }

  const renderTooth = (toothNumber: number, position: 'top' | 'bottom') => {
    const tooth = teethData.get(toothNumber)
    if (!tooth) return null
    
    const Icon = getToothIcon(tooth)
    const isSelected = selectedTooth === toothNumber
    const isHovered = hoveredTooth === toothNumber
    const backgroundColor = getToothColor(tooth)
    
    return (
      <div
        key={toothNumber}
        className={`relative flex flex-col items-center p-2 rounded-lg border-2 transition-all cursor-pointer ${
          isSelected
            ? 'border-blue-500 bg-blue-50 scale-110'
            : isHovered
            ? 'border-gray-400 bg-gray-50 scale-105'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        style={{ backgroundColor }}
        onClick={() => handleToothClick(toothNumber)}
        onMouseEnter={() => setHoveredTooth(toothNumber)}
        onMouseLeave={() => setHoveredTooth(null)}
      >
        {/* Tooth Icon */}
        <Icon 
          className={`h-6 w-6 ${
            tooth.condition === 'healthy' ? 'text-gray-700' : 'text-red-600'
          }`} 
        />
        
        {/* Tooth Number */}
        <span className="text-xs font-mono mt-1 text-gray-600">
          {toothNumber}
        </span>
        
        {/* Status indicators */}
        {tooth.treatments && tooth.treatments.length > 0 && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {tooth.treatments.length}
            </span>
          </div>
        )}
        
        {/* Condition indicator */}
        {tooth.condition !== 'healthy' && (
          <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-red-500 rounded-full" />
        )}
      </div>
    )
  }

  const renderQuadrant = (teeth: number[], label: string, position: 'top' | 'bottom') => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 text-center">{label}</h4>
      <div className="grid grid-cols-8 gap-2">
        {teeth.map(toothNumber => renderTooth(toothNumber, position))}
      </div>
    </div>
  )

  const getLegendItems = () => [
    { status: 'present', label: 'Présent', color: TOOTH_COLORS.present },
    { status: 'extracted', label: 'Extrait', color: TOOTH_COLORS.extracted },
    { status: 'implant', label: 'Implant', color: TOOTH_COLORS.implant },
    { status: 'crown', label: 'Couronne', color: TOOTH_COLORS.crown },
    { status: 'filling', label: 'Obturation', color: TOOTH_COLORS.filling },
    { status: 'missing', label: 'Absent', color: TOOTH_COLORS.missing },
  ]

  const getConditionItems = () => [
    { condition: 'healthy', label: 'Sain', color: TOOTH_COLORS.healthy },
    { condition: 'caries', label: 'Carie', color: TOOTH_COLORS.caries },
    { condition: 'restoration', label: 'Restauration', color: TOOTH_COLORS.restoration },
    { condition: 'inflammation', label: 'Inflammation', color: TOOTH_COLORS.inflammation },
    { condition: 'infection', label: 'Infection', color: TOOTH_COLORS.infection },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Circle className="h-5 w-5" />
          <span>Schéma dentaire</span>
        </CardTitle>
        <CardDescription>
          Cliquez sur une dent pour voir les détails et traitements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Maxillary (Upper) Teeth */}
        {renderQuadrant(ADULT_TEETH.maxillary, 'Arcade supérieure (Maxillaire)', 'top')}
        
        {/* Mandibular (Lower) Teeth */}
        {renderQuadrant(ADULT_TEETH.mandibular, 'Arcade inférieure (Mandibulaire)', 'bottom')}
        
        {/* Selected Tooth Details */}
        {selectedTooth && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900">
                  Dent {selectedTooth}
                </h4>
                {(() => {
                  const tooth = teethData.get(selectedTooth)
                  if (!tooth) return null
                  
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{tooth.status}</Badge>
                        <Badge variant="outline">{tooth.condition}</Badge>
                      </div>
                      {tooth.treatments && tooth.treatments.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-blue-800">Traitements:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tooth.treatments.map((treatment, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {treatment}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {tooth.notes && (
                        <p className="text-sm text-blue-700">{tooth.notes}</p>
                      )}
                    </div>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Legend */}
        {showLegend && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Statut des dents</h4>
              <div className="grid grid-cols-2 gap-2">
                {getLegendItems().map(item => (
                  <div key={item.status} className="flex items-center space-x-2">
                    <div 
                      className="h-3 w-3 rounded border"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">État de santé</h4>
              <div className="grid grid-cols-2 gap-2">
                {getConditionItems().map(item => (
                  <div key={item.condition} className="flex items-center space-x-2">
                    <div 
                      className="h-3 w-3 rounded-full border"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        {!readOnly && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button variant="outline" size="sm">
              <Wrench className="h-4 w-4 mr-1" />
              Ajouter traitement
            </Button>
            <Button variant="outline" size="sm">
              Charger radio
            </Button>
            <Button variant="outline" size="sm">
              Exporter schéma
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}