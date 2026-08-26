"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  DEPTHS,
  buildWallLayout,
  cameraFor,
  clampZoom,
  collectVisible,
  easeInOutQuint,
  layerTransform,
  nearestCopy,
} from "@/lib/wall-layout";
import { Collapse, Cross, Expand, Glass, Sprig, Target } from "@/components/marks";
import { moodOf } from "@/lib/moods";
import PinnedPiece from "./pinned-piece";
import Reader from "./reader";

/* Tuning. Everything about how the wall feels lives in these numbers. */
const FRICTION = 0.935; // how quickly a throw runs out of road
const MIN_VELOCITY = 0.02; // below this the wall is considered still
const DRAG_SLOP = 6; // px of movement before a click stops being a click
const IDLE_AFTER = 6500; // ms of stillness before the wall starts drifting
const DRIFT_SPEED = 0.22; // px per frame of that drift
const RECOMPUTE_DISTANCE = 130; // world px of travel before re-culling
const FLIGHT_MS = 950;
const OVERVIEW_ZOOM = 0.42;
const MAX_TILT = 0.55; // degrees the plane leans at full speed

/* useLayoutEffect has nothing to do during SSR, and React says so loudly. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Wall({ notes, letters, petals = [] }) {
  const pieces = useMemo(() => {
    const built = [];
    let letterIndex = 0;
    let petalIndex = 0;
    notes.forEach((note, index) => {
      built.push({ kind: "note", id: String(note.id), data: note });
      if (letterIndex < letters.length && (index + 1) % 6 === 0) {
        const letter = letters[letterIndex++];
        built.push({ kind: "letter", id: letter.id, data: letter });
      }
      if (petals.length && (index + 1) % 8 === 0) {
        const petal = petals[petalIndex++ % petals.length];
        built.push({ kind: "petal", id: `${petal.id}-${index}`, data: petal });
      }
    });
    while (letterIndex < letters.length) {
      const letter = letters[letterIndex++];
      built.push({ kind: "letter", id: letter.id, data: letter });
    }
    return built;
  }, [notes, letters, petals]);

  const layout = useMemo(() => buildWallLayout(pieces), [pieces]);

  const wallRef = useRef(null);
  const glowRef = useRef(null);
  const layerRefs = useRef([]);
  const searchRef = useRef(null);

  const camera = useRef({ x: layout.tileW / 2, y: layout.tileH / 2, z: 1 });
  const velocity = useRef({ x: 0, y: 0 });
  const viewport = useRef({ w: 1440, h: 900 });
  const pointers = useRef(new Map());
  const drag = useRef({ active: false, moved: 0, lastX: 0, lastY: 0, pinch: 0 });
  const swallowClicksUntil = useRef(0);
  const flight = useRef(null);
  const lastTouch = useRef(0);
  const lastCull = useRef({ x: Infinity, y: Infinity, z: 1 });
  const layoutRef = useRef(layout);
  const matchCursor = useRef(0);
  const calm = useRef(false);
  const tilt = useRef(0);
  const dragLean = useRef(0);
  const sized = useRef(false);

  const [bands, setBands] = useState(() => [[], [], []]);
  const [reading, setReading] = useState(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [overview, setOverview] = useState(false);
  const [moved, setMoved] = useState(false);

  /* ---------------------------------------------------------------- search */

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return null;
    const hits = new Set();
    for (const cell of layout.cells) {
      if (cell.piece.kind === "petal") continue;
      const d = cell.piece.data;
      const haystack = `${d.title ?? ""} ${d.text ?? d.line ?? ""} ${d.author ?? ""} ${
        moodOf(d.mood).label
      }`;
      if (haystack.toLowerCase().includes(term)) hits.add(cell.key);
    }
    return hits;
  }, [query, layout]);

  /* ------------------------------------------------------------ the engine */

  const cull = useCallback((force = false) => {
    const cam = camera.current;
    const last = lastCull.current;
    if (
      !force &&
      Math.abs(cam.x - last.x) < RECOMPUTE_DISTANCE &&
      Math.abs(cam.y - last.y) < RECOMPUTE_DISTANCE &&
      Math.abs(cam.z - last.z) < 0.02
    ) {
      return;
    }
    lastCull.current = { ...cam };
    const next = DEPTHS.map((_, index) =>
      collectVisible(layoutRef.current, index, cam, viewport.current)
    );
    setBands(next);
  }, []);

  const paint = useCallback(() => {
    const cam = camera.current;
    for (let i = 0; i < 3; i += 1) {
      const node = layerRefs.current[i];
      if (node) {
        node.style.transform = layerTransform(i, cam, viewport.current, tilt.current);
      }
    }
  }, []);

  /* Place the layers before the browser paints, so nothing ever flashes at
     its raw world coordinates while waiting for the first frame. */
  useIsomorphicLayoutEffect(paint);

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();

    const tick = (now) => {
      const dt = Math.min(50, now - previous) / 16.6667;
      previous = now;
      const cam = camera.current;

      if (flight.current) {
        const { from, to, start } = flight.current;
        const t = Math.min(1, (now - start) / FLIGHT_MS);
        const e = easeInOutQuint(t);
        cam.x = from.x + (to.x - from.x) * e;
        cam.y = from.y + (to.y - from.y) * e;
        cam.z = from.z + (to.z - from.z) * e;
        if (t >= 1) flight.current = null;
      } else if (!drag.current.active) {
        const vel = velocity.current;
        if (Math.abs(vel.x) > MIN_VELOCITY || Math.abs(vel.y) > MIN_VELOCITY) {
          cam.x += vel.x * dt;
          cam.y += vel.y * dt;
          const decay = Math.pow(FRICTION, dt);
          vel.x *= decay;
          vel.y *= decay;
        } else if (!calm.current && now - lastTouch.current > IDLE_AFTER) {
          // Nobody is touching it. Let the wall breathe on its own.
          const phase = now * 0.00007;
          cam.x += Math.cos(phase) * DRIFT_SPEED * dt;
          cam.y += Math.sin(phase * 0.73) * DRIFT_SPEED * 0.7 * dt;
        }
      }

      // Paper has weight: the plane leans a little into fast sideways movement
      // and eases back to level once things settle.
      if (calm.current) {
        tilt.current = 0;
      } else {
        const lean = drag.current.active ? dragLean.current : velocity.current.x;
        const target = Math.max(-1, Math.min(1, lean / 46)) * MAX_TILT;
        tilt.current += (target - tilt.current) * Math.min(1, 0.09 * dt);
        if (!drag.current.active) dragLean.current *= Math.pow(0.86, dt);
      }

      paint();
      cull();
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [cull, paint]);

  /* Keep the camera pointed at the middle of the tile when the wall changes. */
  useEffect(() => {
    layoutRef.current = layout;
    camera.current.x = layout.tileW / 2;
    camera.current.y = layout.tileH / 2;
    lastCull.current = { x: Infinity, y: Infinity, z: 1 };
    cull(true);
  }, [layout, cull]);

  /* Somebody who asked for less motion gets a wall that only moves when they
     move it. */
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      calm.current = query.matches;
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = wallRef.current;
    if (!node) return;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      viewport.current = { w: rect.width, h: rect.height };
      if (!sized.current) {
        // Narrow screens start pulled back so the wall still reads as a wall.
        sized.current = true;
        camera.current.z = clampZoom(Math.min(1, Math.max(0.66, rect.width / 1500)));
      }
      cull(true);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [cull]);

  /* ------------------------------------------------------------- movement */

  const wake = () => {
    lastTouch.current = performance.now();
    flight.current = null;
  };

  const flyTo = useCallback((target) => {
    if (calm.current) {
      camera.current = { ...target };
      velocity.current = { x: 0, y: 0 };
      return;
    }
    flight.current = {
      from: { ...camera.current },
      to: { ...target },
      start: performance.now(),
    };
    velocity.current = { x: 0, y: 0 };
  }, []);

  const zoomAround = useCallback((clientX, clientY, factor) => {
    const cam = camera.current;
    const { w, h } = viewport.current;
    const next = clampZoom(cam.z * factor);
    if (next === cam.z) return;
    const offX = clientX - w / 2;
    const offY = clientY - h / 2;
    // Hold the point under the cursor still while the scale changes.
    cam.x += offX / cam.z - offX / next;
    cam.y += offY / cam.z - offY / next;
    cam.z = next;
  }, []);

  const onPointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    wake();
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      drag.current.pinch = Math.hypot(a.x - b.x, a.y - b.y);
      drag.current.active = false;
      return;
    }
    drag.current.active = true;
    drag.current.moved = 0;
    wallRef.current?.setAttribute("data-dragging", "true");
    drag.current.lastX = event.clientX;
    drag.current.lastY = event.clientY;
    velocity.current = { x: 0, y: 0 };
    wallRef.current?.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (glowRef.current) {
      glowRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      wallRef.current?.setAttribute("data-pointer", "true");
    }
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    wake();

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const spread = Math.hypot(a.x - b.x, a.y - b.y);
      if (drag.current.pinch > 0) {
        zoomAround((a.x + b.x) / 2, (a.y + b.y) / 2, spread / drag.current.pinch);
      }
      drag.current.pinch = spread;
      return;
    }
    if (!drag.current.active) return;

    const cam = camera.current;
    const dx = event.clientX - drag.current.lastX;
    const dy = event.clientY - drag.current.lastY;
    drag.current.lastX = event.clientX;
    drag.current.lastY = event.clientY;
    drag.current.moved += Math.abs(dx) + Math.abs(dy);

    cam.x -= dx / cam.z;
    cam.y -= dy / cam.z;
    // Blend into the running velocity so a throw feels weighted, not twitchy.
    velocity.current.x = velocity.current.x * 0.6 + (-dx / cam.z) * 0.4;
    velocity.current.y = velocity.current.y * 0.6 + (-dy / cam.z) * 0.4;
    dragLean.current = dragLean.current * 0.7 + (-dx / cam.z) * 0.3;
    if (!moved && drag.current.moved > 40) setMoved(true);
  };

  /**
   * The wall holds pointer capture while you drag, and a captured pointer
   * sends its `click` to the capturing element rather than the button that was
   * pressed — so a tap is resolved here, from what is actually under the
   * pointer when it lifts.
   */
  const openAt = (clientX, clientY) => {
    const target = document
      .elementFromPoint(clientX, clientY)
      ?.closest?.("[data-piece]");
    const key = target?.dataset?.piece;
    if (!key) return;
    const cell = layoutRef.current.cells.find((c) => c.key === key);
    if (!cell || cell.piece.kind === "petal") return;
    // Keyboard still opens through onClick; don't let that fire twice.
    swallowClicksUntil.current = performance.now() + 400;
    setReading(cell.piece);
  };

  const endPointer = (event) => {
    const wasDragging = drag.current.active;
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) drag.current.pinch = 0;
    if (pointers.current.size === 0) {
      const tapped = wasDragging && drag.current.moved <= DRAG_SLOP;
      drag.current.active = false;
      wallRef.current?.removeAttribute("data-dragging");
      if (tapped && event.type === "pointerup") {
        openAt(event.clientX, event.clientY);
      } else if (!tapped) {
        // A throw shouldn't also open whatever was under the finger.
        swallowClicksUntil.current = performance.now() + 300;
      }
    }
    lastTouch.current = performance.now();
  };

  useEffect(() => {
    const node = wallRef.current;
    if (!node) return;
    const onWheel = (event) => {
      event.preventDefault();
      wake();
      if (event.ctrlKey || event.metaKey) {
        zoomAround(event.clientX, event.clientY, Math.exp(-event.deltaY * 0.0024));
      } else {
        const cam = camera.current;
        const step = event.deltaMode === 1 ? 18 : 1;
        cam.x += (event.deltaX * step) / cam.z;
        cam.y += (event.deltaY * step) / cam.z;
        velocity.current = { x: 0, y: 0 };
        if (!moved) setMoved(true);
      }
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [zoomAround, moved]);

  /* ------------------------------------------------------------- keyboard */

  const goToNextMatch = useCallback(() => {
    if (!matches?.size) return;
    const cells = layoutRef.current.cells.filter((cell) => matches.has(cell.key));
    if (!cells.length) return;
    const cell = cells[matchCursor.current % cells.length];
    matchCursor.current += 1;
    const copy = nearestCopy(layoutRef.current, cell, camera.current);
    flyTo(cameraFor(cell.depth, copy, Math.max(camera.current.z, 0.9)));
    setMoved(true);
  }, [matches, flyTo]);

  /* Stop typing for a beat and the wall walks you to the first match. */
  useEffect(() => {
    if (!matches?.size) return undefined;
    const timer = setTimeout(() => {
      matchCursor.current = 0;
      goToNextMatch();
    }, 700);
    return () => clearTimeout(timer);
  }, [matches, goToNextMatch]);

  const recentre = useCallback(() => {
    setOverview(false);
    flyTo({ x: layoutRef.current.tileW / 2, y: layoutRef.current.tileH / 2, z: 1 });
  }, [flyTo]);

  const toggleOverview = useCallback(() => {
    setOverview((was) => {
      flyTo({ ...camera.current, z: was ? 1 : OVERVIEW_ZOOM });
      return !was;
    });
  }, [flyTo]);

  useEffect(() => {
    const onKey = (event) => {
      const tag = document.activeElement?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";

      if (event.key === "/" && !typing) {
        event.preventDefault();
        setSearchOpen(true);
        requestAnimationFrame(() => searchRef.current?.focus());
        return;
      }
      if (event.key === "Escape" && !reading) {
        if (query) setQuery("");
        else setSearchOpen(false);
        return;
      }
      if (typing || reading) return;

      const cam = camera.current;
      const step = 150 / cam.z;
      const moves = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      if (moves[event.key]) {
        event.preventDefault();
        wake();
        flyTo({ x: cam.x + moves[event.key][0], y: cam.y + moves[event.key][1], z: cam.z });
        setMoved(true);
      } else if (event.key === "+" || event.key === "=") {
        zoomAround(viewport.current.w / 2, viewport.current.h / 2, 1.25);
      } else if (event.key === "-" || event.key === "_") {
        zoomAround(viewport.current.w / 2, viewport.current.h / 2, 0.8);
      } else if (event.key === "0") {
        recentre();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flyTo, query, reading, recentre, zoomAround]);

  /* ---------------------------------------------------------------- render */

  const openPiece = (piece) => {
    if (performance.now() < swallowClicksUntil.current) return;
    setReading(piece);
  };

  const hasWall = pieces.length > 0;

  return (
    <>
      <div
        ref={wallRef}
        className="wall"
        data-reading={reading ? "true" : undefined}
        role="application"
        aria-label="The wall. Drag to move around it, or use the arrow keys."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onPointerLeave={(event) => {
          endPointer(event);
          wallRef.current?.removeAttribute("data-pointer");
        }}
      >
        <div ref={glowRef} className="wall-glow" aria-hidden="true" />
        <div className="wall-stage">
          {DEPTHS.map((depth, index) => (
            <div
              key={depth.id}
              ref={(node) => {
                layerRefs.current[index] = node;
              }}
              className="wall-layer"
              style={{ "--depth-opacity": depth.opacity }}
            >
              {bands[index].map((item) => {
                const decorative = item.cell.piece.kind === "petal";
                const hit = matches && !decorative ? matches.has(item.cell.key) : null;
                return (
                  <div
                    key={item.id}
                    className="wall-item"
                    data-muted={hit === false ? "true" : undefined}
                    data-hit={hit === true ? "true" : undefined}
                    style={{
                      left: `${item.x}px`,
                      top: `${item.y}px`,
                      width: `${item.cell.width}px`,
                      "--rot": `${item.rotation}deg`,
                      "--focus": item.focus.toFixed(3),
                      "--enter": `${item.cell.enter}ms`,
                    }}
                  >
                    <div
                      className="wall-drift"
                      style={{
                        "--drift": `${item.cell.drift}s`,
                        "--drift-delay": `${item.cell.driftDelay}s`,
                      }}
                    >
                      <div className="wall-fade">
                        <PinnedPiece
                          cell={item.cell}
                          onOpen={openPiece}
                          canFocus={item.tile[0] === 0 && item.tile[1] === 0 && index === 1}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="wall-scrim wall-scrim-bottom" aria-hidden="true" />

      {!hasWall && (
        <div className="wall-empty">
          <div className="wall-empty-inner rise">
            <Sprig size={64} className="mx-auto text-[var(--rose)] opacity-45" />
            <h2 className="display mt-6 text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">
              The wall is empty.
            </h2>
            <p className="mt-3 text-sm text-[var(--ink-3)]">
              Nobody has left anything here yet. Somebody has to go first.
            </p>
            <Link href="/write" className="btn mt-7">
              Write the first one
            </Link>
          </div>
        </div>
      )}

      {hasWall && (
        <div className="wall-dock" data-hidden={reading ? "true" : undefined}>
          <button
            className="dock-btn"
            onClick={() => {
              setSearchOpen((open) => {
                if (open) setQuery("");
                else requestAnimationFrame(() => searchRef.current?.focus());
                return !open;
              });
            }}
            data-active={searchOpen ? "true" : undefined}
            aria-label={searchOpen ? "Close search" : "Search the wall"}
          >
            {searchOpen ? <Cross /> : <Glass />}
          </button>

          <input
            ref={searchRef}
            className="dock-search"
            data-open={searchOpen ? "true" : undefined}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              matchCursor.current = 0;
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                goToNextMatch();
              }
            }}
            placeholder="find a feeling…"
            aria-label="Search the wall"
            tabIndex={searchOpen ? 0 : -1}
          />

          {matches && (
            <button className="dock-count" onClick={goToNextMatch} type="button">
              {matches.size === 0
                ? "nothing"
                : `${matches.size} found — enter`}
            </button>
          )}

          <span className="dock-sep" />

          <button className="dock-btn" onClick={recentre} aria-label="Back to the middle">
            <Target />
          </button>
          <button
            className="dock-btn"
            onClick={toggleOverview}
            data-active={overview ? "true" : undefined}
            aria-label={overview ? "Come closer" : "See the whole wall"}
          >
            {overview ? <Expand /> : <Collapse />}
          </button>

          <span className="dock-sep" />

          <Link className="dock-btn" href="/write" aria-label="Write something">
            <span className="text-[0.6875rem] tracking-[0.16em] uppercase">Write</span>
          </Link>
        </div>
      )}

      {hasWall && (
        <p className="wall-hint" data-gone={moved || reading ? "true" : undefined}>
          drag anywhere
        </p>
      )}

      {reading && <Reader piece={reading} onClose={() => setReading(null)} />}
    </>
  );
}
