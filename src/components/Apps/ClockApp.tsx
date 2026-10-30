import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import { Clock, Play, Pause, RotateCcw, Flag, Timer } from 'lucide-react';

export const ClockApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stopwatch' | 'timer' | 'world'>('stopwatch');

  // Stopwatch state
  const [swTime, setSwTime] = useState<number>(0);
  const [swRunning, setSwRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (swRunning) {
      interval = setInterval(() => {
        setSwTime(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [swRunning]);

  const toggleStopwatch = () => {
    sounds.playClick();
    setSwRunning(prev => !prev);
  };

  const resetStopwatch = () => {
    sounds.playClick();
    setSwRunning(false);
    setSwTime(0);
    setLaps([]);
  };

  const addLap = () => {
    sounds.playClick();
    setLaps(prev => [swTime, ...prev]);
  };

  const formatMs = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Tab Header */}
      <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white">Reloj de Precisión</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('stopwatch')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'stopwatch' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Cronómetro
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('world')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'world' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Mundial
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto">
        {activeTab === 'stopwatch' ? (
          <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
            <div className="text-5xl sm:text-6xl font-light font-mono text-white tracking-tight py-4 drop-shadow-md">
              {formatMs(swTime)}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={resetStopwatch}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reiniciar"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={toggleStopwatch}
                className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-transform active:scale-95"
              >
                {swRunning ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                <span>{swRunning ? 'Pausar' : 'Iniciar'}</span>
              </button>

              <button
                type="button"
                disabled={!swRunning}
                onClick={addLap}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                title="Vuelta"
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>

            {/* Lap Times */}
            {laps.length > 0 && (
              <div className="w-full bg-slate-800/60 rounded-2xl p-3 border border-slate-700/60 max-h-40 overflow-y-auto divide-y divide-slate-700/40 text-xs font-mono">
                {laps.map((lap, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between text-slate-300">
                    <span className="text-slate-400">Vuelta {laps.length - idx}</span>
                    <span className="font-bold text-cyan-300">{formatMs(lap)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-sm space-y-3">
            {[
              { city: 'Madrid / Barcelona', tz: 'UTC+1', time: new Date().toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' }) },
              { city: 'Londres', tz: 'UTC+0', time: new Date().toLocaleTimeString('es-ES', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' }) },
              { city: 'Nueva York', tz: 'UTC-5', time: new Date().toLocaleTimeString('es-ES', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' }) },
              { city: 'Tokio', tz: 'UTC+9', time: new Date().toLocaleTimeString('es-ES', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' }) },
            ].map((item, i) => (
              <div key={i} className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{item.city}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{item.tz}</div>
                </div>
                <div className="text-xl font-light font-mono text-cyan-300">{item.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
