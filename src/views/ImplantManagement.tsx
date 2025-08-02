import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import ImplantSelector from "@/components/implants/ImplantSelector"
import { Package, Search, AlertTriangle, TrendingUp, Plus } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ReferenceImplant {
  id: string
  codeReference: string
  diametre: number
  longueur: number
  plateformeProsthetique: string
  prixUnitaire: number
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

interface StockAlert {
  id: string
  codeReference: string
  quantiteStock: number
  seuilAlerte: number
  marque: string
  systeme: string
}

const ImplantManagement: React.FC = () => {
  const [selectedImplant, setSelectedImplant] = useState<ReferenceImplant | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Récupération de toutes les références avec stock
  const { data: stockData, isLoading: loadingStock, refetch: refetchStock } = useQuery({
    queryKey: ['stock-implants'],
    queryFn: async () => {
      const response = await fetch('/api/implants/stock')
      if (!response.ok) throw new Error('Erreur lors du chargement du stock')
      return response.json() as Promise<ReferenceImplant[]>
    }
  })

  // Récupération des alertes stock
  const { data: alertes, isLoading: loadingAlertes } = useQuery({
    queryKey: ['alertes-stock'],
    queryFn: async () => {
      const response = await fetch('/api/implants/alertes')
      if (!response.ok) throw new Error('Erreur lors du chargement des alertes')
      return response.json() as Promise<StockAlert[]>
    }
  })

  // Filtrage du stock selon la recherche
  const stockFiltered = stockData?.filter(item =>
    item.codeReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.systeme.marque.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.systeme.nom.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  // Statistiques stock
  const statsStock = {
    totalReferences: stockData?.length || 0,
    referencesEnStock: stockData?.filter(item => (item.stock?.quantiteStock || 0) > 0).length || 0,
    referencesRupture: stockData?.filter(item => (item.stock?.quantiteStock || 0) === 0).length || 0,
    referencesAlerte: alertes?.length || 0
  }

  const getStockColor = (stock?: { quantiteStock: number; seuilAlerte: number }) => {
    if (!stock) return 'bg-gray-100 text-gray-600'
    if (stock.quantiteStock === 0) return 'bg-red-100 text-red-700'
    if (stock.quantiteStock <= stock.seuilAlerte) return 'bg-orange-100 text-orange-700'
    return 'bg-green-100 text-green-700'
  }

  const handleImplantSelect = (implant: ReferenceImplant | null) => {
    setSelectedImplant(implant)
  }

  if (loadingStock) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Chargement du module implants...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Implants</h1>
          <p className="text-gray-600 mt-1">
            Catalogue, stock et sélection d'implants dentaires
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Implant
        </Button>
      </div>

      {/* Statistiques Stock */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Références</p>
                <p className="text-2xl font-bold">{statsStock.totalReferences}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Stock</p>
                <p className="text-2xl font-bold text-green-600">{statsStock.referencesEnStock}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertes Stock</p>
                <p className="text-2xl font-bold text-orange-600">{statsStock.referencesAlerte}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ruptures</p>
                <p className="text-2xl font-bold text-red-600">{statsStock.referencesRupture}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes Stock */}
      {alertes && alertes.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{alertes.length} alerte(s) stock :</strong> {alertes.map(a => a.codeReference).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="selector" className="space-y-4">
        <TabsList>
          <TabsTrigger value="selector">Sélecteur d'Implant</TabsTrigger>
          <TabsTrigger value="stock">Gestion Stock</TabsTrigger>
          <TabsTrigger value="catalog">Catalogue Complet</TabsTrigger>
        </TabsList>

        {/* Onglet Sélecteur */}
        <TabsContent value="selector" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ImplantSelector 
              onImplantSelect={handleImplantSelect}
              showStock={true}
              className="h-fit"
            />
            
            {selectedImplant && (
              <Card>
                <CardHeader>
                  <CardTitle>Informations Détaillées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Spécifications Techniques</h4>
                    <div className="bg-gray-50 p-3 rounded space-y-1 text-sm">
                      <div><strong>Code:</strong> {selectedImplant.codeReference}</div>
                      <div><strong>Marque:</strong> {selectedImplant.systeme.marque.nom}</div>
                      <div><strong>Système:</strong> {selectedImplant.systeme.nom}</div>
                      <div><strong>Dimensions:</strong> Ø{selectedImplant.diametre}mm × {selectedImplant.longueur}mm</div>
                      <div><strong>Plateforme:</strong> {selectedImplant.plateformeProsthetique}</div>
                      {selectedImplant.prixUnitaire && (
                        <div><strong>Prix:</strong> {selectedImplant.prixUnitaire}€</div>
                      )}
                    </div>
                  </div>

                  {selectedImplant.stock && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Stock</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getStockColor(selectedImplant.stock)}>
                          {selectedImplant.stock.quantiteStock} unités
                        </Badge>
                        <span className="text-sm text-gray-600">
                          ({selectedImplant.stock.emplacement})
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm">Utiliser en Chirurgie</Button>
                    <Button size="sm" variant="outline">Ajouter au Stock</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Onglet Gestion Stock */}
        <TabsContent value="stock" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans le stock..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => refetchStock()}>
              Actualiser
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>État du Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stockFiltered.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{item.codeReference}</div>
                      <div className="text-sm text-gray-600">
                        {item.systeme.marque.nom} {item.systeme.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        Ø{item.diametre}mm × {item.longueur}mm
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={getStockColor(item.stock)}>
                        {item.stock?.quantiteStock || 0} unités
                      </Badge>
                      {item.stock?.emplacement && (
                        <div className="text-xs text-gray-500">
                          {item.stock.emplacement}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Catalogue */}
        <TabsContent value="catalog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Catalogue Complet</CardTitle>
              <p className="text-sm text-gray-600">
                Toutes les références disponibles par marque et système
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Vue catalogue en cours de développement...
                <br />
                Utilisez le sélecteur d'implant pour explorer le catalogue.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ImplantManagement