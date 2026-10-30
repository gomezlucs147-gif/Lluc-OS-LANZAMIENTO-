import { VirtualFile } from '../types/os';

export const INITIAL_FILES: VirtualFile[] = [
  // Root base folders
  {
    id: 'dir-docs',
    name: 'Documentos',
    path: 'C:/Documentos',
    type: 'folder',
    sizeKB: 0,
    createdAt: '2026-10-30',
  },
  {
    id: 'dir-sys',
    name: 'Sistema',
    path: 'C:/Sistema',
    type: 'folder',
    sizeKB: 0,
    createdAt: '2026-10-30',
  },
  {
    id: 'dir-dl',
    name: 'Descargas',
    path: 'C:/Descargas',
    type: 'folder',
    sizeKB: 0,
    createdAt: '2026-10-30',
  },
  {
    id: 'dir-img',
    name: 'Imagenes',
    path: 'C:/Imagenes',
    type: 'folder',
    sizeKB: 0,
    createdAt: '2026-10-30',
  },

  // Subfolders inside Documentos
  {
    id: 'dir-sub-proyectos',
    name: 'Proyectos 3D',
    path: 'C:/Documentos/Proyectos 3D',
    type: 'folder',
    sizeKB: 0,
    createdAt: '2026-10-30',
  },
  {
    id: 'dir-sub-notas',
    name: 'Mis Notas',
    path: 'C:/Documentos/Mis Notas',
    type: 'folder',
    sizeKB: 0,
    createdAt: '2026-10-30',
  },
  {
    id: 'dir-sub-wallpapers',
    name: 'Fondos Guardados',
    path: 'C:/Imagenes/Fondos Guardados',
    type: 'folder',
    sizeKB: 0,
    createdAt: '2026-10-30',
  },

  // Files in C:/Documentos
  {
    id: 'f1',
    name: 'Bienvenida_a_llucOS.txt',
    path: 'C:/Documentos/Bienvenida_a_llucOS.txt',
    type: 'file',
    extension: 'txt',
    sizeKB: 3,
    createdAt: '2026-10-30',
    content: `¡Bienvenido a llucOS!
===================================
Versión del Kernel: llucKernel v2.4 (Fluent Edition)
Arquitectura: x86_64 WebGL Accelerated

Has instalado con éxito llucOS en tu equipo virtual.
Características destacadas:
1. llucStore: Instala juegos 3D en tiempo real (CyberRider 3D, Cosmic Defender 3D, VoxelCraft 3D, Solar Explorer 3D).
2. Explorador de Archivos: Administra tus archivos del sistema y crea tus propias carpetas.
3. llucCode Studio: Editor para programadores con atajos y notas.
4. Terminal llucPrompt: Escribe 'matrix' para lluvia digital o 'neofetch' para ver especificaciones.
5. Personalización completa: Cambia el fondo, color de acento y modo oscuro en Configuración.

¡Disfruta de la experiencia llucOS!`
  },
  {
    id: 'f2',
    name: 'trucos_juegos_3d.md',
    path: 'C:/Documentos/trucos_juegos_3d.md',
    type: 'file',
    extension: 'md',
    sizeKB: 2,
    createdAt: '2026-10-30',
    content: `# Guía de Juegos 3D en llucOS

### CyberRider 3D
- Controles: Teclas A / D o Flechas Izquierda / Derecha para virar.
- Turbo Boost: Barra Espaciadora o tecla W para activar propulsores cuánticos.
- Puntos: Recolecta orbes de energía dorados (+100 pts) y esquiva torres láser rojas.

### Cosmic Defender 3D
- Controles: Mueve el ratón para apuntar. Click izquierdo para disparar láseres.
- Cuidado con la recarga de escudos.

### VoxelCraft 3D
- Modo construcción: Click izquierdo para colocar bloque del tipo seleccionado.
- Shift + Click: Romper bloque.`
  },

  // Files inside C:/Documentos/Proyectos 3D
  {
    id: 'f-p3d-1',
    name: 'configuracion_render_3d.json',
    path: 'C:/Documentos/Proyectos 3D/configuracion_render_3d.json',
    type: 'file',
    extension: 'json',
    sizeKB: 2,
    createdAt: '2026-10-30',
    content: `{
  "antialiasing": true,
  "shadows": "PCFSoftShadowMap",
  "toneMapping": "ACESFilmicToneMapping",
  "maxFps": 60,
  "engine": "Three.js r160+"
}`
  },

  // Files inside C:/Documentos/Mis Notas
  {
    id: 'f-nota-1',
    name: 'ideas_nuevas_apps.txt',
    path: 'C:/Documentos/Mis Notas/ideas_nuevas_apps.txt',
    type: 'file',
    extension: 'txt',
    sizeKB: 1,
    createdAt: '2026-10-30',
    content: `- Crear carpetas personalizadas en llucOS
- Probar el nuevo explorador solar 3D
- Visitar Wikipedia y VideoTube en llucEdge
- Probar los nuevos fondos de pantalla del Monte Fuji y Aurora boreal`
  },

  // Files in C:/Sistema
  {
    id: 'f3',
    name: 'sistema_info.json',
    path: 'C:/Sistema/sistema_info.json',
    type: 'file',
    extension: 'json',
    sizeKB: 1,
    createdAt: '2026-10-30',
    content: `{
  "os": "llucOS",
  "version": "11.2.0 (Build 24H2)",
  "arch": "WebAssembly-64",
  "gpuRenderer": "WebGL 2.0 PBR Engine",
  "author": "Lluc",
  "status": "Optimal"
}`
  },
  {
    id: 'f4',
    name: 'demo_script.js',
    path: 'C:/Documentos/demo_script.js',
    type: 'file',
    extension: 'js',
    sizeKB: 1,
    createdAt: '2026-10-30',
    content: `// Script de prueba para llucOS
console.log("Iniciando servicios de llucOS...");

function checkDrivers() {
  return {
    threeD: "Ready",
    audio: "WebAudio Synthesizer Online",
    storage: "llucFS C:/ Mounted"
  };
}

console.log(checkDrivers());`
  }
];
