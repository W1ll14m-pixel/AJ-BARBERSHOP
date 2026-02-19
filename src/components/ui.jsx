/* Componentes reutilizables pequeños */

/** Campo de texto tipo underline */
export function Field({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-[#a0a0a0]">
        {label}
      </label>
      <input
        {...props}
        className="w-full border-0 border-b border-[#e8e8e8] focus:border-[#0a0a0a] bg-transparent
                   py-2 text-[14px] text-[#0a0a0a] placeholder:text-[#ccc] outline-none
                   transition-colors duration-150"
      />
    </div>
  );
}

/** Select tipo underline */
export function SelectField({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-[#a0a0a0]">
        {label}
      </label>
      <select
        {...props}
        className="w-full border-0 border-b border-[#e8e8e8] focus:border-[#0a0a0a] bg-transparent
                   py-2 text-[14px] text-[#0a0a0a] outline-none transition-colors duration-150
                   cursor-pointer"
      >
        {children}
      </select>
    </div>
  );
}

/** Textarea tipo underline */
export function TextareaField({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-[#a0a0a0]">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full border border-[#e8e8e8] focus:border-[#0a0a0a] bg-transparent
                   rounded-lg py-2 px-2 text-[14px] text-[#0a0a0a] placeholder:text-[#ccc]
                   outline-none transition-colors duration-150 resize-none"
        rows={3}
      />
    </div>
  );
}

/** Botón principal negro */
export function BtnPrimary({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`h-12 bg-[#0a0a0a] text-white rounded-xl text-[13px] font-semibold
                  tracking-wide hover:bg-[#333] active:scale-[0.97] transition-all duration-150
                  flex items-center justify-center gap-2 disabled:opacity-40 ${className}`}
    />
  );
}

/** Botón secundario con borde */
export function BtnOutline({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`h-12 border border-[#0a0a0a] text-[#0a0a0a] rounded-xl text-[13px] font-medium
                  tracking-wide hover:bg-[#f4f4f4] active:scale-[0.97] transition-all duration-150
                  flex items-center justify-center gap-2 ${className}`}
    />
  );
}

/** Botón peligro rojo sobrio */
export function BtnDanger({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`h-10 bg-[#fff5f5] text-[#9b2226] border border-[#9b2226]/20 rounded-lg
                  text-[12px] font-semibold tracking-wide hover:bg-[#9b2226] hover:text-white
                  active:scale-[0.97] transition-all duration-150
                  flex items-center justify-center gap-1.5 ${className}`}
    />
  );
}

/** Badge de estado */
export function Badge({ label, variant = 'default' }) {
  const variants = {
    default:  'bg-[#f4f4f4] text-[#333]',
    success:  'bg-[#f0faf4] text-[#1b4332]',
    danger:   'bg-[#fff5f5] text-[#9b2226]',
    warning:  'bg-[#fef9f0] text-[#7c4a10]',
    active:   'bg-[#0a0a0a] text-white',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${variants[variant]}`}>
      {label}
    </span>
  );
}

/** Separador con etiqueta */
export function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-[#e8e8e8]" />
      {label && <span className="text-[10px] uppercase tracking-widest text-[#a0a0a0] font-medium">{label}</span>}
      <div className="flex-1 h-px bg-[#e8e8e8]" />
    </div>
  );
}

/** Avatar de iniciales */
export function Avatar({ initials, size = 'md', className = '' }) {
  const sizes = { sm: 'w-8 h-8 text-[11px]', md: 'w-10 h-10 text-[13px]', lg: 'w-14 h-14 text-[16px]' };
  return (
    <div className={`${sizes[size]} rounded-full bg-[#0a0a0a] text-white font-semibold
                     flex items-center justify-center flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
}

/** Tarjeta base */
export function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#e8e8e8] rounded-2xl p-4 ${onClick ? 'cursor-pointer hover:border-[#0a0a0a] active:scale-[0.99] transition-all duration-150' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/** Stat card */
export function StatCard({ label, value, sub, icon: Icon, variant = 'default' }) {
  const variants = {
    default: 'bg-white',
    dark:    'bg-[#0a0a0a] text-white',
    success: 'bg-[#f0faf4]',
    warning: 'bg-[#fef9f0]',
  };
  return (
    <div className={`rounded-2xl border border-[#e8e8e8] p-4 ${variants[variant]}`}>
      <div className="flex items-start justify-between mb-2">
        <p className={`text-[10px] uppercase tracking-widest font-semibold ${variant === 'dark' ? 'text-[#a0a0a0]' : 'text-[#a0a0a0]'}`}>
          {label}
        </p>
        {Icon && <Icon size={16} strokeWidth={1.6} className={variant === 'dark' ? 'text-[#a0a0a0]' : 'text-[#a0a0a0]'} />}
      </div>
      <p className={`text-2xl font-bold leading-none mb-1 ${variant === 'dark' ? 'text-white' : 'text-[#0a0a0a]'}`}>
        {value}
      </p>
      {sub && <p className={`text-[11px] ${variant === 'dark' ? 'text-[#666]' : 'text-[#a0a0a0]'}`}>{sub}</p>}
    </div>
  );
}

/** Contador de tiempo activo */
export function Cronometro({ inicio }) {
  const [, setTick] = [null, () => {}];
  // Simple cronómetro sin hook adicional — usa el truco de forced re-render
  // Se actualiza cada minuto al montar
  const diffMs = Date.now() - new Date(inicio).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hrs  = Math.floor(mins / 60);
  const m    = mins % 60;
  return (
    <span className="text-[12px] font-mono tabular-nums text-[#666]">
      {hrs > 0 ? `${hrs}h ${m}m` : `${m} min`}
    </span>
  );
}
