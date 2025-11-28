
import React from 'react';
import { Crown, ArrowRight, X } from 'lucide-react';

interface PromotionAlertProps {
  visible: boolean;
  onClose: () => void;
  rankTrack: string;
  nextLevel: number;
}

export const PromotionAlert: React.FC<PromotionAlertProps> = ({ visible, onClose, rankTrack, nextLevel }) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[150] animate-slide-up-fade">
      <div className="relative bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border-2 border-yellow-400 rounded-2xl p-6 shadow-2xl max-w-sm overflow-hidden">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-yellow-600 hover:text-yellow-800 p-1 rounded-full hover:bg-yellow-200 transition-colors z-20"
        >
            <X size={20} />
        </button>

        {/* Background Effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-300 rounded-full blur-3xl opacity-30"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full shadow-lg mb-4 animate-bounce">
                <Crown size={32} className="text-white" fill="currentColor" />
            </div>
            
            <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-700 mb-2">
                恭喜！晋升标准已达成
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                你已满足 <span className="font-bold text-gray-800">{rankTrack}{nextLevel}</span> 职级晋升标准。<br/>
                请尽快准备资料，参与晋升答辩。
            </p>
            
            <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                查看晋升通道 <ArrowRight size={16} />
            </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUpFade {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up-fade {
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
