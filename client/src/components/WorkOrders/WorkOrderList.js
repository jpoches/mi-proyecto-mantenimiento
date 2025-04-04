// client/src/components/WorkOrders/WorkOrderList.js
import React from 'react';
import { FaEye, FaPlay, FaCheck, FaTrash } from 'react-icons/fa';

const WorkOrderList = ({ workOrders, onView, onUpdateStatus, onDelete, isAdmin }) => {
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
    in_progress: {
      color: 'bg-blue-100 text-blue-800',
      label: 'En Progreso'
    },
    completed: {
      color: 'bg-green-100 text-green-800',
      label: 'Completada'
    }
  };

  if (workOrders.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No hay órdenes de trabajo disponibles.</p>
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Técnico
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Programada
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workOrders.map((workOrder) => (
              <tr key={workOrder.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{workOrder.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {workOrder.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {workOrder.service_personnel?.name || 'No asignado'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {workOrder.request?.client?.name || 'Cliente no disponible'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(workOrder.scheduled_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[workOrder.status].color}`}>
                    {statusConfig[workOrder.status].label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onView(workOrder.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalles"
                    >
                      <FaEye />
                    </button>
                    
                    {workOrder.status === 'pending' && (
                      <button
                        onClick={() => onUpdateStatus(workOrder.id, 'in_progress')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Iniciar"
                      >
                        <FaPlay />
                      </button>
                    )}
                    
                    {workOrder.status === 'in_progress' && (
                      <button
                        onClick={() => onUpdateStatus(workOrder.id, 'completed')}
                        className="text-green-600 hover:text-green-900"
                        title="Completar"
                      >
                        <FaCheck />
                      </button>
                    )}
                    
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(workOrder.id)}
                        className="text-red-600 hover:text-red-900"
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
    </div>
  );
};

export default WorkOrderList;