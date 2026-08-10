/** Calm, eased page scroll (default 500ms ease-in-out). */
export function smoothScrollToElement(el: HTMLElement, offset = 96, duration = 500) {
  const startY = window.scrollY;
  const targetY = Math.max(0, el.getBoundingClientRect().top + startY - offset);
  const delta = targetY - startY;
  if (Math.abs(delta) < 2) return;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    window.scrollTo(0, targetY);
    return;
  }
  const start = performance.now();
  const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, startY + delta * ease(t));
    if (t < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
}
