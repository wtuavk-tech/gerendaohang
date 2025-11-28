

import React from 'react';
import { Search, ArrowLeft, Wrench, ArrowRight, Bell } from 'lucide-react';
import { Notification } from '../types.ts';

interface AnnouncementHistoryProps {
  onBack: () => void;
  notifications: Notification[];
  onDetailClick: (notice: Notification) => void;
}

export const AnnouncementHistory: React.FC<AnnouncementHistoryProps> = ({ onBack, notifications, onDetailClick }) => {
  
  const today = new Date();
  today.setHours(0,0,0,0);

  // Helper to calculate days remaining
  const getDaysRemaining = (expiryDate?: string) => {
      if (!expiryDate) return 999; // No expiry
      const expiry = new Date(expiryDate);
      expiry.setHours(0,0,0,0);
      const diffTime = expiry.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Sort logic: 
  // 1. Filter out pins that are expired (treat as normal)
  // 2. Sort by Effective Pin (Pinned AND Not Expired) -> Date
  const sortedNotifications = [...notifications].map(n => {
      const daysRem = getDaysRemaining(n.expiryDate);
      const isExpired = daysRem < 0;
      // Automatically unpin if expired
      const effectivePin = n.isPinned && !isExpired;
      return { ...n, effectivePin, daysRem, isExpired };
  }).sort((a, b) => {
      // Sort by Effective Pin first
      if (a.effectivePin && !b.effectivePin) return -1;
      if (!a.effectivePin && b.effectivePin) return 1;
      // Then by date (simple string comparison for YYYY-MM-DD works, or use time)
      return b.date.localeCompare(a.date);
  });

  const renderTitleRow = (notice: typeof sortedNotifications[0]) => (
      <div className="flex flex-col gap-1 mb-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 
                className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight leading-snug group-hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => onDetailClick(notice)}
              >
                  {notice.title}
              </h2>
              
              {/* Badge 1: Publisher */}
              {notice.publisher && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
                      {notice.publisher}
                  </span>
              )}

              {/* Badge 2: Validity Period */}
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-500 border border-gray-100 whitespace-nowrap font-mono">
                  {notice.date} ~ {notice.expiryDate || '长期'}
              </span>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] overflow-y-auto font-sans flex flex-col items-center selection:bg-blue-100">
      {/* Unified Header Section */}
      <div className="w-full flex items-center justify-center py-8 gap-6 relative z-10 mb-4">
        <button 
            onClick={onBack} 
            className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-all bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md border border-slate-200/60 active:scale-95"
        >
            <ArrowLeft size={20} /> <span className="font-bold">返回</span>
        </button>
        
        {/* Unified Branding */}
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
        <h1 className="text-2xl font-bold text-slate-700 tracking-wide hidden md:block">通知中心</h1>
      </div>

      <div className="w-full max-w-[1000px] px-6 pb-20">
          
          {/* Search Bar */}
          <div className="flex w-full max-w-[800px] mx-auto mb-12 shadow-xl shadow-blue-100/50 rounded-2xl">
              <div className="flex-1 relative">
                <input 
                    type="text" 
                    placeholder="请输入搜索关键词" 
                    className="w-full h-16 border-0 rounded-l-2xl px-8 text-xl text-slate-700 placeholder-slate-400 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white w-32 rounded-r-2xl flex items-center justify-center transition-colors shadow-md">
                  <Search size={28} />
              </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center justify-center gap-4 mb-12 overflow-x-auto py-2 no-scrollbar">
              <span className="text-slate-500 text-lg mr-2 font-medium whitespace-nowrap">筛选对象:</span>
              {['全员资料', '派单员', '客服', '技术', '运营'].map((filter, idx) => (
                  <button 
                    key={idx} 
                    className={`
                        border px-8 py-2.5 rounded-xl text-lg transition-all duration-200 min-w-[100px] whitespace-nowrap font-medium
                        ${idx === 0 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-md'}
                    `}
                  >
                      {filter}
                  </button>
              ))}
          </div>

          {/* Content List */}
          <div className="space-y-8">
              {sortedNotifications.map((notice, idx) => (
                  <div key={notice.id} className={`group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 border overflow-hidden flex flex-col relative ${notice.isExpired ? 'border-slate-100 opacity-70 grayscale-[0.8] hover:grayscale-0' : 'border-slate-100 hover:shadow-blue-100'}`}>
                     
                     {/* EXPIRED WATERMARK */}
                     {notice.isExpired && (
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-slate-300 text-slate-300 text-6xl font-black p-4 rounded-xl rotate-[-15deg] pointer-events-none z-30 select-none">
                             已失效
                         </div>
                     )}

                     {/* DAYS REMAINING - Floating Window */}
                     {!notice.isExpired && notice.daysRem <= 365 && (
                        <div className={`absolute top-0 right-0 z-30 px-4 py-2 rounded-bl-2xl font-bold text-white shadow-lg ${notice.daysRem <= 3 ? 'bg-red-600 animate-pulse' : 'bg-orange-500'}`}>
                             {notice.daysRem === 0 ? '今日到期' : `剩余 ${notice.daysRem} 天`}
                        </div>
                     )}

                     {notice.effectivePin ? (
                        // Pinned Layout
                         <div className="flex flex-1 relative">
                             {/* Ribbon */}
                             <div className="w-16 bg-gradient-to-b from-blue-600 to-indigo-700 flex flex-col items-center justify-center text-white shrink-0 relative overflow-hidden">
                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                 <span className="text-lg font-bold writing-vertical-lr tracking-[0.4em] py-8 opacity-95">置顶公告</span>
                             </div>
                             
                             <div className="flex-1 p-8 md:p-10 pt-12">
                                 {renderTitleRow(notice)}
                                 <p className="text-lg text-slate-500 leading-relaxed text-justify line-clamp-3 font-normal mt-4">
                                    {notice.content || "点击查看详情阅读完整内容..."}
                                 </p>
                             </div>
                         </div>
                     ) : (
                        // Normal Layout
                        <div className="p-8 md:p-10 pb-6 pt-12 relative flex flex-col">
                             <div className="flex items-start gap-4">
                                <div className="bg-slate-100 p-3 rounded-2xl text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors shrink-0 hidden md:block mt-1">
                                    <Bell size={24} />
                                </div>
                                <div className="flex-1">
                                    {renderTitleRow(notice)}
                                    <p className="text-lg text-slate-500 leading-relaxed text-justify line-clamp-2 font-normal">
                                        {notice.content || "点击查看详情阅读完整内容..."}
                                    </p>
                                </div>
                             </div>
                         </div>
                     )}
                     
                     {/* Full Width Bottom Button */}
                     <button 
                        onClick={() => onDetailClick(notice)}
                        className="w-full bg-slate-50 hover:bg-blue-50 text-blue-600 text-lg font-bold py-4 flex items-center justify-center gap-3 transition-colors border-t border-slate-100 group-hover:gap-6 duration-300 z-20"
                     >
                         查看详情 <ArrowRight size={20} />
                     </button>
                  </div>
              ))}
          </div>
      </div>
      
      <style>{`
        .writing-vertical-lr {
            writing-mode: vertical-lr;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; 
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};