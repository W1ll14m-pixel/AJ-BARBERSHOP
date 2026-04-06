import { useState, useMemo } from 'react';
import { CalendarDays, Trash2, CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp, getClienteById, getBarberoById, getServicioById, formatFecha } from '../context/AppContext';
import {
  getTodayDate,
  getWeekEndDate,
  filterCitas,
  countPendingTodayCitas,
  countPendingCitas,
  getCitaVariant,
  getCitaStatusLabel,
} from '../utils/citasUtils';
import ConfirmDialog from '../components/ConfirmDialog';
import { Badge } from '../components/ui';

const FILTROS = ['todas', 'hoy', 'esta semana', 'pendiente', 'atendida'];

export default function Citas() {
  const { state, dispatch } = useApp();
  const { citas, clientes, barberos, servicios } = state;

  const [filtro, setFiltro] = useState('todas');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmAtencion, setConfirmAtencion] = useState(null);

  // Calcular fechas una sola vez
  const hoy = getTodayDate();
  const semanaFin = getWeekEndDate();

  // Filtrar citas según el filtro seleccionado
  const citasFiltradas = useMemo(
    () => filterCitas(citas, filtro, hoy, semanaFin),
    [citas, filtro, hoy, semanaFin]
  );

  // Contar citas pendientes para hoy
  const pendientesHoy = countPendingTodayCitas(citas, hoy);

  /**
   * Marca una cita como atendida
   */
  function marcarAtendida() {
    dispatch({
      type: 'UPDATE_CITA',
      payload: { ...confirmAtencion, estado: 'atendida' },
    });
    setConfirmAtencion(null);
  }

  /**
   * Elimina una cita del estado
   */
  function eliminarCita() {
    dispatch({ type: 'DELETE_CITA', id: confirmDelete });
    setConfirmDelete(null);
  }

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-['Playfair_Display',Georgia,serif] font-bold text-[#0a0a0a]">
          Próximas Citas
        </h1>
        <p className="text-[12px] text-[#a0a0a0] mt-0.5">
          {pendientesHoy > 0 ? (
            <span className="text-[#7c4a10] font-medium">
              {pendientesHoy} cita{pendientesHoy !== 1 ? 's' : ''} para hoy
            </span>
          ) : (
            `${countPendingCitas(citas)} pendientes`
          )}
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {FILTROS.map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`flex-shrink-0 px-3 h-8 rounded-full text-[11px] font-semibold capitalize transition-all btn-press
              ${filtro === f
                ? 'bg-[#0a0a0a] text-white'
                : 'bg-[#f4f4f4] text-[#666] hover:bg-[#e8e8e8]'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lista */}
      {citasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarDays size={32} strokeWidth={1.2} className="text-[#e8e8e8] mb-3" />
          <p className="text-[14px] font-medium text-[#333]">Sin citas en este filtro</p>
          <p className="text-[12px] text-[#a0a0a0] mt-1">Las citas se generan al finalizar un servicio</p>
        </div>
      ) : (
        <div className="space-y-2">
          {citasFiltradas.map(cita => {
            const cliente  = getClienteById(clientes, cita.clienteId);
            const barbero  = getBarberoById(barberos, cita.barberoId);
            const servicio = getServicioById(servicios, cita.servicioId);
            const variant  = getCitaVariant(cita, hoy);
            const estadoLabel = getCitaStatusLabel(cita, hoy);

            return (
              <div
                key={cita.id}
                className={`border rounded-2xl p-4 transition-all
                  ${variant === 'warning' ? 'border-[#7c4a10]/30 bg-[#fef9f0]' : ''}
                  ${variant === 'danger'  ? 'border-[#9b2226]/20 bg-[#fff5f5]' : ''}
                  ${variant === 'success' ? 'border-[#1b4332]/20 bg-[#f0faf4]' : ''}
                  ${variant === 'default' ? 'border-[#e8e8e8] bg-white' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Fecha destacada */}
                  <div className="flex flex-col items-center bg-white border border-[#e8e8e8] rounded-xl w-12 py-2 flex-shrink-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#a0a0a0] font-medium">
                      {new Date(cita.fecha + 'T12:00:00').toLocaleDateString('es-BO', { month: 'short' })}
                    </span>
                    <span className="text-[20px] font-bold text-[#0a0a0a] leading-none">
                      {new Date(cita.fecha + 'T12:00:00').getDate()}
                    </span>
                    <span className="text-[9px] text-[#a0a0a0]">
                      {new Date(cita.fecha + 'T12:00:00').toLocaleDateString('es-BO', { weekday: 'short' })}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[14px] font-semibold text-[#0a0a0a] truncate">
                        {cliente?.nombre}
                      </p>
                      <Badge label={estadoLabel} variant={variant} />
                    </div>
                    <p className="text-[12px] text-[#666]">
                      {servicio?.nombre} · {barbero?.nombre}
                    </p>
                  </div>
                </div>

                {/* Acciones */}
                {cita.estado === 'pendiente' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setConfirmDelete(cita.id)}
                      className="flex-1 h-8 text-[11px] font-medium text-[#9b2226] bg-[#fff5f5] border border-[#9b2226]/20
                                 rounded-lg hover:bg-[#9b2226] hover:text-white transition-all btn-press flex items-center justify-center gap-1"
                    >
                      <Trash2 size={11} /> Cancelar
                    </button>
                    <button
                      onClick={() => setConfirmAtencion(cita)}
                      className="flex-1 h-8 text-[11px] font-semibold text-[#1b4332] bg-[#f0faf4] border border-[#1b4332]/20
                                 rounded-lg hover:bg-[#1b4332] hover:text-white transition-all btn-press flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={11} /> Atendida
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmAtencion}
        title="¿Marcar como atendida?"
        message={`La cita de ${getClienteById(clientes, confirmAtencion?.clienteId)?.nombre} quedará registrada como atendida.`}
        onConfirm={marcarAtendida}
        onCancel={() => setConfirmAtencion(null)}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="¿Cancelar esta cita?"
        message="La cita será eliminada del sistema."
        danger
        onConfirm={eliminarCita}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
