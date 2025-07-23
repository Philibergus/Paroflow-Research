import { useState } from 'react';
import { Plus, Search, Mail, Phone, Edit, Trash2, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Correspondants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('tous');

  // Mock data - will be replaced with Supabase data
  const correspondants = [
    {
      id: 1,
      nom: 'Dr. Dubois',
      prenom: 'Jean',
      specialite: 'Dentiste généraliste',
      cabinet: 'Cabinet Dentaire Central',
      telephone: '01 42 33 44 55',
      email: 'j.dubois@cabinet-central.fr',
      adresse: '15 rue de la Paix, 75001 Paris',
      categorie: 'Praticien',
      dernierContact: '2025-07-20',
      nbReferrals: 12,
    },
    {
      id: 2,
      nom: 'Dr. Leroy',
      prenom: 'Marie',
      specialite: 'Orthodontiste',
      cabinet: 'Centre Orthodontique',
      telephone: '01 45 67 89 12',
      email: 'm.leroy@ortho-centre.fr',
      adresse: '8 avenue Victor Hugo, 75016 Paris',
      categorie: 'Spécialiste',
      dernierContact: '2025-07-18',
      nbReferrals: 8,
    },
    {
      id: 3,
      nom: 'Laboratoire Dental Pro',
      prenom: '',
      specialite: 'Prothèse dentaire',
      cabinet: 'Dental Pro Lab',
      telephone: '01 48 52 63 74',
      email: 'contact@dentalpro-lab.fr',
      adresse: '22 rue de l\'Industrie, 93100 Montreuil',
      categorie: 'Laboratoire',
      dernierContact: '2025-07-15',
      nbReferrals: 25,
    },
    {
      id: 4,
      nom: 'Dr. Martin',
      prenom: 'Paul',
      specialite: 'Chirurgien maxillo-facial',
      cabinet: 'Clinique Maxillo-Faciale',
      telephone: '01 55 44 33 22',
      email: 'p.martin@cmf-paris.fr',
      adresse: '12 boulevard Saint-Germain, 75005 Paris',
      categorie: 'Spécialiste',
      dernierContact: '2025-07-10',
      nbReferrals: 15,
    },
  ];

  const categories = ['tous', 'Praticien', 'Spécialiste', 'Laboratoire'];

  const filteredCorrespondants = correspondants.filter(correspondant => {
    const matchesSearch = 
      correspondant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      correspondant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      correspondant.specialite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      correspondant.cabinet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      correspondant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'tous' || correspondant.categorie === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-medical-text">Correspondants Médicaux</h1>
          <p className="text-muted-foreground">
            {filteredCorrespondants.length} correspondant(s) trouvé(s)
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Correspondant
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom, spécialité, cabinet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'tous' ? 'Toutes catégories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{correspondants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Spécialistes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {correspondants.filter(c => c.categorie === 'Spécialiste').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Correspondants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Correspondants</CardTitle>
          <CardDescription>
            Gérez votre réseau de correspondants médicaux
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom / Prénom</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Cabinet</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Référrals</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCorrespondants.map((correspondant) => (
                <TableRow key={correspondant.id} className="hover:bg-accent/50">
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">
                        {correspondant.prenom ? `${correspondant.prenom} ${correspondant.nom}` : correspondant.nom}
                      </div>
                      <div className="text-sm text-muted-foreground">{correspondant.adresse}</div>
                    </div>
                  </TableCell>
                  <TableCell>{correspondant.specialite}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      {correspondant.cabinet}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-3 w-3" />
                        {correspondant.telephone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-3 w-3" />
                        {correspondant.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      correspondant.categorie === 'Spécialiste' ? 'default' :
                      correspondant.categorie === 'Laboratoire' ? 'secondary' : 'outline'
                    }>
                      {correspondant.categorie}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-semibold text-primary">{correspondant.nbReferrals}</div>
                      <div className="text-xs text-muted-foreground">références</div>
                    </div>
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
          
          {filteredCorrespondants.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun correspondant trouvé pour "{searchTerm}"
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Correspondants;