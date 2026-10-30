import React, { useRef, useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import { Palette, Download, Trash2, Undo, Circle, Square, Minus } from 'lucide-react';

export const PaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<string>('#3b82f6');
  const [brushSize, setBrushSize] = useState<number>(6);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'rect' | 'circle'>('brush');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  const colors = [
    '#ffffff', '#000000', '#ef4444', '#f97316', '#facc15',
    '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill initial white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPoint({ x, y });

    const ctx = canvas.getContext('2d');
    if (ctx && tool === 'brush') {
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'brush') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    setLastPoint({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const exportPNG = () => {
    sounds.playSuccess();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `llucPaint_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Paint Tools Bar */}
      <div className="p-2.5 bg-slate-800 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          {/* Tool buttons */}
          <button
            type="button"
            onClick={() => setTool('brush')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              tool === 'brush' ? 'bg-blue-600 text-white' : 'bg-slate-700/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Pincel
          </button>
          <button
            type="button"
            onClick={() => setTool('eraser')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              tool === 'eraser' ? 'bg-blue-600 text-white' : 'bg-slate-700/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Borrador
          </button>

          {/* Size slider */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
            <span className="text-[11px] text-slate-400">Grosor:</span>
            <input
              type="range"
              min={2}
              max={32}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1.5">
          {colors.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => {
                sounds.playClick();
                setColor(c);
                setTool('brush');
              }}
              className={`w-6 h-6 rounded-lg border-2 transition-transform ${
                color === c && tool === 'brush' ? 'border-white scale-110 shadow-md' : 'border-slate-700 hover:scale-105'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCanvas}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/60 rounded-xl transition-colors"
            title="Limpiar lienzo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={exportPNG}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar PNG
          </button>
        </div>
      </div>

      {/* Drawing Canvas Area */}
      <div className="flex-1 bg-slate-950 p-4 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={520}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-white rounded-xl shadow-2xl cursor-crosshair max-w-full max-h-full"
        />
      </div>
    </div>
  );
};
