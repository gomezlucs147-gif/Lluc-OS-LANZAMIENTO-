import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '../../../utils/soundEffects';
import { Sun, Play, Pause, ZoomIn, ZoomOut, RotateCcw, Info, Compass } from 'lucide-react';

interface PlanetData {
  name: string;
  color: number;
  size: number;
  dist: number;
  speed: number;
  info: string;
  hasRings?: boolean;
}

const PLANETS: PlanetData[] = [
  { name: 'Mercurio', color: 0x94a3b8, size: 0.6, dist: 9, speed: 2.2, info: 'El planeta más cercano al Sol. Superficie rocosa con cráteres extremos.' },
  { name: 'Venus', color: 0xf59e0b, size: 0.95, dist: 13, speed: 1.6, info: 'Atmósfera densa de CO2 y temperatura media de 465°C.' },
  { name: 'Tierra', color: 0x38bdf8, size: 1.0, dist: 18, speed: 1.2, info: 'Nuestro hogar. 71% cubierto por océanos y atmósfera rica en nitrógeno y oxígeno.' },
  { name: 'Marte', color: 0xef4444, size: 0.75, dist: 23, speed: 0.95, info: 'El planeta rojo. Hogar del Monte Olimpo, el mayor volcán del sistema solar.' },
  { name: 'Júpiter', color: 0xd97706, size: 2.4, dist: 31, speed: 0.55, info: 'El gigante gaseoso más grande. Su Gran Mancha Roja es una tormenta centenaria.' },
  { name: 'Saturno', color: 0xfde047, size: 2.0, dist: 40, speed: 0.4, info: 'Famoso por su espectacular sistema de anillos formados por hielo y roca.', hasRings: true },
  { name: 'Urano', color: 0x22d3ee, size: 1.4, dist: 48, speed: 0.28, info: 'Gigante helado con rotación lateral única y vientos de hasta 900 km/h.' },
  { name: 'Neptuno', color: 0x3b82f6, size: 1.35, dist: 56, speed: 0.2, info: 'El planeta más lejano del Sistema Solar. Color azul profundo debido al metano.' },
];

export const SolarExplorer3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(PLANETS[2]); // Tierra
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  const stateRef = useRef({
    isPaused: false,
    speed: 1,
    spherical: { radius: 65, theta: Math.PI / 4, phi: Math.PI / 3 },
    isDragging: false,
    prevMouse: { x: 0, y: 0 },
    planets: [] as { mesh: THREE.Group; data: PlanetData; angle: number; bodyMesh: THREE.Mesh }[],
  });

  useEffect(() => {
    stateRef.current.isPaused = isPaused;
    stateRef.current.speed = speedMultiplier;
  }, [isPaused, speedMultiplier]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch (e) {
        return false;
      }
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02040a);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const updateCameraPos = () => {
      const sp = stateRef.current.spherical;
      camera.position.x = sp.radius * Math.sin(sp.phi) * Math.sin(sp.theta);
      camera.position.y = sp.radius * Math.cos(sp.phi);
      camera.position.z = sp.radius * Math.sin(sp.phi) * Math.cos(sp.theta);
      camera.lookAt(0, 0, 0);
    };
    updateCameraPos();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Deep starfield
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 600;
      starPositions[i + 1] = (Math.random() - 0.5) * 600;
      starPositions[i + 2] = (Math.random() - 0.5) * 600;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 1.2 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Sun in center
    const sunGeo = new THREE.SphereGeometry(3.5, 24, 24);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // Sun glow corona
    const glowGeo = new THREE.SphereGeometry(4.2, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.35,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowMesh);

    // Ambient and Sun point light
    const sunLight = new THREE.PointLight(0xffffff, 2.5, 300);
    scene.add(sunLight);
    const ambientLight = new THREE.AmbientLight(0x223344, 0.4);
    scene.add(ambientLight);

    // Create Planets and Orbit lines
    const planetEntries: { mesh: THREE.Group; data: PlanetData; angle: number; bodyMesh: THREE.Mesh }[] = [];

    PLANETS.forEach(data => {
      // Orbit Ring line
      const orbitGeo = new THREE.RingGeometry(data.dist - 0.05, data.dist + 0.05, 64);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0x1e293b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
      orbitMesh.rotation.x = Math.PI / 2;
      scene.add(orbitMesh);

      // Planet Container Group
      const pGroup = new THREE.Group();
      
      const bodyGeo = new THREE.SphereGeometry(data.size, 16, 16);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.5,
        metalness: 0.2,
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      pGroup.add(bodyMesh);

      // Saturn Rings
      if (data.hasRings) {
        const ringGeo = new THREE.RingGeometry(data.size * 1.4, data.size * 2.3, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xeab308,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const rings = new THREE.Mesh(ringGeo, ringMat);
        rings.rotation.x = Math.PI / 2.3;
        pGroup.add(rings);
      }

      // Initial angle
      const initialAngle = Math.random() * Math.PI * 2;
      pGroup.position.set(
        Math.cos(initialAngle) * data.dist,
        0,
        Math.sin(initialAngle) * data.dist
      );

      scene.add(pGroup);
      planetEntries.push({
        mesh: pGroup,
        data,
        angle: initialAngle,
        bodyMesh
      });
    });

    stateRef.current.planets = planetEntries;

    // Mouse Drag orbit controls
    const onMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDragging) return;
      const dx = e.clientX - stateRef.current.prevMouse.x;
      const dy = e.clientY - stateRef.current.prevMouse.y;
      stateRef.current.spherical.theta -= dx * 0.008;
      stateRef.current.spherical.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, stateRef.current.spherical.phi - dy * 0.008)
      );
      updateCameraPos();
      stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stateRef.current.spherical.radius = Math.max(
        15,
        Math.min(140, stateRef.current.spherical.radius + e.deltaY * 0.05)
      );
      updateCameraPos();
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation Tick
    const clock = new THREE.Clock();
    let animId = 0;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);

      if (!stateRef.current.isPaused) {
        stateRef.current.planets.forEach(p => {
          p.angle += (p.data.speed * 0.3 * stateRef.current.speed) * delta;
          p.mesh.position.x = Math.cos(p.angle) * p.data.dist;
          p.mesh.position.z = Math.sin(p.angle) * p.data.dist;
          p.bodyMesh.rotation.y += 1.2 * delta;
        });

        sunMesh.rotation.y += 0.2 * delta;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col select-none">
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Bar */}
      <div className="relative z-10 p-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-white shadow-lg pointer-events-auto">
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold">Solar Explorer 3D</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs text-slate-300 pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsPaused(prev => !prev);
              }}
              className="text-white hover:text-amber-400 font-semibold flex items-center gap-1"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5 fill-white" />}
              {isPaused ? 'Reanudar' : 'Pausar'}
            </button>
            <span>•</span>
            <span className="text-[11px] text-slate-400">Vel:</span>
            {[1, 2, 4].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeedMultiplier(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  speedMultiplier === s ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Planet Info Card */}
        {selectedPlanet && (
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-2xl text-white shadow-2xl w-64 pointer-events-auto">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-amber-300">{selectedPlanet.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">Dist: {selectedPlanet.dist * 10}M km</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
              {selectedPlanet.info}
            </p>
            <div className="text-[10px] text-slate-400 font-mono">
              Velocidad orbital: {(selectedPlanet.speed * 29.8).toFixed(1)} km/s
            </div>
          </div>
        )}
      </div>

      {/* Planet Selection Hotbar Bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 p-2 rounded-2xl flex items-center gap-1.5 shadow-2xl overflow-x-auto max-w-[95vw] scrollbar-none">
        {PLANETS.map(p => {
          const isSelected = selectedPlanet.name === p.name;
          return (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedPlanet(p);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-white/30"
                style={{ backgroundColor: `#${p.color.toString(16).padStart(6, '0')}` }}
              />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
