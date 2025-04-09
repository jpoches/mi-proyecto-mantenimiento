// client/src/components/Quotes/QuoteForm.js
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const QuoteForm = ({ onSubmit, onCancel, requests, initialData = null }) => {
  // Usar useForm con valores iniciales si estamos editando
  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {
      request_id: '',
      description: '',
      items: [{ description: '', quantity: 1, unit_price: 0 }],
      status: 'pending'
    }
  });
  
  // Usar useFieldArray para manejar los items dinámicos
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  
  // Calcular total cuando cambian los items
  const items = watch('items');
  useEffect(() => {
    if (items) {
      const sum = items.reduce((acc, item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.unit_price) || 0;
        return acc + (quantity * price);
      }, 0);
      setTotal(sum);
    }
  }, [items]);
  
  // Llenar el formulario si hay datos iniciales
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...fields];
    newItems[index][field] = value;
    
    // Validar que los valores numéricos sean válidos
    if (field === 'quantity' || field === 'unit_price') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        return; // No permitir valores negativos o no numéricos
      }
    }
  };

  const addItem = () => {
    append({ description: '', quantity: 1, unit_price: 0 });
  };

  const submitForm = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Validar que haya al menos un ítem con descripción
      if (!data.items || data.items.length === 0 || !data.items[0].description) {
        toast.error('Debes agregar al menos un ítem a la cotización');
        setIsSubmitting(false);
        return;
      }
      
      // Calcular el total final y agregarlo a los datos
      const calculatedTotal = data.items.reduce((sum, item) => {
        return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
      }, 0);
      
      data.total = calculatedTotal;
      
      // Llamar a la función de envío proporcionada por el componente padre
      await onSubmit(data);
      
      // Limpiar el formulario después de enviar exitosamente
      reset();
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      toast.error('Ha ocurrido un error al crear la cotización');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Editar Cotización' : 'Nueva Cotización'}
        </h2>
        
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Solicitud</label>
            <select
              {...register('request_id')}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione una solicitud (opcional)</option>
              {requests.map(req => (
                <option key={req.id} value={req.id}>{req.title}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <input
              type="text"
              {...register('description', { 
                required: 'La descripción es requerida' 
              })}
              className={`w-full p-2 border rounded ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Descripción de la cotización"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Ítems</label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="mr-1" /> Añadir ítem
              </button>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              {fields.length === 0 && (
                <p className="text-center text-gray-500 py-2">No hay ítems. Añade al menos uno.</p>
              )}
              
              {fields.map((item, index) => (
                <div key={item.id} className="flex space-x-2 mb-2 items-start">
                  <div className="flex-1">
                    <input
                      {...register(`items.${index}.description`, {
                        required: 'La descripción es requerida'
                      })}
                      placeholder="Descripción"
                      className={`w-full p-2 border rounded ${
                        errors.items?.[index]?.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.items?.[index]?.description && (
                      <p className="mt-1 text-xs text-red-500">{errors.items[index].description.message}</p>
                    )}
                  </div>
                  
                  <div className="w-20">
                    <input
                      type="number"
                      placeholder="Cantidad"
                      {...register(`items.${index}.quantity`, {
                        required: 'Requerido',
                        min: { value: 1, message: 'Mínimo 1' },
                        valueAsNumber: true
                      })}
                      className={`w-full p-2 border rounded ${
                        errors.items?.[index]?.quantity ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="1"
                      step="1"
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="mt-1 text-xs text-red-500">{errors.items[index].quantity.message}</p>
                    )}
                  </div>
                  
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Precio"
                      {...register(`items.${index}.unit_price`, {
                        required: 'Requerido',
                        min: { value: 0, message: 'No negativo' },
                        valueAsNumber: true
                      })}
                      className={`w-full p-2 border rounded ${
                        errors.items?.[index]?.unit_price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="0"
                      step="0.01"
                    />
                    {errors.items?.[index]?.unit_price && (
                      <p className="mt-1 text-xs text-red-500">{errors.items[index].unit_price.message}</p>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:text-red-800 mt-1"
                    title="Eliminar ítem"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              
              {fields.length > 0 && (
                <div className="flex justify-end mt-4 border-t pt-2">
                  <div className="text-right">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="ml-2 font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  {initialData ? 'Actualizar' : 'Crear'} Cotización
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteForm;