import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';

/**
 * Home Page - Starfield Navigation with Constellation Layout
 */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    const stars: Array<{ x: number; y: number; radius: number; opacity: number; twinkleSpeed: number }> = [];
    const starCount = 150;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    let animationId: number;

    const animate = () => {
      // Deep blue gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0d1b2a');
      gradient.addColorStop(0.5, '#1b263b');
      gradient.addColorStop(1, '#0d1b2a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Twinkle effect
        star.opacity += (Math.random() - 0.5) * star.twinkleSpeed;
        star.opacity = Math.max(0.1, Math.min(0.9, star.opacity));
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', setCanvasSize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Starfield Background */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        {/* Central Title */}
        <div className="text-center mb-24 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-4 tracking-[0.2em]">
            元知
          </h1>
          <p className="text-sm md:text-base text-white/50 font-light tracking-[0.3em] uppercase">
            助你学习的超级后盾
          </p>
        </div>

        {/* Star Navigation - Triangle Layout (smaller) */}
        <div className="relative w-full max-w-xl h-[280px]">
          {/* Top Star - 专题学习 */}
          <StarNode
            label="专题学习"
            englishLabel="Topic Mastery"
            onClick={() => navigate(ROUTES.TOPIC)}
            className="absolute left-1/2 -translate-x-1/2 top-0"
            glowColor="#e0e7ff"
          />

          {/* Bottom Left Star - 智能搜题 */}
          <StarNode
            label="智能搜题"
            englishLabel="Problem Solver"
            onClick={() => navigate(ROUTES.EXAM_PREP)}
            className="absolute left-[10%] bottom-0"
            glowColor="#e0e7ff"
          />

          {/* Bottom Right Star - 探索模式 */}
          <StarNode
            label="探索模式"
            englishLabel="Exploration"
            onClick={() => navigate(ROUTES.EXPLORATION)}
            className="absolute right-[10%] bottom-0"
            glowColor="#e0e7ff"
          />

          {/* Constellation Lines (optional subtle connection) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <line x1="50%" y1="12%" x2="18%" y2="82%" stroke="white" strokeWidth="0.5" />
            <line x1="50%" y1="12%" x2="82%" y2="82%" stroke="white" strokeWidth="0.5" />
            <line x1="18%" y1="82%" x2="82%" y2="82%" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface StarNodeProps {
  label: string;
  englishLabel: string;
  onClick: () => void;
  className?: string;
  glowColor?: string;
}

const StarNode: React.FC<StarNodeProps> = ({ label, englishLabel, onClick, className, glowColor = '#ffffff' }) => {
  return (
    <div
      className={`flex flex-col items-center cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Glowing Star */}
      <div className="relative mb-4">
        {/* Outer glow */}
        <div
          className="absolute w-12 h-12 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          }}
        />
        {/* Middle glow */}
        <div
          className="absolute w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          }}
        />
        {/* Core star */}
        <div
          className="w-3 h-3 rounded-full relative z-10 group-hover:scale-125 transition-transform duration-300"
          style={{
            backgroundColor: glowColor,
            boxShadow: `0 0 10px 2px ${glowColor}, 0 0 20px 4px ${glowColor}80`,
          }}
        />
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-white/90 text-base md:text-lg font-light tracking-wider mb-1 group-hover:text-white transition-colors">
          {label}
        </p>
        <p className="text-white/40 text-xs font-light tracking-wide group-hover:text-white/60 transition-colors">
          {englishLabel}
        </p>
      </div>
    </div>
  );
};

export default Home;
