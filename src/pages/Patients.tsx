import { useState } from 'react';
import { Plus, Search, Download, Upload, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - will be replaced with Supabase data
  const patients = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      dateNaissance: '1980-05-15',
      telephone: '06 12 34 56 78',
      email: 'marie.dupont@email.com',
      derniereVisite: '2025-07-20',
      status: 'Actif',
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Jean',
      dateNaissance: '1975-09-22',
      telephone: '06 98 76 54 32',
      email: 'jean.martin@email.com',
      derniereVisite: '2025-07-18',
      status: 'Actif',
    },
    {
      id: 3,
      nom: 'Lemaire',
      prenom: 'Sophie',
      dateNaissance: '1988-12-03',
      telephone: '06 55 44 33 22',
      email: 'sophie.lemaire@email.com',
      derniereVisite: '2025-06-25',
      status: 'Inactif',
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.telephone.includes(searchTerm)
  );

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-medical-text">Gestion des Patients</h1>
          <p className="text-muted-foreground">
            {filteredPatients.length} patient(s) trouvé(s)
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importer Excel
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter Excel
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Patient
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom, prénom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{patients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Patients Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.status === 'Actif').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Patients</CardTitle>
          <CardDescription>
            Gérez vos patients et leurs informations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dernière visite</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-accent/50">
                  <TableCell className="font-medium">{patient.nom}</TableCell>
                  <TableCell>{patient.prenom}</TableCell>
                  <TableCell>{calculateAge(patient.dateNaissance)} ans</TableCell>
                  <TableCell>{patient.telephone}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>
                    {new Date(patient.derniereVisite).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={patient.status === 'Actif' ? 'default' : 'secondary'}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun patient trouvé pour "{searchTerm}"
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Patients;