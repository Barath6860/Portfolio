"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], [role='tab'], summary, label, select, [tabindex='0']";

/**
 * Ring cursor for mouse users: a small accent dot at the pointer and a ring
 * that eases after it, growing over links and buttons. Touch devices keep the
 * native cursor; with reduced motion the ring follows without easing.
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;
    let visible = false;

    const render = () => {
      const ease = reduce ? 1 : 0.2;
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.1 ? requestAnimationFrame(render) : 0;
    };

    const setVisible = (v: boolean) => {
      visible = v;
      ring.style.opacity = dot.style.opacity = v ? "1" : "0";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        pos.x = target.x;
        pos.y = target.y;
        setVisible(true);
      }
      const el = e.target instanceof Element ? e.target : null;
      ring.dataset.hover = el?.closest(INTERACTIVE) ? "true" : "false";
      ring.dataset.text = el?.closest("input, textarea, [contenteditable='true']") ? "true" : "false";
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onDown = () => (ring.dataset.down = "true");
    const onUp = () => (ring.dataset.down = "false");
    const onLeave = () => setVisible(false);

    root.classList.add("has-custom-cursor");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={ringRef} className="cursor-ring absolute top-0 left-0 opacity-0" />
      <div ref={dotRef} className="absolute top-0 left-0 size-1.5 rounded-full bg-accent opacity-0 shadow-[0_0_10px_var(--accent)]" />
    </div>
  );
}
