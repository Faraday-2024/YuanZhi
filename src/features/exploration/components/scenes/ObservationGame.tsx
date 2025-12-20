import React, { useState, useEffect } from 'react';
import { Eye, Crosshair, Wind } from 'lucide-react';

interface ObservationGameProps {
  onComplete: (score: number) => void;
}

const ObservationGame: React.FC<ObservationGameProps> = ({ onComplete }) => {
  const [angle, setAngle] = useState(45);
  const [drift, setDrift] = useState(0);
  const [isStabilizing, setIsStabilizing] = useState(false);
  const [targetAngle, setTargetAngle] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [status, setStatus] = useState<'intro' | 'playing' | 'success' | 'fail'>('intro');

  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      if (!isStabilizing) {
        const noise = (Math.random() - 0.5) * 1.5; 
        setDrift(prev => {
          let newDrift = prev + noise;
          if (newDrift > 5) newDrift = 5;
          if (newDrift < -5) newDrift = -5;
          return newDrift;
        });
      } else {
        setDrift(prev => prev * 0.8);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [status, isStabilizing]);

  const effectiveAngle = angle + drift;

  useEffect(() => {
    const newTarget = Math.floor(Math.random() * 50) + 20; 
    setTargetAngle(newTarget);
    setAngle(45);
    setDrift(0);
    if (status === 'intro') return;
    setTimeLeft(20);
  }, [round, status]);

  useEffect(() => {
    if (timeLeft <= 0 || status !== 'playing') return;
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const handleStartRound = () => setStatus('playing');

  const handleLockIn = () => {
    const error = Math.abs(effectiveAngle - targetAngle);
    if (error < 2) {
      setStatus('success');
      setTimeout(() => {
        if (round < 3) {
          setScore(s => s + 1);
          setRound(r => r + 1);
          setStatus('playing');
        } else {
          onComplete(score + 1);
        }
      }, 2000);
    } else {
      setStatus('fail');
      setTimeout(() => {
        if (round < 3) {
          setRound(r => r + 1);
          setStatus('playing');
        } else {
          onComplete(score);
        }
      }, 2000);
    }
  };

  if (status === 'intro') {
     return (
       <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center p-8 bg-slate-900/90 border border-cyan-900/50 rounded-sm shadow-[0_0_50px_rgba(8,145,178,0.2)] relative animate-fadeIn">
         <div className="absolute top-0 left-0 w-full h-1 bg-cyan-600"></div>
         <h2 className="text-3xl font-serif-header text-cyan-400 mb-6 tracking-wide">第谷的试炼</h2>
         <p className="text-slate-300 mb-8 leading-loose font-light">
           1600年的冬夜冷得刺骨。<br/>
           你站在露天台阶上，手里握着那个巨大的黄铜象限仪。<br/><br/>
           第谷在黑暗中盯着你。如果你手抖了，他会毫不犹豫地把你赶出去。<br/>
           <span className="text-white font-normal block mt-4 bg-slate-950 p-3 border border-slate-700">长按 <span className="text-cyan-400 font-bold">【稳定准星】</span> 对抗风阻<br/>在晃动最小的瞬间记录火星位置。</span>
         </p>
         <button onClick={handleStartRound} className="px-12 py-4 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-700 text-cyan-100 font-bold rounded-sm tracking-[0.2em] transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
           接受试炼
         </button>
       </div>
     )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto p-6 bg-slate-950/80 border border-cyan-900/30 rounded-sm shadow-2xl backdrop-blur-md relative overflow-hidden">
      <div className="flex justify-between w-full mb-4 items-end">
        <div>
          <h2 className="text-xl font-serif-header text-cyan-500 tracking-widest">OBSERVATION_SEQ: 0{round}</h2>
          <p className="text-xs text-slate-500 font-mono mt-1">TARGET: MARS_ANOMALY</p>
        </div>
        <div className={`text-3xl font-mono font-bold ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
          00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </div>
      </div>

      {/* Viewport */}
      <div className="relative w-full h-80 bg-black border-4 border-slate-800 rounded-sm mb-6 overflow-hidden shadow-inner cursor-crosshair group">
         <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
         
         {/* Crosshair */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className={`border w-16 h-16 flex items-center justify-center transition-colors duration-200 rounded-full ${isStabilizing ? 'border-green-500/50 bg-green-900/5' : 'border-red-500/20'}`}>
                <div className="w-[1px] h-full bg-cyan-500/30 absolute"></div>
                <div className="h-[1px] w-full bg-cyan-500/30 absolute"></div>
            </div>
         </div>

         {/* Moving Star Layer */}
         <div 
            className="absolute left-1/2 top-1/2 w-full h-full transition-transform duration-75 ease-linear"
            style={{
                transform: `translate(-50%, -50%) translateY(${(effectiveAngle - targetAngle) * 15}px)`
            }}
         >
            <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-red-500 rounded-full blur-[1px] shadow-[0_0_15px_#ef4444] animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute left-1/4 top-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
            <div className="absolute right-1/3 bottom-1/3 w-1 h-1 bg-cyan-100 rounded-full opacity-20"></div>
         </div>

         {!isStabilizing && (
             <div className="absolute top-4 right-4 text-red-500/50 flex items-center gap-2 animate-pulse font-mono text-xs border border-red-900/30 p-1 px-2 bg-black/50">
                <Wind size={12}/> WIND_SHEAR_DETECTED
             </div>
         )}
         
         {status === 'success' && (
             <div className="absolute inset-0 bg-green-900/30 flex items-center justify-center z-30 backdrop-blur-[2px]">
                 <h3 className="text-2xl font-bold text-green-100 tracking-[0.5em] border-y border-green-500/50 py-2 bg-black/50 w-full text-center">LOCKED</h3>
             </div>
         )}
         {status === 'fail' && (
             <div className="absolute inset-0 bg-red-900/30 flex items-center justify-center z-30 backdrop-blur-[2px]">
                 <h3 className="text-2xl font-bold text-red-100 tracking-[0.5em] border-y border-red-500/50 py-2 bg-black/50 w-full text-center">MISALIGNED</h3>
             </div>
         )}
      </div>

      {/* Controls */}
      <div className="w-full space-y-6">
        <div className="relative pt-6">
            <input 
              type="range" 
              min="10" 
              max="80" 
              step="0.1"
              value={angle} 
              onChange={(e) => setAngle(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-cyan-600"
            />
            <div className="text-center mt-3 font-mono text-cyan-500 text-2xl tracking-widest font-light">
                {effectiveAngle.toFixed(2)}°
            </div>
        </div>

        <div className="flex gap-4">
            <button
                onMouseDown={() => setIsStabilizing(true)}
                onMouseUp={() => setIsStabilizing(false)}
                onTouchStart={() => setIsStabilizing(true)}
                onTouchEnd={() => setIsStabilizing(false)}
                className={`flex-1 py-4 border rounded-sm font-bold transition-all duration-100 select-none tracking-widest text-xs md:text-sm
                    ${isStabilizing 
                        ? 'bg-cyan-950 border-cyan-600 text-cyan-100 scale-[0.98]' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
            >
                <span className="flex items-center justify-center gap-2">
                    <Crosshair size={16}/> HOLD TO STABILIZE
                </span>
            </button>

            <button 
              onClick={handleLockIn}
              disabled={status !== 'playing'}
              className={`flex-1 py-4 border rounded-sm font-bold transition-all tracking-widest text-xs md:text-sm
                ${status === 'playing' ? 'bg-cyan-800/80 border-cyan-600 hover:bg-cyan-700 text-white shadow-[0_0_20px_rgba(8,145,178,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-600'}
              `}
            >
              <span className="flex items-center justify-center gap-2">
                  <Eye size={16}/> RECORD
              </span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ObservationGame;