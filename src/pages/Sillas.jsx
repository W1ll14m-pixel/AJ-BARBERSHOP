import { useState, useEffect, useCallback } from 'react';
import { Plus, CheckCircle, Scissors, Clock, X } from 'lucide-react';
import { useApp, getClienteById, getBarberoById, getServicioById, sugerirFechaCita, formatHora } from '../context/AppContext';
import Modal from '../components/Modal';
import { BtnPrimary, BtnOutline, SelectField, Avatar, Badge, Card } from '../components/ui';

/* ─── Cronómetro en tiempo real ─── */
function LiveTimer({ inicio }) {
  const [mins, setMins] = useState(0);
  useEffect(() => {
    function tick() {
      setMins(Math.floor((Date.now() - new Date(inicio).getTime()) / 60000));
    }
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [inicio]);
  const over45 = mins > 45;
  return (
    <span className={`text-[12px] font-mono font-medium flex items-center gap-1 ${over45 ? 'text-[#7c4a10]' : 'text-[#666]'}`}>
      <Clock size={11} strokeWidth={2} className={over45 ? 'animate-pulse-dot' : ''} />
      {mins} min
    </span>
  );
}

/* ─── Modal: iniciar servicio ─── */
function ModalIniciar({ open, silla, onClose, onConfirm, clientes, barberos, servicios }) {
  const [form, setForm] = useState({ clienteId: '', barberoId: '', servicioId: '' });
  const barberosFiltrados = barberos.filter(b => b.activo);

  function reset() { setForm({ clienteId: '', barberoId: '', servicioId: '' }); }

  function handleClose() { reset(); onClose(); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.clienteId || !form.barberoId || !form.servicioId) return;
    onConfirm({ sillaId: silla.id, ...form, clienteId: +form.clienteId, barberoId: +form.barberoId, servicioId: +form.servicioId });
    reset();
    onClose();
  }

  return (
    <Modal title={`Iniciar Silla ${silla?.id}`} open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <SelectField
          label="Cliente"
          value={form.clienteId}
          onChange={e => setForm(p => ({ ...p, clienteId: e.target.value }))}
          required
        >
          <option value="">— Seleccionar —</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </SelectField>

        <SelectField
          label="Barbero"
          value={form.barberoId}
          onChange={e => setForm(p => ({ ...p, barberoId: e.target.value }))}
          required
        >
          <option value="">— Seleccionar —</option>
          {barberosFiltrados.map(b => (
            <option key={b.id} value={b.id}>{b.nombre}</option>
          ))}
        </SelectField>

        <SelectField
          label="Servicio"
          value={form.servicioId}
          onChange={e => setForm(p => ({ ...p, servicioId: e.target.value }))}
          required
        >
          <option value="">— Seleccionar —</option>
          {servicios.map(s => (
            <option key={s.id} value={s.id}>{s.nombre} · Bs {s.precio}</option>
          ))}
        </SelectField>

        <div className="flex gap-3 pt-2">
          <BtnOutline type="button" className="flex-1" onClick={handleClose}>
            Cancelar
          </BtnOutline>
          <BtnPrimary type="submit" className="flex-1">
            <Scissors size={14} /> Iniciar
          </BtnPrimary>
        </div>
      </form>
    </Modal>
  );
}

/* ─── Modal: finalizar servicio ─── */
function ModalFinalizar({ open, silla, onClose, onConfirm, clientes, barberos, servicios }) {
  const sesion = silla?.sesionActiva;
  const servicio = getServicioById(servicios, sesion?.servicioId);
  const [cobrado, setCobrado] = useState('');
  const [opcionCita, setOpcionCita] = useState('');  // '2s'|'3s'|'4s'|'manual'|'no'
  const [fechaManual, setFechaManual] = useState('');

  useEffect(() => {
    if (servicio) setCobrado(String(servicio.precio));
  }, [servicio, open]);

  function getFechaCita() {
    if (opcionCita === '2s') return sugerirFechaCita(2);
    if (opcionCita === '3s') return sugerirFechaCita(3);
    if (opcionCita === '4s') return sugerirFechaCita(4);
    if (opcionCita === 'manual') return fechaManual;
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    onConfirm({
      sillaId: silla.id,
      cobrado: parseFloat(cobrado) || 0,
      citaAgendada: getFechaCita(),
    });
    setOpcionCita('');
    setFechaManual('');
    onClose();
  }

  if (!sesion || !open) return null;
  const cliente = getClienteById(clientes, sesion.clienteId);
  const barbero = getBarberoById(barberos, sesion.barberoId);

  return (
    <Modal title={`Finalizar Silla ${silla?.id}`} open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Resumen */}
        <div className="bg-[#fafafa] rounded-xl p-4 space-y-2 border border-[#e8e8e8]">
          <div className="flex items-center gap-3">
            <Avatar initials={barbero?.avatar || '?'} />
            <div>
              <p className="text-[14px] font-semibold text-[#0a0a0a]">{cliente?.nombre}</p>
              <p className="text-[12px] text-[#666]">{barbero?.nombre} · {servicio?.nombre}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#a0a0a0]">Inicio: {formatHora(sesion.inicio)}</span>
            <LiveTimer inicio={sesion.inicio} />
          </div>
        </div>

        {/* Monto cobrado */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-[#a0a0a0]">
            Monto cobrado (Bs)
          </label>
          <input
            type="number"
            value={cobrado}
            onChange={e => setCobrado(e.target.value)}
            min="0"
            step="5"
            required
            className="w-full border-0 border-b border-[#e8e8e8] focus:border-[#0a0a0a] bg-transparent
                       py-2 text-[20px] font-bold text-[#0a0a0a] outline-none transition-colors"
          />
        </div>

        {/* Próxima cita */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#a0a0a0] font-semibold mb-3">
            Agendar próxima cita
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: '2s', label: 'En 2 semanas', date: sugerirFechaCita(2) },
              { key: '3s', label: 'En 3 semanas', date: sugerirFechaCita(3) },
              { key: '4s', label: 'En 4 semanas', date: sugerirFechaCita(4) },
              { key: 'manual', label: 'Fecha manual', date: null },
              { key: 'no',     label: 'Sin cita', date: null },
            ].map(opt => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setOpcionCita(opt.key)}
                className={`px-3 py-2.5 rounded-xl text-[12px] font-medium border transition-all btn-press text-left
                  ${opcionCita === opt.key
                    ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                    : 'bg-white text-[#333] border-[#e8e8e8] hover:border-[#0a0a0a]'
                  }`}
              >
                <span className="block">{opt.label}</span>
                {opt.date && <span className={`text-[10px] mt-0.5 block ${opcionCita === opt.key ? 'text-[#a0a0a0]' : 'text-[#a0a0a0]'}`}>{opt.date}</span>}
              </button>
            ))}
          </div>

          {opcionCita === 'manual' && (
            <div className="mt-3">
              <input
                type="date"
                value={fechaManual}
                onChange={e => setFechaManual(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border-b border-[#e8e8e8] focus:border-[#0a0a0a] bg-transparent py-2 text-[14px] text-[#0a0a0a] outline-none"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-1">
          <BtnOutline type="button" className="flex-1" onClick={onClose}>
            Cancelar
          </BtnOutline>
          <BtnPrimary type="submit" className="flex-1" disabled={!opcionCita}>
            <CheckCircle size={14} /> Finalizar
          </BtnPrimary>
        </div>
      </form>
    </Modal>
  );
}

/* ─── PÁGINA PRINCIPAL ─── */
export default function Sillas() {
  const { state, dispatch } = useApp();
  const { sillas, clientes, barberos, servicios } = state;

  const [modalIniciar, setModalIniciar] = useState(null);   // silla seleccionada
  const [modalFinalizar, setModalFinalizar] = useState(null);

  const handleIniciar = useCallback((payload) => {
    dispatch({ type: 'INICIAR_SERVICIO', payload });
  }, [dispatch]);

  const handleFinalizar = useCallback((payload) => {
    dispatch({ type: 'FINALIZAR_SERVICIO', payload });
  }, [dispatch]);

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-[20px] font-['Playfair_Display',Georgia,serif] font-bold text-[#0a0a0a]">
          Control de Sillas
        </h1>
        <p className="text-[12px] text-[#a0a0a0] mt-0.5">
          {sillas.filter(s => s.ocupada).length} de {sillas.length} sillas en uso
        </p>
      </div>

      {/* Grid de sillas */}
      <div className="grid grid-cols-2 gap-3">
        {sillas.map(silla => {
          const sesion  = silla.sesionActiva;
          const cliente = getClienteById(clientes, sesion?.clienteId);
          const barbero = getBarberoById(barberos, sesion?.barberoId);
          const servicio= getServicioById(servicios, sesion?.servicioId);

          return (
            <div
              key={silla.id}
              className={`rounded-2xl border p-4 flex flex-col gap-3 transition-all
                ${silla.ocupada
                  ? 'border-[#0a0a0a] bg-white'
                  : 'border-[#e8e8e8] bg-[#fafafa]'
                }`}
            >
              {/* Encabezado silla */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#a0a0a0]">
                  Silla {silla.id}
                </span>
                <span className={`w-2 h-2 rounded-full ${silla.ocupada ? 'bg-[#0a0a0a] animate-pulse-dot' : 'bg-[#e8e8e8]'}`} />
              </div>

              {silla.ocupada ? (
                <>
                  {/* Info cliente */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar initials={barbero?.avatar || '?'} size="sm" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#0a0a0a] truncate leading-tight">
                          {cliente?.nombre || '—'}
                        </p>
                        <p className="text-[10px] text-[#a0a0a0] truncate">{barbero?.nombre}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#666] bg-[#f4f4f4] px-2 py-0.5 rounded-full">
                        {servicio?.nombre}
                      </span>
                      <LiveTimer inicio={sesion.inicio} />
                    </div>
                  </div>

                  {/* Botón finalizar */}
                  <button
                    onClick={() => setModalFinalizar(silla)}
                    className="w-full h-9 bg-[#0a0a0a] text-white rounded-lg text-[12px] font-semibold
                               hover:bg-[#333] active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 btn-press"
                  >
                    <CheckCircle size={12} /> Finalizar
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1 flex flex-col items-center justify-center py-4">
                    <Scissors size={24} strokeWidth={1.2} className="text-[#e8e8e8] mb-2" />
                    <span className="text-[11px] text-[#a0a0a0]">Disponible</span>
                  </div>
                  <button
                    onClick={() => setModalIniciar(silla)}
                    className="w-full h-9 border border-[#0a0a0a] text-[#0a0a0a] rounded-lg text-[12px] font-semibold
                               hover:bg-[#0a0a0a] hover:text-white active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 btn-press"
                  >
                    <Plus size={13} /> Nuevo
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal iniciar */}
      {modalIniciar && (
        <ModalIniciar
          open={!!modalIniciar}
          silla={modalIniciar}
          onClose={() => setModalIniciar(null)}
          onConfirm={handleIniciar}
          clientes={clientes}
          barberos={barberos}
          servicios={servicios}
        />
      )}

      {/* Modal finalizar */}
      {modalFinalizar && (
        <ModalFinalizar
          open={!!modalFinalizar}
          silla={modalFinalizar}
          onClose={() => setModalFinalizar(null)}
          onConfirm={handleFinalizar}
          clientes={clientes}
          barberos={barberos}
          servicios={servicios}
        />
      )}
    </div>
  );
}
