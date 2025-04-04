// client/src/components/WorkOrders/WorkOrderForm.js
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaTimes, FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';

const WorkOrderForm = ({ onSubmit, onCancel, technicians, approvedRequests, selectedRequest, onSelectRequest }) => {
  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      tasks: [{ description: '', estimated_time: '' }]
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'tasks' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const watchRequestId = watch('request_id');

  // Si hay una solicitud seleccionada, actualizar el formulario
  React.useEffect(() => {
    if (selectedRequest) {
      setValue('request_id', selectedRequest.id.toString());
      setValue('title', `Mantenimiento: ${selectedRequest.title}`);
      setValue('description', selectedRequest.description);
    }
  }, [selectedRequest, setValue]);

  // Si cambia la solicitud seleccionada, actualizar título y descripción
  React.useEffect(() => {
    if (watchRequestId) {
      const request = approvedRequests.find(r => r.id.toString() === watchRequestId);
      if (request) {
        setValue('title', `Mantenimiento: ${request.title}`);
        setValue('description', request.description);
      }
    }
  }, [watchRequestId, approvedRequests, setValue]);

  const submitForm = async (data) => {
    setIsSubmitting(true);
    try {
      // Convertir ID a números
      data.request_id = data.request_id ? parseInt(data.request_id) : null;
      data.assigned_to = parseInt(data.assigned_to);
      
      // Convertir fechas si es necesario
      if (data.scheduled_date) {
        data.scheduled_date = new Date(data.scheduled_date);
      }
      
      // Limpiar tareas vacías
      data.tasks = data.tasks.filter(task => task.description.trim() !== '');
      
      // Convertir estimated_time a número
      data.tasks = data.tasks.map(task => ({
        ...task,
        estimated_time: task.estimated_time ? parseInt(task.estimated_time) : null
      }));
      
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nueva Orden de Trabajo</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)}>
          {/* Solicitud */}
          <div className="mb-4">
            <label htmlFor="request_id" className="block text-sm font-medium text-gray-700 mb-1">
              Solicitud (opcional)
            </label>
            <select
              id="request_id"
              {...register('request_id')}
              className="w-full p-2 border rounded-lg border-gray-300"
              onChange={(e) => {
                if (e.target.value) {
                  onSelectRequest(parseInt(e.target.value));
                }
              }}
            >
              <option value="">Sin solicitud asociada</option>
              {approvedRequests.map(request => (
                <option key={request.id} value={request.id}>
                  #{request.id} - {request.title} - {request.client?.name || 'Cliente no disponible'}
                </option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'El título es requerido' })}
              className={`w-full p-2 border rounded-lg ${errors.title ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Título de la orden de trabajo"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              rows="3"
              {...register('description', { required: 'La descripción es requerida' })}
              className={`w-full p-2 border rounded-lg ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Describe el trabajo a realizar"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Técnico Asignado */}
          <div className="mb-4">
            <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-1">
              Técnico Asignado
            </label>
            <select
              id="assigned_to"
              {...register('assigned_to', { required: 'Se debe asignar a un técnico' })}
              className={`w-full p-2 border rounded-lg ${errors.assigned_to ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar técnico</option>
              {technicians.map(tech => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} - {tech.specialization || 'Sin especialización'}
                </option>
              ))}
            </select>
            {errors.assigned_to && (
              <p className="mt-1 text-sm text-red-500">{errors.assigned_to.message}</p>
            )}
          </div>

          {/* Fecha Programada */}
          <div className="mb-4">
            <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Programada
            </label>
            <input
              id="scheduled_date"
              type="datetime-local"
              {...register('scheduled_date', { required: 'La fecha programada es requerida' })}
              className={`w-full p-2 border rounded-lg ${errors.scheduled_date ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.scheduled_date && (
              <p className="mt-1 text-sm text-red-500">{errors.scheduled_date.message}</p>
            )}
          </div>

          {/* Tareas */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tareas
              </label>
              <button
                type="button"
                onClick={() => append({ description: '', estimated_time: '' })}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="mr-1" /> Agregar Tarea
              </button>
            </div>
            
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <input
                      {...register(`tasks.${index}.description`)}
                      placeholder="Descripción de la tarea"
                      className="w-full p-2 border rounded-lg border-gray-300"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      {...register(`tasks.${index}.estimated_time`)}
                      placeholder="Minutos"
                      type="number"
                      min="0"
                      className="w-full p-2 border rounded-lg border-gray-300"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            {fields.length === 0 && (
              <p className="text-sm text-gray-500 italic">No hay tareas definidas</p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                'Crear Orden'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkOrderForm;