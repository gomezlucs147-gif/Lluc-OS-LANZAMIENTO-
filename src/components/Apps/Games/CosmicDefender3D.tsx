import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '../../../utils/soundEffects';
import { Crosshair, Shield, Trophy, RotateCcw, Zap, Target } from 'lucide-react';

export const CosmicDefender3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState<number>(0);
  const [wave, setWave] = useState<number>(1);
  const [shield, setShield] = useState<number>(100);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const stateRef = useRef({
    score: 0,
    wave: 1,
    shield: 100,
    gameOver: false,
    lasers: [] as { mesh: THREE.Mesh; vel: THREE.Vector3 }[],
    enemies: [] as { mesh: THREE.Group; hp: number; velZ: number }[],
    asteroids: [] as THREE.Mesh[],
    mouseX: 0,
    mouseY: 0,
    canShoot: true,
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
    scene.fog = new THREE.FogExp2(0x020308, 0.008);
    scene.background = new THREE.Color(0x020308);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      800
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const amb = new THREE.AmbientLight(0x223355, 1.2);
    scene.add(amb);
    const sun = new THREE.DirectionalLight(0xffeedd, 1.8);
    sun.position.set(20, 30, 20);
    scene.add(sun);

    // Starfield Particle Dust (Instanced / Points)
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 400;
      starPositions[i + 1] = (Math.random() - 0.5) * 300;
      starPositions[i + 2] = -Math.random() * 500;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x88ccff,
      size: 1.2,
      transparent: true,
      opacity: 0.8,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Player Starfighter Cockpit & Wings (Group)
    const starfighter = new THREE.Group();

    // Fuselage
    const fuseGeo = new THREE.ConeGeometry(0.8, 4.2, 8);
    const fuseMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.25,
    });
    const fuselage = new THREE.Mesh(fuseGeo, fuseMat);
    fuselage.rotation.x = -Math.PI / 2;
    starfighter.add(fuselage);

    // Wings
    const wingGeo = new THREE.BoxGeometry(4.2, 0.08, 1.6);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.3,
    });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0, 0, 0.5);
    starfighter.add(wings);

    // Wingtips with plasma emitters
    const emitterGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8);
    const emitterMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const leftGun = new THREE.Mesh(emitterGeo, emitterMat);
    leftGun.rotation.x = Math.PI / 2;
    leftGun.position.set(-2.0, 0, 0.2);
    starfighter.add(leftGun);

    const rightGun = new THREE.Mesh(emitterGeo, emitterMat);
    rightGun.rotation.x = Math.PI / 2;
    rightGun.position.set(2.0, 0, 0.2);
    starfighter.add(rightGun);

    starfighter.position.set(0, -2.4, 4);
    scene.add(starfighter);

    // Enemy Drone creation helper
    const spawnEnemy = () => {
      const drone = new THREE.Group();
      // Alien drone core
      const coreGeo = new THREE.DodecahedronGeometry(1.2, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xd946ef,
        emissive: 0xa21caf,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.8,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      drone.add(core);

      // Eye
      const eyeGeo = new THREE.SphereGeometry(0.4, 8, 8);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(0, 0, 0.9);
      drone.add(eye);

      // Random position far in front
      const x = (Math.random() - 0.5) * 36;
      const y = (Math.random() - 0.5) * 24;
      const z = -250 - Math.random() * 80;
      drone.position.set(x, y, z);

      scene.add(drone);
      stateRef.current.enemies.push({
        mesh: drone,
        hp: 2,
        velZ: 32 + stateRef.current.wave * 4,
      });
    };

    // Initial batch of enemies
    for (let i = 0; i < 8; i++) {
      spawnEnemy();
    }

    // Fire laser projectile
    const fireLaser = () => {
      if (stateRef.current.gameOver) return;
      sounds.playLaser();

      const laserGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 6);
      const laserMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

      // Left laser
      const l1 = new THREE.Mesh(laserGeo, laserMat);
      l1.rotation.x = Math.PI / 2;
      l1.position.set(starfighter.position.x - 2.0, starfighter.position.y, starfighter.position.z - 1);
      scene.add(l1);
      stateRef.current.lasers.push({ mesh: l1, vel: new THREE.Vector3(0, 0, -120) });

      // Right laser
      const l2 = new THREE.Mesh(laserGeo, laserMat);
      l2.rotation.x = Math.PI / 2;
      l2.position.set(starfighter.position.x + 2.0, starfighter.position.y, starfighter.position.z - 1);
      scene.add(l2);
      stateRef.current.lasers.push({ mesh: l2, vel: new THREE.Vector3(0, 0, -120) });
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mouseX = x * 14;
      stateRef.current.mouseY = y * 8;
    };

    const handlePointerDown = () => {
      fireLaser();
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handlePointerDown);
    container.addEventListener('touchmove', handlePointerMove);
    container.addEventListener('touchstart', handlePointerDown);

    // Animation Tick
    const clock = new THREE.Clock();
    let animId = 0;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const state = stateRef.current;

      // Smooth move player to cursor
      starfighter.position.x = THREE.MathUtils.damp(starfighter.position.x, state.mouseX, 8, delta);
      starfighter.position.y = THREE.MathUtils.damp(starfighter.position.y, state.mouseY, 8, delta);
      starfighter.rotation.z = (starfighter.position.x - state.mouseX) * 0.08;
      starfighter.rotation.x = (starfighter.position.y - state.mouseY) * 0.05;

      // Move stars forward
      const pos = starGeo.attributes.position.array as Float32Array;
      for (let i = 2; i < starCount * 3; i += 3) {
        pos[i] += 40 * delta;
        if (pos[i] > 10) pos[i] = -400;
      }
      starGeo.attributes.position.needsUpdate = true;

      // Update lasers
      for (let i = state.lasers.length - 1; i >= 0; i--) {
        const laser = state.lasers[i];
        laser.mesh.position.z += laser.vel.z * delta;

        // Check laser collision with enemies
        let hit = false;
        for (let j = state.enemies.length - 1; j >= 0; j--) {
          const enemy = state.enemies[j];
          if (laser.mesh.position.distanceTo(enemy.mesh.position) < 2.0) {
            sounds.playExplosion();
            enemy.hp -= 1;
            hit = true;
            if (enemy.hp <= 0) {
              scene.remove(enemy.mesh);
              state.enemies.splice(j, 1);
              state.score += 250;
              setScore(state.score);
              spawnEnemy();
            }
            break;
          }
        }

        if (hit || laser.mesh.position.z < -300) {
          scene.remove(laser.mesh);
          state.lasers.splice(i, 1);
        }
      }

      // Update Enemies
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        enemy.mesh.position.z += enemy.velZ * delta;
        enemy.mesh.rotation.y += 2.0 * delta;
        enemy.mesh.rotation.x += 1.5 * delta;

        // Check collision with player
        if (enemy.mesh.position.distanceTo(starfighter.position) < 2.5) {
          sounds.playExplosion();
          state.shield -= 25;
          setShield(state.shield);
          scene.remove(enemy.mesh);
          state.enemies.splice(i, 1);
          spawnEnemy();

          if (state.shield <= 0) {
            state.shield = 0;
            state.gameOver = true;
            setGameOver(true);
          }
        } else if (enemy.mesh.position.z > 12) {
          // Respawn in back
          enemy.mesh.position.z = -250 - Math.random() * 80;
          enemy.mesh.position.x = (Math.random() - 0.5) * 36;
          enemy.mesh.position.y = (Math.random() - 0.5) * 24;
        }
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
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleRestart = () => {
    sounds.playClick();
    stateRef.current.score = 0;
    stateRef.current.shield = 100;
    stateRef.current.gameOver = false;
    setScore(0);
    setShield(100);
    setGameOver(false);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col select-none cursor-crosshair">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top HUD */}
      <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-white shadow-lg">
            <Trophy className="w-4 h-4 text-purple-400" />
            <div className="text-xs">
              <span className="text-slate-400 mr-1">Bajas:</span>
              <span className="font-mono font-bold text-purple-300">{score}</span>
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
            Sector Orbital Alfa
          </div>
        </div>

        {/* Shield */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-4 py-2 rounded-xl flex items-center gap-2.5 text-white shadow-lg">
          <Shield className="w-4 h-4 text-sky-400" />
          <div className="w-28 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-200 ${
                shield > 50 ? 'bg-sky-400' : shield > 25 ? 'bg-amber-400' : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${shield}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold">{shield}%</span>
        </div>
      </div>

      {/* Center Reticle hint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <Crosshair className="w-8 h-8 text-sky-400" />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-4 py-1.5 rounded-full text-[11px] text-slate-300">
        Mueve el ratón para guiar la nave • Haz click para disparar láseres de plasma
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 cursor-default">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto mb-4">
              <Target className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Misión Fallida</h3>
            <p className="text-xs text-slate-400 mb-6">
              Los cazas enemigos atravesaron el perímetro de defensa estelar.
            </p>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 mb-6 text-center">
              <div className="text-[11px] text-slate-400">Puntaje Total</div>
              <div className="text-xl font-bold font-mono text-purple-300">{score}</div>
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Reintentar Misión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
