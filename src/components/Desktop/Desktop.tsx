import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS_CATALOG } from '../../data/appsCatalog';
import { WALLPAPERS } from '../../data/wallpapers';
import { WindowFrame } from '../Window/WindowFrame';
import { Taskbar } from '../Taskbar/Taskbar';
import { sounds } from '../../utils/soundEffects';
import { 
  ShoppingBag, 
  Gamepad2, 
  Rocket, 
  Boxes, 
  FolderKanban, 
  Code2, 
  Palette, 
  Music, 
  Terminal, 
  Globe, 
  Calculator, 
  Activity, 
  StickyNote, 
  Settings,
  RotateCcw,
  Plus,
  Sparkles,
  CloudSun,
  Cpu,
  Zap,
  HardDrive,
  Sun,
  Compass,
  Clock,
  Languages,
  Disc
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ShoppingBag,
  Gamepad2,
  Rocket,
  Boxes,
  FolderKanban,
  Code2,
  Palette,
  Music,
  Terminal,
  Globe,
  Calculator,
  Activity,
  StickyNote,
  Settings,
  Sun,
  Compass,
  CloudSun,
  Clock,
  Languages,
  Disc,
};

export const Desktop: React.FC = () => {
  const { 
    windows, 
    openApp, 
    installedAppIds, 
    settings, 
    userProfile, 
    reinstallOS,
    addVirtualFile,
    setStartMenuOpen,
    setQuickSettingsOpen,
    setCalendarOpen
  } = useOS();

  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const currentWallpaper = WALLPAPERS.find(w => w.id === settings.wallpaperId) || WALLPAPERS[0];
  const desktopApps = APPS_CATALOG.filter(a => installedAppIds.includes(a.id));

  const handleDesktopClick = () => {
    setSelectedIconId(null);
    setContextMenu(null);
    setStartMenuOpen(false);
    setQuickSettingsOpen(false);
    setCalendarOpen(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    sounds.playClick();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleIconDoubleClick = (appId: string) => {
    sounds.playClick();
    openApp(appId);
  };

  return (
    <div
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{
        backgroundImage: `url(${currentWallpaper.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Subtle wallpaper overlay tint */}
      <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[1px] pointer-events-none" />

      {/* Desktop Top Right Widgets (Clock/Weather & Telemetry) */}
      {settings.widgetsVisible && (
        <div className="absolute top-5 right-5 z-0 flex flex-col gap-3 pointer-events-none hidden sm:flex">
          {/* Weather & Time Widget */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 p-4 rounded-3xl shadow-2xl text-white w-64">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-semibold">Tiempo en {userProfile.locale.split('-')[0].toUpperCase()}</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">21°C</span>
            </div>
            <div className="text-[11px] text-slate-300">Cielo despejado • llucWeather</div>
          </div>

          {/* Performance 3D telemetry HUD */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 p-4 rounded-3xl shadow-2xl text-white w-64 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Rendimiento 3D
              </span>
              <span className="font-mono text-emerald-400 text-[10px]">60 FPS</span>
            </div>
            <div className="text-[11px] text-slate-300 flex justify-between">
              <span>Three.js WebGL:</span>
              <span className="text-cyan-400 font-mono">Activo</span>
            </div>
            <div className="text-[11px] text-slate-300 flex justify-between">
              <span>Modo Rendimiento:</span>
              <span className="text-pink-400 font-mono">{settings.performanceMode ? 'Activo' : 'Equilibrado'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop App Icons Grid (Real Windows multi-column wrap) */}
      <div className="relative z-10 p-3 flex flex-col flex-wrap content-start items-start gap-1.5 h-[calc(100vh-64px)] max-w-[85vw] overflow-hidden pointer-events-auto">
        {desktopApps.map(app => {
          const Icon = ICON_MAP[app.icon] || ShoppingBag;
          const isSelected = selectedIconId === app.id;

          return (
            <div
              key={app.id}
              onClick={(e) => {
                e.stopPropagation();
                sounds.playClick();
                setSelectedIconId(app.id);
              }}
              onDoubleClick={() => handleIconDoubleClick(app.id)}
              className={`w-20 sm:w-22 p-1.5 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all duration-150 group select-none ${
                isSelected
                  ? 'bg-blue-600/35 ring-1 ring-blue-400 shadow-lg backdrop-blur-sm'
                  : 'hover:bg-slate-900/40 hover:backdrop-blur-sm'
              }`}
            >
              <div 
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform shrink-0"
                style={{ backgroundColor: app.is3DGame ? '#ec4899' : settings.accentColor }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate w-full mt-1 group-hover:text-blue-200">
                {app.shortName}
              </span>
            </div>
          );
        })}
      </div>

      {/* Window Manager (Renders all open windows) */}
      {windows.map(win => (
        <WindowFrame key={win.id} window={win} />
      ))}

      {/* Desktop Right-Click Context Menu */}
      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 w-56 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl text-xs text-slate-200 space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
        >
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 rounded-xl hover:bg-slate-800 text-left flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            Actualizar Escritorio
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setContextMenu(null);
              addVirtualFile({
                name: `Nota_${Date.now().toString().slice(-4)}.txt`,
                path: `C:/Documentos/Nota_${Date.now().toString().slice(-4)}.txt`,
                type: 'file',
                extension: 'txt',
                sizeKB: 1,
                content: 'Nueva nota creada desde el menú contextual.'
              });
              openApp('explorer');
            }}
            className="w-full px-3 py-1.5 rounded-xl hover:bg-slate-800 text-left flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            Nuevo Documento de Texto
          </button>

          <div className="border-t border-slate-800 my-1" />

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setContextMenu(null);
              openApp('store');
            }}
            className="w-full px-3 py-1.5 rounded-xl hover:bg-slate-800 text-left flex items-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
            Abrir llucStore
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setContextMenu(null);
              openApp('cyber-rider');
            }}
            className="w-full px-3 py-1.5 rounded-xl hover:bg-slate-800 text-left flex items-center gap-2"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
            Lanzar CyberRider 3D
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setContextMenu(null);
              openApp('settings');
            }}
            className="w-full px-3 py-1.5 rounded-xl hover:bg-slate-800 text-left flex items-center gap-2"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            Cambiar Fondo de Pantalla
          </button>

          <div className="border-t border-slate-800 my-1" />

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setContextMenu(null);
              reinstallOS();
            }}
            className="w-full px-3 py-1.5 rounded-xl hover:bg-red-600/20 text-red-400 text-left flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reinstalar llucOS
          </button>
        </div>
      )}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};
