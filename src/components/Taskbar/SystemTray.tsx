import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { sounds } from '../../utils/soundEffects';
import { 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  Battery, 
  Sun, 
  Moon, 
  Bluetooth, 
  RotateCcw, 
  Calendar as CalendarIcon, 
  Bell, 
  ShieldCheck,
  Zap,
  HardDrive
} from 'lucide-react';

export const SystemTray: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    quickSettingsOpen, 
    setQuickSettingsOpen, 
    calendarOpen, 
    setCalendarOpen, 
    reinstallOS,
    editionId,
    openApp
  } = useOS();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1 text-slate-300 relative select-none">
      {/* Storage Persistence Indicator */}
      <button
        type="button"
        onClick={() => {
          sounds.playClick();
          openApp('settings');
        }}
        title="Almacenamiento persistente activo: Todo se guarda automáticamente en tu navegador"
        className="px-2 py-1.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center gap-1.5 text-slate-400 hover:text-white"
      >
        <HardDrive className="w-3.5 h-3.5" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" title="Guardado automático activo" />
      </button>

      {/* Quick Settings Action Pill */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          sounds.playClick();
          setQuickSettingsOpen(prev => !prev);
          setCalendarOpen(false);
        }}
        className={`px-2.5 py-1.5 rounded-xl flex items-center gap-2 hover:bg-slate-800/80 transition-colors ${
          quickSettingsOpen ? 'bg-slate-800 text-white' : ''
        }`}
      >
        {settings.wifi ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 text-slate-500" />}
        {settings.volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5" />}
        <Battery className="w-4 h-4 text-emerald-400" />
      </button>

      {/* Clock & Date Pill */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          sounds.playClick();
          setCalendarOpen(prev => !prev);
          setQuickSettingsOpen(false);
        }}
        className={`px-2.5 py-1 rounded-xl text-right hover:bg-slate-800/80 transition-colors flex flex-col justify-center ${
          calendarOpen ? 'bg-slate-800 text-white' : ''
        }`}
      >
        <span className="text-[11px] font-semibold text-white leading-tight">{currentTime}</span>
        <span className="text-[9px] text-slate-400 leading-tight">{currentDate}</span>
      </button>

      {/* QUICK SETTINGS FLYOUT PANEL */}
      {quickSettingsOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-14 right-3 z-50 w-80 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-5 shadow-2xl shadow-black/80 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {/* Quick Toggle Tiles */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                updateSettings({ wifi: !settings.wifi });
              }}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${
                settings.wifi
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
              style={settings.wifi ? { backgroundColor: settings.accentColor } : {}}
            >
              <Wifi className="w-4 h-4" />
              <span className="text-[11px]">Wi-Fi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                updateSettings({ bluetooth: !settings.bluetooth });
              }}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${
                settings.bluetooth
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
              style={settings.bluetooth ? { backgroundColor: settings.accentColor } : {}}
            >
              <Bluetooth className="w-4 h-4" />
              <span className="text-[11px]">Bluetooth</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                updateSettings({ performanceMode: !settings.performanceMode });
              }}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${
                settings.performanceMode
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="text-[11px]">Modo Juego</span>
            </button>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                Volumen del Sistema
              </span>
              <span className="font-mono text-white">{settings.volume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.volume}
              onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
              className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Brightness Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Brillo
              </span>
              <span className="font-mono text-white">{settings.brightness}%</span>
            </div>
            <input
              type="range"
              min={30}
              max={100}
              value={settings.brightness}
              onChange={(e) => updateSettings({ brightness: Number(e.target.value) })}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Footer Quick Reinstall Button */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Batería: 100% [Cargada]</span>
            <button
              type="button"
              onClick={() => {
                setQuickSettingsOpen(false);
                reinstallOS();
              }}
              className="px-2.5 py-1 text-[11px] text-rose-300 hover:text-white hover:bg-rose-600/30 rounded-lg transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reinstalar SO
            </button>
          </div>
        </div>
      )}

      {/* CALENDAR & CLOCK FLYOUT */}
      {calendarOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-14 right-3 z-50 w-72 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-5 shadow-2xl shadow-black/80 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="border-b border-slate-800 pb-3">
            <div className="text-3xl font-light text-white font-mono">{currentTime}</div>
            <div className="text-xs text-blue-400 font-medium">{currentDate}</div>
          </div>

          {/* Mini Calendar Grid */}
          <div>
            <div className="text-xs font-bold text-white mb-2">Octubre 2026</div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 font-mono mb-1">
              <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isToday = day === 30;
                return (
                  <div
                    key={day}
                    className={`h-7 flex items-center justify-center rounded-lg ${
                      isToday
                        ? 'bg-blue-600 font-bold text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
