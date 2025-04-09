// client/src/context/AppContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  clientService,
  servicePersonnelService,
  requestService,
  workOrderService
} from '../services/api-service';

// Estado inicial
const initialState = {
  clients: { data: [], loading: false, error: null, lastFetched: null },
  serviceTechnicians: { data: [], loading: false, error: null, lastFetched: null },
  requests: { data: [], loading: false, error: null, lastFetched: null },
  workOrders: { data: [], loading: false, error: null, lastFetched: null },
  recentRequests: { data: [], loading: false, error: null, lastFetched: null },
  recentWorkOrders: { data: [], loading: false, error: null, lastFetched: null },
  pendingInvoices: { data: [], loading: false, error: null, lastFetched: null },
  upcomingEvents: { data: [], loading: false, error: null, lastFetched: null },
  isMenuOpen: false
};

// Tipos de acciones
const actionTypes = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  TOGGLE_MENU: 'TOGGLE_MENU',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  DELETE_ITEM: 'DELETE_ITEM'
};

// Reducer para manejar el estado
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_START:
      return {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          loading: true,
          error: null
        }
      };
    
    case actionTypes.FETCH_SUCCESS:
      return {
        ...state,
        [action.resource]: {
          data: action.payload,
          loading: false,
          error: null,
          lastFetched: new Date().getTime()
        }
      };
    
    case actionTypes.FETCH_ERROR:
      return {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          loading: false,
          error: action.payload
        }
      };
    
    case actionTypes.TOGGLE_MENU:
      return {
        ...state,
        isMenuOpen: action.payload !== undefined ? action.payload : !state.isMenuOpen
      };
    
    case actionTypes.ADD_ITEM:
      return {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          data: [action.payload, ...state[action.resource].data]
        }
      };
    
    case actionTypes.UPDATE_ITEM:
      return {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          data: state[action.resource].data.map(item => 
            item.id === action.payload.id ? { ...item, ...action.payload } : item
          )
        }
      };
    
    case actionTypes.DELETE_ITEM:
      return {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          data: state[action.resource].data.filter(item => item.id !== action.payload)
        }
      };
    
    default:
      return state;
  }
}

// Crear el contexto
const AppContext = createContext();

// Hook personalizado para usar el contexto
export const useApp = () => useContext(AppContext);

// Tiempo de caché (30 minutos)
const CACHE_TIME = 30 * 60 * 1000;

// Proveedor del contexto
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { currentUser, isAuthenticated } = useAuth();
  
  // Verificar si los datos están en caché
  const isCacheValid = (resource) => {
    const { lastFetched } = state[resource];
    if (!lastFetched) return false;
    
    return (new Date().getTime() - lastFetched) < CACHE_TIME;
  };
  
  // Cargar clientes
  const loadClients = async (force = false) => {
    if (!isAuthenticated || currentUser?.role !== 'admin') return;
    if (!force && isCacheValid('clients')) return;
    
    dispatch({ type: actionTypes.FETCH_START, resource: 'clients' });
    
    try {
      const data = await clientService.getAll();
      dispatch({ type: actionTypes.FETCH_SUCCESS, resource: 'clients', payload: data });
    } catch (error) {
      console.error('Error loading clients:', error);
      dispatch({ type: actionTypes.FETCH_ERROR, resource: 'clients', payload: error.message });
    }
  };
  
  // Cargar técnicos
  const loadServiceTechnicians = async (force = false) => {
    if (!isAuthenticated || currentUser?.role !== 'admin') return;
    if (!force && isCacheValid('serviceTechnicians')) return;
    
    dispatch({ type: actionTypes.FETCH_START, resource: 'serviceTechnicians' });
    
    try {
      const data = await servicePersonnelService.getAll();
      dispatch({ type: actionTypes.FETCH_SUCCESS, resource: 'serviceTechnicians', payload: data });
    } catch (error) {
      console.error('Error loading technicians:', error);
      dispatch({ type: actionTypes.FETCH_ERROR, resource: 'serviceTechnicians', payload: error.message });
    }
  };
  
  // Cargar solicitudes recientes
  const loadRecentRequests = async (force = false) => {
    if (!isAuthenticated) return;
    if (!force && isCacheValid('recentRequests')) return;
    
    dispatch({ type: actionTypes.FETCH_START, resource: 'recentRequests' });
    
    try {
      let data;
      
      if (currentUser.role === 'admin') {
        data = await requestService.getRecent();
      } else if (currentUser.role === 'client' && currentUser.clientInfo) {
        data = await requestService.getRecentByClient(currentUser.clientInfo.id);
      }
      
      if (data) {
        dispatch({ type: actionTypes.FETCH_SUCCESS, resource: 'recentRequests', payload: data });
      }
    } catch (error) {
      console.error('Error loading recent requests:', error);
      dispatch({ type: actionTypes.FETCH_ERROR, resource: 'recentRequests', payload: error.message });
    }
  };
  
  // Cargar órdenes de trabajo recientes
  const loadRecentWorkOrders = async (force = false) => {
    if (!isAuthenticated) return;
    if (!force && isCacheValid('recentWorkOrders')) return;
    
    dispatch({ type: actionTypes.FETCH_START, resource: 'recentWorkOrders' });
    
    try {
      let data;
      
      if (currentUser.role === 'admin') {
        data = await workOrderService.getRecent();
      } else if (currentUser.role === 'technician' && currentUser.technicianInfo) {
        data = await workOrderService.getRecentByTechnician(currentUser.technicianInfo.id);
      }
      
      if (data) {
        dispatch({ type: actionTypes.FETCH_SUCCESS, resource: 'recentWorkOrders', payload: data });
      }
    } catch (error) {
      console.error('Error loading recent work orders:', error);
      dispatch({ type: actionTypes.FETCH_ERROR, resource: 'recentWorkOrders', payload: error.message });
    }
  };
  
  // Alternar menú lateral (para móviles)
  const toggleMenu = (forceState) => {
    dispatch({ type: actionTypes.TOGGLE_MENU, payload: forceState });
  };
  
  // Funciones CRUD genéricas
  const addItem = (resource, item) => {
    dispatch({ type: actionTypes.ADD_ITEM, resource, payload: item });
  };
  
  const updateItem = (resource, item) => {
    dispatch({ type: actionTypes.UPDATE_ITEM, resource, payload: item });
  };
  
  const deleteItem = (resource, id) => {
    dispatch({ type: actionTypes.DELETE_ITEM, resource, payload: id });
  };
  
  // Cargar datos iniciales al autenticar
  useEffect(() => {
    if (isAuthenticated) {
      // Cargar datos comunes según el rol
      if (currentUser.role === 'admin') {
        loadClients();
        loadServiceTechnicians();
      }
      
      loadRecentRequests();
      
      if (currentUser.role === 'admin' || currentUser.role === 'technician') {
        loadRecentWorkOrders();
      }
    }
  }, [isAuthenticated, currentUser]);
  
  // Valor proporcionado por el contexto
  const value = {
    ...state,
    loadClients,
    loadServiceTechnicians,
    loadRecentRequests,
    loadRecentWorkOrders,
    toggleMenu,
    addItem,
    updateItem,
    deleteItem
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;