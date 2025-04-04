// client/src/components/Tasks/KanbanBoard.js
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEllipsisH, FaCheck, FaPlay, FaTrash, FaClipboardList } from 'react-icons/fa';
import { toast } from 'react-toastify';

const KanbanBoard = ({ tasks, onUpdateStatus, onDelete, isAdmin }) => {
  const [columns, setColumns] = useState({
    pending: [],
    in_progress: [],
    completed: []
  });
  
  const [draggedTask, setDraggedTask] = useState(null);

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
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === newStatus) return;
    
    try {
      await onUpdateStatus(draggedTask.id, newStatus);
      setDraggedTask(null);
    } catch (error) {
      toast.error('Error al mover la tarea');
      console.error(error);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render de una tarjeta de tarea
  const TaskCard = ({ task }) => (
    <div 
      className="bg-white p-3 rounded-lg shadow mb-2 cursor-move hover:shadow-md transition-shadow"
      draggable
      onDragStart={() => handleDragStart(task)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-800 text-sm">{task.description}</h4>
        <div className="dropdown relative">
          <button className="text-gray-500 hover:text-gray-700">
            <FaEllipsisH className="w-3 h-3" />
          </button>
          {/* Agregar menú desplegable si se necesita */}
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        {task.work_order && (
          <div className="mb-1">
            Orden: #{task.work_order.id} - {task.work_order.title.substring(0, 20)}...
          </div>
        )}
        {task.estimated_time && (
          <div className="mb-1">Tiempo est.: {task.estimated_time} min</div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <div className="text-xs text-gray-500">
          {task.start_time && <span>Iniciada: {formatDate(task.start_time)}</span>}
        </div>
        
        <div className="flex space-x-1">
          {task.status === 'pending' && (
            <button
              onClick={() => onUpdateStatus(task.id, 'in_progress')}
              className="p-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
              title="Iniciar"
            >
              <FaPlay className="w-3 h-3" />
            </button>
          )}
          
          {task.status === 'in_progress' && (
            <button
              onClick={() => onUpdateStatus(task.id, 'completed')}
              className="p-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              title="Completar"
            >
              <FaCheck className="w-3 h-3" />
            </button>
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

  // Column component
  const Column = ({ title, status, count, color, icon, tasks }) => (
    <div className="flex-1 flex flex-col min-w-[250px]">
      <div className={`flex items-center justify-between p-2 ${color} rounded-t-lg`}>
        <div className="flex items-center">
          {icon}
          <h3 className="font-medium text-sm ml-2">{title}</h3>
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
        className="flex-1 bg-gray-100 p-2 overflow-y-auto h-[calc(100vh-250px)] rounded-b-lg"
        onDragOver={(e) => handleDragOver(e, status)}
        onDrop={(e) => handleDrop(e, status)}
      >
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-xs italic">
            No hay tareas en esta columna
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      <Column 
        title="Pendientes" 
        status="pending" 
        count={columns.pending.length}
        color="bg-yellow-500 text-white"
        icon={<FaClipboardList className="w-4 h-4" />}
        tasks={columns.pending}
      />
      
      <Column 
        title="En Progreso" 
        status="in_progress" 
        count={columns.in_progress.length}
        color="bg-blue-500 text-white" // Cambié primary-500 a blue-500 para consistencia
        icon={<FaPlay className="w-4 h-4" />}
        tasks={columns.in_progress}
      />
      
      <Column 
        title="Completadas" 
        status="completed" 
        count={columns.completed.length}
        color="bg-green-500 text-white"
        icon={<FaCheck className="w-4 h-4" />}
        tasks={columns.completed}
      />
    </div>
  );
};

export default KanbanBoard;