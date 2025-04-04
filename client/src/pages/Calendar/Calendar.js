// client/src/pages/Calendar/Calendar.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

// Componente provisional simplificado para evitar dependencias extras
const Calendar = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [currentUser]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      let endpoint;
      if (currentUser.role === 'admin') {
        endpoint = `${API_URL}/calendar`;
      } else if (currentUser.role === 'client' && currentUser.clientInfo) {
        endpoint = `${API_URL}/calendar/client/${currentUser.clientInfo.id}/upcoming`;
      } else if (currentUser.role === 'technician' && currentUser.technicianInfo) {
        endpoint = `${API_URL}/calendar/technician/${currentUser.technicianInfo.id}/upcoming`;
      }
      
      if (!endpoint) {
        setLoading(false);
        return;
      }
      
      const response = await axios.get(endpoint);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      toast.error('Error al cargar los eventos del calendario');
      setLoading(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Calendario de Mantenimientos</h1>
      
      {/* Vista simplificada del calendario */}
      {loading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="mb-4 text-gray-600">
            Próximos eventos programados:
          </p>
          
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium text-lg">{event.title}</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Fecha:</strong> {formatDate(event.event_date)}</p>
                    {event.description && (
                      <p className="mt-1"><strong>Descripción:</strong> {event.description}</p>
                    )}
                    {event.work_order && (
                      <p className="mt-1"><strong>Orden de trabajo:</strong> #{event.work_order.id} - {event.work_order.title}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay eventos programados próximamente.</p>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Para una experiencia completa con vista de calendario mensual,</p>
            <p>instalaremos react-big-calendar en la próxima actualización.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;