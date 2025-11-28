
import React, { useState } from 'react';
import { ArrowLeft, Wrench, Cake, PartyPopper, Send, X, Gift as GiftIcon, Coins, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Gift, GiftHistoryItem } from '../types.ts';
import { AVAILABLE_GIFTS } from '../constants.tsx';

interface WishesCenterProps {
  onBack: () => void;
  userPoints: number;
  onSendGift: (recipient: string, gift: Gift | null, message: string) => void;
  onSimulateReceive: () => void;
  giftHistory: GiftHistoryItem[];
}

export const WishesCenter: React.FC<WishesCenterProps> = ({ onBack, userPoints, onSendGift, onSimulateReceive, giftHistory }) => {
  
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{name: string, type: 'birthday' | 'anniversary'} | null>(null);
  const [message, setMessage] = useState('');
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  const birthdayUsers = [
      { name: '张晓明', avatar: 'https://picsum.photos/100/100?random=50' },
      { name: '李子柒', avatar: 'https://picsum.photos/100/100?random=51' },
      { name: '王大力', avatar: 'https://picsum.photos/100/100?random=52' },
  ];

  const anniversaryUsers = [
      { name: '赵铁柱', avatar: 'https://picsum.photos/100/100?random=60', year: 3 },
      { name: '孙尚香', avatar: 'https://picsum.photos/100/100?random=61', year: 5 },
      { name: '周瑜', avatar: 'https://picsum.photos/100/100?random=62', year: 1 },
      { name: '小乔', avatar: 'https://picsum.photos/100/100?random=63', year: 2 },
  ];

  const handleOpenModal = (user: any, type: 'birthday' | 'anniversary') => {
      setSelectedUser({ ...user, type });
      setMessage(type === 'birthday' ? '祝你生日快乐，愿你天天开心！' : '祝贺入职周年快乐，感谢你的付出！');
      setSelectedGift(null); // Reset gift
      setModalOpen(true);
  };

  const handleSend = () => {
      if (selectedUser) {
          if (selectedGift && userPoints < selectedGift.points) {
              alert("积分不足，无法发送该礼物！");
              return;
          }
          onSendGift(selectedUser.name, selectedGift, message);
          setModalOpen(false);
      }
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] font-sans flex flex-col items-center selection:bg-blue-100 relative">
      
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
        <h1 className="text-2xl font-bold text-slate-700 tracking-wide hidden md:block">祝福中心</h1>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1200px] px-6 pb-20 flex flex-col gap-6">
          
          {/* Tabs & Simulation Control */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex">
                  <button 
                    onClick={() => setActiveTab('send')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'send' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                      <Send size={16} /> 送祝福
                  </button>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                      <History size={16} /> 礼物明细
                  </button>
              </div>

              {/* Simulation Button */}
              <button 
                 onClick={onSimulateReceive}
                 className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
               >
                   <GiftIcon size={16} /> 模拟收到他人礼物 (前往首页)
               </button>
          </div>

          {/* --- TAB: SEND WISHES --- */}
          {activeTab === 'send' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                  {/* Left Column: Birthdays */}
                  <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-8 border-b border-slate-50 pb-4">
                          <div className="bg-rose-100 text-rose-500 p-4 rounded-2xl shadow-inner">
                            <Cake size={32} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-slate-800">今日寿星</h2>
                            <p className="text-slate-400 text-sm">送上一份温暖的祝福吧</p>
                          </div>
                      </div>
                      
                      <div className="space-y-4">
                          {birthdayUsers.map((user, idx) => (
                              <div key={idx} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between hover:bg-blue-50 transition-colors group">
                                  <div className="flex items-center gap-4">
                                      <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm" />
                                      <span className="text-xl font-bold text-slate-700 group-hover:text-blue-700">{user.name}</span>
                                  </div>
                                  <button 
                                    onClick={() => handleOpenModal(user, 'birthday')}
                                    className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2"
                                  >
                                      <Send size={18} /> 送祝福
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Right Column: Anniversaries */}
                  <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-8 border-b border-slate-50 pb-4">
                          <div className="bg-indigo-100 text-indigo-500 p-4 rounded-2xl shadow-inner">
                            <PartyPopper size={32} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-slate-800">入职周年</h2>
                            <p className="text-slate-400 text-sm">感谢他们的辛勤付出</p>
                          </div>
                      </div>
                      
                      <div className="space-y-4">
                          {anniversaryUsers.map((user, idx) => (
                              <div key={idx} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between hover:bg-indigo-50 transition-colors group">
                                  <div className="flex items-center gap-4">
                                      <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm" />
                                      <div className="flex flex-col">
                                        <span className="text-xl font-bold text-slate-700 group-hover:text-indigo-700">{user.name}</span>
                                        <span className="text-sm text-slate-400 font-medium">入职 {user.year} 周年</span>
                                      </div>
                                  </div>
                                  <button 
                                     onClick={() => handleOpenModal(user, 'anniversary')}
                                     className="bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2"
                                  >
                                      <Send size={18} /> 送祝福
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* --- TAB: GIFT HISTORY --- */}
          {activeTab === 'history' && (
             <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 animate-fade-in min-h-[500px]">
                  <div className="flex items-center gap-4 mb-8 border-b border-slate-50 pb-4">
                      <div className="bg-purple-100 text-purple-500 p-4 rounded-2xl shadow-inner">
                        <History size={32} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">礼物往来明细</h2>
                        <p className="text-slate-400 text-sm">查看所有送出和收到的祝福与礼物</p>
                      </div>
                  </div>

                  {giftHistory.length === 0 ? (
                      <div className="text-center text-slate-400 py-20">暂无记录，快去送出第一份祝福吧！</div>
                  ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-500 text-sm border-b border-slate-100">
                                    <th className="p-4 font-medium">类型</th>
                                    <th className="p-4 font-medium">对象</th>
                                    <th className="p-4 font-medium">礼物</th>
                                    <th className="p-4 font-medium text-right">积分变动</th>
                                    <th className="p-4 font-medium text-right">时间</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {giftHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                                        <td className="p-4">
                                            {item.type === 'sent' ? (
                                                <span className="inline-flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-1 rounded-md text-xs font-bold">
                                                    <ArrowUpRight size={14} /> 送出
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold">
                                                    <ArrowDownLeft size={14} /> 收到
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 font-bold">{item.targetUser}</td>
                                        <td className="p-4 flex items-center gap-2">
                                            <span className="text-2xl">{item.giftIcon}</span>
                                            <span className="font-medium">{item.giftName}</span>
                                        </td>
                                        <td className={`p-4 text-right font-mono font-bold ${item.points >= 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                            {item.points > 0 ? '+' : ''}{item.points}
                                        </td>
                                        <td className="p-4 text-right text-slate-400 text-sm font-mono">{item.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                      </div>
                  )}
             </div>
          )}
      </div>

      {/* Message & Gift Modal */}
      {modalOpen && selectedUser && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">给 {selectedUser.name} 发送祝福</h3>
                        <p className="text-slate-500 text-sm">剩余积分: <span className="font-mono font-bold text-blue-600">{userPoints}</span></p>
                      </div>
                      <button onClick={() => setModalOpen(false)} className="bg-white p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto">
                      {/* Message Input */}
                      <label className="block font-bold text-slate-700 mb-3">祝福语</label>
                      <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-24 border border-slate-200 rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50 mb-8"
                      ></textarea>

                      {/* Gift Selection */}
                      <label className="block font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <GiftIcon size={18} /> 选择礼物 (可选)
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                          {AVAILABLE_GIFTS.map(gift => (
                              <div 
                                key={gift.id}
                                onClick={() => setSelectedGift(selectedGift?.id === gift.id ? null : gift)}
                                className={`
                                    cursor-pointer rounded-xl p-3 flex flex-col items-center justify-center border-2 transition-all
                                    ${selectedGift?.id === gift.id 
                                        ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105' 
                                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}
                                `}
                              >
                                  <div className="text-4xl mb-2">{gift.icon}</div>
                                  <div className="text-xs font-bold text-slate-700">{gift.name}</div>
                                  <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-0.5">
                                      <Coins size={10} /> {gift.points}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-slate-100 flex justify-end gap-4 bg-slate-50">
                       <div className="flex items-center mr-auto text-slate-600 text-sm font-medium">
                            总计消耗: <span className="text-blue-600 font-bold text-lg ml-2">{selectedGift ? selectedGift.points : 0}</span> 积分
                       </div>
                      <button 
                        onClick={() => setModalOpen(false)}
                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                      >
                          取消
                      </button>
                      <button 
                        onClick={handleSend}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transform active:scale-95 transition-all flex items-center gap-2"
                      >
                          发送 <Send size={18} />
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
