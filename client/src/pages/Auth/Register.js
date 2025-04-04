// client/src/pages/Auth/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState('client');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const userData = {
        ...data,
        role: selectedRole
      };
      
      await registerUser(userData);
      toast.success('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      console.error('Register error:', error);
      toast.error(
        error.response?.data?.message || 
        'Error al registrarse. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Building Maintenance System
          </h2>
          <h3 className="mt-2 text-center text-xl font-medium text-gray-600">
            Crear Cuenta
          </h3>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Tipo de usuario */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de cuenta
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="client"
                    name="role"
                    type="radio"
                    value="client"
                    checked={selectedRole === 'client'}
                    onChange={() => setSelectedRole('client')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor="client"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Cliente
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="technician"
                    name="role"
                    type="radio"
                    value="technician"
                    checked={selectedRole === 'technician'}
                    onChange={() => setSelectedRole('technician')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor="technician"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Técnico
                  </label>
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="sr-only">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  {...register('username', { 
                    required: 'El usuario es requerido',
                    minLength: {
                      value: 4,
                      message: 'El usuario debe tener al menos 4 caracteres'
                    }
                  })}
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Usuario"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="sr-only">
                Nombre completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  {...register('name', { 
                    required: 'El nombre es requerido'
                  })}
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Nombre completo"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', { 
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="sr-only">
                Teléfono
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  {...register('phone', { 
                    required: 'El teléfono es requerido',
                    pattern: {
                      value: /^[0-9+-]+$/,
                      message: 'Formato de teléfono inválido'
                    }
                  })}
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Teléfono"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Campos específicos según el rol */}
            {selectedRole === 'client' && (
              <div className="mb-4">
                <label htmlFor="address" className="sr-only">
                  Dirección
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  {...register('address', { 
                    required: 'La dirección es requerida'
                  })}
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Dirección"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>
            )}

            {selectedRole === 'technician' && (
              <div className="mb-4">
                <label htmlFor="specialization" className="sr-only">
                  Especialización
                </label>
                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  {...register('specialization', { 
                    required: 'La especialización es requerida'
                  })}
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${
                    errors.specialization ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Especialización (ej: Electricista, Plomero)"
                />
                {errors.specialization && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.specialization.message}
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password', { 
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                  })}
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Contraseña"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register('confirmPassword', { 
                    required: 'Debe confirmar la contraseña',
                    validate: value => 
                      value === password || 'Las contraseñas no coinciden'
                  })}
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Confirmar contraseña"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FaUserPlus className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;