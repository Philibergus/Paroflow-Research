import { useState } from 'react';
import { Plus, Search, FileText, Download, Mail, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const navigate = useNavigate();

  // Mock data - will be replaced with Supabase data
  const reports = [
    {
      id: 1,
      patient: 'Marie Dupont',
      type: 'Bilan parodontal',
      date: '2025-07-23',
      status: 'Terminé',
      hasImages: true,
      notes: 'Bilan complet avec radiographies',
    },
    {
      id: 2,
      patient: 'Jean Martin',
      type: 'Surfaçage',
      date: '2025-07-22',
      status: 'En cours',
      hasImages: false,
      notes: 'Séance 1/3 du traitement parodontal',
    },
    {
      id: 3,
      patient: 'Sophie Lemaire',
      type: 'Chirurgie parodontale',
      date: '2025-07-21',
      status: 'Terminé',
      hasImages: true,
      notes: 'Greffe gingivale secteur antérieur',
    },
    {
      id: 4,
      patient: 'Pierre Dubois',
      type: 'Implant',
      date: '2025-07-20',
      status: 'Planifié',
      hasImages: false,
      notes: 'Implant unitaire 16',
    },
  ];

  const interventionTypes = [
    'Bilan parodontal',
    'Surfaçage',
    'Chirurgie parodontale',
    'Implant',
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'Planifié':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-medical-text">Comptes Rendus Médicaux</h1>
          <p className="text-muted-foreground">
            {filteredReports.length} compte(s) rendu(s) trouvé(s)
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

      {/* Filters and Search */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par patient, type d'intervention ou notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filtrer par type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {interventionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Terminés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === 'Terminé').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {reports.filter(r => r.status === 'En cours').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Avec images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reports.filter(r => r.hasImages).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="grid gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold">{report.patient}</h3>
                    <Badge variant="outline">{report.type}</Badge>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    {report.hasImages && (
                      <Badge variant="secondary">
                        <FileText className="mr-1 h-3 w-3" />
                        Images
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(report.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm">{report.notes}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" title="Voir">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Modifier">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Générer PDF">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Envoyer par email">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" title="Supprimer">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun compte rendu trouvé</h3>
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par créer votre premier compte rendu'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;