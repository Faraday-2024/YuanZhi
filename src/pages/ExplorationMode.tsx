import React, { useState, useEffect, useRef } from 'react';
import Starfield from '@features/exploration/components/Starfield';
import GameIntro from '@features/exploration/components/scenes/GameIntro';
import Starmap from '@features/exploration/components/scenes/Starmap';
import CinematicReveal from '@features/exploration/components/scenes/CinematicReveal';
import ObservationGame from '@features/exploration/components/scenes/ObservationGame';
import OrbitCalculation from '@features/exploration/components/scenes/OrbitCalculation';
import { generateDialogue } from '@shared/services/geminiService';
import { SceneType, Character, DialogueMessage } from '@features/exploration/types';
import { Terminal, ArrowRight, BookOpen, Lock, ShieldAlert, Sparkles, Skull, AlertOctagon, Map } from 'lucide-react';
import useViewportManager from '@shared/hooks/useViewportManager';
import ForceLandscape from '@shared/components/ForceLandscape';

// Fixed conclusion text - no AI generation needed
const CONCLUSION_TEXT = [
  {
    text: "1609年，《新天文学》出版。开普勒用椭圆轨道取代了完美的圆，用数学取代了神学。这本书的副标题是：'基于火星运动的天体物理学'——第谷毕生观测的结晶。",
    subtitle: "Astronomia Nova · 新天文学"
  },
  {
    text: "这8角分的误差，成为了人类认知宇宙的转折点。从此，我们不再仰望神迹，而是开始计算轨道。行星不再是神的使者，而是遵循数学法则的天体。宇宙的语言，原来是数学。",
    subtitle: "The 8 Arc Minutes · 八角分之谜"
  },
  {
    text: "1619年，开普勒发表《世界的和谐》，提出了行星运动第三定律。他终于听到了宇宙的音乐——不是完美的圆，而是椭圆的和弦。他写道：'我可以等待一个世纪才有读者，正如上帝等待了六千年才有观察者。'",
    subtitle: "Harmonices Mundi · 世界的和谐"
  },
  {
    text: "七十年后，牛顿站在开普勒的肩膀上，写下了万有引力定律。他说：'如果我看得更远，那是因为我站在巨人的肩膀上。' 开普勒的三定律，成为了牛顿力学的基石。",
    subtitle: "Principia Mathematica · 自然哲学的数学原理"
  },
  {
    text: "三百年后，人类踏上了月球。阿姆斯特朗的一小步，是开普勒那支颤抖的笔迈出的第一步。NASA的轨道计算，至今仍在使用开普勒方程。从布拉格的天文台到宁静海，知识的接力从未中断。",
    subtitle: "Apollo 11 · 阿波罗11号"
  },
  {
    text: "如今，旅行者1号已飞出太阳系，带着人类的问候驶向星际。开普勒望远镜发现了数千颗系外行星。詹姆斯·韦伯望远镜正在凝视宇宙的黎明。这一切，都始于那8角分的执念。",
    subtitle: "Voyager · 旅行者"
  },
  {
    text: "第谷临终前说：'愿我不曾虚度此生。' 他没有。他的数据穿越了死亡，点燃了科学革命的火种。一个固执的丹麦人和一个疯狂的德国人，用他们的争论改变了人类的命运。",
    subtitle: "Ne Frustra Vixisse Videar · 愿我不曾虚度此生"
  },
  {
    text: "时间线已修复。文明的火种，再次点燃。",
    subtitle: "Timeline Restored · 时间线已修复",
    isLarge: true
  }
];

// Character intro data
const CHARACTER_INFO = {
  tycho: {
    name: '第谷·布拉赫',
    englishName: 'Tycho Brahe',
    years: '1546 - 1601',
    title: '丹麦天文学家 · 皇家数学家',
    bio: [
      '史上最伟大的裸眼观测者',
      '建造了当时最精密的天文仪器',
      '积累了20年的行星观测数据',
      '因决斗失去鼻子，佩戴金银假鼻',
      '性格偏执多疑，视数据如生命'
    ],
    color: 'red'
  },
  kepler: {
    name: '约翰内斯·开普勒',
    englishName: 'Johannes Kepler',
    years: '1571 - 1630',
    title: '德国天文学家 · 帝国数学家',
    bio: [
      '行星运动三定律的发现者',
      '现代天体物理学的奠基人',
      '童年天花导致视力受损',
      '一生贫困，母亲曾被指控为女巫',
      '坚信宇宙遵循数学和谐'
    ],
    color: 'cyan'
  }
};

const ExplorationMode: React.FC = () => {
  const [scene, setScene] = useState<SceneType>(SceneType.GAME_INTRO);
  const [dialogueHistory, setDialogueHistory] = useState<DialogueMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [textParagraphs, setTextParagraphs] = useState<{text: string; subtitle: string; isLarge?: boolean}[]>([]);
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const [, setTychoTrust] = useState(40);

  // Force landscape and desktop viewport for this mode
  useViewportManager(true);
  // Character intro phases: 
  // showTitle -> showName -> moveUpAndShowBio -> hideBioAndTitle -> moveToSide -> done
  const [introPhase, setIntroPhase] = useState<'showTitle' | 'showName' | 'moveUpAndShowBio' | 'hideBioAndTitle' | 'moveToSide' | 'done'>('showTitle');
  const [visibleBioLines, setVisibleBioLines] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueHistory]);

  useEffect(() => {
    if (scene === SceneType.CONCLUSION && textParagraphs.length > 0 && visibleParagraphs < textParagraphs.length) {
      const timer = setTimeout(() => {
        setVisibleParagraphs(prev => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [scene, textParagraphs, visibleParagraphs]);

  // Character intro animation - Phase 1: Show title first
  useEffect(() => {
    if (scene === SceneType.CHARACTER_INTRO_TYCHO || scene === SceneType.CHARACTER_INTRO_KEPLER) {
      // Reset states when entering character intro
      setIntroPhase('showTitle');
      setVisibleBioLines(0);
      
      // After 2.1s (wait for title fade in animation to complete), show name
      const timer = setTimeout(() => {
        setIntroPhase('showName');
      }, 2100);
      
      return () => clearTimeout(timer);
    }
  }, [scene]);

  // Phase 2: After showing name, move up and show bio
  useEffect(() => {
    if ((scene === SceneType.CHARACTER_INTRO_TYCHO || scene === SceneType.CHARACTER_INTRO_KEPLER) && introPhase === 'showName') {
      const timer = setTimeout(() => {
        setIntroPhase('moveUpAndShowBio');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [scene, introPhase]);

  // Phase 3: Bio lines reveal effect
  useEffect(() => {
    if ((scene === SceneType.CHARACTER_INTRO_TYCHO || scene === SceneType.CHARACTER_INTRO_KEPLER) && introPhase === 'moveUpAndShowBio') {
      const charKey = scene === SceneType.CHARACTER_INTRO_TYCHO ? 'tycho' : 'kepler';
      const bioLength = CHARACTER_INFO[charKey].bio.length;
      
      if (visibleBioLines < bioLength) {
        const timer = setTimeout(() => {
          setVisibleBioLines(prev => prev + 1);
        }, 600);
        return () => clearTimeout(timer);
      } else {
        // All bio lines shown, wait then hide bio and title
        const hideTimer = setTimeout(() => {
          setIntroPhase('hideBioAndTitle');
        }, 1500);
        return () => clearTimeout(hideTimer);
      }
    }
  }, [scene, introPhase, visibleBioLines]);

  // Phase 4: Hide bio and title, then move to side
  useEffect(() => {
    if ((scene === SceneType.CHARACTER_INTRO_TYCHO || scene === SceneType.CHARACTER_INTRO_KEPLER) && introPhase === 'hideBioAndTitle') {
      const timer = setTimeout(() => {
        setIntroPhase('moveToSide');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [scene, introPhase]);

  // Phase 5: Move to side, then transition to dialogue
  useEffect(() => {
    if ((scene === SceneType.CHARACTER_INTRO_TYCHO || scene === SceneType.CHARACTER_INTRO_KEPLER) && introPhase === 'moveToSide') {
      const timer = setTimeout(() => {
        setIntroPhase('done');
        if (scene === SceneType.CHARACTER_INTRO_TYCHO) {
          setScene(SceneType.DIALOGUE_TYCHO);
        } else {
          setScene(SceneType.DIALOGUE_KEPLER);
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [scene, introPhase]);

  const handleIntroComplete = () => setScene(SceneType.STARMAP);
  const handleLevelSelect = () => setScene(SceneType.INTRO);
  const handleStart = () => setScene(SceneType.OBSERVATION);
  const handleToCalculation = () => setScene(SceneType.CALCULATION);
  const handleCalculationComplete = () => setScene(SceneType.CINEMATIC_REVEAL);

  const handleObservationComplete = (score: number) => {
    const trustGain = score * 10;
    setTychoTrust(prev => prev + trustGain);
    let introText = "";
    if (score >= 3) {
      introText = `【第谷在那只金银假鼻后面嗅了嗅】"你……看得很准。太准了。就像你也知道这星空背后藏着什么脏东西一样。你是谁？教会派来的间谍？还是那个德国疯子的信徒？"`;
    } else if (score >= 1) {
      introText = `【第谷阴沉地盯着你】"手别抖。这台仪器比你的命还值钱。你看到了什么？告诉我，你也看到那些该死的偏差了吗？"`;
    } else {
      introText = `【第谷猛地拍打桌子】"废物！你是想毁了我的毕生心血吗？还是说……你是故意来破坏数据的？"`;
    }
    setDialogueHistory([{ sender: Character.TYCHO, text: introText }]);
    setScene(SceneType.CHARACTER_INTRO_TYCHO);
  };

  const handleDialogueSubmit = async (char: Character) => {
    if (!userInput.trim()) return;
    const newHistory = [...dialogueHistory, { sender: '玩家' as const, text: userInput }];
    setDialogueHistory(newHistory);
    setUserInput('');
    setIsLoading(true);
    const response = await generateDialogue(char, newHistory.map(m => `${m.sender}: ${m.text}`), userInput);
    setDialogueHistory(prev => [...prev, { sender: char, text: response }]);
    setIsLoading(false);
  };

  const handleHeistOption = () => {
    setDialogueHistory([{
      sender: Character.KEPLER,
      text: `【开普勒在漏雨的阁楼里，眼神狂乱】"是你……我闻到了……那是第谷的墨水味！那是星星的血！给我！快给我！我要看看上帝到底画了什么！"`
    }]);
    setScene(SceneType.CHARACTER_INTRO_KEPLER);
  };

  const handleCinematicComplete = () => {
    setTextParagraphs(CONCLUSION_TEXT);
    setVisibleParagraphs(0);
    setScene(SceneType.CONCLUSION);
  };

  const handleReturnToStarmap = () => {
    setDialogueHistory([]);
    setTychoTrust(40);
    setScene(SceneType.STARMAP);
  };


  const renderSceneHeader = () => {
    if (scene === SceneType.DIALOGUE_TYCHO) {
      return (
        <div className="w-full max-w-4xl mb-4 bg-red-950/20 border-l-4 border-red-800 p-4 rounded-r animate-slideIn backdrop-blur-sm">
          <h3 className="text-red-500 font-serif-header flex items-center gap-2 tracking-widest"><Skull size={18}/> 疑云密布：贝拉克宫</h3>
          <p className="text-slate-400 text-sm mt-1 italic">"第谷并不是在保护数据，他是在恐惧数据。他发现了一个裂痕，他觉得那是地狱的入口。你需要让他相信，通过那个裂痕能看到的不是地狱，而是未来。"</p>
        </div>
      );
    }
    if (scene === SceneType.DIALOGUE_KEPLER) {
      return (
        <div className="w-full max-w-4xl mb-4 bg-cyan-950/20 border-l-4 border-cyan-800 p-4 rounded-r animate-slideIn backdrop-blur-sm">
          <h3 className="text-cyan-500 font-serif-header flex items-center gap-2 tracking-widest"><AlertOctagon size={18}/> 疯狂边缘：贫民窟阁楼</h3>
          <p className="text-slate-400 text-sm mt-1 italic">"开普勒已经疯了。他试图强行把方形塞进圆孔里。如果你不能让他接受宇宙是不完美的，他就会烧掉手稿，然后自杀。"</p>
        </div>
      );
    }
    return null;
  };

  const renderIntro = () => (
    <div className="max-w-3xl text-center space-y-12 animate-fadeIn relative z-10 px-4">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-serif-header text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 to-cyan-700 tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">MISSION: KEPLER</h1>
        <h2 className="text-xl md:text-2xl text-cyan-500 font-serif-header tracking-[0.8em] uppercase flex items-center justify-center gap-4">
          <span className="w-8 h-px bg-cyan-800"></span>星穹接力<span className="w-8 h-px bg-cyan-800"></span>
        </h2>
      </div>
      <div className="bg-slate-900/60 border border-cyan-900/50 p-8 backdrop-blur-md text-left shadow-2xl relative overflow-hidden rounded-sm">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
        <div className="flex items-start gap-5 mb-8 relative z-10">
          <div className="p-3 bg-cyan-950/30 rounded border border-cyan-500/30"><ShieldAlert className="text-cyan-500" size={32} /></div>
          <div className="space-y-2">
            <p className="text-xl text-slate-100 font-serif-header tracking-wide">【紧急警报：现实维度坍缩】</p>
            <p className="text-slate-500 text-sm font-mono">时间线完整度：<span className="text-red-500">12.4%</span> (极危)<br/>关键节点丢失：1609年《新天文学》未出版。</p>
          </div>
        </div>
        <div className="space-y-6 text-slate-300 leading-relaxed relative z-10 font-light text-lg">
          <p>如果第谷的数据没有传给开普勒，人类就永远被困在"完美的圆"里。没有椭圆轨道，就没有万有引力，没有航天，没有我们。</p>
          <p>我们的侦测显示，在这条时间线上，第谷·布拉赫死于<span className="text-red-400 font-bold border-b border-red-900/50">蓄意谋杀</span>。凶手试图切断这条知识链条。</p>
          <p className="italic text-cyan-400 pl-4 border-l-2 border-cyan-800/50">"你需要潜入那个充满水银味和猜忌的贝拉克宫。找到那个想隐瞒真相的老人，把未来的钥匙偷出来。"</p>
        </div>
      </div>
      <button onClick={handleStart} className="group relative px-12 py-5 overflow-hidden rounded-sm bg-cyan-950 text-cyan-100 font-bold tracking-[0.2em] hover:text-white border border-cyan-800 hover:border-cyan-400 transition-all duration-500 shadow-[0_0_20px_rgba(8,145,178,0.2)]">
        <span className="relative z-10 flex items-center gap-3"><Terminal size={18}/> 介入时间线</span>
        <div className="absolute inset-0 bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
      </button>
    </div>
  );


  const renderDialogue = (char: Character) => {
    const charName = char === Character.TYCHO ? '第谷·布拉赫' : '约翰内斯·开普勒';
    const charTitle = char === Character.TYCHO ? 'Tycho Brahe · 皇家天文学家' : 'Johannes Kepler · 帝国数学家';
    const charColor = char === Character.TYCHO ? 'red' : 'cyan';
    
    return (
      <div className="flex w-full max-w-5xl px-4 gap-8">
        {/* Left Side - Character Info */}
        <div className={`hidden md:flex flex-col items-center w-48 shrink-0 pt-8`}>
          <div className={`w-24 h-24 rounded-full border-2 ${charColor === 'red' ? 'border-red-800/50 shadow-[0_0_30px_rgba(153,27,27,0.3)]' : 'border-cyan-800/50 shadow-[0_0_30px_rgba(8,145,178,0.3)]'} bg-slate-950 flex items-center justify-center mb-4`}>
            <span className={`font-serif-header text-5xl ${charColor === 'red' ? 'text-red-900/60' : 'text-cyan-900/60'}`}>
              {char === Character.TYCHO ? 'T' : 'K'}
            </span>
          </div>
          <h3 className={`font-serif-header text-2xl ${charColor === 'red' ? 'text-red-400' : 'text-cyan-400'} text-center mb-1`}>{charName}</h3>
          <p className={`text-xs font-mono ${charColor === 'red' ? 'text-red-900/60' : 'text-cyan-900/60'} text-center tracking-wider uppercase`}>{charTitle}</p>
          
          <div className={`mt-6 w-full h-px ${charColor === 'red' ? 'bg-red-900/30' : 'bg-cyan-900/30'}`}></div>
          
          <div className="mt-4 text-center">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">STATUS</p>
            <p className={`text-xs ${isLoading ? 'text-amber-500 animate-pulse' : charColor === 'red' ? 'text-red-500' : 'text-cyan-500'}`}>
              {isLoading ? 'PROCESSING...' : 'CONNECTED'}
            </p>
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col">
          {renderSceneHeader()}
          
          {/* Messages */}
          <div className="flex-1 space-y-5 mb-6 max-h-[45vh] overflow-y-auto scroll-smooth pr-2">
            {dialogueHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === '玩家' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`max-w-[90%] ${
                  msg.sender === '玩家' 
                    ? 'bg-slate-800/60 text-slate-200 rounded-lg rounded-tr-sm' 
                    : `bg-black/50 text-slate-300 rounded-lg rounded-tl-sm border-l-3 ${charColor === 'red' ? 'border-l-red-600' : 'border-l-cyan-600'}`
                } p-5 backdrop-blur-sm`}>
                  <div className="whitespace-pre-wrap font-light tracking-wide text-sm leading-7">{msg.text}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className={`bg-black/50 p-4 rounded-lg border-l-3 ${charColor === 'red' ? 'border-l-red-600' : 'border-l-cyan-600'} flex gap-1.5 items-center text-slate-500 text-xs font-mono`}>
                  <span className="animate-pulse">DECODING</span>
                  <span className="animate-bounce delay-75">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="w-full">
            {scene === SceneType.DIALOGUE_TYCHO && dialogueHistory.length > 3 ? (
              <div className="animate-fadeIn bg-red-950/10 p-6 rounded border border-red-900/30 text-center space-y-4">
                <h4 className="text-red-500 font-serif-header text-xl tracking-widest">死亡倒计时：1601.10.24</h4>
                <p className="text-slate-400 text-sm font-light">第谷已经不行了。他的呼吸像拉风箱一样。家族成员在门外窃窃私语，准备瓜分财产。<br/>数据就在书房里。这是最后的机会。</p>
                <button onClick={() => setScene(SceneType.HEIST)} className="w-full py-4 mt-2 bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 hover:to-red-900 text-white font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-red-800/50">
                  <Lock size={18} className="text-red-400"/> 执行【绝密窃取】指令
                </button>
              </div>
            ) : scene === SceneType.DIALOGUE_KEPLER && dialogueHistory.length > 3 ? (
              <div className="animate-fadeIn bg-cyan-950/10 p-6 rounded border border-cyan-900/30 text-center space-y-4">
                <h4 className="text-cyan-500 font-serif-header text-xl tracking-widest">思维突破点</h4>
                <p className="text-slate-400 text-sm font-light">开普勒看着数据，眼神空洞。他的信仰正在崩塌。"为什么不是圆？为什么上帝要欺骗我？"<br/>你需要帮他迈出那一步，即使那意味着亵渎神灵。</p>
                <button onClick={handleToCalculation} className="w-full py-4 mt-2 bg-gradient-to-r from-cyan-900 to-cyan-950 hover:from-cyan-800 hover:to-cyan-900 text-white font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-cyan-800/50">
                  <Sparkles size={18} className="text-cyan-400"/> 启动【轨道拟合】程序
                </button>
              </div>
            ) : (
              <div className="flex gap-0 border border-slate-700 rounded-sm overflow-hidden shadow-lg transition-all focus-within:border-cyan-700/50 focus-within:shadow-[0_0_15px_rgba(8,145,178,0.2)]">
                <input 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDialogueSubmit(char)}
                  placeholder={isLoading ? "信号接收中..." : "输入对话 (小心措辞，他在怀疑你)..."}
                  disabled={isLoading}
                  className="flex-1 bg-slate-900/80 p-5 text-slate-200 focus:outline-none placeholder-slate-600 font-light tracking-wide"
                />
                <button 
                  onClick={() => handleDialogueSubmit(char)} 
                  disabled={isLoading || !userInput.trim()}
                  className="px-8 bg-slate-800 hover:bg-cyan-900/80 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all flex items-center justify-center border-l border-slate-700"
                >
                  <ArrowRight size={24}/>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };


  const renderHeist = () => (
    <div className="max-w-5xl w-full p-8 md:p-12 bg-black/90 border border-slate-800 rounded-lg shadow-2xl flex flex-col md:flex-row gap-12 animate-fadeIn items-center relative overflow-hidden">
      <div className="flex-1 space-y-8 relative z-10">
        <div className="flex items-center gap-4 text-red-600 mb-2">
          <div className="w-16 h-16 bg-red-950/20 rounded-full flex items-center justify-center border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <BookOpen size={28} />
          </div>
          <div className="h-px bg-red-900/30 flex-1"></div>
        </div>
        <h2 className="text-4xl font-serif-header text-slate-100 leading-tight">命运分歧点：<br/><span className="text-red-500">遗产与诅咒</span></h2>
        <div className="space-y-6 text-lg text-slate-400 leading-relaxed font-light">
          <p>1601年10月24日。第谷·布拉赫在谵妄中死去。他最后的遗言是："只要我不曾白活……"</p>
          <p>但他的家族不这么想。他们把这堆"废纸"看作私有财产。而在门外，开普勒像一只饥饿的狼，等待着你的信号。</p>
          <p className="text-red-400 font-medium pl-4 border-l-2 border-red-800">"只要一个错误的选择，这些数据就会变成壁炉里的灰烬。现代科学将在此终结。"</p>
        </div>
      </div>
      <div className="flex-1 w-full space-y-5 relative z-10">
        <button onClick={handleHeistOption} className="w-full group text-left p-6 bg-slate-900/50 hover:bg-red-950/30 border border-slate-700 hover:border-red-600 rounded-sm transition-all duration-300 shadow-lg hover:-translate-x-1">
          <h3 className="text-red-400 font-serif-header text-xl mb-2 flex items-center justify-between">方案 A: 潜入窃取 <span className="text-[10px] font-mono bg-red-950 px-2 py-1 border border-red-900 text-red-300 tracking-wider">RISK: CRITICAL</span></h3>
          <p className="text-slate-500 text-sm group-hover:text-slate-400 leading-relaxed">趁葬礼混乱，撬开书房的镀金柜子。这是最高危的手段。如果失败，你将被当作小偷处死，数据也会被销毁。</p>
        </button>
        <button onClick={handleHeistOption} className="w-full group text-left p-6 bg-slate-900/50 hover:bg-amber-950/30 border border-slate-700 hover:border-amber-600 rounded-sm transition-all duration-300 shadow-lg hover:-translate-x-1">
          <h3 className="text-amber-500 font-serif-header text-xl mb-2 flex items-center justify-between">方案 B: 家族谈判 <span className="text-[10px] font-mono bg-amber-950 px-2 py-1 border border-amber-900 text-amber-300 tracking-wider">REQ: TRUST</span></h3>
          <p className="text-slate-500 text-sm group-hover:text-slate-400 leading-relaxed">利用你作为第谷临终前最亲近助手的身份，进行心理博弈。如果你在第谷生前获得了足够的信任，这或许是一条生路。</p>
        </button>
        <button onClick={handleHeistOption} className="w-full group text-left p-6 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-sm transition-all duration-300 shadow-lg hover:-translate-x-1">
          <h3 className="text-slate-300 font-serif-header text-xl mb-2">方案 C: 跪地乞求</h3>
          <p className="text-slate-500 text-sm group-hover:text-slate-400 leading-relaxed">彻底放弃尊严。向贪婪的继承人下跪，承认数据的"无价值"，只求他们施舍给"那个可怜的疯子开普勒"。</p>
        </button>
      </div>
    </div>
  );

  const renderCharacterIntro = (charKey: 'tycho' | 'kepler') => {
    const info = CHARACTER_INFO[charKey];
    const colorClass = info.color === 'red' ? {
      text: 'text-red-400',
      textDim: 'text-red-900/60',
      border: 'border-red-800/50',
      shadowSmall: 'shadow-[0_0_30px_rgba(153,27,27,0.3)]',
      glow: 'bg-red-500',
      line: 'bg-red-900/30'
    } : {
      text: 'text-cyan-400',
      textDim: 'text-cyan-900/60',
      border: 'border-cyan-800/50',
      shadowSmall: 'shadow-[0_0_30px_rgba(8,145,178,0.3)]',
      glow: 'bg-cyan-500',
      line: 'bg-cyan-900/30'
    };

    // Phase flags
    const showTitle = introPhase === 'showTitle';
    const showName = introPhase === 'showName';
    const moveUpAndShowBio = introPhase === 'moveUpAndShowBio';
    const moveToSide = introPhase === 'moveToSide';
    
    // Title should fade in during showTitle, stay visible until hideBioAndTitle
    const titleVisible = showTitle || showName || moveUpAndShowBio;
    const bioVisible = moveUpAndShowBio;
    
    // Name should only be visible after showTitle phase is complete
    const nameVisible = showName || moveUpAndShowBio || introPhase === 'hideBioAndTitle' || moveToSide;
    
    return (
      <div className="flex w-full max-w-5xl px-4 min-h-[60vh] items-center justify-center relative">
        {/* "先贤祠" Title - at very top, fades in then out */}
        <div 
          className={`fixed top-12 left-1/2 -translate-x-1/2 text-center transition-opacity duration-1000 ${
            titleVisible ? 'animate-fadeInUp' : 'opacity-0'
          }`}
        >
          <p className={`font-mono text-sm ${colorClass.textDim} tracking-[0.5em] uppercase mb-3`}>PANTHEON</p>
          <h1 className={`font-serif-header text-4xl md:text-5xl ${colorClass.text} tracking-[0.3em]`}>先 贤 祠</h1>
          <div className={`w-40 h-px ${colorClass.line} mx-auto mt-5`}></div>
        </div>
        
        {/* Character name card - stays centered vertically, only moves horizontally to side */}
        {/* Only render when nameVisible to prevent any flash */}
        <div 
          className={`flex flex-col items-center absolute transition-all duration-1000 ease-in-out ${
            nameVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            left: moveToSide ? '16px' : '50%',
            top: '50%',
            transform: moveToSide 
              ? 'translateX(0) translateY(-50%)' 
              : 'translateX(-50%) translateY(-50%)',
          }}
        >
          {/* Avatar */}
          <div 
            className={`w-24 h-24 rounded-full border-2 ${colorClass.border} ${colorClass.shadowSmall} bg-slate-950 flex items-center justify-center mb-4 transition-all duration-700`}
          >
            <span className={`font-serif-header text-5xl ${colorClass.textDim}`}>
              {charKey === 'tycho' ? 'T' : 'K'}
            </span>
          </div>
          
          {/* Name */}
          <h2 className={`font-serif-header text-2xl ${colorClass.text} text-center mb-1`}>
            {info.name}
          </h2>
          
          {/* English name and years */}
          <p className={`font-mono text-xs ${colorClass.textDim} tracking-wider uppercase text-center`}>
            {info.englishName} · {info.years}
          </p>
        </div>
        
        {/* Bio section - appears below name when moveUpAndShowBio */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 ${
            bioVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            top: 'calc(50% + 100px)',
          }}
        >
          <div className="space-y-3 max-w-md text-center">
            <div className={`w-24 h-px ${colorClass.line} mx-auto mb-6`}></div>
            {info.bio.map((line, idx) => (
              <p 
                key={idx}
                className={`text-slate-400 text-sm font-light transition-all duration-700 ${
                  bioVisible && idx < visibleBioLines 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
        
        {/* Glow effect */}
        <div className={`absolute ${colorClass.glow} blur-[120px] opacity-10 w-64 h-64 rounded-full transition-all duration-1000 ${
          moveToSide ? 'left-0' : 'left-1/2 -translate-x-1/2'
        }`}></div>
      </div>
    );
  };

  const renderConclusion = () => (
    <div className="max-w-4xl text-center space-y-12 animate-fadeIn z-10 px-4">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-cyan-500 blur-[100px] opacity-20"></div>
        <h2 className="text-5xl md:text-7xl font-serif-header text-cyan-50 tracking-tight relative z-10 drop-shadow-2xl">文明重启</h2>
        <p className="text-cyan-600 font-mono text-sm tracking-[0.3em] uppercase mt-2">Timeline Restored</p>
      </div>
      
      <div className="relative p-8 md:p-12 bg-slate-900/60 border border-cyan-900/30 shadow-2xl backdrop-blur-md rounded-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <Sparkles className="mx-auto text-cyan-500 mb-10 opacity-60 animate-pulse" size={36}/>
        
        <div className="space-y-10">
          {textParagraphs.map((item, idx) => (
            <div 
              key={idx} 
              className={`transition-all duration-1000 ${idx < visibleParagraphs ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              <p className="text-cyan-700/60 font-mono text-xs tracking-[0.2em] uppercase mb-3">{item.subtitle}</p>
              <p className={`text-slate-200 font-serif-header leading-relaxed ${
                item.isLarge ? 'text-2xl md:text-3xl text-cyan-100' : 'text-lg md:text-xl'
              }`}>{item.text}</p>
              {idx < textParagraphs.length - 1 && (
                <div className="w-16 h-px bg-cyan-900/30 mx-auto mt-8"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </div>
      
      <button 
        onClick={handleReturnToStarmap} 
        className={`group flex items-center justify-center gap-4 mx-auto px-10 py-5 rounded-sm border border-slate-700 text-slate-400 hover:text-cyan-100 hover:border-cyan-600 hover:bg-cyan-950/20 transition-all tracking-[0.2em] font-bold ${visibleParagraphs >= textParagraphs.length ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <Map size={18} className="group-hover:scale-110 transition-transform duration-700 text-cyan-600"/> 返回知识星图
      </button>
    </div>
  );


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#020617]">
      <ForceLandscape />
      <Starfield />
      
      {scene !== SceneType.STARMAP && scene !== SceneType.GAME_INTRO && (
        <div className="fixed top-20 left-0 w-full px-6 flex justify-between items-center pointer-events-none z-40 mix-blend-difference">
          <div className="flex items-center gap-4 text-slate-500 font-mono text-xs tracking-[0.2em]">
            <Terminal size={12} />
            <span>SYNC: {scene === SceneType.INTRO ? '0.0%' : '98.4%'}</span>
          </div>
          <div className="text-slate-500 font-mono text-xs tracking-[0.2em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full animate-pulse"></span>
            REC: 1600.PRAGUE
          </div>
        </div>
      )}

      <div className="z-10 w-full flex flex-col items-center justify-center min-h-[90vh] py-10">
        {scene === SceneType.GAME_INTRO && <GameIntro onComplete={handleIntroComplete} />}
        {scene === SceneType.STARMAP && <Starmap onSelectLevel={handleLevelSelect} />}
        {scene === SceneType.INTRO && renderIntro()}
        {scene === SceneType.OBSERVATION && <ObservationGame onComplete={handleObservationComplete} />}
        {scene === SceneType.CHARACTER_INTRO_TYCHO && renderCharacterIntro('tycho')}
        {scene === SceneType.DIALOGUE_TYCHO && renderDialogue(Character.TYCHO)}
        {scene === SceneType.HEIST && renderHeist()}
        {scene === SceneType.CHARACTER_INTRO_KEPLER && renderCharacterIntro('kepler')}
        {scene === SceneType.DIALOGUE_KEPLER && renderDialogue(Character.KEPLER)}
        {scene === SceneType.CALCULATION && <OrbitCalculation onComplete={handleCalculationComplete} />}
        {scene === SceneType.CINEMATIC_REVEAL && <CinematicReveal onComplete={handleCinematicComplete} />}
        {scene === SceneType.CONCLUSION && renderConclusion()}
      </div>
    </div>
  );
};

export default ExplorationMode;
