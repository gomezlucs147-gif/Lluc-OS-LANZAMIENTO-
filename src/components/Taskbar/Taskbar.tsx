import React from 'react';
import { useOS } from '../../context/OSContext';
import { APPS_CATALOG } from '../../data/appsCatalog';
import { sounds } from '../../utils/soundEffects';
import { SystemTray } from './SystemTray';
import { StartMenu } from './StartMenu';
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
  Search,
  Sun,
  Compass,
  CloudSun,
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

export const Taskbar: React.FC = () => {
  const { 
    startMenuOpen, 
    setStartMenuOpen, 
    setQuickSettingsOpen,
    setCalendarOpen,
    openApp, 
    minimizeWindow, 
    focusWindow, 
    windows, 
    activeWindowId, 
    pinnedAppIds, 
    installedAppIds,
    settings 
  } = useOS();

  // Combine pinned apps and currently open apps that might not be pinned
  const openAppIds = windows.map(w => w.appId);
  const taskbarAppIds = Array.from(new Set([...pinnedAppIds, ...openAppIds]))
    .filter(id => installedAppIds.includes(id));

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setStartMenuOpen(prev => !prev);
    setQuickSettingsOpen(false);
    setCalendarOpen(false);
  };

  const handleAppClick = (appId: string) => {
    sounds.playClick();
    const existingWin = windows.find(w => w.appId === appId);
    if (existingWin) {
      if (existingWin.id === activeWindowId && !existingWin.isMinimized) {
        // minimize if already focused
        minimizeWindow(existingWin.id);
      } else {
        // focus and unminimize
        focusWindow(existingWin.id);
      }
    } else {
      openApp(appId);
    }
  };

  return (
    <>
      <StartMenu />

      <footer className="fixed bottom-0 inset-x-0 h-12 bg-slate-900/80 backdrop-blur-2xl border-t border-slate-800/80 z-40 px-3 flex items-center justify-between select-none">
        {/* Left spacer when centered, or Start button if left-aligned */}
        {settings.taskbarAlignment === 'center' ? (
          <div className="w-24 hidden sm:block text-[11px] text-slate-400 font-mono truncate">
            llucOS 11
          </div>
        ) : null}

        {/* Taskbar Center / Left App Cluster */}
        <div className={`flex items-center gap-1.5 ${
          settings.taskbarAlignment === 'center' ? 'mx-auto' : ''
        }`}>
          {/* Start Orb Button */}
          <button
            type="button"
            onClick={handleStartClick}
            title="Inicio (llucOS)"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              startMenuOpen
                ? 'bg-blue-600/30 ring-2 ring-blue-500 shadow-md'
                : 'hover:bg-slate-800/80 active:scale-95'
            }`}
          >
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"
              style={{ backgroundColor: settings.accentColor }}
            >
              <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                <div className="bg-white rounded-[1px]" />
                <div className="bg-white rounded-[1px]" />
                <div className="bg-white rounded-[1px]" />
                <div className="bg-white rounded-[1px]" />
              </div>
            </div>
          </button>

          {/* Search Quick Button */}
          <button
            type="button"
            onClick={handleStartClick}
            title="Buscar"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* App Icons */}
          {taskbarAppIds.map(appId => {
            const app = APPS_CATALOG.find(a => a.id === appId);
            if (!app) return null;
            const Icon = ICON_MAP[app.icon] || ShoppingBag;
            const openWin = windows.find(w => w.appId === appId);
            const isOpen = !!openWin;
            const isFocused = openWin?.id === activeWindowId && !openWin?.isMinimized;

            return (
              <button
                key={appId}
                type="button"
                onClick={() => handleAppClick(appId)}
                title={app.name}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isFocused
                    ? 'bg-slate-800/90 shadow-md text-white'
                    : isOpen
                    ? 'hover:bg-slate-800/60 text-slate-200'
                    : 'hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: app.is3DGame ? '#ec4899' : settings.accentColor }}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Running Indicator Dot / Pill */}
                {isOpen && (
                  <span 
                    className={`absolute bottom-1 rounded-full transition-all ${
                      isFocused ? 'w-4 h-1' : 'w-1.5 h-1'
                    }`}
                    style={{ backgroundColor: settings.accentColor }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right System Tray */}
        <SystemTray />
      </footer>
    </>
  );
};
