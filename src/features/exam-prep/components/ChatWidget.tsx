import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { ChatMessage } from '../types';

interface ChatWidgetProps {
  onSendMessage: (text: string) => Promise<string>;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '你好！我是你的专属 AI 助教。对这道题还有哪里不明白吗？随时问我！' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const responseText = await onSendMessage(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: '抱歉，连接有点问题，请稍后再试。' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button - Cute Sprite Style (peeking diagonally upward) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[25vh] right-0 group z-40 transition-all hover:right-1"
        >
          {/* Sprite body peeking from right edge at an angle */}
          <div className="relative transform rotate-12 origin-bottom-right">
            {/* Extended body to fill the gap - positioned to touch the edge */}
            <div className="absolute bottom-0 right-0 w-20 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-l-full shadow-2xl overflow-visible">
              {/* Cute face */}
              <div className="absolute left-3 top-8 z-10">
                {/* Eyes */}
                <div className="flex gap-1.5 mb-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                {/* Smile */}
                <div className="w-4 h-1.5 border-b-2 border-white rounded-full"></div>
              </div>
              
              {/* Sparkle effect */}
              <div className="absolute top-2 right-3 w-1 h-1 bg-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-150"></div>
              
              {/* Two cute horns/antennae on top - outside the body, touching the edge */}
              <div className="absolute -top-3 left-4 w-2 h-5 bg-indigo-500 rounded-full transform -rotate-12"></div>
              <div className="absolute -top-3 left-9 w-2 h-5 bg-purple-500 rounded-full transform rotate-12"></div>
              
              {/* Glowing orbs on horn tips */}
              <div className="absolute -top-5 left-4 w-2.5 h-2.5 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50 animate-pulse"></div>
              <div className="absolute -top-5 left-9 w-2.5 h-2.5 bg-pink-300 rounded-full shadow-lg shadow-pink-300/50 animate-pulse delay-75"></div>
            </div>
            
            {/* Text label - always visible */}
            <div className="absolute left-4 top-12 -translate-x-full mr-2 bg-white px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-fadeIn">
              <span className="text-xs font-bold text-indigo-600">不懂随时问我！</span>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-white"></div>
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 md:right-6 w-[90vw] md:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col animate-fadeIn origin-bottom-right">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">AI 助教 (在线)</h3>
                <p className="text-[10px] text-slate-500">Based on Gemini AI</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`
                    max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}
                  `}
                >
                  {msg.role === 'user' ? (
                    msg.text
                  ) : (
                    <MarkdownRenderer content={msg.text} />
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 rounded-b-2xl">
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="对哪个步骤有疑问？"
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg transition-colors"
              >
                {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
