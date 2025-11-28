
import React from 'react';
import { ArrowLeft, Wrench, ThumbsUp, BookOpen, Crown, Shield, Users, Star, Hammer } from 'lucide-react';
import { Employee } from '../types.ts';

interface MedalsCenterProps {
  user: Employee;
  onBack: () => void;
}

export const MedalsCenter: React.FC<MedalsCenterProps> = ({ user, onBack }) => {
  
  const medalsList = [
      { id: 1, name: '优秀员工', icon: ThumbsUp },
      { id: 2, name: '学习之星', icon: BookOpen },
      { id: 3, name: '优秀主管', icon: ThumbsUp },
      { id: 4, name: '全勤小蜜蜂', icon: Shield },
      { id: 5, name: '优秀团队', icon: Users },
      { id: 6, name: '客户之星', icon: Star },
      { id: 7, name: '1周年', icon: Hammer },
      { id: 8, name: '2周年', icon: Hammer },
      { id: 9, name: '3周年', icon: Hammer },
      { id: 10, name: '4周年', icon: Hammer },
      { id: 11, name: '5周年', icon: Hammer },
      { id: 12, name: '6周年', icon: Hammer },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] font-sans flex flex-col items-center selection:bg-blue-100">
      
      {/* Unified Header Section */}
      <div className="w-full flex items-center justify-center py-8 gap-6 relative z-10">
        <button 
            onClick={onBack} 
            className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-all bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md border border-slate-200/60 active:scale-95"
        >
            <ArrowLeft size={20} /> <span className="font-bold">返回</span>
        </button>
        
        <div className="flex items-center gap-3 select-none opacity-90 scale-90 md:scale-100">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-200">
                <Wrench size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-slate-800 font-bold text-2xl tracking-widest">急修到家</span>
                <span className="text-blue-600 text-[10px] tracking-[0.3em] font-bold mt-0.5">JIXIU DAOJIA</span>
            </div>
        </div>
        <div className="w-px h-8 bg-slate-300 mx-2 hidden md:block"></div>
        <h1 className="text-2xl font-bold text-slate-700 tracking-wide hidden md:block">个人勋章</h1>
      </div>

      {/* Top Info Card */}
      <div className="w-full max-w-[1000px] px-6 mb-12">
         <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-3xl p-8 shadow-sm border border-slate-200 gap-8">
            <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-sm shrink-0">
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                    <div className="flex gap-3 text-sm text-slate-500">
                        <span className="bg-slate-100 px-2 py-1 rounded">{user.position}</span>
                        <span className="bg-slate-100 px-2 py-1 rounded">入职 {user.tenure}</span>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-10 py-4 rounded-2xl shadow-lg shadow-orange-200 flex flex-col items-center justify-center min-w-[200px] transform rotate-1">
                <span className="text-sm font-bold opacity-90 uppercase tracking-widest">已解锁</span>
                <span className="text-4xl font-extrabold mt-1">{medalsList.length} <span className="text-lg font-medium">枚</span></span>
            </div>
         </div>
      </div>

      {/* Medals Grid */}
      <div className="w-full max-w-[1100px] px-6 pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-8 justify-items-center">
              {medalsList.map((medal) => (
                  <div key={medal.id} className="flex flex-col items-center group">
                      {/* Hexagon Medal Container */}
                      <div className="relative w-32 h-36 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                          {/* SVG Hexagon Background */}
                          <svg viewBox="0 0 100 115" className="absolute w-full h-full drop-shadow-xl">
                              <path 
                                d="M50 0 L95 25 L95 75 L50 100 L5 75 L5 25 Z" 
                                fill="url(#grad1)" 
                                stroke="#B8860B" 
                                strokeWidth="3"
                              />
                              <path 
                                d="M50 5 L89 27 L89 73 L50 95 L11 73 L11 27 Z" 
                                fill="#1e293b" 
                              />
                              <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" style={{stopColor:'rgb(255,215,0)', stopOpacity:1}} />
                                  <stop offset="100%" style={{stopColor:'rgb(218,165,32)', stopOpacity:1}} />
                                </linearGradient>
                              </defs>
                          </svg>
                          
                          {/* Icon */}
                          <div className="relative z-10 text-white mb-2">
                              <medal.icon size={48} strokeWidth={1.5} className="drop-shadow-md text-yellow-400" />
                          </div>
                      </div>

                      {/* Label Banner */}
                      <div className="relative -mt-4 bg-slate-800 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md border border-slate-600 z-20">
                          {medal.name}
                      </div>
                  </div>
              ))}
          </div>
      </div>

    </div>
  );
};
