import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { WindowInstance } from '../../types/os';
import { sounds } from '../../utils/soundEffects';
import { Minus, Square, Copy, X } from 'lucide-react';

// Apps
import { LlucStoreApp } from '../Apps/LlucStoreApp';
import { CyberRider3D } from '../Apps/Games/CyberRider3D';
import { CosmicDefender3D } from '../Apps/Games/CosmicDefender3D';
import { VoxelCraft3D } from '../Apps/Games/VoxelCraft3D';
import { FileExplorerApp } from '../Apps/FileExplorerApp';
import { NotepadApp } from '../Apps/NotepadApp';
import { TerminalApp } from '../Apps/TerminalApp';
import { PlayerApp } from '../Apps/PlayerApp';
import { PaintApp } from '../Apps/PaintApp';
import { BrowserApp } from '../Apps/BrowserApp';
import { CalculatorApp } from '../Apps/CalculatorApp';
import { TaskManagerApp } from '../Apps/TaskManagerApp';
import { SettingsApp } from '../Apps/SettingsApp';
import { StickyNotesApp } from '../Apps/StickyNotesApp';
import { SolarExplorer3D } from '../Apps/Games/SolarExplorer3D';
import { NeonMaze3D } from '../Apps/Games/NeonMaze3D';
import { WeatherApp } from '../Apps/WeatherApp';
import { ClockApp } from '../Apps/ClockApp';
import { AudioStudioApp } from '../Apps/AudioStudioApp';
import { TranslateApp } from '../Apps/TranslateApp';
import { LlucCraft3D } from '../Apps/Games/LlucCraft3D';

export const WindowFrame: React.FC<{ window: WindowInstance }> = ({ window: win }) => {
  const { 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    focusWindow, 
    updateWindowPosition, 
    updateWindowSize,
    activeWindowId,
    settings,
    editionId
  } = useOS();

  const isFocused = activeWindowId === win.id;
  const isTransparent = editionId === 'transparent';
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const isResizingRef = useRef(false);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    focusWindow(win.id);
    if (win.isMaximized) return;

    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: win.position.x,
      posY: win.position.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.x;
      const dy = moveEvent.clientY - dragStartRef.current.y;
      
      const newX = Math.max(0, Math.min(window.innerWidth - 120, dragStartRef.current.posX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, dragStartRef.current.posY + dy));
      
      updateWindowPosition(win.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusWindow(win.id);
    if (win.isMaximized) return;

    isResizingRef.current = true;
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: win.size.width,
      height: win.size.height,
    };

    const handleResizeMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const dw = moveEvent.clientX - resizeStartRef.current.x;
      const dh = moveEvent.clientY - resizeStartRef.current.y;

      const newW = Math.max(340, Math.min(window.innerWidth - 20, resizeStartRef.current.width + dw));
      const newH = Math.max(260, Math.min(window.innerHeight - 80, resizeStartRef.current.height + dh));

      updateWindowSize(win.id, { width: newW, height: newH });
    };

    const handleResizeMouseUp = () => {
      isResizingRef.current = false;
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    };

    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
  };

  if (win.isMinimized) {
    return null;
  }

  // Render Inner App Component
  const renderAppContent = () => {
    switch (win.appId) {
      case 'store':
        return <LlucStoreApp />;
      case 'minecraft':
        return <LlucCraft3D />;
      case 'cyber-rider':
        return <CyberRider3D />;
      case 'cosmic-defender':
        return <CosmicDefender3D />;
      case 'voxel-craft':
        return <VoxelCraft3D />;
      case 'solar-3d':
        return <SolarExplorer3D />;
      case 'neon-maze':
        return <NeonMaze3D />;
      case 'weather':
        return <WeatherApp />;
      case 'clock':
        return <ClockApp />;
      case 'audio-studio':
        return <AudioStudioApp />;
      case 'translate':
        return <TranslateApp />;
      case 'explorer':
        return <FileExplorerApp />;
      case 'code':
        return <NotepadApp customData={win.customData} />;
      case 'paint':
        return <PaintApp />;
      case 'player':
        return <PlayerApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'browser':
        return <BrowserApp />;
      case 'calc':
        return <CalculatorApp />;
      case 'taskmgr':
        return <TaskManagerApp />;
      case 'settings':
        return <SettingsApp />;
      case 'notes':
        return <StickyNotesApp />;
      default:
        return (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-400 text-xs">
            Aplicación no disponible
          </div>
        );
    }
  };

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 48px)', // taskbar height
        zIndex: win.zIndex,
      }
    : {
        position: 'fixed',
        left: `${win.position.x}px`,
        top: `${win.position.y}px`,
        width: `${win.size.width}px`,
        height: `${win.size.height}px`,
        zIndex: win.zIndex,
      };

  return (
    <div
      style={style}
      onMouseDown={() => focusWindow(win.id)}
      className={`rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-shadow duration-200 border ${
        isFocused
          ? 'border-slate-600/90 shadow-2xl shadow-black/80 ring-1 ring-white/10'
          : 'border-slate-800 shadow-xl opacity-95'
      }`}
    >
      {/* Windows 11 Title Bar */}
      <div
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={() => maximizeWindow(win.id)}
        className="h-10 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/80 px-3 flex items-center justify-between select-none cursor-default shrink-0"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div 
            className="w-3.5 h-3.5 rounded-sm shrink-0"
            style={{ backgroundColor: settings.accentColor }}
          />
          <span className="text-xs font-semibold text-slate-200 truncate">
            {win.title}
          </span>
        </div>

        {/* Window Control Buttons (Minimize, Maximize, Close) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            title="Minimizar"
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.id);
            }}
            title={win.isMaximized ? 'Restaurar' : 'Maximizar'}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {win.isMaximized ? (
              <Copy className="w-3.5 h-3.5 rotate-180" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            title="Cerrar"
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition-colors rounded-tr-2xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* App Body */}
      <div className="flex-1 relative overflow-hidden bg-slate-950">
        {renderAppContent()}
      </div>

      {/* Resizing Handle on Bottom Right */}
      {!win.isMaximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 flex items-end justify-end p-0.5 opacity-60 hover:opacity-100"
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400" />
        </div>
      )}
    </div>
  );
};
