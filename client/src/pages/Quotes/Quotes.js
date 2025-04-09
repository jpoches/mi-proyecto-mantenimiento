// client/src/pages/Quotes/Quotes.js
import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import QuoteList from '../../components/Quotes/QuoteList';
import QuoteForm from '../../components/Quotes/QuoteForm';
import QuoteDetails from '../../components/Quotes/QuoteDetails';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);  // Inicializar como array vacío en lugar de undefined
  const [filteredQuotes, setFilteredQuotes] = useState([]);  // Inicializar como array vacío
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editQuote, setEditQuote] = useState(null);
  const { currentUser } = useAuth();


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Cargar cotizaciones
        const quotesResponse = await axios.get('/quotes');
        setQuotes(quotesResponse.data);
        setFilteredQuotes(quotesResponse.data);

        // Cargar solicitudes para vincularlas
        const requestsEndpoint = currentUser.role === 'admin'
          ? '/requests'
          : `/requests/client/${currentUser.clientInfo ? currentUser.clientInfo.id : ''}`;
        const requestsResponse = await axios.get(requestsEndpoint);
        setRequests(requestsResponse.data);
      } catch (error) {
        console.error('Error fetching quotes or requests:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Filtrar cotizaciones cuando cambia el término de búsqueda o el filtro de estado
  useEffect(() => {
    let result = quotes;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(quote => 
        quote.description?.toLowerCase().includes(term) ||
        quote.request?.title?.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      result = result.filter(quote => quote.status === statusFilter);
    }
    
    setFilteredQuotes(result);
  }, [quotes, searchTerm, statusFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreate = async (quoteData) => {
    try {
      const response = await axios.post('/quotes', quoteData);
      setQuotes([response.data, ...quotes]);
      setFilteredQuotes([response.data, ...filteredQuotes]); 
      setShowForm(false);
      toast.success('Cotización creada con éxito');
    } catch (error) {
      console.error('Error creating quote:', error);
      toast.error('Error al crear la cotización');
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  const handleEdit = (quoteId) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (quote) {
      setEditQuote(quote);
      setShowForm(true);
    }
  };

  const handleUpdate = async (quoteId, updatedData) => {
    try {
      const response = await axios.put(`/quotes/${quoteId}`, updatedData);
      
      // Actualizar la lista de cotizaciones
      const updatedQuotes = quotes.map(quote => 
        quote.id === quoteId ? response.data : quote
      );
      
      setQuotes(updatedQuotes);
      setFilteredQuotes(updatedQuotes);
      setShowForm(false);
      setEditQuote(null);
      toast.success('Cotización actualizada con éxito');
    } catch (error) {
      console.error('Error updating quote:', error);
      toast.error('Error al actualizar la cotización');
      throw error;
    }
  };

  const handleUpdateStatus = async (quoteId, status) => {
    try {
      const response = await axios.patch(`/quotes/${quoteId}`, { status });
      const updatedQuotes = quotes.map((quote) =>
        quote.id === quoteId ? { ...quote, status, invoice: response.data.invoice } : quote
      );
      setQuotes(updatedQuotes);
      setFilteredQuotes(updatedQuotes);
      setSelectedQuote(null);
      toast.success(`Cotización ${status === 'approved' ? 'aprobada' : 'rechazada'} con éxito`);
    } catch (error) {
      console.error('Error updating quote status:', error);
      toast.error('Error al actualizar la cotización');
    }
  };

  const handleView = (quoteId) => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (quote) {
      setSelectedQuote(quote);
    }
  };

  const handleDelete = async (quoteId) => {
    if (window.confirm('¿Está seguro de eliminar esta cotización?')) {
      try {
        await axios.delete(`/quotes/${quoteId}`);
        const updatedQuotes = quotes.filter((quote) => quote.id !== quoteId);
        setQuotes(updatedQuotes);
        setFilteredQuotes(updatedQuotes);
        setSelectedQuote(null);
        toast.success('Cotización eliminada con éxito');
      } catch (error) {
        console.error('Error deleting quote:', error);
        toast.error('Error al eliminar la cotización');
      }
    }
  };

  const handleFormSubmit = async (data) => {
    if (editQuote) {
      await handleUpdate(editQuote.id, data);
    } else {
      await handleCreate(data);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditQuote(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Cotizaciones</h1>
      
      {/* Barra de búsqueda y acciones */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-64">
            <input
              type="text"
              placeholder="Buscar cotizaciones..."
              value={searchTerm}
              onChange={handleSearch}
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
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobadas</option>
              <option value="rejected">Rechazadas</option>
            </select>
            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <button
          onClick={() => {
            setEditQuote(null);
            setShowForm(true);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto justify-center"
        >
          <FaPlus className="mr-2" /> Nueva Cotización
        </button>
      </div>
      
      {/* Lista de cotizaciones */}
      {loading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <QuoteList
        quotes={filteredQuotes || []}  // Asegúrate de que siempre sea un array
          onView={handleView}
          onEdit={handleEdit}
          onUpdate={handleUpdateStatus}
          onDelete={handleDelete}
          isAdmin={currentUser.role === 'admin'}
        />
      )}

      {/* Modal de formulario */}
      {showForm && (
        <QuoteForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          requests={requests}
          initialData={editQuote}
        />
      )}

      {/* Modal de detalles */}
      {selectedQuote && (
        <QuoteDetails
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onUpdate={handleUpdateStatus}
          onDelete={handleDelete}
          isAdmin={currentUser.role === 'admin'}
        />
      )}
    </div>
  );
};

export default Quotes;