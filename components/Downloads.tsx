
import React, { useState } from 'react';
import { ArrowLeft, Wrench, Search, CheckCircle2, Download } from 'lucide-react';
import { Employee, DownloadItem } from '../types.ts';

interface DownloadsProps {
  user: Employee;
  onBack: () => void;
  items: DownloadItem[];
}

export const Downloads: React.FC<DownloadsProps> = ({ user, onBack, items }) => {
  const filters = ['全员资料', '派单员', '客服', '技术', '运营'];
  const [activeFilter, setActiveFilter] = useState('全员资料');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => {
      const matchesFilter = activeFilter === '全员资料' || item.category === activeFilter;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
  });

  const handleDownload = (item: DownloadItem) => { alert(`开始下载: ${item.fileName || item.title}`); };

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
        <h1 className="text-2xl font-bold text-slate-700 tracking-wide hidden md:block">资料下载</h1>
      </div>

      {/* Search Bar */}
      <div className="flex w-full max-w-[800px] mx-auto mt-4 mb-10 shadow-xl shadow-blue-100/50 rounded-2xl">
          <div className="flex-1 relative">
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="请输入搜索关键词" 
                className="w-full h-16 border-0 rounded-l-2xl px-8 text-xl text-slate-700 placeholder-slate-400 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all bg-white"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white w-32 rounded-r-2xl flex items-center justify-center transition-colors shadow-md">
              <Search size={28} />
          </button>
      </div>

      {/* Filters */}
      <div className="w-full max-w-[1000px] px-6 mb-10">
          <div className="flex items-center justify-center gap-4 overflow-x-auto py-2 no-scrollbar">
              {filters.map((filter, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveFilter(filter)}
                    className={`
                        px-6 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap
                        ${activeFilter === filter 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                            : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}
                    `}
                  >
                      {filter}
                  </button>
              ))}
          </div>
      </div>

      {/* Content List */}
      <div className="w-full max-w-[1000px] px-6 pb-20 space-y-6">
          {filteredItems.length === 0 ? (
              <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-slate-100">暂无该分类下的资料</div>
          ) : (
              filteredItems.map((item) => (
                  <div key={item.id} className={`bg-white rounded-2xl border ${item.isPinned ? 'border-blue-200 shadow-md shadow-blue-100' : 'border-slate-100 shadow-sm'} hover:shadow-lg transition-all p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group`}>
                      {/* Pinned Ribbon */}
                      {item.isPinned && (
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
                            置顶资料
                        </div>
                      )}

                      <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                              <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                  <Download size={24} />
                              </div>
                              <h2 className="text-xl font-bold text-slate-800">{item.title}</h2>
                          </div>
                          <p className="text-slate-500 text-base leading-relaxed mb-4 line-clamp-2">
                              {item.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-400 font-mono">
                              <span>{item.date}</span>
                              {item.fileName && <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-blue-500" /> {item.fileName}</span>}
                          </div>
                      </div>
                      
                      <div className="flex flex-col justify-center shrink-0">
                          <button 
                            onClick={() => handleDownload(item)}
                            className="bg-slate-50 hover:bg-blue-50 text-blue-600 font-bold px-6 py-3 rounded-xl border border-slate-200 hover:border-blue-200 transition-all active:scale-95 whitespace-nowrap"
                          >
                              下载资料
                          </button>
                      </div>
                  </div>
              ))
          )}
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};
