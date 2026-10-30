import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '../../../utils/soundEffects';
import { Boxes, RotateCcw, Plus, Trash2, Eye, Sparkles } from 'lucide-react';

interface VoxelType {
  id: string;
  name: string;
  color: number;
  roughness: number;
  emissive?: number;
}

const VOXEL_TYPES: VoxelType[] = [
  { id: 'grass', name: 'Césped', color: 0x22c55e, roughness: 0.8 },
  { id: 'dirt', name: 'Tierra', color: 0x78350f, roughness: 0.9 },
  { id: 'stone', name: 'Piedra', color: 0x64748b, roughness: 0.7 },
  { id: 'wood', name: 'Madera', color: 0xb45309, roughness: 0.6 },
  { id: 'brick', name: 'Ladrillo', color: 0xb91c1c, roughness: 0.7 },
  { id: 'gold', name: 'Oro', color: 0xfacc15, roughness: 0.2 },
  { id: 'neon', name: 'Neón Azul', color: 0x06b6d4, roughness: 0.1, emissive: 0x0891b2 },
];

export const VoxelCraft3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedBlock, setSelectedBlock] = useState<string>('grass');
  const [blockCount, setBlockCount] = useState<number>(0);

  const stateRef = useRef({
    selectedType: VOXEL_TYPES[0],
    voxels: new Map<string, THREE.Mesh>(),
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    renderer: null as THREE.WebGLRenderer | null,
    rollOverMesh: null as THREE.Mesh | null,
    objects: [] as THREE.Object3D[],
    plane: null as THREE.Mesh | null,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    isShiftDown: false,
    spherical: { radius: 24, theta: Math.PI / 4, phi: Math.PI / 3 },
    isDragging: false,
    prevMouse: { x: 0, y: 0 },
  });

  useEffect(() => {
    stateRef.current.selectedType = VOXEL_TYPES.find(v => v.id === selectedBlock) || VOXEL_TYPES[0];
  }, [selectedBlock]);

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
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.FogExp2(0x0f172a, 0.012);
    stateRef.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    stateRef.current.camera = camera;

    const updateCameraPos = () => {
      const sp = stateRef.current.spherical;
      camera.position.x = sp.radius * Math.sin(sp.phi) * Math.sin(sp.theta);
      camera.position.y = sp.radius * Math.cos(sp.phi);
      camera.position.z = sp.radius * Math.sin(sp.phi) * Math.cos(sp.theta);
      camera.lookAt(0, 2, 0);
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
    stateRef.current.renderer = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x60a5fa, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // Roll-over hover helper
    const rollOverGeo = new THREE.BoxGeometry(1.02, 1.02, 1.02);
    const rollOverMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      opacity: 0.5,
      transparent: true,
      wireframe: true,
    });
    const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    scene.add(rollOverMesh);
    stateRef.current.rollOverMesh = rollOverMesh;

    // Base Grid Ground
    const gridHelper = new THREE.GridHelper(30, 30, 0x38bdf8, 0x334155);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Ground Plane for Raycasting
    const planeGeo = new THREE.PlaneGeometry(30, 30);
    planeGeo.rotateX(-Math.PI / 2);
    const planeMat = new THREE.MeshBasicMaterial({ visible: false });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    scene.add(plane);
    stateRef.current.plane = plane;
    stateRef.current.objects.push(plane);

    // Box Geometry shared
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);

    // Helper to spawn a voxel
    const addVoxel = (x: number, y: number, z: number, type: VoxelType) => {
      const key = `${x},${y},${z}`;
      if (stateRef.current.voxels.has(key)) return;

      const mat = new THREE.MeshStandardMaterial({
        color: type.color,
        roughness: type.roughness,
        metalness: type.id === 'gold' ? 0.8 : 0.1,
        emissive: type.emissive || 0x000000,
        emissiveIntensity: type.emissive ? 0.6 : 0,
      });

      const voxel = new THREE.Mesh(boxGeo, mat);
      voxel.position.set(x, y, z);
      scene.add(voxel);
      stateRef.current.voxels.set(key, voxel);
      stateRef.current.objects.push(voxel);
    };

    // Generate starter terrain hill
    for (let x = -4; x <= 4; x++) {
      for (let z = -4; z <= 4; z++) {
        // Base dirt
        addVoxel(x, 0.5, z, VOXEL_TYPES[1]);
        // Grass top
        addVoxel(x, 1.5, z, VOXEL_TYPES[0]);
      }
    }
    // Small hill in center
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        addVoxel(x, 2.5, z, VOXEL_TYPES[0]);
      }
    }
    // Little stone obelisk
    addVoxel(0, 3.5, 0, VOXEL_TYPES[2]);
    addVoxel(0, 4.5, 0, VOXEL_TYPES[6]); // Neon cap

    setBlockCount(stateRef.current.voxels.size);

    // Interaction handling
    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      stateRef.current.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      stateRef.current.mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Handle right click or middle click camera orbit
      if (stateRef.current.isDragging) {
        const dx = e.clientX - stateRef.current.prevMouse.x;
        const dy = e.clientY - stateRef.current.prevMouse.y;
        stateRef.current.spherical.theta -= dx * 0.008;
        stateRef.current.spherical.phi = Math.max(
          0.1,
          Math.min(Math.PI / 2 - 0.05, stateRef.current.spherical.phi - dy * 0.008)
        );
        updateCameraPos();
        stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
        return;
      }

      stateRef.current.raycaster.setFromCamera(stateRef.current.mouse, camera);
      const intersects = stateRef.current.raycaster.intersectObjects(stateRef.current.objects, false);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        if (intersect.point && intersect.face) {
          const position = new THREE.Vector3();
          if (intersect.object === plane) {
            position.copy(intersect.point).add(new THREE.Vector3(0, 0.5, 0));
          } else {
            position.copy(intersect.point).add(intersect.face.normal.clone().multiplyScalar(0.5));
          }
          position.x = Math.floor(position.x) + 0.5;
          position.y = Math.floor(position.y) + 0.5;
          position.z = Math.floor(position.z) + 0.5;

          rollOverMesh.position.copy(position);
          rollOverMesh.visible = true;
        }
      } else {
        rollOverMesh.visible = false;
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      if (e.button === 2) {
        // Right click: start orbit drag
        stateRef.current.isDragging = true;
        stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
        return;
      }

      // Left Click: place or delete block
      const rect = container.getBoundingClientRect();
      stateRef.current.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      stateRef.current.mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      stateRef.current.raycaster.setFromCamera(stateRef.current.mouse, camera);
      const intersects = stateRef.current.raycaster.intersectObjects(stateRef.current.objects, false);

      if (intersects.length > 0) {
        const intersect = intersects[0];

        // If Shift is down, delete the clicked voxel!
        if (stateRef.current.isShiftDown) {
          if (intersect.object !== plane) {
            sounds.playExplosion();
            scene.remove(intersect.object);
            const idx = stateRef.current.objects.indexOf(intersect.object);
            if (idx !== -1) stateRef.current.objects.splice(idx, 1);

            // remove from voxels map
            stateRef.current.voxels.forEach((val, key) => {
              if (val === intersect.object) stateRef.current.voxels.delete(key);
            });
            setBlockCount(stateRef.current.voxels.size);
          }
        } else {
          // Place voxel!
          sounds.playPickup();
          const pos = new THREE.Vector3();
          if (intersect.object === plane) {
            pos.copy(intersect.point).add(new THREE.Vector3(0, 0.5, 0));
          } else if (intersect.face) {
            pos.copy(intersect.point).add(intersect.face.normal.clone().multiplyScalar(0.5));
          }
          const x = Math.floor(pos.x) + 0.5;
          const y = Math.max(0.5, Math.floor(pos.y) + 0.5);
          const z = Math.floor(pos.z) + 0.5;

          addVoxel(x, y, z, stateRef.current.selectedType);
          setBlockCount(stateRef.current.voxels.size);
        }
      }
    };

    const onPointerUp = (e: MouseEvent) => {
      if (e.button === 2) {
        stateRef.current.isDragging = false;
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        stateRef.current.isShiftDown = true;
        rollOverMaterial.color.setHex(0xef4444);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        stateRef.current.isShiftDown = false;
        rollOverMaterial.color.setHex(0x38bdf8);
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Zoom wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stateRef.current.spherical.radius = Math.max(
        8,
        Math.min(50, stateRef.current.spherical.radius + e.deltaY * 0.03)
      );
      updateCameraPos();
    };
    container.addEventListener('wheel', onWheel, { passive: false });

    // Render loop
    let animId = 0;
    const tick = () => {
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
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('contextmenu', onContextMenu);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col select-none">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top Bar HUD */}
      <div className="relative z-10 p-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-white shadow-lg">
            <Boxes className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400 mr-1.5">Bloques en mundo:</span>
              <span className="font-mono font-bold text-emerald-300">{blockCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl text-[11px] text-slate-300">
          <span className="font-semibold text-sky-400">Click Izquierdo:</span> Colocar • <span className="font-semibold text-rose-400">Shift + Click:</span> Romper • <span className="font-semibold text-amber-400">Click Derecho / Arrastrar:</span> Girar cámara
        </div>
      </div>

      {/* Voxel Material Hotbar Palette */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 p-2 rounded-2xl flex items-center gap-2 shadow-2xl">
        {VOXEL_TYPES.map(vt => {
          const isSelected = selectedBlock === vt.id;
          return (
            <button
              key={vt.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedBlock(vt.id);
              }}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                isSelected
                  ? 'bg-slate-800 ring-2 ring-sky-400 shadow-md scale-105'
                  : 'hover:bg-slate-800/60'
              }`}
            >
              <span
                className="w-6 h-6 rounded-lg shadow-sm border border-white/20"
                style={{ backgroundColor: `#${vt.color.toString(16).padStart(6, '0')}` }}
              />
              <span className="text-[10px] font-medium text-slate-300">{vt.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
