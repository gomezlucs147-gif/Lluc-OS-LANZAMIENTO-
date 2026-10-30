import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { VirtualFile } from '../../types/os';
import { sounds } from '../../utils/soundEffects';
import { 
  Folder, 
  FolderPlus,
  FileText, 
  FileCode, 
  Image as ImageIcon, 
  HardDrive, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp,
  Plus, 
  Trash2, 
  ExternalLink,
  Search,
  Download,
  FolderOpen,
  ChevronRight,
  Sparkles,
  Clock,
  Info
} from 'lucide-react';

export const FileExplorerApp: React.FC = () => {
  const { virtualFiles, addVirtualFile, addVirtualFolder, deleteVirtualFile, openApp } = useOS();
  const [currentPath, setCurrentPath] = useState<string>('C:/Documentos');
  const [history, setHistory] = useState<string[]>(['C:/Documentos']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');

  const quickNavFolders = [
    { name: 'Documentos', path: 'C:/Documentos', icon: Folder },
    { name: 'Descargas', path: 'C:/Descargas', icon: Download },
    { name: 'Imágenes', path: 'C:/Imagenes', icon: ImageIcon },
    { name: 'Sistema', path: 'C:/Sistema', icon: HardDrive },
    { name: 'Disco Local (C:)', path: 'C:', icon: HardDrive },
  ];

  const navigateTo = (path: string) => {
    sounds.playClick();
    const clean = path.replace(/\/+$/, '') || 'C:';
    if (clean === currentPath) return;

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(clean);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(clean);
    setSelectedItemId(null);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      sounds.playClick();
      const prev = historyIndex - 1;
      setHistoryIndex(prev);
      setCurrentPath(history[prev]);
      setSelectedItemId(null);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      sounds.playClick();
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setCurrentPath(history[next]);
      setSelectedItemId(null);
    }
  };

  const handleUp = () => {
    if (currentPath === 'C:' || currentPath === 'C:/') return;
    const parts = currentPath.split('/');
    parts.pop();
    const parent = parts.join('/') || 'C:';
    navigateTo(parent);
  };

  // Find direct children in currentPath
  const itemsInCurrentPath = virtualFiles.filter(item => {
    if (searchQuery.trim()) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }

    // Normal folder view: only direct children
    // e.g. if currentPath = "C:/Documentos", direct child has path = "C:/Documentos/file.txt" or "C:/Documentos/SubFolder"
    const normalizedCur = currentPath.replace(/\/+$/, '');
    
    // Exact match of current path shouldn't show itself
    if (item.path === normalizedCur) return false;

    // Check if item's parent matches normalizedCur
    const lastSlash = item.path.lastIndexOf('/');
    const itemParent = lastSlash === -1 ? 'C:' : item.path.substring(0, lastSlash);

    return itemParent === normalizedCur;
  });

  // Count items inside a folder helper
  const getFolderChildCount = (folderPath: string) => {
    const prefix = `${folderPath.replace(/\/+$/, '')}/`;
    return virtualFiles.filter(f => f.path.startsWith(prefix) && f.path !== folderPath).length;
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    sounds.playClick();
    addVirtualFolder(newFolderName, currentPath);
    setNewFolderName('');
    setIsNewFolderModalOpen(false);
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    sounds.playClick();
    const nameWithExt = newFileName.includes('.') ? newFileName : `${newFileName}.txt`;
    const extension = (nameWithExt.split('.').pop() || 'txt') as any;
    
    addVirtualFile({
      name: nameWithExt,
      path: `${currentPath.replace(/\/+$/, '')}/${nameWithExt}`,
      type: 'file',
      extension,
      sizeKB: 1,
      content: `Nuevo archivo creado en ${nameWithExt}\nFecha: ${new Date().toLocaleDateString()}\n`
    });
    setNewFileName('');
    setIsNewFileModalOpen(false);
  };

  const handleItemDoubleClick = (item: VirtualFile) => {
    sounds.playClick();
    if (item.type === 'folder') {
      navigateTo(item.path);
    } else {
      openApp('code', { fileId: item.id, fileName: item.name, content: item.content });
    }
  };

  const selectedItem = virtualFiles.find(i => i.id === selectedItemId);

  // Breadcrumbs calculation
  const breadcrumbs = currentPath.split('/').filter(Boolean);

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Explorer Nav Toolbar */}
      <div className="p-2.5 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-1 text-slate-400">
          <button 
            type="button" 
            disabled={historyIndex === 0}
            onClick={handleBack}
            title="Atrás"
            className="p-1.5 hover:bg-slate-700/80 rounded-lg hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            disabled={historyIndex >= history.length - 1}
            onClick={handleForward}
            title="Adelante"
            className="p-1.5 hover:bg-slate-700/80 rounded-lg hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            disabled={currentPath === 'C:' || currentPath === 'C:/'}
            onClick={handleUp}
            title="Subir de nivel (Carpeta superior)"
            className="p-1.5 hover:bg-slate-700/80 rounded-lg hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Breadcrumb Path Bar */}
        <div className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-1 text-xs font-mono text-slate-300 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <HardDrive className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            const crumbPath = breadcrumbs.slice(0, idx + 1).join('/');
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />}
                <button
                  type="button"
                  onClick={() => navigateTo(crumbPath)}
                  className={`hover:text-blue-400 truncate transition-colors ${
                    isLast ? 'font-bold text-white' : 'text-slate-400'
                  }`}
                >
                  {crumb}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-40 sm:w-52">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en carpeta..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Folder & File Creation Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsNewFolderModalOpen(true);
            }}
            title="Crear una nueva carpeta en este directorio"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-700 transition-colors shadow-sm"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Nueva Carpeta</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsNewFileModalOpen(true);
            }}
            title="Crear un nuevo archivo de texto"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuevo Archivo</span>
          </button>
        </div>
      </div>

      {/* Explorer Body: Sidebar + Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Quick Navigation Tree */}
        <div className="w-48 bg-slate-950/50 border-r border-slate-800 p-3 space-y-4 shrink-0 overflow-y-auto">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              Acceso Rápido
            </div>
            <div className="space-y-0.5">
              {quickNavFolders.map(f => {
                const Icon = f.icon;
                const isSelected = currentPath === f.path;
                return (
                  <button
                    key={f.path}
                    type="button"
                    onClick={() => navigateTo(f.path)}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-2.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drive Storage Widget */}
          <div className="pt-2 border-t border-slate-800/80 px-2">
            <div className="text-[10px] font-semibold uppercase text-slate-400 mb-1">
              Disco Local (C:\)
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1 overflow-hidden">
              <div className="bg-blue-500 h-full w-[15%]" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              948 GB libres de 1024 GB
            </div>
          </div>
        </div>

        {/* Main Grid View */}
        <div 
          onClick={() => setSelectedItemId(null)}
          className="flex-1 p-4 overflow-y-auto bg-slate-900/60"
        >
          {itemsInCurrentPath.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center space-y-2">
              <FolderOpen className="w-12 h-12 text-slate-600 stroke-1" />
              <div className="font-semibold text-slate-300">Esta carpeta está vacía</div>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Crea una nueva carpeta o archivo de texto usando los botones de la barra superior.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {itemsInCurrentPath.map(item => {
                const isSelected = selectedItemId === item.id;
                const isFolder = item.type === 'folder';

                return (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                      setSelectedItemId(item.id);
                    }}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center group relative ${
                      isSelected
                        ? 'bg-blue-600/25 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                    }`}
                  >
                    {/* Item Icon */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      {isFolder ? (
                        <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                          <Folder className="w-6 h-6 fill-amber-400/30" />
                        </div>
                      ) : item.extension === 'js' || item.extension === 'json' ? (
                        <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
                          <FileCode className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="text-xs font-medium text-slate-200 truncate w-full group-hover:text-white">
                      {item.name}
                    </div>

                    {/* Subtitle / Size */}
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {isFolder ? `${getFolderChildCount(item.path)} elem.` : `${item.sizeKB} KB`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status & Selection Actions Bar */}
      <div className="p-2 px-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-3">
          <span>{itemsInCurrentPath.length} elemento(s)</span>
          {selectedItem && (
            <span className="text-slate-300 font-medium">
              Seleccionado: {selectedItem.name} ({selectedItem.type === 'folder' ? 'Carpeta' : `${selectedItem.sizeKB} KB`})
            </span>
          )}
        </div>

        {selectedItem && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleItemDoubleClick(selectedItem)}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              {selectedItem.type === 'folder' ? 'Abrir carpeta' : 'Abrir archivo'}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                deleteVirtualFile(selectedItem.id);
                setSelectedItemId(null);
              }}
              className="text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Eliminar {selectedItem.type === 'folder' ? 'carpeta' : ''}
            </button>
          </div>
        )}
      </div>

      {/* MODAL: NUEVA CARPETA */}
      {isNewFolderModalOpen && (
        <div 
          onClick={() => setIsNewFolderModalOpen(false)}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Nueva Carpeta</h3>
                <p className="text-[11px] text-slate-400">Crear dentro de: {currentPath}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nombre de la carpeta
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder();
                }}
                placeholder="Ej. Mis Proyectos"
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewFolderModalOpen(false)}
                className="px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-md"
              >
                Crear Carpeta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NUEVO ARCHIVO */}
      {isNewFileModalOpen && (
        <div 
          onClick={() => setIsNewFileModalOpen(false)}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Nuevo Archivo de Texto</h3>
                <p className="text-[11px] text-slate-400">Crear en: {currentPath}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nombre del archivo
              </label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFile();
                }}
                placeholder="documento.txt"
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewFileModalOpen(false)}
                className="px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateFile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
              >
                Crear Archivo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
