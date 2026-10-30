import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS_CATALOG } from '../../data/appsCatalog';
import { AppMetadata } from '../../types/os';
import { sounds } from '../../utils/soundEffects';
import { 
  ShoppingBag, 
  Search, 
  Gamepad2, 
  Briefcase, 
  Wrench, 
  Music, 
  Download, 
  Check, 
  Star, 
  Sparkles, 
  ExternalLink, 
  Trash2, 
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Boxes,
  Rocket,
  Code2,
  FolderKanban,
  Palette,
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
  X,
  Play
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

export const LlucStoreApp: React.FC = () => {
  const { installedAppIds, installApp, uninstallApp, openApp, settings } = useOS();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [installingAppId, setInstallingAppId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [selectedApp, setSelectedApp] = useState<AppMetadata | null>(null);

  const categories = [
    { id: 'all', name: 'Todos', icon: Layers },
    { id: '3d-games', name: 'Juegos 3D', icon: Gamepad2 },
    { id: 'productivity', name: 'Productividad', icon: Briefcase },
    { id: 'utilities', name: 'Utilidades', icon: Wrench },
    { id: 'multimedia', name: 'Multimedia', icon: Music },
    { id: 'system', name: 'Sistema', icon: Settings },
  ];

  const filteredApps = APPS_CATALOG.filter(app => {
    const matchesCategory = activeCategory === 'all' || app.category === activeCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInstallClick = async (app: AppMetadata, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sounds.playClick();
    setInstallingAppId(app.id);
    setDownloadProgress(15);

    const stepInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(stepInterval);
          return 90;
        }
        return prev + 25;
      });
    }, 180);

    await installApp(app.id);
    clearInterval(stepInterval);
    setDownloadProgress(100);
    setTimeout(() => {
      setInstallingAppId(null);
      setDownloadProgress(0);
    }, 350);
  };

  const handleOpenClick = (appId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sounds.playClick();
    openApp(appId);
  };

  const handleUninstallClick = (appId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    uninstallApp(appId);
  };

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Store Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: settings.accentColor }}
          >
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              llucStore <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Oficial</span>
            </h1>
            <p className="text-xs text-slate-400">Juegos 3D WebGL acelerados y aplicaciones para llucOS</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar juegos 3D, utilidades, minecraft..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col p-4 sm:p-6 space-y-6">
        {/* Featured Hero Banner */}
        {activeCategory === 'all' && !searchQuery && (
          <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 z-10 max-w-xl text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Novedad Destacada: Minecraft Eaglercraft
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                llucCraft 3D: Eaglercraft Edition
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Construye y mina en un mundo voxel 3D con primera persona, tala árboles de roble, recolecta diamantes, y usa la barra de objetos clásica de 9 slots con físicas completas.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    openApp('minecraft');
                  }}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
                >
                  <Boxes className="w-4 h-4" />
                  Jugar a llucCraft 3D
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveCategory('3d-games');
                  }}
                  className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white font-medium text-xs rounded-xl flex items-center gap-2 border border-slate-600 transition-colors"
                >
                  <Gamepad2 className="w-4 h-4" />
                  Ver Todos los Juegos 3D
                </button>
              </div>
            </div>

            {/* Visual game preview badge */}
            <div className="relative shrink-0 w-64 h-36 rounded-2xl bg-slate-900/90 border border-emerald-500/40 p-3 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">FPS: 60 (Estable)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">Voxel Engine</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md">
                  <Boxes className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">llucCraft 3D</div>
                  <div className="text-[11px] text-slate-400">Eaglercraft Web Edition</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Aceleración WebGL 2.0 activa
              </div>
            </div>
          </div>
        )}

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80'
                }`}
                style={isSelected ? { backgroundColor: settings.accentColor } : {}}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map(app => {
            const isInstalled = installedAppIds.includes(app.id);
            const isCurrentlyInstalling = installingAppId === app.id;
            const IconComponent = ICON_MAP[app.icon] || ShoppingBag;

            return (
              <div
                key={app.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedApp(app);
                }}
                className="bg-slate-800/50 hover:bg-slate-800/90 border border-slate-700/60 hover:border-slate-500 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between group shadow-lg cursor-pointer hover:shadow-2xl hover:scale-[1.01]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0"
                        style={{ backgroundColor: app.is3DGame ? '#ec4899' : settings.accentColor }}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                          {app.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate">{app.author}</p>
                      </div>
                    </div>

                    {app.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 shrink-0">
                        {app.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {app.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-semibold">{app.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{app.downloads} descargas</span>
                    <span>•</span>
                    <span>{app.sizeMB} MB</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-700/50 flex items-center gap-2">
                  {isCurrentlyInstalling ? (
                    <div className="w-full">
                      <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                        <span>Descargando paquetes...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-200"
                          style={{ width: `${downloadProgress}%`, backgroundColor: settings.accentColor }}
                        />
                      </div>
                    </div>
                  ) : isInstalled ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => handleOpenClick(app.id, e)}
                        className="flex-1 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold rounded-xl border border-blue-500/40 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Abrir
                      </button>

                      {app.canUninstall && (
                        <button
                          type="button"
                          onClick={(e) => handleUninstallClick(app.id, e)}
                          title="Desinstalar de llucOS"
                          className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl border border-slate-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleInstallClick(app, e)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                      style={{ backgroundColor: settings.accentColor }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Instalar ({app.sizeMB} MB)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* APP DETAILS MODAL */}
      {selectedApp && (
        <div 
          onClick={() => setSelectedApp(null)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl"
                  style={{ backgroundColor: selectedApp.is3DGame ? '#ec4899' : settings.accentColor }}
                >
                  {React.createElement(ICON_MAP[selectedApp.icon] || ShoppingBag, { className: 'w-7 h-7' })}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedApp.name}</h3>
                  <p className="text-xs text-slate-400">{selectedApp.author}</p>
                  <div className="flex items-center gap-2 text-xs text-amber-400 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">{selectedApp.rating}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{selectedApp.downloads} descargas</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Descripción</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedApp.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Tamaño de descarga</span>
                <span className="font-mono font-bold text-white">{selectedApp.sizeMB} MB</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Categoría</span>
                <span className="font-semibold text-white capitalize">{selectedApp.category}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              {installedAppIds.includes(selectedApp.id) ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedApp(null);
                      openApp(selectedApp.id);
                    }}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir Aplicación
                  </button>

                  {selectedApp.canUninstall && (
                    <button
                      type="button"
                      onClick={() => {
                        uninstallApp(selectedApp.id);
                        setSelectedApp(null);
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-red-500/20 text-red-400 font-semibold text-xs rounded-xl border border-slate-700"
                    >
                      Desinstalar
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleInstallClick(selectedApp);
                    setSelectedApp(null);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  <Download className="w-4 h-4" />
                  Instalar en llucOS ({selectedApp.sizeMB} MB)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
