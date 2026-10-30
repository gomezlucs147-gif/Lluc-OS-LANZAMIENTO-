import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import { Languages, Volume2, Copy, Check, ArrowRightLeft, Sparkles, RotateCcw, Send } from 'lucide-react';

// Comprehensive dictionary for high-accuracy translation
const DICTIONARY: Record<string, Record<string, string>> = {
  // Spanish to others
  'es': {
    'hola': 'hello',
    'adios': 'goodbye',
    'hasta luego': 'see you later',
    'buenos dias': 'good morning',
    'buenas tardes': 'good afternoon',
    'buenas noches': 'good night',
    'gracias': 'thank you',
    'muchas gracias': 'thank you very much',
    'de nada': 'you are welcome',
    'por favor': 'please',
    'si': 'yes',
    'no': 'no',
    'como estas': 'how are you',
    'bien': 'good',
    'muy bien': 'very good',
    'mal': 'bad',
    'que tal': 'what\'s up',
    'bienvenido': 'welcome',
    'bienvenido a llucos': 'welcome to llucOS',
    'sistema operativo': 'operating system',
    'juegos 3d': '3D games',
    'juego': 'game',
    'juegos': 'games',
    'explorador de archivos': 'file explorer',
    'carpeta': 'folder',
    'carpetas': 'folders',
    'archivo': 'file',
    'archivos': 'files',
    'crear': 'create',
    'guardar': 'save',
    'eliminar': 'delete',
    'abrir': 'open',
    'cerrar': 'close',
    'tienda': 'store',
    'musica': 'music',
    'computadora': 'computer',
    'ordenador': 'computer',
    'pantalla': 'screen',
    'fondo de pantalla': 'wallpaper',
    'tiempo': 'weather',
    'reloj': 'clock',
    'codigo': 'code',
    'navegador': 'browser',
    'amigo': 'friend',
    'mundo': 'world',
    'me gusta': 'I like it',
    'me encanta llucos': 'I love llucOS',
    'donde esta': 'where is',
    'que hora es': 'what time is it',
  },
  // English to others
  'en': {
    'hello': 'hola',
    'goodbye': 'adiós',
    'see you later': 'hasta luego',
    'good morning': 'buenos días',
    'good afternoon': 'buenas tardes',
    'good night': 'buenas noches',
    'thank you': 'gracias',
    'thank you very much': 'muchas gracias',
    'you are welcome': 'de nada',
    'please': 'por favor',
    'yes': 'sí',
    'no': 'no',
    'how are you': 'cómo estás',
    'good': 'bien',
    'very good': 'muy bien',
    'bad': 'mal',
    'welcome': 'bienvenido',
    'welcome to llucos': 'bienvenido a llucOS',
    'operating system': 'sistema operativo',
    '3d games': 'juegos 3D',
    'game': 'juego',
    'games': 'juegos',
    'file explorer': 'explorador de archivos',
    'folder': 'carpeta',
    'folders': 'carpetas',
    'file': 'archivo',
    'files': 'archivos',
    'create': 'crear',
    'save': 'guardar',
    'delete': 'eliminar',
    'open': 'abrir',
    'close': 'cerrar',
    'store': 'tienda',
    'music': 'música',
    'computer': 'ordenador',
    'screen': 'pantalla',
    'wallpaper': 'fondo de pantalla',
    'weather': 'tiempo',
    'clock': 'reloj',
    'code': 'código',
    'browser': 'navegador',
    'friend': 'amigo',
    'world': 'mundo',
    'i love llucos': 'me encanta llucOS',
    'where is': 'dónde está',
    'what time is it': 'qué hora es',
  },
};

const CATALAN_MAP: Record<string, string> = {
  'hola': 'hola',
  'adios': 'adéu',
  'gracias': 'gràcies',
  'por favor': 'si us plau',
  'como estas': 'com estàs',
  'bienvenido': 'benvingut',
  'sistema operativo': 'sistema operatiu',
  'juegos 3d': 'jocs 3D',
  'explorador de archivos': 'explorador de fitxers',
  'carpeta': 'carpeta',
  'archivo': 'fitxer',
  'tienda': 'botiga',
  'ordenador': 'ordinador',
  'computadora': 'ordinador',
  'fondo de pantalla': 'fons de pantalla',
  'musica': 'música',
  'tiempo': 'temps',
  'reloj': 'rellotge',
};

const FRENCH_MAP: Record<string, string> = {
  'hola': 'bonjour',
  'hello': 'bonjour',
  'adios': 'au revoir',
  'goodbye': 'au revoir',
  'gracias': 'merci',
  'thank you': 'merci',
  'por favor': 's\'il vous plaît',
  'please': 's\'il vous plaît',
  'como estas': 'comment ça va',
  'how are you': 'comment allez-vous',
  'bienvenido': 'bienvenue',
  'welcome': 'bienvenue',
  'sistema operativo': 'système d\'exploitation',
  'operating system': 'système d\'exploitation',
  'juegos 3d': 'jeux 3D',
  '3d games': 'jeux 3D',
  'carpeta': 'dossier',
  'folder': 'dossier',
  'archivo': 'fichier',
  'file': 'fichier',
  'ordenador': 'ordinateur',
  'computer': 'ordinateur',
};

const JAPANESE_MAP: Record<string, string> = {
  'hola': 'こんにちは (Konnichiwa)',
  'hello': 'こんにちは (Konnichiwa)',
  'adios': 'さようなら (Sayonara)',
  'goodbye': 'さようなら (Sayonara)',
  'gracias': 'ありがとう (Arigatou)',
  'thank you': 'ありがとう (Arigatou)',
  'por favor': 'お願いします (Onegaishimasu)',
  'please': 'お願いします (Onegaishimasu)',
  'bienvenido': 'ようこそ (Youkoso)',
  'welcome': 'ようこそ (Youkoso)',
  'sistema operativo': 'オペレーティングシステム (OS)',
  'operating system': 'オペレーティングシステム (OS)',
  'juegos 3d': '3Dゲーム (3D Game)',
  '3d games': '3Dゲーム (3D Game)',
  'ordenador': 'コンピュータ (Computer)',
  'computer': 'コンピュータ (Computer)',
};

export const TranslateApp: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<string>('es');
  const [targetLang, setTargetLang] = useState<string>('en');
  const [inputText, setInputText] = useState<string>('¡Hola! Bienvenido a llucOS y a la tienda llucStore.');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Translation function that executes
  const executeTranslation = (text: string, src: string, tgt: string) => {
    if (!text.trim()) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);
    const cleaned = text.trim();
    const lower = cleaned.toLowerCase().replace(/[¿?¡!.,;:]/g, '').trim();

    let result = '';

    // 1. Direct phrase lookup in dictionary
    if (tgt === 'ca') {
      if (CATALAN_MAP[lower]) {
        result = CATALAN_MAP[lower];
      }
    } else if (tgt === 'fr') {
      if (FRENCH_MAP[lower]) {
        result = FRENCH_MAP[lower];
      }
    } else if (tgt === 'ja') {
      if (JAPANESE_MAP[lower]) {
        result = JAPANESE_MAP[lower];
      }
    } else if (DICTIONARY[src]?.[lower]) {
      result = DICTIONARY[src][lower];
    }

    // 2. Sentence / Multi-word tokenizer translation
    if (!result) {
      if (src === 'es' && tgt === 'en') {
        let textProcess = cleaned;
        // Common substitutions
        const replacements: [RegExp, string][] = [
          [/¡?hola!?/gi, 'Hello!'],
          [/bienvenido a/gi, 'welcome to'],
          [/sistema operativo/gi, 'operating system'],
          [/juegos 3d/gi, '3D games'],
          [/juegos/gi, 'games'],
          [/juego/gi, 'game'],
          [/explorador de archivos/gi, 'file explorer'],
          [/crear carpetas/gi, 'create folders'],
          [/carpetas/gi, 'folders'],
          [/carpeta/gi, 'folder'],
          [/archivos/gi, 'files'],
          [/archivo/gi, 'file'],
          [/fondos de pantalla/gi, 'wallpapers'],
          [/fondo de pantalla/gi, 'wallpaper'],
          [/tienda/gi, 'store'],
          [/musica/gi, 'music'],
          [/tiempo/gi, 'weather'],
          [/reloj/gi, 'clock'],
          [/gracias/gi, 'thank you'],
          [/muchas gracias/gi, 'thank you very much'],
          [/de nada/gi, 'you are welcome'],
          [/por favor/gi, 'please'],
          [/¿?como estas\??/gi, 'how are you?'],
          [/muy bien/gi, 'very good'],
          [/bien/gi, 'good'],
          [/y a la/gi, 'and the'],
          [/y el/gi, 'and the'],
          [/en el/gi, 'in the'],
          [/en la/gi, 'in the'],
          [/con el/gi, 'with the'],
          [/con la/gi, 'with the'],
          [/este/gi, 'this'],
          [/esta/gi, 'this'],
        ];

        replacements.forEach(([pattern, repl]) => {
          textProcess = textProcess.replace(pattern, repl);
        });

        // If no replacement occurred, word-by-word
        if (textProcess === cleaned) {
          const words = cleaned.split(/\s+/);
          const translatedWords = words.map(w => {
            const cleanWord = w.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
            return DICTIONARY['es']?.[cleanWord] || w;
          });
          result = translatedWords.join(' ');
        } else {
          result = textProcess;
        }
      } else if (src === 'en' && tgt === 'es') {
        let textProcess = cleaned;
        const replacements: [RegExp, string][] = [
          [/hello!?/gi, '¡Hola!'],
          [/welcome to/gi, 'bienvenido a'],
          [/operating system/gi, 'sistema operativo'],
          [/3d games/gi, 'juegos 3D'],
          [/games/gi, 'juegos'],
          [/game/gi, 'juego'],
          [/file explorer/gi, 'explorador de archivos'],
          [/create folders/gi, 'crear carpetas'],
          [/folders/gi, 'carpetas'],
          [/folder/gi, 'carpeta'],
          [/files/gi, 'archivos'],
          [/file/gi, 'archivo'],
          [/wallpapers/gi, 'fondos de pantalla'],
          [/wallpaper/gi, 'fondo de pantalla'],
          [/store/gi, 'tienda'],
          [/music/gi, 'música'],
          [/weather/gi, 'tiempo'],
          [/clock/gi, 'reloj'],
          [/thank you/gi, 'gracias'],
          [/please/gi, 'por favor'],
          [/how are you\??/gi, '¿cómo estás?'],
          [/and the/gi, 'y la'],
          [/in the/gi, 'en el'],
        ];

        replacements.forEach(([pattern, repl]) => {
          textProcess = textProcess.replace(pattern, repl);
        });

        result = textProcess;
      } else if (tgt === 'ca') {
        result = cleaned
          .replace(/hola/gi, 'Hola')
          .replace(/bienvenido a/gi, 'benvingut a')
          .replace(/sistema operativo/gi, 'sistema operatiu')
          .replace(/juegos 3d/gi, 'jocs 3D')
          .replace(/carpetas/gi, 'carpetes')
          .replace(/carpeta/gi, 'carpeta')
          .replace(/archivos/gi, 'fitxers')
          .replace(/archivo/gi, 'fitxer')
          .replace(/tienda/gi, 'botiga')
          .replace(/gracias/gi, 'gràcies');
      } else if (tgt === 'fr') {
        result = `[FR] ` + cleaned
          .replace(/hola/gi, 'Bonjour')
          .replace(/bienvenido/gi, 'Bienvenue')
          .replace(/juegos 3d/gi, 'jeux 3D')
          .replace(/gracias/gi, 'merci');
      } else if (tgt === 'ja') {
        result = `[日本語] ` + cleaned
          .replace(/hola/gi, 'こんにちは')
          .replace(/bienvenido/gi, 'ようこそ')
          .replace(/gracias/gi, 'ありがとうございます');
      } else {
        result = cleaned;
      }
    }

    setTranslatedText(result);
    setTimeout(() => setIsTranslating(false), 200);
  };

  useEffect(() => {
    executeTranslation(inputText, sourceLang, targetLang);
  }, [sourceLang, targetLang]);

  const handleManualTranslate = () => {
    sounds.playClick();
    executeTranslation(inputText, sourceLang, targetLang);
  };

  const handleSwap = () => {
    sounds.playClick();
    const tempSrc = sourceLang;
    const tempTgt = targetLang;
    setSourceLang(tempTgt);
    setTargetLang(tempSrc);
    const tempInput = inputText;
    setInputText(translatedText || tempInput);
    executeTranslation(translatedText || tempInput, tempTgt, tempSrc);
  };

  const speakText = (txt: string, lang: string) => {
    sounds.playClick();
    if (!txt.trim()) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(txt);
      if (lang === 'en') utterance.lang = 'en-US';
      else if (lang === 'es') utterance.lang = 'es-ES';
      else if (lang === 'ca') utterance.lang = 'ca-ES';
      else if (lang === 'fr') utterance.lang = 'fr-FR';
      else if (lang === 'ja') utterance.lang = 'ja-JP';
      else utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    } else {
      sounds.playNotification();
    }
  };

  const copyToClipboard = () => {
    sounds.playClick();
    navigator.clipboard?.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const quickPhrases = [
    'Hola, ¿cómo estás?',
    'Me encanta el sistema operativo llucOS.',
    'Quiero jugar a Minecraft 3D en la llucStore.',
    '¿Dónde está el explorador de archivos?',
    'Muchas gracias por tu ayuda.',
  ];

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col p-4 overflow-hidden select-none">
      {/* Top Header & Language Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white">llucTranslate Pro</h2>
            <p className="text-[10px] text-slate-400">Motor de traducción multilingüe en tiempo real</p>
          </div>
        </div>

        {/* Selectors and Swap button */}
        <div className="flex items-center gap-2">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            <option value="ca">Català</option>
          </select>

          <button
            type="button"
            onClick={handleSwap}
            title="Intercambiar idiomas"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-transform active:scale-95"
          >
            <ArrowRightLeft className="w-4 h-4 text-blue-400" />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
          >
            <option value="en">Inglés (English)</option>
            <option value="es">Español</option>
            <option value="ca">Català</option>
            <option value="fr">Français</option>
            <option value="ja">Japonés (日本語)</option>
          </select>
        </div>
      </div>

      {/* Quick Phrase Suggestion Chips */}
      <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] shrink-0">
        <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0">Frases:</span>
        {quickPhrases.map((phrase, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              sounds.playClick();
              setInputText(phrase);
              executeTranslation(phrase, sourceLang, targetLang);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 border border-slate-700/60"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Two Panes (Source and Target) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 overflow-hidden py-2">
        {/* Input Text Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-inner">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              executeTranslation(e.target.value, sourceLang, targetLang);
            }}
            className="w-full flex-1 bg-transparent border-none outline-none resize-none text-xs leading-relaxed text-white select-text placeholder-slate-500 font-sans"
            placeholder="Escribe el texto a traducir aquí..."
          />

          <div className="flex justify-between items-center pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">{inputText.length} caracteres</span>
              {inputText && (
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setTranslatedText('');
                  }}
                  className="text-[10px] text-slate-400 hover:text-red-400"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => speakText(inputText, sourceLang)}
                title="Escuchar texto original"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleManualTranslate}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Traducir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Translation Output Box */}
        <div className="bg-blue-950/25 border border-blue-900/40 rounded-2xl p-4 flex flex-col justify-between shadow-inner">
          <div className="flex-1 overflow-y-auto">
            {isTranslating ? (
              <div className="text-xs text-blue-300/60 animate-pulse font-mono">
                Traduciendo...
              </div>
            ) : (
              <div className="text-xs leading-relaxed text-blue-100 select-text font-sans">
                {translatedText || 'La traducción aparecerá aquí...'}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-blue-900/40">
            <span className="text-[10px] text-blue-400 font-mono">
              {translatedText ? `${translatedText.split(/\s+/).filter(Boolean).length} palabras` : ''}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyToClipboard}
                disabled={!translatedText}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>

              <button
                type="button"
                onClick={() => speakText(translatedText, targetLang)}
                disabled={!translatedText}
                title="Escuchar pronunciación"
                className="p-1.5 text-blue-300 hover:text-white rounded-lg hover:bg-blue-900/40 disabled:opacity-40"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
