import { OSEdition } from '../types/os';

export const OS_EDITIONS: OSEdition[] = [
  {
    id: 'pro',
    name: 'llucOS 11 Pro',
    badge: 'Edición Estándar',
    tagline: 'Fluidez, elegancia y productividad diaria de nueva generación.',
    description: 'La experiencia equilibrada definitiva de llucOS. Diseñado para multitasking fluido, interfaz traslúcida y compatibilidad con todo el ecosistema de apps.',
    defaultAccent: '#3b82f6',
    recommendedRam: '16 GB DDR5',
    features: [
      'Núcleo llucKernel v2.4 con aceleración gráfica WebGL',
      'Interfaz Fluent Design con desenfoque de cristal Mica',
      'Acceso completo a llucStore y ecosistema de aplicaciones',
      'Gestión avanzada de ventanas en cuadrícula Snap Assist',
      'Soporte nativo de audio sintetizado 3D'
    ],
    recommendedApps: ['store', 'minecraft', 'explorer', 'code', 'browser', 'calc', 'cyber-rider'],
    theme: 'dark'
  },
  {
    id: 'gamer',
    name: 'llucOS 11 Gamer Edition',
    badge: 'Máximo Rendimiento 3D',
    tagline: 'Optimizado para juegos 3D, overclocking virtual y baja latencia.',
    description: 'Configuración de alto rendimiento para entusiastas del gaming. Viene precargado con drivers 3D Three.js de baja latencia y los juegos insignia de la llucStore.',
    defaultAccent: '#ec4899',
    recommendedRam: '32 GB DDR5 RGB',
    features: [
      'Game Mode activo por defecto: priorización de GPU y FPS',
      'Precargados los juegos 3D insignia: llucCraft 3D, CyberRider, Cosmic Defender y VoxelCraft',
      'Widget HUD de telemetría de FPS, CPU y GPU en tiempo real',
      'Efectos de sonido e iluminación RGB sincronizada',
      'Audio 3D espacial inmersivo'
    ],
    recommendedApps: ['store', 'minecraft', 'cyber-rider', 'cosmic-defender', 'solar-3d', 'neon-maze', 'player', 'taskmgr'],
    theme: 'dark'
  },
  {
    id: 'workstation',
    name: 'llucOS Workstation Ultra',
    badge: 'Desarrollo y Creación',
    tagline: 'Para desarrolladores, diseñadores gráficos y creadores de contenido.',
    description: 'Entorno de trabajo avanzado con llucCode Studio, Terminal bash interactiva, utilidades de diagnóstico del sistema y suite de creación visual.',
    defaultAccent: '#10b981',
    recommendedRam: '64 GB ECC',
    features: [
      'Terminal llucPrompt con emulación de comandos y Matrix rain',
      'Editor de código llucCode con resaltado de sintaxis',
      'Suite de dibujo y diseño llucPaint Pro con exportación PNG',
      'Monitor de procesos y memoria en tiempo real',
      'Gestor de archivos avanzado con inspector de almacenamiento'
    ],
    recommendedApps: ['store', 'code', 'terminal', 'paint', 'explorer', 'taskmgr', 'browser'],
    theme: 'dark'
  },
  {
    id: 'transparent',
    name: 'llucOS Transparent (macOS 27 Golden Gate)',
    badge: 'Edición Cristal Líquido',
    tagline: 'Interfaz translúcida ultra-pura inspirada en macOS 27 Golden Gate.',
    description: 'La máxima expresión del diseño translúcido. Cristal líquido ultra-transparente, refracción óptica, dock flotante con zoom de iconos, botones de ventana semáforo estilo macOS y el fondo oficial Sunset Golden Gate Bridge.',
    defaultAccent: '#f59e0b',
    recommendedRam: '32 GB Unified Memory',
    features: [
      'Diseño Liquid Acrylic & Glass con máxima transparencia y refracción óptica',
      'Controles de ventana tipo semáforo estilo macOS (Cerrar, Minimizar, Maximizar)',
      'Dock / Barra de tareas flotante con efecto lupa y bordes especulares de luz',
      'Fondo exclusivo "macOS 27 Golden Gate Sunset Glass"',
      'Efectos de desenfoque de 30px (extreme backdrop-blur) en ventanas y menús',
      'Integración con centro de notificaciones translúcido'
    ],
    recommendedApps: ['store', 'explorer', 'browser', 'settings', 'terminal', 'taskmgr'],
    theme: 'dark'
  }
];
