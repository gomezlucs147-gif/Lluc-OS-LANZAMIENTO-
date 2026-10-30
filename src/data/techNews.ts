export interface TechNewsArticle {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  category: 'llucos' | 'os' | 'hardware' | 'dev' | 'science';
  categoryLabel: string;
  readTime: string;
  author: string;
  authorRole: string;
  imageUrl: string;
  isBreaking?: boolean;
  isLlucOSUpdate?: boolean;
  summary: string;
  content: string[];
  changelog?: string[];
  actionLabel?: string;
  actionType?: 'upgrade-transparent' | 'open-store' | 'open-game';
}

export const TECH_NEWS_ARTICLES: TechNewsArticle[] = [
  {
    id: 'llucos-transparent-update',
    title: 'llucOS lanza la versión Transparent inspirada en el diseño macOS 27 Golden Gate',
    subtitle: 'La nueva interfaz combina cristal líquido translúcido, dock flotante con refracción óptica y controles semáforo.',
    date: '30 de Octubre, 2026 • 18:00',
    category: 'llucos',
    categoryLabel: 'Actualización llucOS',
    readTime: '3 min de lectura',
    author: 'Equipo de Ingeniería llucOS',
    authorRole: 'Core Design & System UI',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
    isBreaking: true,
    isLlucOSUpdate: true,
    summary: 'La actualización llucOS Transparent introduce una estética completamente renovada con cristal translúcido ultra-puro, dock elevado con efecto lupa, botones de ventana tipo semáforo y el fondo oficial Sunset Golden Gate Bridge.',
    content: [
      'El equipo de llucOS ha presentado hoy de manera oficial la nueva edición **llucOS Transparent**, desarrollada con inspiración en los conceptos futuristas de **macOS 27 Golden Gate**.',
      'Esta actualización rediseña por completo la experiencia visual del usuario implementando un motor de sombreado y desenfoque extremo (*Liquid Glass / Acrylic*) que permite que los fondos y elementos de escritorio refracten la luz de forma orgánica a través de las ventanas y menús.',
      'Entre las principales novedades destaca el nuevo **Dock flotante** estilo macOS, separado del borde inferior de la pantalla, con micro-animaciones al pasar el cursor y un acabado de cristal translúcido con iluminación ambiental.',
      'Las ventanas ahora incorporan controles semáforo (rojo, amarillo y verde) en la esquina superior izquierda con retroalimentación háptica y visual, además de reflejos especulares dinámicos que reaccionan al foco de la ventana activa.'
    ],
    changelog: [
      'Nuevo tema visual "Liquid Glass & macOS 27 Golden Gate" con desenfoque de 30px.',
      'Controles de ventana tipo semáforo con iconos interactivos de cerrar, minimizar y maximizar.',
      'Dock flotante elevado con esquinas redondeadas y refracción óptica.',
      'Fondo oficial exclusivo "macOS 27 Golden Gate Sunset Glass" en ultra alta resolución.',
      'Sistema de notificaciones translúcidas de actualización de escritorio.'
    ],
    actionLabel: 'Actualizar a Transparent Ahora',
    actionType: 'upgrade-transparent'
  },
  {
    id: 'llucos-store-clean-release',
    title: 'llucOS 24H2 actualiza la llucStore: ahora los usuarios instalan sus apps a petición con 0 bloatware',
    subtitle: 'El sistema operativo adopta la política de instalación limpia bajo demanda para máxima ligereza y libertad del usuario.',
    date: '30 de Octubre, 2026 • 15:30',
    category: 'llucos',
    categoryLabel: 'Actualización llucOS',
    readTime: '2 min de lectura',
    author: 'Carles Martínez',
    authorRole: 'Arquitecto de Sistema',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    isLlucOSUpdate: true,
    summary: 'A partir de esta versión, llucOS no incluye juegos ni aplicaciones opcionales preinstaladas. El usuario puede navegar libremente por la llucStore e instalar lo que realmente necesita en un clic.',
    content: [
      'En respuesta directa a las preferencias de los usuarios, llucOS ha eliminado la preinstalación automática de juegos y utilidades accesorias.',
      'El sistema se inicia ahora únicamente con las herramientas básicas esenciales: Explorador de Archivos llucFS, Navegador llucEdge, Configuración, Terminal y llucStore.',
      'Cualquier aplicación o juego 3D puede ser descargado e instalado al instante desde la tienda oficial con un solo clic, permitiendo una desinstalación limpia y sin archivos residuales.'
    ],
    changelog: [
      'Eliminación de bloatware: inicio limpio con solo herramientas básicas.',
      'Botones de instalación interactiva con barra de progreso simulada en la llucStore.',
      'Capacidad de desinstalar cualquier juego o aplicación accesoria sin restricciones.',
      'Persistencia garantizada de aplicaciones instaladas en almacenamiento local del navegador.'
    ],
    actionLabel: 'Abrir llucStore',
    actionType: 'open-store'
  },
  {
    id: 'lluccraft-eaglercraft-3d',
    title: 'llucCraft 3D Eaglercraft Edition: Nuevo motor WebGL con texturas procedurales 16x16 y crafteo',
    subtitle: 'La experiencia sandbox web se renueva con físicas de supervivencia, rotura progresiva y mesa de fabricación.',
    date: '30 de Octubre, 2026 • 12:15',
    category: 'hardware',
    categoryLabel: 'Juegos 3D',
    readTime: '4 min de lectura',
    author: 'llucCraft Studios',
    authorRole: 'Desarrollo de Motores Voxel',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    isLlucOSUpdate: true,
    summary: 'Llega la versión definitiva de llucCraft estilo Eaglercraft 1.8.8 con menú principal de tierra, texturas pixel-art de 16x16 generadas en canvas, audio sintetizado, inventario completo y comandos de consola.',
    content: [
      'llucCraft 3D ha dado el salto hacia una fidelidad absoluta con los estándares clásicos de Minecraft y Eaglercraft.',
      'El nuevo generador de texturas procedurales dibuja pixel a pixel los bloques clásicos: césped con ribete verde colgante, madera con anillos y corteza estriada, menas de diamante con gemas cian brillantes y dinamita TNT.',
      'La minería ahora requiere mantener pulsado el clic en modo supervivencia, mostrando una animación de grietas progresivas en 5 etapas antes de soltar un ítem voxel flotante y giratorio.',
      'Pulsando la tecla E, los jugadores acceden a su inventario de 36 ranuras y a la mesa de crafteo 2x2 para fabricar palos, madera, ladrillos y mesas de trabajo.'
    ],
    changelog: [
      'Menú principal estilo Eaglercraft con splash text animado y selector de modo de juego.',
      'Generación procedural de 20 texturas pixel-art en lienzo HTML5 Canvas.',
      'Sintetizador Web Audio API: pasos, picado continuo, rotura de bloque y daño "oof".',
      'Consola de comandos interactiva con tecla T (/gamemode, /time, /give, /clear).'
    ],
    actionLabel: 'Jugar llucCraft 3D',
    actionType: 'open-game'
  },
  {
    id: 'apple-macos27-design',
    title: 'Apple anticipa los pilares de diseño de macOS 27: la era del "Liquid Glass" y la refracción activa',
    subtitle: 'El futuro del diseño de interfaces de escritorio apuesta por la transparencia física y materiales reactivos.',
    date: '29 de Octubre, 2026 • 20:45',
    category: 'os',
    categoryLabel: 'Sistemas Operativos',
    readTime: '3 min de lectura',
    author: 'Elena Vance',
    authorRole: 'Analista de UI/UX',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    summary: 'Analizamos cómo los avances en tarjetas gráficas y motores de renderizado en tiempo real han hecho viable el renderizado de interfaces de cristal líquido con desenfoque de refracción óptica sin penalizar la batería.',
    content: [
      'Durante años, las interfaces de usuario se debatieron entre el minimalismo plano (*flat design*) y el esqueumorfismo pesado. Hoy, la tendencia que domina los laboratorios de diseño es el **Liquid Glass**.',
      'A diferencia de las transparencias clásicas que simplemente reducían la opacidad, la tecnología de macOS 27 Golden Gate simula la refracción de luz a través de un panel de vidrio curvado de varios milímetros de grosor.',
      'El resultado es una interfaz que no distrae, sino que se funde armónicamente con el fondo de pantalla mientras los controles de ventana y el dock mantienen una legibilidad y contraste óptimos.'
    ]
  },
  {
    id: 'webgpu-revolution-2026',
    title: 'WebGPU y WebGL 2.0 alcanzan paridad con consolas en títulos 3D dentro del navegador',
    subtitle: 'Los motores gráficos web procesan millones de polígonos por segundo directamente sobre hardware moderno.',
    date: '28 de Octubre, 2026 • 11:20',
    category: 'hardware',
    categoryLabel: 'Hardware & 3D',
    readTime: '3 min de lectura',
    author: 'Markus Lindqvist',
    authorRole: 'Especialista en Gráficos Web',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    summary: 'La nueva generación de navegadores permite compilar shaders de sombreado directo sobre tarjetas NVIDIA y AMD, impulsando juegos como CyberRider y simulaciones astronómicas a 120 FPS estables.',
    content: [
      'El ecosistema web ha superado una barrera histórica: ya no es necesario descargar instaladores de 50 GB para disfrutar de experiencias 3D fluidas con trazado de rayos o iluminación global.',
      'Bibliotecas como Three.js y WebGPU Pipeline permiten que sistemas como llucOS ejecuten juegos con reflejos especulares, partículas físicas y audio posicional directamente en una pestaña de navegador.',
      'Esto abre la puerta a un futuro donde cualquier dispositivo con pantalla y conexión a internet puede actuar como una estación de trabajo o consola gaming de alta gama.'
    ]
  },
  {
    id: 'typescript-react-19-update',
    title: 'React 19 y TypeScript 5.8: Mejoras del 45% en renderizado concurrente y compilación instantánea',
    subtitle: 'Las nuevas herramientas eliminan la sobrecarga de dependencias y agilizan el ciclo de desarrollo.',
    date: '27 de Octubre, 2026 • 16:10',
    category: 'dev',
    categoryLabel: 'Desarrollo Web',
    readTime: '2 min de lectura',
    author: 'David Chen',
    authorRole: 'Ingeniero de Software Senior',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    summary: 'El nuevo compilador de React automatiza la memorización de componentes sin necesidad de useMemo manual, mientras TypeScript acelera el chequeo de tipos en grandes bases de código.',
    content: [
      'El desarrollo de aplicaciones web complejas como escritorios virtuales ha ganado un impulso masivo con la llegada de las versiones estables de React 19.',
      'La gestión de transiciones concurrentes permite abrir ventanas pesadas, renderizar lienzos Three.js y ejecutar simulaciones de audio sin que el hilo principal sufra caídas de cuadros (*frame drops*).',
      'En llucOS, estas optimizaciones permiten que el cambio entre aplicaciones, la gestión de ventanas flotantes y el Explorador de Archivos respondan a 60 FPS ininterrumpidos.'
    ]
  },
  {
    id: 'quantum-computing-breakthrough',
    title: 'Hito Cuántico: Procesadores superconductores superan los 1.000 cúbits lógicos con corrección de errores',
    subtitle: 'Un salto decisivo hacia la supremacía computacional aplicada a nuevos materiales y criptografía.',
    date: '26 de Octubre, 2026 • 09:00',
    category: 'science',
    categoryLabel: 'Ciencia & Cuántica',
    readTime: '4 min de lectura',
    author: 'Dra. Miriam Soler',
    authorRole: 'Física Cuántica e Investigadora',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    summary: 'Científicos logran mitigar la decoherencia cuántica manteniendo estados entrelazados durante horas, permitiendo simulaciones moleculares sin precedentes.',
    content: [
      'La computación cuántica ha alcanzado su momento más transformador de la década.',
      'Hasta ahora, los cúbits físicos sufrían perturbaciones térmicas y magnéticas que limitaban el cálculo a fracciones de segundo.',
      'El nuevo diseño entrelaza miles de cúbits físicos en paquetes lógicos inmunes al ruido ambiental, sentando las bases para diseñar fármacos personalizados y catalizadores para baterías de estado sólido.'
    ]
  }
];
