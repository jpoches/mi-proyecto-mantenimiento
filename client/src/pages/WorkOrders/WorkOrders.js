// client/src/pages/WorkOrders/WorkOrders.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config/api';
import WorkOrderList from '../../components/WorkOrders/WorkOrderList';
import WorkOrderForm from '../../components/WorkOrders/WorkOrderForm';
import WorkOrderDetails from '../../components/WorkOrders/WorkOrderDetails';

const WorkOrders = () => {
  const { currentUser } = useAuth();
  const [workOrders, setWorkOrders] = useState([]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [technicians, setTechnicians] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);

  // Cargar órdenes de trabajo
  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        setLoading(true);
        const endpoint = currentUser.role === 'admin' 
          ? `${API_URL}/work-orders`
          : `${API_URL}/work-orders/technician/${currentUser.technicianInfo.id}`;
        
        const response = await axios.get(endpoint);
        setWorkOrders(response.data);
        setFilteredWorkOrders(response.data);
      } catch (error) {
        console.error('Error fetching work orders:', error);
        toast.error('Error al cargar las órdenes de trabajo');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, [currentUser]);

  // Cargar técnicos si es admin
  useEffect(() => {
    if (currentUser.role === 'admin') {
      const fetchTechnicians = async () => {
        try {
          const response = await axios.get(`${API_URL}/service-personnel`);
          setTechnicians(response.data);
        } catch (error) {
          console.error('Error fetching technicians:', error);
        }
      };

      fetchTechnicians();
    }
  }, [currentUser.role]);

  // Cargar solicitudes aprobadas si es admin
  useEffect(() => {
    if (currentUser.role === 'admin') {
      const fetchApprovedRequests = async () => {
        try {
          const response = await axios.get(`${API_URL}/requests/approved`);
          setApprovedRequests(response.data);
        } catch (error) {
          console.error('Error fetching approved requests:', error);
        }
      };

      fetchApprovedRequests();
    }
  }, [currentUser.role]);

  // Filtrar órdenes de trabajo
  useEffect(() => {
    let result = workOrders;
    
    if (searchTerm) {
      result = result.filter(workOrder => 
        workOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(workOrder => workOrder.status === statusFilter);
    }
    
    setFilteredWorkOrders(result);
  }, [workOrders, searchTerm, statusFilter]);

  // Crear nueva orden de trabajo
  const handleCreateWorkOrder = async (workOrderData) => {
    try {
      const response = await axios.post(`${API_URL}/work-orders`, workOrderData);
      setWorkOrders([response.data, ...workOrders]);
      setShowForm(false);
      toast.success('Orden de trabajo creada exitosamente');
    } catch (error) {
      console.error('Error creating work order:', error);
      toast.error('Error al crear la orden de trabajo');
    }
  };

  // Ver detalles de una orden de trabajo
  const handleViewWorkOrder = (workOrderId) => {
    const workOrder = workOrders.find(wo => wo.id === workOrderId);
    setSelectedWorkOrder(workOrder);
    setShowDetails(true);
  };

  // Actualizar orden de trabajo
  const handleUpdateWorkOrderStatus = async (workOrderId, status) => {
    try {
      await axios.patch(`${API_URL}/work-orders/${workOrderId}/status`, { status });
      
      const updatedWorkOrders = workOrders.map(workOrder => 
        workOrder.id === workOrderId ? { ...workOrder, status } : workOrder
      );
      
      setWorkOrders(updatedWorkOrders);
      
      if (selectedWorkOrder && selectedWorkOrder.id === workOrderId) {
        setSelectedWorkOrder({ ...selectedWorkOrder, status });
      }
      
      toast.success('Estado de la orden actualizado exitosamente');
    } catch (error) {
      console.error('Error updating work order status:', error);
      toast.error('Error al actualizar el estado de la orden');
    }
  };

  // Eliminar orden de trabajo
  const handleDeleteWorkOrder = async (workOrderId) => {
    if (window.confirm('¿Está seguro de eliminar esta orden de trabajo?')) {
      try {
        await axios.delete(`${API_URL}/work-orders/${workOrderId}`);
        
        const updatedWorkOrders = workOrders.filter(workOrder => workOrder.id !== workOrderId);
        setWorkOrders(updatedWorkOrders);
        
        if (showDetails && selectedWorkOrder && selectedWorkOrder.id === workOrderId) {
          setShowDetails(false);
          setSelectedWorkOrder(null);
        }
        
        toast.success('Orden de trabajo eliminada exitosamente');
      } catch (error) {
        console.error('Error deleting work order:', error);
        toast.error('Error al eliminar la orden de trabajo');
      }
    }
  };

  // Seleccionar solicitud para crear orden de trabajo
  const handleSelectRequest = (requestId) => {
    const request = approvedRequests.find(r => r.id === requestId);
    setSelectedRequest(request);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Órdenes de Trabajo</h1>
      
      {/* Barra de acciones */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-64">
            <input
              type="text"
              placeholder="Buscar órdenes..."
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
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completadas</option>
            </select>
            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto justify-center"
          >
            <FaPlus className="mr-2" /> Nueva Orden de Trabajo
          </button>
        )}
      </div>
      
      {/* Lista de órdenes de trabajo */}
      {loading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <WorkOrderList
          workOrders={filteredWorkOrders}
          onView={handleViewWorkOrder}
          onUpdateStatus={handleUpdateWorkOrderStatus}
          onDelete={handleDeleteWorkOrder}
          isAdmin={currentUser.role === 'admin'}
        />
      )}
      
      {/* Modal de formulario de nueva orden */}
      {showForm && (
        <WorkOrderForm
          onSubmit={handleCreateWorkOrder}
          onCancel={() => {
            setShowForm(false);
            setSelectedRequest(null);
          }}
          technicians={technicians}
          approvedRequests={approvedRequests}
          selectedRequest={selectedRequest}
          onSelectRequest={handleSelectRequest}
        />
      )}
      
      {/* Modal de detalles de orden */}
      {showDetails && selectedWorkOrder && (
        <WorkOrderDetails
          workOrder={selectedWorkOrder}
          onClose={() => setShowDetails(false)}
          onUpdateStatus={handleUpdateWorkOrderStatus}
          onDelete={handleDeleteWorkOrder}
          isAdmin={currentUser.role === 'admin'}
        />
      )}
    </div>
  );
};

export default WorkOrders;