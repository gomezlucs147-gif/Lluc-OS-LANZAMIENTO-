import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { WALLPAPERS } from '../../data/wallpapers';
import { sounds } from '../../utils/soundEffects';
import { ArrowRight, Lock } from 'lucide-react';

export const LockScreen: React.FC = () => {
  const { userProfile, settings, unlock } = useOS();
  const [pinInput, setPinInput] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile.pin || pinInput === userProfile.pin) {
      unlock();
    } else {
      sounds.playNotification();
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  const currentWallpaper = WALLPAPERS.find(w => w.id === settings.wallpaperId) || WALLPAPERS[0];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col justify-between items-center p-8 select-none"
      style={{
        backgroundImage: `url(${currentWallpaper.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

      {/* Top Clock */}
      <div className="relative z-10 text-center mt-12">
        <div className="text-7xl font-extralight text-white font-mono tracking-tight drop-shadow-lg">
          {time}
        </div>
        <div className="text-sm font-medium text-slate-200 capitalize mt-1 drop-shadow">
          {date}
        </div>
      </div>

      {/* Center User Unlock Card */}
      <form onSubmit={handleUnlock} className="relative z-10 flex flex-col items-center max-w-xs w-full mb-16">
        <img
          src={userProfile.avatar}
          alt={userProfile.username}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-white/30 shadow-2xl mb-4"
        />
        <h2 className="text-xl font-bold text-white mb-4 drop-shadow">
          {userProfile.username}
        </h2>

        {userProfile.pin ? (
          <div className="relative w-full mb-2">
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Escribe el PIN..."
              autoFocus
              className={`w-full bg-slate-900/80 border rounded-2xl px-4 py-2.5 text-sm text-center text-white placeholder-slate-400 focus:outline-none backdrop-blur-md font-mono ${
                error ? 'border-red-500 animate-shake' : 'border-slate-700 focus:ring-2 focus:ring-blue-500'
              }`}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-2xl shadow-xl transition-transform active:scale-95"
            style={{ backgroundColor: settings.accentColor }}
          >
            Iniciar sesión
          </button>
        )}

        {error && <span className="text-xs text-rose-400 mt-1">PIN incorrecto</span>}
      </form>

      <div className="relative z-10 text-xs text-slate-400 font-mono">
        llucOS 11 Pro • Sistema bloqueado
      </div>
    </div>
  );
};
