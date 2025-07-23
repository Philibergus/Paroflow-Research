import { useState } from 'react';
import { Plus, Search, Package, AlertTriangle, TrendingDown, ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Stock = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('tous');

  // Mock data - will be replaced with Supabase data
  const products = [
    {
      id: 1,
      nom: 'Curettes Gracey 5-6',
      reference: 'CGR5-6',
      categorie: 'Instrumentation',
      quantiteStock: 25,
      seuilAlerte: 10,
      prix: 45.80,
      fournisseur: 'Hu-Friedy',
      derniereMaj: '2025-07-20',
      utilisationMensuelle: 8,
      status: 'En stock',
    },
    {
      id: 2,
      nom: 'Anesthésique Lidocaïne 2%',
      reference: 'LID2-20',
      categorie: 'Pharmacie',
      quantiteStock: 5,
      seuilAlerte: 15,
      prix: 23.50,
      fournisseur: 'Pierre Fabre',
      derniereMaj: '2025-07-18',
      utilisationMensuelle: 12,
      status: 'Stock faible',
    },
    {
      id: 3,
      nom: 'Gants nitrile S',
      reference: 'GNT-S-100',
      categorie: 'Consommables',
      quantiteStock: 45,
      seuilAlerte: 20,
      prix: 12.90,
      fournisseur: 'Medistock',
      derniereMaj: '2025-07-15',
      utilisationMensuelle: 25,
      status: 'En stock',
    },
    {
      id: 4,
      nom: 'Implant Nobel Replace',
      reference: 'NR4.3-10',
      categorie: 'Implantologie',
      quantiteStock: 2,
      seuilAlerte: 5,
      prix: 195.00,
      fournisseur: 'Nobel Biocare',
      derniereMaj: '2025-07-10',
      utilisationMensuelle: 3,
      status: 'Stock critique',
    },
    {
      id: 5,
      nom: 'Composite Z250',
      reference: 'Z250-A2',
      categorie: 'Matériaux',
      quantiteStock: 8,
      seuilAlerte: 5,
      prix: 89.50,
      fournisseur: '3M ESPE',
      derniereMaj: '2025-07-12',
      utilisationMensuelle: 4,
      status: 'En stock',
    },
  ];

  const categories = ['tous', 'Instrumentation', 'Pharmacie', 'Consommables', 'Implantologie', 'Matériaux'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.fournisseur.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'tous' || product.categorie === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En stock': return 'default';
      case 'Stock faible': return 'secondary';
      case 'Stock critique': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'En stock': return <Package className="h-4 w-4" />;
      case 'Stock faible': return <TrendingDown className="h-4 w-4" />;
      case 'Stock critique': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const stockCritique = products.filter(p => p.status === 'Stock critique').length;
  const stockFaible = products.filter(p => p.status === 'Stock faible').length;
  const valeurtotale = products.reduce((total, p) => total + (p.quantiteStock * p.prix), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-medical-text">Gestion du Stock</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} produit(s) en catalogue
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Nouvelle Commande
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter Produit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Total Produits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Stock Critique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stockCritique}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <TrendingDown className="mr-2 h-4 w-4" />
              Stock Faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stockFaible}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Valeur Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {valeurtotale.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stockCritique + stockFaible}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
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
                placeholder="Rechercher par nom, référence, fournisseur..."
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
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Catalogue Produits</CardTitle>
          <CardDescription>
            Gérez votre stock et suivez les alertes de réapprovisionnement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Prix unitaire</TableHead>
                <TableHead>Valeur stock</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-accent/50">
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{product.nom}</div>
                      <div className="text-sm text-muted-foreground">Réf: {product.reference}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.categorie}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold">{product.quantiteStock}</div>
                      <div className="text-xs text-muted-foreground">
                        Seuil: {product.seuilAlerte}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.prix.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      {(product.quantiteStock * product.prix).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </div>
                  </TableCell>
                  <TableCell>{product.fournisseur}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(product.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(product.status)}
                      {product.status}
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
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun produit trouvé pour "{searchTerm}"
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Stock;