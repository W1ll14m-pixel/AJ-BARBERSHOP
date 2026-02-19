import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

/**
 * Muestra un banner discreto cuando el navegador dispara el evento
 * 'beforeinstallprompt'. El usuario puede instalar la app o descartar.
 */
export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('pwa_dismissed') === '1'
  );

  useEffect(() => {
    function handler(e) {
      e.preventDefault();
      setInstallEvent(e);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!installEvent || dismissed) return null;

  async function handleInstall() {
    installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === 'accepted') {
      setInstallEvent(null);
    }
  }

  function handleDismiss() {
    setDismissed(true);
    localStorage.setItem('pwa_dismissed', '1');
  }

  return (
    <div className="animate-slide-up border-b border-[#e8e8e8] bg-[#fafafa] px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
          <Download size={14} className="text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-[#0a0a0a] leading-tight">
            Instalar AJ Barbershop
          </p>
          <p className="text-[11px] text-[#a0a0a0] leading-tight mt-0.5">
            Acceso directo desde la pantalla de inicio
          </p>
        </div>
        <button
          onClick={handleInstall}
          className="flex-shrink-0 h-8 px-4 bg-[#0a0a0a] text-white rounded-lg text-[11px] font-semibold
                     hover:bg-[#333] transition-colors btn-press"
        >
          Instalar
        </button>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full
                     hover:bg-[#e8e8e8] transition-colors text-[#a0a0a0]"
        >
          <X size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
