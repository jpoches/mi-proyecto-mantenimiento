// client/src/pages/Requests/Requests.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config/api';
import RequestList from '../../components/Requests/RequestList';
import RequestForm from '../../components/Requests/RequestForm';
import RequestDetails from '../../components/Requests/RequestDetails';

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
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const endpoint = currentUser.role === 'admin' 
          ? `${API_URL}/requests`
          : `${API_URL}/requests/client/${currentUser.clientInfo.id}`;
        
        const response = await axios.get(endpoint);
        setRequests(response.data);
        setFilteredRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Error al cargar las solicitudes');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUser]);

  // Filtrar solicitudes
  useEffect(() => {
    let result = requests;
    
    if (searchTerm) {
      result = result.filter(request => 
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }
    
    setFilteredRequests(result);
  }, [requests, searchTerm, statusFilter]);

  // Crear nueva solicitud
  const handleCreateRequest = async (requestData) => {
    try {
      const formData = new FormData();
      
      // Agregar datos del formulario
      Object.keys(requestData).forEach(key => {
        if (key !== 'attachments') {
          formData.append(key, requestData[key]);
        }
      });
      
      // Agregar archivos adjuntos
      if (requestData.attachments && requestData.attachments.length > 0) {
        for (let i = 0; i < requestData.attachments.length; i++) {
          formData.append('attachments', requestData.attachments[i]);
        }
      }
      
      // Agregar ID del cliente
      if (currentUser.role === 'client') {
        formData.append('client_id', currentUser.clientInfo.id);
      }
      
      const response = await axios.post(`${API_URL}/requests`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
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
    setSelectedRequest(request);
    setShowDetails(true);
  };

  // Actualizar solicitud
  const handleUpdateRequest = async (requestId, status) => {
    try {
      await axios.patch(`${API_URL}/requests/${requestId}`, { status });
      
      const updatedRequests = requests.map(request => 
        request.id === requestId ? { ...request, status } : request
      );
      
      setRequests(updatedRequests);
      
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, status });
      }
      
      toast.success('Solicitud actualizada exitosamente');
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Error al actualizar la solicitud');
    }
  };

  // Eliminar solicitud
  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('¿Está seguro de eliminar esta solicitud?')) {
      try {
        await axios.delete(`${API_URL}/requests/${requestId}`);
        
        const updatedRequests = requests.filter(request => request.id !== requestId);
        setRequests(updatedRequests);
        
        if (showDetails && selectedRequest && selectedRequest.id === requestId) {
          setShowDetails(false);
          setSelectedRequest(null);
        }
        
        toast.success('Solicitud eliminada exitosamente');
      } catch (error) {
        console.error('Error deleting request:', error);
        toast.error('Error al eliminar la solicitud');
      }
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
      
      {/* Lista de solicitudes */}
      {loading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <RequestList
          requests={filteredRequests}
          onView={handleViewRequest}
          onUpdate={handleUpdateRequest}
          onDelete={handleDeleteRequest}
          isAdmin={currentUser.role === 'admin'}
        />
      )}
      
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
          isAdmin={currentUser.role === 'admin'}
        />
      )}
    </div>
  );
};

export default Requests;