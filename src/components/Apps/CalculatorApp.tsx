import React, { useState } from 'react';
import { sounds } from '../../utils/soundEffects';
import { Delete, RotateCcw } from 'lucide-react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [prevVal, setPrevVal] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [clearOnNext, setClearOnNext] = useState<boolean>(false);

  const handleNum = (num: string) => {
    sounds.playClick();
    if (display === '0' || clearOnNext) {
      setDisplay(num);
      setClearOnNext(false);
    } else {
      setDisplay(prev => prev + num);
    }
  };

  const handleOp = (operator: string) => {
    sounds.playClick();
    setOp(operator);
    setPrevVal(display);
    setClearOnNext(true);
  };

  const handleEquals = () => {
    if (!op || prevVal === null) return;
    sounds.playClick();
    const a = parseFloat(prevVal);
    const b = parseFloat(display);
    let res = 0;
    if (op === '+') res = a + b;
    if (op === '-') res = a - b;
    if (op === '×') res = a * b;
    if (op === '÷') res = b !== 0 ? a / b : 0;

    setDisplay(String(Number(res.toFixed(8))));
    setPrevVal(null);
    setOp(null);
    setClearOnNext(true);
  };

  const handleClear = () => {
    sounds.playClick();
    setDisplay('0');
    setPrevVal(null);
    setOp(null);
  };

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col p-4 select-none">
      {/* Display Screen */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-right mb-4 flex flex-col justify-end h-24">
        {prevVal && op && (
          <div className="text-xs text-slate-400 font-mono mb-1">
            {prevVal} {op}
          </div>
        )}
        <div className="text-3xl font-mono font-bold tracking-tight text-white truncate">
          {display}
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        <button
          type="button"
          onClick={handleClear}
          className="col-span-2 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl font-semibold text-xs border border-red-500/30 transition-colors"
        >
          AC (Limpiar)
        </button>
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setDisplay(prev => (parseFloat(prev) * -1).toString());
          }}
          className="py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold text-xs transition-colors"
        >
          +/-
        </button>
        <button
          type="button"
          onClick={() => handleOp('÷')}
          className="py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
        >
          ÷
        </button>

        {['7', '8', '9'].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => handleNum(n)}
            className="py-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleOp('×')}
          className="py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
        >
          ×
        </button>

        {['4', '5', '6'].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => handleNum(n)}
            className="py-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleOp('-')}
          className="py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
        >
          -
        </button>

        {['1', '2', '3'].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => handleNum(n)}
            className="py-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleOp('+')}
          className="py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
        >
          +
        </button>

        <button
          type="button"
          onClick={() => handleNum('0')}
          className="col-span-2 py-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => {
            if (!display.includes('.')) handleNum('.');
          }}
          className="py-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          .
        </button>
        <button
          type="button"
          onClick={handleEquals}
          className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
        >
          =
        </button>
      </div>
    </div>
  );
};
