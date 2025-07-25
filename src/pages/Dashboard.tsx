import { Plus, Calendar, Users, FileText, Activity, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AICommandDialog } from '@/components/AICommandDialog';

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-medical-text">Command Center</h1>
        <p className="text-lg text-muted-foreground">
          Décrivez votre situation, l'IA s'occupe du reste
        </p>
      </div>

      {/* Main Command Interface */}
      <AICommandDialog>
        <div className="w-full max-w-2xl p-8 border-2 border-dashed border-primary/30 rounded-xl hover:border-primary/50 transition-colors cursor-pointer bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="text-center space-y-4">
            <Sparkles className="h-12 w-12 text-primary mx-auto" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Commande Intelligente</h2>
              <p className="text-muted-foreground">
                Cliquez ici pour ouvrir l'assistant IA
              </p>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>"Pose un implant sur 16 pour Mme Dupont"</p>
              <p>"Ajoute à la to-do: ouvrir au livreur à 11h"</p>
              <p>"Ordonnance préop pour M. Martin"</p>
            </div>
          </div>
        </div>
      </AICommandDialog>

      {/* Quick shortcuts - very discrete */}
      <div className="flex gap-4 opacity-60 hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/patients')}
          className="text-xs"
        >
          Patients
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/reports')}
          className="text-xs"
        >
          Comptes Rendus
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/todo')}
          className="text-xs"
        >
          To-Do
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/stock')}
          className="text-xs"
        >
          Stock
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;