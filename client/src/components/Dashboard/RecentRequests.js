// client/src/components/Dashboard/RecentRequests.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';

const RecentRequests = ({ requests }) => {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Mapeo de estados a colores y etiquetas
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      label: 'Pendiente'
    },
    approved: {
      color: 'bg-green-100 text-green-800',
      label: 'Aprobada'
    },
    rejected: {
      color: 'bg-red-100 text-red-800',
      label: 'Rechazada'
    }
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 italic">No hay solicitudes recientes</p>
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
                Título
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ver
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  #{request.id}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {request.title}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(request.created_at)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[request.status].color}`}>
                    {statusConfig[request.status].label}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/requests#${request.id}`} className="text-blue-600 hover:text-blue-900">
                    <FaExternalLinkAlt />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right">
        <Link to="/requests" className="text-sm text-blue-600 hover:text-blue-800">
          Ver todas las solicitudes
        </Link>
      </div>
    </div>
  );
};

export default RecentRequests;