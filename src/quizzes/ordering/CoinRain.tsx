import confetti from 'canvas-confetti';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './sourceLinks';

const COLORS = ['#4B2E83', '#17663F', '#1B2330', '#586272'];
const DURATION_MS = 3000;

/**
 * Déšť korun přes celou obrazovku (GDD kap. 6.6). Plátno nepřijímá kliknutí,
 * takže neblokuje tlačítka pod ním. Při omezeném pohybu se nic nevykreslí.
 */
export function CoinRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;
    let fire: confetti.CreateTypes | null = null;
    let frame = 0;
    try {
      if (!canvas.getContext('2d')) return;
      fire = confetti.create(canvas, { resize: true });
    } catch {
      return;
    }

    const kc = COLORS.map((color) => confetti.shapeFromText({ text: 'Kč', scalar: 2, color }));
    const end = performance.now() + DURATION_MS;

    const tick = () => {
      const common = {
        startVelocity: 0,
        ticks: 260,
        gravity: 0.9,
        drift: (Math.random() - 0.5) * 0.6,
        origin: { x: Math.random(), y: -0.05 },
        disableForReducedMotion: true,
      };
      fire?.({ ...common, particleCount: 1, shapes: ['circle'], colors: COLORS, scalar: 1.6 });
      fire?.({ ...common, particleCount: 1, shapes: kc, scalar: 2, flat: true, origin: { x: Math.random(), y: -0.05 } });
      if (performance.now() < end) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      fire?.reset();
    };
  }, []);

  return <canvas ref={canvasRef} className="coin-rain" aria-hidden="true" />;
}
