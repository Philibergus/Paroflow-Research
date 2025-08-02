import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Package, Info } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImplantSelectorProps {
  onImplantSelect?: (implant: ReferenceImplant | null) => void
  preselectedImplantId?: string
  showStock?: boolean
  className?: string
}

interface MarqueImplant {
  id: string
  nom: string
  codeMarque: string
  pays: string
  systemes: SystemeImplant[]
}

interface SystemeImplant {
  id: string
  nom: string
  codeSysteme: string
  description: string
  typeConnexion: string
  surface: string
  materiau: string
  references: ReferenceImplant[]
}

interface ReferenceImplant {
  id: string
  codeReference: string
  diametre: number
  longueur: number
  plateformeProsthetique: string
  connexionDiametre: number
  prixUnitaire: number
  notes: string
  stock?: {
    quantiteStock: number
    seuilAlerte: number
    emplacement: string
  }
  systeme: {
    nom: string
    marque: {
      nom: string
    }
  }
}

const ImplantSelector: React.FC<ImplantSelectorProps> = ({
  onImplantSelect,
  preselectedImplantId,
  showStock = true,
  className
}) => {
  const [selectedMarque, setSelectedMarque] = useState<string>('')
  const [selectedSysteme, setSelectedSysteme] = useState<string>('')
  const [selectedDiametre, setSelectedDiametre] = useState<string>('')
  const [selectedLongueur, setSelectedLongueur] = useState<string>('')
  const [selectedImplant, setSelectedImplant] = useState<ReferenceImplant | null>(null)

  // Récupération des marques et systèmes
  const { data: marques, isLoading: loadingMarques } = useQuery({
    queryKey: ['marques-implants'],
    queryFn: async () => {
      const response = await fetch('/api/implants/marques')
      if (!response.ok) throw new Error('Erreur lors du chargement des marques')
      return response.json() as Promise<MarqueImplant[]>
    }
  })

  // Récupération des références d'un système
  const { data: references, isLoading: loadingReferences } = useQuery({
    queryKey: ['references-implants', selectedSysteme],
    queryFn: async () => {
      if (!selectedSysteme) return []
      const response = await fetch(`/api/implants/references?systemeId=${selectedSysteme}`)
      if (!response.ok) throw new Error('Erreur lors du chargement des références')
      return response.json() as Promise<ReferenceImplant[]>
    },
    enabled: !!selectedSysteme
  })

  // Systèmes de la marque sélectionnée
  const systemesDisponibles = selectedMarque ? 
    marques?.find(m => m.id === selectedMarque)?.systemes || [] : []

  // Diamètres disponibles pour le système sélectionné
  const diametresDisponibles = selectedSysteme ? 
    [...new Set(references?.map(r => r.diametre) || [])].sort((a, b) => a - b) : []

  // Longueurs disponibles pour le diamètre sélectionné
  const longueursDisponibles = selectedDiametre ? 
    [...new Set(references?.filter(r => r.diametre === parseFloat(selectedDiametre))
      .map(r => r.longueur) || [])].sort((a, b) => a - b) : []

  // Implant sélectionné final
  useEffect(() => {
    if (selectedSysteme && selectedDiametre && selectedLongueur) {
      const implant = references?.find(r => 
        r.diametre === parseFloat(selectedDiametre) && 
        r.longueur === parseFloat(selectedLongueur)
      ) || null
      setSelectedImplant(implant)
      onImplantSelect?.(implant)
    } else {
      setSelectedImplant(null)
      onImplantSelect?.(null)
    }
  }, [selectedSysteme, selectedDiametre, selectedLongueur, references, onImplantSelect])

  // Reset des sélections en cascade
  useEffect(() => {
    setSelectedSysteme('')
    setSelectedDiametre('')
    setSelectedLongueur('')
  }, [selectedMarque])

  useEffect(() => {
    setSelectedDiametre('')
    setSelectedLongueur('')
  }, [selectedSysteme])

  useEffect(() => {
    setSelectedLongueur('')
  }, [selectedDiametre])

  // Fonction pour déterminer la couleur du stock
  const getStockColor = (stock?: { quantiteStock: number; seuilAlerte: number }) => {
    if (!stock) return 'bg-gray-100 text-gray-600'
    if (stock.quantiteStock === 0) return 'bg-red-100 text-red-700'
    if (stock.quantiteStock <= stock.seuilAlerte) return 'bg-orange-100 text-orange-700'
    return 'bg-green-100 text-green-700'
  }

  if (loadingMarques) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Chargement des catalogues...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Sélection d'Implant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sélection Marque */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Marque</label>
          <Select value={selectedMarque} onValueChange={setSelectedMarque}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une marque" />
            </SelectTrigger>
            <SelectContent>
              {marques?.map(marque => (
                <SelectItem key={marque.id} value={marque.id}>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{marque.nom}</span>
                    <Badge variant="outline" className="ml-2">
                      {marque.pays}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sélection Système */}
        {selectedMarque && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Système</label>
            <Select value={selectedSysteme} onValueChange={setSelectedSysteme}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un système" />
              </SelectTrigger>
              <SelectContent>
                {systemesDisponibles.map(systeme => (
                  <SelectItem key={systeme.id} value={systeme.id}>
                    <div className="space-y-1">
                      <div className="font-medium">{systeme.nom}</div>
                      <div className="text-xs text-gray-600">{systeme.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sélections Diamètre et Longueur côte à côte */}
        {selectedSysteme && (
          <div className="grid grid-cols-2 gap-4">
            {/* Diamètre */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Diamètre (mm)</label>
              <Select value={selectedDiametre} onValueChange={setSelectedDiametre}>
                <SelectTrigger>
                  <SelectValue placeholder="Ø" />
                </SelectTrigger>
                <SelectContent>
                  {diametresDisponibles.map(diametre => (
                    <SelectItem key={diametre} value={diametre.toString()}>
                      Ø {diametre} mm
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Longueur */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Longueur (mm)</label>
              <Select 
                value={selectedLongueur} 
                onValueChange={setSelectedLongueur}
                disabled={!selectedDiametre}
              >
                <SelectTrigger>
                  <SelectValue placeholder="L" />
                </SelectTrigger>
                <SelectContent>
                  {longueursDisponibles.map(longueur => (
                    <SelectItem key={longueur} value={longueur.toString()}>
                      {longueur} mm
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Affichage de l'implant sélectionné */}
        {selectedImplant && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Implant Sélectionné</h4>
                {showStock && selectedImplant.stock && (
                  <Badge className={getStockColor(selectedImplant.stock)}>
                    Stock: {selectedImplant.stock.quantiteStock}
                  </Badge>
                )}
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                <div className="font-medium text-blue-900">
                  {selectedImplant.codeReference}
                </div>
                <div className="text-sm text-blue-700">
                  {selectedImplant.systeme.marque.nom} {selectedImplant.systeme.nom}
                </div>
                <div className="text-sm text-blue-600">
                  Ø {selectedImplant.diametre}mm × {selectedImplant.longueur}mm
                </div>
                {selectedImplant.plateformeProsthetique && (
                  <div className="text-xs text-blue-600">
                    Plateforme: {selectedImplant.plateformeProsthetique} 
                    ({selectedImplant.connexionDiametre}mm)
                  </div>
                )}
                {selectedImplant.prixUnitaire && (
                  <div className="text-sm font-medium text-blue-800">
                    Prix: {selectedImplant.prixUnitaire}€
                  </div>
                )}
              </div>

              {showStock && selectedImplant.stock && (
                <div className="text-xs text-gray-600">
                  <Info className="h-3 w-3 inline mr-1" />
                  Emplacement: {selectedImplant.stock.emplacement}
                </div>
              )}

              {showStock && selectedImplant.stock?.quantiteStock === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Implant en rupture de stock. Vérifier disponibilité avant chirurgie.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ImplantSelector