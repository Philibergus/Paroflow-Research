import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search,
  MapPin,
  User,
  Phone
} from 'lucide-react'

interface RendezVous {
  id: string
  patient: {
    nom: string
    prenom: string
    telephone?: string
  }
  titre: string
  description?: string
  dateHeure: Date
  duree: number
  statut: 'planifie' | 'confirme' | 'annule' | 'termine'
  type: 'consultation' | 'chirurgie' | 'controle' | 'urgence'
  salle?: string
}

export default function RendezVous() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Données de test (en attendant l'API)
  const rendezVous: RendezVous[] = [
    {
      id: '1',
      patient: { nom: 'Dupont', prenom: 'Marie', telephone: '06 12 34 56 78' },
      titre: 'Contrôle post-implant',
      description: 'Vérification cicatrisation implant 34',
      dateHeure: new Date('2025-08-02T09:00:00'),
      duree: 30,
      statut: 'confirme',
      type: 'controle',
      salle: 'Salle 1'
    },
    {
      id: '2',
      patient: { nom: 'Martin', prenom: 'Jean', telephone: '06 98 76 54 32' },
      titre: 'Détartrage',
      description: 'Nettoyage prophylactique',
      dateHeure: new Date('2025-08-02T10:30:00'),
      duree: 45,
      statut: 'planifie',
      type: 'consultation',
      salle: 'Salle 2'
    },
    {
      id: '3',
      patient: { nom: 'Bernard', prenom: 'Sophie', telephone: '06 11 22 33 44' },
      titre: 'Pose implant 46',
      description: 'Chirurgie implantaire molaire',
      dateHeure: new Date('2025-08-02T14:00:00'),
      duree: 90,
      statut: 'confirme',
      type: 'chirurgie',
      salle: 'Bloc opératoire'
    }
  ]

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'confirme': return 'bg-green-100 text-green-800'
      case 'planifie': return 'bg-blue-100 text-blue-800'
      case 'annule': return 'bg-red-100 text-red-800'
      case 'termine': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'chirurgie': return 'bg-red-100 text-red-800'
      case 'urgence': return 'bg-orange-100 text-orange-800'
      case 'controle': return 'bg-purple-100 text-purple-800'
      case 'consultation': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const filteredRendezVous = rendezVous.filter(rdv => {
    const searchLower = searchTerm.toLowerCase()
    const rdvDate = rdv.dateHeure.toISOString().split('T')[0]
    
    return rdvDate === selectedDate && (
      rdv.patient.nom.toLowerCase().includes(searchLower) ||
      rdv.patient.prenom.toLowerCase().includes(searchLower) ||
      rdv.titre.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
          <p className="text-muted-foreground">
            Gestion du planning et des rendez-vous patients
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau RDV
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher patient ou traitement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      {/* Statistiques du jour */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RDV du jour</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredRendezVous.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmés</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredRendezVous.filter(rdv => rdv.statut === 'confirme').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(filteredRendezVous.reduce((total, rdv) => total + rdv.duree, 0) / 60)}h{filteredRendezVous.reduce((total, rdv) => total + rdv.duree, 0) % 60}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chirurgies</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredRendezVous.filter(rdv => rdv.type === 'chirurgie').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle>Planning du {new Date(selectedDate).toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</CardTitle>
          <CardDescription>
            {filteredRendezVous.length} rendez-vous programmés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRendezVous.length > 0 ? (
              filteredRendezVous
                .sort((a, b) => a.dateHeure.getTime() - b.dateHeure.getTime())
                .map((rdv) => (
                  <div
                    key={rdv.id}
                    className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center text-sm text-muted-foreground min-w-[60px]">
                      <div className="font-medium">{formatTime(rdv.dateHeure)}</div>
                      <div className="text-xs">{rdv.duree}min</div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{rdv.patient.prenom} {rdv.patient.nom}</h3>
                        <Badge variant="outline" className={getStatusColor(rdv.statut)}>
                          {rdv.statut}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(rdv.type)}>
                          {rdv.type}
                        </Badge>
                      </div>
                      
                      <div className="text-sm font-medium text-gray-900">
                        {rdv.titre}
                      </div>
                      
                      {rdv.description && (
                        <div className="text-sm text-muted-foreground">
                          {rdv.description}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        {rdv.salle && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{rdv.salle}</span>
                          </div>
                        )}
                        {rdv.patient.telephone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{rdv.patient.telephone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm">
                        Terminé
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun rendez-vous programmé pour cette date</p>
                <p className="text-sm">Cliquez sur "Nouveau RDV" pour en ajouter un</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}