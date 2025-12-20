import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Power, Radio } from 'lucide-react';

interface GameIntroProps {
  onComplete: () => void;
}

const lines = [
  "正在建立神经连接...",
  "警告：公元2300年，人类文明数据完整性：0.00%。",
  "原因：基础科学逻辑链断裂。",
  "我们忘记了如何仰望星空，我们被困在了地球的泥沼中。",
  "启动 [CHRONOS] 协议...",
  "正在回溯至关键历史节点：公元1600年。",
  "目标：第谷·布拉赫的观测数据。",
  "你是我们最后的希望。",
];

const GameIntro: React.FC<GameIntroProps> = ({ onComplete }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineText, setCurrentLineText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setShowButton(true);
      return;
    }

    const targetLine = lines[currentLineIndex];
    
    if (currentLineText.length < targetLine.length) {
      const timeoutId = setTimeout(() => {
        setCurrentLineText(targetLine.slice(0, currentLineText.length + 1));
      }, 30 + Math.random() * 30);

      return () => clearTimeout(timeoutId);
    } else {
      const timeoutId = setTimeout(() => {
        setDisplayedLines(prev => [...prev, targetLine]);
        setCurrentLineText("");
        setCurrentLineIndex(prev => prev + 1);
      }, 600);

      return () => clearTimeout(timeoutId);
    }
  }, [currentLineIndex, currentLineText]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentLineText, displayedLines]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black relative p-8 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-10 opacity-20"></div>
      
      <div className="max-w-3xl w-full z-20 font-mono h-[80vh] flex flex-col">
        <div className="flex items-center gap-2 text-cyan-500 mb-8 animate-pulse shrink-0">
           <Radio size={20}/>
           <span className="tracking-widest uppercase text-xs">Secure Channel: ESTABLISHED</span>
        </div>

        <div className="space-y-4 overflow-y-auto pr-4 custom-scrollbar flex-1">
          {displayedLines.map((line, i) => (
            <div key={i} className="text-lg md:text-xl text-cyan-100/90 border-l-2 border-cyan-500/50 pl-4">
              <span className="text-cyan-600 mr-2">{`>`}</span>
              {line}
            </div>
          ))}

          {currentLineIndex < lines.length && (
            <div className="text-lg md:text-xl text-cyan-100/90 border-l-2 border-cyan-500 pl-4">
               <span className="text-cyan-600 mr-2">{`>`}</span>
               {currentLineText}
               <span className="inline-block w-2.5 h-5 bg-cyan-400 ml-1 animate-pulse align-middle"></span>
            </div>
          )}
          <div ref={scrollRef}></div>
        </div>

        {showButton && (
          <div className="pt-8 animate-fadeIn flex justify-center shrink-0 mb-10">
            <button 
              onClick={onComplete}
              className="group relative px-12 py-4 bg-cyan-900/20 border border-cyan-500/50 text-cyan-400 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 rounded-sm tracking-[0.2em] font-bold overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                 <Power size={20} />
                 接入知识星图
              </span>
              <div className="absolute inset-0 bg-cyan-500/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0e7490; border-radius: 2px; }
      `}</style>
    </div>
  );
};

export default GameIntro;
