// client/src/components/Layout/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

const Header = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationsDropdown, setNotificationsDropdown] = useState(false);

  const toggleProfileDropdown = () => {
    setProfileDropdown(!profileDropdown);
    if (notificationsDropdown) setNotificationsDropdown(false);
  };

  const toggleNotificationsDropdown = () => {
    setNotificationsDropdown(!notificationsDropdown);
    if (profileDropdown) setProfileDropdown(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo and Toggle Button */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none lg:hidden mr-3 hover:text-primary-600 transition-colors"
            >
              <FaBars className="h-6 w-6" />
            </button>
            <Logo size="small" className="hidden md:flex" />
          </div>

          {/* Right Section */}
          <div className="flex items-center">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotificationsDropdown}
                className="flex items-center text-gray-500 p-2 rounded-full hover:bg-gray-100 hover:text-primary-600 transition-colors focus:outline-none"
              >
                <FaBell className="h-5 w-5" />
                <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  3
                </span>
              </button>

              {/* Notifications Dropdown */}
              {notificationsDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
                  <div className="py-2 px-4 bg-gray-100 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Notificaciones</h3>
                  </div>
                  <div className="py-2 px-4 max-h-64 overflow-y-auto">
                    <div className="border-b border-gray-200 py-3">
                      <p className="text-sm text-gray-700">Nueva solicitud creada</p>
                      <p className="text-xs text-gray-500">Hace 5 minutos</p>
                    </div>
                    <div className="border-b border-gray-200 py-3">
                      <p className="text-sm text-gray-700">Orden de trabajo asignada</p>
                      <p className="text-xs text-gray-500">Hace 2 horas</p>
                    </div>
                    <div className="py-3">
                      <p className="text-sm text-gray-700">Factura pendiente de pago</p>
                      <p className="text-xs text-gray-500">Hace 1 día</p>
                    </div>
                  </div>
                  <div className="py-2 px-4 bg-gray-100 border-t border-gray-200 text-center">
                    <Link
                      to="#"
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      Ver todas las notificaciones
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative ml-4">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <span className="mr-2 text-sm hidden md:block">
                  {currentUser?.username}
                </span>
                <FaUserCircle className="h-6 w-6 text-primary-600" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mi Perfil
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;