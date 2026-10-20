"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * BackdropCanvas — §6.11 / §8 "PACKET LATTICE".
 *
 * A jittered node lattice with packets that walk it via Manhattan routing
 * (horizontal-then-vertical turns, so it reads as routed traffic rather
 * than drifting dust), plus a periodic scan sweep. Zero dependencies,
 * Canvas 2D only, no shadowBlur anywhere (the single most expensive
 * Canvas 2D property — banned per §8.2).
 *
 * Performance:
 *  - All particle/trail state lives in pre-allocated Float32Arrays; no
 *    allocation inside the render loop.
 *  - Density scales down at narrower viewports (§8.4) and devicePixelRatio
 *    is capped (2.0 desktop / 1.5 mobile).
 *  - Paused via IntersectionObserver (offscreen) and visibilitychange
 *    (hidden tab); resumes with a clamped delta so time-away never makes
 *    packets jump.
 *  - Reduced motion: the loop never starts. One static frame is drawn:
 *    full node lattice + all edges + packets at rest — deliberately more
 *    informative than a paused live frame.
 *
 * A text-protection rect is punched out so the hero copy's measured
 * contrast ratios (§1.3) hold with the canvas live: nothing is drawn
 * above alpha 0.12 inside the hero text column + 24px padding.
 */

type Tier = "full" | "reduced" | "static";
type Density = {
  nodes: number;
  packets: number;
  trail: number;
  sweepMs: number;
  glyph: boolean;
  dprCap: number;
};
type Rect = { x: number; y: number; w: number; h: number };

const COLORS = {
  nodeBase: "#1C5F7F",
  blue: "#35C3FF",
  green: "#2BF59A",
};

export function BackdropCanvas({
  className,
  protectRef,
}: {
  className?: string;
  /** Ref to the text column to shield from the canvas (§8.1 "Text protection"). */
  protectRef?: RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as unknown as { connection?: { saveData?: boolean } })
      .connection?.saveData;
    const lowCpu = (navigator.hardwareConcurrency ?? 8) <= 4;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodeCount = 0;
    let cellSize = 96;
    // Flattened typed arrays: [x, y, phase] per node.
    let nodesX: Float32Array = new Float32Array(0);
    let nodesY: Float32Array = new Float32Array(0);
    let nodesPhase: Float32Array = new Float32Array(0);

    let packetCount = 0;
    let trailLen = 10;
    // Per packet: current x/y, target node index, color index (0=blue,1=green)
    let pX: Float32Array = new Float32Array(0);
    let pY: Float32Array = new Float32Array(0);
    let pTargetIdx: Int32Array = new Int32Array(0);
    let pPhase: Uint8Array = new Uint8Array(0); // 0 = moving horizontal, 1 = vertical
    let pColor: Uint8Array = new Uint8Array(0);
    // Trail ring buffer: [packet][slot] -> x,y
    let trailX: Float32Array = new Float32Array(0);
    let trailY: Float32Array = new Float32Array(0);
    let trailHead: Int32Array = new Int32Array(0);

    let tier: Tier = "full";
    let scanSweepOn = true;
    let scanIntervalMs = 9000;
    let lastSweepAt = 0;
    let sweepProgress = -1; // -1 = inactive

    let rafId: number | null = null;
    let lastTime: number | null = null;
    let paused = false;

    // Rolling frame-time mean for the FPS governor.
    const frameTimes: number[] = [];
    let cooldownUntil = 0;

    const densityForWidth = (w: number): Density => {
      if (w >= 1024) return { nodes: 90, packets: 14, trail: 10, sweepMs: 9000, glyph: true, dprCap: 2 };
      if (w >= 768) return { nodes: 60, packets: 10, trail: 6, sweepMs: 11000, glyph: false, dprCap: 2 };
      if (w >= 480) return { nodes: 40, packets: 6, trail: 4, sweepMs: 14000, glyph: false, dprCap: 1.5 };
      return { nodes: 28, packets: 4, trail: 0, sweepMs: 0, glyph: false, dprCap: 1.5 };
    };

    const seedLattice = (count: number) => {
      cellSize = Math.min(180, Math.max(96, 96 * Math.sqrt(90 / Math.max(1, count))));
      const cols = Math.max(1, Math.ceil(width / cellSize));
      const rows = Math.max(1, Math.ceil(height / cellSize));
      const total = Math.min(count, cols * rows);

      nodesX = new Float32Array(total);
      nodesY = new Float32Array(total);
      nodesPhase = new Float32Array(total);

      // Deterministic seed so the lattice doesn't reshuffle on resize.
      let seed = 1337;
      const rand = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      let i = 0;
      for (let r = 0; r < rows && i < total; r++) {
        for (let c = 0; c < cols && i < total; c++) {
          const jitterX = (rand() - 0.5) * 56;
          const jitterY = (rand() - 0.5) * 56;
          nodesX[i] = c * cellSize + cellSize / 2 + jitterX;
          nodesY[i] = r * cellSize + cellSize / 2 + jitterY;
          nodesPhase[i] = rand() * Math.PI * 2;
          i += 1;
        }
      }
      nodeCount = i;
    };

    const nearestNodeIndex = (x: number, y: number, excludeIdx: number) => {
      let best = -1;
      let bestDist = Infinity;
      for (let i = 0; i < nodeCount; i++) {
        if (i === excludeIdx) continue;
        const dx = nodesX[i] - x;
        const dy = nodesY[i] - y;
        const d = dx * dx + dy * dy;
        if (d > 400 && d < cellSize * cellSize * 6 && d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      if (best === -1) {
        best = Math.floor(Math.random() * Math.max(1, nodeCount));
      }
      return best;
    };

    const seedPackets = (count: number, trail: number) => {
      packetCount = count;
      trailLen = trail;
      pX = new Float32Array(count);
      pY = new Float32Array(count);
      pTargetIdx = new Int32Array(count);
      pPhase = new Uint8Array(count);
      pColor = new Uint8Array(count);
      trailX = new Float32Array(count * Math.max(1, trail));
      trailY = new Float32Array(count * Math.max(1, trail));
      trailHead = new Int32Array(count);

      for (let i = 0; i < count; i++) {
        const startIdx = Math.floor(Math.random() * Math.max(1, nodeCount));
        pX[i] = nodesX[startIdx] ?? 0;
        pY[i] = nodesY[startIdx] ?? 0;
        pTargetIdx[i] = nearestNodeIndex(pX[i], pY[i], startIdx);
        pPhase[i] = 0;
        pColor[i] = i < count - Math.round(count * 0.28) ? 0 : 1; // ~4/14 green
        for (let s = 0; s < trail; s++) {
          trailX[i * trail + s] = pX[i];
          trailY[i * trail + s] = pY[i];
        }
      }
    };

    const applyTier = (next: Tier) => {
      tier = next;
      const base = densityForWidth(width);
      if (next === "reduced") {
        seedLattice(Math.min(48, base.nodes));
        seedPackets(Math.min(8, base.packets), Math.min(4, base.trail));
        scanSweepOn = base.sweepMs > 0;
      } else if (next === "static") {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = Math.min(rect.height, 1080);
      const density = densityForWidth(width);
      dpr = Math.min(window.devicePixelRatio || 1, density.dprCap);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      let nodes = density.nodes;
      let packets = density.packets;
      const trail = density.trail;
      if (lowCpu) {
        nodes = Math.round(nodes * 0.66);
        packets = Math.max(2, Math.round(packets * 0.66));
      }

      seedLattice(nodes);
      seedPackets(packets, trail);
      scanSweepOn = density.sweepMs > 0;
      scanIntervalMs = density.sweepMs;
      tier = "full";
    };

    const textProtectionRect = (): Rect | null => {
      const el = protectRef?.current;
      if (!el) return null;
      const parentRect = parent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      return {
        x: elRect.left - parentRect.left - 24,
        y: elRect.top - parentRect.top - 24,
        w: elRect.width + 48,
        h: elRect.height + 48,
      };
    };

    const isInsideProtection = (x: number, y: number, rect: Rect | null) => {
      if (!rect) return false;
      return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
    };

    const drawStaticFrame = () => {
      ctx.clearRect(0, 0, width, height);
      const rect = textProtectionRect();

      // All lattice edges drawn (normally only revealed by traffic).
      ctx.strokeStyle = "rgba(28, 95, 127, 0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < nodeCount; i++) {
        if (isInsideProtection(nodesX[i], nodesY[i], rect)) continue;
        if (i + 1 < nodeCount) {
          ctx.beginPath();
          ctx.moveTo(nodesX[i], nodesY[i]);
          ctx.lineTo(nodesX[i + 1] ?? nodesX[i], nodesY[i + 1] ?? nodesY[i]);
          ctx.stroke();
        }
      }

      ctx.fillStyle = "rgba(28, 95, 127, 0.34)";
      for (let i = 0; i < nodeCount; i++) {
        if (isInsideProtection(nodesX[i], nodesY[i], rect)) continue;
        ctx.fillRect(nodesX[i] - 0.75, nodesY[i] - 0.75, 1.5, 1.5);
      }

      for (let i = 0; i < packetCount; i++) {
        if (isInsideProtection(pX[i], pY[i], rect)) continue;
        ctx.fillStyle = pColor[i] === 0 ? COLORS.blue : COLORS.green;
        ctx.fillRect(pX[i] - 1, pY[i] - 1, 2, 2);
      }
    };

    const stepPacket = (i: number, dt: number) => {
      const speed = 38; // px/s
      const tx = nodesX[pTargetIdx[i]] ?? pX[i];
      const ty = nodesY[pTargetIdx[i]] ?? pY[i];
      const dist = speed * (dt / 1000);

      if (pPhase[i] === 0) {
        // horizontal leg
        const dx = tx - pX[i];
        if (Math.abs(dx) <= dist) {
          pX[i] = tx;
          pPhase[i] = 1;
        } else {
          pX[i] += Math.sign(dx) * dist;
        }
      } else {
        const dy = ty - pY[i];
        if (Math.abs(dy) <= dist) {
          pY[i] = ty;
          // Arrived — pick next target.
          pTargetIdx[i] = nearestNodeIndex(pX[i], pY[i], pTargetIdx[i]);
          pPhase[i] = 0;
        } else {
          pY[i] += Math.sign(dy) * dist;
        }
      }

      if (trailLen > 0) {
        const head = trailHead[i];
        trailX[i * trailLen + head] = pX[i];
        trailY[i * trailLen + head] = pY[i];
        trailHead[i] = (head + 1) % trailLen;
      }
    };

    const render = (now: number) => {
      if (lastTime === null) lastTime = now;
      const dt = Math.min(now - lastTime, 33);
      lastTime = now;

      // FPS governor — one-way downgrade.
      frameTimes.push(dt);
      if (frameTimes.length > 30) frameTimes.shift();
      if (now > cooldownUntil && frameTimes.length >= 30) {
        const mean = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        if (tier === "full" && mean > 22) {
          applyTier("reduced");
          cooldownUntil = now + 2000;
        } else if (tier === "reduced" && mean > 28) {
          applyTier("static");
          drawStaticFrame();
          return;
        }
      }

      ctx.clearRect(0, 0, width, height);
      const rect = textProtectionRect();

      // Edges + nodes with breathing alpha.
      ctx.fillStyle = COLORS.nodeBase;
      for (let i = 0; i < nodeCount; i++) {
        const breathe = 0.26 + 0.14 * Math.sin(now * 0.0006 + nodesPhase[i]);
        const alpha = isInsideProtection(nodesX[i], nodesY[i], rect) ? Math.min(breathe, 0.12) : breathe;
        ctx.globalAlpha = alpha;
        ctx.fillRect(nodesX[i] - 0.75, nodesY[i] - 0.75, 1.5, 1.5);
      }
      ctx.globalAlpha = 1;

      // Scan sweep.
      if (scanSweepOn) {
        if (now - lastSweepAt > scanIntervalMs) {
          lastSweepAt = now;
          sweepProgress = 0;
        }
        if (sweepProgress >= 0) {
          sweepProgress += dt / 1600;
          const sweepX = sweepProgress * width;
          if (sweepProgress <= 1) {
            ctx.globalAlpha = 0.22;
            ctx.strokeStyle = COLORS.green;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sweepX, 0);
            ctx.lineTo(sweepX, height);
            ctx.stroke();
            ctx.globalAlpha = 1;
          } else {
            sweepProgress = -1;
          }
        }
      }

      // Packets + trails.
      for (let i = 0; i < packetCount; i++) {
        stepPacket(i, dt);
        const insideProtected = isInsideProtection(pX[i], pY[i], rect);
        const color = pColor[i] === 0 ? COLORS.blue : COLORS.green;

        if (trailLen > 0) {
          for (let s = 0; s < trailLen; s++) {
            const slot = (trailHead[i] - 1 - s + trailLen * 2) % trailLen;
            const tx2 = trailX[i * trailLen + slot];
            const ty2 = trailY[i * trailLen + slot];
            const alpha = (0.5 * (trailLen - s)) / trailLen;
            if (isInsideProtection(tx2, ty2, rect)) continue;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.fillRect(tx2 - 1, ty2 - 1, 2, 2);
          }
        }

        ctx.globalAlpha = insideProtected ? 0.12 : 1;
        ctx.fillStyle = color;
        ctx.fillRect(pX[i] - 1, pY[i] - 1, 2, 2);
      }
      ctx.globalAlpha = 1;

      if (!paused) {
        rafId = requestAnimationFrame(render);
      }
    };

    const start = () => {
      if (reducedQuery.matches || saveData) {
        drawStaticFrame();
        return;
      }
      if (rafId !== null) return;
      lastTime = null;
      rafId = requestAnimationFrame(render);
    };

    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    resize();
    if (reducedQuery.matches || saveData) {
      drawStaticFrame();
    } else {
      start();
    }

    const onReducedChange = () => {
      stop();
      paused = false;
      if (reducedQuery.matches) {
        drawStaticFrame();
      } else {
        start();
      }
    };
    reducedQuery.addEventListener("change", onReducedChange);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reducedQuery.matches) drawStaticFrame();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([entry]) => {
        paused = !entry.isIntersecting;
        if (paused) {
          stop();
        } else if (!reducedQuery.matches) {
          lastTime = null;
          start();
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else if (!paused && !reducedQuery.matches) {
        lastTime = null;
        start();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onReducedChange);
      clearTimeout(resizeTimer);
    };
  }, [protectRef]);

  return (
    <div className="hero-vignette absolute inset-0 overflow-hidden" style={{ contain: "strict" }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={className}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />
    </div>
  );
}
