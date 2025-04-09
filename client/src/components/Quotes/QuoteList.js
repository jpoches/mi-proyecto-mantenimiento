// client/src/components/Quotes/QuoteList.js
import React from 'react';
import { FaEye, FaCheck, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatters';

const QuoteList = ({ quotes = [], onView, onEdit, onUpdate, onDelete, isAdmin }) => {
  // Función para obtener el color según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener el texto según el estado
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      default:
        return status;
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {quotes.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No hay cotizaciones disponibles</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solicitud
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map(quote => (
                <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{quote.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {quote.description?.length > 40 
                      ? `${quote.description.substring(0, 40)}...` 
                      : quote.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quote.request ? quote.request.title : 'Sin solicitud'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(quote.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(quote.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                      {getStatusText(quote.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onView(quote.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      
                      {quote.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onUpdate(quote.id, 'approved')}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Aprobar"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => onUpdate(quote.id, 'rejected')}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Rechazar"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      
                      {/* Botón de editar solo disponible para cotizaciones pendientes */}
                      {quote.status === 'pending' && (
                        <button
                          onClick={() => onEdit(quote.id)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                      )}
                      
                      {isAdmin && (
                        <button
                          onClick={() => onDelete(quote.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuoteList;