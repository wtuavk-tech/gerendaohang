
import React from 'react';
import { Gift, Sparkles } from 'lucide-react';

interface BannerProps {
  onSendWishesClick?: () => void;
}

export const Banner: React.FC<BannerProps> = ({ onSendWishesClick }) => {
  return (
    <div className="w-full bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 border border-orange-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-lg shadow-sm text-orange-500">
             <Gift size={20} />
        </div>
        <p className="text-gray-800 font-medium text-sm md:text-base">
          <span className="font-bold text-orange-600">温馨提示：</span> 
          今日有 <span className="font-bold text-pink-600 mx-1">3</span> 位同事过生日，
          <span className="font-bold text-indigo-600 mx-1">8</span> 位同事入职满周年
        </p>
      </div>
      <button 
        onClick={onSendWishesClick}
        className="hidden sm:flex items-center gap-1 text-xs font-semibold text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
      >
        <Sparkles size={14} className="text-yellow-500" />
        发送祝福
      </button>
    </div>
  );
};
