// src/components/UI/ErrorBoundary.js
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para mostrar la UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de monitoreo de errores
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Aquí podrías enviar el error a un servicio como Sentry o LogRocket
    // if (process.env.NODE_ENV === 'production') {
    //   // Enviar a servicio de monitoreo
    // }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback personalizada
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-red-600 mb-3">¡Algo salió mal!</h1>
              <p className="text-gray-600">
                Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
              </p>
            </div>
            
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="mb-6 overflow-auto">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Detalles del error:</h2>
                <div className="bg-gray-100 p-4 rounded text-sm font-mono text-red-500 max-h-60 overflow-y-auto">
                  <p>{this.state.error.toString()}</p>
                  <pre className="mt-2 text-gray-700">
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={this.handleReload}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Recargar página
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;