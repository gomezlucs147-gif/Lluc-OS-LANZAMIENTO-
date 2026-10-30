import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '../../../utils/soundEffects';
import { Play, RotateCcw, Zap, Shield, Trophy, ArrowLeft, ArrowRight, Gauge } from 'lucide-react';

export const CyberRider3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('llucos_cyberrider_hi') || '0', 10);
  });
  const [speedKmh, setSpeedKmh] = useState<number>(180);
  const [shield, setShield] = useState<number>(100);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(true);
  const [isBoosting, setIsBoosting] = useState<boolean>(false);

  // References for mutable game state across ticks
  const stateRef = useRef({
    score: 0,
    speed: 45,
    shield: 100,
    gameOver: false,
    playerX: 0,
    targetPlayerX: 0,
    keys: { left: false, right: false, boost: false },
    boostTimer: 0,
    obstacles: [] as THREE.Group[],
    coins: [] as THREE.Group[],
    roadSegments: [] as THREE.Mesh[],
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
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
    scene.fog = new THREE.FogExp2(0x050814, 0.015);
    scene.background = new THREE.Color(0x050814);

    const camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / container.clientHeight,
      0.1,
      600
    );
    camera.position.set(0, 3.6, 7.5);
    camera.lookAt(0, 1.2, -10);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lights
    const hemiLight = new THREE.HemisphereLight(0x00f0ff, 0x050814, 0.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xff0077, 1.2);
    dirLight.position.set(5, 12, 10);
    scene.add(dirLight);

    // Procedural 3-12 Part Hero Vehicle (Cyber Hover Racer)
    const playerVehicle = new THREE.Group();

    // 1. Main Fuselage
    const hullGeo = new THREE.BoxGeometry(1.6, 0.35, 3.2);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.25,
      metalness: 0.9,
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.y = 0.4;
    playerVehicle.add(hull);

    // 2. Cockpit Canopy (Neon glass visor)
    const canopyGeo = new THREE.BoxGeometry(0.9, 0.32, 1.4);
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.6,
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 0.65, -0.2);
    playerVehicle.add(canopy);

    // 3 & 4. Left and Right Angled Wings
    const wingGeo = new THREE.BoxGeometry(1.2, 0.1, 1.8);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.3,
      metalness: 0.85,
    });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-1.2, 0.45, 0.4);
    leftWing.rotation.z = -0.15;
    playerVehicle.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(1.2, 0.45, 0.4);
    rightWing.rotation.z = 0.15;
    playerVehicle.add(rightWing);

    // 5 & 6. Dual Thrusters with glowing plasma exhausts
    const engineGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.9, 12);
    const engineMat = new THREE.MeshStandardMaterial({
      color: 0x374151,
      roughness: 0.4,
      metalness: 0.95,
    });
    const leftEngine = new THREE.Mesh(engineGeo, engineMat);
    leftEngine.rotation.x = Math.PI / 2;
    leftEngine.position.set(-0.55, 0.45, 1.6);
    playerVehicle.add(leftEngine);

    const rightEngine = new THREE.Mesh(engineGeo, engineMat);
    rightEngine.rotation.x = Math.PI / 2;
    rightEngine.position.set(0.55, 0.45, 1.6);
    playerVehicle.add(rightEngine);

    // 7. Exhaust Glow Spheres
    const exhaustMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const leftExhaust = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), exhaustMat);
    leftExhaust.position.set(-0.55, 0.45, 2.05);
    playerVehicle.add(leftExhaust);

    const rightExhaust = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), exhaustMat);
    rightExhaust.position.set(0.55, 0.45, 2.05);
    playerVehicle.add(rightExhaust);

    playerVehicle.position.set(0, 0.5, 0);
    scene.add(playerVehicle);

    // Procedural Track segments (Cyber neon highway)
    const trackWidth = 18;
    const segmentLength = 80;
    const numSegments = 5;

    // Grid Road Material
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, 248, 248);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(128, 0);
      ctx.lineTo(128, 256);
      ctx.stroke();
    }
    const roadTexture = new THREE.CanvasTexture(canvas);
    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.repeat.set(3, 10);
    roadTexture.colorSpace = THREE.SRGBColorSpace;

    const roadMat = new THREE.MeshStandardMaterial({
      map: roadTexture,
      roughness: 0.4,
      metalness: 0.6,
    });

    const roadSegments: THREE.Mesh[] = [];
    for (let i = 0; i < numSegments; i++) {
      const segGeo = new THREE.PlaneGeometry(trackWidth, segmentLength);
      const segMesh = new THREE.Mesh(segGeo, roadMat);
      segMesh.rotation.x = -Math.PI / 2;
      segMesh.position.set(0, 0, -i * segmentLength);
      scene.add(segMesh);
      roadSegments.push(segMesh);
    }
    stateRef.current.roadSegments = roadSegments;

    // Laser Side Railings
    const railMat = new THREE.MeshBasicMaterial({ color: 0xff0077 });
    const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, segmentLength * numSegments), railMat);
    leftRail.position.set(-trackWidth / 2, 0.4, -(segmentLength * numSegments) / 2);
    scene.add(leftRail);

    const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, segmentLength * numSegments), railMat);
    rightRail.position.set(trackWidth / 2, 0.4, -(segmentLength * numSegments) / 2);
    scene.add(rightRail);

    // Obstacles and Energy Orbs Pool
    const obstacles: THREE.Group[] = [];
    const coins: THREE.Group[] = [];

    // Obstacle template (Red Laser Pylon)
    const createObstacle = (x: number, z: number) => {
      const grp = new THREE.Group();
      const pylonGeo = new THREE.CylinderGeometry(0.45, 0.55, 3.5, 8);
      const pylonMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xff0033,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const mesh = new THREE.Mesh(pylonGeo, pylonMat);
      mesh.position.y = 1.75;
      grp.add(mesh);

      // Warning ring
      const ringGeo = new THREE.TorusGeometry(0.8, 0.1, 8, 16);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 2.4;
      grp.add(ring);

      grp.position.set(x, 0, z);
      scene.add(grp);
      return grp;
    };

    // Coin template (Golden Quantum Core)
    const createCoin = (x: number, z: number) => {
      const grp = new THREE.Group();
      const orbGeo = new THREE.OctahedronGeometry(0.55, 1);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.9,
      });
      const mesh = new THREE.Mesh(orbGeo, orbMat);
      mesh.position.y = 1.2;
      grp.add(mesh);

      grp.position.set(x, 0, z);
      scene.add(grp);
      return grp;
    };

    // Populate initial items ahead
    for (let i = 0; i < 16; i++) {
      const laneX = (Math.floor(Math.random() * 5) - 2) * 2.8;
      const z = -40 - i * 28;
      if (Math.random() > 0.4) {
        obstacles.push(createObstacle(laneX, z));
      } else {
        coins.push(createCoin(laneX, z));
      }
    }
    stateRef.current.obstacles = obstacles;
    stateRef.current.coins = coins;

    // Input handlers
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        stateRef.current.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        stateRef.current.keys.right = true;
      }
      if (e.key === ' ' || e.key.toLowerCase() === 'w' || e.key === 'ArrowUp') {
        stateRef.current.keys.boost = true;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        stateRef.current.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        stateRef.current.keys.right = false;
      }
      if (e.key === ' ' || e.key.toLowerCase() === 'w' || e.key === 'ArrowUp') {
        stateRef.current.keys.boost = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId = 0;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const state = stateRef.current;

      if (!state.gameOver) {
        // Boost calculation
        let currentSpeed = 48;
        if (state.keys.boost) {
          currentSpeed = 85;
          setIsBoosting(true);
        } else {
          setIsBoosting(false);
        }

        // Steer player
        if (state.keys.left) {
          state.targetPlayerX = Math.max(-trackWidth / 2 + 1.8, state.targetPlayerX - 16 * delta);
        }
        if (state.keys.right) {
          state.targetPlayerX = Math.min(trackWidth / 2 - 1.8, state.targetPlayerX + 16 * delta);
        }

        // Smooth bank & steer
        state.playerX = THREE.MathUtils.damp(state.playerX, state.targetPlayerX, 14, delta);
        playerVehicle.position.x = state.playerX;
        playerVehicle.rotation.z = (state.playerX - state.targetPlayerX) * 0.18;
        playerVehicle.rotation.y = -(state.playerX - state.targetPlayerX) * 0.12;

        // Hover bobbing
        playerVehicle.position.y = 0.5 + Math.sin(clock.getElapsedTime() * 8) * 0.08;

        // Move road backwards
        roadSegments.forEach(seg => {
          seg.position.z += currentSpeed * delta;
          if (seg.position.z > segmentLength) {
            seg.position.z -= segmentLength * numSegments;
          }
        });

        // Move obstacles
        state.obstacles.forEach(obs => {
          obs.position.z += currentSpeed * delta;
          // Collision check
          if (Math.abs(obs.position.z - playerVehicle.position.z) < 1.6) {
            if (Math.abs(obs.position.x - playerVehicle.position.x) < 1.4) {
              // Hit obstacle!
              sounds.playExplosion();
              state.shield -= 25;
              obs.position.z = 20; // push past
              if (state.shield <= 0) {
                state.shield = 0;
                state.gameOver = true;
                setGameOver(true);
              }
              setShield(state.shield);
            }
          }

          // Respawn ahead
          if (obs.position.z > 15) {
            obs.position.z = -180 - Math.random() * 80;
            obs.position.x = (Math.floor(Math.random() * 5) - 2) * 2.8;
          }
        });

        // Move coins
        state.coins.forEach(coin => {
          coin.position.z += currentSpeed * delta;
          coin.rotation.y += 3.5 * delta;

          // Pickup check
          if (Math.abs(coin.position.z - playerVehicle.position.z) < 1.6) {
            if (Math.abs(coin.position.x - playerVehicle.position.x) < 1.5) {
              sounds.playPickup();
              state.score += 100;
              state.shield = Math.min(100, state.shield + 5);
              setScore(state.score);
              setShield(state.shield);
              coin.position.z = 20;
            }
          }

          if (coin.position.z > 15) {
            coin.position.z = -180 - Math.random() * 80;
            coin.position.x = (Math.floor(Math.random() * 5) - 2) * 2.8;
          }
        });

        // Continuous score for surviving distance
        state.score += Math.floor(currentSpeed * delta * 0.8);
        setScore(state.score);
        setSpeedKmh(Math.floor(currentSpeed * 3.6));
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
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleRestart = () => {
    sounds.playClick();
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('llucos_cyberrider_hi', score.toString());
    }
    stateRef.current.score = 0;
    stateRef.current.shield = 100;
    stateRef.current.gameOver = false;
    stateRef.current.playerX = 0;
    stateRef.current.targetPlayerX = 0;
    setScore(0);
    setShield(100);
    setGameOver(false);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col select-none">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top HUD Display */}
      <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-white shadow-lg">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <span className="text-slate-400 mr-1">Puntos:</span>
              <span className="font-mono font-bold text-amber-300">{score}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-white shadow-lg">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <div className="text-xs font-mono">
              <span className="font-bold text-cyan-300">{speedKmh}</span>
              <span className="text-slate-400 ml-1">km/h</span>
            </div>
          </div>
        </div>

        {/* Shield Bar */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-4 py-2 rounded-xl flex items-center gap-2.5 text-white shadow-lg">
          <Shield className="w-4 h-4 text-emerald-400" />
          <div className="w-28 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-200 ${
                shield > 50 ? 'bg-emerald-400' : shield > 25 ? 'bg-amber-400' : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${shield}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold">{shield}%</span>
        </div>
      </div>

      {/* Turbo Boost Active Indicator */}
      {isBoosting && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 px-4 py-1 bg-cyan-500/20 border border-cyan-400/60 rounded-full backdrop-blur-md text-cyan-300 text-xs font-bold font-mono tracking-wider animate-pulse flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-cyan-400" />
          TURBO PROPULSIÓN ACTIVA
        </div>
      )}

      {/* Touch / Quick Onscreen Controls for mouse users */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-slate-900/75 backdrop-blur-md border border-slate-700/60 p-2 rounded-2xl shadow-xl">
        <button
          type="button"
          onMouseDown={() => { stateRef.current.keys.left = true; }}
          onMouseUp={() => { stateRef.current.keys.left = false; }}
          onTouchStart={() => { stateRef.current.keys.left = true; }}
          onTouchEnd={() => { stateRef.current.keys.left = false; }}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onMouseDown={() => { stateRef.current.keys.boost = true; }}
          onMouseUp={() => { stateRef.current.keys.boost = false; }}
          onTouchStart={() => { stateRef.current.keys.boost = true; }}
          onTouchEnd={() => { stateRef.current.keys.boost = false; }}
          className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
        >
          <Zap className="w-4 h-4 fill-white" />
          TURBO
        </button>

        <button
          type="button"
          onMouseDown={() => { stateRef.current.keys.right = true; }}
          onMouseUp={() => { stateRef.current.keys.right = false; }}
          onTouchStart={() => { stateRef.current.keys.right = true; }}
          onTouchEnd={() => { stateRef.current.keys.right = false; }}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl active:scale-95 transition-transform"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">¡Nave Destruida!</h3>
            <p className="text-xs text-slate-400 mb-6">
              El escudo cuántico de tu vehículo se ha agotado por impacto láser.
            </p>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 mb-6 flex justify-around text-center">
              <div>
                <div className="text-[11px] text-slate-400">Puntaje</div>
                <div className="text-lg font-bold font-mono text-cyan-300">{score}</div>
              </div>
              <div className="border-r border-slate-700" />
              <div>
                <div className="text-[11px] text-slate-400">Récord</div>
                <div className="text-lg font-bold font-mono text-amber-300">
                  {Math.max(score, highScore)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Reintentar Carrera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
