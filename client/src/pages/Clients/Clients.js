// client/src/pages/Clients/Clients.js (corregido)
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import ClientService from '../../services/client.service';
import ClientForm from '../../components/Clients/ClientForm';
import LoadingOverlay from '../../components/UI/LoadingOverlay';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await ClientService.getAll();
      // Asegurarse de que data es un array
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (data) => {
    try {
      const response = await ClientService.create(data);
      // Asegurarse de que clients es un array antes de usar spread
      setClients(prevClients => Array.isArray(prevClients) ? [...prevClients, response] : [response]);
      setShowForm(false);
      toast.success('Cliente creado exitosamente');
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Error al crear el cliente');
      throw error;
    }
  };

  const handleUpdateClient = async (data) => {
    try {
      await ClientService.update(editingClient.id, data);
      // Asegurarse de que clients es un array antes de mapear
      if (Array.isArray(clients)) {
        const updatedClients = clients.map(client => 
          client.id === editingClient.id ? { ...client, ...data } : client
        );
        setClients(updatedClients);
      }
      setEditingClient(null);
      toast.success('Cliente actualizado exitosamente');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Error al actualizar el cliente');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await ClientService.delete(id);
      // Asegurarse de que clients es un array antes de filtrar
      if (Array.isArray(clients)) {
        setClients(clients.filter(client => client.id !== id));
      }
      toast.success('Cliente eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Error al eliminar el cliente');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
  };

  const handleFormSubmit = async (data) => {
    if (editingClient) {
      await handleUpdateClient(data);
    } else {
      await handleCreateClient(data);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  // Asegurarse de que clients es un array antes de filtrar
  const filteredClients = Array.isArray(clients) ? clients.filter(client => {
    return client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestión de Clientes</h1>
      
      {/* Barra de búsqueda y acciones */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors w-full md:w-auto justify-center transform hover:scale-105 duration-200 shadow-md"
        >
          <FaPlus className="mr-2" /> Nuevo Cliente
        </button>
      </div>
      
      {/* Lista de clientes con overlay de carga */}
      <LoadingOverlay loading={loading}>
        {filteredClients.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dirección
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {client.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="text-primary-600 hover:text-primary-900 transition-colors"
                            title="Editar"
                          >
                            <FaEdit className="hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Eliminar"
                          >
                            <FaTrash className="hover:scale-110 transition-transform" />
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
            <p className="text-gray-500">No se encontraron clientes.</p>
          </div>
        )}
      </LoadingOverlay>
      
      {/* Modal de formulario */}
      {(showForm || editingClient) && (
        <ClientForm 
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={editingClient}
        />
      )}
    </div>
  );
};

export default Clients;