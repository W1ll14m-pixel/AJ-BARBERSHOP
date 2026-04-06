import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, ClipboardList, Plus } from 'lucide-react';
import { useApp, formatFecha } from '../context/AppContext';
import { BtnPrimary, Card } from '../components/ui';

export default function Tareas() {
  const { state, dispatch } = useApp();
  const { tareas } = state;

  const [titulo, setTitulo] = useState('');
  const [error, setError] = useState('');

  const tareasPendientes = useMemo(
    () => tareas.filter(t => !t.completada),
    [tareas]
  );

  const tareasCompletadas = useMemo(
    () => tareas.filter(t => t.completada),
    [tareas]
  );

  function handleAgregarTarea(event) {
    event.preventDefault();
    const tituloLimpio = titulo.trim();

    if (!tituloLimpio) {
      setError('El título de la tarea no puede estar vacío.');
      return;
    }

    dispatch({ type: 'ADD_TAREA', payload: { titulo: tituloLimpio } });
    setTitulo('');
    setError('');
  }

  function handleToggleTarea(tareaId) {
    dispatch({ type: 'TOGGLE_TAREA', id: tareaId });
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-[20px] font-['Playfair_Display',Georgia,serif] font-bold text-[#0a0a0a]">
          Tareas
        </h1>
        <p className="text-[12px] text-[#a0a0a0] mt-0.5">
          {tareasPendientes.length} pendiente{tareasPendientes.length !== 1 ? 's' : ''} · {tareasCompletadas.length} completada{tareasCompletadas.length !== 1 ? 's' : ''}
        </p>
      </div>

      <Card>
        <form onSubmit={handleAgregarTarea} className="space-y-3">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-[#a0a0a0]">
            Nueva tarea
          </label>
          <input
            value={titulo}
            onChange={(event) => {
              setTitulo(event.target.value);
              if (error) setError('');
            }}
            placeholder="Ej: Confirmar citas del turno tarde"
            className={`w-full border rounded-xl py-3 px-3 text-[14px] outline-none transition-colors ${
              error ? 'border-[#9b2226] bg-[#fff5f5]' : 'border-[#e8e8e8] focus:border-[#0a0a0a]'
            }`}
          />
          {error && (
            <p className="text-[12px] text-[#9b2226]">{error}</p>
          )}
          <BtnPrimary type="submit" className="w-full h-11">
            <Plus size={14} /> Agregar tarea
          </BtnPrimary>
        </form>
      </Card>

      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-[#a0a0a0] font-semibold">
          Pendientes
        </p>
        {tareasPendientes.length === 0 ? (
          <Card className="text-center py-7">
            <ClipboardList size={20} className="mx-auto text-[#d6d6d6] mb-2" />
            <p className="text-[13px] text-[#666]">No hay tareas pendientes</p>
          </Card>
        ) : (
          tareasPendientes.map(tarea => (
            <Card key={tarea.id} className="p-0">
              <button
                type="button"
                onClick={() => handleToggleTarea(tarea.id)}
                className="w-full flex items-center gap-3 text-left px-4 py-3"
              >
                <Circle size={18} className="text-[#a0a0a0] flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[14px] text-[#0a0a0a] font-medium">{tarea.titulo}</p>
                  <p className="text-[11px] text-[#a0a0a0]">Creada: {formatFecha(tarea.creadaEn)}</p>
                </div>
              </button>
            </Card>
          ))
        )}
      </div>

      {tareasCompletadas.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-[#a0a0a0] font-semibold">
            Completadas
          </p>
          {tareasCompletadas.map(tarea => (
            <Card key={tarea.id} className="p-0 bg-[#f8faf8] border-[#d9e6dc]">
              <button
                type="button"
                onClick={() => handleToggleTarea(tarea.id)}
                className="w-full flex items-center gap-3 text-left px-4 py-3"
              >
                <CheckCircle2 size={18} className="text-[#1b4332] flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[14px] text-[#1b4332] line-through">{tarea.titulo}</p>
                  <p className="text-[11px] text-[#6b8a74]">Completada: {formatFecha(tarea.completadaEn)}</p>
                </div>
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
