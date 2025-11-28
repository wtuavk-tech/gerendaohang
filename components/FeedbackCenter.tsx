import React, { useState } from 'react';
import { ArrowLeft, Wrench, MessageSquarePlus, AlertTriangle, ShieldAlert, Send, EyeOff, Eye } from 'lucide-react';
import { Feedback } from '../types.ts';

interface FeedbackCenterProps {
  onBack: () => void;
  onSubmit: (feedback: Omit<Feedback, 'id' | 'date' | 'status'>) => void;
  userName: string;
}

// Reusable Form Component for the 3 blocks
const FeedbackForm = ({ 
    type, 
    icon: Icon, 
    title, 
    subtitle, 
    colorTheme, 
    userName, 
    onSubmit 
}: {
    type: 'suggestion' | 'complaint' | 'report';
    icon: any;
    title: string;
    subtitle: string;
    colorTheme: { bg: string, text: string, border: string, ring: string, btn: string, btnHover: string, shadow: string };
    userName: string;
    onSubmit: (data: Omit<Feedback, 'id' | 'date' | 'status'>) => void;
}) => {
    const [isAnonymous, setIsAnonymous] = useState(type !== 'suggestion'); // Default anonymous for complaint/report
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !content) return alert(`请填写完整${title}信息`);
        
        onSubmit({
            type,
            title: subject,
            content,
            name: isAnonymous ? '匿名用户' : userName,
            isAnonymous
        });
        
        setSubject('');
        setContent('');
        alert(`${title}已提交，感谢您的反馈！`);
    };

    return (
        <div className={`flex-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col min-w-[300px]`}>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className={`${colorTheme.bg} ${colorTheme.text} p-4 rounded-2xl`}>
                    <Icon size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    <p className="text-slate-500 text-xs">{subtitle}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                {/* Name Selection */}
                <div>
                    <label className="block font-bold text-slate-700 mb-2 text-sm">对应人姓名</label>
                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <input 
                            type="text" 
                            value={isAnonymous ? '匿名用户' : userName} 
                            readOnly
                            className="flex-1 bg-transparent px-3 py-2 text-sm font-medium text-slate-700 outline-none"
                        />
                        <button 
                            type="button"
                            onClick={() => setIsAnonymous(!isAnonymous)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isAnonymous ? 'bg-slate-700 text-white' : 'bg-white text-slate-600 shadow-sm border border-slate-200'}`}
                        >
                            {isAnonymous ? <><EyeOff size={12}/> 匿名</> : <><Eye size={12}/> 实名</>}
                        </button>
                    </div>
                </div>

                {/* Subject */}
                <div>
                    <label className="block font-bold text-slate-700 mb-2 text-sm">主体/标题</label>
                    <input 
                        type="text" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={`请输入${title.substring(2)}主题`}
                        className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 ${colorTheme.ring} outline-none`}
                    />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <label className="block font-bold text-slate-700 mb-2 text-sm">具体内容</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`请详细描述${title.substring(2)}详情...`}
                        className={`w-full h-32 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 ${colorTheme.ring} outline-none resize-none`}
                    ></textarea>
                </div>

                {/* Submit */}
                <button 
                    type="submit" 
                    className={`${colorTheme.btn} ${colorTheme.btnHover} text-white font-bold py-3.5 rounded-xl ${colorTheme.shadow} transition-all active:scale-95 flex items-center justify-center gap-2 mt-auto`}
                >
                    提交{title.substring(2)} <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export const FeedbackCenter: React.FC<FeedbackCenterProps> = ({ onBack, onSubmit, userName }) => {
  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] font-sans flex flex-col items-center selection:bg-blue-100">
      
      {/* Unified Header */}
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
        <h1 className="text-2xl font-bold text-slate-700 tracking-wide hidden md:block">建议&投诉&举报</h1>
      </div>

      <div className="w-full max-w-[1400px] px-6 pb-20 flex gap-6 flex-col lg:flex-row h-full items-stretch">
          
          {/* 1. Suggestion Block */}
          <FeedbackForm 
             type="suggestion"
             icon={MessageSquarePlus}
             title="我要建议"
             subtitle="您的金点子，是我们进步的动力"
             userName={userName}
             onSubmit={onSubmit}
             colorTheme={{
                 bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200',
                 ring: 'focus:ring-purple-500', btn: 'bg-purple-600', btnHover: 'hover:bg-purple-700', shadow: 'shadow-lg shadow-purple-200'
             }}
          />

          {/* 2. Complaint Block */}
          <FeedbackForm 
             type="complaint"
             icon={AlertTriangle}
             title="我要投诉"
             subtitle="遇到不公或流程问题，请告诉我们"
             userName={userName}
             onSubmit={onSubmit}
             colorTheme={{
                 bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200',
                 ring: 'focus:ring-orange-500', btn: 'bg-orange-500', btnHover: 'hover:bg-orange-600', shadow: 'shadow-lg shadow-orange-200'
             }}
          />

          {/* 3. Report/Whistleblowing Block */}
          <FeedbackForm 
             type="report"
             icon={ShieldAlert}
             title="我要举报"
             subtitle="违规舞弊零容忍，最高保密级别"
             userName={userName}
             onSubmit={onSubmit}
             colorTheme={{
                 bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200',
                 ring: 'focus:ring-red-500', btn: 'bg-red-600', btnHover: 'hover:bg-red-700', shadow: 'shadow-lg shadow-red-200'
             }}
          />

      </div>
    </div>
  );
};