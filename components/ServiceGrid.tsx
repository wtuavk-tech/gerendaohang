

import React from 'react';
import * as Icons from 'lucide-react';
import { ServiceItem } from '../types.ts';

interface ServiceGridProps {
  items: ServiceItem[];
  onItemClick: (id: string) => void;
}

// Helper to map the base color class to a background style
const getCardStyle = (colorClass: string) => {
    if (colorClass.includes('red')) return 'bg-red-100 border-red-200 text-red-900';
    if (colorClass.includes('pink')) return 'bg-pink-100 border-pink-200 text-pink-900';
    if (colorClass.includes('blue')) return 'bg-blue-100 border-blue-200 text-blue-900';
    if (colorClass.includes('green')) return 'bg-emerald-100 border-emerald-200 text-emerald-900';
    if (colorClass.includes('yellow')) return 'bg-amber-100 border-amber-200 text-amber-900';
    if (colorClass.includes('indigo')) return 'bg-indigo-100 border-indigo-200 text-indigo-900';
    if (colorClass.includes('purple')) return 'bg-purple-100 border-purple-200 text-purple-900';
    if (colorClass.includes('emerald')) return 'bg-emerald-100 border-emerald-200 text-emerald-900';
    return 'bg-gray-100 border-gray-200 text-gray-900';
};

export const ServiceGrid: React.FC<ServiceGridProps> = ({ items, onItemClick }) => {
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-4 h-full">
      {items.map((item) => {
        const IconComponent = (Icons as any)[item.iconName] || Icons.HelpCircle;
        const cardStyle = getCardStyle(item.colorClass);
        // Extract just the text color for the icon container wrapper
        const iconContainerClass = item.colorClass.replace('bg-', 'bg-white/60 ');
        
        // Special handling for Pending Issues (id '1')
        const isPending = item.title === '待处理问题';

        return (
          <div 
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`
                ${cardStyle} 
                rounded-3xl p-3 flex flex-col items-center justify-center text-center 
                shadow-sm border cursor-pointer relative
                ${isPending ? 'animate-pulse-glow' : 'hover:shadow-md hover:-translate-y-1 transition-all group'}
            `}
          >
            {/* Enlarged Badge for Pending Issues */}
            {item.count && (
                <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xl font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-xl border-4 border-white z-20 animate-bounce-custom">
                    {item.count}
                </div>
            )}
            
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-sm ${iconContainerClass} ${isPending ? 'animate-wiggle' : ''}`}>
              <IconComponent size={28} strokeWidth={2} />
            </div>
            
            <h4 className="font-bold text-lg leading-tight">{item.title}</h4>
            <span className={`text-xs font-medium mt-1 ${isPending ? 'text-red-600 font-bold' : 'opacity-60 group-hover:opacity-100 transition-opacity'}`}>
                {isPending ? '立即处理' : '立即查看'}
            </span>

            <style>{`
                @keyframes bounce-custom {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-custom {
                    animation: bounce-custom 2s infinite;
                }
                @keyframes wiggle {
                    0%, 100% { transform: rotate(-3deg); }
                    50% { transform: rotate(3deg); }
                }
                .animate-wiggle {
                    animation: wiggle 1s ease-in-out infinite;
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); border-color: #fecaca; }
                    50% { box-shadow: 0 0 20px 0 rgba(220, 38, 38, 0.2); border-color: #ef4444; }
                }
                .animate-pulse-glow {
                    animation: pulse-glow 2s infinite;
                }
            `}</style>
          </div>
        );
      })}
    </div>
  );
};