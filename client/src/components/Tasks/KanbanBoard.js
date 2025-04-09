// client/src/components/Tasks/KanbanBoard.js
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEllipsisH, FaCheck, FaPlay, FaTrash, FaClipboardList, FaPause, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const KanbanBoard = ({ tasks, onUpdateStatus, onDelete, isAdmin }) => {
  const [columns, setColumns] = useState({
    pending: [],
    in_progress: [],
    completed: []
  });
  
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Organizar tareas en columnas
  useEffect(() => {
    if (!tasks) return;
    
    const newColumns = {
      pending: tasks.filter(task => task.status === 'pending'),
      in_progress: tasks.filter(task => task.status === 'in_progress'),
      completed: tasks.filter(task => task.status === 'completed')
    };
    
    setColumns(newColumns);
  }, [tasks]);

  // Manejadores de eventos para drag and drop
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    // Añadir efecto visual para el elemento arrastrado
    e.currentTarget.classList.add('opacity-50');
    // Guardar la información de la tarea en el objeto dataTransfer
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnd = (e) => {
    // Restaurar el estilo del elemento cuando termina el arrastre
    e.currentTarget.classList.remove('opacity-50');
    setDragOverColumn(null);
  };

  const handleDragOver = (e, column) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Marcar la columna sobre la que se está arrastrando
    setDragOverColumn(column);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDragOverColumn(null);
      return;
    }
    
    try {
      // Actualizar optimistamente la UI
      const updatedTasks = tasks.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: newStatus } 
          : task
      );
      
      // Reorganizar las columnas
      const updatedColumns = {
        pending: updatedTasks.filter(task => task.status === 'pending'),
        in_progress: updatedTasks.filter(task => task.status === 'in_progress'),
        completed: updatedTasks.filter(task => task.status === 'completed')
      };
      
      setColumns(updatedColumns);
      
      // Llamar a la API para actualizar
      await onUpdateStatus(draggedTask.id, newStatus);
      
      toast.success(`Tarea movida a ${newStatus === 'pending' ? 'Pendiente' : newStatus === 'in_progress' ? 'En Progreso' : 'Completada'}`);
    } catch (error) {
      // Restaurar el estado anterior en caso de error
      toast.error('Error al mover la tarea');
      console.error(error);
      
      // Volver a cargar el estado original desde los props
      const originalColumns = {
        pending: tasks.filter(task => task.status === 'pending'),
        in_progress: tasks.filter(task => task.status === 'in_progress'),
        completed: tasks.filter(task => task.status === 'completed')
      };
      
      setColumns(originalColumns);
    } finally {
      setDraggedTask(null);
      setDragOverColumn(null);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
      return `${hours}h ${minutes}m`;
    }
  };
  
  // Función para calcular la prioridad visual de una tarea
  const getTaskPriority = (task) => {
    // Si tiene estimated_time, verificar si está cerca de ese límite
    if (task.estimated_time && task.start_time && !task.end_time) {
      const minutesElapsed = (new Date() - new Date(task.start_time)) / 60000;
      const percentComplete = (minutesElapsed / task.estimated_time) * 100;
      
      if (percentComplete > 90) {
        return 'bg-red-50 border-red-200'; // Alta prioridad
      } else if (percentComplete > 70) {
        return 'bg-yellow-50 border-yellow-200'; // Media prioridad
      }
    }
    
    return 'bg-white'; // Prioridad normal
  };

  // Render de una tarjeta de tarea
  const TaskCard = ({ task }) => (
    <div 
      className={`p-3 rounded-lg shadow mb-3 cursor-move hover:shadow-md transition-shadow border ${getTaskPriority(task)}`}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-800 text-sm">{task.description}</h4>
        <div className="dropdown relative">
          <button className="text-gray-500 hover:text-gray-700">
            <FaEllipsisH className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        {task.work_order && (
          <div className="mb-1 flex items-center">
            <FaClipboardList className="w-3 h-3 mr-1" /> 
            Orden: #{task.work_order.id} 
          </div>
        )}
        {task.estimated_time && (
          <div className="mb-1 flex items-center">
            <FaClock className="w-3 h-3 mr-1" />
            Est.: {task.estimated_time} min
          </div>
        )}
        {task.start_time && !task.end_time && (
          <div className="mb-1 flex items-center text-blue-600">
            <FaPlay className="w-3 h-3 mr-1" />
            Tiempo: {getElapsedTime(task.start_time)}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <div className="text-xs text-gray-500">
          {task.start_time && <span>Inicio: {formatDate(task.start_time)}</span>}
        </div>
        
        <div className="flex space-x-1">
          {task.status === 'pending' && (
            <button
              onClick={() => onUpdateStatus(task.id, 'in_progress')}
              className="p-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              title="Iniciar"
            >
              <FaPlay className="w-3 h-3" />
            </button>
          )}
          
          {task.status === 'in_progress' && (
            <>
              <button
                onClick={() => onUpdateStatus(task.id, 'pending')}
                className="p-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                title="Pausar"
              >
                <FaPause className="w-3 h-3" />
              </button>
              <button
                onClick={() => onUpdateStatus(task.id, 'completed')}
                className="p-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                title="Completar"
              >
                <FaCheck className="w-3 h-3" />
              </button>
            </>
          )}
          
          {isAdmin && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              title="Eliminar"
            >
              <FaTrash className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Componente de columna
  const Column = ({ title, status, count, color, icon, tasks }) => (
    <div className="flex-1 flex flex-col min-w-[250px] rounded-lg overflow-hidden shadow">
      <div className={`flex items-center justify-between p-3 ${color} text-white`}>
        <div className="flex items-center">
          {icon}
          <h3 className="font-semibold text-sm ml-2">{title}</h3>
          <span className="ml-2 bg-white bg-opacity-30 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
            {count}
          </span>
        </div>
        {status !== 'completed' && isAdmin && (
          <button 
            className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
            title="Añadir tarea"
          >
            <FaPlus className="w-3 h-3" />
          </button>
        )}
      </div>
      <div 
        className={`flex-1 bg-gray-100 p-2 overflow-y-auto h-[calc(100vh-250px)] ${dragOverColumn === status ? 'bg-blue-50' : ''}`}
        onDragOver={(e) => handleDragOver(e, status)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, status)}
      >
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm italic border-2 border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center">
            Arrastra tareas aquí
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-6">
      <Column 
        title="Pendientes" 
        status="pending" 
        count={columns.pending.length}
        color="bg-yellow-500"
        icon={<FaClipboardList className="w-4 h-4" />}
        tasks={columns.pending}
      />
      
      <Column 
        title="En Progreso" 
        status="in_progress" 
        count={columns.in_progress.length}
        color="bg-blue-500"
        icon={<FaPlay className="w-4 h-4" />}
        tasks={columns.in_progress}
      />
      
      <Column 
        title="Completadas" 
        status="completed" 
        count={columns.completed.length}
        color="bg-green-500"
        icon={<FaCheck className="w-4 h-4" />}
        tasks={columns.completed}
      />
    </div>
  );
};

export default KanbanBoard;