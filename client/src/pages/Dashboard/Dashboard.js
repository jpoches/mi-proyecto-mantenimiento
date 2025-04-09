// client/src/pages/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { FaUsers, FaClipboardList, FaTasks, FaFileInvoiceDollar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { DashboardService } from '../../services';
import StatCard from '../../components/Dashboard/StatCard';
import RecentRequests from '../../components/Dashboard/RecentRequests';
import RecentWorkOrders from '../../components/Dashboard/RecentWorkOrders';
import PendingInvoices from '../../components/Dashboard/PendingInvoices';
import UpcomingMaintenance from '../../components/Dashboard/UpcomingMaintenance';
import DashboardCharts from '../../components/Dashboard/DashboardCharts';
import LoadingOverlay from '../../components/UI/LoadingOverlay';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalClients: 0,
      totalTechnicians: 0,
      pendingRequests: 0,
      activeWorkOrders: 0,
      completedTasks: 0,
      pendingInvoices: 0,
      weeklyStats: [],
      statusDistribution: []
    },
    recentRequests: [],
    recentWorkOrders: [],
    pendingInvoices: [],
    upcomingMaintenance: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Identificar IDs específicos según el rol
      let clientId = null;
      let technicianId = null;
      
      if (currentUser.role === 'client' && currentUser.clientInfo) {
        clientId = currentUser.clientInfo.id;
      } else if (currentUser.role === 'technician' && currentUser.technicianInfo) {
        technicianId = currentUser.technicianInfo.id;
      }
      
      // Obtener todos los datos del dashboard mediante el servicio
      const data = await DashboardService.getDashboardData(
        currentUser.role,
        currentUser.id,
        clientId,
        technicianId
      );
      
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determinar qué estadísticas mostrar según el rol
  const getStatsCards = () => {
    const { stats } = dashboardData;
    
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <LoadingOverlay loading={loading}>
        {/* Tarjetas de estadísticas */}
        {getStatsCards()}
        
        {/* Gráficos para administrador */}
        {currentUser.role === 'admin' && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Análisis y Tendencias</h2>
            <DashboardCharts 
              weeklyStats={dashboardData.stats.weeklyStats} 
              statusDistribution={dashboardData.stats.statusDistribution} 
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sección de solicitudes recientes (para admin y cliente) */}
          {(currentUser.role === 'admin' || currentUser.role === 'client') && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Solicitudes Recientes</h2>
              <RecentRequests requests={dashboardData.recentRequests} />
            </div>
          )}

          {/* Sección de órdenes de trabajo recientes (para admin y técnico) */}
          {(currentUser.role === 'admin' || currentUser.role === 'technician') && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Órdenes de Trabajo Recientes</h2>
              <RecentWorkOrders workOrders={dashboardData.recentWorkOrders} />
            </div>
          )}

          {/* Sección de facturas pendientes (para admin y cliente) */}
          {(currentUser.role === 'admin' || currentUser.role === 'client') && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Facturas Pendientes</h2>
              <PendingInvoices invoices={dashboardData.pendingInvoices} />
            </div>
          )}

          {/* Sección de mantenimientos próximos (para todos) */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Mantenimientos Próximos</h2>
            <UpcomingMaintenance events={dashboardData.upcomingMaintenance} />
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
};

export default Dashboard;