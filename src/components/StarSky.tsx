import React, { useEffect, useRef } from 'react';

interface StarSkyProps {
  onCanvasClick?: (x: number, y: number) => void;
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  speed: number;
  twinkleOffset: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  isHeart: boolean;
}

export const StarSky: React.FC<StarSkyProps> = ({ onCanvasClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    const colors = ['#ffffff', '#ffd1dc', '#ffe4e1', '#ffb6c1', '#fce4ec'];
    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      const count = Math.floor((width * height) / 3200);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.6,
          baseAlpha: Math.random() * 0.7 + 0.3,
          alpha: Math.random(),
          speed: Math.random() * 0.02 + 0.008,
          twinkleOffset: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    initStars();

    const maybeSpawnShootingStar = () => {
      if (Math.random() < 0.015 && shootingStarsRef.current.length < 3) {
        shootingStarsRef.current.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          length: Math.random() * 80 + 70,
          speed: Math.random() * 6 + 6,
          angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
          opacity: 1,
          active: true,
        });
      }
    };

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Render gentle stars
      for (const s of stars) {
        const currentAlpha = s.baseAlpha + Math.sin(time * 2 + s.twinkleOffset) * 0.35;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render shooting stars
      maybeSpawnShootingStar();
      for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
        const ss = shootingStarsRef.current[i];
        if (!ss.active) {
          shootingStarsRef.current.splice(i, 1);
          continue;
        }

        const dx = Math.cos(ss.angle) * ss.length;
        const dy = Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - dx, ss.y - dy);
        grad.addColorStop(0, `rgba(255, 235, 245, ${ss.opacity})`);
        grad.addColorStop(0.3, `rgba(255, 120, 180, ${ss.opacity * 0.7})`);
        grad.addColorStop(1, 'rgba(255, 100, 160, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - dx, ss.y - dy);
        ctx.stroke();

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.016;

        if (ss.opacity <= 0 || ss.x > width + 100 || ss.y > height + 100) {
          ss.active = false;
        }
      }

      // Render burst particles from clicks
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gentle gravity
        p.alpha -= 0.02;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);

        if (p.isHeart) {
          // Draw mini heart
          ctx.fillStyle = p.color;
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, s / 4);
          ctx.quadraticCurveTo(0, 0, s / 4, 0);
          ctx.quadraticCurveTo(s / 2, 0, s / 2, s / 3);
          ctx.quadraticCurveTo(s / 2, 0, (3 * s) / 4, 0);
          ctx.quadraticCurveTo(s, 0, s, s / 4);
          ctx.quadraticCurveTo(s, s / 2, (3 * s) / 4, (3 * s) / 4);
          ctx.lineTo(s / 2, s);
          ctx.lineTo(s / 4, (3 * s) / 4);
          ctx.quadraticCurveTo(0, s / 2, 0, s / 4);
          ctx.fill();
        } else {
          // Glowing star/sparkle
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Spawn 10 delightful heart and sparkle particles
    const heartColors = ['#ff439b', '#ff70b8', '#ff94c9', '#ffbad9', '#ffd5ec', '#ffffff'];
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
      const speed = Math.random() * 3.5 + 1.2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: Math.random() * 8 + 6,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        alpha: 1,
        life: 1,
        isHeart: i % 2 === 0,
      });
    }

    if (onCanvasClick) {
      onCanvasClick(x, y);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      className="fixed inset-0 pointer-events-auto z-0 cursor-pointer"
      style={{ touchAction: 'none' }}
    />
  );
};
