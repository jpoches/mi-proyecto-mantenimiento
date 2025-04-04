// client/src/components/WorkOrders/WorkOrderDetails.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTimes, FaPlay, FaCheck, FaTrash, FaFileInvoiceDollar } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../config/api';

const WorkOrderDetails = ({ workOrder, onClose, onUpdateStatus, onDelete, isAdmin }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/tasks/work-order/${workOrder.id}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Error al cargar las tareas');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [workOrder.id]);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Actualizar estado de una tarea
  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      await axios.patch(`${API_URL}/tasks/${taskId}/status`, { status });
      
      // Actualizar la lista de tareas
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      ));
      
      toast.success('Estado de la tarea actualizado exitosamente');

      // Verificar si todas las tareas están completadas
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      );
      
      const allCompleted = updatedTasks.every(task => task.status === 'completed');
      
      if (allCompleted && workOrder.status !== 'completed') {
        // Sugerir marcar la orden como completada
        if (window.confirm('Todas las tareas están completadas. ¿Desea marcar la orden de trabajo como completada?')) {
          onUpdateStatus(workOrder.id, 'completed');
        }
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Error al actualizar el estado de la tarea');
    }
  };

  // Mapeo de estados a etiquetas y colores
  const statusConfig = {
    pending: {
      label: 'Pendiente',
      color: 'bg-yellow-100 text-yellow-800',
      buttonText: 'Iniciar',
      icon: <FaPlay className="mr-1" />,
      nextStatus: 'in_progress'
    },
    in_progress: {
      label: 'En Progreso',
      color: 'bg-blue-100 text-blue-800',
      buttonText: 'Completar',
      icon: <FaCheck className="mr-1" />,
      nextStatus: 'completed'
    },
    completed: {
      label: 'Completada',
      color: 'bg-green-100 text-green-800',
      buttonText: null,
      icon: null,
      nextStatus: null
    }
  };

  // Calcular progreso de tareas
  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Función para crear factura
  const createInvoice = async () => {
    try {
      // Recopilar información necesaria
      if (!workOrder.request || !workOrder.request.client) {
        toast.error('No hay información del cliente disponible');
        return;
      }
      
      // Normalmente esta sería una pantalla separada con un formulario
      // pero para simplificar, creamos una factura básica
      const invoiceData = {
        work_order_id: workOrder.id,
        client_id: workOrder.request.client.id,
        amount: 5000, // Monto fijo para simplificar
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)) // 30 días
      };
      
      await axios.post(`${API_URL}/invoices`, invoiceData);
      toast.success('Factura creada exitosamente');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Error al crear la factura');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Orden de Trabajo #{workOrder.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Cabecera con estado y acciones */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex items-center mb-3 sm:mb-0">
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${statusConfig[workOrder.status].color}`}>
                {statusConfig[workOrder.status].label}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                Creada: {formatDate(workOrder.created_at)}
              </span>
            </div>
            
            <div className="flex space-x-2">
              {workOrder.status !== 'completed' && statusConfig[workOrder.status].buttonText && (
                <button
                  onClick={() => onUpdateStatus(workOrder.id, statusConfig[workOrder.status].nextStatus)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  {statusConfig[workOrder.status].icon} {statusConfig[workOrder.status].buttonText}
                </button>
              )}
              
              {isAdmin && workOrder.status === 'completed' && (
                <button
                  onClick={createInvoice}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <FaFileInvoiceDollar className="mr-1" /> Generar Factura
                </button>
              )}
              
              {isAdmin && (
                <button
                  onClick={() => {
                    onDelete(workOrder.id);
                    onClose();
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <FaTrash className="mr-1" /> Eliminar
                </button>
              )}
            </div>
          </div>

          {/* Información principal */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{workOrder.title}</h3>
            <p className="text-gray-700 whitespace-pre-wrap mb-4">{workOrder.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Técnico asignado:</p>
                <p className="text-gray-800">{workOrder.service_personnel?.name || 'No asignado'}</p>
                {workOrder.service_personnel?.specialization && (
                  <p className="text-sm text-gray-500">{workOrder.service_personnel.specialization}</p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-600 font-medium">Cliente:</p>
                <p className="text-gray-800">{workOrder.request?.client?.name || 'No disponible'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 font-medium">Fecha programada:</p>
                <p className="text-gray-800">{formatDate(workOrder.scheduled_date)}</p>
              </div>
              
              {workOrder.completed_date && (
                <div>
                  <p className="text-sm text-gray-600 font-medium">Fecha de finalización:</p>
                  <p className="text-gray-800">{formatDate(workOrder.completed_date)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Progreso de tareas */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-semibold">Progreso de Tareas</h4>
              <span className="text-sm font-medium">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Lista de tareas */}
          <div>
            <h4 className="text-md font-semibold mb-3">Tareas</h4>
            
            {loading ? (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : tasks.length === 0 ? (
              <p className="text-gray-500 italic">No hay tareas asociadas a esta orden</p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{task.description}</p>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className={`px-2 text-xs leading-5 font-semibold rounded-full ${statusConfig[task.status].color} mr-2`}>
                            {statusConfig[task.status].label}
                          </span>
                          <span>
                            {task.estimated_time && `Tiempo est.: ${task.estimated_time} min`}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {task.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                            className="text-blue-600 hover:text-blue-800"
                            title="Iniciar tarea"
                          >
                            <FaPlay />
                          </button>
                        )}
                        
                        {task.status === 'in_progress' && (
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                            className="text-green-600 hover:text-green-800"
                            title="Completar tarea"
                          >
                            <FaCheck />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {task.start_time && (
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Iniciada: {formatDate(task.start_time)}</p>
                        {task.end_time && <p>Finalizada: {formatDate(task.end_time)}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderDetails;