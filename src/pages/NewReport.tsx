import { useState } from 'react';
import { Save, Download, Mail, Upload, X, FileText, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const NewReport = () => {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [interventionType, setInterventionType] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Mock patients data
  const patients = [
    { id: 1, name: 'Marie Dupont' },
    { id: 2, name: 'Jean Martin' },
    { id: 3, name: 'Sophie Lemaire' },
    { id: 4, name: 'Pierre Dubois' },
  ];

  const interventionTypes = [
    'Bilan parodontal',
    'Surfaçage',
    'Chirurgie parodontale',
    'Implant',
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (uploadedImages.length + files.length > 5) {
      alert('Maximum 5 images autorisées');
      return;
    }
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const getTemplate = (type: string) => {
    switch (type) {
      case 'Bilan parodontal':
        return `BILAN PARODONTAL

CONTEXTE CLINIQUE
Patient : ${selectedPatient}
Date d'examen : ${new Date().toLocaleDateString('fr-FR')}

ANTÉCÉDENTS
- Médicaux :
- Dentaires :
- Habitudes (tabac, etc.) :

EXAMEN PARODONTAL
- Indice de plaque (IP) :
- Indice de saignement (IS) :
- Classification EFP 2017 :
  * Stade : 
  * Grade :
  * Étendue :

DIAGNOSTIC
- 

PLAN DE TRAITEMENT
1. Phase étiologique :
2. Phase correctrice :
3. Phase de maintenance :

PRONOSTIC
- 

Dr. [Nom]
Spécialiste en Parodontologie`;

      case 'Surfaçage':
        return `COMPTE RENDU DE SURFAÇAGE

Patient : ${selectedPatient}
Date : ${new Date().toLocaleDateString('fr-FR')}

SÉANCE DE SURFAÇAGE
Secteur traité :
Anesthésie :
Technique :

OBSERVATIONS
- État gingival :
- Saignement :
- Calculs résiduels :

PRESCRIPTIONS
- 

SUIVI
Prochaine séance :
Contrôle :

Recommandations d'hygiène :
- 

Dr. [Nom]`;

      default:
        return '';
    }
  };

  const handleTypeChange = (type: string) => {
    setInterventionType(type);
    const template = getTemplate(type);
    if (template && !reportContent) {
      setReportContent(template);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-medical-text">Nouveau Compte Rendu</h1>
          <p className="text-muted-foreground">
            Créer un nouveau rapport médical
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/reports')}>
            Annuler
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient and Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informations Générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient *</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.name}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type d'intervention *</Label>
                  <Select value={interventionType} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {interventionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Contenu du Rapport
              </CardTitle>
              <CardDescription>
                Rédigez ou dictez le contenu du compte rendu médical
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Saisissez le contenu du rapport médical..."
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                className="min-h-96 resize-none"
              />
            </CardContent>
          </Card>

          {/* Images Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Images Médicales</CardTitle>
              <CardDescription>
                Ajoutez jusqu'à 5 images (radiographies, photos cliniques, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Upload Area */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-accent/50 transition-colors">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Glissez-déposez vos images ici ou cliquez pour parcourir
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    Sélectionner des images
                  </label>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {uploadedImages.length}/5 images téléchargées
                </p>
              </div>

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Générer PDF
              </Button>
              <Button className="w-full" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Envoyer par Email
              </Button>
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer Brouillon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aide</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Sélectionnez un patient pour pré-remplir les informations</p>
              <p>• Choisissez un type d'intervention pour charger un template</p>
              <p>• Utilisez Ctrl+S pour sauvegarder rapidement</p>
              <p>• Maximum 5 images par rapport</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewReport;