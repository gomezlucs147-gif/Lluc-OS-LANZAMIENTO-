import React from 'react';
import { useOS } from '../../context/OSContext';
import { Power } from 'lucide-react';

export const ShutdownScreen: React.FC = () => {
  const { powerOn } = useOS();

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center p-6 select-none">
      <div className="text-center space-y-6">
        <button
          type="button"
          onClick={() => powerOn()}
          className="w-20 h-20 rounded-full bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 text-slate-400 hover:text-blue-400 flex items-center justify-center shadow-2xl transition-all duration-300 group"
        >
          <Power className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>

        <p className="text-xs text-slate-500 font-mono tracking-wider">
          llucOS se ha apagado. Haz click en el botón de encendido para iniciar el equipo.
        </p>
      </div>
    </div>
  );
};
