
import React from 'react';
import { Briefcase, Settings } from 'lucide-react';
import { Employee } from '../types.ts';

interface PersonalInfoProps {
  user: Employee;
  onPointsClick?: () => void;
  onMedalsClick?: () => void;
  onAdminClick?: () => void;
  onProgressClick?: () => void; // Added prop
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ user, onPointsClick, onMedalsClick, onAdminClick, onProgressClick }) => {
  
  const isPromotionReady = user.nextLevelProgress >= 100;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center h-full relative overflow-hidden group/card">
       {/* Background decorative element */}
       <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50 to-white z-0"></div>
        
       {/* Admin Entry Button */}
       {onAdminClick && (
           <button 
             onClick={onAdminClick}
             className="absolute top-3 right-3 z-20 p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-full transition-all opacity-0 group-hover/card:opacity-100"
             title="管理后台"
           >
               <Settings size={18} />
           </button>
       )}

      {/* Avatar Section */}
      <div className="relative z-10 mb-4 group cursor-pointer">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className={`w-24 h-24 rounded-full object-cover border-4 shadow-md group-hover:scale-105 transition-transform duration-300 ${isPromotionReady ? 'border-yellow-300 ring-4 ring-yellow-100' : 'border-white'}`}
          />
          <div className={`absolute -bottom-2 -right-2 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm ${isPromotionReady ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}>
            {user.level}
          </div>
        </div>
      </div>
      
      {/* Name and Info */}
      <div className="z-10 mb-6 w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
        <div className="flex items-center justify-center gap-3 text-gray-500 text-sm mb-3">
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                <Briefcase size={12} /> {user.position}
            </span>
            <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold">
                {user.department}
            </span>
        </div>
        
        <div 
            onClick={onMedalsClick}
            className={`flex justify-center gap-2 mb-2 ${onMedalsClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
        >
            {user.medals.map((medal, index) => (
              <span key={index} className="text-xl bg-yellow-50 rounded-full w-8 h-8 flex items-center justify-center border border-yellow-100 shadow-sm" title="勋章">{medal}</span>
            ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 w-full mb-5">
          <div className="bg-blue-50 rounded-xl p-3 flex flex-col items-center justify-center border border-blue-100">
              <span className="text-xs text-blue-600 font-semibold uppercase">在职时间</span>
              <span className="text-sm font-bold text-gray-800 mt-1">{user.tenure}</span>
          </div>
          <div 
            onClick={onPointsClick}
            className={`bg-indigo-50 rounded-xl p-3 flex flex-col items-center justify-center border border-indigo-100 ${onPointsClick ? 'cursor-pointer hover:bg-indigo-100 hover:shadow-md transition-all active:scale-95' : ''}`}
          >
               <span className="text-xs text-indigo-600 font-semibold uppercase">个人总积分</span>
               <span className="text-lg font-bold text-indigo-900 mt-1">{user.totalPoints.toLocaleString()}</span>
          </div>
      </div>

      {/* Progress Bar (Now Clickable) */}
      <div 
          onClick={onProgressClick}
          className={`w-full rounded-xl p-3 border transition-all duration-500 group cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${isPromotionReady ? 'bg-yellow-50 border-yellow-200 shadow-inner' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
      >
        <div className="flex justify-between items-end mb-2 px-1">
            <span className={`text-xs font-medium flex items-center gap-1 ${isPromotionReady ? 'text-yellow-700 font-bold' : 'text-gray-500'}`}>
                {isPromotionReady ? '已满足晋升标准' : '距离下一职级'}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </span>
            <span className={`text-sm font-bold ${isPromotionReady ? 'text-orange-600' : 'text-blue-600'}`}>{Math.min(user.nextLevelProgress, 100)}%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
                className={`h-full rounded-full relative transition-all duration-1000 ${isPromotionReady ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-shimmer' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
                style={{ width: `${Math.min(user.nextLevelProgress, 100)}%` }}
            ></div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        .animate-shimmer {
            background-size: 200% 100%;
            animation: shimmer 2s linear infinite;
        }
      `}</style>

    </div>
  );
};
