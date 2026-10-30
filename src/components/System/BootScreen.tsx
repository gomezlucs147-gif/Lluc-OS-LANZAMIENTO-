import React, { useEffect } from 'react';
import { useOS } from '../../context/OSContext';

export const BootScreen: React.FC = () => {
  const { settings } = useOS();

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center select-none overflow-hidden">
      {/* llucOS Logo */}
      <div 
        className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl mb-12"
        style={{ backgroundColor: settings.accentColor }}
      >
        <div className="grid grid-cols-2 gap-1.5 w-10 h-10">
          <div className="bg-white rounded-[2px]" />
          <div className="bg-white rounded-[2px]" />
          <div className="bg-white rounded-[2px]" />
          <div className="bg-white rounded-[2px]" />
        </div>
      </div>

      {/* Windows 11 style spinning circle dots */}
      <div className="relative w-12 h-12 mb-6">
        <div className="w-12 h-12 rounded-full border-2 border-t-white border-r-white/30 border-b-white/10 border-l-transparent animate-spin" />
      </div>

      <div className="text-xs font-mono tracking-widest text-slate-400 uppercase">
        Iniciando llucOS...
      </div>
    </div>
  );
};
