
import React, { useState } from 'react';
import { ArrowLeft, Wrench, FileText, History, TrendingUp, TrendingDown, Calendar, ChevronRight } from 'lucide-react';
import { Employee, PointRule } from '../types.ts';

interface PointsCenterProps {
  user: Employee;
  onBack: () => void;
  rules: PointRule[];
}

export const PointsCenter: React.FC<PointsCenterProps> = ({ user, onBack, rules }) => {
  const [activeRuleTab, setActiveRuleTab] = useState('全员');
  
  const ruleTabs = ['全员', '派单', '客服', '技术', '运营'];

  const pointsHistory = [
    { id: 1, title: '每日签到', change: 5, type: 'add', date: '2025-11-19 08:30' },
    { id: 2, title: '获得客户五星好评', change: 50, type: 'add', date: '2025-11-18 14:20' },
    { id: 3, title: '兑换-空调清洗服务', change: -200, type: 'minus', date: '2025-11-15 10:00' },
    { id: 4, title: '全勤奖励', change: 100, type: 'add', date: '2025-11-01 09:00' },
  ];

  const filteredRules = rules.filter(r => {
      if (activeRuleTab === '全员') return r.category === '全员';
      return r.category === activeRuleTab || r.category === '全员';
  });

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
        <h1 className="text-2xl font-bold text-slate-700 tracking-wide hidden md:block">积分中心</h1>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row w-full max-w-[1200px] gap-8 px-6 py-4 flex-1 pb-20">
          
          {/* LEFT COLUMN: Points Rules (60%) */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
              
              {/* Filter Tabs */}
              <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 flex gap-2 overflow-x-auto no-scrollbar">
                  {ruleTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveRuleTab(tab)}
                        className={`px-6 py-3 rounded-xl text-base font-bold transition-all whitespace-nowrap flex-1
                            ${activeRuleTab === tab 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                        `}
                      >
                          {tab}规则
                      </button>
                  ))}
              </div>

              {/* Rules List - Dynamic */}
              <div className="flex flex-col gap-4">
                  {filteredRules.map((rule) => (
                      <div key={rule.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group">
                          <div className="bg-blue-50 p-3 rounded-full text-blue-600 group-hover:bg-blue-100 transition-colors">
                              <FileText size={24} />
                          </div>
                          <div>
                              <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-slate-800">{rule.title}</h3>
                                  <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                      {rule.category}
                                  </span>
                              </div>
                              <p className="text-slate-600 text-base leading-relaxed">
                                  {rule.content}
                              </p>
                          </div>
                      </div>
                  ))}
                  {filteredRules.length === 0 && (
                      <div className="text-center text-slate-400 py-12">暂无相关规则</div>
                  )}
              </div>

          </div>

          {/* RIGHT COLUMN: Points History (40%) */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">
              
              {/* User Stats Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60 pointer-events-none"></div>
                  
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-3 relative z-10">
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full border border-white">
                        {user.level}
                      </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 z-10">{user.name}</h2>
                  <div className="mt-2 mb-4 flex flex-col items-center z-10">
                      <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">当前总积分</span>
                      <span className="text-5xl font-mono font-bold text-blue-600 tracking-tight drop-shadow-sm">
                          {user.totalPoints.toLocaleString()}
                      </span>
                  </div>
                  <div className="w-full flex justify-between border-t border-slate-100 pt-4 z-10">
                      <div className="flex flex-col items-center w-1/2 border-r border-slate-100">
                          <span className="text-xs text-slate-400">本月新增</span>
                          <span className="text-lg font-bold text-slate-700">+650</span>
                      </div>
                      <div className="flex flex-col items-center w-1/2">
                          <span className="text-xs text-slate-400">本月消耗</span>
                          <span className="text-lg font-bold text-slate-700">-200</span>
                      </div>
                  </div>
              </div>

              {/* History List */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col flex-1 min-h-[400px]">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
                      <div className="flex items-center gap-2">
                          <History size={20} className="text-blue-600" />
                          <h3 className="font-bold text-slate-800 text-lg">积分获取明细</h3>
                      </div>
                      <span className="text-xs text-slate-400">最近30天</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-2 max-h-[500px]">
                      {pointsHistory.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group border-b border-slate-50 last:border-0">
                              <div className="flex items-start gap-3">
                                  <div className={`mt-1 p-2 rounded-lg ${item.type === 'add' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
                                      {item.type === 'add' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                                      <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                          <Calendar size={10} /> {item.date}
                                      </span>
                                  </div>
                              </div>
                              <span className={`text-lg font-bold font-mono ${item.type === 'add' ? 'text-green-600' : 'text-orange-500'}`}>
                                  {item.type === 'add' ? '+' : ''}{item.change}
                              </span>
                          </div>
                      ))}
                  </div>
                  
                  <div className="p-3 border-t border-slate-100 text-center">
                      <button className="text-sm text-slate-400 hover:text-blue-600 flex items-center justify-center gap-1 w-full py-2 transition-colors">
                          查看更多记录 <ChevronRight size={14} />
                      </button>
                  </div>
              </div>

          </div>

      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};
