import { createContext, useContext, useReducer, useEffect } from 'react';

/* ─── Datos iniciales de demostración ─── */
const INITIAL_BARBEROS = [
  { id: 1, nombre: 'Alejandro J.', especialidad: 'Corte + Barba', activo: true, avatar: 'AJ' },
  { id: 2, nombre: 'Marco R.',     especialidad: 'Corte Clásico',  activo: true, avatar: 'MR' },
  { id: 3, nombre: 'Diego P.',     especialidad: 'Degradados',     activo: false, avatar: 'DP' },
];

const INITIAL_SERVICIOS = [
  { id: 1, nombre: 'Corte',          precio: 50,  duracion: 30 },
  { id: 2, nombre: 'Barba',          precio: 30,  duracion: 20 },
  { id: 3, nombre: 'Corte + Barba',  precio: 70,  duracion: 45 },
  { id: 4, nombre: 'Degradado',      precio: 60,  duracion: 35 },
  { id: 5, nombre: 'Cejas',          precio: 20,  duracion: 15 },
];

const INITIAL_CLIENTES = [
  { id: 1, nombre: 'Carlos Mamani',    telefono: '70011223', notas: '', creadoEn: new Date().toISOString() },
  { id: 2, nombre: 'Rodrigo Flores',   telefono: '71234567', notas: '', creadoEn: new Date().toISOString() },
  { id: 3, nombre: 'Bruno Chávez',     telefono: '76543210', notas: 'Alérgico a ciertos productos', creadoEn: new Date().toISOString() },
];

const SILLAS_COUNT = 4;

function loadState() {
  try {
    const raw = localStorage.getItem('aj_state');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function buildInitialState() {
  const saved = loadState();
  if (saved) return saved;
  return {
    barberos: INITIAL_BARBEROS,
    servicios: INITIAL_SERVICIOS,
    clientes: INITIAL_CLIENTES,
    sillas: Array.from({ length: SILLAS_COUNT }, (_, i) => ({
      id: i + 1,
      ocupada: false,
      sesionActiva: null,
    })),
    registros: [],   // historial completo de servicios terminados
    citas: [],       // próximas citas agendadas
    nextId: { barberos: 4, clientes: 4, citas: 1, registros: 1 },
  };
}

/* ─── REDUCER HELPERS ─── */
/**
 * Crea una acción ADD genérica para cualquier colección
 * @param {string} collectionKey - Clave de la colección (ej: 'clientes', 'barberos')
 * @param {string} idKey - Clave del contador de IDs (ej: 'clientes', 'barberos')
 * @param {object} payload - Datos a agregar
 * @param {object} currentState - Estado actual
 */
function createAddAction(collectionKey, idKey, payload, currentState) {
  const nextId = currentState.nextId[idKey] + 1;
  const newItem = {
    ...payload,
    id: currentState.nextId[idKey],
    ...(idKey === 'clientes' && { creadoEn: new Date().toISOString() }),
  };

  return {
    ...currentState,
    [collectionKey]: [...currentState[collectionKey], newItem],
    nextId: { ...currentState.nextId, [idKey]: nextId },
  };
}

/**
 * Función auxiliar para actualizar items en cualquier colección
 */
function updateItemInCollection(state, collectionKey, itemId, newData) {
  return {
    ...state,
    [collectionKey]: state[collectionKey].map(item =>
      item.id === itemId ? newData : item
    ),
  };
}

/**
 * Función auxiliar para eliminar items de cualquier colección
 */
function deleteItemFromCollection(state, collectionKey, itemId) {
  return {
    ...state,
    [collectionKey]: state[collectionKey].filter(item => item.id !== itemId),
  };
}

/* ─── REDUCER ─── */
function reducer(state, action) {
  switch (action.type) {

    /* BARBEROS */
    case 'ADD_BARBERO':
      return createAddAction('barberos', 'barberos', action.payload, state);
    case 'UPDATE_BARBERO':
      return updateItemInCollection(state, 'barberos', action.payload.id, action.payload);
    case 'DELETE_BARBERO':
      return deleteItemFromCollection(state, 'barberos', action.id);

    /* CLIENTES */
    case 'ADD_CLIENTE':
      return createAddAction('clientes', 'clientes', action.payload, state);
    case 'UPDATE_CLIENTE':
      return updateItemInCollection(state, 'clientes', action.payload.id, action.payload);
    case 'DELETE_CLIENTE':
      return deleteItemFromCollection(state, 'clientes', action.id);

    /* SILLAS – INICIAR SERVICIO */
    case 'INICIAR_SERVICIO': {
      const { sillaId, clienteId, barberoId, servicioId } = action.payload;
      return {
        ...state,
        sillas: state.sillas.map(s => s.id === sillaId
          ? { ...s, ocupada: true, sesionActiva: { clienteId, barberoId, servicioId, inicio: new Date().toISOString() } }
          : s
        ),
      };
    }

    /* SILLAS – FINALIZAR SERVICIO */
    case 'FINALIZAR_SERVICIO': {
      const { sillaId, cobrado, citaAgendada } = action.payload;
      const silla = state.sillas.find(s => s.id === sillaId);
      const sesion = silla.sesionActiva;
      const fin = new Date().toISOString();

      const registro = {
        id: state.nextId.registros,
        clienteId: sesion.clienteId,
        barberoId: sesion.barberoId,
        servicioId: sesion.servicioId,
        inicio: sesion.inicio,
        fin,
        cobrado,
        citaAgendada: citaAgendada || null,
      };

      let citas = state.citas;
      let nextCitaId = state.nextId.citas;
      if (citaAgendada) {
        citas = [...citas, { id: nextCitaId, clienteId: sesion.clienteId, barberoId: sesion.barberoId, servicioId: sesion.servicioId, fecha: citaAgendada, estado: 'pendiente' }];
        nextCitaId += 1;
      }

      return {
        ...state,
        sillas: state.sillas.map(s => s.id === sillaId ? { ...s, ocupada: false, sesionActiva: null } : s),
        registros: [...state.registros, registro],
        citas,
        nextId: { ...state.nextId, registros: state.nextId.registros + 1, citas: nextCitaId },
      };
    }

    /* CITAS */
    case 'UPDATE_CITA':
      return { ...state, citas: state.citas.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CITA':
      return { ...state, citas: state.citas.filter(c => c.id !== action.id) };

    default: return state;
  }
}

/* ─── CONTEXT ─── */
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  useEffect(() => {
    localStorage.setItem('aj_state', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}

/* ─── HELPERS ─── */
export function getClienteById(clientes, id) {
  return clientes.find(c => c.id === id);
}
export function getBarberoById(barberos, id) {
  return barberos.find(b => b.id === id);
}
export function getServicioById(servicios, id) {
  return servicios.find(s => s.id === id);
}
export function sugerirFechaCita(semanas = 3) {
  const d = new Date();
  d.setDate(d.getDate() + semanas * 7);
  return d.toISOString().split('T')[0];
}
export function formatFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function formatHora(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
}
export function calcularDuracion(inicio, fin) {
  const diffMs = new Date(fin || Date.now()) - new Date(inicio);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}min`;
}
