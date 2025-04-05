// client/src/pages/Quotes/Quotes.js
import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios'; // Ajusta la ruta
import { toast } from 'react-toastify';
import QuoteList from '../../components/Quotes/QuoteList';
import QuoteForm from '../../components/Quotes/QuoteForm';
import QuoteDetails from '../../components/Quotes/QuoteDetails';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredQuotes(
      quotes.filter(
        (quote) =>
          quote.description.toLowerCase().includes(term) ||
          quote.request?.title.toLowerCase().includes(term)
      )
    );
  };

  const handleCreate = async (quoteData) => {
    try {
      const response = await axios.post('/quotes', quoteData);
      setQuotes([...quotes, response.data]);
      setFilteredQuotes([...quotes, response.data]);
      setShowForm(false);
      toast.success('Cotización creada con éxito');
    } catch (error) {
      toast.error('Error al crear la cotización');
    }
  };

  const handleView = (quoteId) => {
    const quote = quotes.find((q) => q.id === quoteId);
    setSelectedQuote(quote);
  };

  const handleUpdate = async (quoteId, status) => {
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
      toast.error('Error al actualizar la cotización');
    }
  };

  const handleDelete = async (quoteId) => {
    try {
      await axios.delete(`/quotes/${quoteId}`);
      const updatedQuotes = quotes.filter((quote) => quote.id !== quoteId);
      setQuotes(updatedQuotes);
      setFilteredQuotes(updatedQuotes);
      setSelectedQuote(null);
      toast.success('Cotización eliminada con éxito');
    } catch (error) {
      toast.error('Error al eliminar la cotización');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cotizaciones</h1>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar cotizaciones..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border rounded w-1/3"
        />
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nueva Cotización
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <QuoteList
          quotes={filteredQuotes}
          onView={handleView}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isAdmin={currentUser.role === 'admin'}
        />
      )}

      {showForm && (
        <QuoteForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          requests={requests}
        />
      )}

      {selectedQuote && (
        <QuoteDetails
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isAdmin={currentUser.role === 'admin'}
        />
      )}
    </div>
  );
};

export default Quotes;