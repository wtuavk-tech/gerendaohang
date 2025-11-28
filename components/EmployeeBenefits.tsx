
import React, { useState } from 'react';
import { ArrowLeft, Wrench, Coins, History, X, CheckCircle2, ShoppingBag, QrCode, Share2, Download, Check, Minus, Plus } from 'lucide-react';
import { Employee, RedemptionRecord, BenefitItem } from '../types.ts';

interface EmployeeBenefitsProps {
  user: Employee;
  onBack: () => void;
  onRedeem: (item: { title: string; points: number; imageUrl: string }) => void;
  history: RedemptionRecord[];
  items: BenefitItem[]; 
}

type ShareStep = 'reward' | 'template' | 'poster';
type RewardType = 'points' | 'cash';
type PosterStyle = 'business' | 'festive' | 'cool';

export const EmployeeBenefits: React.FC<EmployeeBenefitsProps> = ({ user, onBack, onRedeem, history, items }) => {
  const [showHistory, setShowHistory] = useState(false);
  
  // Redemption States
  const [selectedPointItem, setSelectedPointItem] = useState<BenefitItem | null>(null);
  
  // Cash/Hybrid Redemption State
  const [selectedCashItem, setSelectedCashItem] = useState<BenefitItem | null>(null);
  const [deductionStep, setDeductionStep] = useState<'deduct' | 'form' | 'payment' | 'success'>('deduct');
  const [deductionPoints, setDeductionPoints] = useState(0); // Points user wants to use
  const [bookingForm, setBookingForm] = useState({ nickname: '', phone: '', address: '' });

  // Share Flow States
  const [shareItem, setShareItem] = useState<BenefitItem | null>(null);
  const [shareStep, setShareStep] = useState<ShareStep>('reward');
  const [selectedReward, setSelectedReward] = useState<RewardType>('points');
  const [selectedPosterStyle, setSelectedPosterStyle] = useState<PosterStyle>('business');

  // --- Handlers ---

  const handleRedeemClick = (item: BenefitItem) => {
      // Logic: If item has a PRICE, it enters the Cash/Hybrid flow. 
      // If item ONLY has points and price is 0/undefined, it enters simple Point flow.
      if ((item.price || 0) > 0) {
          setSelectedCashItem(item);
          setDeductionStep('deduct');
          setDeductionPoints(0); // Default 0 deduction
          setBookingForm({ nickname: '', phone: '', address: '' });
      } else {
          setSelectedPointItem(item);
      }
  };

  const confirmPointRedemption = () => {
      if (selectedPointItem) {
          onRedeem({ title: selectedPointItem.title, points: selectedPointItem.points, imageUrl: selectedPointItem.imageUrl });
          setSelectedPointItem(null);
      }
  };

  // Hybrid Flow Handlers
  const POINT_EXCHANGE_RATE = 100; // 100 Points = 1 Yuan

  const handleDeductionConfirm = () => {
      setDeductionStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!bookingForm.nickname || !bookingForm.phone || !bookingForm.address) return alert("请填写完整信息");
      setDeductionStep('payment');
  };

  const handlePaymentComplete = () => { 
      // Deduct points if used
      if (deductionPoints > 0) {
         // In a real app, we would call an API here. 
         // For demo, we assume points are deducted via onRedeem or similar, 
         // but strictly onRedeem props expects title/points.
         onRedeem({ title: `${selectedCashItem?.title} (抵扣)`, points: deductionPoints, imageUrl: selectedCashItem?.imageUrl || '' });
      }
      setTimeout(() => { setDeductionStep('success'); }, 1000); 
  };
  
  const closeBooking = () => { setSelectedCashItem(null); setDeductionStep('deduct'); };

  // --- Share Logic ---
  const startShareFlow = (item: BenefitItem) => {
      setShareItem(item);
      setShareStep('reward');
      setSelectedReward('points'); 
      setSelectedPosterStyle('business');
  };

  const handleDownloadPoster = () => {
      alert("海报已保存到本地电脑！");
      setShareItem(null);
  };

  const renderPosterPreview = () => {
      if (!shareItem) return null;
      const styles = {
          business: { bg: 'bg-slate-50', text: 'text-slate-800', accent: 'text-blue-600', border: 'border-blue-100' },
          festive: { bg: 'bg-red-50', text: 'text-red-900', accent: 'text-red-600', border: 'border-red-200' },
          cool: { bg: 'bg-slate-900', text: 'text-white', accent: 'text-cyan-400', border: 'border-slate-700' }
      };
      const s = styles[selectedPosterStyle];

      return (
          <div className={`w-[320px] h-[520px] ${s.bg} shadow-2xl rounded-xl overflow-hidden flex flex-col relative border-4 ${selectedPosterStyle === 'cool' ? 'border-slate-800' : 'border-white'}`}>
              <div className="h-[40%] relative">
                  <img src={shareItem.imageUrl} className="w-full h-full object-cover" />
                  <div className={`absolute top-4 left-0 px-3 py-1 text-xs font-bold rounded-r-full shadow-md ${selectedPosterStyle === 'festive' ? 'bg-yellow-400 text-red-900' : 'bg-blue-600 text-white'}`}>
                      {selectedReward === 'points' ? '赚积分' : '赚现金'}
                  </div>
              </div>
              <div className="h-[35%] p-5 flex flex-col">
                  <div className={`text-sm mb-1 opacity-80 ${s.text}`}>你的好友 {user.name} 推荐</div>
                  <h3 className={`text-xl font-bold leading-tight mb-2 line-clamp-2 ${s.text}`}>{shareItem.title}</h3>
                  <div className="mt-auto flex items-baseline gap-2">
                      <span className={`text-2xl font-bold font-mono ${s.accent}`}>
                          {shareItem.points > 0 ? `${shareItem.points}积分` : `¥${shareItem.price}`}
                      </span>
                      {shareItem.points === 0 && <span className="text-xs line-through opacity-50">原价 ¥{(shareItem.price||0) * 1.2}</span>}
                  </div>
                  <div className={`mt-2 text-xs px-2 py-1 rounded inline-block self-start ${selectedPosterStyle==='cool'?'bg-white/10':'bg-black/5'} ${s.text}`}>
                      限时特惠 · 员工专享
                  </div>
              </div>
              <div className="h-[25%] bg-white p-4 flex items-center gap-4 border-t border-dashed border-gray-200">
                  <div className="h-full aspect-square bg-slate-100 rounded-lg p-1"><QrCode className="w-full h-full text-black" /></div>
                  <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm font-bold text-slate-800 mb-1">长按识别二维码</p>
                      <p className="text-xs text-slate-500">立即参与抢购</p>
                      <div className="mt-2 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
              </div>
          </div>
      );
  };


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
        <h1 className="text-2xl font-bold text-slate-700 tracking-wide hidden md:block">员工福利</h1>
      </div>

      {/* User Info Bar */}
      <div className="w-full max-w-[1000px] px-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border-2 border-slate-100 p-1">
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                    <div className="text-xl font-bold text-slate-800">{user.name}</div>
                    <div className="text-slate-500 mt-1 flex items-center gap-2">
                        我的积分: <span className="font-bold text-2xl font-mono text-blue-600">{user.totalPoints}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-5 py-2.5 text-slate-700 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all">
                    <Coins size={18} /> 赚积分
                </button>
                <button onClick={() => setShowHistory(true)} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-5 py-2.5 text-slate-700 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all">
                    <History size={18} /> 兑换记录
                </button>
            </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="w-full max-w-[1200px] px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative overflow-hidden group">
                      {item.points === 0 && (
                          <div className="absolute top-3 left-0 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-r-md shadow-md z-10">
                              员工特惠
                          </div>
                      )}
                      <div className="w-full aspect-square bg-slate-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                          <img src={item.imageUrl} alt="Product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-2 h-14">
                          {item.title}
                      </h3>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                          <div className="text-blue-600">
                              {item.points > 0 ? (
                                  <>
                                    <span className="text-2xl font-bold font-mono">{item.points}</span> 
                                    <span className="text-xs ml-1 font-bold text-slate-400">积分</span>
                                  </>
                              ) : (
                                  <>
                                    <span className="text-xs font-medium text-slate-400 line-through mr-2">原价</span>
                                    <span className="text-2xl font-bold font-mono text-rose-600">¥{item.price}</span> 
                                  </>
                              )}
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                                onClick={() => handleRedeemClick(item)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-all active:scale-95 shadow-md ${item.points === 0 ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' : 'bg-slate-800 hover:bg-slate-900'}`}
                            >
                                兑换
                            </button>
                            <button 
                                onClick={() => startShareFlow(item)} 
                                className="bg-green-100 text-green-600 hover:bg-green-500 hover:text-white p-2 rounded-lg transition-colors border border-green-200"
                                title="生成分享海报"
                            >
                                <Share2 size={20} />
                            </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
      
      {/* --- Modals --- */}

      {/* 1. Share Flow Modal */}
      {shareItem && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[600px]">
                  <div className="w-full md:w-1/2 p-8 bg-slate-50 flex flex-col border-r border-slate-200">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="text-2xl font-bold text-slate-800">分享赚奖励</h3>
                          <button onClick={() => setShareItem(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} className="text-slate-500"/></button>
                      </div>
                      <div className="flex items-center gap-2 mb-8">
                          <div className={`h-2 flex-1 rounded-full transition-colors ${shareStep === 'reward' ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                          <div className={`h-2 flex-1 rounded-full transition-colors ${shareStep === 'template' ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                          <div className={`h-2 flex-1 rounded-full transition-colors ${shareStep === 'poster' ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                          {shareStep === 'reward' && (
                              <div className="space-y-4 animate-slide-up">
                                  <p className="text-slate-600 font-medium mb-4">请选择您的分享奖励类型：</p>
                                  <div onClick={() => setSelectedReward('points')} className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${selectedReward === 'points' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                                      <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Coins size={24} /></div>
                                      <div><div className="font-bold text-slate-800">赚取积分</div><div className="text-xs text-slate-500">每邀请一人 +50 积分</div></div>
                                      {selectedReward === 'points' && <CheckCircle2 className="ml-auto text-blue-600" />}
                                  </div>
                                  <div onClick={() => setSelectedReward('cash')} className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${selectedReward === 'cash' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-green-300'}`}>
                                      <div className="bg-green-100 p-3 rounded-full text-green-600"><ShoppingBag size={24} /></div>
                                      <div><div className="font-bold text-slate-800">现金提成</div><div className="text-xs text-slate-500">每单成交返现 5%</div></div>
                                      {selectedReward === 'cash' && <CheckCircle2 className="ml-auto text-green-600" />}
                                  </div>
                              </div>
                          )}
                          {shareStep === 'template' && (
                              <div className="space-y-4 animate-slide-up">
                                  <p className="text-slate-600 font-medium mb-4">选择海报风格：</p>
                                  <div className="grid grid-cols-3 gap-3">
                                      {[{ id: 'business', name: '商务蓝', color: 'bg-blue-500' }, { id: 'festive', name: '节日红', color: 'bg-red-500' }, { id: 'cool', name: '酷炫黑', color: 'bg-slate-800' }].map((style) => (
                                          <div key={style.id} onClick={() => setSelectedPosterStyle(style.id as any)} className={`aspect-[2/3] rounded-lg border-4 cursor-pointer relative overflow-hidden flex flex-col items-center justify-center transition-all ${selectedPosterStyle === style.id ? 'border-blue-600 ring-2 ring-blue-200 scale-105' : 'border-transparent hover:scale-105'}`}>
                                              <div className={`absolute inset-0 ${style.color} opacity-20`}></div>
                                              <div className={`w-8 h-8 rounded-full ${style.color} mb-2 shadow-sm`}></div>
                                              <span className="text-xs font-bold text-slate-700 z-10">{style.name}</span>
                                              {selectedPosterStyle === style.id && <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-0.5"><Check size={12} /></div>}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}
                          {shareStep === 'poster' && (
                              <div className="flex flex-col items-center justify-center h-full text-center animate-slide-up">
                                  <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4"><CheckCircle2 size={32} /></div>
                                  <h3 className="text-xl font-bold text-slate-800 mb-2">海报生成完毕！</h3>
                                  <p className="text-slate-500 text-sm mb-8">您可以直接下载或截图分享给好友。</p>
                                  <button onClick={handleDownloadPoster} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"><Download size={20} /> 保存海报到本地</button>
                              </div>
                          )}
                      </div>
                      <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between">
                          {shareStep !== 'reward' ? <button onClick={() => setShareStep(shareStep === 'poster' ? 'template' : 'reward')} className="px-6 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg">上一步</button> : <div></div>}
                          {shareStep !== 'poster' && <button onClick={() => setShareStep(shareStep === 'reward' ? 'template' : 'poster')} className="px-8 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md">下一步</button>}
                      </div>
                  </div>
                  <div className="w-full md:w-1/2 bg-slate-800 flex items-center justify-center p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="transform transition-all duration-500 hover:scale-[1.02]">{renderPosterPreview()}</div>
                  </div>
              </div>
          </div>
      )}

      {/* 2. Redemption Modal (Pure Points) */}
      {selectedPointItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">确认兑换?</h3>
                  <p className="text-slate-500 mb-6">将消耗 <span className="text-blue-600 font-bold">{selectedPointItem.points}</span> 积分</p>
                  <div className="flex gap-3">
                      <button onClick={() => setSelectedPointItem(null)} className="flex-1 bg-slate-100 py-2.5 rounded-xl font-bold text-slate-600">取消</button>
                      <button onClick={confirmPointRedemption} className="flex-1 bg-blue-600 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-blue-200">确认</button>
                  </div>
              </div>
          </div>
      )}
      
      {/* 3. Cash/Hybrid Booking Modal */}
      {selectedCashItem && (
          <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-800">
                          {deductionStep === 'deduct' && '确认订单'}
                          {deductionStep === 'form' && '填写预约信息'}
                          {deductionStep === 'payment' && '微信支付'}
                          {deductionStep === 'success' && '预约成功'}
                      </h3>
                      <button onClick={closeBooking} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                  </div>
                  
                  {/* Step 1: Deduction Logic */}
                  {deductionStep === 'deduct' && (
                      <div className="p-8">
                           <div className="flex items-center gap-4 mb-6 p-4 bg-rose-50 rounded-xl border border-rose-100">
                              <img src={selectedCashItem.imageUrl} className="w-16 h-16 rounded-lg object-cover" alt="product" />
                              <div className="flex-1">
                                  <h4 className="font-bold text-slate-800">{selectedCashItem.title}</h4>
                                  <div className="text-rose-600 font-bold mt-1">原价: ¥{selectedCashItem.price}</div>
                              </div>
                           </div>
                           
                           <div className="mb-6">
                               <label className="block text-slate-600 text-sm font-bold mb-2 flex justify-between">
                                   <span>使用积分抵扣 (可用: {user.totalPoints})</span>
                                   <span className="text-blue-600">{deductionPoints} 积分 = ¥{deductionPoints / POINT_EXCHANGE_RATE}</span>
                               </label>
                               <div className="flex items-center gap-4">
                                   <input 
                                     type="range" 
                                     min="0" 
                                     max={Math.min(user.totalPoints, (selectedCashItem.price || 0) * POINT_EXCHANGE_RATE)} 
                                     step="100"
                                     value={deductionPoints}
                                     onChange={(e) => setDeductionPoints(parseInt(e.target.value))}
                                     className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                   />
                                   <div className="w-16 text-center font-mono font-bold text-slate-700 bg-slate-100 rounded-lg py-1">{deductionPoints}</div>
                               </div>
                               <p className="text-xs text-slate-400 mt-2">抵扣比例: 100 积分 = 1 元</p>
                           </div>

                           <div className="flex justify-between items-center border-t border-slate-100 pt-4 mb-6">
                               <span className="font-bold text-slate-600">还需支付</span>
                               <span className="text-2xl font-bold text-rose-600">¥ {((selectedCashItem.price || 0) - (deductionPoints / POINT_EXCHANGE_RATE)).toFixed(2)}</span>
                           </div>

                           <button onClick={handleDeductionConfirm} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 text-lg">
                               确认并填写信息
                           </button>
                      </div>
                  )}

                  {/* Step 2: Contact Form */}
                  {deductionStep === 'form' && (
                      <div className="p-8">
                          <form onSubmit={handleFormSubmit} className="space-y-5">
                              <div><label className="block text-slate-600 text-sm font-bold mb-2">昵称</label><input type="text" value={bookingForm.nickname} onChange={(e) => setBookingForm({...bookingForm, nickname: e.target.value})} className="w-full pl-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="请输入您的昵称" /></div>
                              <div><label className="block text-slate-600 text-sm font-bold mb-2">电话</label><input type="tel" value={bookingForm.phone} onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})} className="w-full pl-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="请输入手机号码" /></div>
                              <div><label className="block text-slate-600 text-sm font-bold mb-2">地址</label><textarea value={bookingForm.address} onChange={(e) => setBookingForm({...bookingForm, address: e.target.value})} className="w-full pl-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24" placeholder="请详细填写服务地址" ></textarea></div>
                              <div className="flex gap-3 mt-4">
                                  <button type="button" onClick={() => setDeductionStep('deduct')} className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold">上一步</button>
                                  <button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">提交订单</button>
                              </div>
                          </form>
                      </div>
                  )}

                  {/* Step 3: Payment */}
                  {deductionStep === 'payment' && (
                      <div className="p-8 text-center">
                          <p className="text-slate-600 mb-6">正在发起支付，需支付 <span className="text-rose-600 font-bold">¥{((selectedCashItem.price || 0) - (deductionPoints / POINT_EXCHANGE_RATE)).toFixed(2)}</span></p>
                          <button onClick={handlePaymentComplete} className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold w-full shadow-lg shadow-green-200">模拟支付成功</button>
                      </div>
                  )}

                  {deductionStep === 'success' && <div className="p-8 text-center"><h3 className="text-2xl font-bold text-slate-800 mb-4">预约成功!</h3><button onClick={closeBooking} className="text-slate-500 underline">关闭</button></div>}
              </div>
          </div>
      )}

      {/* 4. History Modal */}
      {showHistory && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
             <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center"><h2 className="text-xl font-bold text-slate-800">兑换记录</h2><button onClick={() => setShowHistory(false)}><X size={24} className="text-slate-400" /></button></div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-3">
                      {history.map(r=><div key={r.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100"><img src={r.imageUrl} className="w-16 h-16 rounded-lg bg-white object-cover" /><div className="flex-1"><h4 className="font-bold text-slate-800">{r.title}</h4><div className="text-sm text-slate-500 mt-1">{r.points} 积分 · {r.date}</div></div></div>)}
                      {history.length === 0 && <div className="text-center text-slate-400 py-10">暂无记录</div>}
                  </div>
             </div>
          </div>
      )}
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
