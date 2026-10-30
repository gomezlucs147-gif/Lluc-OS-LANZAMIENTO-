import React, { useState } from 'react';
import { sounds } from '../../utils/soundEffects';
import { Plus, Trash2, StickyNote } from 'lucide-react';

interface Note {
  id: string;
  text: string;
  color: string;
}

const DEFAULT_NOTES: Note[] = [
  {
    id: '1',
    text: '¡Instalar Cosmic Defender 3D desde la llucStore!\nRecordar probar el modo turbo con la barra espaciadora en CyberRider.',
    color: 'bg-amber-500/20 border-amber-500/40 text-amber-100',
  },
  {
    id: '2',
    text: 'Comandos divertidos de la terminal:\n- neofetch\n- matrix (pantalla de lluvia verde)',
    color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-100',
  },
];

export const StickyNotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('llucos_sticky_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_NOTES;
  });

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    try {
      localStorage.setItem('llucos_sticky_notes', JSON.stringify(updated));
    } catch (e) {}
  };

  const addNote = () => {
    sounds.playClick();
    const colors = [
      'bg-amber-500/20 border-amber-500/40 text-amber-100',
      'bg-blue-500/20 border-blue-500/40 text-blue-100',
      'bg-pink-500/20 border-pink-500/40 text-pink-100',
      'bg-emerald-500/20 border-emerald-500/40 text-emerald-100',
    ];
    const newNotes = [
      ...notes,
      {
        id: `note-${Date.now()}`,
        text: 'Nueva nota rápida...',
        color: colors[Math.floor(Math.random() * colors.length)],
      },
    ];
    saveNotes(newNotes);
  };

  const updateNote = (id: string, text: string) => {
    const newNotes = notes.map(n => n.id === id ? { ...n, text } : n);
    saveNotes(newNotes);
  };

  const deleteNote = (id: string) => {
    sounds.playClick();
    const newNotes = notes.filter(n => n.id !== id);
    saveNotes(newNotes);
  };

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col p-4 overflow-hidden select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white">Notas Rápidas de llucOS</span>
        </div>
        <button
          type="button"
          onClick={addNote}
          className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Nueva
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pt-3 space-y-3">
        {notes.map(note => (
          <div
            key={note.id}
            className={`rounded-2xl border p-3 flex flex-col justify-between shadow-lg backdrop-blur-md ${note.color}`}
          >
            <textarea
              value={note.text}
              onChange={(e) => updateNote(note.id, e.target.value)}
              className="w-full bg-transparent border-none outline-none resize-none text-xs leading-relaxed font-sans placeholder-white/40 h-24"
              placeholder="Escribe algo..."
            />
            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => deleteNote(note.id)}
                className="text-white/60 hover:text-white transition-colors"
                title="Eliminar nota"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
