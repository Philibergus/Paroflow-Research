import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, Package } from 'lucide-react';

interface NewOrderDialogProps {
  children: React.ReactNode;
}

interface OrderItem {
  id: number;
  nom: string;
  reference: string;
  prix: number;
  quantite: number;
  stockActuel: number;
}

const NewOrderDialog = ({ children }: NewOrderDialogProps) => {
  const [formData, setFormData] = useState({
    fournisseur: '',
    dateCommande: new Date().toISOString().split('T')[0],
    dateLivraison: '',
    numCommande: '',
    notes: '',
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  // Mock products data
  const availableProducts = [
    { id: 1, nom: 'Curettes Gracey 5-6', reference: 'CGR5-6', prix: 45.80, stockActuel: 25, fournisseur: 'Hu-Friedy' },
    { id: 2, nom: 'Anesthésique Lidocaïne 2%', reference: 'LID2-20', prix: 23.50, stockActuel: 5, fournisseur: 'Pierre Fabre' },
    { id: 3, nom: 'Gants nitrile S', reference: 'GNT-S-100', prix: 12.90, stockActuel: 45, fournisseur: 'Medistock' },
    { id: 4, nom: 'Implant Nobel Replace', reference: 'NR4.3-10', prix: 195.00, stockActuel: 2, fournisseur: 'Nobel Biocare' },
  ];

  const fournisseurs = [...new Set(availableProducts.map(p => p.fournisseur))];

  const addProductToOrder = () => {
    const product = availableProducts.find(p => p.id.toString() === selectedProduct);
    if (product && !orderItems.find(item => item.id === product.id)) {
      setOrderItems([...orderItems, { ...product, quantite: 1 }]);
      setSelectedProduct('');
    }
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProduct(id);
      return;
    }
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, quantite: newQuantity } : item
    ));
  };

  const removeProduct = (id: number) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const totalCommande = orderItems.reduce((total, item) => total + (item.prix * item.quantite), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement order creation logic
    console.log('Nouvelle commande:', { formData, orderItems, totalCommande });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle commande</DialogTitle>
          <DialogDescription>
            Créez une nouvelle commande de réapprovisionnement
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations commande */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fournisseur">Fournisseur *</Label>
              <Select 
                value={formData.fournisseur} 
                onValueChange={(value) => setFormData({ ...formData, fournisseur: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  {fournisseurs.map((fournisseur) => (
                    <SelectItem key={fournisseur} value={fournisseur}>{fournisseur}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numCommande">N° de commande</Label>
              <Input
                id="numCommande"
                value={formData.numCommande}
                onChange={(e) => setFormData({ ...formData, numCommande: e.target.value })}
                placeholder="Généré automatiquement"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateCommande">Date de commande *</Label>
              <Input
                id="dateCommande"
                type="date"
                value={formData.dateCommande}
                onChange={(e) => setFormData({ ...formData, dateCommande: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateLivraison">Date de livraison souhaitée</Label>
              <Input
                id="dateLivraison"
                type="date"
                value={formData.dateLivraison}
                onChange={(e) => setFormData({ ...formData, dateLivraison: e.target.value })}
              />
            </div>
          </div>

          {/* Ajout de produits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Produits à commander</h3>
            
            <div className="flex gap-2">
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sélectionner un produit à ajouter" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts
                    .filter(p => formData.fournisseur === '' || p.fournisseur === formData.fournisseur)
                    .map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.nom} - {product.reference} (Stock: {product.stockActuel})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addProductToOrder} disabled={!selectedProduct}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Liste des produits commandés */}
            {orderItems.length > 0 && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Stock actuel</TableHead>
                      <TableHead>Prix unitaire</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.nom}</div>
                            <div className="text-sm text-muted-foreground">Réf: {item.reference}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.stockActuel <= 5 ? "destructive" : "outline"}>
                            <Package className="h-3 w-3 mr-1" />
                            {item.stockActuel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.prix.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantite - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantite}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantite + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {(item.prix * item.quantite).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="p-4 border-t">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total de la commande:</span>
                    <span className="text-primary">
                      {totalCommande.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes ou instructions particulières..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <DialogTrigger asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogTrigger>
            <Button type="submit" disabled={orderItems.length === 0}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Créer la commande
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewOrderDialog;