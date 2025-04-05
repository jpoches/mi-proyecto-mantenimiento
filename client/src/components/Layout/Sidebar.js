// client/src/components/Layout/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTimes, FaHome, FaUsers, FaUserTie, FaClipboardList, 
  FaTasks, FaFileInvoiceDollar, FaCalendarAlt, FaUser, 
  FaMoneyCheckAlt // Nuevo ícono para cotizaciones
} from 'react-icons/fa';
import Logo from './Logo';

const Sidebar = ({ isOpen, toggleSidebar, userRole }) => {
  const location = useLocation();

  // Helper to check if the current link is active
  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-primary-500 hover:text-white';
  };

  // Menu items based on user role
  const menuItems = [
    {
      path: '/dashboard',
      text: 'Dashboard',
      icon: <FaHome className="w-5 h-5" />,
      roles: ['admin', 'client', 'technician']
    },
    {
      path: '/clients',
      text: 'Clientes',
      icon: <FaUsers className="w-5 h-5" />,
      roles: ['admin']
    },
    {
      path: '/service-personnel',
      text: 'Personal',
      icon: <FaUserTie className="w-5 h-5" />,
      roles: ['admin']
    },
    {
      path: '/requests',
      text: 'Solicitudes',
      icon: <FaClipboardList className="w-5 h-5" />,
      roles: ['admin', 'client']
    },
    {
      path: '/work-orders',
      text: 'Órdenes de Trabajo',
      icon: <FaClipboardList className="w-5 h-5" />,
      roles: ['admin', 'technician']
    },
    {
      path: '/tasks',
      text: 'Tareas',
      icon: <FaTasks className="w-5 h-5" />,
      roles: ['admin', 'technician']
    },
    {
      path: '/quotes', // Nueva entrada para cotizaciones
      text: 'Cotizaciones',
      icon: <FaMoneyCheckAlt className="w-5 h-5" />,
      roles: ['admin', 'client'] // Visible para admin y clientes
    },
    {
      path: '/invoices',
      text: 'Facturas',
      icon: <FaFileInvoiceDollar className="w-5 h-5" />,
      roles: ['admin', 'client']
    },
    {
      path: '/calendar',
      text: 'Calendario',
      icon: <FaCalendarAlt className="w-5 h-5" />,
      roles: ['admin', 'client', 'technician']
    },
    {
      path: '/profile',
      text: 'Mi Perfil',
      icon: <FaUser className="w-5 h-5" />,
      roles: ['admin', 'client', 'technician']
    }
  ];

  return (
    <>
      {/* Overlay for mobile view */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <Logo />
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-primary-600 transition-colors lg:hidden"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="px-3 py-4">
          <ul className="space-y-2">
            {menuItems
              .filter(item => item.roles.includes(userRole))
              .map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive(item.path)}`}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    {item.icon}
                    <span className="ml-3">{item.text}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;