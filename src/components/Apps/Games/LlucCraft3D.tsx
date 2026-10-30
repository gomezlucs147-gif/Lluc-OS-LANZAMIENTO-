import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { mcAudio } from './minecraftAudio';
import {
  generateGrassTopTexture,
  generateDirtTexture,
  generateGrassSideTexture,
  generateStoneTexture,
  generateCobblestoneTexture,
  generateOakPlanksTexture,
  generateOakLogSideTexture,
  generateOakLogTopTexture,
  generateOakLeavesTexture,
  generateGlassTexture,
  generateDiamondOreTexture,
  generateDiamondBlockTexture,
  generateCraftingTableTopTexture,
  generateCraftingTableSideTexture,
  generateTNTSideTexture,
  generateTNTTopTexture,
  generateSandTexture,
  generateBricksTexture,
  generateWaterTexture,
  generateBreakCrackTexture,
} from './minecraftTextures';
import { 
  Play, 
  Settings, 
  RotateCcw, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  MessageSquare,
  X,
  Compass,
  Hammer
} from 'lucide-react';

export interface ItemStack {
  id: string;
  count: number;
}

interface BlockDef {
  id: string;
  name: string;
  materialType: 'grass' | 'wood' | 'stone' | 'sand';
  hardness: number; // in seconds to break
  isTransparent?: boolean;
  dropId: string;
  dropCount: number;
}

const BLOCK_DEFS: Record<string, BlockDef> = {
  grass: { id: 'grass', name: 'Césped', materialType: 'grass', hardness: 0.5, dropId: 'dirt', dropCount: 1 },
  dirt: { id: 'dirt', name: 'Tierra', materialType: 'grass', hardness: 0.5, dropId: 'dirt', dropCount: 1 },
  stone: { id: 'stone', name: 'Piedra', materialType: 'stone', hardness: 1.2, dropId: 'cobblestone', dropCount: 1 },
  cobblestone: { id: 'cobblestone', name: 'Adoquín', materialType: 'stone', hardness: 1.2, dropId: 'cobblestone', dropCount: 1 },
  oak_log: { id: 'oak_log', name: 'Tronco de Roble', materialType: 'wood', hardness: 1.0, dropId: 'oak_log', dropCount: 1 },
  oak_planks: { id: 'oak_planks', name: 'Madera de Roble', materialType: 'wood', hardness: 0.8, dropId: 'oak_planks', dropCount: 1 },
  oak_leaves: { id: 'oak_leaves', name: 'Hojas de Roble', materialType: 'grass', hardness: 0.25, isTransparent: true, dropId: 'oak_leaves', dropCount: 1 },
  crafting_table: { id: 'crafting_table', name: 'Mesa de Trabajo', materialType: 'wood', hardness: 0.9, dropId: 'crafting_table', dropCount: 1 },
  sand: { id: 'sand', name: 'Arena', materialType: 'sand', hardness: 0.45, dropId: 'sand', dropCount: 1 },
  bricks: { id: 'bricks', name: 'Ladrillos', materialType: 'stone', hardness: 1.3, dropId: 'bricks', dropCount: 1 },
  diamond_ore: { id: 'diamond_ore', name: 'Mena de Diamante', materialType: 'stone', hardness: 1.8, dropId: 'diamond_block', dropCount: 1 },
  diamond_block: { id: 'diamond_block', name: 'Bloque de Diamante', materialType: 'stone', hardness: 2.0, dropId: 'diamond_block', dropCount: 1 },
  glass: { id: 'glass', name: 'Cristal', materialType: 'stone', hardness: 0.3, isTransparent: true, dropId: 'glass', dropCount: 1 },
  tnt: { id: 'tnt', name: 'TNT Dinamita', materialType: 'grass', hardness: 0.2, dropId: 'tnt', dropCount: 1 },
  water: { id: 'water', name: 'Agua', materialType: 'grass', hardness: 999, isTransparent: true, dropId: 'water', dropCount: 0 },
};

// Item colors for icons in 2D inventory
const ITEM_COLORS: Record<string, string> = {
  grass: '#578e32',
  dirt: '#866543',
  stone: '#7b7b7b',
  cobblestone: '#636363',
  oak_log: '#6d5132',
  oak_planks: '#af834d',
  oak_leaves: '#34661e',
  crafting_table: '#b88748',
  sand: '#ded0aa',
  bricks: '#963d30',
  diamond_ore: '#4bede0',
  diamond_block: '#5bf3e7',
  glass: '#c8e6c9',
  tnt: '#db2b2b',
  water: '#3873ea',
  stick: '#8b6435',
  wooden_pickaxe: '#a27743',
  wooden_sword: '#af834d',
};

const SPLASH_MESSAGES = [
  'Eaglercraft 1.8 Web Edition!',
  '¡100% Hecho para llucOS!',
  '¡Mina diamantes en 3D!',
  '¡Presiona E para el inventario!',
  '¡Herobrine no está en este mundo...!',
  '¡Fabricación y crafteo real!',
  '¡Salta con Espacio y corre con Shift!',
  '¡Comandos de chat con tecla T!'
];

export const LlucCraft3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Game UI States
  const [gameState, setGameState] = useState<'title' | 'playing' | 'paused'>('title');
  const [gameMode, setGameMode] = useState<'creative' | 'survival'>('survival');
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [health, setHealth] = useState<number>(20);
  const [hunger, setHunger] = useState<number>(20);
  const [level, setLevel] = useState<number>(30);
  const [isDay, setIsDay] = useState<boolean>(true);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<string[]>([
    '§e¡Bienvenido a llucCraft 3D Eaglercraft Edition!',
    '§7Usa WASD para moverte, Click Izq para minar, Click Der para colocar.',
    '§7Presiona §aE §7para inventario/crafteo y §aT §7para chat.',
  ]);
  const [splashText] = useState<string>(() => SPLASH_MESSAGES[Math.floor(Math.random() * SPLASH_MESSAGES.length)]);
  const [selectedItemTooltip, setSelectedItemTooltip] = useState<string>('');

  // Settings
  const [fov, setFov] = useState<number>(75);
  const [sensitivity, setSensitivity] = useState<number>(0.0025);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Player Inventory: 9 hotbar slots + 27 backpack slots = 36 slots
  const [inventory, setInventory] = useState<(ItemStack | null)[]>(() => {
    const inv: (ItemStack | null)[] = new Array(36).fill(null);
    // Starter pack in hotbar
    inv[0] = { id: 'grass', count: 64 };
    inv[1] = { id: 'dirt', count: 64 };
    inv[2] = { id: 'stone', count: 64 };
    inv[3] = { id: 'cobblestone', count: 64 };
    inv[4] = { id: 'oak_log', count: 32 };
    inv[5] = { id: 'oak_planks', count: 64 };
    inv[6] = { id: 'crafting_table', count: 1 };
    inv[7] = { id: 'diamond_block', count: 16 };
    inv[8] = { id: 'tnt', count: 10 };
    return inv;
  });

  // 2x2 Crafting Grid slots and result slot
  const [craftingGrid, setCraftingGrid] = useState<(ItemStack | null)[]>([null, null, null, null]);
  const [craftingResult, setCraftingResult] = useState<ItemStack | null>(null);

  // Cursor held item when moving items in GUI
  const [heldItem, setHeldItem] = useState<ItemStack | null>(null);

  // Active item in hand from hotbar
  const activeItem = inventory[selectedSlot];

  // Tooltip effect when changing hotbar slot
  useEffect(() => {
    if (activeItem) {
      const def = BLOCK_DEFS[activeItem.id];
      setSelectedItemTooltip(def ? def.name : activeItem.id);
      const timer = setTimeout(() => setSelectedItemTooltip(''), 2200);
      return () => clearTimeout(timer);
    } else {
      setSelectedItemTooltip('');
    }
  }, [selectedSlot, activeItem]);

  // Crafting Recipe Evaluator (2x2 Grid)
  useEffect(() => {
    const [c0, c1, c2, c3] = craftingGrid;
    const nonEmpty = craftingGrid.filter(Boolean);

    // 1 Log -> 4 Planks
    if (nonEmpty.length === 1 && c0?.id === 'oak_log') {
      setCraftingResult({ id: 'oak_planks', count: 4 });
      return;
    }
    if (nonEmpty.length === 1 && (c1?.id === 'oak_log' || c2?.id === 'oak_log' || c3?.id === 'oak_log')) {
      setCraftingResult({ id: 'oak_planks', count: 4 });
      return;
    }

    // 4 Planks (2x2) -> 1 Crafting Table
    if (c0?.id === 'oak_planks' && c1?.id === 'oak_planks' && c2?.id === 'oak_planks' && c3?.id === 'oak_planks') {
      setCraftingResult({ id: 'crafting_table', count: 1 });
      return;
    }

    // 2 Planks (vertically stacked: c0 & c2 or c1 & c3) -> 4 Sticks
    if ((c0?.id === 'oak_planks' && c2?.id === 'oak_planks' && !c1 && !c3) ||
        (c1?.id === 'oak_planks' && c3?.id === 'oak_planks' && !c0 && !c2)) {
      setCraftingResult({ id: 'stick', count: 4 });
      return;
    }

    // 4 Cobblestone (2x2) -> 4 Bricks
    if (c0?.id === 'cobblestone' && c1?.id === 'cobblestone' && c2?.id === 'cobblestone' && c3?.id === 'cobblestone') {
      setCraftingResult({ id: 'bricks', count: 4 });
      return;
    }

    // 4 Sand (2x2) -> 1 Glass
    if (c0?.id === 'sand' && c1?.id === 'sand' && c2?.id === 'sand' && c3?.id === 'sand') {
      setCraftingResult({ id: 'glass', count: 4 });
      return;
    }

    // No recipe matched
    setCraftingResult(null);
  }, [craftingGrid]);

  // Mutable Game References for loop
  const stateRef = useRef({
    gameState: 'title' as 'title' | 'playing' | 'paused',
    gameMode: 'survival' as 'creative' | 'survival',
    inventory: [] as (ItemStack | null)[],
    selectedSlot: 0,
    isInventoryOpen: false,
    isChatOpen: false,
    voxelWorld: new Map<string, THREE.Mesh>(),
    wireframeBox: null as THREE.LineSegments | null,
    crackMesh: null as THREE.Mesh | null,
    crackTextures: [] as THREE.CanvasTexture[],
    handGroup: null as THREE.Group | null,
    floatingDrops: [] as { mesh: THREE.Mesh; id: string; vel: THREE.Vector3; born: number }[],
    // Player Physics
    pos: new THREE.Vector3(0, 12, 16),
    vel: new THREE.Vector3(),
    onGround: false,
    yaw: 0,
    pitch: 0,
    keys: { w: false, a: false, s: false, d: false, space: false, shift: false },
    // Mining state
    isMouseDown: false,
    miningKey: null as string | null,
    miningProgress: 0,
    lastTickTime: 0,
    // Raycasting
    raycaster: new THREE.Raycaster(),
    targetedBlock: null as { key: string; point: THREE.Vector3; normal: THREE.Vector3; mesh: THREE.Mesh } | null,
    // Day night
    isDay: true,
    dayTime: 0,
  });

  // Keep stateRef in sync with React state
  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  useEffect(() => {
    stateRef.current.gameMode = gameMode;
  }, [gameMode]);

  useEffect(() => {
    stateRef.current.inventory = inventory;
  }, [inventory]);

  useEffect(() => {
    stateRef.current.selectedSlot = selectedSlot;
  }, [selectedSlot]);

  useEffect(() => {
    stateRef.current.isInventoryOpen = isInventoryOpen;
  }, [isInventoryOpen]);

  useEffect(() => {
    stateRef.current.isChatOpen = isChatOpen;
  }, [isChatOpen]);

  // Main 3D Engine Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check Software GL
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
    const skyBlue = new THREE.Color(0x78a7ff);
    scene.background = skyBlue;
    scene.fog = new THREE.FogExp2(0x78a7ff, 0.016);

    const camera = new THREE.PerspectiveCamera(fov, container.clientWidth / container.clientHeight, 0.1, 400);
    camera.position.copy(stateRef.current.pos);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Natural Minecraft Sun & Ambient
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    sunLight.position.set(40, 70, 30);
    scene.add(sunLight);

    // Generate Textures
    const texGrassTop = generateGrassTopTexture();
    const texDirt = generateDirtTexture();
    const texGrassSide = generateGrassSideTexture();
    const texStone = generateStoneTexture();
    const texCobble = generateCobblestoneTexture();
    const texOakPlanks = generateOakPlanksTexture();
    const texOakLogSide = generateOakLogSideTexture();
    const texOakLogTop = generateOakLogTopTexture();
    const texOakLeaves = generateOakLeavesTexture();
    const texGlass = generateGlassTexture();
    const texDiamondOre = generateDiamondOreTexture();
    const texDiamondBlock = generateDiamondBlockTexture();
    const texCraftingTop = generateCraftingTableTopTexture();
    const texCraftingSide = generateCraftingTableSideTexture();
    const texTNTSide = generateTNTSideTexture();
    const texTNTTop = generateTNTTopTexture();
    const texSand = generateSandTexture();
    const texBricks = generateBricksTexture();
    const texWater = generateWaterTexture();

    // 5 Breaking crack textures
    const crackTextures = [
      generateBreakCrackTexture(0),
      generateBreakCrackTexture(1),
      generateBreakCrackTexture(2),
      generateBreakCrackTexture(3),
      generateBreakCrackTexture(4),
    ];
    stateRef.current.crackTextures = crackTextures;

    // Material builder helper [right, left, top, bottom, front, back]
    const createMat = (tex: THREE.CanvasTexture, transparent = false, opacity = 1.0) => {
      const m = new THREE.MeshLambertMaterial({ map: tex, transparent, opacity });
      if (transparent && opacity === 1.0) {
        m.alphaTest = 0.5;
      }
      return m;
    };

    const blockMaterials: Record<string, THREE.Material[]> = {
      grass: [
        createMat(texGrassSide),
        createMat(texGrassSide),
        createMat(texGrassTop),
        createMat(texDirt),
        createMat(texGrassSide),
        createMat(texGrassSide),
      ],
      dirt: new Array(6).fill(null).map(() => createMat(texDirt)),
      stone: new Array(6).fill(null).map(() => createMat(texStone)),
      cobblestone: new Array(6).fill(null).map(() => createMat(texCobble)),
      oak_planks: new Array(6).fill(null).map(() => createMat(texOakPlanks)),
      oak_log: [
        createMat(texOakLogSide),
        createMat(texOakLogSide),
        createMat(texOakLogTop),
        createMat(texOakLogTop),
        createMat(texOakLogSide),
        createMat(texOakLogSide),
      ],
      oak_leaves: new Array(6).fill(null).map(() => createMat(texOakLeaves, true, 1.0)),
      glass: new Array(6).fill(null).map(() => createMat(texGlass, true, 0.45)),
      crafting_table: [
        createMat(texCraftingSide),
        createMat(texCraftingSide),
        createMat(texCraftingTop),
        createMat(texOakPlanks),
        createMat(texCraftingSide),
        createMat(texCraftingSide),
      ],
      sand: new Array(6).fill(null).map(() => createMat(texSand)),
      bricks: new Array(6).fill(null).map(() => createMat(texBricks)),
      diamond_ore: new Array(6).fill(null).map(() => createMat(texDiamondOre)),
      diamond_block: new Array(6).fill(null).map(() => createMat(texDiamondBlock)),
      tnt: [
        createMat(texTNTSide),
        createMat(texTNTSide),
        createMat(texTNTTop),
        createMat(texTNTTop),
        createMat(texTNTSide),
        createMat(texTNTSide),
      ],
      water: new Array(6).fill(null).map(() => createMat(texWater, true, 0.7)),
    };

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);

    // Load Persistent World Delta
    let worldDelta = { placed: {} as Record<string, string>, removed: [] as string[] };
    try {
      const savedWorld = localStorage.getItem('llucos_minecraft_world');
      if (savedWorld) {
        const parsed = JSON.parse(savedWorld);
        if (parsed && typeof parsed === 'object') {
          worldDelta = {
            placed: parsed.placed || {},
            removed: Array.isArray(parsed.removed) ? parsed.removed : [],
          };
        }
      }
    } catch (e) {}

    const saveWorldDelta = () => {
      try {
        localStorage.setItem('llucos_minecraft_world', JSON.stringify(worldDelta));
      } catch (e) {}
    };

    const addBlock = (x: number, y: number, z: number, typeKey: string) => {
      const key = `${x},${y},${z}`;
      if (stateRef.current.voxelWorld.has(key)) return;

      const mats = blockMaterials[typeKey] || blockMaterials.grass;
      const mesh = new THREE.Mesh(boxGeo, mats);
      mesh.position.set(x, y, z);
      (mesh as any).blockType = typeKey;
      (mesh as any).blockKey = key;
      scene.add(mesh);
      stateRef.current.voxelWorld.set(key, mesh);
    };

    const removeBlockMesh = (key: string) => {
      const mesh = stateRef.current.voxelWorld.get(key);
      if (!mesh) return;
      scene.remove(mesh);
      stateRef.current.voxelWorld.delete(key);
    };

    // Procedural Minecraft Terrain Generator
    const worldRadius = 16;
    for (let x = -worldRadius; x <= worldRadius; x++) {
      for (let z = -worldRadius; z <= worldRadius; z++) {
        const height = Math.floor(
          Math.sin(x * 0.16) * 2.5 + Math.cos(z * 0.16) * 2.5 + 4
        );

        // Bedrock layer
        addBlock(x, 0, z, 'stone');

        // Subsurface stone & ores
        for (let y = 1; y < height - 1; y++) {
          const rand = Math.random();
          if (rand < 0.04 && y < 4) {
            addBlock(x, y, z, 'diamond_ore');
          } else if (rand < 0.2) {
            addBlock(x, y, z, 'cobblestone');
          } else {
            addBlock(x, y, z, 'stone');
          }
        }

        // Dirt subsoil
        if (height > 1) {
          addBlock(x, height - 1, z, 'dirt');
        }

        // Top Grass or Sand
        if (height <= 3) {
          addBlock(x, height, z, 'sand');
        } else {
          addBlock(x, height, z, 'grass');
        }

        // Oak Trees
        if (
          Math.abs(x) > 3 &&
          Math.abs(z) > 3 &&
          x % 7 === 0 &&
          z % 7 === 0 &&
          height > 3 &&
          Math.random() > 0.3
        ) {
          const trunkHeight = 4;
          for (let ty = 1; ty <= trunkHeight; ty++) {
            addBlock(x, height + ty, z, 'oak_log');
          }
          for (let lx = -2; lx <= 2; lx++) {
            for (let lz = -2; lz <= 2; lz++) {
              for (let ly = trunkHeight - 1; ly <= trunkHeight + 1; ly++) {
                if (Math.abs(lx) === 2 && Math.abs(lz) === 2 && ly === trunkHeight + 1) continue;
                addBlock(x + lx, height + ly, z + lz, 'oak_leaves');
              }
            }
          }
        }
      }
    }

    // Apply saved modifications
    if (worldDelta.removed.length > 0) {
      worldDelta.removed.forEach(k => removeBlockMesh(k));
    }
    if (worldDelta.placed) {
      Object.entries(worldDelta.placed).forEach(([k, typeKey]) => {
        const [x, y, z] = k.split(',').map(Number);
        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
          addBlock(x, y, z, typeKey);
        }
      });
    }

    // Target Block Outline Wireframe
    const wireGeo = new THREE.BoxGeometry(1.004, 1.004, 1.004);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const wireframeBox = new THREE.LineSegments(new THREE.WireframeGeometry(wireGeo), wireMat);
    wireframeBox.visible = false;
    scene.add(wireframeBox);
    stateRef.current.wireframeBox = wireframeBox;

    // Block Cracking Overlay Mesh
    const crackMat = new THREE.MeshBasicMaterial({
      map: crackTextures[0],
      transparent: true,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const crackMesh = new THREE.Mesh(new THREE.BoxGeometry(1.002, 1.002, 1.002), crackMat);
    crackMesh.visible = false;
    scene.add(crackMesh);
    stateRef.current.crackMesh = crackMesh;

    // First Person Player Arm / Hand in camera
    const handGroup = new THREE.Group();
    const armGeo = new THREE.BoxGeometry(0.25, 0.65, 0.25);
    const armMat = new THREE.MeshLambertMaterial({ color: 0xb88748 });
    const armMesh = new THREE.Mesh(armGeo, armMat);
    armMesh.position.set(0.42, -0.38, -0.6);
    armMesh.rotation.set(0.35, -0.28, 0.2);
    handGroup.add(armMesh);
    camera.add(handGroup);
    scene.add(camera);
    stateRef.current.handGroup = handGroup;

    // Spawn floating item drop helper
    const spawnItemDrop = (pos: THREE.Vector3, itemId: string) => {
      const dropGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      const mats = blockMaterials[itemId] || blockMaterials.dirt;
      const dropMesh = new THREE.Mesh(dropGeo, mats);
      dropMesh.position.copy(pos).add(new THREE.Vector3(0, 0.2, 0));
      scene.add(dropMesh);
      stateRef.current.floatingDrops.push({
        mesh: dropMesh,
        id: itemId,
        vel: new THREE.Vector3((Math.random() - 0.5) * 1.5, 3.5, (Math.random() - 0.5) * 1.5),
        born: performance.now(),
      });
    };

    // Item Pickup collector
    const collectDrop = (dropId: string) => {
      mcAudio.playItemPickup();
      setInventory(prev => {
        const next = [...prev];
        // 1. Try to stack into existing slot
        const existingIdx = next.findIndex(s => s && s.id === dropId && s.count < 64);
        if (existingIdx !== -1) {
          next[existingIdx] = { ...next[existingIdx]!, count: next[existingIdx]!.count + 1 };
          return next;
        }
        // 2. Put into first empty slot
        const emptyIdx = next.findIndex(s => s === null);
        if (emptyIdx !== -1) {
          next[emptyIdx] = { id: dropId, count: 1 };
          return next;
        }
        return next;
      });
    };

    // Break block completely
    const shatterBlock = (key: string, mesh: THREE.Mesh) => {
      const typeKey = (mesh as any).blockType || 'dirt';
      const def = BLOCK_DEFS[typeKey];
      mcAudio.playBlockBreak(def?.materialType || 'stone');

      // TNT detonation easter egg
      if (typeKey === 'tnt') {
        mcAudio.playExplosion();
        // Blow up surrounding 3x3x3 blocks
        const [bx, by, bz] = key.split(',').map(Number);
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
              const k = `${bx + dx},${by + dy},${bz + dz}`;
              removeBlockMesh(k);
              if (!worldDelta.removed.includes(k)) worldDelta.removed.push(k);
              delete worldDelta.placed[k];
            }
          }
        }
        saveWorldDelta();
        return;
      }

      // Normal block break
      removeBlockMesh(key);
      if (!worldDelta.removed.includes(key)) worldDelta.removed.push(key);
      delete worldDelta.placed[key];
      saveWorldDelta();

      // Drop item in survival mode or always
      if (def?.dropCount > 0) {
        spawnItemDrop(mesh.position, def.dropId);
      }
    };

    // Pointer Lock Listeners
    const onPointerLockChange = () => {
      const locked = document.pointerLockElement === container;
      if (!locked && stateRef.current.gameState === 'playing' && !stateRef.current.isInventoryOpen && !stateRef.current.isChatOpen) {
        setGameState('paused');
      }
    };
    document.addEventListener('pointerlockchange', onPointerLockChange);

    // Mouse Controls
    const onMouseDown = (e: MouseEvent) => {
      if (stateRef.current.gameState !== 'playing') return;
      if (stateRef.current.isInventoryOpen || stateRef.current.isChatOpen) return;

      if (document.pointerLockElement !== container) {
        container.requestPointerLock?.();
        return;
      }

      // Left click = start mining
      if (e.button === 0) {
        stateRef.current.isMouseDown = true;
        // Swing arm immediately
        if (stateRef.current.handGroup) {
          stateRef.current.handGroup.rotation.x = 0.6;
        }

        // Instant break in creative mode
        if (stateRef.current.gameMode === 'creative' && stateRef.current.targetedBlock) {
          shatterBlock(stateRef.current.targetedBlock.key, stateRef.current.targetedBlock.mesh);
        }
      }

      // Right click = place block
      if (e.button === 2) {
        e.preventDefault();
        if (stateRef.current.handGroup) {
          stateRef.current.handGroup.rotation.x = 0.5;
        }
        if (stateRef.current.targetedBlock) {
          const { point, normal } = stateRef.current.targetedBlock;
          const target = point.clone().add(normal.clone().multiplyScalar(0.5));
          const bx = Math.round(target.x);
          const by = Math.round(target.y);
          const bz = Math.round(target.z);

          // Check distance from player to avoid placing inside body
          const dist = camera.position.distanceTo(new THREE.Vector3(bx, by, bz));
          if (dist > 1.25) {
            const currentItem = stateRef.current.inventory[stateRef.current.selectedSlot];
            if (currentItem && BLOCK_DEFS[currentItem.id]) {
              const bType = currentItem.id;
              const def = BLOCK_DEFS[bType];
              mcAudio.playBlockPlace(def?.materialType || 'stone');
              addBlock(bx, by, bz, bType);
              const k = `${bx},${by},${bz}`;
              worldDelta.placed[k] = bType;
              worldDelta.removed = worldDelta.removed.filter(item => item !== k);
              saveWorldDelta();

              // In survival, decrement item count
              if (stateRef.current.gameMode === 'survival') {
                setInventory(prev => {
                  const next = [...prev];
                  const slot = stateRef.current.selectedSlot;
                  if (next[slot]) {
                    const newCount = next[slot]!.count - 1;
                    if (newCount <= 0) next[slot] = null;
                    else next[slot] = { ...next[slot]!, count: newCount };
                  }
                  return next;
                });
              }
            }
          }
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        stateRef.current.isMouseDown = false;
        stateRef.current.miningProgress = 0;
        stateRef.current.miningKey = null;
        if (crackMesh) crackMesh.visible = false;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== container) return;
      stateRef.current.yaw -= e.movementX * sensitivity;
      stateRef.current.pitch -= e.movementY * sensitivity;
      stateRef.current.pitch = Math.max(-Math.PI / 2 + 0.04, Math.min(Math.PI / 2 - 0.04, stateRef.current.pitch));
    };

    const onWheel = (e: WheelEvent) => {
      if (stateRef.current.isInventoryOpen) return;
      mcAudio.playClick();
      if (e.deltaY > 0) {
        setSelectedSlot(prev => (prev + 1) % 9);
      } else {
        setSelectedSlot(prev => (prev - 1 + 9) % 9);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.isChatOpen) return;

      const k = e.key.toLowerCase();
      if (k === 'w') stateRef.current.keys.w = true;
      if (k === 'a') stateRef.current.keys.a = true;
      if (k === 's') stateRef.current.keys.s = true;
      if (k === 'd') stateRef.current.keys.d = true;
      if (e.code === 'Space') stateRef.current.keys.space = true;
      if (e.key === 'Shift') stateRef.current.keys.shift = true;

      // 1-9 Hotbar selection
      const num = parseInt(k, 10);
      if (num >= 1 && num <= 9) {
        mcAudio.playClick();
        setSelectedSlot(num - 1);
      }

      // E = Open / Close Inventory
      if (k === 'e') {
        e.preventDefault();
        if (stateRef.current.gameState === 'playing') {
          mcAudio.playClick();
          setIsInventoryOpen(prev => {
            const next = !prev;
            if (next && document.pointerLockElement === container) {
              document.exitPointerLock?.();
            }
            return next;
          });
        }
      }

      // T or / = Open Chat
      if (k === 't' || k === '/') {
        e.preventDefault();
        if (stateRef.current.gameState === 'playing' && !stateRef.current.isInventoryOpen) {
          if (document.pointerLockElement === container) {
            document.exitPointerLock?.();
          }
          setIsChatOpen(true);
          if (k === '/') setChatInput('/');
        }
      }

      // Escape = Pause Menu
      if (e.key === 'Escape') {
        if (stateRef.current.isInventoryOpen) {
          setIsInventoryOpen(false);
        } else if (stateRef.current.isChatOpen) {
          setIsChatOpen(false);
        } else if (stateRef.current.gameState === 'playing') {
          setGameState('paused');
        } else if (stateRef.current.gameState === 'paused') {
          setGameState('playing');
          container.requestPointerLock?.();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w') stateRef.current.keys.w = false;
      if (k === 'a') stateRef.current.keys.a = false;
      if (k === 's') stateRef.current.keys.s = false;
      if (k === 'd') stateRef.current.keys.d = false;
      if (e.code === 'Space') stateRef.current.keys.space = false;
      if (e.key === 'Shift') stateRef.current.keys.shift = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('wheel', onWheel, { passive: true });
    container.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Main Game Loop
    let animId = 0;
    const clock = new THREE.Clock();
    let stepTimer = 0;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.08);
      const state = stateRef.current;

      // Arm swing reset
      if (state.handGroup) {
        state.handGroup.rotation.x = THREE.MathUtils.lerp(state.handGroup.rotation.x, 0, 0.15);
      }

      if (state.gameState === 'playing' && !state.isInventoryOpen && !state.isChatOpen) {
        // 1. Camera Look
        camera.rotation.order = 'YXZ';
        camera.rotation.y = state.yaw;
        camera.rotation.x = state.pitch;

        // 2. Player Movement
        const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), state.yaw);
        const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), state.yaw);
        const move = new THREE.Vector3();

        if (state.keys.w) move.add(forward);
        if (state.keys.s) move.sub(forward);
        if (state.keys.d) move.add(right);
        if (state.keys.a) move.sub(right);
        if (move.lengthSq() > 0) move.normalize();

        const moveSpeed = state.keys.shift ? 4.0 : 8.5;
        camera.position.addScaledVector(move, moveSpeed * delta);

        // Jump / Gravity
        if (state.gameMode === 'creative') {
          if (state.keys.space) camera.position.y += 8 * delta;
          if (state.keys.shift) camera.position.y -= 8 * delta;
        } else {
          // Survival Gravity & Floor collision
          if (state.keys.space && state.onGround) {
            state.vel.y = 8.5;
            state.onGround = false;
            mcAudio.playFootstep('stone');
          }
          state.vel.y -= 22 * delta; // Gravity
          camera.position.y += state.vel.y * delta;
          if (camera.position.y < 2.5) {
            camera.position.y = 2.5;
            state.vel.y = 0;
            state.onGround = true;
          }
        }

        // Footstep sound when moving
        if (move.lengthSq() > 0 && state.onGround) {
          stepTimer += delta;
          if (stepTimer > (state.keys.shift ? 0.45 : 0.32)) {
            mcAudio.playFootstep('grass');
            stepTimer = 0;
          }
        }

        // 3. Raycast Crosshair to Block
        state.raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const meshes = Array.from(state.voxelWorld.values());
        const intersects = state.raycaster.intersectObjects(meshes, false);

        if (intersects.length > 0 && intersects[0].distance < 7.5) {
          const hit = intersects[0];
          const mesh = hit.object as THREE.Mesh;
          const normal = hit.face?.normal || new THREE.Vector3(0, 1, 0);

          wireframeBox.position.copy(mesh.position);
          wireframeBox.visible = true;

          state.targetedBlock = {
            key: (mesh as any).blockKey,
            point: mesh.position.clone(),
            normal: normal.clone(),
            mesh,
          };

          // Continuous Mining in Survival mode
          if (state.isMouseDown && state.gameMode === 'survival') {
            const currentKey = state.targetedBlock.key;
            if (state.miningKey !== currentKey) {
              state.miningKey = currentKey;
              state.miningProgress = 0;
            }

            const def = BLOCK_DEFS[(mesh as any).blockType || 'dirt'];
            const hardness = def ? def.hardness : 1.0;
            state.miningProgress += delta / hardness;

            // Dig tick sound
            const now = performance.now();
            if (now - state.lastTickTime > 180) {
              mcAudio.playDigTick(def?.materialType || 'stone');
              state.lastTickTime = now;
            }

            // Update crack overlay
            crackMesh.position.copy(mesh.position);
            const stage = Math.min(4, Math.floor(state.miningProgress * 5));
            (crackMesh.material as THREE.MeshBasicMaterial).map = crackTextures[stage];
            crackMesh.visible = true;

            // Broken!
            if (state.miningProgress >= 1.0) {
              shatterBlock(currentKey, mesh);
              state.miningProgress = 0;
              crackMesh.visible = false;
            }
          } else {
            crackMesh.visible = false;
          }
        } else {
          wireframeBox.visible = false;
          crackMesh.visible = false;
          state.targetedBlock = null;
          state.miningProgress = 0;
        }

        // 4. Update Floating Item Drops (Rotate, Bob, & Magnetize to Player)
        const playerPos = camera.position;
        for (let i = state.floatingDrops.length - 1; i >= 0; i--) {
          const drop = state.floatingDrops[i];
          drop.mesh.rotation.y += delta * 2.5;

          // Physics
          drop.vel.y -= 9.8 * delta;
          drop.mesh.position.addScaledVector(drop.vel, delta);
          if (drop.mesh.position.y < 1.0) {
            drop.mesh.position.y = 1.0;
            drop.vel.set(0, 0, 0);
          }

          // Magnet to player
          const dist = drop.mesh.position.distanceTo(playerPos);
          if (dist < 2.0) {
            scene.remove(drop.mesh);
            state.floatingDrops.splice(i, 1);
            collectDrop(drop.id);
          }
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
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [fov, sensitivity]);

  // Handle Chat Command Submission
  const handleSendChat = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) {
      setIsChatOpen(false);
      return;
    }

    const raw = chatInput.trim();
    setChatMessages(prev => [...prev.slice(-15), `§f<Lluc> ${raw}`]);

    if (raw.startsWith('/')) {
      const parts = raw.slice(1).split(' ');
      const cmd = parts[0]?.toLowerCase();
      const arg1 = parts[1]?.toLowerCase();
      const arg2 = parts[2];

      if (cmd === 'gamemode') {
        if (arg1 === 'creative' || arg1 === '1' || arg1 === 'c') {
          setGameMode('creative');
          setChatMessages(prev => [...prev, '§aModo de juego cambiado a ¡CREATIVO!']);
        } else {
          setGameMode('survival');
          setChatMessages(prev => [...prev, '§aModo de juego cambiado a ¡SUPERVIVENCIA!']);
        }
      } else if (cmd === 'time') {
        if (arg1 === 'day') {
          setIsDay(true);
          setChatMessages(prev => [...prev, '§eTiempo establecido en DÍA.']);
        } else if (arg1 === 'night') {
          setIsDay(false);
          setChatMessages(prev => [...prev, '§9Tiempo establecido en NOCHE.']);
        }
      } else if (cmd === 'give') {
        const itemKey = arg1;
        const count = parseInt(arg2 || '64', 10);
        if (BLOCK_DEFS[itemKey] || ITEM_COLORS[itemKey]) {
          setInventory(prev => {
            const next = [...prev];
            const emptyIdx = next.findIndex(s => s === null);
            if (emptyIdx !== -1) next[emptyIdx] = { id: itemKey, count };
            return next;
          });
          setChatMessages(prev => [...prev, `§aEntregado ${count} de ${itemKey} a Lluc.`]);
        } else {
          setChatMessages(prev => [...prev, `§cBloque desconocido "${itemKey}".`]);
        }
      } else if (cmd === 'clear') {
        setInventory(new Array(36).fill(null));
        setChatMessages(prev => [...prev, '§7Inventario limpiado.']);
      } else if (cmd === 'help') {
        setChatMessages(prev => [
          ...prev,
          '§6--- Comandos disponibles ---',
          '§e/gamemode <creative|survival>',
          '§e/time <day|night>',
          '§e/give <bloque> [cantidad]',
          '§e/clear',
        ]);
      } else {
        setChatMessages(prev => [...prev, `§cComando desconocido "${cmd}". Escribe /help para ayuda.`]);
      }
    }

    setChatInput('');
    setIsChatOpen(false);
  };

  // Start Playing from Title
  const handleStartGame = () => {
    mcAudio.playClick();
    setGameState('playing');
    setTimeout(() => {
      mountRef.current?.requestPointerLock?.();
    }, 100);
  };

  // Inventory Slot Click Handler (Moving item stacks)
  const handleInventorySlotClick = (index: number) => {
    mcAudio.playClick();
    setInventory(prev => {
      const next = [...prev];
      const slotItem = next[index];

      // If holding an item and clicking an empty slot -> drop held item into slot
      if (heldItem && !slotItem) {
        next[index] = heldItem;
        setHeldItem(null);
      }
      // If holding an item of same type -> merge stack up to 64
      else if (heldItem && slotItem && heldItem.id === slotItem.id) {
        const total = slotItem.count + heldItem.count;
        if (total <= 64) {
          next[index] = { ...slotItem, count: total };
          setHeldItem(null);
        } else {
          next[index] = { ...slotItem, count: 64 };
          setHeldItem({ ...heldItem, count: total - 64 });
        }
      }
      // If holding item of different type -> swap
      else if (heldItem && slotItem && heldItem.id !== slotItem.id) {
        next[index] = heldItem;
        setHeldItem(slotItem);
      }
      // If empty hand and clicking slot -> pick up entire stack
      else if (!heldItem && slotItem) {
        setHeldItem(slotItem);
        next[index] = null;
      }
      return next;
    });
  };

  // Crafting Grid Slot Click Handler
  const handleCraftingGridClick = (gridIdx: number) => {
    mcAudio.playClick();
    setCraftingGrid(prev => {
      const next = [...prev];
      const slotItem = next[gridIdx];

      if (heldItem && !slotItem) {
        next[gridIdx] = heldItem;
        setHeldItem(null);
      } else if (heldItem && slotItem && heldItem.id === slotItem.id) {
        next[gridIdx] = { ...slotItem, count: Math.min(64, slotItem.count + heldItem.count) };
        setHeldItem(null);
      } else if (heldItem && slotItem) {
        next[gridIdx] = heldItem;
        setHeldItem(slotItem);
      } else if (!heldItem && slotItem) {
        setHeldItem(slotItem);
        next[gridIdx] = null;
      }
      return next;
    });
  };

  // Craft Result Pick Handler
  const handleTakeCraftResult = () => {
    if (!craftingResult) return;
    mcAudio.playCraftSuccess();

    // Give result to held item or inventory
    if (!heldItem) {
      setHeldItem(craftingResult);
    } else if (heldItem.id === craftingResult.id && heldItem.count + craftingResult.count <= 64) {
      setHeldItem({ ...heldItem, count: heldItem.count + craftingResult.count });
    } else {
      return; // Hand is full with another item
    }

    // Decrement 1 from all grid slots
    setCraftingGrid(prev =>
      prev.map(item => {
        if (!item) return null;
        const newCount = item.count - 1;
        return newCount > 0 ? { ...item, count: newCount } : null;
      })
    );
  };

  return (
    <div className="relative w-full h-full bg-[#14110e] overflow-hidden select-none font-sans text-white">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />

      {/* ============================================================== */}
      {/* 1. TITLE SCREEN (Eaglercraft Classic Dirt Menu) */}
      {/* ============================================================== */}
      {gameState === 'title' && (
        <div className="absolute inset-0 z-50 bg-[#1c1815] bg-opacity-95 flex flex-col items-center justify-between p-6">
          {/* Top Title Banner */}
          <div className="flex flex-col items-center mt-6 relative">
            <h1 className="text-5xl sm:text-6xl font-black tracking-widest text-[#d4af37] drop-shadow-[0_6px_0_#4a3b10] uppercase font-mono">
              llucCraft 3D
            </h1>
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/80 px-3 py-0.5 rounded border border-emerald-500/40 mt-1">
              Eaglercraft WebGL 1.8.8 Edition
            </div>

            {/* Wobbling Yellow Splash Text */}
            <div className="absolute -bottom-6 -right-12 sm:-right-20 rotate-[-18deg] animate-pulse">
              <span className="text-amber-300 font-black text-sm sm:text-base drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] bg-black/60 px-2 py-0.5 rounded border border-amber-400/40">
                {splashText}
              </span>
            </div>
          </div>

          {/* Classic Minecraft Gray Beveled Buttons */}
          <div className="flex flex-col gap-3 w-80 max-w-full">
            <button
              type="button"
              onClick={handleStartGame}
              className="w-full py-2.5 px-4 bg-[#7a7a7a] hover:bg-[#8e8e8e] active:bg-[#666666] border-t-2 border-l-2 border-[#b8b8b8] border-b-2 border-r-2 border-[#333333] text-white font-bold text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Un Jugador (Jugar Mundo)
            </button>

            <button
              type="button"
              onClick={() => {
                mcAudio.playClick();
                setGameMode(prev => prev === 'creative' ? 'survival' : 'creative');
              }}
              className="w-full py-2 px-4 bg-[#666666] hover:bg-[#777777] active:bg-[#555555] border-t-2 border-l-2 border-[#999999] border-b-2 border-r-2 border-[#2b2b2b] text-white font-bold text-xs tracking-wider shadow-lg flex items-center justify-between cursor-pointer"
            >
              <span>Modo de Juego:</span>
              <span className={gameMode === 'creative' ? 'text-amber-300' : 'text-lime-300'}>
                {gameMode === 'creative' ? 'Creativo' : 'Supervivencia'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                mcAudio.playClick();
                setShowSettingsModal(true);
              }}
              className="w-full py-2 px-4 bg-[#666666] hover:bg-[#777777] active:bg-[#555555] border-t-2 border-l-2 border-[#999999] border-b-2 border-r-2 border-[#2b2b2b] text-white font-bold text-xs tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Opciones...
            </button>

            <button
              type="button"
              onClick={() => {
                mcAudio.playClick();
                localStorage.removeItem('llucos_minecraft_world');
                window.location.reload();
              }}
              className="w-full py-2 px-4 bg-[#522] hover:bg-[#722] border-t-2 border-l-2 border-[#a44] border-b-2 border-r-2 border-[#200] text-red-200 font-bold text-xs tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar Mundo a Cero
            </button>
          </div>

          {/* Footer Info */}
          <div className="w-full flex items-center justify-between text-[11px] text-stone-400 font-mono">
            <span>llucCraft 3D: Eaglercraft 1.8.8</span>
            <span>Copyright Mojang / Port WebGL por llucOS</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. PAUSE MENU (Esc) */}
      {/* ============================================================== */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="bg-[#4a4a4a] border-4 border-[#222222] p-6 rounded-lg w-84 max-w-full shadow-2xl flex flex-col items-center gap-3">
            <h2 className="text-xl font-bold tracking-widest text-[#f5f5f5] drop-shadow mb-2 font-mono uppercase">
              Juego en Pausa
            </h2>

            <button
              type="button"
              onClick={() => {
                mcAudio.playClick();
                setGameState('playing');
                mountRef.current?.requestPointerLock?.();
              }}
              className="w-full py-2.5 bg-[#7a7a7a] hover:bg-[#8e8e8e] border-t-2 border-l-2 border-[#b8b8b8] border-b-2 border-r-2 border-[#2b2b2b] font-bold text-sm tracking-wide cursor-pointer"
            >
              Volver al Juego
            </button>

            <button
              type="button"
              onClick={() => {
                mcAudio.playClick();
                setShowSettingsModal(true);
              }}
              className="w-full py-2 bg-[#666666] hover:bg-[#777777] border-t-2 border-l-2 border-[#999999] border-b-2 border-r-2 border-[#2b2b2b] font-bold text-xs tracking-wide cursor-pointer flex items-center justify-center gap-2"
            >
              <Settings className="w-3.5 h-3.5" />
              Opciones de Gráficos / FOV
            </button>

            <button
              type="button"
              onClick={() => {
                mcAudio.playClick();
                setGameState('title');
              }}
              className="w-full py-2 bg-[#553333] hover:bg-[#773333] border-t-2 border-l-2 border-[#994444] border-b-2 border-r-2 border-[#221111] font-bold text-xs tracking-wide text-red-200 cursor-pointer"
            >
              Guardar y Salir al Menú Principal
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. SETTINGS MODAL */}
      {/* ============================================================== */}
      {showSettingsModal && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#3a3a3a] border-4 border-[#1f1f1f] p-5 rounded-lg w-96 max-w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-stone-600 pb-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-amber-300 font-mono">
                Opciones de llucCraft
              </h3>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-mono">
                  <span>Campo de Visión (FOV):</span>
                  <span className="text-amber-300 font-bold">{fov}°</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="110"
                  value={fov}
                  onChange={e => setFov(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 font-mono">
                  <span>Sensibilidad del Ratón:</span>
                  <span className="text-amber-300 font-bold">{Math.round(sensitivity * 10000)}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={Math.round(sensitivity * 10000)}
                  onChange={e => setSensitivity(Number(e.target.value) / 10000)}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-700">
                <span>Modo de Tiempo:</span>
                <button
                  type="button"
                  onClick={() => setIsDay(prev => !prev)}
                  className="px-3 py-1 bg-stone-700 hover:bg-stone-600 rounded text-xs font-bold"
                >
                  {isDay ? '☀️ Día soleado' : '🌙 Noche estrellada'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                mcAudio.playClick();
                setShowSettingsModal(false);
              }}
              className="w-full py-2 bg-[#7a7a7a] hover:bg-[#8e8e8e] border-t-2 border-l-2 border-[#b8b8b8] border-b-2 border-r-2 border-[#2b2b2b] font-bold text-xs tracking-wide cursor-pointer mt-2"
            >
              Listo
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. IN-GAME INVENTORY & CRAFTING GUI ('E') */}
      {/* ============================================================== */}
      {isInventoryOpen && (
        <div className="absolute inset-0 z-40 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#c6c6c6] border-4 border-[#373737] p-4 rounded-sm shadow-2xl text-stone-900 font-mono w-[380px] max-w-full relative">
            <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-[#8b8b8b]">
              <span className="font-bold text-sm tracking-wider">Fabricación</span>
              <button
                type="button"
                onClick={() => setIsInventoryOpen(false)}
                className="text-stone-700 hover:text-black font-bold text-xs px-1.5 py-0.5 bg-stone-300 border border-stone-500 rounded"
              >
                ✕ Esc
              </button>
            </div>

            {/* 2x2 Crafting Grid */}
            <div className="flex items-center justify-center gap-4 bg-[#b5b5b5] p-3 rounded border-2 border-[#8b8b8b] mb-4">
              <div className="grid grid-cols-2 gap-1.5">
                {[0, 1, 2, 3].map(idx => {
                  const item = craftingGrid[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleCraftingGridClick(idx)}
                      className="w-10 h-10 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] flex items-center justify-center relative cursor-pointer hover:bg-[#999999]"
                    >
                      {item && (
                        <>
                          <div
                            className="w-6 h-6 border border-black/40 shadow-sm"
                            style={{ backgroundColor: ITEM_COLORS[item.id] || '#777777' }}
                          />
                          <span className="absolute bottom-0.5 right-1 text-[10px] font-black text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                            {item.count}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Crafting Arrow */}
              <div className="text-xl font-black text-stone-700">➔</div>

              {/* Result Slot */}
              <button
                type="button"
                onClick={handleTakeCraftResult}
                className="w-12 h-12 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] flex items-center justify-center relative cursor-pointer hover:bg-[#999999]"
                title="Tomar resultado"
              >
                {craftingResult && (
                  <>
                    <div
                      className="w-8 h-8 border-2 border-black/60 shadow-md animate-pulse"
                      style={{ backgroundColor: ITEM_COLORS[craftingResult.id] || '#777777' }}
                    />
                    <span className="absolute bottom-0.5 right-1 text-xs font-black text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                      {craftingResult.count}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Main Backpack (27 slots) */}
            <div className="mb-2">
              <span className="text-xs font-bold text-stone-700 block mb-1">Inventario</span>
              <div className="grid grid-cols-9 gap-1 bg-[#8b8b8b] p-1.5 border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff]">
                {inventory.slice(9, 36).map((item, idx) => {
                  const actualIdx = idx + 9;
                  return (
                    <button
                      key={actualIdx}
                      type="button"
                      onClick={() => handleInventorySlotClick(actualIdx)}
                      className="w-8 h-8 bg-[#8b8b8b] border border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] flex items-center justify-center relative cursor-pointer hover:bg-[#a0a0a0]"
                    >
                      {item && (
                        <>
                          <div
                            className="w-5 h-5 border border-black/40 shadow-xs"
                            style={{ backgroundColor: ITEM_COLORS[item.id] || '#777777' }}
                          />
                          <span className="absolute bottom-0 right-0.5 text-[9px] font-black text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                            {item.count}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hotbar (9 slots) */}
            <div>
              <span className="text-xs font-bold text-stone-700 block mb-1">Barra Rápida</span>
              <div className="grid grid-cols-9 gap-1 bg-[#8b8b8b] p-1.5 border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff]">
                {inventory.slice(0, 9).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInventorySlotClick(idx)}
                    className="w-8 h-8 bg-[#8b8b8b] border border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] flex items-center justify-center relative cursor-pointer hover:bg-[#a0a0a0]"
                  >
                    {item && (
                      <>
                        <div
                          className="w-5 h-5 border border-black/40 shadow-xs"
                          style={{ backgroundColor: ITEM_COLORS[item.id] || '#777777' }}
                        />
                        <span className="absolute bottom-0 right-0.5 text-[9px] font-black text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                          {item.count}
                        </span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Held item on mouse cursor indicator */}
            {heldItem && (
              <div className="mt-2 text-xs text-amber-900 font-bold bg-amber-200/80 p-1.5 rounded flex items-center justify-between">
                <span>En mano: {BLOCK_DEFS[heldItem.id]?.name || heldItem.id} ({heldItem.count})</span>
                <span className="text-[10px] text-stone-600">Click en ranura para soltar</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. IN-GAME HUD & CROSSHAIR */}
      {/* ============================================================== */}
      {gameState === 'playing' && (
        <>
          {/* Center Crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 opacity-80">
            <div className="w-5 h-5 flex items-center justify-center relative">
              <div className="absolute w-3.5 h-[2px] bg-white mix-blend-difference" />
              <div className="absolute h-3.5 w-[2px] bg-white mix-blend-difference" />
            </div>
          </div>

          {/* Top Bar Quick Controls */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setGameState('paused')}
                className="bg-black/70 hover:bg-black/90 border border-white/20 px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider text-white shadow-xl cursor-pointer"
              >
                Pausa (Esc)
              </button>

              <button
                type="button"
                onClick={() => {
                  mcAudio.playClick();
                  setIsDay(prev => !prev);
                }}
                className="bg-black/70 hover:bg-black/90 border border-white/20 p-1.5 rounded text-white shadow-xl cursor-pointer"
                title="Alternar Día / Noche"
              >
                {isDay ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  mcAudio.playClick();
                  setIsInventoryOpen(prev => !prev);
                }}
                className="bg-black/70 hover:bg-black/90 border border-white/20 px-2.5 py-1.5 rounded text-xs font-mono font-bold text-amber-300 shadow-xl cursor-pointer flex items-center gap-1.5"
              >
                <Hammer className="w-3.5 h-3.5" />
                <span>Inventario [E]</span>
              </button>
            </div>

            <div className="bg-black/70 border border-white/20 px-3 py-1 rounded text-[11px] font-mono text-stone-300 pointer-events-auto">
              <span>Modo: <strong className={gameMode === 'creative' ? 'text-amber-400' : 'text-emerald-400'}>{gameMode.toUpperCase()}</strong></span>
            </div>
          </div>

          {/* Chat Messages Log (Bottom Left) */}
          <div className="absolute bottom-28 left-4 z-20 pointer-events-none flex flex-col gap-1 max-w-sm">
            {chatMessages.slice(-6).map((msg, i) => (
              <div
                key={i}
                className="bg-black/60 px-2 py-0.5 rounded text-[12px] font-mono text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)]"
              >
                {msg}
              </div>
            ))}
          </div>

          {/* Active Chat Input Bar */}
          {isChatOpen && (
            <div className="absolute bottom-20 left-4 right-4 z-40">
              <form onSubmit={handleSendChat} className="flex gap-2 bg-black/85 p-2 rounded border border-white/30 shadow-2xl">
                <input
                  type="text"
                  autoFocus
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Escribe un comando (/help, /gamemode creative, /time day, /give diamond_block 64)..."
                  className="flex-1 bg-transparent border-none text-white font-mono text-xs focus:outline-hidden px-2"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold font-mono rounded"
                >
                  Enviar
                </button>
              </form>
            </div>
          )}

          {/* Authentic Minecraft Bottom HUD */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none">
            {/* Tooltip of selected item name */}
            {selectedItemTooltip && (
              <div className="text-xs font-bold font-mono text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] bg-black/70 px-2.5 py-0.5 rounded border border-white/20 animate-fade-in">
                {selectedItemTooltip}
              </div>
            )}

            {/* Survival Hearts & Hunger drumsticks */}
            {gameMode === 'survival' && (
              <div className="flex items-center justify-between w-80 px-1 text-xs">
                {/* 10 Red Hearts */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="w-3.5 h-3.5 text-red-500 drop-shadow">
                      ❤️
                    </div>
                  ))}
                </div>

                {/* Level Badge */}
                <span className="font-extrabold text-sm text-lime-400 font-mono drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
                  {level}
                </span>

                {/* 10 Drumsticks */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="w-3.5 h-3.5 text-amber-500 drop-shadow">
                      🍗
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Green Experience Bar */}
            <div className="w-80 bg-black/80 h-1.5 rounded-full border border-black/90 p-[1px] overflow-hidden">
              <div className="bg-lime-400 h-full w-[78%] shadow-sm" />
            </div>

            {/* 9-Slot Minecraft Hotbar */}
            <div className="bg-stone-900/90 border-2 border-stone-600 rounded-lg p-1 flex items-center gap-1 shadow-2xl pointer-events-auto backdrop-blur-md">
              {inventory.slice(0, 9).map((item, idx) => {
                const isSelected = selectedSlot === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      mcAudio.playClick();
                      setSelectedSlot(idx);
                    }}
                    className={`w-10 h-10 rounded flex flex-col items-center justify-center relative transition-all border ${
                      isSelected
                        ? 'border-white bg-white/30 scale-105 ring-2 ring-white shadow-xl'
                        : 'border-stone-700 bg-stone-800/80 hover:bg-stone-700/80'
                    }`}
                  >
                    {item && (
                      <>
                        <div
                          className="w-5 h-5 rounded-xs shadow-md border border-black/40"
                          style={{ backgroundColor: ITEM_COLORS[item.id] || '#777777' }}
                        />
                        <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-white font-black drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                          {item.count}
                        </span>
                      </>
                    )}
                    <span className="absolute top-0.5 left-1 text-[8px] font-mono text-white/50">
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
