// client/src/components/Requests/RequestForm.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaTimes, FaUpload, FaSpinner } from 'react-icons/fa';

const RequestForm = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const submitForm = async (data) => {
    setIsSubmitting(true);
    try {
      // Agregar archivos al objeto de datos
      const formData = {
        ...data,
        attachments: files
      };
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nueva Solicitud de Mantenimiento</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)}>
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
              placeholder="Título de la solicitud"
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
              rows="4"
              {...register('description', { required: 'La descripción es requerida' })}
              className={`w-full p-2 border rounded-lg ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Describe el problema o el servicio requerido"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Ubicación */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              id="location"
              type="text"
              {...register('location', { required: 'La ubicación es requerida' })}
              className={`w-full p-2 border rounded-lg ${errors.location ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Dirección o ubicación específica"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Tipo de Servicio */}
          <div className="mb-4">
            <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Servicio
            </label>
            <select
              id="service_type"
              {...register('service_type', { required: 'El tipo de servicio es requerido' })}
              className={`w-full p-2 border rounded-lg ${errors.service_type ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="">Selecciona un tipo de servicio</option>
              <option value="electrical">Eléctrico</option>
              <option value="plumbing">Plomería</option>
              <option value="carpentry">Carpintería</option>
              <option value="painting">Pintura</option>
              <option value="cleaning">Limpieza</option>
              <option value="other">Otro</option>
            </select>
            {errors.service_type && (
              <p className="mt-1 text-sm text-red-500">{errors.service_type.message}</p>
            )}
          </div>

          {/* Prioridad */}
          <div className="mb-4">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <select
              id="priority"
              {...register('priority', { required: 'La prioridad es requerida' })}
              className={`w-full p-2 border rounded-lg ${errors.priority ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="">Selecciona la prioridad</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-500">{errors.priority.message}</p>
            )}
          </div>

          {/* Archivos Adjuntos */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Archivos Adjuntos (opcional)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF (MAX. 5MB por archivo)
                  </p>
                </div>
                <input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Archivos seleccionados:</p>
                <ul className="mt-1 text-sm text-gray-500">
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
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
                  Enviando...
                </>
              ) : (
                'Enviar Solicitud'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;