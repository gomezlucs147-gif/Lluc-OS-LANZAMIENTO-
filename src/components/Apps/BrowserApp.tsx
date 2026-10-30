import React, { useState } from 'react';
import { sounds } from '../../utils/soundEffects';
import { useOS } from '../../context/OSContext';
import { TECH_NEWS_ARTICLES, TechNewsArticle } from '../../data/techNews';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Search, 
  Globe, 
  Home, 
  Bookmark, 
  ExternalLink,
  Sparkles,
  Gamepad2,
  Cpu,
  Layers,
  Plus,
  X,
  Play,
  ThumbsUp,
  Share2,
  BookOpen,
  Code2,
  Newspaper,
  ShieldCheck,
  Check,
  Flame,
  ArrowUpRight,
  Clock,
  RefreshCw,
  Tag
} from 'lucide-react';

interface BrowserTab {
  id: string;
  title: string;
  url: string;
}

export const BrowserApp: React.FC = () => {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    { id: 'tab-1', title: 'Portal llucOS', url: 'https://inicio.llucos.net' },
    { id: 'tab-2', title: 'VideoTube 3D', url: 'https://videotube.llucos.net' },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [inputUrl, setInputUrl] = useState<string>('https://inicio.llucos.net');
  const [history, setHistory] = useState<string[]>(['https://inicio.llucos.net']);
  const [historyIdx, setHistoryIdx] = useState<number>(0);

  // OS context actions
  const { upgradeToTransparentEdition, openApp } = useOS();

  // Search Engine query
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideoId, setActiveVideoId] = useState<string>('v1');
  const [videoLiked, setVideoLiked] = useState<boolean>(false);
  const [wikiArticle, setWikiArticle] = useState<string>('llucos');

  // Tech News 24/7 State
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<TechNewsArticle | null>(null);
  const [newsCategory, setNewsCategory] = useState<string>('all');
  const [newsSearch, setNewsSearch] = useState<string>('');
  const [newsLastSync, setNewsLastSync] = useState<string>('Ahora mismo');
  const [isRefreshingNews, setIsRefreshingNews] = useState<boolean>(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const url = activeTab.url;

  const bookmarks = [
    { name: 'Inicio', url: 'https://inicio.llucos.net', icon: Home },
    { name: 'llucSearch', url: 'https://buscar.llucsearch.net', icon: Search },
    { name: 'VideoTube', url: 'https://videotube.llucos.net', icon: Play },
    { name: 'llucPedia (Wiki)', url: 'https://es.wikipedia.org', icon: BookOpen },
    { name: 'Noticias Tech', url: 'https://noticias.tech.llucos', icon: Newspaper },
    { name: 'Comunidad 3D', url: 'https://games.llucos.net', icon: Gamepad2 },
    { name: 'llucGit Hub', url: 'https://git.llucos.net', icon: Code2 },
  ];

  const navigateTo = (targetUrl: string, title?: string) => {
    sounds.playClick();
    setInputUrl(targetUrl);
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        return {
          ...t,
          url: targetUrl,
          title: title || (targetUrl.includes('buscar') ? 'llucSearch' : targetUrl.includes('videotube') ? 'VideoTube' : targetUrl.includes('wikipedia') ? 'llucPedia' : targetUrl.includes('noticias') ? 'Noticias Tech' : targetUrl.includes('games') ? 'Comunidad 3D' : targetUrl.includes('git') ? 'llucGit Hub' : 'Página Web')
        };
      }
      return t;
    }));

    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(targetUrl);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIdx > 0) {
      sounds.playClick();
      const prev = historyIdx - 1;
      setHistoryIdx(prev);
      const prevUrl = history[prev];
      setInputUrl(prevUrl);
      setTabs(prevTabs => prevTabs.map(t => t.id === activeTabId ? { ...t, url: prevUrl } : t));
    }
  };

  const handleForward = () => {
    if (historyIdx < history.length - 1) {
      sounds.playClick();
      const next = historyIdx + 1;
      setHistoryIdx(next);
      const nextUrl = history[next];
      setInputUrl(nextUrl);
      setTabs(prevTabs => prevTabs.map(t => t.id === activeTabId ? { ...t, url: nextUrl } : t));
    }
  };

  const addNewTab = () => {
    sounds.playClick();
    const newId = `tab-${Date.now()}`;
    setTabs(prev => [
      ...prev,
      { id: newId, title: 'Nueva Pestaña', url: 'https://inicio.llucos.net' }
    ]);
    setActiveTabId(newId);
    setInputUrl('https://inicio.llucos.net');
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    if (tabs.length === 1) return;
    const remaining = tabs.filter(t => t.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      setActiveTabId(remaining[remaining.length - 1].id);
      setInputUrl(remaining[remaining.length - 1].url);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigateTo(`https://buscar.llucsearch.net?q=${encodeURIComponent(searchQuery)}`, `Búsqueda: ${searchQuery}`);
  };

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Browser Tab Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-2 pt-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTabId(tab.id);
                setInputUrl(tab.url);
              }}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs max-w-xs cursor-pointer border-t border-x transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white font-medium border-slate-700/80'
                  : 'bg-slate-950/40 text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate max-w-[130px]">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => closeTab(tab.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-slate-800 p-0.5 rounded text-slate-400 hover:text-white transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={addNewTab}
          title="Nueva Pestaña"
          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation & Address Bar Toolbar */}
      <div className="p-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
        <div className="flex items-center gap-1 text-slate-400">
          <button 
            type="button" 
            disabled={historyIdx === 0}
            onClick={handleBack}
            className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-white transition-colors disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            disabled={historyIdx >= history.length - 1}
            onClick={handleForward}
            className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-white transition-colors disabled:opacity-30"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            onClick={() => navigateTo(url)}
            className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-white transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            onClick={() => navigateTo('https://inicio.llucos.net')}
            className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigateTo(inputUrl);
          }}
          className="flex-1 relative"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-2" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </form>
      </div>

      {/* Bookmarks Bar */}
      <div className="px-3 py-1 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400 scrollbar-none">
        <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Marcadores:</span>
        {bookmarks.map(b => {
          const Icon = b.icon;
          return (
            <button
              key={b.url}
              type="button"
              onClick={() => navigateTo(b.url, b.name)}
              className={`px-2.5 py-0.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1.5 shrink-0 ${
                url.startsWith(b.url) ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30' : ''
              }`}
            >
              <Icon className="w-3 h-3 text-slate-400" />
              <span>{b.name}</span>
            </button>
          );
        })}
      </div>

      {/* Web Page Viewport */}
      <div className="flex-1 overflow-y-auto bg-slate-900 p-6 select-text">
        {/* 1. PORTAL DE INICIO */}
        {url === 'https://inicio.llucos.net' && (
          <div className="max-w-3xl mx-auto space-y-6 pt-2 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <Globe className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Portal Oficial llucEdge</h2>
              <p className="text-xs text-slate-400">Navega por la red descentralizada de llucOS con seguridad integrada.</p>
            </div>

            {/* Google-style search bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en llucSearch o escribir una dirección web..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-11 pr-24 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
              >
                Buscar
              </button>
            </form>

            {/* Popular portals quick tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left">
              {[
                { name: 'VideoTube 3D', desc: 'Videos y trailers 3D', url: 'https://videotube.llucos.net', icon: Play, color: '#ef4444' },
                { name: 'llucPedia', desc: 'Enciclopedia libre', url: 'https://es.wikipedia.org', icon: BookOpen, color: '#38bdf8' },
                { name: 'Noticias Tech', desc: 'Actualidad y hardware', url: 'https://noticias.tech.llucos', icon: Newspaper, color: '#ec4899' },
                { name: 'llucGit Hub', desc: 'Repositorios y código', url: 'https://git.llucos.net', icon: Code2, color: '#10b981' },
              ].map((site, i) => {
                const Icon = site.icon;
                return (
                  <div
                    key={i}
                    onClick={() => navigateTo(site.url, site.name)}
                    className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white mb-2 shadow-sm"
                      style={{ backgroundColor: site.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white">{site.name}</div>
                    <div className="text-[10px] text-slate-400">{site.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. VIDEOTUBE */}
        {url.startsWith('https://videotube.llucos.net') && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-500 font-extrabold text-base">
                <Play className="w-5 h-5 fill-rose-500" />
                <span>VideoTube 3D</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">1080p 60 FPS HDR</span>
            </div>

            {/* Video Player Mock */}
            <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative aspect-video flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 via-purple-950/40 to-slate-900">
              <div className="w-20 h-20 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 cursor-pointer transition-transform">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/60">
                <div className="font-semibold text-white truncate pr-2">
                  {activeVideoId === 'v1' && 'CyberRider 3D: High-Speed Neon Velocity Gameplay [60 FPS]'}
                  {activeVideoId === 'v2' && 'Explorando el Sistema Solar en 3D con Three.js en llucOS'}
                  {activeVideoId === 'v3' && 'Synthwave Chill Beats - Música Lo-Fi para programar'}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setVideoLiked(prev => !prev);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs ${
                      videoLiked ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{videoLiked ? '12.4K' : '12.3K'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Video Suggestions Grid */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-300">Videos Recomendados</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'v1', title: 'CyberRider 3D: Neon Velocity Gameplay', channel: 'lluc Gaming', views: '240K vistas' },
                  { id: 'v2', title: 'Explorando el Sistema Solar en 3D', channel: 'AstroSim', views: '180K vistas' },
                  { id: 'v3', title: 'Synthwave Chill Beats Lo-Fi', channel: 'lluc Music', views: '520K vistas' },
                ].map(v => (
                  <div
                    key={v.id}
                    onClick={() => {
                      sounds.playClick();
                      setActiveVideoId(v.id);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      activeVideoId === v.id
                        ? 'bg-rose-500/10 border-rose-500 ring-1 ring-rose-500/40'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-full h-24 rounded-xl bg-slate-900 border border-slate-700/50 mb-2 flex items-center justify-center text-slate-500">
                      <Play className="w-6 h-6 text-rose-500" />
                    </div>
                    <div className="text-xs font-bold text-white truncate">{v.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{v.channel} • {v.views}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. WIKIPEDIA / LLUCPEDIA */}
        {url.startsWith('https://es.wikipedia.org') && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <span className="font-bold text-base text-white">llucPedia — La Enciclopedia Libre</span>
              </div>
              <span className="text-[11px] text-slate-400">Edición en Español</span>
            </div>

            {/* Article selector pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'llucos', title: 'Sistema Operativo llucOS' },
                { id: 'threejs', title: 'Three.js y Gráficos 3D' },
                { id: 'kernel', title: 'Arquitectura de Kernel' },
                { id: 'cuantica', title: 'Computación Cuántica' },
              ].map(art => (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setWikiArticle(art.id);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    wikiArticle === art.id
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {art.title}
                </button>
              ))}
            </div>

            {/* Article Content */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 space-y-4">
              {wikiArticle === 'llucos' && (
                <>
                  <h1 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
                    llucOS
                  </h1>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>llucOS</strong> es un sistema operativo web moderno de nueva generación con arquitectura basada en <em>WebGL</em> y <em>Fluent Design</em>. Combina la ergonomía y familiaridad del menú de inicio, barra de tareas y explorador de archivos con un ecosistema nativo de juegos 3D a través de la <strong>llucStore</strong>.
                  </p>
                  <h3 className="text-sm font-bold text-white pt-2">Estructura del Sistema</h3>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-5">
                    <li><strong>llucKernel:</strong> Núcleo de gestión de procesos y aceleración gráfica.</li>
                    <li><strong>llucFS:</strong> Sistema de archivos virtual con soporte para creación y anidación de carpetas.</li>
                    <li><strong>llucStore:</strong> Repositorio de aplicaciones y juegos 3D en tiempo real.</li>
                  </ul>
                </>
              )}

              {wikiArticle === 'threejs' && (
                <>
                  <h1 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
                    Three.js
                  </h1>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Three.js</strong> es una biblioteca de JavaScript multiplataforma y una interfaz de programación de aplicaciones (API) utilizada para crear y mostrar gráficos animados por computadora en 3D en un navegador web mediante WebGL.
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    En <strong>llucOS</strong>, Three.js alimenta directamente los motores gráficos de juegos como <em>CyberRider 3D</em>, <em>Cosmic Defender</em>, <em>VoxelCraft</em> y la simulación orbital <em>Solar Explorer 3D</em> sin requerir complementos externos.
                  </p>
                </>
              )}

              {wikiArticle === 'kernel' && (
                <>
                  <h1 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
                    Arquitectura de Kernel
                  </h1>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Un <strong>núcleo</strong> o <em>kernel</em> es la parte central de un sistema operativo, responsable de gestionar el acceso al hardware, la memoria y la planificación de procesos.
                  </p>
                </>
              )}

              {wikiArticle === 'cuantica' && (
                <>
                  <h1 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
                    Computación Cuántica
                  </h1>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    La computación cuántica aprovecha los principios de la mecánica cuántica como la superposición y el entrelazamiento para resolver problemas complejos a velocidades exponenciales.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* 4. NOTICIAS TECH 24/7 (Real & Functional) */}
        {url.startsWith('https://noticias.tech.llucos') && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header with live feed status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-pink-400" />
                    Noticias Tech 24/7
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    En Vivo
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Feed oficial de actualizaciones del sistema operativo llucOS, tecnología, macOS y hardware.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[11px] text-slate-400 font-mono">
                  Sincronizado: <strong className="text-slate-200">{newsLastSync}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsRefreshingNews(true);
                    setTimeout(() => {
                      setIsRefreshingNews(false);
                      setNewsLastSync('Ahora mismo');
                      sounds.playSuccess();
                    }, 600);
                  }}
                  className="p-1.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Comprobar nuevas noticias"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-pink-400 ${isRefreshingNews ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </button>
              </div>
            </div>

            {/* News Filter Categories & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                {[
                  { id: 'all', label: 'Todas' },
                  { id: 'llucos', label: 'Actualizaciones llucOS', isSpecial: true },
                  { id: 'os', label: 'macOS & Sistemas' },
                  { id: 'hardware', label: 'Hardware & 3D' },
                  { id: 'dev', label: 'Desarrollo Web' },
                  { id: 'science', label: 'Ciencia' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setNewsCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-all cursor-pointer ${
                      newsCategory === cat.id
                        ? cat.isSpecial
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-pink-500 text-white font-bold shadow-md shadow-pink-500/20'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* News Search Input */}
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={newsSearch}
                  onChange={e => setNewsSearch(e.target.value)}
                  placeholder="Buscar noticias..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* FULL ARTICLE READER MODAL (If an article is selected) */}
            {selectedNewsArticle ? (
              <div className="bg-slate-950/80 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedNewsArticle(null)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver a todas las noticias</span>
                  </button>
                  <span className="px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold border border-pink-500/30">
                    {selectedNewsArticle.categoryLabel}
                  </span>
                </div>

                {/* Article Header */}
                <div className="space-y-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {selectedNewsArticle.title}
                  </h1>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    {selectedNewsArticle.subtitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {selectedNewsArticle.date}
                    </span>
                    <span>•</span>
                    <span>{selectedNewsArticle.readTime}</span>
                    <span>•</span>
                    <span className="text-slate-300 font-semibold">{selectedNewsArticle.author} ({selectedNewsArticle.authorRole})</span>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-video max-h-72 border border-slate-800 shadow-xl">
                  <img
                    src={selectedNewsArticle.imageUrl}
                    alt={selectedNewsArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>

                {/* Article Content Paragraphs */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedNewsArticle.content.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Changelog Section if present */}
                {selectedNewsArticle.changelog && (
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Registro de Cambios y Novedades
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-200">
                      {selectedNewsArticle.changelog.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interactive Action Button (e.g. Upgrade to Transparent or Open Store) */}
                {selectedNewsArticle.actionLabel && (
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    <span className="text-xs text-slate-400">¿Quieres aplicar esta novedad en tu sistema?</span>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        if (selectedNewsArticle.actionType === 'upgrade-transparent') {
                          upgradeToTransparentEdition();
                        } else if (selectedNewsArticle.actionType === 'open-store') {
                          openApp('store');
                        } else if (selectedNewsArticle.actionType === 'open-game') {
                          openApp('minecraft');
                        }
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      <span>{selectedNewsArticle.actionLabel}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* News Article Feed Grid */
              <div className="space-y-4">
                {/* Featured / Breaking News Card */}
                {TECH_NEWS_ARTICLES.filter(a => a.isBreaking).map(breaking => (
                  <div
                    key={breaking.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedNewsArticle(breaking);
                    }}
                    className="p-5 sm:p-6 bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-900 border-2 border-amber-500/40 hover:border-amber-400 rounded-3xl space-y-3 cursor-pointer shadow-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black flex items-center gap-1.5 uppercase text-[10px] tracking-wider shadow-sm">
                        <Flame className="w-3.5 h-3.5 fill-slate-950" />
                        Novedad Destacada del Sistema
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{breaking.date}</span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {breaking.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {breaking.summary}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-amber-500/20 text-xs">
                      <span className="text-slate-400">{breaking.readTime} • {breaking.author}</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Leer actualización completa <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}

                {/* Filtered Articles List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TECH_NEWS_ARTICLES.filter(article => {
                    const matchesCat = newsCategory === 'all' || article.category === newsCategory;
                    const matchesSearch = !newsSearch.trim() ||
                      article.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
                      article.summary.toLowerCase().includes(newsSearch.toLowerCase());
                    return matchesCat && matchesSearch;
                  }).map(article => (
                    <div
                      key={article.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedNewsArticle(article);
                      }}
                      className="p-5 bg-slate-800/50 hover:bg-slate-800/90 border border-slate-700/60 hover:border-slate-600 rounded-3xl space-y-3 cursor-pointer transition-all duration-200 flex flex-col justify-between group shadow-lg"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${
                            article.isLlucOSUpdate
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-pink-500/20 text-pink-300'
                          }`}>
                            {article.categoryLabel}
                          </span>
                          <span className="text-slate-500 font-mono">{article.date.split('•')[0]}</span>
                        </div>

                        <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                          {article.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 text-[11px] text-slate-400">
                        <span>{article.readTime}</span>
                        <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:text-blue-300">
                          Leer artículo <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. LLUCGIT HUB */}
        {url.startsWith('https://git.llucos.net') && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-base text-white">llucGit / llucos-core</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Public Repository</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs space-y-2">
              <div className="text-slate-400 pb-2 border-b border-slate-800">Último commit: feat(explorer): add folder creation and subfolder navigation</div>
              <div className="divide-y divide-slate-800/60">
                <div className="py-2 flex justify-between text-slate-300">
                  <span className="text-blue-400">📁 src/components/Apps/</span>
                  <span className="text-slate-500">add new 3D games & weather app</span>
                </div>
                <div className="py-2 flex justify-between text-slate-300">
                  <span className="text-blue-400">📁 src/components/Desktop/</span>
                  <span className="text-slate-500">enhance widgets and context menu</span>
                </div>
                <div className="py-2 flex justify-between text-slate-300">
                  <span className="text-emerald-400">📄 README.md</span>
                  <span className="text-slate-500">update documentation</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. LLUCSEARCH / BUSCADOR */}
        {url.startsWith('https://buscar.llucsearch.net') && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                llucSearch
              </span>
              <div className="flex-1 text-xs text-slate-400">
                Resultados para: <strong className="text-white">"{searchQuery || 'llucOS'}"</strong>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { title: 'llucOS - Sistema Operativo Web Personalizado con Tienda y Juegos 3D', link: 'https://inicio.llucos.net', desc: 'Experimenta una interfaz de escritorio estilo Windows con asistente de instalación, explorador de archivos, llucStore y juegos en 3D acelerados.' },
                { title: 'CyberRider 3D: Velocidad de Neón en llucStore', link: 'https://games.llucos.net', desc: 'Pilota vehículos aerodeslizadores a través de autopistas futuristas. Descárgalo de forma nativa desde la tienda oficial de llucOS.' },
                { title: 'Explorador de Archivos llucFS v2: Gestión de Carpetas', link: 'https://inicio.llucos.net/docs/files', desc: 'Aprende a organizar documentos, crear carpetas anidadas y administrar unidades locales con facilidad.' }
              ].map((res, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-[11px] text-emerald-400 font-mono">{res.link}</div>
                  <h3 
                    onClick={() => navigateTo(res.link, res.title)}
                    className="text-sm font-bold text-blue-400 hover:underline cursor-pointer"
                  >
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{res.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. COMUNIDAD DE JUEGOS 3D */}
        {url.startsWith('https://games.llucos.net') && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                <Gamepad2 className="w-5 h-5" />
                <span>Portal de Juegos 3D WebGL</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">llucStore Gaming Hub</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-2">
                <div className="text-xs font-semibold text-cyan-400">Juego #1 en Tendencias</div>
                <h3 className="text-base font-bold text-white">CyberRider 3D: Neon Velocity</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Corre esquivando obstáculos láser con turbo propulsión. Optimizado para 60 FPS con texturas procedimentales.
                </p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-2">
                <div className="text-xs font-semibold text-amber-400">Nuevo Lanzamiento</div>
                <h3 className="text-base font-bold text-white">Solar Explorer 3D</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Simulación física en tiempo real de los 8 planetas del sistema solar con iluminación orbital realista.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
