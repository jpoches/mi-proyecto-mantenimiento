// client/src/pages/Tasks/Tasks.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaFilter, FaSearch, FaPlus, FaThLarge, FaList } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config/api';
import TaskList from '../../components/Tasks/TaskList';
import KanbanBoard from '../../components/Tasks/KanbanBoard';
import TaskForm from '../../components/Tasks/TaskForm';

const Tasks = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('board'); // 'board' for kanban, 'list' for traditional list

  // Cargar tareas
  useEffect(() => {
    fetchTasks();
  }, [currentUser]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      let endpoint;
      if (currentUser.role === 'admin') {
        endpoint = `${API_URL}/tasks`;
      } else {
        endpoint = `${API_URL}/tasks/technician/${currentUser.technicianInfo.id}`;
      }
      
      const response = await axios.get(endpoint);
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar órdenes de trabajo para filtrar
  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        let endpoint;
        if (currentUser.role === 'admin') {
          endpoint = `${API_URL}/work-orders/active`;
        } else {
          endpoint = `${API_URL}/work-orders/technician/${currentUser.technicianInfo.id}/active`;
        }
        
        const response = await axios.get(endpoint);
        setWorkOrders(response.data);
      } catch (error) {
        console.error('Error fetching work orders:', error);
      }
    };

    fetchWorkOrders();
  }, [currentUser]);

  // Filtrar tareas
  useEffect(() => {
    let result = tasks;
    
    if (searchTerm) {
      result = result.filter(task => 
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(task => task.status === statusFilter);
    }
    
    if (selectedWorkOrder) {
      result = result.filter(task => task.work_order_id === selectedWorkOrder);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, statusFilter, selectedWorkOrder]);

  // Crear nueva tarea
  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, taskData);
      setTasks([response.data, ...tasks]);
      setShowForm(false);
      toast.success('Tarea creada exitosamente');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Error al crear la tarea');
    }
  };

  // Actualizar estado de tarea
  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      const now = new Date().toISOString();
      let data = { status };
      
      // Si la tarea se inicia, registrar hora de inicio
      if (status === 'in_progress') {
        data.start_time = now;
      }
      
      // Si la tarea se completa, registrar hora de fin
      if (status === 'completed') {
        data.end_time = now;
      }
      
      await axios.patch(`${API_URL}/tasks/${taskId}/status`, data);
      
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, status };
          
          if (status === 'in_progress') {
            updatedTask.start_time = now;
          }
          
          if (status === 'completed') {
            updatedTask.end_time = now;
          }
          
          return updatedTask;
        }
        return task;
      });
      
      setTasks(updatedTasks);
      toast.success('Estado de la tarea actualizado exitosamente');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Error al actualizar el estado de la tarea');
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('¿Está seguro de eliminar esta tarea?')) {
      try {
        await axios.delete(`${API_URL}/tasks/${taskId}`);
        
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        
        toast.success('Tarea eliminada exitosamente');
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  // Cambiar entre vista Kanban y Lista
  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'board' : 'list');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tareas de Mantenimiento</h1>
      
      {/* Barra de acciones */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="relative w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full md:w-auto pl-4 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completadas</option>
            </select>
            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative w-full md:w-auto">
            <select
              value={selectedWorkOrder || ''}
              onChange={(e) => setSelectedWorkOrder(e.target.value ? parseInt(e.target.value) : null)}
              className="appearance-none w-full md:w-auto pl-4 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
            >
              <option value="">Todas las órdenes</option>
              {workOrders.map(wo => (
                <option key={wo.id} value={wo.id}>
                  Orden #{wo.id} - {wo.title}
                </option>
              ))}
            </select>
            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Toggle View Mode */}
          <button
            onClick={toggleViewMode}
            className="flex items-center justify-center p-2 border rounded-lg hover:bg-gray-100 transition-colors text-primary-600"
            title={viewMode === 'list' ? 'Ver como tablero Kanban' : 'Ver como lista'}
          >
            {viewMode === 'list' ? <FaThLarge className="w-5 h-5" /> : <FaList className="w-5 h-5" />}
          </button>
        </div>
        
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors w-full md:w-auto justify-center transform hover:scale-105 duration-200"
          >
            <FaPlus className="mr-2" /> Nueva Tarea
          </button>
        )}
      </div>
      
      {/* Contenido de tareas */}
      {loading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {viewMode === 'board' ? (
            <KanbanBoard
              tasks={filteredTasks}
              onUpdateStatus={handleUpdateTaskStatus}
              onDelete={handleDeleteTask}
              isAdmin={currentUser.role === 'admin'}
            />
          ) : (
            <TaskList
              tasks={filteredTasks}
              onUpdateStatus={handleUpdateTaskStatus}
              onDelete={handleDeleteTask}
              isAdmin={currentUser.role === 'admin'}
            />
          )}
        </>
      )}
      
      {/* Modal de formulario de nueva tarea */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
          workOrders={workOrders}
        />
      )}
    </div>
  );
};

export default Tasks;