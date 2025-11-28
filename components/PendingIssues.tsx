
import React from 'react';
import { ArrowLeft, Wrench, AlertCircle, CreditCard, FileText, CheckCircle2 } from 'lucide-react';

interface PendingIssuesProps {
  onBack: () => void;
}

export const PendingIssues: React.FC<PendingIssuesProps> = ({ onBack }) => {
  
  const orderIssues = [
      { id: 1, text: '工单 #90212 用户反馈服务态度问题，请及时回访。', time: '2小时前' },
      { id: 2, text: '工单 #90234 维修材料申报超出标准，需重新核实。', time: '4小时前' },
  ];

  const financeIssues = [
      { id: 3, text: '10月份差旅报销单据缺失，请补交发票。', time: '1天前' },
  ];

  const otherIssues = [
      { id: 4, text: '年度健康体检报名即将截止，请尽快完成信息填报。', time: '3天前' },
      { id: 5, text: '部门季度总结PPT需在周五前提交归档。', time: '3天前' },
  ];

  const IssueCard = ({ title, icon: Icon, issues, colorClass, btnColorClass }: any) => (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6 hover:shadow-md transition-shadow">
        <div className={`px-6 py-4 border-b border-slate-100 flex items-center gap-3 ${colorClass} bg-opacity-5`}>
            <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                <Icon size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <div className="p-6 space-y-4">
            {issues.map((issue: any) => (
                <div key={issue.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all">
                    <div className="flex-1 mr-4">
                        <p className="text-slate-700 font-medium leading-snug">{issue.text}</p>
                        <p className="text-slate-400 text-xs mt-2 font-mono">{issue.time}</p>
                    </div>
                    <button className={`${btnColorClass} text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap flex items-center gap-1`}>
                        <CheckCircle2 size={16} />
                        处理
                    </button>
                </div>
            ))}
            {issues.length === 0 && (
                <div className="text-center text-slate-400 py-4">暂无待处理事项</div>
            )}
        </div>
    </div>
  );

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
        <h1 className="text-2xl font-bold text-slate-700 tracking-wide hidden md:block">待处理问题</h1>
      </div>

      <div className="w-full max-w-[1000px] px-6 pb-20">
          <IssueCard 
            title="订单问题" 
            icon={AlertCircle} 
            issues={orderIssues} 
            colorClass="bg-red-500 text-red-600" 
            btnColorClass="bg-red-600"
          />
          
          <IssueCard 
            title="财务问题" 
            icon={CreditCard} 
            issues={financeIssues} 
            colorClass="bg-yellow-500 text-yellow-600" 
            btnColorClass="bg-yellow-600"
          />

          <IssueCard 
            title="其他问题" 
            icon={FileText} 
            issues={otherIssues} 
            colorClass="bg-blue-500 text-blue-600" 
            btnColorClass="bg-blue-600"
          />
      </div>
    </div>
  );
};
