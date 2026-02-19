import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, User, ChevronRight, X } from 'lucide-react';
import { useApp, getServicioById, getBarberoById, formatFecha } from '../context/AppContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Field, TextareaField, BtnPrimary, BtnOutline, BtnDanger, Avatar, Badge, Card } from '../components/ui';

const EMPTY_FORM = { nombre: '', telefono: '', notas: '' };

function ClienteForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Nombre completo" value={form.nombre} onChange={set('nombre')} placeholder="Carlos Mamani" required />
      <Field label="Teléfono" type="tel" value={form.telefono} onChange={set('telefono')} placeholder="70000000" />
      <TextareaField label="Notas" value={form.notas} onChange={set('notas')} placeholder="Prefiere corte tipo A, alergias..." />
      <div className="flex gap-3 pt-1">
        <BtnOutline type="button" className="flex-1" onClick={onCancel}>Cancelar</BtnOutline>
        <BtnPrimary type="submit" className="flex-1">Guardar</BtnPrimary>
      </div>
    </form>
  );
}

function ClienteDetail({ cliente, registros, servicios, barberos, onClose, onEdit, onDelete }) {
  const historial = useMemo(
    () => registros.filter(r => r.clienteId === cliente.id).sort((a, b) => new Date(b.fin) - new Date(a.fin)),
    [registros, cliente.id]
  );
  const totalGastado = historial.reduce((acc, r) => acc + (r.cobrado || 0), 0);

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2 pb-4 border-b border-[#f4f4f4]">
        <div className="w-16 h-16 rounded-full bg-[#0a0a0a] text-white text-[20px] font-semibold flex items-center justify-center">
          {cliente.nombre.slice(0,2).toUpperCase()}
        </div>
        <p className="text-[16px] font-semibold text-[#0a0a0a]">{cliente.nombre}</p>
        {cliente.telefono && <p className="text-[13px] text-[#a0a0a0]">{cliente.telefono}</p>}
        <div className="flex gap-2 mt-1">
          <span className="text-[11px] bg-[#f4f4f4] px-3 py-1 rounded-full text-[#666]">
            {historial.length} visitas
          </span>
          <span className="text-[11px] bg-[#f4f4f4] px-3 py-1 rounded-full text-[#666]">
            Bs {totalGastado} total
          </span>
        </div>
      </div>

      {/* Notas */}
      {cliente.notas && (
        <div className="bg-[#fafafa] rounded-xl p-3 border border-[#e8e8e8]">
          <p className="text-[10px] uppercase tracking-widest text-[#a0a0a0] font-semibold mb-1">Notas</p>
          <p className="text-[13px] text-[#333] leading-relaxed">{cliente.notas}</p>
        </div>
      )}

      {/* Historial */}
      {historial.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#a0a0a0] font-semibold mb-3">Historial</p>
          <div className="space-y-2">
            {historial.slice(0, 6).map(r => {
              const serv = getServicioById(servicios, r.servicioId);
              const barb = getBarberoById(barberos, r.barberoId);
              return (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-[#f4f4f4] last:border-0">
                  <div>
                    <p className="text-[13px] font-medium text-[#0a0a0a]">{serv?.nombre || 'Servicio'}</p>
                    <p className="text-[11px] text-[#a0a0a0]">{barb?.nombre} · {formatFecha(r.fin)}</p>
                  </div>
                  <span className="text-[13px] font-semibold text-[#0a0a0a]">Bs {r.cobrado}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3 pt-1">
        <BtnDanger className="flex-1" onClick={onDelete}>
          <Trash2 size={13} /> Eliminar
        </BtnDanger>
        <BtnPrimary className="flex-1" onClick={onEdit}>
          <Edit2 size={13} /> Editar
        </BtnPrimary>
      </div>
    </div>
  );
}

export default function Clientes() {
  const { state, dispatch } = useApp();
  const { clientes, registros, servicios, barberos } = state;

  const [search, setSearch] = useState('');
  const [modalAgregar, setModalAgregar] = useState(false);
  const [clienteDetalle, setClienteDetalle] = useState(null);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtrados = useMemo(
    () => clientes.filter(c =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.telefono?.includes(search)
    ).sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [clientes, search]
  );

  function handleAgregar(form) {
    dispatch({ type: 'ADD_CLIENTE', payload: form });
    setModalAgregar(false);
  }

  function handleEditar(form) {
    dispatch({ type: 'UPDATE_CLIENTE', payload: { ...clienteEditar, ...form } });
    setClienteEditar(null);
    setClienteDetalle(null);
  }

  function handleEliminar() {
    dispatch({ type: 'DELETE_CLIENTE', id: confirmDelete });
    setConfirmDelete(null);
    setClienteDetalle(null);
  }

  const visitas = (id) => registros.filter(r => r.clienteId === id).length;

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-['Playfair_Display',Georgia,serif] font-bold text-[#0a0a0a]">
            Clientes
          </h1>
          <p className="text-[12px] text-[#a0a0a0] mt-0.5">{clientes.length} registrados</p>
        </div>
        <button
          onClick={() => setModalAgregar(true)}
          className="w-10 h-10 bg-[#0a0a0a] text-white rounded-full flex items-center justify-center
                     hover:bg-[#333] transition-colors btn-press shadow-sm"
        >
          <Plus size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search size={14} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0a0] pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o teléfono…"
          className="w-full h-11 pl-9 pr-9 bg-[#f4f4f4] rounded-xl text-[13px] text-[#0a0a0a]
                     placeholder:text-[#a0a0a0] border border-[#e8e8e8] focus:border-[#0a0a0a] outline-none transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={13} className="text-[#a0a0a0]" />
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {filtrados.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <User size={32} strokeWidth={1.2} className="text-[#e8e8e8] mb-3" />
            <p className="text-[14px] font-medium text-[#333]">
              {search ? 'Sin resultados' : 'Sin clientes aún'}
            </p>
            <p className="text-[12px] text-[#a0a0a0] mt-1">
              {search ? 'Intenta con otro nombre' : 'Agrega tu primer cliente'}
            </p>
          </div>
        )}

        {filtrados.map(cliente => (
          <div
            key={cliente.id}
            onClick={() => setClienteDetalle(cliente)}
            className="flex items-center gap-3 p-4 border border-[#e8e8e8] rounded-2xl cursor-pointer
                       hover:border-[#0a0a0a] active:scale-[0.99] transition-all duration-150"
          >
            <Avatar initials={cliente.nombre.slice(0,2).toUpperCase()} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#0a0a0a] truncate">{cliente.nombre}</p>
              <p className="text-[11px] text-[#a0a0a0]">
                {cliente.telefono || '—'} · {visitas(cliente.id)} visita{visitas(cliente.id) !== 1 ? 's' : ''}
              </p>
            </div>
            <ChevronRight size={14} strokeWidth={1.8} className="text-[#a0a0a0] flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* Modal Agregar */}
      <Modal title="Nuevo Cliente" open={modalAgregar} onClose={() => setModalAgregar(false)}>
        <ClienteForm onSave={handleAgregar} onCancel={() => setModalAgregar(false)} />
      </Modal>

      {/* Modal Detalle */}
      {clienteDetalle && (
        <Modal title="Detalle del Cliente" open={!!clienteDetalle} onClose={() => setClienteDetalle(null)}>
          <ClienteDetail
            cliente={clienteDetalle}
            registros={registros}
            servicios={servicios}
            barberos={barberos}
            onClose={() => setClienteDetalle(null)}
            onEdit={() => { setClienteEditar(clienteDetalle); setClienteDetalle(null); }}
            onDelete={() => setConfirmDelete(clienteDetalle.id)}
          />
        </Modal>
      )}

      {/* Modal Editar */}
      {clienteEditar && (
        <Modal title="Editar Cliente" open={!!clienteEditar} onClose={() => setClienteEditar(null)}>
          <ClienteForm
            initial={clienteEditar}
            onSave={handleEditar}
            onCancel={() => setClienteEditar(null)}
          />
        </Modal>
      )}

      {/* Confirm eliminar */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="¿Eliminar cliente?"
        message="Esta acción no se puede deshacer. Se borrará el registro del cliente."
        danger
        onConfirm={handleEliminar}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
