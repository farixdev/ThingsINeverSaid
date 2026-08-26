/**
 * Pure geometry for the wall.
 *
 * The wall is an infinite plane. One "tile" holds every note exactly once,
 * scattered on a jittered grid; the plane then repeats that tile in both axes,
 * re-seeding rotation and drift per tile so no two copies read the same.
 *
 * Everything here is deterministic from the note ids, so the server and the
 * client agree and the layout never jumps between renders.
 */

const CELL_W = 344;
const CELL_H = 272;
const MIN_COLS = 5;
const MIN_ROWS = 4;
const JITTER = 0.24;

export function hash32(input) {
  let h = 2166136261;
  const str = String(input);
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Depth bands. Far pieces travel slower than the pointer and sit further back;
 * near pieces overtake it. That difference is the whole illusion.
 */
export const DEPTHS = [
  { id: "far", parallax: 0.78, scale: 0.74, opacity: 0.62 },
  { id: "mid", parallax: 1, scale: 1, opacity: 1 },
  { id: "near", parallax: 1.16, scale: 1.14, opacity: 1 },
];

export function buildWallLayout(pieces) {
  const count = Math.max(pieces.length, 1);
  const cols = Math.max(MIN_COLS, Math.ceil(Math.sqrt(count * 1.7)));
  const rows = Math.max(MIN_ROWS, Math.ceil(count / cols));
  const slots = cols * rows;

  const placed = pieces.map((piece, index) => {
    const seed = hash32(`${piece.kind}:${piece.id}`);
    const rand = mulberry32(seed);

    // Spread the notes across every slot rather than filling the first rows.
    const slot = Math.floor((index * slots) / count);
    const col = slot % cols;
    const row = Math.floor(slot / cols);

    const isLetter = piece.kind === "letter";
    const isPetal = piece.kind === "petal";
    const width = isPetal
      ? Math.round(lerp(84, 150, rand()))
      : isLetter
        ? Math.round(lerp(238, 306, rand()))
        : Math.round(lerp(204, 268, rand()));

    const x = (col + 0.5) * CELL_W + (rand() - 0.5) * CELL_W * JITTER * 2;
    const y = (row + 0.5) * CELL_H + (rand() - 0.5) * CELL_H * JITTER * 2;

    const depthRoll = rand();
    const depth = isLetter
      ? 1
      : isPetal
        ? (depthRoll < 0.6 ? 0 : 2)
        : depthRoll < 0.2
          ? 0
          : depthRoll < 0.82
            ? 1
            : 2;

    return {
      key: `${piece.kind}-${piece.id}`,
      piece,
      x,
      y,
      width,
      depth,
      seed,
      rotation: (rand() - 0.5) * (isPetal ? 90 : 6.2),
      // A rough height estimate, only used for culling. Real height is intrinsic.
      height: isPetal ? width : isLetter ? width * 0.86 : 128 + rand() * 74,
      drift: 5 + rand() * 7,
      driftDelay: -rand() * 14,
      fastener: ["tape", "tape", "pin", "thread"][Math.floor(rand() * 4)],
    };
  });

  return {
    cells: placed,
    tileW: cols * CELL_W,
    tileH: rows * CELL_H,
    cols,
    rows,
  };
}

/**
 * Each repeat of the tile is nudged and re-rotated so the copies never read as
 * a grid. Deterministic from the tile coordinates.
 */
export function tileOffset(ti, tj) {
  const rand = mulberry32(hash32(`${ti}|${tj}`));
  return {
    rot: (rand() - 0.5) * 5,
    nx: (rand() - 0.5) * 110,
    ny: (rand() - 0.5) * 110,
  };
}

/**
 * A depth band renders in its own scaled world:
 *   screen = viewportCentre + z * (point * depth.scale - camera * depth.parallax)
 * so the layer transform is translate(A) scale(z * depth.scale), and the slice
 * of that world under the viewport is what we cull against.
 */
export function depthView(depthIndex, camera, viewport, pad = 0) {
  const depth = DEPTHS[depthIndex];
  const zoom = camera.z * depth.scale;
  const centre = {
    x: (camera.x * depth.parallax) / depth.scale,
    y: (camera.y * depth.parallax) / depth.scale,
  };
  const halfW = (viewport.w / 2 + pad) / zoom;
  const halfH = (viewport.h / 2 + pad) / zoom;
  return {
    depth,
    zoom,
    centre,
    halfW,
    halfH,
    left: centre.x - halfW,
    right: centre.x + halfW,
    top: centre.y - halfH,
    bottom: centre.y + halfH,
  };
}

/** Screen-space offset for a depth layer's CSS transform. */
export function layerTransform(depthIndex, camera, viewport) {
  const depth = DEPTHS[depthIndex];
  const scale = camera.z * depth.scale;
  const x = viewport.w / 2 - camera.z * camera.x * depth.parallax;
  const y = viewport.h / 2 - camera.z * camera.y * depth.parallax;
  return `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
}

/**
 * Every visible copy of every note in one depth band.
 * Culling is per note rather than per tile, so a sparse wall stays cheap.
 */
export function collectVisible(layout, depthIndex, camera, viewport, pad = 460) {
  const view = depthView(depthIndex, camera, viewport, pad);
  const { tileW, tileH } = layout;

  const firstCol = Math.floor((view.left - tileW) / tileW);
  const lastCol = Math.floor(view.right / tileW);
  const firstRow = Math.floor((view.top - tileH) / tileH);
  const lastRow = Math.floor(view.bottom / tileH);

  const out = [];
  for (let ti = firstCol; ti <= lastCol; ti += 1) {
    for (let tj = firstRow; tj <= lastRow; tj += 1) {
      const { rot: rotShift, nx: nudgeX, ny: nudgeY } = tileOffset(ti, tj);

      for (const cell of layout.cells) {
        if (cell.depth !== depthIndex) continue;
        const x = cell.x + ti * tileW + nudgeX;
        const y = cell.y + tj * tileH + nudgeY;
        if (x + cell.width < view.left || x - cell.width > view.right) continue;
        if (y + cell.height < view.top || y - cell.height > view.bottom) continue;

        // Normalised distance from the centre of attention — this drives the fade.
        const dx = (x - view.centre.x) / view.halfW;
        const dy = (y - view.centre.y) / view.halfH;
        const focus = Math.min(1, Math.hypot(dx, dy));

        out.push({
          id: `${view.depth.id}:${ti}:${tj}:${cell.key}`,
          cell,
          tile: [ti, tj],
          x,
          y,
          rotation: cell.rotation + rotShift,
          focus,
        });
      }
    }
  }
  return out;
}

/** Camera position that puts a given point of a depth band in the middle. */
export function cameraFor(depthIndex, point, zoom) {
  const depth = DEPTHS[depthIndex];
  return {
    x: (point.x * depth.scale) / depth.parallax,
    y: (point.y * depth.scale) / depth.parallax,
    z: zoom,
  };
}

export function clampZoom(z) {
  return Math.min(1.55, Math.max(0.34, z));
}

/** Ease used by every camera flight on the wall. */
export function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

/** World position of one copy of a cell, in its own depth band's space. */
export function cellPosition(layout, cell, ti, tj) {
  const { nx, ny } = tileOffset(ti, tj);
  return {
    x: cell.x + ti * layout.tileW + nx,
    y: cell.y + tj * layout.tileH + ny,
  };
}

/** The tile copy of a cell nearest to where the camera is looking right now. */
export function nearestCopy(layout, cell, camera) {
  const depth = DEPTHS[cell.depth];
  const centre = {
    x: (camera.x * depth.parallax) / depth.scale,
    y: (camera.y * depth.parallax) / depth.scale,
  };
  const ti = Math.round((centre.x - cell.x) / layout.tileW);
  const tj = Math.round((centre.y - cell.y) / layout.tileH);
  return { ti, tj, ...cellPosition(layout, cell, ti, tj) };
}
