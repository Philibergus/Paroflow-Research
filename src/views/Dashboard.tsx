import { useState } from 'react'
import { usePatients } from '@/hooks/usePatients'
import { useCorrespondants } from '@/hooks/useCorrespondants'
import { useTraitements } from '@/hooks/useTraitements'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Activity,
  Plus,
  Search,
  CommandIcon
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import CommandBar from '@/components/CommandBar'

export default function Dashboard() {
  const [showCommandBar, setShowCommandBar] = useState(false)
  const [commandInput, setCommandInput] = useState('')

  const { data: patientsData } = usePatients({ limit: 1 })
  const { data: correspondantsData } = useCorrespondants({ limit: 1 })
  const { data: traitementsData } = useTraitements({ limit: 5 })

  const totalPatients = patientsData?.pagination?.total || 0
  const totalCorrespondants = correspondantsData?.pagination?.total || 0
  const totalTraitements = traitementsData?.pagination?.total || 0
  
  // Calculate revenue from treatments
  const totalRevenue = traitementsData?.data?.reduce((sum, treatment) => {
    return sum + (treatment.cout || 0)
  }, 0) || 0

  const recentTreatments = traitementsData?.data?.slice(0, 5) || []

  const stats = [
    {
      title: 'Patients actifs',
      value: totalPatients,
      description: 'Total des patients enregistrés',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Correspondants',
      value: totalCorrespondants,
      description: 'Professionnels référents',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Traitements',
      value: totalTraitements,
      description: 'En cours et terminés',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Chiffre d\'affaires',
      value: formatCurrency(totalRevenue),
      description: 'Total des traitements',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setShowCommandBar(true)
    }
  }

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown} tabIndex={-1}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble de votre cabinet dentaire
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setShowCommandBar(true)}
            className="flex items-center space-x-2"
          >
            <CommandIcon className="h-4 w-4" />
            <span>Actions rapides</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traitements récents</CardTitle>
            <CardDescription>
              Les derniers traitements ajoutés au système
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
                        Patient: {treatment.patient?.prenom} {treatment.patient?.nom}
                      </p>
                      <p className="text-xs text-gray-400">
                        Statut: {treatment.statut}
                      </p>
                    </div>
                    <div className="text-right">
                      {treatment.cout && (
                        <p className="font-medium">{formatCurrency(treatment.cout)}</p>
                      )}
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
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accès rapide aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col">
                <Plus className="h-6 w-6 mb-2" />
                Nouveau Patient
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                Planifier RDV
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <UserCheck className="h-6 w-6 mb-2" />
                Ajouter Correspondant
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Search className="h-6 w-6 mb-2" />
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Command Bar */}
      <CommandBar 
        open={showCommandBar} 
        onOpenChange={setShowCommandBar}
      />
    </div>
  )
}