
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, ChevronRight, Megaphone, Bell } from 'lucide-react';
import { Notification } from '../types.ts';

interface ImportantNoticeProps {
  notifications: Notification[];
  onHistoryClick: () => void;
  onDetailClick: (notice: Notification) => void;
}

export const ImportantNotice: React.FC<ImportantNoticeProps> = ({ notifications, onHistoryClick, onDetailClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [notifications.length]);

  const currentNotice = notifications[currentIndex];

  return (
    <div className="flex gap-6 h-full w-full font-sans">
        {/* Main Notification Block */}
        <div className="flex-1 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b] rounded-[2.5rem] relative overflow-hidden shadow-2xl flex flex-col group border border-slate-700/50 transition-all hover:shadow-blue-900/20">
            
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none"></div>

            {/* Header: Badge & Progress */}
            <div className="relative z-10 flex justify-between items-start p-8 pb-0">
                <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm md:text-base font-bold px-5 py-2 rounded-full shadow-lg shadow-red-900/30 tracking-wide flex items-center gap-2 ring-1 ring-white/20">
                        <Bell size={18} className="animate-swing" /> 重要公告
                    </span>
                    <div className="text-slate-400 text-sm md:text-base font-mono flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-600/50">
                        <Calendar size={16} />
                        {currentNotice.date}
                    </div>
                </div>
                
                {/* Progress Indicators */}
                <div className="flex items-center gap-2 bg-slate-800/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-700/30">
                    {notifications.map((_, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                                idx === currentIndex ? 'w-8 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'w-2 bg-slate-600 hover:bg-slate-500'
                            }`}
                        ></div>
                    ))}
                 </div>
            </div>

            {/* Main Content Area - Centered & Large */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-12 py-6">
                <div key={currentIndex} className="animate-fade-in-up flex flex-col gap-6">
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-50 to-slate-400 drop-shadow-sm tracking-tight">
                        {currentNotice.title}
                    </h3>
                    <div className="flex items-start gap-4">
                        <div className="w-1 h-16 bg-blue-500/50 rounded-full shrink-0 mt-2"></div>
                        <p className="text-slate-300 text-lg md:text-xl leading-relaxed line-clamp-2 font-light max-w-4xl">
                            点击下方详情以阅读完整公告内容。请所有相关人员务必在截止日期前完成确认，相关政策调整将于下月正式生效...
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Action Area - Distinct Section */}
            <div className="relative z-10 p-8 mt-auto w-full flex justify-end border-t border-white/5 bg-gradient-to-t from-black/20 to-transparent">
                 <button 
                    onClick={() => onDetailClick(currentNotice)}
                    className="group/btn relative overflow-hidden rounded-2xl bg-white text-slate-900 pl-8 pr-6 py-4 font-bold text-lg md:text-xl flex items-center gap-4 shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 w-full md:w-auto justify-between md:justify-center"
                 >
                    <span className="relative z-10">阅读完整详情</span>
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-colors relative z-10">
                        <ArrowRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </div>
                    
                    {/* Hover Fill Effect */}
                    <div className="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
                 </button>
            </div>

            {/* Decorative Icon Background */}
            <Megaphone className="absolute -bottom-16 -left-8 text-slate-800/30 rotate-[-15deg] pointer-events-none blur-[3px] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[-10deg]" size={300} />
        </div>

        {/* Side Widget - History Button */}
        <div 
            onClick={onHistoryClick}
            className="w-[130px] shrink-0 bg-gradient-to-b from-indigo-600 to-blue-800 rounded-[2.5rem] p-4 flex flex-col items-center justify-between text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer border border-indigo-400/30 group overflow-hidden relative"
        >
             {/* Background Texture */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent"></div>
             
             {/* Top Icon */}
             <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-[1.5rem] shadow-inner group-hover:scale-110 transition-transform border border-white/20 group-hover:bg-white/20">
                <ChevronRight size={36} className="text-blue-50" />
             </div>
             
             {/* Vertical Text */}
             <div className="writing-vertical-lr text-xl font-bold tracking-[0.4em] text-center h-full flex items-center justify-center py-8 text-white drop-shadow-md opacity-90 group-hover:opacity-100">
                 历史公告
             </div>
             
             {/* Bottom Decoration */}
             <div className="mb-6 opacity-40 group-hover:opacity-80 transition-opacity flex flex-col gap-1.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
             </div>
        </div>
        
        <style>{`
            .writing-vertical-lr { writing-mode: vertical-lr; }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
                animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes swing {
                0%, 100% { transform: rotate(0deg); }
                20% { transform: rotate(15deg); }
                40% { transform: rotate(-10deg); }
                60% { transform: rotate(5deg); }
                80% { transform: rotate(-5deg); }
            }
            .animate-swing {
                animation: swing 2s ease-in-out infinite;
                transform-origin: top center;
            }
        `}</style>
    </div>
  );
};
