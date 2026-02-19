import { Scissors } from 'lucide-react';
import BottomNav from './BottomNav';
import InstallPrompt from './InstallPrompt';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-lg mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2 px-5 py-4">
          <Scissors size={18} strokeWidth={1.8} className="text-[#0a0a0a]" />
          <span className="font-['Playfair_Display',Georgia,serif] text-lg font-700 tracking-widest uppercase text-[#0a0a0a] select-none">
            AJ Barbershop
          </span>
        </div>
        {/* Banner de instalación PWA */}
        <InstallPrompt />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-5">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
