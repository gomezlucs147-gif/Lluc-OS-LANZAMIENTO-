import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { OS_EDITIONS } from '../../data/editions';
import { OSEditionId } from '../../types/os';
import { sounds } from '../../utils/soundEffects';
import { 
  Laptop, 
  HardDrive, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Gamepad2, 
  Code2, 
  RotateCcw,
  Palette,
  Terminal,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

const AVATARS = [
  { id: '1', name: 'Cyber Hero', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { id: '2', name: 'Pro Gamer', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80' },
  { id: '3', name: 'Hacker Neo', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  { id: '4', name: 'Synth Minimal', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
  { id: '5', name: 'Astro Pilot', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80' },
];

const ACCENTS = [
  { name: 'Azul lluc', hex: '#3b82f6' },
  { name: 'Rosa Neón Gamer', hex: '#ec4899' },
  { name: 'Esmeralda Ciber', hex: '#10b981' },
  { name: 'Violeta Aurora', hex: '#8b5cf6' },
  { name: 'Ámbar Solar', hex: '#f59e0b' },
  { name: 'Cian Cuántico', hex: '#06b6d4' },
];

export const InstallerWizard: React.FC = () => {
  const { startInstallation, completeInstallation, osState } = useOS();

  // Wizard Steps: 1: Language/Welcome, 2: Version Choice, 3: Partition/Disk, 4: Personalization, 5: Installing
  const [step, setStep] = useState<number>(1);
  const [selectedEdition, setSelectedEdition] = useState<OSEditionId>('pro');
  const [username, setUsername] = useState<string>('Lluc');
  const [avatar, setAvatar] = useState<string>(AVATARS[0].url);
  const [pin, setPin] = useState<string>('');
  const [accentColor, setAccentColor] = useState<string>('#3b82f6');
  const [diskFormatted, setDiskFormatted] = useState<boolean>(true);

  // Installation Progress simulation
  const [progress, setProgress] = useState<number>(0);
  const [currentActionText, setCurrentActionText] = useState<string>('Preparando archivos de instalación...');

  useEffect(() => {
    if (osState === 'installing') {
      let currentP = 0;
      const interval = setInterval(() => {
        currentP += Math.floor(Math.random() * 8) + 4;
        if (currentP >= 100) {
          currentP = 100;
          clearInterval(interval);
          setProgress(100);
          setCurrentActionText('¡Instalación completada! Iniciando llucOS...');
          sounds.playStartup();
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 }
          });
          setTimeout(() => {
            completeInstallation();
          }, 1800);
        } else {
          setProgress(currentP);
          if (currentP < 25) {
            setCurrentActionText('Copiando archivos del núcleo llucKernel v2.4...');
          } else if (currentP < 50) {
            setCurrentActionText('Instalando controladores 3D WebGL y motor Three.js...');
          } else if (currentP < 75) {
            setCurrentActionText('Configurando llucStore y repositorio de aplicaciones...');
          } else if (currentP < 90) {
            setCurrentActionText(`Personalizando entorno para ${username}...`);
          } else {
            setCurrentActionText('Optimizando rendimiento y registrando componentes...');
          }
        }
      }, 250);

      return () => clearInterval(interval);
    }
  }, [osState, username]);

  const handleNext = () => {
    sounds.playClick();
    if (step < 4) {
      setStep(prev => prev + 1);
    } else if (step === 4) {
      // Start real installation
      startInstallation({
        editionId: selectedEdition,
        username,
        avatar,
        pin,
        accentColor,
      });
    }
  };

  const handleBack = () => {
    sounds.playClick();
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  // If in installing phase
  if (osState === 'installing') {
    return (
      <div className="relative w-screen h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Ambient glow background */}
        <div 
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[140px] opacity-30" 
          style={{ backgroundColor: accentColor }} 
        />
        <div 
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[140px] opacity-30" 
          style={{ backgroundColor: accentColor }} 
        />

        <div className="relative z-10 w-full max-w-xl bg-slate-900/80 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
          {/* Animated llucOS Logo */}
          <div className="relative mb-6">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105"
              style={{ backgroundColor: accentColor }}
            >
              <div className="grid grid-cols-2 gap-1.5 w-10 h-10">
                <div className="bg-white/90 rounded-sm" />
                <div className="bg-white/90 rounded-sm" />
                <div className="bg-white/90 rounded-sm" />
                <div className="bg-white/90 rounded-sm" />
              </div>
            </div>
            <div className="absolute -inset-2 rounded-2xl border border-white/20 animate-ping opacity-25" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Instalando <span style={{ color: accentColor }}>llucOS</span>
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Tu ordenador se reiniciará automáticamente al completar la instalación.
          </p>

          {/* Progress bar container */}
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden mb-4 p-0.5 border border-slate-700">
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ 
                width: `${progress}%`,
                backgroundColor: accentColor
              }}
            />
          </div>

          <div className="w-full flex justify-between items-center text-xs text-slate-400 font-mono mb-8">
            <span className="truncate pr-2">{currentActionText}</span>
            <span className="font-bold text-white text-sm">{progress}%</span>
          </div>

          {/* Feature Highlight Pill Carousel */}
          <div className="w-full bg-slate-800/50 rounded-2xl border border-slate-700/40 p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-700/60 flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  ¿Sabías que llucOS incluye llucStore con juegos 3D?
                </p>
                <p className="text-[11px] text-slate-400">
                  Podrás jugar CyberRider 3D, Cosmic Defender y VoxelCraft 3D al instante con aceleración WebGL.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Windows Setup Header */}
      <header className="h-14 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
            <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
              <div className="bg-white rounded-[1px]" />
              <div className="bg-white rounded-[1px]" />
              <div className="bg-white rounded-[1px]" />
              <div className="bg-white rounded-[1px]" />
            </div>
          </div>
          <span className="font-semibold text-sm tracking-wide text-white">
            Instalador de llucOS <span className="text-blue-400 text-xs font-mono">v11.2</span>
          </span>
        </div>

        {/* Step indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className={step >= 1 ? 'text-blue-400 font-medium' : ''}>1. Idioma</span>
          <span>›</span>
          <span className={step >= 2 ? 'text-blue-400 font-medium' : ''}>2. Versión</span>
          <span>›</span>
          <span className={step >= 3 ? 'text-blue-400 font-medium' : ''}>3. Disco</span>
          <span>›</span>
          <span className={step >= 4 ? 'text-blue-400 font-medium' : ''}>4. Usuario</span>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          UEFI Secure Boot [Activado]
        </div>
      </header>

      {/* Main Setup Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center relative z-10">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl shadow-black/70 overflow-hidden flex flex-col">
          {/* STEP 1: WELCOME & LOCALE */}
          {step === 1 && (
            <div className="p-6 sm:p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
                <Laptop className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Bienvenido al Asistente de Instalación de llucOS
              </h1>
              <p className="text-slate-400 text-sm max-w-lg mb-8">
                Prepárate para experimentar una interfaz estilo Windows reinventada, con soporte para juegos 3D en tiempo real, tienda llucStore y aplicaciones nativas funcionales.
              </p>

              {/* Locale / Keyboard dropdowns */}
              <div className="w-full max-w-md space-y-4 text-left mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Idioma que se va a instalar
                  </label>
                  <select 
                    defaultValue="es-ES"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="es-ES">Español (España / Internacional)</option>
                    <option value="ca-ES">Català</option>
                    <option value="en-US">English (United States)</option>
                    <option value="fr-FR">Français</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Formato de hora y moneda
                  </label>
                  <select 
                    defaultValue="es-ES"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="es-ES">Español (España) - Formato 24h</option>
                    <option value="es-MX">Español (México / Latam)</option>
                    <option value="en-US">English (12h AM/PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Método de teclado o entrada
                  </label>
                  <select 
                    defaultValue="qwerty-es"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="qwerty-es">Español QWERTY con Ñ</option>
                    <option value="qwerty-us">US International</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl max-w-md w-full flex items-center gap-3 text-left">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-xs text-blue-200">
                  Compatibilidad 100% verificada con aceleración 3D por GPU y WebGL 2.0.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE EDITION */}
          {step === 2 && (
            <div className="p-6 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  Selecciona la Edición de llucOS
                </h2>
                <p className="text-slate-400 text-sm max-w-lg mx-auto">
                  Elige la versión que mejor se adapte a tus necesidades. Todas las versiones son compatibles con la llucStore y el menú de inicio tipo Windows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {OS_EDITIONS.map(edition => {
                  const isSelected = selectedEdition === edition.id;
                  return (
                    <div
                      key={edition.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedEdition(edition.id);
                        setAccentColor(edition.defaultAccent);
                      }}
                      className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col relative ${
                        isSelected
                          ? 'bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Check badge */}
                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle2 className="w-5 h-5 text-blue-400" />
                        </div>
                      )}

                      {/* Icon */}
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-md"
                        style={{ backgroundColor: edition.defaultAccent }}
                      >
                        {edition.id === 'pro' && <Laptop className="w-6 h-6" />}
                        {edition.id === 'gamer' && <Gamepad2 className="w-6 h-6" />}
                        {edition.id === 'workstation' && <Code2 className="w-6 h-6" />}
                        {edition.id === 'transparent' && <Sparkles className="w-6 h-6" />}
                      </div>

                      <div className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 w-fit mb-2">
                        {edition.badge}
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1">
                        {edition.name}
                      </h3>
                      <p className="text-xs text-slate-400 mb-4 flex-1">
                        {edition.tagline}
                      </p>

                      <div className="border-t border-slate-700/60 pt-3 space-y-1.5 text-[11px] text-slate-300">
                        {edition.features.slice(0, 3).map((feat, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-2 text-[10px] text-slate-400 font-mono">
                        RAM recomendada: {edition.recommendedRam}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DISK PARTITIONING */}
          {step === 3 && (
            <div className="p-6 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  ¿Dónde deseas instalar llucOS?
                </h2>
                <p className="text-slate-400 text-sm max-w-lg mx-auto">
                  Selecciona la unidad de almacenamiento virtual donde se creará la partición del sistema operativo y llucStore.
                </p>
              </div>

              {/* Disk table */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden mb-6">
                <div className="p-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-300">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-blue-400" />
                    <span>Unidad de Disco 0: NVMe SSD lluc 1024.0 GB</span>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-mono">Estado: Óptimo</span>
                </div>

                <div className="divide-y divide-slate-700/50 text-xs">
                  <div 
                    onClick={() => {
                      sounds.playClick();
                      setDiskFormatted(true);
                    }}
                    className="p-4 flex items-center justify-between bg-blue-950/30 border-l-4 border-blue-500 cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-white">Partición 1: Disco Local (C:\) - llucFS</div>
                      <div className="text-slate-400 text-[11px]">Tipo: Sistema principal y llucStore</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-white">950.0 GB</div>
                      <div className="text-[10px] text-emerald-400 font-mono">950.0 GB disponibles</div>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between text-slate-400">
                    <div>
                      <div className="font-medium text-slate-300">Partición 2: Recuperación llucOS (R:\)</div>
                      <div className="text-slate-500 text-[11px]">Tipo: Partición de arranque seguro</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-slate-300">74.0 GB</div>
                      <div className="text-[10px] text-slate-500 font-mono">Reservado</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setDiskFormatted(true);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Formatear unidad C:\
                </button>
                <div className="text-xs text-slate-400 flex items-center ml-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5" />
                  Sistema de archivos llucFS v2 preparado
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: USER PERSONALIZATION */}
          {step === 4 && (
            <div className="p-6 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  Configura tu Perfil y Estilo
                </h2>
                <p className="text-slate-400 text-sm max-w-lg mx-auto">
                  Personaliza tu nombre de usuario, avatar y el color de acento característico de llucOS.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* User & Pin */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Nombre de Usuario
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ej. Lluc"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      PIN de acceso (opcional)
                    </label>
                    <input 
                      type="password"
                      maxLength={6}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Ej. 1234"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Déjalo vacío para iniciar sesión directo sin contraseña.
                    </span>
                  </div>

                  {/* Accent Color picker */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-blue-400" />
                      Color de acento del sistema
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {ACCENTS.map(acc => (
                        <button
                          key={acc.hex}
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setAccentColor(acc.hex);
                          }}
                          className={`p-2 rounded-xl border flex items-center gap-2 text-left text-xs transition-all ${
                            accentColor === acc.hex
                              ? 'bg-slate-800 border-white ring-1 ring-white/50 text-white'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span 
                            className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: acc.hex }}
                          />
                          <span className="truncate text-[11px]">{acc.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-3">
                    Elige tu Avatar de Usuario
                  </label>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={avatar} 
                      alt="Avatar seleccionado"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500 shadow-md"
                    />
                    <div>
                      <div className="font-semibold text-white text-sm">{username || 'Usuario'}</div>
                      <div className="text-xs text-slate-400">Cuenta de Administrador Local</div>
                      <div className="text-[11px] font-mono mt-0.5" style={{ color: accentColor }}>
                        Edición: {OS_EDITIONS.find(e => e.id === selectedEdition)?.name}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {AVATARS.map(av => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setAvatar(av.url);
                        }}
                        className={`rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                          avatar === av.url ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent hover:border-slate-600'
                        }`}
                      >
                        <img src={av.url} alt={av.name} className="w-full h-12 object-cover rounded-lg" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation Bar */}
          <div className="p-4 sm:p-6 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={step === 4 ? { backgroundColor: accentColor } : {}}
              >
                <span>{step === 4 ? 'Instalar llucOS Ahora' : 'Siguiente'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
