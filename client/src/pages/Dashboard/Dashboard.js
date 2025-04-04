// client/src/pages/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { FaUsers, FaClipboardList, FaTasks, FaFileInvoiceDollar, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config/api';
import StatCard from '../../components/Dashboard/StatCard';
import RecentRequests from '../../components/Dashboard/RecentRequests';
import RecentWorkOrders from '../../components/Dashboard/RecentWorkOrders';
import PendingInvoices from '../../components/Dashboard/PendingInvoices';
import UpcomingMaintenance from '../../components/Dashboard/UpcomingMaintenance';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalTechnicians: 0,
    pendingRequests: 0,
    activeWorkOrders: 0,
    completedTasks: 0,
    pendingInvoices: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentWorkOrders, setRecentWorkOrders] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Obtener estadísticas según el rol
        const statsEndpoint = currentUser.role === 'admin' 
          ? `${API_URL}/dashboard/admin-stats` 
          : `${API_URL}/dashboard/user-stats/${currentUser.id}`;
          
        const statsResponse = await axios.get(statsEndpoint);
        setStats(statsResponse.data);

        // Obtener datos recientes según el rol
        let requestsEndpoint, workOrdersEndpoint, invoicesEndpoint, maintenanceEndpoint;
        
        if (currentUser.role === 'admin') {
          requestsEndpoint = `${API_URL}/requests/recent`;
          workOrdersEndpoint = `${API_URL}/work-orders/recent`;
          invoicesEndpoint = `${API_URL}/invoices/pending`;
          maintenanceEndpoint = `${API_URL}/calendar/upcoming`;
        } else if (currentUser.role === 'client') {
          requestsEndpoint = `${API_URL}/requests/client/${currentUser.clientInfo.id}/recent`;
          workOrdersEndpoint = null;
          invoicesEndpoint = `${API_URL}/invoices/client/${currentUser.clientInfo.id}/pending`;
          maintenanceEndpoint = `${API_URL}/calendar/client/${currentUser.clientInfo.id}/upcoming`;
        } else if (currentUser.role === 'technician') {
          requestsEndpoint = null;
          workOrdersEndpoint = `${API_URL}/work-orders/technician/${currentUser.technicianInfo.id}/recent`;
          invoicesEndpoint = null;
          maintenanceEndpoint = `${API_URL}/calendar/technician/${currentUser.technicianInfo.id}/upcoming`;
        }

        // Realizar solicitudes en paralelo
        const requests = [];

        if (requestsEndpoint) {
          requests.push(axios.get(requestsEndpoint).then(res => setRecentRequests(res.data)));
        }
        
        if (workOrdersEndpoint) {
          requests.push(axios.get(workOrdersEndpoint).then(res => setRecentWorkOrders(res.data)));
        }
        
        if (invoicesEndpoint) {
          requests.push(axios.get(invoicesEndpoint).then(res => setPendingInvoices(res.data)));
        }
        
        if (maintenanceEndpoint) {
          requests.push(axios.get(maintenanceEndpoint).then(res => setUpcomingMaintenance(res.data)));
        }

        await Promise.all(requests);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // Determinar qué estadísticas mostrar según el rol
  const getStatsCards = () => {
    if (currentUser.role === 'admin') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Clientes" 
            value={stats.totalClients} 
            icon={<FaUsers className="text-blue-500" />} 
            color="blue"
          />
          <StatCard 
            title="Técnicos" 
            value={stats.totalTechnicians} 
            icon={<FaUsers className="text-green-500" />} 
            color="green"
          />
          <StatCard 
            title="Solicitudes Pendientes" 
            value={stats.pendingRequests} 
            icon={<FaClipboardList className="text-yellow-500" />} 
            color="yellow"
          />
          <StatCard 
            title="Facturas Pendientes" 
            value={stats.pendingInvoices} 
            icon={<FaFileInvoiceDollar className="text-red-500" />} 
            color="red"
          />
        </div>
      );
    } else if (currentUser.role === 'client') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title="Mis Solicitudes" 
            value={stats.totalRequests} 
            icon={<FaClipboardList className="text-blue-500" />} 
            color="blue"
          />
          <StatCard 
            title="Órdenes Activas" 
            value={stats.activeWorkOrders} 
            icon={<FaTasks className="text-green-500" />} 
            color="green"
          />
          <StatCard 
            title="Facturas Pendientes" 
            value={stats.pendingInvoices} 
            icon={<FaFileInvoiceDollar className="text-yellow-500" />} 
            color="yellow"
          />
        </div>
      );
    } else if (currentUser.role === 'technician') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title="Órdenes Asignadas" 
            value={stats.assignedWorkOrders} 
            icon={<FaClipboardList className="text-blue-500" />} 
            color="blue"
          />
          <StatCard 
            title="Tareas Pendientes" 
            value={stats.pendingTasks} 
            icon={<FaTasks className="text-yellow-500" />} 
            color="yellow"
          />
          <StatCard 
            title="Tareas Completadas" 
            value={stats.completedTasks} 
            icon={<FaTasks className="text-green-500" />} 
            color="green"
          />
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {getStatsCards()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de solicitudes recientes (para admin y cliente) */}
        {(currentUser.role === 'admin' || currentUser.role === 'client') && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Solicitudes Recientes</h2>
            <RecentRequests requests={recentRequests} />
          </div>
        )}

        {/* Sección de órdenes de trabajo recientes (para admin y técnico) */}
        {(currentUser.role === 'admin' || currentUser.role === 'technician') && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Órdenes de Trabajo Recientes</h2>
            <RecentWorkOrders workOrders={recentWorkOrders} />
          </div>
        )}

        {/* Sección de facturas pendientes (para admin y cliente) */}
        {(currentUser.role === 'admin' || currentUser.role === 'client') && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Facturas Pendientes</h2>
            <PendingInvoices invoices={pendingInvoices} />
          </div>
        )}

        {/* Sección de mantenimientos próximos (para todos) */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Mantenimientos Próximos</h2>
          <UpcomingMaintenance events={upcomingMaintenance} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;