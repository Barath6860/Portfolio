"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; vx: number; vy: number; r: number; depth: number; cross: boolean; phase: number };

const LINK_RADIUS = 190; // stars within this distance of the pointer join the constellation
const LINK_DIST = 130; // max length of a star-to-star line
const MAX_LINKED = 9;

function readColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#00f5a0";
}

/**
 * Full-viewport starfield. Stars drift slowly at different depths (with a
 * little scroll parallax); the ones near the pointer light up and link into a
 * constellation. Static when the user prefers reduced motion.
 */
export function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let accent = readColor("--accent");
    let fg = readColor("--fg");
    const pointer = { x: -9999, y: -9999, active: false };
    let raf = 0;

    const seed = () => {
      const count = Math.min(220, Math.round((w * h) / 8500));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        r: 0.5 + Math.random() * 1.1,
        depth: 0.04 + Math.random() * 0.22,
        cross: Math.random() < 0.12,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    // Screen position of a star after scroll parallax, wrapped to the viewport.
    const screenY = (s: Star) => {
      const y = (s.y - window.scrollY * s.depth) % h;
      return y < 0 ? y + h : y;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const near: { x: number; y: number; d: number }[] = [];

      for (const s of stars) {
        if (!reduce) {
          s.x = (s.x + s.vx + w) % w;
          s.y = (s.y + s.vy + h) % h;
        }
        const x = s.x;
        const y = screenY(s);
        const twinkle = reduce ? 0.7 : 0.55 + 0.45 * Math.sin(t / 900 + s.phase);
        const d = pointer.active ? Math.hypot(x - pointer.x, y - pointer.y) : Infinity;
        const lit = d < LINK_RADIUS;
        if (lit) near.push({ x, y, d });

        ctx.globalAlpha = lit ? 0.95 : 0.22 + 0.4 * twinkle * (s.depth * 3);
        ctx.fillStyle = s.cross || lit ? accent : fg;
        if (s.cross) {
          const len = 2.5 + s.r * 1.6;
          ctx.fillRect(x - len, y - 0.5, len * 2, 1);
          ctx.fillRect(x - 0.5, y - len, 1, len * 2);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, lit ? s.r + 0.8 : s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (near.length) {
        near.sort((a, b) => a.d - b.d);
        const pts = near.slice(0, MAX_LINKED);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 0.8;
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          const fade = 1 - a.d / LINK_RADIUS;
          // The two closest stars connect to the pointer itself.
          if (i < 2) {
            ctx.globalAlpha = 0.5 * fade;
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(a.x, a.y);
            ctx.stroke();
          }
          for (let j = i + 1; j < pts.length; j++) {
            const b = pts[j];
            const len = Math.hypot(a.x - b.x, a.y - b.y);
            if (len > LINK_DIST) continue;
            ctx.globalAlpha = 0.4 * fade * (1 - len / LINK_DIST);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) draw(0);
      else raf = requestAnimationFrame(loop);
    };
    // With reduced motion, only redraw when something changes.
    const redraw = () => {
      if (reduce) requestAnimationFrame(() => draw(0));
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      redraw();
    };
    const onLeave = () => {
      pointer.active = false;
      redraw();
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };
    const onResize = () => {
      resize();
      redraw();
    };
    const themeObserver = new MutationObserver(() => {
      accent = readColor("--accent");
      fg = readColor("--fg");
      redraw();
    });

    resize();
    start();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", redraw, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", redraw);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="animate-fade-in pointer-events-none fixed inset-0 -z-[5]" />;
}
