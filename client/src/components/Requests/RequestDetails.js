// client/src/components/Requests/RequestDetails.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTimes, FaCheck, FaTrash, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../config/api';

const RequestDetails = ({ request, onClose, onUpdate, onDelete, isAdmin }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/attachments/request/${request.id}`);
        setAttachments(response.data);
      } catch (error) {
        console.error('Error fetching attachments:', error);
        toast.error('Error al cargar los archivos adjuntos');
      } finally {
        setLoading(false);
      }
    };

    fetchAttachments();
  }, [request.id]);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Función para descargar archivo adjunto
  const handleDownload = async (attachmentId, fileName) => {
    try {
      const response = await axios.get(`${API_URL}/attachments/${attachmentId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      toast.error('Error al descargar el archivo');
    }
  };

  // Mapeo de estados a etiquetas y colores
  const statusConfig = {
    pending: {
      label: 'Pendiente',
      color: 'bg-yellow-100 text-yellow-800'
    },
    approved: {
      label: 'Aprobada',
      color: 'bg-green-100 text-green-800'
    },
    rejected: {
      label: 'Rechazada',
      color: 'bg-red-100 text-red-800'
    }
  };

  // Mapeo de prioridades
  const priorityConfig = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta'
  };

  // Mapeo de tipos de servicio
  const serviceTypes = {
    electrical: 'Eléctrico',
    plumbing: 'Plomería',
    carpentry: 'Carpintería',
    painting: 'Pintura',
    cleaning: 'Limpieza',
    other: 'Otro'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Detalles de la Solicitud #{request.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Cabecera con estado y acciones */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex items-center mb-3 sm:mb-0">
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${statusConfig[request.status].color}`}>
                {statusConfig[request.status].label}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                Creada: {formatDate(request.created_at)}
              </span>
            </div>
            
            <div className="flex space-x-2">
              {isAdmin && request.status === 'pending' && (
                <>
                  <button
                    onClick={() => onUpdate(request.id, 'approved')}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <FaCheck className="mr-1" /> Aprobar
                  </button>
                  <button
                    onClick={() => onUpdate(request.id, 'rejected')}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  >
                    <FaTimes className="mr-1" /> Rechazar
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  onDelete(request.id);
                  onClose();
                }}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                <FaTrash className="mr-1" /> Eliminar
              </button>
            </div>
          </div>

          {/* Información principal */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{request.title}</h3>
            <p className="text-gray-700 whitespace-pre-wrap mb-4">{request.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Ubicación:</p>
                <p className="text-gray-800">{request.location}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 font-medium">Tipo de Servicio:</p>
                <p className="text-gray-800">{serviceTypes[request.service_type]}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 font-medium">Prioridad:</p>
                <p className="text-gray-800">{priorityConfig[request.priority]}</p>
              </div>
              
              {isAdmin && (
                <div>
                  <p className="text-sm text-gray-600 font-medium">Cliente:</p>
                  <p className="text-gray-800">{request.client.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Archivos adjuntos */}
          <div>
            <h4 className="text-md font-semibold mb-2">Archivos Adjuntos</h4>
            
            {loading ? (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : attachments.length === 0 ? (
              <p className="text-gray-500 italic">No hay archivos adjuntos</p>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3">
                <ul className="divide-y divide-gray-200">
                  {attachments.map((attachment) => (
                    <li key={attachment.id} className="py-2 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{attachment.file_name}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(attachment.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownload(attachment.id, attachment.file_name)}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                      >
                        <FaDownload className="mr-1" /> Descargar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;