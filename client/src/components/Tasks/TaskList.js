// client/src/components/Tasks/TaskList.js
import React from 'react';
import { FaPlay, FaCheck, FaTrash } from 'react-icons/fa';

const TaskList = ({ tasks, onUpdateStatus, onDelete, isAdmin }) => {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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

  // Función para calcular el tiempo transcurrido
  const getElapsedTime = (startTime, endTime) => {
    if (!startTime) return null;
    
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    
    // Diferencia en milisegundos
    const diffMs = end - start;
    
    // Convertir a minutos
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours} h ${minutes} min`;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No hay tareas disponibles.</p>
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
                Descripción
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orden de Trabajo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiempo Estimado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiempo Real
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{task.id}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {task.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.work_order ? `#${task.work_order.id} - ${task.work_order.title}` : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[task.status].color}`}>
                    {statusConfig[task.status].label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.estimated_time ? `${task.estimated_time} min` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.start_time ? 
                    getElapsedTime(task.start_time, task.end_time) : 
                    '-'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => onUpdateStatus(task.id, 'in_progress')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Iniciar tarea"
                      >
                        <FaPlay />
                      </button>
                    )}
                    
                    {task.status === 'in_progress' && (
                      <button
                        onClick={() => onUpdateStatus(task.id, 'completed')}
                        className="text-green-600 hover:text-green-900"
                        title="Marcar como completada"
                      >
                        <FaCheck />
                      </button>
                    )}
                    
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(task.id)}
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

export default TaskList;