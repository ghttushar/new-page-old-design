import React, { useEffect, useRef } from 'react';
import styles from './dashboard-banner.module.scss';

const NODE_COUNT = 22;
const LINK_DISTANCE = 64;
const PULSE_SPAWN_MS = 1150;
const PING_INTERVAL_MS = 2300;
const ACTIVE_SPEED = 1.9;

interface INeuralVisualProps {
  active?: boolean;
}

interface INode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
}

interface IPulse {
  from: number;
  to: number;
  p: number;
}

interface IPing {
  r: number;
  alpha: number;
}

export default function NeuralVisual({ active = false }: INeuralVisualProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) {
      return undefined;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return undefined;
    }

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 1;
    let height = 1;
    let nodes: INode[] = [];
    let pulses: IPulse[] = [];
    let pings: IPing[] = [];
    let lastPulse = 0;
    let lastPing = 0;
    let raf = 0;

    const seed = () => {
      nodes = Array.from({ length: NODE_COUNT }, () => {
        const onEdge = Math.random() < 0.3;
        return {
          x: onEdge
            ? Math.random() < 0.5
              ? 2
              : Math.max(2, width - 2)
            : Math.random() * width,
          y: onEdge
            ? Math.random() < 0.5
              ? 2
              : Math.max(2, height - 2)
            : Math.random() * height,
          vx: (Math.random() - 0.5) * 0.24,
          vy: (Math.random() - 0.5) * 0.24,
          r: 1.1 + Math.random() * 2.3,
          phase: Math.random() * Math.PI * 2,
        };
      });
      pulses = [];
      pings = [];
      lastPulse = 0;
      lastPing = 0;
    };

    const drawCore = (time: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const breathe = reduce ? 0.5 : (Math.sin(time / 1150) + 1) / 2;
      const coreR = 13 + breathe * 3;

      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3);
      halo.addColorStop(0, 'rgba(149, 85, 234, 0.45)');
      halo.addColorStop(0.5, 'rgba(149, 85, 234, 0.12)');
      halo.addColorStop(1, 'rgba(149, 85, 234, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 3, 0, Math.PI * 2);
      ctx.fill();

      const orb = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      orb.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      orb.addColorStop(0.4, 'rgba(241, 222, 255, 0.9)');
      orb.addColorStop(0.75, 'rgba(169, 108, 226, 0.85)');
      orb.addColorStop(1, 'rgba(119, 70, 155, 0.9)');
      ctx.fillStyle = orb;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      if (!reduce) {
        const startAngle = time / 1400;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR - 1.5, startAngle, startAngle + 1.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, coreR - 1.5, startAngle + Math.PI, startAngle + Math.PI + 0.7);
        ctx.stroke();
      }
    };

    const renderScene = (time: number, advancing: boolean) => {
      ctx.clearRect(0, 0, width, height);
      const speed = activeRef.current ? ACTIVE_SPEED : 1;

      if (advancing) {
        for (const n of nodes) {
          n.x += n.vx * speed;
          n.y += n.vy * speed;
          const m = 12;
          if (n.x < -m) {
            n.x = width + m;
          } else if (n.x > width + m) {
            n.x = -m;
          }
          if (n.y < -m) {
            n.y = height + m;
          } else if (n.y > height + m) {
            n.y = -m;
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DISTANCE * LINK_DISTANCE) {
            const d = Math.sqrt(d2);
            const t = 1 - d / LINK_DISTANCE;
            ctx.strokeStyle = `rgba(222, 198, 255, ${0.16 * t})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (advancing) {
        pulses = pulses
          .map((pu) => ({ ...pu, p: pu.p + 0.006 * speed }))
          .filter((pu) => pu.p < 1);
        for (const pu of pulses) {
          const a = nodes[pu.from];
          const b = nodes[pu.to];
          if (!a || !b) {
            continue;
          }
          const x = a.x + (b.x - a.x) * pu.p;
          const y = a.y + (b.y - a.y) * pu.p;
          const grd = ctx.createRadialGradient(x, y, 0, x, y, 7);
          grd.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          grd.addColorStop(0.4, 'rgba(169, 108, 226, 0.8)');
          grd.addColorStop(1, 'rgba(169, 108, 226, 0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const n of nodes) {
        const tw = reduce
          ? 0.85
          : 0.5 + 0.5 * Math.sin(time / 700 + n.phase);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(241, 222, 255, ${0.28 + 0.42 * tw})`;
        ctx.fill();
      }

      if (advancing) {
        pings = pings
          .map((p) => ({
            r: p.r + 0.9 * speed,
            alpha: Math.max(0, p.alpha - 0.012 * speed),
          }))
          .filter((p) => p.alpha > 0.02 && p.r < Math.max(width, height) * 0.9);
        for (const p of pings) {
          ctx.strokeStyle = `rgba(205, 160, 255, ${p.alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, p.r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      drawCore(time);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduce) {
        renderScene(0, false);
      }
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);

    if (!reduce) {
      const loop = (t: number) => {
        const speed = activeRef.current ? ACTIVE_SPEED : 1;
        if (t - lastPulse > PULSE_SPAWN_MS / speed && nodes.length >= 2) {
          lastPulse = t;
          const from = Math.floor(Math.random() * nodes.length);
          let to = Math.floor(Math.random() * nodes.length);
          if (to === from) {
            to = (to + 1) % nodes.length;
          }
          pulses.push({ from, to, p: 0 });
          if (pulses.length > 14) {
            pulses.shift();
          }
        }
        if (t - lastPing > PING_INTERVAL_MS) {
          lastPing = t;
          pings.push({ r: 10, alpha: 0.5 });
        }
        renderScene(t, true);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.neuralWrap}>
      <canvas ref={canvasRef} className={styles.neuralCanvas} />
    </div>
  );
}
