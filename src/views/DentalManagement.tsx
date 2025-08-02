import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Users, 
  Activity, 
  Calendar, 
  Circle,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  FileText,
  BarChart3
} from 'lucide-react'

// Import our new components
import PatientSearchEnhanced from '@/components/PatientSearchEnhanced'
import DentalChart from '@/components/DentalChart'
import TreatmentTimelineEnhanced from '@/components/TreatmentTimelineEnhanced'
import PatientQueue from '@/components/PatientQueue'
import { Patient } from '@/lib/api'

export default function DentalManagement() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [activeView, setActiveView] = useState<'dashboard' | 'patient' | 'queue'>('dashboard')

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setActiveView('patient')
  }

  const handleNewPatient = () => {
    // Logic to open patient creation form
    console.log('Create new patient')
  }

  // Mock data for dashboard stats
  const dashboardStats = {
    todayAppointments: 12,
    queueWaiting: 8,
    urgentCases: 3,
    treatmentsInProgress: 15
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.todayAppointments}</p>
                <p className="text-sm text-gray-600">RDV aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.queueWaiting}</p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.urgentCases}</p>
                <p className="text-sm text-gray-600">Cas urgents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.treatmentsInProgress}</p>
                <p className="text-sm text-gray-600">Traitements actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Recherche rapide</span>
          </CardTitle>
          <CardDescription>
            Trouvez rapidement un patient ou ajoutez-en un nouveau
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientSearchEnhanced
            onPatientSelect={handlePatientSelect}
            onNewPatient={handleNewPatient}
            showRecentPatients={true}
            showQueue={true}
          />
        </CardContent>
      </Card>

      {/* Today's Queue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>File d'attente rapide</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PatientQueue />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Activité du jour</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Consultations terminées</span>
                <Badge variant="secondary">7</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Chirurgies réalisées</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">Contrôles effectués</span>
                <Badge variant="secondary">5</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPatientView = () => {
    if (!selectedPatient) return null

    return (
      <div className="space-y-6">
        {/* Patient Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {selectedPatient.prenom} {selectedPatient.nom}
                </CardTitle>
                <CardDescription>
                  Patient ID: {selectedPatient.id} • Dossier médical
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Documents
                </Button>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Nouveau traitement
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Patient Tabs */}
        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="dental-chart" className="flex items-center space-x-2">
              <Circle className="h-4 w-4" />
              <span>Schéma dentaire</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <TreatmentTimelineEnhanced 
              patientId={selectedPatient.id}
              showScenarioBuilder={true}
            />
          </TabsContent>

          <TabsContent value="dental-chart" className="space-y-4">
            <DentalChart 
              patientId={selectedPatient.id}
              showLegend={true}
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Gestion des documents
                </h3>
                <p className="text-gray-500 mb-4">
                  Cette fonctionnalité sera disponible prochainement
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un document
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  const renderQueueView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Gestion de la file d'attente</span>
          </CardTitle>
          <CardDescription>
            Vue détaillée de tous les patients en attente de traitement
          </CardDescription>
        </CardHeader>
      </Card>
      
      <PatientQueue 
        onPatientSelect={handlePatientSelect}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">
                Gestion Dentaire Paroflow
              </h1>
              
              <nav className="flex space-x-4">
                <Button
                  variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setActiveView('dashboard')}
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Tableau de bord</span>
                </Button>
                
                <Button
                  variant={activeView === 'patient' ? 'default' : 'ghost'}
                  onClick={() => setActiveView('patient')}
                  disabled={!selectedPatient}
                  className="flex items-center space-x-2"
                >
                  <Circle className="h-4 w-4" />
                  <span>Patient</span>
                </Button>
                
                <Button
                  variant={activeView === 'queue' ? 'default' : 'ghost'}
                  onClick={() => setActiveView('queue')}
                  className="flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>File d'attente</span>
                </Button>
              </nav>
            </div>

            {selectedPatient && (
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Badge variant="outline">
                  Patient sélectionné: {selectedPatient.prenom} {selectedPatient.nom}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedPatient(null)
                    setActiveView('dashboard')
                  }}
                >
                  ✕
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'patient' && renderPatientView()}
        {activeView === 'queue' && renderQueueView()}
      </div>
    </div>
  )
}