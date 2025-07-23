import { Plus, Calendar, Users, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Patients Actifs',
      value: '247',
      description: '+12 ce mois',
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'Comptes Rendus',
      value: '89',
      description: '+8 cette semaine',
      icon: FileText,
      color: 'text-primary',
    },
    {
      title: 'Rendez-vous Aujourd\'hui',
      value: '6',
      description: 'Prochains: 14h30',
      icon: Calendar,
      color: 'text-primary',
    },
    {
      title: 'Activité',
      value: '98%',
      description: 'Taux d\'occupation',
      icon: Activity,
      color: 'text-primary',
    },
  ];

  const recentReports = [
    {
      id: 1,
      patient: 'Marie Dupont',
      type: 'Bilan parodontal',
      date: '23/07/2025',
      status: 'Terminé',
    },
    {
      id: 2,
      patient: 'Jean Martin',
      type: 'Surfaçage',
      date: '22/07/2025',
      status: 'En cours',
    },
    {
      id: 3,
      patient: 'Sophie Lemaire',
      type: 'Chirurgie parodontale',
      date: '21/07/2025',
      status: 'Terminé',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-medical-text">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre cabinet
          </p>
        </div>
        <Button 
          onClick={() => navigate('/reports/new')}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Compte Rendu
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Comptes Rendus Récents</CardTitle>
            <CardDescription>
              Derniers rapports créés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{report.patient}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • {report.date}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'Terminé' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Raccourcis vers les tâches courantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/patients/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un patient
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/reports/new')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Créer un compte rendu
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/patients')}
              >
                <Users className="mr-2 h-4 w-4" />
                Voir tous les patients
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/reports')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Voir tous les comptes rendus
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;