// client/src/pages/Invoices/Invoices.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaFilter, FaCheck, FaPrint, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Invoices = () => {
  const { currentUser } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, [currentUser]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      let endpoint;
      if (currentUser.role === 'admin') {
        endpoint = `${API_URL}/invoices`;
      } else if (currentUser.role === 'client' && currentUser.clientInfo) {
        endpoint = `${API_URL}/invoices/client/${currentUser.clientInfo.id}`;
      }
      
      if (!endpoint) {
        setLoading(false);
        return;
      }
      
      const response = await axios.get(endpoint);
      setInvoices(response.data);
      setFilteredInvoices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Error al cargar las facturas');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filtrar facturas
    let filtered = [...invoices];
    
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.id.toString().includes(searchTerm) || 
        invoice.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }
    
    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/invoices/${id}/status`, { status });
      
      // Actualizar lista de facturas
      const updatedInvoices = invoices.map(invoice => 
        invoice.id === id ? { ...invoice, status } : invoice
      );
      
      setInvoices(updatedInvoices);
      toast.success(`Factura marcada como ${status === 'paid' ? 'pagada' : 'pendiente'} exitosamente`);
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Error al actualizar el estado de la factura');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Facturas</h1>
      
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-64">
            <input
              type="text"
              placeholder="Buscar facturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="paid">Pagadas</option>
            </select>
            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      {/* Lista de facturas */}
      {loading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredInvoices.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  {currentUser.role === 'admin' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.created_at)}
                    </td>
                    {currentUser.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.client?.name || 'Cliente no disponible'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{invoice.work_order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.due_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Pagada' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {currentUser.role === 'admin' && invoice.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(invoice.id, 'paid')}
                            className="text-green-600 hover:text-green-900"
                            title="Marcar como pagada"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Imprimir"
                        >
                          <FaPrint />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Descargar"
                        >
                          <FaDownload />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No hay facturas disponibles.</p>
        </div>
      )}
    </div>
  );
};

export default Invoices;