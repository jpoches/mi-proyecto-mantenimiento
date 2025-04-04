// client/src/components/Tasks/TaskForm.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaTimes, FaSpinner } from 'react-icons/fa';

const TaskForm = ({ onSubmit, onCancel, workOrders }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nueva Tarea</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)}>
          {/* Orden de Trabajo */}
          <div className="mb-4">
            <label htmlFor="work_order_id" className="block text-sm font-medium text-gray-700 mb-1">
              Orden de Trabajo
            </label>
            <select
              id="work_order_id"
              {...register('work_order_id', { required: 'La orden de trabajo es requerida' })}
              className={`w-full p-2 border rounded-lg ${errors.work_order_id ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="">Selecciona una orden de trabajo</option>
              {workOrders.map(wo => (
                <option key={wo.id} value={wo.id}>
                  #{wo.id} - {wo.title}
                </option>
              ))}
            </select>
            {errors.work_order_id && (
              <p className="mt-1 text-sm text-red-500">{errors.work_order_id.message}</p>
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
              placeholder="Describe la tarea"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Tiempo Estimado */}
          <div className="mb-4">
            <label htmlFor="estimated_time" className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo Estimado (en minutos)
            </label>
            <input
              id="estimated_time"
              type="number"
              min="0"
              {...register('estimated_time', { 
                valueAsNumber: true,
                validate: value => !isNaN(value) || 'Debe ser un número válido'
              })}
              className={`w-full p-2 border rounded-lg ${errors.estimated_time ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Tiempo estimado para completar la tarea"
            />
            {errors.estimated_time && (
              <p className="mt-1 text-sm text-red-500">{errors.estimated_time.message}</p>
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
                'Guardar Tarea'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;