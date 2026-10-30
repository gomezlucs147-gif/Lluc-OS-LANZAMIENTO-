import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '../../../utils/soundEffects';
import { Compass, RotateCcw, Trophy, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export const NeonMaze3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Maze layout (1 = wall, 0 = path, 2 = gem, 3 = exit)
  const mazeGrid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 2, 0, 0, 0, 0, 2, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 2, 1, 0, 0, 0, 0, 2, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 2, 1, 0, 1, 1, 1, 1, 2, 1],
    [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 2, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 2, 0, 1, 0, 1, 1, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const stateRef = useRef({
    playerGridX: 1,
    playerGridY: 1,
    targetX: 1 * 4,
    targetZ: 1 * 4,
    playerMesh: null as THREE.Group | null,
    gems: new Map<string, THREE.Mesh>(),
    exitMesh: null as THREE.Mesh | null,
    score: 0,
    time: 60,
    active: true,
  });

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
    scene.background = new THREE.Color(0x050814);
    scene.fog = new THREE.FogExp2(0x050814, 0.015);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      500
    );
    camera.position.set(24, 38, 48);
    camera.lookAt(24, 0, 20);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient and neon overhead light
    const amb = new THREE.AmbientLight(0x1e1b4b, 1.2);
    scene.add(amb);
    const topLight = new THREE.DirectionalLight(0x06b6d4, 1.4);
    topLight.position.set(20, 40, 20);
    scene.add(topLight);

    // Floor Plane
    const floorGeo = new THREE.PlaneGeometry(60, 50);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.3,
      metalness: 0.8,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(24, 0, 18);
    scene.add(floorMesh);

    // Maze Grid Walls
    const wallGeo = new THREE.BoxGeometry(3.9, 2.5, 3.9);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      emissive: 0x4338ca,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.8,
    });

    const gemGeo = new THREE.OctahedronGeometry(0.7, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.9,
      roughness: 0.1,
    });

    mazeGrid.forEach((row, r) => {
      row.forEach((cell, c) => {
        const x = c * 4;
        const z = r * 4;

        if (cell === 1) {
          const wall = new THREE.Mesh(wallGeo, wallMat);
          wall.position.set(x, 1.25, z);
          scene.add(wall);
        } else if (cell === 2) {
          const gem = new THREE.Mesh(gemGeo, gemMat);
          gem.position.set(x, 1.2, z);
          scene.add(gem);
          stateRef.current.gems.set(`${c},${r}`, gem);
        } else if (cell === 3) {
          // Exit portal
          const portalGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.4, 16);
          const portalMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
          const portal = new THREE.Mesh(portalGeo, portalMat);
          portal.position.set(x, 0.2, z);
          scene.add(portal);
          stateRef.current.exitMesh = portal;
        }
      });
    });

    // Player Hero (Cyber Sphere Bot with neon halo)
    const playerGrp = new THREE.Group();
    const botGeo = new THREE.SphereGeometry(1.1, 16, 16);
    const botMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xdb2777,
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.9,
    });
    const botMesh = new THREE.Mesh(botGeo, botMat);
    playerGrp.add(botMesh);

    // Halo
    const haloGeo = new THREE.TorusGeometry(1.4, 0.1, 8, 24);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    playerGrp.add(halo);

    playerGrp.position.set(4, 1.2, 4);
    scene.add(playerGrp);
    stateRef.current.playerMesh = playerGrp;

    // Movement logic
    const move = (dx: number, dy: number) => {
      if (!stateRef.current.active) return;
      const newX = stateRef.current.playerGridX + dx;
      const newY = stateRef.current.playerGridY + dy;

      if (
        newY >= 0 &&
        newY < mazeGrid.length &&
        newX >= 0 &&
        newX < mazeGrid[0].length &&
        mazeGrid[newY][newX] !== 1
      ) {
        sounds.playClick();
        stateRef.current.playerGridX = newX;
        stateRef.current.playerGridY = newY;
        stateRef.current.targetX = newX * 4;
        stateRef.current.targetZ = newY * 4;

        // Gem pickup check
        const key = `${newX},${newY}`;
        if (stateRef.current.gems.has(key)) {
          sounds.playPickup();
          const gem = stateRef.current.gems.get(key);
          if (gem) scene.remove(gem);
          stateRef.current.gems.delete(key);
          stateRef.current.score += 150;
          setScore(stateRef.current.score);
        }

        // Exit check
        if (mazeGrid[newY][newX] === 3) {
          sounds.playSuccess();
          stateRef.current.active = false;
          setIsVictory(true);
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') move(0, -1);
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') move(0, 1);
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') move(-1, 0);
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') move(1, 0);
    };

    window.addEventListener('keydown', onKeyDown);

    // Timer countdown
    const timerInterval = setInterval(() => {
      if (stateRef.current.active) {
        stateRef.current.time -= 1;
        setTimeLeft(stateRef.current.time);
        if (stateRef.current.time <= 0) {
          stateRef.current.active = false;
          setIsGameOver(true);
        }
      }
    }, 1000);

    // Animation Tick
    const clock = new THREE.Clock();
    let animId = 0;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);

      if (playerGrp) {
        playerGrp.position.x = THREE.MathUtils.damp(playerGrp.position.x, stateRef.current.targetX, 12, delta);
        playerGrp.position.z = THREE.MathUtils.damp(playerGrp.position.z, stateRef.current.targetZ, 12, delta);
        playerGrp.position.y = 1.2 + Math.sin(clock.getElapsedTime() * 6) * 0.15;
      }

      stateRef.current.gems.forEach(g => {
        g.rotation.y += 3.0 * delta;
      });

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
      clearInterval(timerInterval);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleRestart = () => {
    sounds.playClick();
    stateRef.current.playerGridX = 1;
    stateRef.current.playerGridY = 1;
    stateRef.current.targetX = 4;
    stateRef.current.targetZ = 4;
    stateRef.current.time = 60;
    stateRef.current.score = 0;
    stateRef.current.active = true;
    setTimeLeft(60);
    setScore(0);
    setIsVictory(false);
    setIsGameOver(false);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col select-none">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top HUD */}
      <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-white shadow-lg pointer-events-auto">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <div className="text-xs">
              <span className="text-slate-400 mr-1">Gemas:</span>
              <span className="font-mono font-bold text-cyan-300">{score}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-white shadow-lg pointer-events-auto">
            <Zap className="w-4 h-4 text-pink-400" />
            <div className="text-xs font-mono">
              <span className="text-slate-400 mr-1">Tiempo:</span>
              <span className={`font-bold ${timeLeft < 15 ? 'text-red-400 animate-pulse' : 'text-pink-300'}`}>{timeLeft}s</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl text-[11px] text-slate-300">
          Usa <span className="font-bold text-white">W/A/S/D</span> o las flechas para moverte
        </div>
      </div>

      {/* Onscreen D-Pad for Touch/Mouse */}
      <div className="absolute bottom-5 right-5 z-10 flex flex-col items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/70 shadow-2xl">
        <button
          type="button"
          onClick={() => {
            const ev = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            window.dispatchEvent(ev);
          }}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl active:scale-95 transition-transform"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const ev = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
              window.dispatchEvent(ev);
            }}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              const ev = new KeyboardEvent('keydown', { key: 'ArrowDown' });
              window.dispatchEvent(ev);
            }}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl active:scale-95 transition-transform"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              const ev = new KeyboardEvent('keydown', { key: 'ArrowRight' });
              window.dispatchEvent(ev);
            }}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl active:scale-95 transition-transform"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Victory / Game Over Modals */}
      {(isVictory || isGameOver) && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">
              {isVictory ? '¡Laberinto Superado!' : '¡Tiempo Agotado!'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {isVictory ? 'Has alcanzado el portal cuántico con éxito.' : 'El cronómetro del laberinto ha llegado a cero.'}
            </p>

            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700/60 mb-6 text-center">
              <div className="text-[11px] text-slate-400">Puntaje Final</div>
              <div className="text-2xl font-bold font-mono text-cyan-300">{score} pts</div>
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Jugar de Nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
