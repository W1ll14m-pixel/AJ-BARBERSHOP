import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Scissors, ChevronRight } from 'lucide-react';
import { useApp, getServicioById } from '../context/AppContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Field, SelectField, BtnPrimary, BtnOutline, BtnDanger, Avatar, Badge } from '../components/ui';

const EMPTY_BARBERO = { nombre: '', especialidad: '', avatar: '', activo: true };

const ESPECIALIDADES = [
  'Corte Clásico', 'Corte + Barba', 'Degradados', 'Diseño', 'Arreglo de Barba',
];

function BarberoForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial
      ? { ...initial }
      : { ...EMPTY_BARBERO }
  );
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  function assignAvatar(nombre) {
    const parts = nombre.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : nombre.slice(0, 2).toUpperCase();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    const avatar = form.avatar || assignAvatar(form.nombre);
    onSave({ ...form, avatar });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field
        label="Nombre completo"
        value={form.nombre}
        onChange={e => { set('nombre')(e); setForm(p => ({ ...p, avatar: assignAvatar(e.target.value) })); }}
        placeholder="Alejandro Juárez"
        required
      />
      <SelectField label="Especialidad" value={form.especialidad} onChange={set('especialidad')}>
        <option value="">— Seleccionar —</option>
        {ESPECIALIDADES.map(e => <option key={e}>{e}</option>)}
      </SelectField>
      <SelectField label="Estado" value={form.activo ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, activo: e.target.value === 'true' }))}>
        <option value="true">Activo</option>
        <option value="false">Inactivo</option>
      </SelectField>
      <div className="flex gap-3 pt-1">
        <BtnOutline type="button" className="flex-1" onClick={onCancel}>Cancelar</BtnOutline>
        <BtnPrimary type="submit" className="flex-1">Guardar</BtnPrimary>
      </div>
    </form>
  );
}

export default function Barberos() {
  const { state, dispatch } = useApp();
  const { barberos, registros } = state;

  const [modalAgregar, setModalAgregar] = useState(false);
  const [barberoEditar, setBarberoEditar] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const activos   = barberos.filter(b => b.activo);
  const inactivos = barberos.filter(b => !b.activo);

  const serviciosCount = (id) => registros.filter(r => r.barberoId === id).length;
  const ingresos = (id) => registros.filter(r => r.barberoId === id).reduce((acc, r) => acc + (r.cobrado || 0), 0);

  function handleAgregar(form) {
    dispatch({ type: 'ADD_BARBERO', payload: form });
    setModalAgregar(false);
  }
  function handleEditar(form) {
    dispatch({ type: 'UPDATE_BARBERO', payload: { ...barberoEditar, ...form } });
    setBarberoEditar(null);
  }
  function handleEliminar() {
    dispatch({ type: 'DELETE_BARBERO', id: confirmDelete });
    setConfirmDelete(null);
  }

  function BarberoCard({ barbero }) {
    return (
      <div className="border border-[#e8e8e8] rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar initials={barbero.avatar} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-semibold text-[#0a0a0a] truncate">{barbero.nombre}</p>
              <Badge label={barbero.activo ? 'Activo' : 'Inactivo'} variant={barbero.activo ? 'success' : 'default'} />
            </div>
            <p className="text-[11px] text-[#a0a0a0] mt-0.5">{barbero.especialidad || 'Sin especialidad'}</p>
          </div>
        </div>

        {/* Stats del barbero */}
        <div className="flex gap-2">
          <div className="flex-1 bg-[#f4f4f4] rounded-xl p-2.5 text-center">
            <p className="text-[15px] font-bold text-[#0a0a0a]">{serviciosCount(barbero.id)}</p>
            <p className="text-[9px] uppercase tracking-wider text-[#a0a0a0] font-medium">Servicios</p>
          </div>
          <div className="flex-1 bg-[#f4f4f4] rounded-xl p-2.5 text-center">
            <p className="text-[15px] font-bold text-[#0a0a0a]">Bs {ingresos(barbero.id)}</p>
            <p className="text-[9px] uppercase tracking-wider text-[#a0a0a0] font-medium">Generado</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <BtnDanger className="flex-1 h-9" onClick={() => setConfirmDelete(barbero.id)}>
            <Trash2 size={12} /> Eliminar
          </BtnDanger>
          <button
            onClick={() => setBarberoEditar(barbero)}
            className="flex-1 h-9 border border-[#e8e8e8] rounded-lg text-[12px] font-medium text-[#333]
                       hover:border-[#0a0a0a] hover:bg-[#f4f4f4] transition-colors btn-press flex items-center justify-center gap-1.5"
          >
            <Edit2 size={12} /> Editar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-['Playfair_Display',Georgia,serif] font-bold text-[#0a0a0a]">
            Barberos
          </h1>
          <p className="text-[12px] text-[#a0a0a0] mt-0.5">
            {activos.length} activos · {inactivos.length} inactivos
          </p>
        </div>
        <button
          onClick={() => setModalAgregar(true)}
          className="w-10 h-10 bg-[#0a0a0a] text-white rounded-full flex items-center justify-center
                     hover:bg-[#333] transition-colors btn-press shadow-sm"
        >
          <Plus size={18} strokeWidth={2} />
        </button>
      </div>

      {barberos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Scissors size={32} strokeWidth={1.2} className="text-[#e8e8e8] mb-3" />
          <p className="text-[14px] font-medium text-[#333]">Sin barberos registrados</p>
          <p className="text-[12px] text-[#a0a0a0] mt-1">Agrega el personal de tu barbería</p>
        </div>
      ) : (
        <>
          {activos.length > 0 && (
            <section className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-[#a0a0a0] font-semibold">Activos</p>
              {activos.map(b => <BarberoCard key={b.id} barbero={b} />)}
            </section>
          )}
          {inactivos.length > 0 && (
            <section className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-[#a0a0a0] font-semibold">Inactivos</p>
              {inactivos.map(b => <BarberoCard key={b.id} barbero={b} />)}
            </section>
          )}
        </>
      )}

      <Modal title="Nuevo Barbero" open={modalAgregar} onClose={() => setModalAgregar(false)}>
        <BarberoForm onSave={handleAgregar} onCancel={() => setModalAgregar(false)} />
      </Modal>

      {barberoEditar && (
        <Modal title="Editar Barbero" open={!!barberoEditar} onClose={() => setBarberoEditar(null)}>
          <BarberoForm initial={barberoEditar} onSave={handleEditar} onCancel={() => setBarberoEditar(null)} />
        </Modal>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="¿Eliminar barbero?"
        message="El historial de servicios se mantendrá, pero el barbero no aparecerá en nuevos registros."
        danger
        onConfirm={handleEliminar}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
