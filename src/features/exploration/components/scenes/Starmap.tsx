import React, { useState, useEffect } from 'react';
import { Lock, Cpu, Globe, Database, Shield } from 'lucide-react';

interface StarmapProps {
  onSelectLevel: () => void;
}

const Starmap: React.FC<StarmapProps> = ({ onSelectLevel }) => {
  const [bootSequence, setBootSequence] = useState(false);

  useEffect(() => {
    setTimeout(() => setBootSequence(true), 500);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative animate-fadeIn overflow-hidden bg-slate-950">
      {/* Background Holographic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [perspective:1000px] [transform:rotateX(20deg)_scale(1.2)] pointer-events-none origin-bottom opacity-30"></div>
      
      {/* Header */}
      <div className={`z-10 text-center mb-8 space-y-2 transition-opacity duration-1000 ${bootSequence ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-4xl md:text-6xl font-serif-header text-cyan-100 tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          ARCHIVE_PROTOCOL
        </h1>
        <div className="flex items-center justify-center gap-2 text-cyan-600 font-mono text-xs tracking-[0.5em] uppercase">
           <Database size={12}/>
           Civilization Database: Corrupted
        </div>
      </div>

      {/* Map Container - Fixed Aspect Ratio for perfect lines */}
      <div className={`relative w-[320px] h-[320px] md:w-[600px] md:h-[400px] transition-all duration-1000 ${bootSequence ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
         
         {/* Lines */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Lines from Center (Kepler) to Nodes */}
            <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="#0e7490" strokeWidth="1" strokeDasharray="4,4" className="opacity-40" />
            <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="#0e7490" strokeWidth="1" strokeDasharray="4,4" className="opacity-40" />
            <line x1="50%" y1="50%" x2="85%" y2="85%" stroke="#0e7490" strokeWidth="1" strokeDasharray="4,4" className="opacity-40" />
            
            {/* Animated Pulses on lines */}
            <circle r="2" fill="#22d3ee">
               <animateMotion dur="3s" repeatCount="indefinite" path="M300,200 L120,320" />
            </circle>
         </svg>

         {/* Node 1: Kepler (Active - Center) */}
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <button 
                onClick={onSelectLevel}
                className="group relative w-32 h-32 flex flex-col items-center justify-center outline-none"
            >
                {/* Rotating Rings */}
                <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full w-full h-full animate-[spin_8s_linear_infinite]"></div>
                <div className="absolute inset-2 border border-dashed border-cyan-400/30 rounded-full w-auto h-auto animate-[spin_12s_linear_infinite_reverse]"></div>
                
                {/* Core */}
                <div className="w-16 h-16 bg-slate-900 border border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.4)] group-hover:bg-cyan-900/40 group-hover:scale-110 transition-all duration-300">
                    <Globe size={32} className="text-cyan-300 group-hover:text-white transition-colors" />
                </div>

                {/* Label */}
                <div className="absolute -bottom-12 text-center w-64">
                    <h3 className="text-cyan-100 font-bold tracking-widest text-sm bg-slate-900/80 px-2 rounded border border-cyan-900/50 inline-block mb-1 group-hover:text-white group-hover:border-cyan-500 transition-colors">
                        第一节点：天体立法
                    </h3>
                    <p className="text-[10px] text-cyan-600 font-mono uppercase tracking-widest">Status: Unresolved</p>
                </div>
            </button>
         </div>

         {/* Node 2: Newton (Locked - Bottom Left) */}
         <div className="absolute left-[20%] top-[80%] -translate-x-1/2 -translate-y-1/2 z-10 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center">
                   <Lock size={16} className="text-slate-500"/>
                </div>
                <span className="text-[10px] text-slate-500 font-mono tracking-widest">NEWTON</span>
            </div>
         </div>

         {/* Node 3: Einstein (Locked - Top Right) */}
         <div className="absolute left-[80%] top-[20%] -translate-x-1/2 -translate-y-1/2 z-10 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center">
                   <Lock size={16} className="text-slate-500"/>
                </div>
                <span className="text-[10px] text-slate-500 font-mono tracking-widest">EINSTEIN</span>
            </div>
         </div>
         
         {/* Node 4: Future (Locked - Bottom Right) */}
         <div className="absolute left-[85%] top-[85%] -translate-x-1/2 -translate-y-1/2 z-10 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center">
                   <Shield size={16} className="text-slate-500"/>
                </div>
                <span className="text-[10px] text-slate-500 font-mono tracking-widest">CLASSIFIED</span>
            </div>
         </div>
      </div>

      <div className="absolute bottom-8 w-full text-center">
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/80 border border-cyan-900/50 rounded-full text-cyan-700 font-mono text-[10px] tracking-[0.2em] animate-pulse">
            <Cpu size={12}/> SYSTEM_READY // AWAITING_INPUT
         </div>
      </div>
    </div>
  );
};

export default Starmap;