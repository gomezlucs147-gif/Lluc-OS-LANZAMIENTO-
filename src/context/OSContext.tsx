import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  OSState, 
  OSEditionId, 
  UserProfile, 
  SystemSettings, 
  WindowInstance, 
  VirtualFile 
} from '../types/os';
import { OS_EDITIONS } from '../data/editions';
import { APPS_CATALOG } from '../data/appsCatalog';
import { INITIAL_FILES } from '../data/initialFiles';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface OSContextType {
  osState: OSState;
  editionId: OSEditionId;
  userProfile: UserProfile;
  settings: SystemSettings;
  installedAppIds: string[];
  pinnedAppIds: string[];
  windows: WindowInstance[];
  activeWindowId: string | null;
  virtualFiles: VirtualFile[];
  startMenuOpen: boolean;
  quickSettingsOpen: boolean;
  calendarOpen: boolean;
  searchOpen: boolean;
  
  // Actions
  setStartMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setQuickSettingsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setCalendarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setSearchOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  
  startInstallation: (config: {
    editionId: OSEditionId;
    username: string;
    avatar: string;
    pin: string;
    accentColor: string;
  }) => void;
  completeInstallation: () => void;
  reinstallOS: () => void;
  reboot: () => void;
  shutdown: () => void;
  powerOn: () => void;
  lock: () => void;
  unlock: () => void;
  
  openApp: (appId: string, customData?: any) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => void;
  updateWindowSize: (windowId: string, size: { width: number; height: number }) => void;
  
  installApp: (appId: string) => Promise<void>;
  uninstallApp: (appId: string) => void;
  togglePinApp: (appId: string) => void;
  
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  updateUserProfile: (newProfile: Partial<UserProfile>) => void;
  
  addVirtualFile: (file: Omit<VirtualFile, 'id' | 'createdAt'>) => void;
  addVirtualFolder: (folderName: string, parentPath: string) => void;
  updateVirtualFile: (id: string, content: string) => void;
  deleteVirtualFile: (id: string) => void;

  // Edition Upgrade
  upgradeToTransparentEdition: () => void;

  // Backup & Storage Persistence
  exportBackup: () => void;
  importBackup: (backupJson: string) => boolean;
  resetToFactoryDefaults: () => void;
  isPersistent: boolean;
}

const OSContext = createContext<OSContextType | null>(null);

const DEFAULT_USER: UserProfile = {
  username: 'Lluc',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  pin: '',
  computerName: 'LLUCOS-DESKTOP',
  locale: 'es-ES',
  keyboardLayout: 'Español (España)',
};

const DEFAULT_SETTINGS: SystemSettings = {
  volume: 75,
  brightness: 100,
  wifi: true,
  bluetooth: true,
  performanceMode: false,
  soundEffects: true,
  taskbarAlignment: 'center',
  theme: 'dark',
  accentColor: '#3b82f6',
  wallpaperId: 'bloom-dark',
  widgetsVisible: true,
};

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial states from persistent browser storage
  const [osState, setOsState] = useState<OSState>(() => {
    try {
      const isInstalled = localStorage.getItem('llucos_is_installed');
      const savedState = localStorage.getItem('llucos_os_state');
      if (isInstalled === 'true') {
        if (savedState === 'lockscreen' || savedState === 'desktop') {
          return savedState;
        }
        return 'desktop';
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return 'installer';
  });

  const [editionId, setEditionId] = useState<OSEditionId>(() => {
    try {
      const saved = localStorage.getItem('llucos_edition');
      if (saved && (saved === 'pro' || saved === 'gamer' || saved === 'workstation' || saved === 'transparent')) {
        return saved;
      }
    } catch (e) {}
    return 'pro';
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('llucos_user_profile');
      if (saved) {
        return { ...DEFAULT_USER, ...JSON.parse(saved) };
      }
    } catch (e) {}
    return DEFAULT_USER;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('llucos_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });
  
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(() => {
    try {
      const isCleanInit = localStorage.getItem('llucos_store_clean_v1');
      if (isCleanInit === 'true') {
        const saved = localStorage.getItem('llucos_installed_apps');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } else {
        // First run with new store model: games/extra apps must be manually installed
        localStorage.setItem('llucos_store_clean_v1', 'true');
        const defaultApps = APPS_CATALOG.filter(a => a.defaultInstalled).map(a => a.id);
        localStorage.setItem('llucos_installed_apps', JSON.stringify(defaultApps));
        const defaultPins = APPS_CATALOG.filter(a => a.defaultPinned).map(a => a.id);
        localStorage.setItem('llucos_pinned_apps', JSON.stringify(defaultPins));
        return defaultApps;
      }
    } catch (e) {}
    return APPS_CATALOG.filter(a => a.defaultInstalled).map(a => a.id);
  });
  
  const [pinnedAppIds, setPinnedAppIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('llucos_pinned_apps');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return APPS_CATALOG.filter(a => a.defaultPinned).map(a => a.id);
  });
  
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  
  const [virtualFiles, setVirtualFiles] = useState<VirtualFile[]>(() => {
    try {
      const saved = localStorage.getItem('llucos_virtual_files');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_FILES;
  });
  
  // UI Flyouts
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Synchronize state changes into persistent localStorage
  useEffect(() => {
    try {
      if (osState === 'desktop' || osState === 'lockscreen') {
        localStorage.setItem('llucos_is_installed', 'true');
        localStorage.setItem('llucos_os_state', osState);
      } else if (osState === 'installer') {
        localStorage.setItem('llucos_os_state', 'installer');
      }
    } catch (e) {}
  }, [osState]);

  useEffect(() => {
    try {
      localStorage.setItem('llucos_edition', editionId);
    } catch (e) {}
  }, [editionId]);

  useEffect(() => {
    try {
      localStorage.setItem('llucos_user_profile', JSON.stringify(userProfile));
    } catch (e) {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('llucos_settings', JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('llucos_installed_apps', JSON.stringify(installedAppIds));
    } catch (e) {}
  }, [installedAppIds]);

  useEffect(() => {
    try {
      localStorage.setItem('llucos_pinned_apps', JSON.stringify(pinnedAppIds));
    } catch (e) {}
  }, [pinnedAppIds]);

  useEffect(() => {
    try {
      localStorage.setItem('llucos_virtual_files', JSON.stringify(virtualFiles));
    } catch (e) {}
  }, [virtualFiles]);

  // Sync sounds muted state
  useEffect(() => {
    sounds.setMuted(!settings.soundEffects || settings.volume === 0);
  }, [settings.soundEffects, settings.volume]);

  // Window counter for z-index
  const [topZ, setTopZ] = useState(10);

  // Open App
  const openApp = (appId: string, customData?: any) => {
    setStartMenuOpen(false);
    setSearchOpen(false);
    
    // Check if window already open
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      if (existing.isMinimized) {
        setWindows(prev => prev.map(w => w.id === existing.id ? { ...w, isMinimized: false, zIndex: topZ + 1 } : w));
      } else {
        setWindows(prev => prev.map(w => w.id === existing.id ? { ...w, zIndex: topZ + 1 } : w));
      }
      setActiveWindowId(existing.id);
      setTopZ(prev => prev + 1);
      sounds.playClick();
      return;
    }

    const appMeta = APPS_CATALOG.find(a => a.id === appId);
    if (!appMeta) return;

    sounds.playWindowOpen();

    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

    const width = appMeta.defaultWidth || 800;
    const height = appMeta.defaultHeight || 550;

    // Stagger position
    const offset = (windows.length % 6) * 26 + 40;
    const x = Math.max(20, Math.min(screenW - width - 40, 80 + offset));
    const y = Math.max(20, Math.min(screenH - height - 80, 50 + offset));

    const newWindow: WindowInstance = {
      id: `win-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      appId,
      title: appMeta.name,
      icon: appMeta.icon,
      isMinimized: false,
      isMaximized: false,
      zIndex: topZ + 1,
      position: { x, y },
      size: { width: Math.min(width, screenW - 20), height: Math.min(height, screenH - 90) },
      customData
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setTopZ(prev => prev + 1);
  };

  const closeWindow = (windowId: string) => {
    sounds.playClick();
    setWindows(prev => prev.filter(w => w.id !== windowId));
    if (activeWindowId === windowId) {
      const remaining = windows.filter(w => w.id !== windowId);
      if (remaining.length > 0) {
        // activate highest z-index
        const top = [...remaining].sort((a, b) => b.zIndex - a.zIndex)[0];
        setActiveWindowId(top.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeWindow = (windowId: string) => {
    sounds.playWindowMinimize();
    setWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMinimized: true } : w));
    if (activeWindowId === windowId) {
      const visible = windows.filter(w => w.id !== windowId && !w.isMinimized);
      if (visible.length > 0) {
        const top = [...visible].sort((a, b) => b.zIndex - a.zIndex)[0];
        setActiveWindowId(top.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const maximizeWindow = (windowId: string) => {
    sounds.playClick();
    setWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const focusWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMinimized: false, zIndex: topZ + 1 } : w));
    setActiveWindowId(windowId);
    setTopZ(prev => prev + 1);
  };

  const updateWindowPosition = (windowId: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => w.id === windowId ? { ...w, position } : w));
  };

  const updateWindowSize = (windowId: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => w.id === windowId ? { ...w, size } : w));
  };

  // Installation Flow
  const startInstallation = (config: {
    editionId: OSEditionId;
    username: string;
    avatar: string;
    pin: string;
    accentColor: string;
  }) => {
    setEditionId(config.editionId);
    const newProfile: UserProfile = {
      ...userProfile,
      username: config.username || 'Lluc',
      avatar: config.avatar,
      pin: config.pin,
      computerName: `LLUCOS-${(config.editionId).toUpperCase()}`
    };
    setUserProfile(newProfile);
    
    const newSettings: SystemSettings = {
      ...settings,
      accentColor: config.accentColor,
      performanceMode: config.editionId === 'gamer'
    };
    setSettings(newSettings);

    // Base system apps only - user installs games and other apps manually from llucStore
    const allInstalled = APPS_CATALOG.filter(a => a.defaultInstalled).map(a => a.id);
    const allPinned = APPS_CATALOG.filter(a => a.defaultPinned).map(a => a.id);
    setInstalledAppIds(allInstalled);
    setPinnedAppIds(allPinned);

    try {
      localStorage.setItem('llucos_edition', config.editionId);
      localStorage.setItem('llucos_user_profile', JSON.stringify(newProfile));
      localStorage.setItem('llucos_settings', JSON.stringify(newSettings));
      localStorage.setItem('llucos_installed_apps', JSON.stringify(allInstalled));
    } catch (e) {}

    setOsState('installing');
  };

  const completeInstallation = () => {
    try {
      localStorage.setItem('llucos_is_installed', 'true');
      localStorage.setItem('llucos_os_state', 'desktop');
    } catch (e) {}
    setOsState('desktop');
    sounds.playStartup();
  };

  const reinstallOS = () => {
    sounds.playNotification();
    setWindows([]);
    setActiveWindowId(null);
    setStartMenuOpen(false);
    setQuickSettingsOpen(false);
    try {
      localStorage.setItem('llucos_os_state', 'installer');
    } catch (e) {}
    setOsState('installer');
  };

  const exportBackup = () => {
    try {
      const backupData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        editionId,
        userProfile,
        settings,
        installedAppIds,
        pinnedAppIds,
        virtualFiles,
        stickyNotes: localStorage.getItem('llucos_sticky_notes') || '[]',
        minecraftWorld: localStorage.getItem('llucos_minecraft_world') || '{}',
        cyberriderHi: localStorage.getItem('llucos_cyberrider_hi') || '0',
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `llucOS_Backup_${userProfile.username}_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      sounds.playSuccess();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const importBackup = (backupJson: string): boolean => {
    try {
      const data = JSON.parse(backupJson);
      if (!data || typeof data !== 'object') return false;

      if (data.editionId) {
        setEditionId(data.editionId);
        localStorage.setItem('llucos_edition', data.editionId);
      }
      if (data.userProfile) {
        setUserProfile(data.userProfile);
        localStorage.setItem('llucos_user_profile', JSON.stringify(data.userProfile));
      }
      if (data.settings) {
        setSettings(data.settings);
        localStorage.setItem('llucos_settings', JSON.stringify(data.settings));
      }
      if (Array.isArray(data.installedAppIds)) {
        setInstalledAppIds(data.installedAppIds);
        localStorage.setItem('llucos_installed_apps', JSON.stringify(data.installedAppIds));
      }
      if (Array.isArray(data.pinnedAppIds)) {
        setPinnedAppIds(data.pinnedAppIds);
        localStorage.setItem('llucos_pinned_apps', JSON.stringify(data.pinnedAppIds));
      }
      if (Array.isArray(data.virtualFiles)) {
        setVirtualFiles(data.virtualFiles);
        localStorage.setItem('llucos_virtual_files', JSON.stringify(data.virtualFiles));
      }
      if (data.stickyNotes) {
        localStorage.setItem('llucos_sticky_notes', typeof data.stickyNotes === 'string' ? data.stickyNotes : JSON.stringify(data.stickyNotes));
      }
      if (data.minecraftWorld) {
        localStorage.setItem('llucos_minecraft_world', typeof data.minecraftWorld === 'string' ? data.minecraftWorld : JSON.stringify(data.minecraftWorld));
      }
      if (data.cyberriderHi) {
        localStorage.setItem('llucos_cyberrider_hi', String(data.cyberriderHi));
      }

      localStorage.setItem('llucos_is_installed', 'true');
      localStorage.setItem('llucos_os_state', 'desktop');
      setOsState('desktop');
      sounds.playSuccess();
      return true;
    } catch (err) {
      console.error('Import error:', err);
      return false;
    }
  };

  const resetToFactoryDefaults = () => {
    sounds.playNotification();
    try {
      localStorage.removeItem('llucos_is_installed');
      localStorage.removeItem('llucos_os_state');
      localStorage.removeItem('llucos_edition');
      localStorage.removeItem('llucos_user_profile');
      localStorage.removeItem('llucos_settings');
      localStorage.removeItem('llucos_installed_apps');
      localStorage.removeItem('llucos_pinned_apps');
      localStorage.removeItem('llucos_virtual_files');
      localStorage.removeItem('llucos_sticky_notes');
      localStorage.removeItem('llucos_minecraft_world');
      localStorage.removeItem('llucos_cyberrider_hi');
      localStorage.removeItem('llucos_audio_grid');
      localStorage.removeItem('llucos_audio_bpm');
      localStorage.removeItem('llucos_paint_data');
    } catch (e) {}

    setUserProfile(DEFAULT_USER);
    setSettings(DEFAULT_SETTINGS);
    setEditionId('pro');
    setInstalledAppIds(APPS_CATALOG.filter(a => a.defaultInstalled).map(a => a.id));
    setPinnedAppIds(APPS_CATALOG.filter(a => a.defaultPinned).map(a => a.id));
    setVirtualFiles(INITIAL_FILES);
    setWindows([]);
    setActiveWindowId(null);
    setStartMenuOpen(false);
    setQuickSettingsOpen(false);
    setOsState('installer');
  };

  const upgradeToTransparentEdition = () => {
    sounds.playSuccess();
    setEditionId('transparent');
    const updatedSettings: SystemSettings = {
      ...settings,
      wallpaperId: 'golden-gate-macos',
      accentColor: '#f59e0b',
    };
    setSettings(updatedSettings);
    try {
      localStorage.setItem('llucos_edition', 'transparent');
      localStorage.setItem('llucos_settings', JSON.stringify(updatedSettings));
    } catch (e) {}
  };

  const reboot = () => {
    setWindows([]);
    setActiveWindowId(null);
    setStartMenuOpen(false);
    setQuickSettingsOpen(false);
    setOsState('booting');
    setTimeout(() => {
      setOsState('desktop');
      sounds.playStartup();
    }, 2800);
  };

  const shutdown = () => {
    setWindows([]);
    setActiveWindowId(null);
    setStartMenuOpen(false);
    setQuickSettingsOpen(false);
    setOsState('shutdown');
  };

  const powerOn = () => {
    setOsState('booting');
    setTimeout(() => {
      setOsState('desktop');
      sounds.playStartup();
    }, 2800);
  };

  const lock = () => {
    setStartMenuOpen(false);
    setQuickSettingsOpen(false);
    setOsState('lockscreen');
  };

  const unlock = () => {
    setOsState('desktop');
    sounds.playStartup();
  };

  // App Install / Uninstall
  const installApp = async (appId: string) => {
    if (installedAppIds.includes(appId)) return;
    
    // simulate download & install
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setInstalledAppIds(prev => [...prev, appId]);
        sounds.playSuccess();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
        resolve();
      }, 1200);
    });
  };

  const uninstallApp = (appId: string) => {
    const meta = APPS_CATALOG.find(a => a.id === appId);
    if (meta && !meta.canUninstall) return;
    
    // close window if open
    setWindows(prev => prev.filter(w => w.appId !== appId));
    setInstalledAppIds(prev => prev.filter(id => id !== appId));
    setPinnedAppIds(prev => prev.filter(id => id !== appId));
    sounds.playClick();
  };

  const togglePinApp = (appId: string) => {
    sounds.playClick();
    if (pinnedAppIds.includes(appId)) {
      setPinnedAppIds(prev => prev.filter(id => id !== appId));
    } else {
      setPinnedAppIds(prev => [...prev, appId]);
    }
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateUserProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...newProfile }));
  };

  // Virtual Files & Folders
  const addVirtualFile = (file: Omit<VirtualFile, 'id' | 'createdAt'>) => {
    const newFile: VirtualFile = {
      ...file,
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVirtualFiles(prev => [...prev, newFile]);
    sounds.playNotification();
  };

  const addVirtualFolder = (folderName: string, parentPath: string) => {
    const cleanName = folderName.trim().replace(/[\/\\:*?"<>|]/g, '');
    if (!cleanName) return;
    const folderPath = `${parentPath.replace(/\/$/, '')}/${cleanName}`;
    const newFolder: VirtualFile = {
      id: `dir-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      path: folderPath,
      type: 'folder',
      sizeKB: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVirtualFiles(prev => [...prev, newFolder]);
    sounds.playNotification();
  };

  const updateVirtualFile = (id: string, content: string) => {
    setVirtualFiles(prev => prev.map(f => f.id === id ? { ...f, content } : f));
  };

  const deleteVirtualFile = (id: string) => {
    const target = virtualFiles.find(f => f.id === id);
    if (!target) return;
    sounds.playClick();

    if (target.type === 'folder') {
      // Delete the folder and all nested files/folders
      const targetPrefix = `${target.path}/`;
      setVirtualFiles(prev => prev.filter(f => f.id !== id && !f.path.startsWith(targetPrefix)));
    } else {
      setVirtualFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  return (
    <OSContext.Provider
      value={{
        osState,
        editionId,
        userProfile,
        settings,
        installedAppIds,
        pinnedAppIds,
        windows,
        activeWindowId,
        virtualFiles,
        startMenuOpen,
        quickSettingsOpen,
        calendarOpen,
        searchOpen,
        setStartMenuOpen,
        setQuickSettingsOpen,
        setCalendarOpen,
        setSearchOpen,
        startInstallation,
        completeInstallation,
        reinstallOS,
        reboot,
        shutdown,
        powerOn,
        lock,
        unlock,
        openApp,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
        installApp,
        uninstallApp,
        togglePinApp,
        updateSettings,
        updateUserProfile,
        addVirtualFile,
        addVirtualFolder,
        updateVirtualFile,
        deleteVirtualFile,
        exportBackup,
        importBackup,
        resetToFactoryDefaults,
        upgradeToTransparentEdition,
        isPersistent: true
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const ctx = useContext(OSContext);
  if (!ctx) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return ctx;
};
