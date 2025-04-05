// client/src/components/Quotes/QuoteDetails.js
import React from 'react';
import { FaTimes, FaCheck, FaTrash } from 'react-icons/fa';

const QuoteDetails = ({ quote, onClose, onUpdate, onDelete, isAdmin }) => {
  const total = quote.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Detalles de Cotización</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Descripción</p>
            <p className="text-gray-900">{quote.description}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Solicitud Vinculada</p>
            <p className="text-gray-900">{quote.request ? quote.request.title : 'Sin solicitud'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estado</p>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              quote.status === 'approved' ? 'bg-green-100 text-green-800' :
              quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {quote.status === 'pending' ? 'Pendiente' :
               quote.status === 'approved' ? 'Aprobada' :
               'Rechazada'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ítems</p>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quote.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${item.unit_price.toFixed(2)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${(item.quantity * item.unit_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-lg font-semibold text-gray-900">${total.toFixed(2)}</p>
          </div>
          {quote.status === 'approved' && quote.invoice && (
            <div>
              <p className="text-sm text-gray-600">Factura Generada</p>
              <p className="text-gray-900">Factura #{quote.invoice.id}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          {quote.status === 'pending' && (
            <>
              <button
                onClick={() => onUpdate(quote.id, 'approved')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaCheck className="mr-2" /> Aprobar
              </button>
              <button
                onClick={() => onUpdate(quote.id, 'rejected')}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaTimes className="mr-2" /> Rechazar
              </button>
            </>
          )}
          {isAdmin && (
            <button
              onClick={() => onDelete(quote.id)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaTrash className="mr-2" /> Eliminar
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails;