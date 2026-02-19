import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Users, CalendarDays, TrendingUp, ChevronRight, Clock } from 'lucide-react';
import { useApp, getClienteById, getBarberoById, getServicioById, formatFecha, formatHora } from '../context/AppContext';
import { StatCard, Card, Avatar } from '../components/ui';

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { sillas, registros, citas, clientes, barberos, servicios } = state;

  const hoy = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }, []);

  const registrosHoy = useMemo(
    () => registros.filter(r => r.fin?.startsWith(hoy)),
    [registros, hoy]
  );

  const ingresoHoy = useMemo(
    () => registrosHoy.reduce((acc, r) => acc + (r.cobrado || 0), 0),
    [registrosHoy]
  );

  const silasOcupadas = sillas.filter(s => s.ocupada);
  const citasHoy = citas.filter(c => c.fecha === hoy && c.estado === 'pendiente');

  return (
    <div className="animate-fade-in space-y-6">
      {/* Saludo */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-[#a0a0a0] font-medium">
          {new Date().toLocaleDateString('es-BO', { weekday:'long', day:'2-digit', month:'long' })}
        </p>
        <h1 className="text-[22px] font-['Playfair_Display',Georgia,serif] font-bold text-[#0a0a0a] mt-0.5">
          Buen día, AJ
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Ingresos hoy"
          value={`Bs ${ingresoHoy}`}
          sub={`${registrosHoy.length} servicio${registrosHoy.length !== 1 ? 's' : ''}`}
          icon={TrendingUp}
          variant="dark"
        />
        <StatCard
          label="En silla ahora"
          value={silasOcupadas.length}
          sub={`de ${sillas.length} sillas`}
          icon={Scissors}
        />
        <StatCard
          label="Citas hoy"
          value={citasHoy.length}
          sub="programadas"
          icon={CalendarDays}
          variant={citasHoy.length > 0 ? 'warning' : 'default'}
        />
        <StatCard
          label="Clientes"
          value={clientes.length}
          sub="registrados"
          icon={Users}
        />
      </div>

      {/* Sillas activas */}
      {silasOcupadas.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[12px] uppercase tracking-widest font-semibold text-[#a0a0a0]">
              En servicio ahora
            </h2>
            <button
              onClick={() => navigate('/sillas')}
              className="text-[11px] text-[#666] flex items-center gap-0.5 hover:text-[#0a0a0a] transition-colors"
            >
              Ver todo <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {silasOcupadas.map(silla => {
              const { sesionActiva: s } = silla;
              const cliente  = getClienteById(clientes, s?.clienteId);
              const barbero  = getBarberoById(barberos, s?.barberoId);
              const servicio = getServicioById(servicios, s?.servicioId);
              const diffMins = Math.floor((Date.now() - new Date(s?.inicio).getTime()) / 60000);
              const alerta   = diffMins > 45;
              return (
                <Card key={silla.id} onClick={() => navigate('/sillas')}
                      className={alerta ? 'border-[#7c4a10]/30 bg-[#fef9f0]' : ''}>
                  <div className="flex items-center gap-3">
                    <Avatar initials={barbero?.avatar || '?'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#0a0a0a] truncate">
                        {cliente?.nombre || 'Cliente'}
                      </p>
                      <p className="text-[12px] text-[#666]">
                        {barbero?.nombre} · {servicio?.nombre}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[11px] font-mono font-medium ${alerta ? 'text-[#7c4a10]' : 'text-[#666]'}`}>
                        <Clock size={10} className="inline mr-0.5" />
                        {diffMins} min
                      </span>
                      <span className="text-[10px] text-[#a0a0a0]">Silla {silla.id}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Citas del día */}
      {citasHoy.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[12px] uppercase tracking-widest font-semibold text-[#a0a0a0]">
              Citas de hoy
            </h2>
            <button
              onClick={() => navigate('/citas')}
              className="text-[11px] text-[#666] flex items-center gap-0.5 hover:text-[#0a0a0a] transition-colors"
            >
              Ver todo <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {citasHoy.slice(0,3).map(cita => {
              const cliente = getClienteById(clientes, cita.clienteId);
              const barbero = getBarberoById(barberos, cita.barberoId);
              return (
                <Card key={cita.id}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f4f4f4] flex items-center justify-center">
                      <CalendarDays size={14} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#0a0a0a] truncate">{cliente?.nombre}</p>
                      <p className="text-[11px] text-[#a0a0a0]">{barbero?.nombre}</p>
                    </div>
                    <span className="text-[11px] text-[#666] bg-[#f4f4f4] px-2 py-0.5 rounded-full">
                      Hoy
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Últimos servicios */}
      {registrosHoy.length > 0 && (
        <section>
          <h2 className="text-[12px] uppercase tracking-widest font-semibold text-[#a0a0a0] mb-3">
            Últimos servicios del día
          </h2>
          <div className="space-y-2">
            {[...registrosHoy].reverse().slice(0, 4).map(r => {
              const cliente  = getClienteById(clientes, r.clienteId);
              const servicio = getServicioById(servicios, r.servicioId);
              return (
                <div key={r.id} className="flex items-center justify-between py-3 border-b border-[#f4f4f4] last:border-0">
                  <div>
                    <p className="text-[13px] font-medium text-[#0a0a0a]">{cliente?.nombre}</p>
                    <p className="text-[11px] text-[#a0a0a0]">{servicio?.nombre} · {formatHora(r.fin)}</p>
                  </div>
                  <span className="text-[14px] font-semibold text-[#0a0a0a]">Bs {r.cobrado}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {registros.length === 0 && silasOcupadas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Scissors size={32} strokeWidth={1.2} className="text-[#e8e8e8] mb-4" />
          <p className="text-[14px] font-medium text-[#333]">Sin actividad aún</p>
          <p className="text-[12px] text-[#a0a0a0] mt-1">Registra el primer servicio del día</p>
          <button
            onClick={() => navigate('/sillas')}
            className="mt-5 px-5 h-11 bg-[#0a0a0a] text-white rounded-xl text-[13px] font-semibold hover:bg-[#333] transition-colors btn-press"
          >
            Ir a Sillas
          </button>
        </div>
      )}
    </div>
  );
}
