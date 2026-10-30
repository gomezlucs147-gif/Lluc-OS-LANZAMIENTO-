export type OSEditionId = 'pro' | 'gamer' | 'workstation' | 'transparent';

export interface OSEdition {
  id: OSEditionId;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  defaultAccent: string;
  recommendedRam: string;
  features: string[];
  recommendedApps: string[];
  theme: 'dark' | 'light';
}

export type OSState = 'installer' | 'installing' | 'booting' | 'desktop' | 'lockscreen' | 'shutdown';

export interface UserProfile {
  username: string;
  avatar: string;
  pin: string;
  computerName: string;
  locale: string;
  keyboardLayout: string;
}

export interface SystemSettings {
  volume: number; // 0-100
  brightness: number; // 20-100
  wifi: boolean;
  bluetooth: boolean;
  performanceMode: boolean;
  soundEffects: boolean;
  taskbarAlignment: 'center' | 'left';
  theme: 'dark' | 'light';
  accentColor: string; // hex or tailwind token
  wallpaperId: string;
  customWallpaperUrl?: string;
  widgetsVisible: boolean;
}

export interface AppMetadata {
  id: string;
  name: string;
  shortName: string;
  category: '3d-games' | 'productivity' | 'utilities' | 'multimedia' | 'system';
  icon: string; // Lucide icon key or custom
  badge?: string;
  description: string;
  rating: number; // 1-5
  downloads: string;
  sizeMB: number;
  author: string;
  is3DGame?: boolean;
  defaultInstalled?: boolean;
  defaultPinned?: boolean;
  canUninstall?: boolean;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  customData?: any;
}

export interface VirtualFile {
  id: string;
  name: string;
  path: string; // e.g. "C:/Documentos/bienvenida.txt"
  type: 'file' | 'folder';
  extension?: 'txt' | 'js' | 'png' | 'md' | 'json';
  content?: string;
  sizeKB: number;
  createdAt: string;
}

export interface WallpaperOption {
  id: string;
  name: string;
  category: 'modern' | 'nature' | 'cyberpunk' | 'minimal';
  url: string;
  gradient?: string;
  thumbnail: string;
}
