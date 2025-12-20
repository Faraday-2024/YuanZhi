import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Orbit, CheckCircle2 } from 'lucide-react';

interface CinematicRevealProps {
  onComplete: () => void;
}

const KEPLER_LAWS = [
  {
    title: "第一定律：椭圆定律",
    sub: "(Law of Ellipses)",
    desc: "所有行星绕太阳运动的轨道都是椭圆，太阳处在椭圆的一个焦点上。",
    id: "K-LAW-01"
  },
  {
    title: "第二定律：面积定律",
    sub: "(Law of Equal Areas)",
    desc: "对任意一个行星来说，它与太阳的连线在相等的时间内扫过相等的面积。",
    id: "K-LAW-02"
  },
  {
    title: "第三定律：调和定律",
    sub: "(Law of Harmonies)",
    desc: "所有行星轨道的半长轴的三次方跟公转周期的二次方的比值都相等。",
    id: "K-LAW-03"
  }
];

const CinematicReveal: React.FC<CinematicRevealProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 0: Init, 1: Text, 2: Transform, 3: Button
  const [showLaws, setShowLaws] = useState(false); // New state for delayed laws reveal

  useEffect(() => {
    setTimeout(() => setPhase(1), 1000); // Show "Theory Collapse"
    setTimeout(() => setPhase(2), 4000); // Start Transformation & Show "New Universe Laws" Title
    setTimeout(() => setShowLaws(true), 8000); // Show Laws Text (Delay increased to 4s after model start)
    setTimeout(() => setPhase(3), 13000); // Show Button (Delayed to match laws)
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#020617] perspective-[1200px]">
       
       {/* Background Deep Space */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#020617] to-black"></div>
       
       {/* Floating Particles */}
       <div className="absolute inset-0 w-full h-full opacity-30 animate-pulse bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

       {/* 3D Scene Container */}
       <div className={`relative w-[600px] h-[600px] md:w-[800px] md:h-[800px] [transform-style:preserve-3d] transition-transform duration-[3s] ease-in-out ${phase >= 2 ? '[transform:rotateX(60deg)_rotateZ(45deg)_scale(0.8)_translateX(-10%)]' : '[transform:rotateX(0deg)_rotateZ(0deg)_scale(1)]'}`}>
          
          {/* Holographic Grid Floor */}
          <div className={`absolute inset-[-50%] bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [transform:translateZ(-100px)] transition-opacity duration-1000 ${phase >= 2 ? 'opacity-40' : 'opacity-0'}`}></div>

          {/* The Sun (Center) */}
          <div className="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-400 rounded-full shadow-[0_0_80px_rgba(250,204,21,0.6)] z-20 animate-pulse">
             <div className="absolute inset-0 border-2 border-yellow-200/50 rounded-full animate-ping"></div>
          </div>
          
          {/* OLD WORLD: The Perfect Circle (Fades Out) */}
          <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-cyan-800/50 rounded-full transition-all duration-[2s] ${phase >= 2 ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
              <div className="absolute -top-6 left-1/2 text-cyan-800 text-xs font-mono">DOGMA: CIRCLE</div>
          </div>

          {/* NEW WORLD: The Ellipses (Reveal) */}
          {/* Inner Planets */}
          <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[220px] border border-cyan-600/30 rounded-[50%] transition-all duration-[3s] delay-500 ${phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
          
          {/* MARS ORBIT (Hero) */}
          <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[420px] border-2 border-cyan-400 rounded-[50%] shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all duration-[4s] ease-out ${phase >= 2 ? 'opacity-100 scale-100 border-cyan-400' : 'opacity-0 scale-90 border-transparent'}`}>
              
              {/* Mars Planet */}
              <div className="absolute top-0 left-1/2 w-6 h-6 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-[orbitTravel_12s_linear_infinite] offset-path-ellipse">
                 {/* Trail */}
                 <div className="absolute w-32 h-1 bg-gradient-to-l from-red-500/0 to-red-500/50 -left-32 top-1/2 blur-sm"></div>
              </div>

              {/* Data Points on Orbit */}
              <div className="absolute top-[10%] left-[80%] w-2 h-2 bg-white rounded-full animate-ping"></div>
              <div className="absolute top-[90%] left-[20%] w-2 h-2 bg-white rounded-full animate-ping delay-700"></div>
          </div>

          {/* Outer Ring Hologram */}
          <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-dashed border-cyan-900/50 rounded-full animate-[spin_60s_linear_infinite] transition-opacity ${phase >= 2 ? 'opacity-30' : 'opacity-0'}`}></div>
       </div>

       {/* Dramatic Text Overlay - Phase 1 */}
       <div className={`absolute top-[20%] w-full text-center z-50 pointer-events-none transition-all duration-1000 ${phase === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h2 className="text-4xl md:text-6xl font-serif-header text-slate-500 tracking-widest uppercase">
             完美正圆已死
          </h2>
       </div>

       {/* Holographic HUD Laws - Revealed Delayed with Staggered Animation */}
       <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-[500px] p-6 md:pr-10 space-y-8 z-40 transition-all duration-1000 ${showLaws ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
          <div className={`mb-6 pl-6 border-l-4 border-cyan-500 transition-all duration-700 ${showLaws ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
             <h3 className="text-3xl font-serif-header text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] mb-2">
                开普勒三定律
             </h3>
             <div className="text-cyan-500 font-mono text-xs tracking-[0.2em] uppercase">
                Universal Laws of Planetary Motion
             </div>
          </div>
          
          <div className="space-y-10">
            {KEPLER_LAWS.map((law, idx) => (
               <div 
                 key={law.id} 
                 className={`flex gap-6 group items-start transition-all duration-700 ${showLaws ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                 style={{ transitionDelay: `${idx * 0.4 + 0.3}s` }}
               >
                  <div className="mt-1 shrink-0">
                    <CheckCircle2 className="text-cyan-500 group-hover:text-cyan-400 transition-colors drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" size={20} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <h4 className="text-lg md:text-xl text-cyan-200 font-serif-header font-medium group-hover:text-cyan-100 transition-colors">{law.title}</h4>
                        <span className="text-xs font-mono text-cyan-700 font-medium uppercase tracking-wider">{law.sub}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300 transition-colors">{law.desc}</p>
                  </div>
               </div>
            ))}
          </div>
       </div>

       {/* Bottom Title - Phase 2+ (Matches Model) */}
       <div className={`absolute bottom-[15%] left-10 md:left-20 z-50 pointer-events-none transition-all duration-1000 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl md:text-7xl font-serif-header text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 to-cyan-600 tracking-tight drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] mb-2">
             新宇宙法则
          </h2>
          <div className="flex items-center gap-4 text-cyan-400 font-mono tracking-[0.5em] text-sm">
             <Orbit size={16} />
             <span>MODEL_CONFIRMED</span>
          </div>
       </div>

       {/* Continue Button */}
       <div className={`absolute bottom-6 right-10 z-50 transition-all duration-1000 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button 
             onClick={onComplete}
             className="group flex items-center gap-4 px-10 py-4 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-100 rounded-sm backdrop-blur-md transition-all shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:shadow-[0_0_60px_rgba(6,182,212,0.4)]"
          >
             <Sparkles size={20} className="text-cyan-400" />
             <span className="tracking-[0.2em] font-bold">写入文明档案</span>
             <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform text-cyan-400"/>
          </button>
       </div>

       <style>{`
          .offset-path-ellipse {
             offset-path: ellipse(300px 210px at 50% 50%);
             offset-rotate: auto 90deg;
          }
          @keyframes orbitTravel {
            0% { offset-distance: 0%; }
            100% { offset-distance: 100%; }
          }
       `}</style>
    </div>
  );
};

export default CinematicReveal;