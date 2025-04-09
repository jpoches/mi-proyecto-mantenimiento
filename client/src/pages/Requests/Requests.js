// client/src/pages/Requests/Requests.js (corregido)
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import RequestList from '../../components/Requests/RequestList';
import RequestForm from '../../components/Requests/RequestForm';
import RequestDetails from '../../components/Requests/RequestDetails';
import LoadingOverlay from '../../components/UI/LoadingOverlay';
import axios from '../../utils/axios';
import { API_URL } from '../../config/api';

const Requests = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Cargar solicitudes
  useEffect(() => {
    fetchRequests();
  }, [currentUser]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let response;

      if (currentUser?.role === 'admin') {
        response = await axios.get(`${API_URL}/requests`);
      } else if (currentUser?.role === 'client' && currentUser?.clientInfo?.id) {
        response = await axios.get(`${API_URL}/requests/client/${currentUser.clientInfo.id}`);
      } else {
        // Si no es admin ni cliente con ID, inicializar como array vacío
        setRequests([]);
        setFilteredRequests([]);
        setLoading(false);
        return;
      }

      const data = response.data || [];
      setRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Error al cargar las solicitudes');
      // Inicializar como array vacío en caso de error
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar solicitudes cuando cambia el término de búsqueda o el filtro de estado
  useEffect(() => {
    if (!Array.isArray(requests)) {
      setFilteredRequests([]);
      return;
    }
    
    let result = [...requests];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(request => 
        (request.title && request.title.toLowerCase().includes(term)) ||
        (request.description && request.description.toLowerCase().includes(term)) ||
        (request.location && request.location.toLowerCase().includes(term))
      );
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }
    
    setFilteredRequests(result);
  }, [requests, searchTerm, statusFilter]);

  // Crear nueva solicitud
  const handleCreateRequest = async (formData) => {
    try {
      // Extraer archivos adjuntos del objeto de datos
      const { attachments, ...data } = formData;
      
      // Si es un cliente, agregar su ID
      if (currentUser.role === 'client' && currentUser.clientInfo) {
        data.client_id = currentUser.clientInfo.id;
      }
      
      // Preparar formData para enviar archivos
      const requestFormData = new FormData();
      
      // Agregar datos de texto al FormData
      Object.keys(data).forEach(key => {
        requestFormData.append(key, data[key]);
      });
      
      // Agregar archivos adjuntos si existen
      if (attachments && attachments.length > 0) {
        attachments.forEach(file => {
          requestFormData.append('attachments', file);
        });
      }
      
      // Crear la solicitud con archivos adjuntos si los hay
      const response = await axios.post(`${API_URL}/requests`, requestFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Actualizar la lista de solicitudes
      setRequests([response.data, ...requests]);
      setShowForm(false);
      toast.success('Solicitud creada exitosamente');
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Error al crear la solicitud');
    }
  };

  // Ver detalles de una solicitud
  const handleViewRequest = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowDetails(true);
    } else {
      toast.error('Solicitud no encontrada');
    }
  };

  // Actualizar solicitud
  const handleUpdateRequest = async (requestId, status) => {
    try {
      await axios.patch(`${API_URL}/requests/${requestId}`, { status });
      
      // Actualizar la lista de solicitudes
      const updatedRequests = requests.map(request => 
        request.id === requestId ? { ...request, status } : request
      );
      
      setRequests(updatedRequests);
      
      // Si hay una solicitud seleccionada, actualizar su estado también
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, status });
      }

      toast.success(`Solicitud ${status === 'approved' ? 'aprobada' : status === 'rejected' ? 'rechazada' : 'actualizada'} exitosamente`);
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Error al actualizar la solicitud');
    }
  };

  // Eliminar solicitud
  const handleDeleteRequest = async (requestId) => {
    try {
      if (!window.confirm('¿Está seguro de eliminar esta solicitud?')) {
        return;
      }
      
      await axios.delete(`${API_URL}/requests/${requestId}`);
      
      // Actualizar la lista de solicitudes
      const updatedRequests = requests.filter(request => request.id !== requestId);
      setRequests(updatedRequests);
      
      // Si hay una solicitud seleccionada, cerrar el modal de detalles
      if (showDetails && selectedRequest && selectedRequest.id === requestId) {
        setShowDetails(false);
        setSelectedRequest(null);
      }
      
      toast.success('Solicitud eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Error al eliminar la solicitud');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Solicitudes de Mantenimiento</h1>
      
      {/* Barra de acciones */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-64">
            <input
              type="text"
              placeholder="Buscar solicitudes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="rejected">Rechazados</option>
            </select>
            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto justify-center"
        >
          <FaPlus className="mr-2" /> Nueva Solicitud
        </button>
      </div>
      
      {/* Lista de solicitudes con overlay de carga */}
      <LoadingOverlay loading={loading}>
        <RequestList
          requests={filteredRequests || []}
          onView={handleViewRequest}
          onUpdate={handleUpdateRequest}
          onDelete={handleDeleteRequest}
          isAdmin={currentUser?.role === 'admin'}
        />
      </LoadingOverlay>
      
      {/* Modal de formulario de nueva solicitud */}
      {showForm && (
        <RequestForm
          onSubmit={handleCreateRequest}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      {/* Modal de detalles de solicitud */}
      {showDetails && selectedRequest && (
        <RequestDetails
          request={selectedRequest}
          onClose={() => setShowDetails(false)}
          onUpdate={handleUpdateRequest}
          onDelete={handleDeleteRequest}
          isAdmin={currentUser?.role === 'admin'}
        />
      )}
    </div>
  );
};

export default Requests;