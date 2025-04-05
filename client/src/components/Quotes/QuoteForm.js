// client/src/components/Quotes/QuoteForm.js
import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const QuoteForm = ({ onSubmit, onCancel, requests }) => {
  const [formData, setFormData] = useState({
    request_id: '',
    description: '',
    items: [{ description: '', quantity: 1, unit_price: 0 }],
    status: 'pending'
  });

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unit_price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = formData.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    onSubmit({ ...formData, total });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Nueva Cotización</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Solicitud</label>
            <select
              value={formData.request_id}
              onChange={(e) => setFormData({ ...formData, request_id: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione una solicitud</option>
              {requests.map(req => (
                <option key={req.id} value={req.id}>{req.title}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Descripción</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Ítems</label>
            {formData.items.map((item, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Descripción"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-20 p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Precio unitario"
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                  className="w-24 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaPlus className="mr-1" /> Añadir ítem
            </button>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteForm;