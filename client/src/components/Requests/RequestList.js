// client/src/components/Requests/RequestList.js (corregido)
import React from 'react';
import { FaEye, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const RequestList = ({ requests = [], onView, onUpdate, onDelete, isAdmin }) => {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
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

  // Mapeo de prioridades a colores y etiquetas
  const priorityConfig = {
    low: {
      color: 'bg-blue-100 text-blue-800',
      label: 'Baja'
    },
    medium: {
      color: 'bg-yellow-100 text-yellow-800',
      label: 'Media'
    },
    high: {
      color: 'bg-red-100 text-red-800',
      label: 'Alta'
    }
  };

  // Asegurar que requests sea un array y no sea undefined
  if (!Array.isArray(requests) || requests.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No hay solicitudes disponibles.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              {isAdmin && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridad
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{request.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.title}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.client?.name || 'Cliente no disponible'}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(request.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[request.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                    {statusConfig[request.status]?.label || request.status || 'Desconocido'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityConfig[request.priority]?.color || 'bg-gray-100 text-gray-800'}`}>
                    {priorityConfig[request.priority]?.label || request.priority || 'Media'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onView && onView(request.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalles"
                    >
                      <FaEye />
                    </button>
                    
                    {isAdmin && request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onUpdate && onUpdate(request.id, 'approved')}
                          className="text-green-600 hover:text-green-900"
                          title="Aprobar"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => onUpdate && onUpdate(request.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                          title="Rechazar"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => onDelete && onDelete(request.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestList;