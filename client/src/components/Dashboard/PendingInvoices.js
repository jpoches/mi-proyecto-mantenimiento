// client/src/components/Dashboard/PendingInvoices.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';

const PendingInvoices = ({ invoices }) => {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Función para formatear montos
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 italic">No hay facturas pendientes</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimiento
              </th>
              <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ver
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  #{invoice.id}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {invoice.client?.name || 'Cliente no disponible'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(invoice.amount)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(invoice.due_date)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/invoices#${invoice.id}`} className="text-blue-600 hover:text-blue-900">
                    <FaExternalLinkAlt />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right">
        <Link to="/invoices" className="text-sm text-blue-600 hover:text-blue-800">
          Ver todas las facturas
        </Link>
      </div>
    </div>
  );
};

export default PendingInvoices;