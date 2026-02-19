import { useMemo } from 'react';
import { TrendingUp, Scissors, Users, Award } from 'lucide-react';
import { useApp, getClienteById, getBarberoById, getServicioById, formatFecha, formatHora } from '../context/AppContext';
import { StatCard } from '../components/ui';

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <p className="text-[10px] uppercase tracking-widest text-[#a0a0a0] font-semibold">{title}</p>
      {children}
    </section>
  );
}

export default function Reportes() {
  const { state } = useApp();
  const { registros, barberos, clientes, servicios } = state;

  const hoy = new Date().toISOString().split('T')[0];
  const mesActual = hoy.slice(0, 7);

  const registrosHoy = useMemo(() => registros.filter(r => r.fin?.startsWith(hoy)), [registros, hoy]);
  const registrosMes  = useMemo(() => registros.filter(r => r.fin?.startsWith(mesActual)), [registros, mesActual]);

  const ingresoHoy = useMemo(() => registrosHoy.reduce((a, r) => a + (r.cobrado || 0), 0), [registrosHoy]);
  const ingresoMes  = useMemo(() => registrosMes.reduce((a, r) => a + (r.cobrado || 0), 0), [registrosMes]);

  /* Ranking barberos del mes */
  const rankingBarberos = useMemo(() => {
    const map = {};
    registrosMes.forEach(r => {
      if (!map[r.barberoId]) map[r.barberoId] = { servicios: 0, ingresos: 0 };
      map[r.barberoId].servicios++;
      map[r.barberoId].ingresos += r.cobrado || 0;
    });
    return Object.entries(map)
      .map(([id, data]) => ({ barbero: getBarberoById(barberos, +id), ...data }))
      .filter(e => e.barbero)
      .sort((a, b) => b.ingresos - a.ingresos);
  }, [registrosMes, barberos]);

  /* Servicios más solicitados del mes */
  const rankingServicios = useMemo(() => {
    const map = {};
    registrosMes.forEach(r => {
      map[r.servicioId] = (map[r.servicioId] || 0) + 1;
    });
    return Object.entries(map)
      .map(([id, count]) => ({ servicio: getServicioById(servicios, +id), count }))
      .filter(e => e.servicio)
      .sort((a, b) => b.count - a.count);
  }, [registrosMes, servicios]);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-[20px] font-['Playfair_Display',Georgia,serif] font-bold text-[#0a0a0a]">
          Reportes
        </h1>
        <p className="text-[12px] text-[#a0a0a0] mt-0.5">
          {new Date().toLocaleDateString('es-BO', { month:'long', year:'numeric' })}
        </p>
      </div>

      {/* Resumen de hoy */}
      <Section title="Resumen de hoy">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Ingresos hoy" value={`Bs ${ingresoHoy}`} icon={TrendingUp} variant="dark" />
          <StatCard label="Servicios hoy" value={registrosHoy.length} icon={Scissors} />
        </div>
      </Section>

      {/* Resumen del mes */}
      <Section title="Resumen del mes">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Ingresos mes" value={`Bs ${ingresoMes}`} icon={TrendingUp} variant="dark" />
          <StatCard label="Servicios mes" value={registrosMes.length} icon={Scissors} />
          <StatCard label="Clientes únicos" value={new Set(registrosMes.map(r => r.clienteId)).size} icon={Users} />
          <StatCard label="Promedio por serv." value={registrosMes.length ? `Bs ${Math.round(ingresoMes / registrosMes.length)}` : 'Bs 0'} icon={Award} />
        </div>
      </Section>

      {/* Ranking barberos */}
      {rankingBarberos.length > 0 && (
        <Section title="Barberos este mes">
          <div className="space-y-2">
            {rankingBarberos.map((item, i) => (
              <div key={item.barbero.id} className="flex items-center gap-3 p-4 border border-[#e8e8e8] rounded-2xl">
                <span className="w-6 text-center text-[12px] font-bold text-[#a0a0a0]">#{i + 1}</span>
                <div className="w-9 h-9 rounded-full bg-[#0a0a0a] text-white text-[12px] font-semibold flex items-center justify-center flex-shrink-0">
                  {item.barbero.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#0a0a0a] truncate">{item.barbero.nombre}</p>
                  <p className="text-[11px] text-[#a0a0a0]">{item.servicios} servicio{item.servicios !== 1 ? 's' : ''}</p>
                </div>
                <span className="text-[14px] font-bold text-[#0a0a0a]">Bs {item.ingresos}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Servicios más solicitados */}
      {rankingServicios.length > 0 && (
        <Section title="Servicios más solicitados">
          <div className="space-y-2">
            {rankingServicios.map((item, i) => {
              const pct = Math.round((item.count / registrosMes.length) * 100);
              return (
                <div key={item.servicio.id} className="flex items-center gap-3 p-4 border border-[#e8e8e8] rounded-2xl">
                  <span className="w-6 text-center text-[12px] font-bold text-[#a0a0a0]">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[13px] font-semibold text-[#0a0a0a]">{item.servicio.nombre}</p>
                      <span className="text-[12px] font-bold text-[#0a0a0a]">{item.count}x</span>
                    </div>
                    <div className="h-1 bg-[#f4f4f4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0a0a0a] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Últimos servicios */}
      {registros.length > 0 && (
        <Section title="Historial reciente">
          <div className="border border-[#e8e8e8] rounded-2xl overflow-hidden">
            {[...registros].reverse().slice(0, 10).map((r, i, arr) => {
              const cliente  = getClienteById(clientes, r.clienteId);
              const servicio = getServicioById(servicios, r.servicioId);
              const barbero  = getBarberoById(barberos, r.barberoId);
              return (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-[#f4f4f4]' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#0a0a0a] truncate">{cliente?.nombre || '—'}</p>
                    <p className="text-[11px] text-[#a0a0a0]">
                      {servicio?.nombre} · {barbero?.nombre} · {formatFecha(r.fin)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-[#0a0a0a]">Bs {r.cobrado}</p>
                    <p className="text-[10px] text-[#a0a0a0]">{formatHora(r.fin)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {registros.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <TrendingUp size={32} strokeWidth={1.2} className="text-[#e8e8e8] mb-3" />
          <p className="text-[14px] font-medium text-[#333]">Sin datos aún</p>
          <p className="text-[12px] text-[#a0a0a0] mt-1">Los reportes se generan a medida que registres servicios</p>
        </div>
      )}
    </div>
  );
}
