import { useState } from 'react'
import { usePatients } from '@/hooks/usePatients'
import { useCorrespondants } from '@/hooks/useCorrespondants'
import { useTraitements } from '@/hooks/useTraitements'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Heart,
  Package
} from 'lucide-react'
import { DentalChart, TreatmentTimelineEnhanced } from '@/components/dental'
import { PatientQueue } from '@/components/queue'

export default function Dashboard() {
  const { data: patientsData } = usePatients({ limit: 1 })
  const { data: correspondantsData } = useCorrespondants({ limit: 1 })
  const { data: traitementsData } = useTraitements({ limit: 5 })

  const totalPatients = patientsData?.pagination?.total || 0
  const totalCorrespondants = correspondantsData?.pagination?.total || 0
  const totalTraitements = traitementsData?.pagination?.total || 0

  const recentTreatments = traitementsData?.data?.slice(0, 5) || []

  // Stats intégrées cabinet + dentaire
  const stats = [
    {
      title: 'Patients actifs',
      value: totalPatients,
      description: 'Total des patients',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'RDV aujourd\'hui',
      value: 12, // Mock - à connecter à l'agenda
      description: 'Rendez-vous planifiés',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'File d\'attente',
      value: 8, // Mock - à connecter à la queue
      description: 'Patients en attente',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Cas urgents',
      value: 3, // Mock - à connecter aux urgences
      description: 'Nécessitent attention',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cabinet Dentaire</h1>
          <p className="text-gray-600 mt-1">
            Gestion complète et vue d'ensemble
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Interface dentaire intégrée */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="queue">File d'attente</TabsTrigger>
          <TabsTrigger value="treatments">Traitements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traitements récents</CardTitle>
                <CardDescription>
                  Les derniers traitements ajoutés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTreatments.length > 0 ? (
                    recentTreatments.map((treatment) => (
                      <div key={treatment.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                        <div>
                          <p className="font-medium">{treatment.type}</p>
                          <p className="text-sm text-gray-500">
                            {treatment.patient?.prenom} {treatment.patient?.nom}
                          </p>
                          <p className="text-xs text-gray-400">
                            Statut: {treatment.statut}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {treatment.dents && `Dents: ${treatment.dents}`}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Aucun traitement récent
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Correspondants</CardTitle>
                <CardDescription>
                  {totalCorrespondants} professionnels référents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Réseau médical constitué</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Voir les correspondants
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="queue">
          <PatientQueue />
        </TabsContent>
        
        <TabsContent value="treatments">
          <Card>
            <CardHeader>
              <CardTitle>Timeline des traitements</CardTitle>
              <CardDescription>
                Suivi détaillé des soins en cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TreatmentTimelineEnhanced />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}