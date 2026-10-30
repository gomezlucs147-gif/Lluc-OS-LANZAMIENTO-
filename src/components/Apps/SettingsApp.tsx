import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { WALLPAPERS } from '../../data/wallpapers';
import { OS_EDITIONS } from '../../data/editions';
import { sounds } from '../../utils/soundEffects';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Laptop, 
  RotateCcw, 
  Volume2, 
  Sun, 
  Check, 
  HardDrive, 
  ShieldCheck,
  User,
  Zap,
  AlignLeft,
  AlignCenter,
  Download,
  Upload,
  Database,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const ACCENTS = [
  { name: 'Azul lluc', hex: '#3b82f6' },
  { name: 'Rosa Neón Gamer', hex: '#ec4899' },
  { name: 'Esmeralda Ciber', hex: '#10b981' },
  { name: 'Violeta Aurora', hex: '#8b5cf6' },
  { name: 'Ámbar Solar', hex: '#f59e0b' },
  { name: 'Cian Cuántico', hex: '#06b6d4' },
];

export const SettingsApp: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    userProfile, 
    editionId, 
    reinstallOS,
    exportBackup,
    importBackup,
    resetToFactoryDefaults,
    isPersistent,
    virtualFiles,
    installedAppIds
  } = useOS();

  const [activeTab, setActiveTab] = useState<'personalization' | 'system' | 'storage'>('personalization');
  const [confirmReinstall, setConfirmReinstall] = useState<boolean>(false);
  const [confirmFactoryReset, setConfirmFactoryReset] = useState<boolean>(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  const currentEdition = OS_EDITIONS.find(e => e.id === editionId) || OS_EDITIONS[0];

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col md:flex-row overflow-hidden select-none">
      {/* Settings Navigation Sidebar */}
      <div className="w-full md:w-56 bg-slate-950/60 border-r border-slate-800 p-3 space-y-2 shrink-0">
        <div className="px-3 py-2 flex items-center gap-3 mb-2">
          <img
            src={userProfile.avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500 shadow-md"
          />
          <div className="overflow-hidden">
            <div className="font-bold text-xs text-white truncate">{userProfile.username}</div>
            <div className="text-[10px] text-slate-400 truncate">{currentEdition.name}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab('personalization');
          }}
          className={`w-full px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
            activeTab === 'personalization'
              ? 'bg-blue-600 text-white font-semibold shadow-md'
              : 'text-slate-300 hover:bg-slate-800/60'
          }`}
          style={activeTab === 'personalization' ? { backgroundColor: settings.accentColor } : {}}
        >
          <Palette className="w-4 h-4" />
          Personalización
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab('system');
          }}
          className={`w-full px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
            activeTab === 'system'
              ? 'bg-blue-600 text-white font-semibold shadow-md'
              : 'text-slate-300 hover:bg-slate-800/60'
          }`}
          style={activeTab === 'system' ? { backgroundColor: settings.accentColor } : {}}
        >
          <Laptop className="w-4 h-4" />
          Sistema & Reinstalar
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab('storage');
          }}
          className={`w-full px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
            activeTab === 'storage'
              ? 'bg-blue-600 text-white font-semibold shadow-md'
              : 'text-slate-300 hover:bg-slate-800/60'
          }`}
          style={activeTab === 'storage' ? { backgroundColor: settings.accentColor } : {}}
        >
          <HardDrive className="w-4 h-4" />
          Almacenamiento (C:\)
        </button>
      </div>

      {/* Main Settings Panel */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* PERSONALIZATION */}
        {activeTab === 'personalization' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Personalización de llucOS</h2>
              <p className="text-xs text-slate-400">
                Cambia fondos de pantalla, temas visuales y posición de la barra de tareas.
              </p>
            </div>

            {/* Wallpapers Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-3">
                Fondos de Pantalla
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WALLPAPERS.map(wp => {
                  const isSelected = settings.wallpaperId === wp.id;
                  return (
                    <div
                      key={wp.id}
                      onClick={() => {
                        sounds.playClick();
                        updateSettings({ wallpaperId: wp.id });
                      }}
                      className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-video ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/40 scale-[1.02] shadow-lg'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <img src={wp.thumbnail} alt={wp.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent text-[10px] text-white font-medium truncate">
                        {wp.name}
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-3">
                Color de acento
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ACCENTS.map(acc => (
                  <button
                    key={acc.hex}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      updateSettings({ accentColor: acc.hex });
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      settings.accentColor === acc.hex
                        ? 'border-white bg-slate-800 shadow-md ring-1 ring-white/40'
                        : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: acc.hex }} />
                    <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">
                      {acc.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Taskbar Alignment */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Alineación de la Barra de Tareas</div>
                <div className="text-[11px] text-slate-400">Estilo Windows 11 (Centro) o Windows 10 (Izquierda)</div>
              </div>

              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    updateSettings({ taskbarAlignment: 'left' });
                  }}
                  className={`p-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                    settings.taskbarAlignment === 'left' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  Izquierda
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    updateSettings({ taskbarAlignment: 'center' });
                  }}
                  className={`p-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                    settings.taskbarAlignment === 'center' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                  Centro
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SYSTEM & REINSTALL OS */}
        {activeTab === 'system' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Especificaciones del Sistema</h2>
              <p className="text-xs text-slate-400">Información del hardware virtual y opciones de recuperación.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/70 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700/60">
                <span className="text-slate-400">Edición instalada</span>
                <span className="font-bold text-white">{currentEdition.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700/60">
                <span className="text-slate-400">Versión del Kernel</span>
                <span className="font-mono text-slate-200">llucKernel v2.4 (Fluent WebGL)</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700/60">
                <span className="text-slate-400">Motor Gráfico</span>
                <span className="font-mono text-cyan-400">Three.js PBR Engine (Direct 3D)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Nombre del equipo</span>
                <span className="font-mono text-slate-200">{userProfile.computerName}</span>
              </div>
            </div>

            {/* Sound & Effects toggle */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Efectos de sonido de llucOS</div>
                <div className="text-[11px] text-slate-400">Sonido de inicio, clicks y notificaciones sintetizadas</div>
              </div>

              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={(e) => updateSettings({ soundEffects: e.target.checked })}
                className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
              />
            </div>

            {/* REINSTALL OS SECTION (Prominently featured per user request!) */}
            <div className="bg-red-950/30 border border-red-800/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Reinstalar el Sistema Operativo</h3>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Vuelve a abrir el <strong>Menú de Instalación de llucOS</strong> para cambiar la versión (Pro, Gamer Edition, Workstation Ultra), reformatear particiones o crear un nuevo usuario.
                  </p>
                </div>
              </div>

              {confirmReinstall ? (
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => reinstallOS()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg transition-transform active:scale-95"
                  >
                    Confirmar y reiniciar en Asistente de Instalación
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReinstall(false)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReinstall(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Iniciar Menú de Instalación de llucOS
                </button>
              )}
            </div>
          </div>
        )}

        {/* STORAGE & PERSISTENCE */}
        {activeTab === 'storage' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Almacenamiento y Persistencia</h2>
              <p className="text-xs text-slate-400">Tus datos, archivos y configuración se guardan automáticamente en tu navegador.</p>
            </div>

            {/* Persistent State Active Banner */}
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Guardado Automático Activo</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    PERSISTENTE
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Todo lo que haces en <strong>llucOS</strong> (archivos creados en el explorador, carpetas, notas rápidas, apps instaladas en la llucStore, bloques construidos en Minecraft y fondos elegidos) se conserva automáticamente incluso si cierras o recargas la página.
                </p>
              </div>
            </div>

            {/* Disk space usage */}
            <div className="bg-slate-800/50 border border-slate-700/70 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Disco Local (C:\)</div>
                  <div className="text-xs text-slate-400">Sistema de archivos virtual llucFS v2</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-emerald-400">
                    {virtualFiles.length} archivos y carpetas
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {installedAppIds.length} aplicaciones instaladas
                  </div>
                </div>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
                <div className="bg-blue-500 h-full w-[12%]" title="Sistema llucOS" />
                <div className="bg-pink-500 h-full w-[18%]" title="Juegos 3D llucStore" />
                <div className="bg-emerald-500 h-full w-[8%]" title="Documentos y Archivos de Usuario" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Sistema</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span>Juegos ({installedAppIds.length})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Archivos ({virtualFiles.length})</span>
                </div>
              </div>
            </div>

            {/* Backup & Restore Controls */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-blue-400" />
                    Copia de Seguridad y Restauración
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Descarga un archivo con toda tu información o restaura una copia en cualquier navegador.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    exportBackup();
                    setBackupMessage('¡Copia de seguridad descargada con éxito!');
                    setTimeout(() => setBackupMessage(null), 3000);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar Copia de Seguridad (.json)
                </button>

                <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors active:scale-95">
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  Restaurar Copia desde Archivo
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const content = event.target?.result as string;
                          if (content) {
                            const success = importBackup(content);
                            if (success) {
                              setBackupMessage('¡Copia de seguridad restaurada correctamente!');
                              setTimeout(() => setBackupMessage(null), 3500);
                            } else {
                              setBackupMessage('Error al leer el archivo de copia de seguridad.');
                              setTimeout(() => setBackupMessage(null), 3500);
                            }
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>

              {backupMessage && (
                <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-semibold animate-in fade-in">
                  {backupMessage}
                </div>
              )}
            </div>

            {/* Factory Reset */}
            <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  Restablecer a Valores de Fábrica
                </div>
                <div className="text-[11px] text-slate-400">
                  Borra todos los archivos locales guardados y reinicia el Asistente de Instalación desde cero.
                </div>
              </div>

              {confirmFactoryReset ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => resetToFactoryDefaults()}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
                  >
                    Sí, borrar todo
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmFactoryReset(false)}
                    className="px-2.5 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-xl"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmFactoryReset(true)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-red-600/20 text-red-400 border border-red-500/30 font-medium text-xs rounded-xl transition-colors"
                >
                  Restablecer
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
