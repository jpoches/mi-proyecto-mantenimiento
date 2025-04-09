// client/src/utils/validation.js

/**
 * Utilidades de validación para formularios
 */

// Reglas de validación para campos comunes
export const validationRules = {
    // Reglas para campos de usuario
    username: {
      required: 'El nombre de usuario es requerido',
      minLength: {
        value: 3,
        message: 'El nombre de usuario debe tener al menos 3 caracteres'
      },
      maxLength: {
        value: 50,
        message: 'El nombre de usuario no puede exceder 50 caracteres'
      },
      pattern: {
        value: /^[a-zA-Z0-9._-]+$/,
        message: 'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos'
      }
    },
    
    password: {
      required: 'La contraseña es requerida',
      minLength: {
        value: 6,
        message: 'La contraseña debe tener al menos 6 caracteres'
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
      }
    },
    
    name: {
      required: 'El nombre es requerido',
      minLength: {
        value: 2,
        message: 'El nombre debe tener al menos 2 caracteres'
      },
      maxLength: {
        value: 100,
        message: 'El nombre no puede exceder 100 caracteres'
      }
    },
    
    email: {
      required: 'El email es requerido',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'El formato del email no es válido'
      }
    },
    
    phone: {
      pattern: {
        value: /^[\d\s+().-]+$/,
        message: 'El formato del teléfono no es válido'
      }
    },
    
    // Reglas para solicitudes
    title: {
      required: 'El título es requerido',
      minLength: {
        value: 3,
        message: 'El título debe tener al menos 3 caracteres'
      },
      maxLength: {
        value: 100,
        message: 'El título no puede exceder 100 caracteres'
      }
    },
    
    description: {
      required: 'La descripción es requerida',
      minLength: {
        value: 10,
        message: 'La descripción debe tener al menos 10 caracteres'
      }
    },
    
    location: {
      required: 'La ubicación es requerida'
    },
    
    // Reglas para cotizaciones e ítems
    quantity: {
      required: 'La cantidad es requerida',
      min: {
        value: 1,
        message: 'La cantidad debe ser al menos 1'
      },
      valueAsNumber: true
    },
    
    price: {
      required: 'El precio es requerido',
      min: {
        value: 0,
        message: 'El precio no puede ser negativo'
      },
      valueAsNumber: true
    }
  };
  
  // Validadores personalizados
  export const customValidators = {
    // Validar que dos campos sean iguales (ej: confirmación de contraseña)
    matchValues: (field, getValues, message) => ({
      validate: value => value === getValues(field) || message
    }),
    
    // Validar que un campo tenga un valor mínimo
    minValue: (min, message) => ({
      validate: value => parseFloat(value) >= min || message
    }),
    
    // Validar que un campo tenga un valor máximo
    maxValue: (max, message) => ({
      validate: value => parseFloat(value) <= max || message
    }),
    
    // Validar que una fecha sea posterior a la fecha actual
    isFutureDate: (message = 'La fecha debe ser en el futuro') => ({
      validate: value => new Date(value) > new Date() || message
    }),
    
    // Validar que una fecha sea posterior a otra fecha
    isAfter: (otherDateField, getValues, message) => ({
      validate: value => !value || !getValues(otherDateField) || new Date(value) > new Date(getValues(otherDateField)) || message
    }),
    
    // Validar formato de RUC/RFC
    isValidTaxId: (message = 'El formato del RFC/RUC no es válido') => ({
      validate: value => /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(value) || message
    }),
    
    // Validar array no vacío
    isNotEmptyArray: (message = 'Debe agregar al menos un elemento') => ({
      validate: value => Array.isArray(value) && value.length > 0 || message
    })
}