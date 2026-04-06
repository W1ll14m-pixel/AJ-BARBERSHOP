import { NavLink } from 'react-router-dom';
import { LayoutGrid, Users, Scissors, CalendarDays, BarChart2, ClipboardList } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',          icon: LayoutGrid,   label: 'Inicio'    },
  { to: '/sillas',    icon: Scissors,     label: 'Sillas'    },
  { to: '/clientes',  icon: Users,        label: 'Clientes'  },
  { to: '/barberos',  icon: Scissors,     label: 'Barberos'  },
  { to: '/citas',     icon: CalendarDays, label: 'Citas'     },
  { to: '/tareas',    icon: ClipboardList, label: 'Tareas'   },
  { to: '/reportes',  icon: BarChart2,    label: 'Reportes'  },
];

// eslint-disable-next-line no-unused-vars
const ICONS = { LayoutGrid, Users, Scissors, CalendarDays, ClipboardList, BarChart2 };

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e8e8] z-40 safe-area-pb"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-2 py-1 min-w-[52px] transition-all duration-150 ${
                isActive ? 'text-[#0a0a0a]' : 'text-[#a0a0a0]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
                </span>
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-[#0a0a0a]' : 'text-[#a0a0a0]'}`}>
                  {label}
                </span>
                {isActive && <span className="w-1 h-1 rounded-full bg-[#0a0a0a] mt-0.5" />}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
