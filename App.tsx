

import React, { useState } from 'react';
import { PersonalInfo } from './components/PersonalInfo.tsx';
import { ImportantNotice } from './components/ImportantNotice.tsx';
import { Banner } from './components/Banner.tsx';
import { ServiceGrid } from './components/ServiceGrid.tsx';
import { Leaderboard } from './components/Leaderboard.tsx';
import { AnnouncementHistory } from './components/AnnouncementHistory.tsx';
import { EmployeeBenefits } from './components/EmployeeBenefits.tsx';
import { LearningCenter } from './components/LearningCenter.tsx';
import { Downloads } from './components/Downloads.tsx';
import { PointsCenter } from './components/PointsCenter.tsx';
import { PendingIssues } from './components/PendingIssues.tsx';
import { NoticeDetail } from './components/NoticeDetail.tsx';
import { WishesCenter } from './components/WishesCenter.tsx';
import { MedalsCenter } from './components/MedalsCenter.tsx';
import { ToastNotification } from './components/ToastNotification.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { GiftOverlay } from './components/GiftOverlay.tsx'; 
import { PromotionAlert } from './components/PromotionAlert.tsx'; 
import { PromotionPath } from './components/PromotionPath.tsx';
import { FundPublicity } from './components/FundPublicity.tsx'; // New
import { FeedbackCenter } from './components/FeedbackCenter.tsx'; // New

import { CURRENT_USER, NOTIFICATIONS, SERVICE_ITEMS, LEADERBOARD_DATA, COURSES, INITIAL_BENEFITS, INITIAL_DOWNLOADS, AVAILABLE_GIFTS, INITIAL_POINT_RULES, INITIAL_RANK_STANDARDS, INITIAL_FUNDS } from './constants.tsx';
import { Notification, Employee, RedemptionRecord, Course, BenefitItem, DownloadItem, Gift, GiftEvent, GiftHistoryItem, PointRule, LeaderboardEntry, RankStandard, FundRecord, Feedback } from './types.ts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'history' | 'benefits' | 'learning' | 'downloads' | 'points' | 'pending' | 'notice-detail' | 'wishes' | 'medals' | 'admin' | 'promotion-path' | 'funds' | 'feedback'>('dashboard');
  const [selectedNotice, setSelectedNotice] = useState<Notification | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  
  // --- CMS State ---
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [benefits, setBenefits] = useState<BenefitItem[]>(INITIAL_BENEFITS);
  const [downloads, setDownloads] = useState<DownloadItem[]>(INITIAL_DOWNLOADS);
  const [pointRules, setPointRules] = useState<PointRule[]>(INITIAL_POINT_RULES);
  
  // --- New CMS State ---
  const [fundRecords, setFundRecords] = useState<FundRecord[]>(INITIAL_FUNDS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  
  // --- User & Team State ---
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(LEADERBOARD_DATA);
  const [user, setUser] = useState<Employee>({ ...CURRENT_USER });
  
  // --- Rank Management State ---
  const [rankStandards, setRankStandards] = useState<RankStandard[]>(INITIAL_RANK_STANDARDS);

  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionRecord[]>([]);
  const [currentGiftEvent, setCurrentGiftEvent] = useState<GiftEvent | null>(null);
  const [giftHistory, setGiftHistory] = useState<GiftHistoryItem[]>([]);
  
  // --- Promotion Alert Logic ---
  const [showPromotionAlert, setShowPromotionAlert] = useState(user.nextLevelProgress >= 100);

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 4000);
  };

  const handleBack = () => setCurrentView('dashboard');

  const handleRedeem = (item: any) => {
    if (user.totalPoints >= item.points) {
      setUser(prev => ({...prev, totalPoints: prev.totalPoints - item.points}));
      const newRecord: RedemptionRecord = {
        id: Date.now().toString(),
        title: item.title,
        points: item.points,
        date: new Date().toISOString().split('T')[0],
        imageUrl: item.imageUrl,
        status: 'unused'
      };
      setRedemptionHistory(prev => [newRecord, ...prev]);
      showToast(`兑换成功！消耗 ${item.points} 积分`);
    } else { showToast(`积分不足`); }
  };
  
  const handleNoticeClick = (n: Notification) => { setSelectedNotice(n); setCurrentView('notice-detail'); };
  
  const handleSendGift = (r: string, g: Gift|null, m: string) => {
      if(g) { setUser(p=>({...p, totalPoints:p.totalPoints-g.points})); showToast(`发送成功`); }
      const newItem: GiftHistoryItem = {
          id: Date.now().toString(), type: 'sent', targetUser: r, giftName: g?.name||'祝福', giftIcon: g?.icon||'💬', points: g ? -g.points : 0, date: new Date().toLocaleDateString()
      };
      setGiftHistory(prev => [newItem, ...prev]);
  };
  
  const simulateIncomingGift = () => { 
     const sender = 'Boss'; const gift = AVAILABLE_GIFTS[4]; 
     const newItem: GiftHistoryItem = {
          id: Date.now().toString(), type: 'received', targetUser: sender, giftName: gift.name, giftIcon: gift.icon, points: gift.points, date: new Date().toLocaleDateString()
      };
     setGiftHistory(prev => [newItem, ...prev]);
     setUser(prev => ({...prev, totalPoints: prev.totalPoints + gift.points}));
     setCurrentGiftEvent({ id: Date.now().toString(), senderName: sender, message: 'Great job!', gift });
     setCurrentView('dashboard');
  };

  const handleAdjustPoints = (userId: string, amount: number) => {
      setLeaderboardData(prev => prev.map(p => p.id === userId ? { ...p, score: p.score + amount } : p).sort((a,b)=>b.score-a.score).map((p,i)=>({...p, rank:i+1})));
      if (user.id === userId) setUser(prev => ({ ...prev, totalPoints: prev.totalPoints + amount }));
      showToast(`积分调整成功`);
  };

  const handleUpdateRankProgress = (userId: string, progress: number) => {
      if (userId === user.id || userId === 'u6') { 
           setUser(prev => {
               const newUser = { ...prev, nextLevelProgress: progress };
               if (progress >= 100) setShowPromotionAlert(true);
               return newUser;
           });
      }
  };

  const handleFeedbackSubmit = (data: Omit<Feedback, 'id' | 'date' | 'status'>) => {
      const newFeedback: Feedback = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
          ...data
      };
      setFeedbacks(prev => [newFeedback, ...prev]);
  };

  if (currentView === 'admin') {
      return (
        <AdminDashboard 
            onBack={handleBack}
            notifications={notifications} setNotifications={setNotifications}
            courses={courses} setCourses={setCourses}
            benefits={benefits} setBenefits={setBenefits}
            downloads={downloads} setDownloads={setDownloads}
            pointRules={pointRules} setPointRules={setPointRules}
            employees={leaderboardData} onAdjustPoints={handleAdjustPoints}
            rankStandards={rankStandards}
            setRankStandards={setRankStandards}
            onUpdateRankProgress={handleUpdateRankProgress}
            fundRecords={fundRecords} setFundRecords={setFundRecords}
            feedbacks={feedbacks} setFeedbacks={setFeedbacks}
        />
      );
  }

  // View Rendering
  const renderView = () => {
      switch(currentView) {
          case 'history': return <AnnouncementHistory onBack={handleBack} notifications={notifications} onDetailClick={handleNoticeClick} />;
          case 'benefits': return <EmployeeBenefits user={user} onBack={handleBack} onRedeem={handleRedeem} history={redemptionHistory} items={benefits} />;
          case 'learning': return <LearningCenter onBack={handleBack} courses={courses} user={user} />;
          case 'downloads': return <Downloads user={user} onBack={handleBack} items={downloads} />;
          case 'points': return <PointsCenter user={user} onBack={handleBack} rules={pointRules} />;
          case 'medals': return <MedalsCenter user={user} onBack={handleBack} />;
          case 'pending': return <PendingIssues onBack={handleBack} />;
          case 'notice-detail': return selectedNotice ? <NoticeDetail notice={selectedNotice} onBack={handleBack} /> : null;
          case 'wishes': return <WishesCenter onBack={handleBack} userPoints={user.totalPoints} onSendGift={handleSendGift} onSimulateReceive={simulateIncomingGift} giftHistory={giftHistory} />;
          case 'promotion-path': return <PromotionPath user={user} rankStandards={rankStandards} onBack={handleBack} />;
          case 'funds': return <FundPublicity onBack={handleBack} records={fundRecords} />;
          case 'feedback': return <FeedbackCenter onBack={handleBack} onSubmit={handleFeedbackSubmit} userName={user.name} />;
          default: return (
            <div className="h-screen w-full bg-[#f0f2f5] text-gray-800 p-4 font-sans overflow-hidden selection:bg-blue-100 flex gap-4 relative">
                <ToastNotification visible={toast.visible} message={toast.message} />
                <GiftOverlay event={currentGiftEvent} onComplete={() => setCurrentGiftEvent(null)} />
                <PromotionAlert 
                    visible={showPromotionAlert} 
                    onClose={() => setShowPromotionAlert(false)} 
                    rankTrack={user.rankTrack}
                    nextLevel={user.rankLevel + 1}
                />

                {/* LEFT COLUMN */}
                <div className="flex-1 flex flex-col gap-4 h-full min-w-0">
                    <div className="h-[45%] min-h-0 w-full">
                        <ImportantNotice notifications={notifications} onHistoryClick={() => setCurrentView('history')} onDetailClick={handleNoticeClick} />
                    </div>
                    <div className="shrink-0">
                        <Banner onSendWishesClick={() => setCurrentView('wishes')} />
                    </div>
                    <div className="flex-1 min-h-0">
                        <ServiceGrid items={SERVICE_ITEMS} onItemClick={(id) => {
                             if(id==='1') setCurrentView('pending');
                             if(id==='2') setCurrentView('benefits');
                             if(id==='4') setCurrentView('learning');
                             if(id==='6') setCurrentView('downloads');
                             if(id==='7') setCurrentView('funds');
                             if(id==='8') setCurrentView('feedback');
                        }} />
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-[25%] min-w-[320px] max-w-[400px] flex flex-col gap-4 h-full">
                    <div className="shrink-0">
                        <PersonalInfo 
                            user={user} 
                            onPointsClick={() => setCurrentView('points')} 
                            onMedalsClick={() => setCurrentView('medals')} 
                            onAdminClick={() => setCurrentView('admin')} 
                            onProgressClick={() => setCurrentView('promotion-path')} 
                        />
                    </div>
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <Leaderboard data={leaderboardData} />
                    </div>
                </div>
            </div>
          );
      }
  };

  return renderView();
};

export default App;