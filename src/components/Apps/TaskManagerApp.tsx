import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { sounds } from '../../utils/soundEffects';
import { Activity, Cpu, HardDrive, Zap, Trash2, ShieldAlert } from 'lucide-react';

export const TaskManagerApp: React.FC = () => {
  const { windows, closeWindow } = useOS();
  const [cpuUsage, setCpuUsage] = useState<number>(14);
  const [ramUsage, setRamUsage] = useState<number>(38);
  const [gpuUsage, setGpuUsage] = useState<number>(22);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuations based on running windows
      const baseCpu = windows.length * 4 + 8;
      setCpuUsage(Math.min(95, Math.max(5, baseCpu + Math.floor(Math.random() * 8) - 4)));
      setRamUsage(Math.min(90, Math.max(20, 32 + windows.length * 3 + Math.floor(Math.random() * 4))));
      setGpuUsage(Math.min(99, Math.max(10, (windows.some(w => w.appId.includes('3d') || w.appId.includes('cyber') || w.appId.includes('cosmic') || w.appId.includes('voxel')) ? 60 : 15) + Math.floor(Math.random() * 10))));
    }, 1500);

    return () => clearInterval(interval);
  }, [windows]);

  const handleEndTask = () => {
    if (!selectedProcessId) return;
    sounds.playClick();
    closeWindow(selectedProcessId);
    setSelectedProcessId(null);
  };

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Metrics Cards */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 grid grid-cols-3 gap-3 shrink-0">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              CPU
            </span>
            <span className="font-mono font-bold text-white">{cpuUsage}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${cpuUsage}%` }} />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
              Memoria RAM
            </span>
            <span className="font-mono font-bold text-white">{ramUsage}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${ramUsage}%` }} />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-pink-400" />
              GPU 3D
            </span>
            <span className="font-mono font-bold text-white">{gpuUsage}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-pink-500 transition-all duration-300" style={{ width: `${gpuUsage}%` }} />
          </div>
        </div>
      </div>

      {/* Processes Table Header */}
      <div className="px-4 py-2 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        <span className="flex-1">Nombre del Proceso</span>
        <span className="w-24 text-right">Estado</span>
        <span className="w-24 text-right">CPU</span>
        <span className="w-24 text-right">Memoria</span>
      </div>

      {/* Process List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 text-xs font-mono">
        {/* Core System background services */}
        <div className="px-4 py-2.5 flex items-center justify-between text-slate-400 hover:bg-slate-800/30">
          <span className="flex-1 text-slate-300 font-sans font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            llucKernel.exe (Núcleo del Sistema)
          </span>
          <span className="w-24 text-right text-emerald-400">Activo</span>
          <span className="w-24 text-right">1.2%</span>
          <span className="w-24 text-right">180 MB</span>
        </div>

        <div className="px-4 py-2.5 flex items-center justify-between text-slate-400 hover:bg-slate-800/30">
          <span className="flex-1 text-slate-300 font-sans font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            DWM.exe (Desktop Window Manager)
          </span>
          <span className="w-24 text-right text-emerald-400">Activo</span>
          <span className="w-24 text-right">2.8%</span>
          <span className="w-24 text-right">312 MB</span>
        </div>

        <div className="px-4 py-2.5 flex items-center justify-between text-slate-400 hover:bg-slate-800/30">
          <span className="flex-1 text-slate-300 font-sans font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            WebAudioSynthesizer.sys
          </span>
          <span className="w-24 text-right text-emerald-400">Activo</span>
          <span className="w-24 text-right">0.6%</span>
          <span className="w-24 text-right">64 MB</span>
        </div>

        {/* User Running Windows */}
        {windows.map(win => {
          const isSelected = selectedProcessId === win.id;
          return (
            <div
              key={win.id}
              onClick={() => {
                sounds.playClick();
                setSelectedProcessId(win.id);
              }}
              className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-blue-600/30 border-l-4 border-blue-500 text-white'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span className="flex-1 font-sans font-medium flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                {win.title}.app
              </span>
              <span className="w-24 text-right text-sky-400">
                {win.isMinimized ? 'Minimizado' : 'En ejecución'}
              </span>
              <span className="w-24 text-right">
                {win.appId.includes('3d') ? '18.4%' : '3.2%'}
              </span>
              <span className="w-24 text-right">
                {win.appId.includes('3d') ? '480 MB' : '124 MB'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {windows.length + 3} procesos activos en segundo plano
        </span>
        <button
          type="button"
          disabled={!selectedProcessId}
          onClick={handleEndTask}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            selectedProcessId
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-md'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Finalizar tarea
        </button>
      </div>
    </div>
  );
};
