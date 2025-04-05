// client/src/components/Quotes/QuoteList.js
import React from 'react';
import { FaEye, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

const QuoteList = ({ quotes, onView, onUpdate, onDelete, isAdmin }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {quotes.length === 0 ? (
        <p className="p-4 text-gray-500 text-center">No hay cotizaciones disponibles</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitud</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map(quote => (
                <tr key={quote.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quote.request ? quote.request.title : 'Sin solicitud'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${quote.total?.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                      quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {quote.status === 'pending' ? 'Pendiente' :
                       quote.status === 'approved' ? 'Aprobada' :
                       'Rechazada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onView(quote.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      {quote.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onUpdate(quote.id, 'approved')}
                            className="text-green-600 hover:text-green-800"
                            title="Aprobar"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => onUpdate(quote.id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                            title="Rechazar"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => onDelete(quote.id)}
                          className="text-red-600 hover:text-red-800"
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