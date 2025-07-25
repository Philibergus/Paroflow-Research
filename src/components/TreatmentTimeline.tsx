import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface TreatmentTimelineProps {
  patientName: string;
  onClose: () => void;
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 50, y: 200 },
    data: { 
      label: 'Première consultation',
      status: 'completed',
      date: '2025-01-15',
      duration: '1h'
    },
    style: { 
      backgroundColor: '#dcfce7', 
      borderColor: '#16a34a',
      color: '#166534'
    }
  },
  {
    id: '2',
    type: 'default',
    position: { x: 250, y: 200 },
    data: { 
      label: 'Bilan parodontal',
      status: 'completed',
      date: '2025-01-22',
      duration: '1h30'
    },
    style: { 
      backgroundColor: '#dcfce7', 
      borderColor: '#16a34a',
      color: '#166534'
    }
  },
  {
    id: '3',
    type: 'default',
    position: { x: 450, y: 200 },
    data: { 
      label: 'Surfaçage maxillaire (1ère séance)',
      status: 'completed',
      date: '2025-02-05',
      duration: '2h'
    },
    style: { 
      backgroundColor: '#dcfce7', 
      borderColor: '#16a34a',
      color: '#166534'
    }
  },
  {
    id: '4',
    type: 'default',
    position: { x: 700, y: 200 },
    data: { 
      label: 'Surfaçage maxillaire (2ème séance)',
      status: 'in-progress',
      date: '2025-02-12',
      duration: '2h'
    },
    style: { 
      backgroundColor: '#fef3c7', 
      borderColor: '#d97706',
      color: '#92400e'
    }
  },
  {
    id: '5',
    type: 'default',
    position: { x: 950, y: 200 },
    data: { 
      label: 'Surfaçage mandibulaire',
      status: 'pending',
      date: '2025-02-19',
      duration: '2h'
    },
    style: { 
      backgroundColor: '#f3f4f6', 
      borderColor: '#9ca3af',
      color: '#6b7280'
    }
  },
  {
    id: '6',
    type: 'default',
    position: { x: 1200, y: 200 },
    data: { 
      label: 'Cicatrisation (6-8 semaines)',
      status: 'pending',
      date: '2025-02-19 → 2025-04-16',
      duration: '8 semaines'
    },
    style: { 
      backgroundColor: '#f3f4f6', 
      borderColor: '#9ca3af',
      color: '#6b7280'
    }
  },
  {
    id: '7',
    type: 'default',
    position: { x: 1500, y: 200 },
    data: { 
      label: 'Réévaluation parodontale',
      status: 'pending',
      date: '2025-04-16',
      duration: '1h'
    },
    style: { 
      backgroundColor: '#f3f4f6', 
      borderColor: '#9ca3af',
      color: '#6b7280'
    }
  },
  // Branches après réévaluation
  {
    id: '8a',
    type: 'default',
    position: { x: 1800, y: 100 },
    data: { 
      label: 'Maintenance parodontale',
      status: 'pending',
      date: 'À déterminer',
      duration: 'Suivi régulier'
    },
    style: { 
      backgroundColor: '#dcfce7', 
      borderColor: '#16a34a',
      color: '#166534'
    }
  },
  {
    id: '8b',
    type: 'default',
    position: { x: 1800, y: 200 },
    data: { 
      label: 'Thérapeutique non chirurgicale',
      status: 'pending',
      date: 'À déterminer',
      duration: 'Nouveau cycle'
    },
    style: { 
      backgroundColor: '#dcfce7', 
      borderColor: '#16a34a',
      color: '#166534'
    }
  },
  {
    id: '8c',
    type: 'default',
    position: { x: 1800, y: 300 },
    data: { 
      label: 'Thérapeutique chirurgicale',
      status: 'pending',
      date: 'À déterminer',
      duration: 'Intervention'
    },
    style: { 
      backgroundColor: '#fed7d7', 
      borderColor: '#e53e3e',
      color: '#c53030'
    }
  }
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#16a34a', strokeWidth: 2 }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#16a34a', strokeWidth: 2 }
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#16a34a', strokeWidth: 2 }
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#16a34a', strokeWidth: 2 }
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#16a34a', strokeWidth: 2 }
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#16a34a', strokeWidth: 2 }
  },
  // Branches
  {
    id: 'e7-8a',
    source: '7',
    target: '8a',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#16a34a', strokeWidth: 2 },
    label: 'Tout va bien'
  },
  {
    id: 'e7-8b',
    source: '7',
    target: '8b',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#16a34a', strokeWidth: 2 },
    label: 'Poche réfractaire'
  },
  {
    id: 'e7-8c',
    source: '7',
    target: '8c',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#e53e3e', strokeWidth: 2 },
    label: 'Chirurgie nécessaire'
  }
];

export const TreatmentTimeline = ({ patientName, onClose }: TreatmentTimelineProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentStep, setCurrentStep] = useState(3); // Marie Dupont en cours à l'étape 4
  const [isPlaying, setIsPlaying] = useState(false);

  const maxSteps = 7; // 7 étapes principales avant les branches

  // Animation automatique
  useEffect(() => {
    if (isPlaying && currentStep < maxSteps) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, maxSteps));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, maxSteps]);

  // Mettre à jour le statut des nœuds en fonction du curseur
  useEffect(() => {
    setNodes(nodes => 
      nodes.map(node => {
        const nodeId = parseInt(node.id);
        let status = 'pending';
        let style = { 
          backgroundColor: '#f3f4f6', 
          borderColor: '#9ca3af',
          color: '#6b7280'
        };

        if (nodeId < currentStep) {
          status = 'completed';
          style = { 
            backgroundColor: '#dcfce7', 
            borderColor: '#16a34a',
            color: '#166534'
          };
        } else if (nodeId === currentStep) {
          status = 'in-progress';
          style = { 
            backgroundColor: '#fef3c7', 
            borderColor: '#d97706',
            color: '#92400e'
          };
        }

        // Maintenir les couleurs spéciales pour les branches
        if (node.id.includes('8c')) {
          style = status === 'pending' ? 
            { backgroundColor: '#fed7d7', borderColor: '#e53e3e', color: '#c53030' } :
            style;
        }

        return {
          ...node,
          data: { ...node.data, status },
          style
        };
      })
    );
  }, [currentStep, setNodes]);

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'in-progress';
    return 'pending';
  };

  const handleSliderChange = (value: number[]) => {
    setCurrentStep(value[0]);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-card">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Plan de traitement parodontal</h1>
              <p className="text-muted-foreground">{patientName}</p>
            </div>
          </div>
          
          {/* Timeline Controls */}
          <Card className="w-96">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayback}
                  disabled={currentStep >= maxSteps}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="flex-1">
                  <Slider
                    value={[currentStep]}
                    onValueChange={handleSliderChange}
                    max={maxSteps}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <Badge variant="outline">
                  {currentStep}/{maxSteps}
                </Badge>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Étape {currentStep}: {String(nodes.find(n => n.id === currentStep.toString())?.data.label || 'Inconnue')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Flow */}
        <div className="flex-1 bg-accent/30">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={true}
            zoomOnScroll={true}
            style={{ backgroundColor: '#fafafa' }}
          >
            <Background color="#ddd" gap={20} />
            <Controls showInteractive={false} />
            <MiniMap 
              nodeColor={(node) => {
                if (node.style?.backgroundColor) {
                  return node.style.backgroundColor as string;
                }
                return '#f3f4f6';
              }}
              position="bottom-right"
              pannable
              zoomable
            />
          </ReactFlow>
        </div>

        {/* Legend */}
        <div className="border-t p-4 bg-card">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-green-200 border border-green-600"></div>
              <span className="text-sm">Traitement parodontal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-red-200 border border-red-600"></div>
              <span className="text-sm">Traitement chirurgical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-yellow-200 border border-yellow-600"></div>
              <span className="text-sm">En cours</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gray-200 border border-gray-400"></div>
              <span className="text-sm">À venir</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};