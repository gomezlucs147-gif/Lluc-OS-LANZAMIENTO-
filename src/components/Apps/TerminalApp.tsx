import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { sounds } from '../../utils/soundEffects';
import { Terminal as TerminalIcon, Sparkles } from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'cmd' | 'output' | 'error';
  text: string;
}

export const TerminalApp: React.FC = () => {
  const { userProfile, editionId, virtualFiles, reboot } = useOS();
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init-1',
      type: 'output',
      text: 'llucOS Kernel v2.4.0-fluent (x86_64-webgl)\nEscribe "help" para ver la lista de comandos disponibles o "neofetch" para información del sistema.',
    },
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isMatrixActive, setIsMatrixActive] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Matrix rain canvas animation
  useEffect(() => {
    if (!isMatrixActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const characters = '0123456789ABCDEFLLUCOS+-*/=><%$#@';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    let animId = 0;
    const render = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isMatrixActive]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    sounds.playClick();
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newHistory: HistoryItem[] = [
      ...history,
      { id: `cmd-${Date.now()}`, type: 'cmd', text: `${userProfile.username.toLowerCase()}@llucos:~$ ${cmd}` },
    ];

    switch (command) {
      case 'help':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Comandos disponibles en llucPrompt:
  help        - Muestra esta lista de ayuda
  neofetch    - Muestra especificaciones visuales de llucOS
  matrix      - Alterna la lluvia de código Matrix digital
  dir / ls    - Lista los archivos de la unidad C:\\
  cat <arch>  - Muestra el contenido de un archivo
  cls / clear - Limpia la pantalla de la terminal
  ver         - Versión del kernel del sistema operativo
  date        - Fecha y hora actual del sistema
  echo <txt>  - Imprime texto en pantalla
  reboot      - Reinicia el sistema operativo llucOS`,
        });
        break;

      case 'neofetch':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `
    ██╗     ██╗     ██╗   ██╗ ██████╗       ${userProfile.username}@llucos
    ██║     ██║     ██║   ██║██╔════╝       -------------------------
    ██║     ██║     ██║   ██║██║            SO: llucOS 11 Pro 64-bit
    ██║     ██║     ██║   ██║██║   ███╗     Host: Navegador WebGL 2.0
    ███████╗███████╗╚██████╔╝╚██████╔╝     Kernel: 2.4.0-fluent-pbr
    ╚══════╝╚══════╝ ╚═════╝  ╚═════╝      Edición: ${editionId.toUpperCase()}
                                            CPU: Virtual Core i9-14900KS @ 6.0 GHz
                                            Memoria: 32768 MB DDR5
                                            GPU: Three.js PBR Engine
                                            Archivos: ${virtualFiles.length} en C:\\
          `,
        });
        break;

      case 'matrix':
        setIsMatrixActive(prev => !prev);
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: isMatrixActive ? 'Modo Matrix desactivado.' : 'Modo Matrix activado. Escribe "matrix" para salir.',
        });
        break;

      case 'dir':
      case 'ls':
        const fileList = virtualFiles.map(f => `  ${f.extension ? `[${f.extension.toUpperCase()}]` : '[DIR]'} ${f.name.padEnd(28)} ${f.sizeKB} KB`).join('\n');
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Directorio de C:\\Documentos:\n${fileList}`,
        });
        break;

      case 'cat':
        if (!args[0]) {
          newHistory.push({ id: `err-${Date.now()}`, type: 'error', text: 'Uso: cat <nombre_archivo>' });
        } else {
          const found = virtualFiles.find(f => f.name.toLowerCase() === args[0].toLowerCase());
          if (found) {
            newHistory.push({ id: `out-${Date.now()}`, type: 'output', text: found.content || '(Archivo vacío)' });
          } else {
            newHistory.push({ id: `err-${Date.now()}`, type: 'error', text: `Archivo no encontrado: ${args[0]}` });
          }
        }
        break;

      case 'cls':
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'ver':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'llucOS [Versión 11.2.26100.1742] (c) 2026 lluc Corporation. Todos los derechos reservados.',
        });
        break;

      case 'date':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: new Date().toString(),
        });
        break;

      case 'echo':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: args.join(' '),
        });
        break;

      case 'reboot':
        newHistory.push({ id: `out-${Date.now()}`, type: 'output', text: 'Reiniciando el sistema operativo...' });
        setHistory(newHistory);
        setTimeout(() => reboot(), 800);
        return;

      default:
        newHistory.push({
          id: `err-${Date.now()}`,
          type: 'error',
          text: `El comando "${command}" no se reconoce. Escribe "help" para ver los comandos válidos.`,
        });
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div className="relative w-full h-full bg-slate-950 text-emerald-400 font-mono text-xs flex flex-col overflow-hidden select-text">
      {/* Matrix background canvas if active */}
      {isMatrixActive && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" />
      )}

      {/* Terminal Title Header */}
      <div className="p-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px] flex items-center justify-between z-10 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Símbolo del sistema - llucPrompt</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          Escribe "matrix" para lluvia de código
        </div>
      </div>

      {/* Terminal Output Body */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 z-10">
        {history.map(item => (
          <div key={item.id} className="whitespace-pre-wrap leading-relaxed">
            {item.type === 'cmd' && (
              <span className="text-white font-semibold">{item.text}</span>
            )}
            {item.type === 'output' && (
              <span className="text-emerald-300">{item.text}</span>
            )}
            {item.type === 'error' && (
              <span className="text-rose-400">{item.text}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Prompt Input Line */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand(inputVal);
        }}
        className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 z-10 select-none"
      >
        <span className="text-white font-semibold shrink-0">
          {userProfile.username.toLowerCase()}@llucos:~$
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-emerald-300 font-mono text-xs"
        />
      </form>
    </div>
  );
};
