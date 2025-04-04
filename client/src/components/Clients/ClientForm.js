// client/src/components/Clients/ClientForm.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaSave } from 'react-icons/fa';

const ClientForm = ({ onSubmit, onCancel, initialData = null }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="p-6">
          {/* Nombre */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'El nombre es requerido' })}
                className={`pl-10 w-full p-2 border rounded-lg ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all`}
                placeholder="Nombre completo o razón social"
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Dirección de email inválida'
                  }
                })}
                className={`pl-10 w-full p-2 border rounded-lg ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all`}
                placeholder="correo@ejemplo.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Teléfono */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                id="phone"
                type="text"
                {...register('phone', { 
                  required: 'El teléfono es requerido'
                })}
                className={`pl-10 w-full p-2 border rounded-lg ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all`}
                placeholder="+34 612 345 678"
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
          </div>

          {/* Dirección */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400" />
              </div>
              <input
                id="address"
                type="text"
                {...register('address', { required: 'La dirección es requerida' })}
                className={`pl-10 w-full p-2 border rounded-lg ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all`}
                placeholder="Dirección completa"
              />
            </div>
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
          </div>

          {/* Persona de contacto */}
          <div className="mb-4">
            <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-1">
              Persona de contacto
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaIdCard className="text-gray-400" />
              </div>
              <input
                id="contact_person"
                type="text"
                {...register('contact_person')}
                className="pl-10 w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Persona de contacto (opcional)"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:bg-primary-400 disabled:cursor-not-allowed transition-colors transform hover:scale-105 duration-200"
            >
              <FaSave className="mr-2" />
              {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;