import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload } from 'lucide-react';

interface AddProductDialogProps {
  children: React.ReactNode;
}

const AddProductDialog = ({ children }: AddProductDialogProps) => {
  const [formData, setFormData] = useState({
    nom: '',
    reference: '',
    categorie: '',
    nouvelleCategorie: '',
    quantiteStock: '',
    seuilAlerte: '',
    prix: '',
    fournisseur: '',
    description: '',
    codeBarres: '',
    dateExpiration: '',
    numeroBatch: '',
    certificationCE: false,
  });

  const categories = [
    'Instrumentation',
    'Pharmacie', 
    'Consommables',
    'Implantologie',
    'Matériaux',
    'Radiologie',
    'Prothèse',
    'Orthodontie',
    'Endodontie',
    'Parodontologie',
    'Chirurgie',
    'Anesthésie',
    'Autre'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement product creation logic
    console.log('Nouveau produit:', formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau produit</DialogTitle>
          <DialogDescription>
            Remplissez les informations du produit à ajouter au catalogue
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du produit *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="ex: Curettes Gracey 5-6"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reference">Référence</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="ex: CGR5-6"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categorie">Catégorie *</Label>
              <Select 
                value={formData.categorie} 
                onValueChange={(value) => setFormData({ ...formData, categorie: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {formData.categorie === 'Autre' && (
              <div className="space-y-2">
                <Label htmlFor="nouvelleCategorie">Nouvelle catégorie</Label>
                <Input
                  id="nouvelleCategorie"
                  value={formData.nouvelleCategorie}
                  onChange={(e) => setFormData({ ...formData, nouvelleCategorie: e.target.value })}
                  placeholder="Nom de la nouvelle catégorie"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantiteStock">Quantité en stock *</Label>
              <Input
                id="quantiteStock"
                type="number"
                value={formData.quantiteStock}
                onChange={(e) => setFormData({ ...formData, quantiteStock: e.target.value })}
                placeholder="0"
                min="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seuilAlerte">Seuil d'alerte *</Label>
              <Input
                id="seuilAlerte"
                type="number"
                value={formData.seuilAlerte}
                onChange={(e) => setFormData({ ...formData, seuilAlerte: e.target.value })}
                placeholder="10"
                min="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prix">Prix unitaire (€) *</Label>
              <Input
                id="prix"
                type="number"
                step="0.01"
                value={formData.prix}
                onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                placeholder="0.00"
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fournisseur">Fournisseur</Label>
            <Input
              id="fournisseur"
              value={formData.fournisseur}
              onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })}
              placeholder="ex: Hu-Friedy, Nobel Biocare..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codeBarres">Code-barres</Label>
              <Input
                id="codeBarres"
                value={formData.codeBarres}
                onChange={(e) => setFormData({ ...formData, codeBarres: e.target.value })}
                placeholder="Code-barres du produit"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numeroBatch">Numéro de lot</Label>
              <Input
                id="numeroBatch"
                value={formData.numeroBatch}
                onChange={(e) => setFormData({ ...formData, numeroBatch: e.target.value })}
                placeholder="Numéro de lot"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateExpiration">Date d'expiration</Label>
            <Input
              id="dateExpiration"
              type="date"
              value={formData.dateExpiration}
              onChange={(e) => setFormData({ ...formData, dateExpiration: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description détaillée du produit..."
              rows={3}
            />
          </div>

          {/* Zone de téléchargement d'image */}
          <div className="space-y-2">
            <Label>Photo du produit</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Glissez-déposez une image ou 
                  <button type="button" className="text-primary hover:text-primary/80 mx-1">
                    cliquez pour choisir
                  </button>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG jusqu'à 10MB
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <DialogTrigger asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogTrigger>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter le produit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;