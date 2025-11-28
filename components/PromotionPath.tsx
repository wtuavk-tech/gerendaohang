
import React from 'react';
import { ArrowLeft, Wrench, Trophy, Target, TrendingUp, CheckCircle, Lock } from 'lucide-react';
import { Employee, RankStandard } from '../types.ts';

interface PromotionPathProps {
  user: Employee;
  rankStandards: RankStandard[];
  onBack: () => void;
}

export const PromotionPath: React.FC<PromotionPathProps> = ({ user, rankStandards, onBack }) => {
  // Determine next level
  const currentLevelNum = user.rankLevel;
  const nextLevelNum = currentLevelNum + 1;
  const nextLevelId = `${user.rankTrack}${nextLevelNum}`;
  
  // Find standards for next level
  const standard = rankStandards.find(r => r.track === user.rankTrack && r.level === nextLevelNum);
  
  // Simulated scores for the user against these standards (since we don't have real individual scores in Employee type yet)
  // We'll deterministically generate them based on user ID so they don't flicker
  const getSimulatedScore = (dimName: string) => {
      let hash = 0;
      for (let i = 0; i < dimName.length; i++) hash = dimName.charCodeAt(i) + ((hash << 5) - hash);
      const base = Math.abs(hash) % 30 + 60; // Base score between 60-90
      
      // If user progress is high, boost scores
      if (user.nextLevelProgress > 80) return Math.min(100, base + 15);
      return base;
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] font-sans flex flex-col items-center selection:bg-blue-100 pb-20">
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
        <h1 className="text-2xl font-bold text-slate-700 tracking-wide hidden md:block">晋升之路</h1>
      </div>

      <div className="w-full max-w-[1000px] px-6">
          
          {/* Header Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden mb-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <div className="flex justify-between items-center relative z-10">
                  <div>
                      <p className="text-blue-100 font-medium mb-1">当前职级</p>
                      <h2 className="text-4xl font-bold flex items-baseline gap-2">
                          {user.rankTrack}{user.rankLevel} 
                          <span className="text-lg opacity-80 font-normal">({user.position})</span>
                      </h2>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="w-16 h-1 bg-white/30 rounded-full mb-2"></div>
                      <ArrowLeft className="rotate-180 text-white/50" />
                      <div className="w-16 h-1 bg-white/30 rounded-full mt-2"></div>
                  </div>
                  <div className="text-right">
                      <p className="text-blue-100 font-medium mb-1">目标职级</p>
                      <h2 className="text-4xl font-bold text-yellow-300 flex items-baseline gap-2 justify-end">
                          {nextLevelId}
                          <Trophy className="text-yellow-300" size={28} />
                      </h2>
                  </div>
              </div>

              <div className="mt-8">
                  <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-blue-100">总体达成进度</span>
                      <span className="font-bold text-white">{user.nextLevelProgress}%</span>
                  </div>
                  <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                        style={{ width: `${user.nextLevelProgress}%` }}
                      ></div>
                  </div>
              </div>
          </div>

          {/* Standards Grid */}
          {!standard ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Lock size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">暂无下一职级标准</h3>
                  <p className="text-slate-500">您已达到当前序列最高职级，或系统尚未配置下一级标准。</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {standard.dimensions.map((dim, idx) => {
                      const currentScore = getSimulatedScore(dim.name);
                      const targetScore = 85; // Assume 85 is the standard "pass" score for visualization
                      const isMet = currentScore >= targetScore;

                      return (
                          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                              <div className="flex justify-between items-start mb-4">
                                  <div>
                                      <h3 className="text-lg font-bold text-slate-800">{dim.name}</h3>
                                      <p className="text-xs text-slate-400 mt-1 max-w-[200px]">{dim.description}</p>
                                  </div>
                                  <div className={`p-2 rounded-xl ${isMet ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                      {isMet ? <CheckCircle size={24} /> : <Target size={24} />}
                                  </div>
                              </div>

                              <div className="space-y-4">
                                  <div>
                                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                                          <span>当前评估</span>
                                          <span className={isMet ? 'text-green-600' : 'text-orange-500'}>{currentScore} / 100</span>
                                      </div>
                                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${isMet ? 'bg-green-500' : 'bg-orange-500'}`}
                                            style={{ width: `${currentScore}%` }}
                                          ></div>
                                      </div>
                                  </div>
                                  
                                  <div>
                                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                                          <span>标准要求</span>
                                          <span>{targetScore} / 100</span>
                                      </div>
                                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                                          {/* Marker for target */}
                                          <div className="absolute top-0 bottom-0 bg-slate-300 w-full" style={{ width: `${targetScore}%` }}></div>
                                          <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-slate-400 h-full" style={{ left: `${targetScore}%` }}></div>
                                      </div>
                                  </div>
                              </div>

                              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                                  <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">权重 {dim.weight}%</span>
                                  {!isMet && <span className="text-xs font-bold text-orange-500 flex items-center gap-1"><TrendingUp size={12} /> 需提升</span>}
                              </div>
                          </div>
                      );
                  })}
              </div>
          )}

          {/* Action Footer */}
          <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm mb-4">数据来源于最近一次季度绩效及360评估</p>
              <button onClick={onBack} className="bg-slate-200 text-slate-700 hover:bg-slate-300 px-8 py-3 rounded-xl font-bold transition-colors">
                  返回首页
              </button>
          </div>
      </div>
    </div>
  );
};
