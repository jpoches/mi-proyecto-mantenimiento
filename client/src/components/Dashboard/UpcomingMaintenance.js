// client/src/components/Dashboard/UpcomingMaintenance.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaCalendarAlt } from 'react-icons/fa';

const UpcomingMaintenance = ({ events }) => {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 italic">No hay mantenimientos programados próximamente</p>
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
                Título
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orden
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ver
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">
                  {event.title}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {event.work_order ? `#${event.work_order.id}` : '-'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {formatDate(event.event_date)}
                </td>
                <td className="px-4 py-2 text-right text-sm font-medium">
                  <Link to="/calendar" className="text-blue-600 hover:text-blue-900">
                    <FaExternalLinkAlt />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right">
        <Link to="/calendar" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <FaCalendarAlt className="mr-1" /> Ver calendario completo
        </Link>
      </div>
    </div>
  );
};

export default UpcomingMaintenance;