
import React from 'react';
import { ArrowLeft, Wrench, Calendar, Clock } from 'lucide-react';
import { Notification } from '../types.ts';

interface NoticeDetailProps {
  notice: Notification;
  onBack: () => void;
}

export const NoticeDetail: React.FC<NoticeDetailProps> = ({ notice, onBack }) => {
  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] font-sans flex flex-col items-center selection:bg-blue-100 pb-10">
      {/* Unified Header Section */}
      <div className="w-full flex items-center justify-center py-8 gap-6 relative z-10">
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
        <h1 className="text-2xl font-bold text-slate-700 tracking-wide hidden md:block">公告详情</h1>
      </div>

      {/* Content Container - White Card style to match homepage widgets */}
      <div className="w-full max-w-[1000px] px-6 flex-1">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden p-8 md:p-12">
            
            {/* Title Block */}
            <div className="text-center mb-10 border-b border-gray-100 pb-10">
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">{notice.title}</h1>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-slate-500 font-medium">
                    <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full"><Calendar size={18} className="text-blue-500" /> {notice.date}</span>
                    <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full"><Clock size={18} className="text-blue-500" /> 14:30</span>
                    <span className="text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-full shadow-md shadow-blue-200 text-sm font-bold tracking-wide">重要通知</span>
                </div>
            </div>

            {/* Hero Image */}
            <div className="w-full aspect-video bg-slate-100 rounded-3xl overflow-hidden mb-12 shadow-inner border border-slate-100 relative group">
                <img 
                  src="https://picsum.photos/1000/600?random=100" 
                  alt="Notice Cover" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg md:prose-xl max-w-none text-slate-600 leading-loose space-y-8">
                <p className="text-2xl font-bold text-slate-800">
                    各位同事：
                </p>
                <p>
                    根据公司战略发展规划，为进一步提升团队协作效率与服务质量，现将有关事项通知如下。请各部门主管认真传达会议精神，确保每一位员工都能知晓并执行到位。
                </p>
                <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 my-8">
                    <p className="font-bold text-blue-900 mb-4 text-lg">具体调整内容包括但不限于：</p>
                    <ul className="list-none space-y-4 m-0 p-0">
                        <li className="flex gap-3 items-start">
                            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-1">1</span>
                            <span>优化内部工单流转审批时效，从原有的24小时缩短至12小时。</span>
                        </li>
                        <li className="flex gap-3 items-start">
                            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-1">2</span>
                            <span>调整季度绩效考核指标权重，增加客户满意度评分占比。</span>
                        </li>
                        <li className="flex gap-3 items-start">
                            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-1">3</span>
                            <span>新增“技术创新奖”，鼓励一线员工提出建设性改良方案。</span>
                        </li>
                    </ul>
                </div>
                <p>
                    相关政策将于下月1日正式生效。如有疑问，请及时联系人力资源部或各部门负责人进行咨询。让我们携手共进，共创佳绩！
                </p>
                <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col items-end">
                    <div className="text-right">
                        <p className="font-bold text-slate-900 text-2xl mb-2">急修到家 · 行政部</p>
                        <p className="text-slate-400 font-mono">{notice.date}</p>
                    </div>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};
