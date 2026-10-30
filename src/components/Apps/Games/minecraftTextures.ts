/**
 * Procedural 16x16 Pixel Art Minecraft Textures Generator
 * Creates authentic pixelated canvas textures matching classic Minecraft / Eaglercraft.
 */
import * as THREE from 'three';

// Seeded pseudorandom helper for deterministic, crisp pixel art
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function create16x16Canvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  return [canvas, ctx];
}

function canvasToTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 1. Grass Top
export function generateGrassTopTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  const baseGreens = ['#4c7e2b', '#578e32', '#609a37', '#426f24', '#68a83c'];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = Math.floor(pseudoRandom(x * 17 + y * 31) * baseGreens.length);
      ctx.fillStyle = baseGreens[idx];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvasToTexture(canvas);
}

// 2. Dirt Block / Bottom
export function generateDirtTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  const dirtBrowns = ['#725438', '#866543', '#5a412c', '#7d5e3f', '#96714c'];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = Math.floor(pseudoRandom(x * 23 + y * 41 + 101) * dirtBrowns.length);
      ctx.fillStyle = dirtBrowns[idx];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvasToTexture(canvas);
}

// 3. Grass Side (Dirt with green hanging fringe)
export function generateGrassSideTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  // Base dirt
  const dirtBrowns = ['#725438', '#866543', '#5a412c', '#7d5e3f', '#96714c'];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = Math.floor(pseudoRandom(x * 23 + y * 41 + 101) * dirtBrowns.length);
      ctx.fillStyle = dirtBrowns[idx];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  // Grass fringe on top
  const baseGreens = ['#4c7e2b', '#578e32', '#609a37', '#68a83c'];
  const fringeDepths = [3, 4, 3, 5, 4, 3, 4, 5, 3, 4, 3, 5, 4, 3, 4, 3];
  for (let x = 0; x < 16; x++) {
    const depth = fringeDepths[x];
    for (let y = 0; y < depth; y++) {
      const idx = Math.floor(pseudoRandom(x * 19 + y * 13) * baseGreens.length);
      ctx.fillStyle = baseGreens[idx];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvasToTexture(canvas);
}

// 4. Stone
export function generateStoneTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  const stoneGrays = ['#6e6e6e', '#7b7b7b', '#858585', '#616161', '#919191'];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = Math.floor(pseudoRandom(x * 47 + y * 61 + 300) * stoneGrays.length);
      ctx.fillStyle = stoneGrays[idx];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvasToTexture(canvas);
}

// 5. Cobblestone
export function generateCobblestoneTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  ctx.fillStyle = '#4a4a4a';
  ctx.fillRect(0, 0, 16, 16);
  const stonePebbles = ['#737373', '#858585', '#636363', '#969696', '#525252'];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const isBorder = (x % 4 === 0 && y % 3 === 0) || (x % 5 === 0 && (y + 1) % 4 === 0);
      if (isBorder) {
        ctx.fillStyle = '#3a3a3a';
      } else {
        const idx = Math.floor(pseudoRandom(x * 37 + y * 19 + 500) * stonePebbles.length);
        ctx.fillStyle = stonePebbles[idx];
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvasToTexture(canvas);
}

// 6. Oak Planks
export function generateOakPlanksTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  const plankTones = ['#a27743', '#af834d', '#966d3b', '#b98c54', '#8b6435'];
  for (let y = 0; y < 16; y++) {
    const isPlankBorder = y === 3 || y === 7 || y === 11 || y === 15;
    for (let x = 0; x < 16; x++) {
      if (isPlankBorder) {
        ctx.fillStyle = '#614623';
      } else {
        const isSeam = (y < 4 && x === 8) || (y >= 4 && y < 8 && x === 14) || (y >= 8 && y < 12 && x === 4) || (y >= 12 && x === 11);
        if (isSeam) {
          ctx.fillStyle = '#614623';
        } else {
          const idx = Math.floor(pseudoRandom(x * 13 + y * 43 + 700) * plankTones.length);
          ctx.fillStyle = plankTones[idx];
        }
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvasToTexture(canvas);
}

// 7. Oak Log Side (Bark)
export function generateOakLogSideTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  const barkTones = ['#5a4329', '#6d5132', '#4b3722', '#765938', '#412f1d'];
  for (let x = 0; x < 16; x++) {
    const colBase = Math.floor(pseudoRandom(x * 53) * barkTones.length);
    for (let y = 0; y < 16; y++) {
      const variation = Math.floor(pseudoRandom(x * 11 + y * 3) * 2);
      ctx.fillStyle = barkTones[(colBase + variation) % barkTones.length];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvasToTexture(canvas);
}

// 8. Oak Log Top (Tree rings)
export function generateOakLogTopTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const isBark = x < 2 || x > 13 || y < 2 || y > 13;
      if (isBark) {
        ctx.fillStyle = pseudoRandom(x + y * 16) > 0.5 ? '#5a4329' : '#4b3722';
      } else {
        const dx = x - 7.5;
        const dy = y - 7.5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 2) {
          ctx.fillStyle = '#8f673c';
        } else if (dist < 4) {
          ctx.fillStyle = '#b38654';
        } else if (dist < 5.5) {
          ctx.fillStyle = '#9b7144';
        } else {
          ctx.fillStyle = '#b38654';
        }
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvasToTexture(canvas);
}

// 9. Oak Leaves (Mottled with transparent holes)
export function generateOakLeavesTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  const leafGreens = ['#2b5718', '#34661e', '#234613', '#3d7723', '#1e3d10'];
  ctx.clearRect(0, 0, 16, 16);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const isHole = pseudoRandom(x * 19 + y * 23 + 42) < 0.18;
      if (!isHole) {
        const idx = Math.floor(pseudoRandom(x * 7 + y * 29) * leafGreens.length);
        ctx.fillStyle = leafGreens[idx];
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  return canvasToTexture(canvas);
}

// 10. Glass Pane (Translucent with white glare highlight lines)
export function generateGlassTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  ctx.clearRect(0, 0, 16, 16);
  // Border
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let i = 0; i < 16; i++) {
    ctx.fillRect(i, 0, 1, 1);
    ctx.fillRect(i, 15, 1, 1);
    ctx.fillRect(0, i, 1, 1);
    ctx.fillRect(15, i, 1, 1);
  }
  // Glare streaks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillRect(2, 2, 2, 1);
  ctx.fillRect(3, 3, 2, 1);
  ctx.fillRect(4, 4, 1, 1);

  ctx.fillRect(10, 10, 2, 1);
  ctx.fillRect(11, 11, 2, 1);
  return canvasToTexture(canvas);
}

// 11. Diamond Ore
export function generateDiamondOreTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  // Stone base
  const stoneGrays = ['#6e6e6e', '#7b7b7b', '#858585', '#616161'];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = Math.floor(pseudoRandom(x * 47 + y * 61 + 300) * stoneGrays.length);
      ctx.fillStyle = stoneGrays[idx];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  // Diamond flecks
  const gemPixels = [
    [3, 3], [4, 3], [3, 4], [4, 4], [5, 4],
    [10, 6], [11, 6], [10, 7], [12, 7],
    [6, 11], [7, 11], [6, 12], [8, 12],
    [12, 12], [13, 12], [12, 13]
  ];
  gemPixels.forEach(([gx, gy]) => {
    ctx.fillStyle = pseudoRandom(gx + gy * 7) > 0.4 ? '#4bede0' : '#2cc7be';
    ctx.fillRect(gx, gy, 1, 1);
  });
  return canvasToTexture(canvas);
}

// 12. Diamond Block
export function generateDiamondBlockTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const isBorder = x === 0 || x === 15 || y === 0 || y === 15;
      const isHighlight = x === 1 || y === 1;
      if (isBorder) {
        ctx.fillStyle = '#2fb8ae';
      } else if (isHighlight) {
        ctx.fillStyle = '#9cf5ee';
      } else {
        const blues = ['#5bf3e7', '#4be5d9', '#6df7ec', '#3ed0c4'];
        const idx = Math.floor(pseudoRandom(x * 19 + y * 23) * blues.length);
        ctx.fillStyle = blues[idx];
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvasToTexture(canvas);
}

// 13. Crafting Table Top
export function generateCraftingTableTopTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  // Planks base
  ctx.fillStyle = '#a27743';
  ctx.fillRect(0, 0, 16, 16);
  // Dark borders
  ctx.strokeStyle = '#5a3f20';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, 15, 15);
  // 3x3 crafting grid in center
  ctx.fillStyle = '#7a552c';
  ctx.fillRect(3, 3, 10, 10);
  ctx.fillStyle = '#d6b88d';
  for (let gx = 0; gx < 3; gx++) {
    for (let gy = 0; gy < 3; gy++) {
      ctx.fillRect(4 + gx * 3, 4 + gy * 3, 2, 2);
    }
  }
  return canvasToTexture(canvas);
}

// 14. Crafting Table Side
export function generateCraftingTableSideTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  // Oak plank base
  const plankTones = ['#a27743', '#af834d', '#966d3b'];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      ctx.fillStyle = plankTones[(x + y) % plankTones.length];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  // Saw on one side
  ctx.fillStyle = '#b0b0b0';
  ctx.fillRect(3, 4, 1, 7);
  ctx.fillRect(4, 5, 1, 5);
  ctx.fillStyle = '#5a3f20';
  ctx.fillRect(3, 11, 2, 2);

  // Hammer on other side
  ctx.fillStyle = '#5a3f20';
  ctx.fillRect(11, 5, 1, 7);
  ctx.fillStyle = '#858585';
  ctx.fillRect(10, 4, 3, 2);
  return canvasToTexture(canvas);
}

// 15. TNT Side
export function generateTNTSideTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  // Red dynamite sticks top and bottom
  ctx.fillStyle = '#db2b2b';
  ctx.fillRect(0, 0, 16, 16);
  for (let x = 0; x < 16; x += 2) {
    ctx.fillStyle = '#b51f1f';
    ctx.fillRect(x, 0, 1, 16);
  }
  // White label banner across center
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 5, 16, 6);
  // Black TNT text
  ctx.fillStyle = '#0a0a0a';
  // 'T'
  ctx.fillRect(2, 6, 3, 1);
  ctx.fillRect(3, 7, 1, 3);
  // 'N'
  ctx.fillRect(6, 6, 1, 4);
  ctx.fillRect(7, 7, 1, 1);
  ctx.fillRect(8, 8, 1, 1);
  ctx.fillRect(9, 6, 1, 4);
  // 'T'
  ctx.fillRect(11, 6, 3, 1);
  ctx.fillRect(12, 7, 1, 3);
  return canvasToTexture(canvas);
}

// 16. TNT Top (Dynamite wicks)
export function generateTNTTopTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  ctx.fillStyle = '#db2b2b';
  ctx.fillRect(0, 0, 16, 16);
  // Gray gunpowder circle & wick
  ctx.fillStyle = '#595959';
  ctx.fillRect(4, 4, 8, 8);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(7, 7, 2, 2);
  ctx.fillStyle = '#ff6b35';
  ctx.fillRect(7, 6, 1, 1);
  return canvasToTexture(canvas);
}

// 17. Sand
export function generateSandTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  const sandColors = ['#d9c89e', '#ded0aa', '#d2be90', '#e4d6b6', '#c9b484'];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = Math.floor(pseudoRandom(x * 17 + y * 37 + 888) * sandColors.length);
      ctx.fillStyle = sandColors[idx];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvasToTexture(canvas);
}

// 18. Bricks
export function generateBricksTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  // Mortar
  ctx.fillStyle = '#c7b7a7';
  ctx.fillRect(0, 0, 16, 16);
  // Brick rows
  const brickRed = '#963d30';
  const brickDark = '#843126';
  // Row 0
  ctx.fillStyle = brickRed;
  ctx.fillRect(0, 1, 7, 2);
  ctx.fillRect(8, 1, 7, 2);
  // Row 1
  ctx.fillStyle = brickDark;
  ctx.fillRect(0, 4, 3, 2);
  ctx.fillRect(4, 4, 7, 2);
  ctx.fillRect(12, 4, 4, 2);
  // Row 2
  ctx.fillStyle = brickRed;
  ctx.fillRect(0, 7, 7, 2);
  ctx.fillRect(8, 7, 7, 2);
  // Row 3
  ctx.fillStyle = brickDark;
  ctx.fillRect(0, 10, 3, 2);
  ctx.fillRect(4, 10, 7, 2);
  ctx.fillRect(12, 10, 4, 2);
  // Row 4
  ctx.fillStyle = brickRed;
  ctx.fillRect(0, 13, 7, 2);
  ctx.fillRect(8, 13, 7, 2);
  return canvasToTexture(canvas);
}

// 19. Water
export function generateWaterTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  const blues = ['#2e64d8', '#3873ea', '#2757c2', '#4181f5', '#1f48ab'];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = Math.floor(pseudoRandom(x * 19 + y * 29 + 999) * blues.length);
      ctx.fillStyle = blues[idx];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const tex = canvasToTexture(canvas);
  return tex;
}

// 20. Mining Break Crack Textures (stages 0 to 4)
export function generateBreakCrackTexture(stage: number): THREE.CanvasTexture {
  const [canvas, ctx] = create16x16Canvas();
  ctx.clearRect(0, 0, 16, 16);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';

  const linesByStage = [
    // Stage 0 (20%)
    [[7, 7], [8, 8], [9, 8], [6, 6]],
    // Stage 1 (40%)
    [[7, 7], [8, 8], [9, 8], [6, 6], [5, 5], [10, 9], [7, 6], [8, 9]],
    // Stage 2 (60%)
    [[7, 7], [8, 8], [9, 8], [6, 6], [5, 5], [10, 9], [7, 6], [8, 9], [4, 4], [3, 4], [11, 10], [12, 11], [6, 8], [8, 6], [6, 10]],
    // Stage 3 (80%)
    [[7, 7], [8, 8], [9, 8], [6, 6], [5, 5], [10, 9], [7, 6], [8, 9], [4, 4], [3, 4], [11, 10], [12, 11], [6, 8], [8, 6], [6, 10], [2, 3], [13, 12], [14, 13], [10, 5], [5, 11], [4, 12], [11, 4]],
    // Stage 4 (100% full shatter)
    [[7, 7], [8, 8], [9, 8], [6, 6], [5, 5], [10, 9], [7, 6], [8, 9], [4, 4], [3, 4], [11, 10], [12, 11], [6, 8], [8, 6], [6, 10], [2, 3], [13, 12], [14, 13], [10, 5], [5, 11], [4, 12], [11, 4], [1, 2], [15, 14], [9, 2], [2, 14], [14, 2], [7, 13], [13, 7]]
  ];

  const pixels = linesByStage[Math.min(Math.max(0, stage), linesByStage.length - 1)];
  pixels.forEach(([px, py]) => {
    ctx.fillRect(px, py, 1, 1);
  });

  return canvasToTexture(canvas);
}
