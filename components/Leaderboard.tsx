import React from 'react';
import { LeaderboardEntry } from '../types.ts';
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';

interface LeaderboardProps {
  data: LeaderboardEntry[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} className="text-emerald-500" />;
      case 'down': return <TrendingDown size={14} className="text-rose-500" />;
      default: return <Minus size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div className="p-5 pb-3 border-b border-gray-50 flex justify-between items-center bg-white z-10">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <div className="bg-yellow-100 p-1.5 rounded-lg text-yellow-600">
                <Trophy size={18} />
            </div>
            总积分排行榜
        </h3>
        <span className="text-xs text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors">更多 &gt;</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
        <table className="w-full border-collapse">
            <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="py-2 px-2 text-center font-medium w-10">排名</th>
                    <th className="py-2 px-2 text-left font-medium">成员</th>
                    <th className="py-2 px-2 text-right font-medium">积分</th>
                </tr>
            </thead>
            <tbody>
                {data.map((entry, index) => (
                    <tr key={index} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2 text-center">
                            <div className={`w-6 h-6 mx-auto flex items-center justify-center rounded-full text-xs font-bold
                                ${entry.rank === 1 ? 'bg-yellow-400 text-yellow-900 shadow-sm' : 
                                  entry.rank === 2 ? 'bg-gray-300 text-gray-800' : 
                                  entry.rank === 3 ? 'bg-orange-300 text-orange-900' : 'text-gray-500 bg-gray-100'}`}>
                                {entry.rank}
                            </div>
                        </td>
                        <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                    <img src={entry.avatar} alt={entry.name} className="w-9 h-9 rounded-full object-cover border border-gray-100" />
                                    <div className="absolute -right-1 -bottom-1 bg-white rounded-full p-[1px] shadow-sm ring-1 ring-gray-50">
                                        {getTrendIcon(entry.trend)}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">{entry.name}</span>
                                </div>
                            </div>
                        </td>
                        <td className="py-3 px-2 text-right">
                            <span className="text-sm font-bold font-mono text-indigo-900">{entry.score.toLocaleString()}</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};