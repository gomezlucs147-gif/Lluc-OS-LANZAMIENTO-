import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { sounds } from '../../utils/soundEffects';
import { Save, FileCode, Check, Copy, RotateCcw } from 'lucide-react';

export const NotepadApp: React.FC<{ customData?: any }> = ({ customData }) => {
  const { virtualFiles, updateVirtualFile, addVirtualFile } = useOS();
  const [content, setContent] = useState<string>(() => {
    if (customData?.content) return customData.content;
    const defaultFile = virtualFiles.find(f => f.name === 'Bienvenida_a_llucOS.txt');
    return defaultFile ? defaultFile.content || '' : '¡Escribe aquí tus notas o código en llucOS!';
  });
  const [fileName, setFileName] = useState<string>(() => {
    return customData?.fileName || 'documento_sin_titulo.txt';
  });
  const [isSaved, setIsSaved] = useState<boolean>(true);

  useEffect(() => {
    if (customData?.content) {
      setContent(customData.content);
      setFileName(customData.fileName || 'archivo.txt');
      setIsSaved(true);
    }
  }, [customData]);

  const handleSave = () => {
    sounds.playNotification();
    if (customData?.fileId) {
      updateVirtualFile(customData.fileId, content);
    } else {
      addVirtualFile({
        name: fileName,
        path: `C:/Documentos/${fileName}`,
        type: 'file',
        extension: 'txt',
        sizeKB: Math.max(1, Math.round(content.length / 1024)),
        content
      });
    }
    setIsSaved(true);
  };

  const lineCount = content.split('\n').length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Menu Bar */}
      <div className="p-2.5 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <input
            type="text"
            value={fileName}
            onChange={(e) => {
              setFileName(e.target.value);
              setIsSaved(false);
            }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono w-48"
          />
          {!isSaved && <span className="text-[11px] text-amber-400 font-semibold">• Modificado</span>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Guardar en Disco (C:\)
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 flex overflow-hidden font-mono text-xs">
        {/* Line Numbers Column */}
        <div className="w-10 bg-slate-950/60 border-r border-slate-800 py-3 text-right pr-2 text-slate-500 select-none overflow-hidden">
          {Array.from({ length: Math.max(lineCount, 20) }).map((_, i) => (
            <div key={i} className="leading-5 h-5">{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsSaved(false);
          }}
          className="flex-1 bg-transparent text-slate-200 p-3 outline-none resize-none leading-5 selection:bg-emerald-600/40 select-text font-mono"
          placeholder="Escribe código JavaScript, Markdown o notas aquí..."
          spellCheck={false}
        />
      </div>

      {/* Editor Status Bar */}
      <div className="h-6 bg-slate-950 px-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0">
        <div>UTF-8 • llucCode Editor v2</div>
        <div className="flex items-center gap-3">
          <span>{lineCount} líneas</span>
          <span>{wordCount} palabras</span>
          <span>{charCount} caracteres</span>
        </div>
      </div>
    </div>
  );
};
