import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS_CATALOG } from '../../data/appsCatalog';
import { sounds } from '../../utils/soundEffects';
import { 
  Search, 
  Power, 
  RotateCcw, 
  Lock, 
  Sparkles, 
  ChevronRight, 
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
  ArrowRight,
  HardDrive,
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

export const StartMenu: React.FC = () => {
  const { 
    startMenuOpen, 
    setStartMenuOpen, 
    openApp, 
    userProfile, 
    installedAppIds, 
    pinnedAppIds,
    reboot,
    shutdown,
    lock,
    reinstallOS,
    settings,
    editionId
  } = useOS();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllApps, setShowAllApps] = useState<boolean>(false);
  const [powerMenuOpen, setPowerMenuOpen] = useState<boolean>(false);

  if (!startMenuOpen) return null;

  // Filter apps
  const installedApps = APPS_CATALOG.filter(a => installedAppIds.includes(a.id));
  const pinnedApps = APPS_CATALOG.filter(a => pinnedAppIds.includes(a.id) && installedAppIds.includes(a.id));

  const searchResults = searchQuery.trim()
    ? APPS_CATALOG.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`fixed bottom-14 z-50 w-full max-w-md sm:max-w-xl h-[560px] bg-slate-900/90 backdrop-blur-2xl border border-slate-700/70 rounded-3xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden select-none animate-in fade-in slide-in-from-bottom-4 duration-150 ${
        settings.taskbarAlignment === 'left' ? 'left-3 sm:left-4' : 'left-1/2 -translate-x-1/2'
      }`}
    >
      {/* Top Search Input */}
      <div className="p-5 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Escribe aquí para buscar aplicaciones, juegos 3D y archivos..."
            autoFocus
            className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
        </div>
      </div>

      {/* Main Start Menu Body */}
      <div className="flex-1 overflow-y-auto px-6 py-2">
        {searchQuery ? (
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              Resultados de búsqueda
            </div>
            {searchResults.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No se encontraron aplicaciones para "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-1">
                {searchResults.map(app => {
                  const Icon = ICON_MAP[app.icon] || ShoppingBag;
                  const isInstalled = installedAppIds.includes(app.id);
                  return (
                    <div
                      key={app.id}
                      onClick={() => {
                        sounds.playClick();
                        if (isInstalled) {
                          openApp(app.id);
                        } else {
                          openApp('store');
                        }
                      }}
                      className="p-2.5 rounded-2xl hover:bg-slate-800/80 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
                          style={{ backgroundColor: app.is3DGame ? '#ec4899' : settings.accentColor }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            {app.name}
                            {app.is3DGame && (
                              <span className="text-[9px] bg-pink-500/20 text-pink-300 px-1.5 py-0.2 rounded-full">
                                3D
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{app.description}</div>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10">
                        {isInstalled ? 'Abrir' : 'Instalar en llucStore'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : showAllApps ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Todas las Aplicaciones ({installedApps.length})
              </span>
              <button
                type="button"
                onClick={() => setShowAllApps(false)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                Volver a Ancladas
              </button>
            </div>

            <div className="space-y-1">
              {installedApps.map(app => {
                const Icon = ICON_MAP[app.icon] || ShoppingBag;
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      sounds.playClick();
                      openApp(app.id);
                    }}
                    className="p-2 rounded-xl hover:bg-slate-800/80 flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: app.is3DGame ? '#ec4899' : settings.accentColor }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-200">{app.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pinned Apps Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300">Anclado</span>
                <button
                  type="button"
                  onClick={() => setShowAllApps(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  Todas las aplicaciones
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Pinned Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {pinnedApps.map(app => {
                  const Icon = ICON_MAP[app.icon] || ShoppingBag;
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        openApp(app.id);
                      }}
                      className="p-2.5 rounded-2xl hover:bg-slate-800/70 flex flex-col items-center text-center gap-2 transition-all hover:scale-105 group"
                    >
                      <div 
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow"
                        style={{ backgroundColor: app.is3DGame ? '#ec4899' : settings.accentColor }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-200 truncate w-full group-hover:text-white">
                        {app.shortName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recommended / 3D Games Featured Section */}
            <div>
              <div className="text-xs font-bold text-slate-300 mb-2.5">
                Recomendado en llucOS
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  onClick={() => {
                    sounds.playClick();
                    openApp('cyber-rider');
                  }}
                  className="p-2.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">CyberRider 3D</div>
                    <div className="text-[10px] text-slate-400">Juego 3D en tiempo real</div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    sounds.playClick();
                    openApp('store');
                  }}
                  className="p-2.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Descargar Juegos 3D</div>
                    <div className="text-[10px] text-slate-400">Explorar la llucStore</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Start Menu Bottom User & Power Footer */}
      <div className="p-4 px-6 bg-slate-950/80 border-t border-slate-800/90 flex items-center justify-between relative shrink-0">
        <div className="flex items-center gap-3">
          <img
            src={userProfile.avatar}
            alt={userProfile.username}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500 shadow-md"
          />
          <div>
            <div className="text-xs font-bold text-white">{userProfile.username}</div>
            <div className="text-[10px] text-slate-400 font-mono">
              {editionId === 'gamer' ? 'Edición Gamer RGB' : editionId === 'workstation' ? 'Workstation Ultra' : 'llucOS 11 Pro'}
            </div>
          </div>
        </div>

        {/* Power Menu Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setPowerMenuOpen(prev => !prev);
            }}
            className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Opciones de energía"
          >
            <Power className="w-5 h-5" />
          </button>

          {/* Power Options Dropdown */}
          {powerMenuOpen && (
            <div className="absolute right-0 bottom-12 w-48 bg-slate-800 border border-slate-700 rounded-2xl p-1.5 shadow-2xl z-50 text-xs">
              <button
                type="button"
                onClick={() => {
                  setPowerMenuOpen(false);
                  lock();
                }}
                className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-700/80 text-slate-200 flex items-center gap-2 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                Bloquear
              </button>

              <button
                type="button"
                onClick={() => {
                  setPowerMenuOpen(false);
                  reboot();
                }}
                className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-700/80 text-slate-200 flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                Reiniciar
              </button>

              <button
                type="button"
                onClick={() => {
                  setPowerMenuOpen(false);
                  reinstallOS();
                }}
                className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-700/80 text-rose-300 flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                Reinstalar llucOS
              </button>

              <div className="border-t border-slate-700/60 my-1" />

              <button
                type="button"
                onClick={() => {
                  setPowerMenuOpen(false);
                  shutdown();
                }}
                className="w-full px-3 py-2 rounded-xl text-left hover:bg-red-600/20 text-red-400 flex items-center gap-2 transition-colors"
              >
                <Power className="w-3.5 h-3.5" />
                Apagar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
