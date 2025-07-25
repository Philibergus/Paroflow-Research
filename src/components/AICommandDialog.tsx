import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, FileText, Users, Package, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AICommandDialogProps {
  children: React.ReactNode;
}

export const AICommandDialog = ({ children }: AICommandDialogProps) => {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const { toast } = useToast();

  const exampleCommands = [
    "Pose un implant sur 16 pour Mme Dupont - prépare tout le workflow",
    "Ajoute dans la to-do list: ouvrir au livreur à 11h",
    "Charting pour M. Martin avec poches à 12 sur 14",
    "Ordonnance préopératoire implantaire pour Mme Leclerc"
  ];

  const processCommand = async () => {
    if (!command.trim()) return;

    setIsProcessing(true);
    setSuggestedActions([]);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI analysis based on command content
    const actions = [];
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('implant')) {
      actions.push('Préparer courrier correspondant');
      actions.push('Vérifier stock implants');
      actions.push('Créer consentement éclairé');
      actions.push('Programmer conseils pré/post-op');
    }

    if (lowerCommand.includes('to-do') || lowerCommand.includes('todo')) {
      actions.push('Ajouter à la liste des tâches');
    }

    if (lowerCommand.includes('ordonnance')) {
      actions.push('Générer ordonnance');
      actions.push('Envoyer par email');
    }

    if (lowerCommand.includes('charting')) {
      actions.push('Mettre à jour dossier patient');
      actions.push('Enregistrer mesures parodontales');
    }

    setSuggestedActions(actions);
    setIsProcessing(false);

    toast({
      title: "Commande analysée",
      description: `${actions.length} actions identifiées`,
      duration: 3000,
    });
  };

  const executeAction = (action: string) => {
    toast({
      title: "Action exécutée",
      description: action,
      duration: 2000,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Assistant IA - Command Center
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Command Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Décrivez votre situation ou demande :
            </label>
            <Textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Ex: Aujourd'hui je pose un implant sur 16 pour Mme Dupont..."
              rows={4}
              className="resize-none"
            />
            <Button 
              onClick={processCommand}
              disabled={isProcessing || !command.trim()}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Analyser et suggérer des actions
                </>
              )}
            </Button>
          </div>

          {/* Suggested Actions */}
          {suggestedActions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Actions suggérées :</h3>
              <div className="space-y-2">
                {suggestedActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">{action}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => executeAction(action)}
                    >
                      Exécuter
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Exemples de commandes :</h3>
            <div className="grid gap-2">
              {exampleCommands.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setCommand(example)}
                  className="text-left p-3 text-sm bg-accent/50 hover:bg-accent rounded-lg transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Actions rapides :</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Nouveau CR
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Users className="mr-2 h-4 w-4" />
                Voir patients
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Package className="mr-2 h-4 w-4" />
                Vérifier stock
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Agenda
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};