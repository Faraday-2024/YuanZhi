import React, { useState, useMemo } from 'react';
import { Check, AlertTriangle } from 'lucide-react';

interface OrbitCalculationProps {
  onComplete: () => void;
}

const ORBIT_A = 150; 
const ORBIT_E_REAL = 0.3; 

const MARS_DATA = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30) * (Math.PI / 180);
  const r = (ORBIT_A * (1 - ORBIT_E_REAL * ORBIT_E_REAL)) / (1 + ORBIT_E_REAL * Math.cos(angle));
  return {
    cx: r * Math.cos(angle),
    cy: r * Math.sin(angle),
    angle
  };
});

const OrbitCalculation: React.FC<OrbitCalculationProps> = ({ onComplete }) => {
  const [eccentricity, setEccentricity] = useState(0); 
  const [message, setMessage] = useState("【开普勒抱着头低语】“它必须是圆的……如果不是圆的，那上帝就是个蹩脚的工匠。哪怕是0.0001的偏差也不行。”");
  const [attempted, setAttempted] = useState(false);
  
  const width = 400;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  const orbitPath = useMemo(() => {
    const a = ORBIT_A; 
    const e = eccentricity;
    const c = a * e; 
    const b = Math.sqrt(a * a - c * c);
    return { rx: a, ry: b, cx: centerX - c, cy: centerY };
  }, [eccentricity]);

  const error = useMemo(() => {
    let totalError = 0;
    MARS_DATA.forEach(point => {
        const r_point = Math.sqrt(point.cx * point.cx + point.cy * point.cy);
        const theta = point.angle;
        const e = eccentricity;
        const a = ORBIT_A;
        const r_theory = (a * (1 - e*e)) / (1 + e * Math.cos(theta)); 
        totalError += Math.abs(r_theory - r_point);
    });
    return totalError;
  }, [eccentricity]);

  const handleSolve = () => {
    setAttempted(true);
    if (error < 60) { 
      setMessage("【开普勒突然大笑起来，笑出了眼泪】“哈哈哈哈！看啊！不是圆！是椭圆！上帝没有疯，是我疯了！这8角分的误差……它是通往真理的大门！”");
      setTimeout(onComplete, 4000);
    } else {
      setMessage("【开普勒绝望地把墨水瓶砸向墙壁】“不对！还是不对！这该死的8角分！难道第谷的数据是错的？不……它是对的……是我的信仰错了……”");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 animate-fadeIn">
       <div className="bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-lg shadow-2xl w-full flex flex-col md:flex-row gap-8 backdrop-blur-md">
          
          <div className="flex-1 flex flex-col justify-center space-y-8">
            <div>
              <h2 className="text-4xl font-serif-header text-cyan-500 mb-2 tracking-tight">决战：8角分</h2>
              <div className="text-slate-400 text-sm font-light leading-relaxed">
                <p>完美的“正圆”模型与第谷的观测数据之间，存在微小的8角分误差。</p>
                <p className="mt-2 text-red-400">若忽略它，你可以哪怕世界安稳。若承认它，你将推翻两千年的神学。</p>
              </div>
            </div>

            <div className={`p-6 rounded border-l-2 transition-all duration-300 ${attempted && error > 60 ? 'bg-red-950/20 border-red-800' : 'bg-black/40 border-slate-700'}`}>
               <p className={`font-serif-header text-lg leading-relaxed italic ${attempted && error > 60 ? 'text-red-400' : 'text-slate-300'}`}>
                 {message}
               </p>
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-center mb-2">
                 <label className="text-sm text-slate-300 font-bold flex items-center gap-2 tracking-widest uppercase">
                    偏心率 (Eccentricity)
                 </label>
                 {error > 100 && <span className="text-xs text-red-500 font-bold flex items-center gap-1"><AlertTriangle size={12}/> 偏差：极大</span>}
                 {error <= 100 && error > 60 && <span className="text-xs text-amber-500 font-bold flex items-center gap-1">偏差：接近</span>}
                 {error <= 60 && <span className="text-xs text-green-500 font-bold flex items-center gap-1"><Check size={12}/> 拟合完美</span>}
               </div>
               
               <div className="relative">
                   <input 
                     type="range"
                     min="0"
                     max="0.6"
                     step="0.01"
                     value={eccentricity}
                     onChange={(e) => {
                        setAttempted(false);
                        const val = parseFloat(e.target.value);
                        setEccentricity(val);
                        if (val < 0.05) setMessage("【开普勒喃喃自语】“圆……完美的圆……这是唯一的真理。”");
                        else if (val >= 0.28 && val <= 0.32) setMessage("【开普勒的手颤抖着】“等等……如果把太阳放在焦点上……这种形状……天哪，它在呼吸！”");
                        else if (val > 0.5) setMessage("【开普勒摇头】“不，太扁了。这样行星会飞出去的。”");
                        else setMessage("【开普勒咬着笔杆】“还在计算……该死，这些数字在嘲笑我！”");
                     }}
                     className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-600 focus:outline-none"
                   />
                   <div className="flex justify-between text-xs text-slate-600 font-mono mt-3">
                     <span>0.0 (圆)</span>
                     <span className="text-cyan-600">TARGET</span>
                     <span>0.6 (扁)</span>
                   </div>
               </div>
            </div>

            <button
               onClick={handleSolve}
               disabled={attempted && error < 60} 
               className={`py-5 px-6 rounded-sm font-bold font-serif-header tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 shadow-lg
                 ${error < 60 
                    ? 'bg-cyan-800 hover:bg-cyan-700 text-white shadow-cyan-900/40 animate-pulse border border-cyan-600' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
            >
               {error < 60 ? <><Check size={18}/> 确认新宇宙模型</> : '验证模型假设'}
            </button>
          </div>

          <div className="flex-1 flex justify-center items-center bg-black/80 rounded-full aspect-square border border-slate-800 relative shadow-2xl overflow-hidden group">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-700 via-black to-black"></div>

             <svg width={width} height={height} className="overflow-visible z-10 transition-transform duration-500">
                <circle cx={centerX} cy={centerY} r={8} fill="#fbbf24" className="filter drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
                <text x={centerX} y={centerY + 4} textAnchor="middle" fontSize="8" fill="black" fontWeight="bold">SOL</text>
                
                {MARS_DATA.map((point, i) => (
                   <g key={i} transform={`translate(${centerX + point.cx}, ${centerY + point.cy})`}>
                      <circle r={3} fill="#ef4444" className="opacity-90" />
                      {eccentricity > 0 && (
                          <line 
                            x1={0} y1={0} 
                            x2={-point.cx}
                            y2={-point.cy}
                            stroke="rgba(255,255,255,0.05)" 
                            strokeWidth="1" 
                          />
                      )}
                   </g>
                ))}

                <ellipse 
                   cx={orbitPath.cx} 
                   cy={orbitPath.cy} 
                   rx={orbitPath.rx} 
                   ry={orbitPath.ry} 
                   fill="none" 
                   stroke={error < 60 ? "#22d3ee" : "#334155"} 
                   strokeWidth={error < 60 ? "3" : "1"}
                   strokeDasharray={error < 60 ? "none" : "4,4"}
                   className="transition-all duration-300 ease-out"
                />
             </svg>
             
             <div className="absolute bottom-6 right-6 text-right">
                <div className="text-[10px] font-mono text-slate-600 uppercase mb-1 tracking-widest">ERROR_MARGIN</div>
                <div className={`text-2xl font-mono font-bold ${error < 60 ? 'text-green-500' : 'text-red-800'}`}>
                    {Math.round(error)}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default OrbitCalculation;