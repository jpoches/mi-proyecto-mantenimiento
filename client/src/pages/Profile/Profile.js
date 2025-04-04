// client/src/pages/Profile/Profile.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaPhone, FaKey, FaSave, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      name: currentUser?.clientInfo?.name || currentUser?.technicianInfo?.name || '',
      address: currentUser?.clientInfo?.address || '',
      specialization: currentUser?.technicianInfo?.specialization || '',
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Preparar datos para el usuario
      const userData = {
        username: data.username,
        email: data.email,
        phone: data.phone
      };
      
      // Si está cambiando la contraseña
      if (changePassword && data.password) {
        userData.password = data.password;
      }
      
      // Preparar datos específicos según el rol
      if (currentUser.role === 'client' && currentUser.clientInfo) {
        userData.clientData = {
          name: data.name,
          address: data.address
        };
      } else if (currentUser.role === 'technician' && currentUser.technicianInfo) {
        userData.technicianData = {
          name: data.name,
          specialization: data.specialization
        };
      }
      
      // Actualizar perfil
      await axios.put(`${API_URL}/users/${currentUser.id}`, userData);
      
      toast.success('Perfil actualizado exitosamente');
      
      // Si cambió la contraseña, cerrar sesión
      if (changePassword && data.password) {
        toast.info('La contraseña ha sido cambiada. Por favor, inicie sesión nuevamente.');
        setTimeout(() => {
          logout();
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  {...register('username', { required: 'El nombre de usuario es requerido' })}
                  className={`pl-10 w-full p-2 border rounded-lg ${errors.username ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Nombre de usuario"
                />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className={`pl-10 w-full p-2 border rounded-lg ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>
            
            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="text"
                  {...register('phone')}
                  className="pl-10 w-full p-2 border rounded-lg border-gray-300"
                  placeholder="Teléfono"
                />
              </div>
            </div>
            
            {/* Nombre (para cliente y técnico) */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'El nombre es requerido' })}
                className={`w-full p-2 border rounded-lg ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Nombre completo"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>
            
            {/* Campos específicos según el rol */}
            {currentUser.role === 'client' && (
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  id="address"
                  type="text"
                  {...register('address')}
                  className="w-full p-2 border rounded-lg border-gray-300"
                  placeholder="Dirección"
                />
              </div>
            )}
            
            {currentUser.role === 'technician' && (
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                  Especialización
                </label>
                <input
                  id="specialization"
                  type="text"
                  {...register('specialization')}
                  className="w-full p-2 border rounded-lg border-gray-300"
                  placeholder="Especialización"
                />
              </div>
            )}
          </div>
          
          {/* Cambio de contraseña */}
          <div className="mt-6">
            <div className="flex items-center">
              <input
                id="changePassword"
                type="checkbox"
                checked={changePassword}
                onChange={() => setChangePassword(!changePassword)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="changePassword" className="ml-2 block text-sm text-gray-700">
                Cambiar contraseña
              </label>
            </div>
            
            {changePassword && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaKey className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      {...register('password', { 
                        required: 'La contraseña es requerida',
                        minLength: {
                          value: 6,
                          message: 'La contraseña debe tener al menos 6 caracteres'
                        }
                      })}
                      className={`pl-10 w-full p-2 border rounded-lg ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="Nueva contraseña"
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaKey className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword', { 
                        required: 'Debe confirmar la contraseña',
                        validate: value => 
                          value === password || 'Las contraseñas no coinciden'
                      })}
                      className={`pl-10 w-full p-2 border rounded-lg ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="Confirmar contraseña"
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            )}
          </div>
          
          {/* Botón de guardar */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;