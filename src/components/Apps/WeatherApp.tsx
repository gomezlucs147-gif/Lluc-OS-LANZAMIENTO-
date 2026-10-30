import React, { useState } from 'react';
import { sounds } from '../../utils/soundEffects';
import { 
  CloudSun, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Compass, 
  Search, 
  Thermometer, 
  CloudSnow, 
  Sparkles 
} from 'lucide-react';

interface CityWeather {
  city: string;
  country: string;
  temp: number;
  condition: string;
  icon: 'sun' | 'cloud' | 'rain' | 'snow';
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  forecast: { day: string; temp: number; condition: string }[];
}

const CITIES: CityWeather[] = [
  {
    city: 'Barcelona',
    country: 'España',
    temp: 22,
    condition: 'Soleado con brisa mediterránea',
    icon: 'sun',
    high: 24,
    low: 16,
    humidity: 58,
    windSpeed: 14,
    uvIndex: 6,
    forecast: [
      { day: 'Hoy', temp: 22, condition: 'Soleado' },
      { day: 'Sáb', temp: 23, condition: 'Despejado' },
      { day: 'Dom', temp: 21, condition: 'Parcialmente nublado' },
      { day: 'Lun', temp: 20, condition: 'Lluvia ligera' },
      { day: 'Mar', temp: 22, condition: 'Soleado' },
    ],
  },
  {
    city: 'Madrid',
    country: 'España',
    temp: 19,
    condition: 'Cielo despejado',
    icon: 'sun',
    high: 21,
    low: 11,
    humidity: 42,
    windSpeed: 10,
    uvIndex: 5,
    forecast: [
      { day: 'Hoy', temp: 19, condition: 'Despejado' },
      { day: 'Sáb', temp: 20, condition: 'Soleado' },
      { day: 'Dom', temp: 18, condition: 'Nublado' },
      { day: 'Lun', temp: 17, condition: 'Viento' },
      { day: 'Mar', temp: 19, condition: 'Soleado' },
    ],
  },
  {
    city: 'Tokio',
    country: 'Japón',
    temp: 17,
    condition: 'Lluvia ligera neón',
    icon: 'rain',
    high: 19,
    low: 13,
    humidity: 82,
    windSpeed: 18,
    uvIndex: 3,
    forecast: [
      { day: 'Hoy', temp: 17, condition: 'Lluvia ligera' },
      { day: 'Sáb', temp: 18, condition: 'Chubascos' },
      { day: 'Dom', temp: 21, condition: 'Parcialmente despejado' },
      { day: 'Lun', temp: 22, condition: 'Soleado' },
      { day: 'Mar', temp: 19, condition: 'Nublado' },
    ],
  },
  {
    city: 'Nueva York',
    country: 'Estados Unidos',
    temp: 14,
    condition: 'Viento otoñal',
    icon: 'cloud',
    high: 16,
    low: 9,
    humidity: 55,
    windSpeed: 24,
    uvIndex: 4,
    forecast: [
      { day: 'Hoy', temp: 14, condition: 'Viento' },
      { day: 'Sáb', temp: 15, condition: 'Nuboso' },
      { day: 'Dom', temp: 13, condition: 'Lluvia' },
      { day: 'Lun', temp: 12, condition: 'Despejado' },
      { day: 'Mar', temp: 14, condition: 'Soleado' },
    ],
  },
];

export const WeatherApp: React.FC = () => {
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0);
  const city = CITIES[selectedCityIndex];

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* City Switcher Top Bar */}
      <div className="p-3 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold text-white">llucWeather Pro</span>
        </div>

        {/* City Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {CITIES.map((c, idx) => (
            <button
              key={c.city}
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedCityIndex(idx);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedCityIndex === idx
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c.city}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Main Canvas & Data */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950">
        {/* Main Current Hero Card */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              {city.city} <span className="text-sm font-normal text-slate-400">({city.country})</span>
            </h2>
            <p className="text-xs text-blue-300 font-medium">{city.condition}</p>
            <div className="text-5xl sm:text-6xl font-light font-mono text-white pt-2">
              {city.temp}°<span className="text-2xl text-slate-400 font-sans">C</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Máx: {city.high}° • Mín: {city.low}°
            </div>
          </div>

          <div className="w-28 h-28 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
            {city.icon === 'sun' && <Sun className="w-16 h-16 animate-[spin_20s_linear_infinite]" />}
            {city.icon === 'rain' && <CloudRain className="w-16 h-16 text-cyan-400" />}
            {city.icon === 'cloud' && <CloudSun className="w-16 h-16 text-blue-300" />}
          </div>
        </div>

        {/* Metric Gauges */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-center">
            <Droplets className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
            <div className="text-[11px] text-slate-400">Humedad</div>
            <div className="text-lg font-bold font-mono text-white">{city.humidity}%</div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-center">
            <Wind className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
            <div className="text-[11px] text-slate-400">Viento</div>
            <div className="text-lg font-bold font-mono text-white">{city.windSpeed} km/h</div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-center">
            <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <div className="text-[11px] text-slate-400">Índice UV</div>
            <div className="text-lg font-bold font-mono text-white">{city.uvIndex} (Moderado)</div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div>
          <div className="text-xs font-bold text-slate-300 mb-3">Pronóstico para los Próximos Días</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {city.forecast.map((f, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-3 text-center space-y-1">
                <div className="text-xs font-semibold text-slate-300">{f.day}</div>
                <div className="text-lg font-bold font-mono text-amber-300">{f.temp}°C</div>
                <div className="text-[10px] text-slate-400 truncate">{f.condition}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
