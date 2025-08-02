import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  context?: string; // Pour identifier d'où vient l'erreur
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Logger l'erreur pour que Claude puisse la voir
    const errorLog = {
      timestamp: new Date().toISOString(),
      context: this.props.context || 'Unknown',
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Sauvegarder en localStorage pour récupération par Claude
    const existingLogs = JSON.parse(localStorage.getItem('paroflow-errors') || '[]');
    existingLogs.push(errorLog);
    localStorage.setItem('paroflow-errors', JSON.stringify(existingLogs));

    // Log dans la console aussi
    console.error('🚨 Error Boundary activé:', {
      context: this.props.context,
      error: error.message,
      component: errorInfo.componentStack
    });

    // En développement, afficher plus d'infos
    if (process.env.NODE_ENV === 'development') {
      console.group('🔍 Détails erreur pour debugging');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Props context:', this.props.context);
      console.groupEnd();
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback custom ou fallback par défaut
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Erreur dans {this.props.context || 'ce composant'}</span>
            </CardTitle>
            <CardDescription className="text-red-600">
              Une erreur s'est produite lors du chargement de cette section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-100 p-3 rounded text-sm font-mono text-red-800">
                <strong>Message:</strong> {this.state.error?.message}<br/>
                <strong>Stack:</strong> {this.state.error?.stack?.split('\n')[0]}
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => this.setState({ hasError: false })}
                className="flex items-center space-x-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Réessayer</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
              >
                Recharger la page
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;