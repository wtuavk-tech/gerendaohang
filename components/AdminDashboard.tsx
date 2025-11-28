import React, { useState } from 'react';
import { ArrowLeft, LayoutDashboard, Bell, BookOpen, Settings, Edit, Trash2, Plus, Save, X, CheckSquare, Square, Gift, Download, UploadCloud, Coins, UserCog, Trophy, Award, Layers, PiggyBank, MessageSquare, Check, Target } from 'lucide-react';
import { Notification, Course, BenefitItem, DownloadItem, PointRule, LeaderboardEntry, RankStandard, RankDimension, FundRecord, Feedback } from '../types.ts';

interface AdminDashboardProps {
  onBack: () => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  benefits: BenefitItem[];
  setBenefits: React.Dispatch<React.SetStateAction<BenefitItem[]>>;
  downloads: DownloadItem[];
  setDownloads: React.Dispatch<React.SetStateAction<DownloadItem[]>>;
  pointRules: PointRule[];
  setPointRules: React.Dispatch<React.SetStateAction<PointRule[]>>;
  employees: LeaderboardEntry[];
  onAdjustPoints: (userId: string, amount: number) => void;
  // Rank Props
  rankStandards: RankStandard[];
  setRankStandards: React.Dispatch<React.SetStateAction<RankStandard[]>>;
  onUpdateRankProgress: (userId: string, progress: number) => void;
  // Fund & Feedback Props
  fundRecords: FundRecord[];
  setFundRecords: React.Dispatch<React.SetStateAction<FundRecord[]>>;
  feedbacks: Feedback[];
  setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
}

type Tab = 'notice' | 'learning' | 'benefits' | 'downloads' | 'points' | 'ranks' | 'funds' | 'feedback';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    onBack, 
    notifications, setNotifications, 
    courses, setCourses,
    benefits, setBenefits,
    downloads, setDownloads,
    pointRules, setPointRules,
    employees, onAdjustPoints,
    rankStandards, setRankStandards, onUpdateRankProgress,
    fundRecords, setFundRecords,
    feedbacks, setFeedbacks
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('notice');
  
  // --- States ---
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Partial<Notification>>({});
  
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course>>({});
  
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Partial<BenefitItem>>({});
  
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState<Partial<DownloadItem>>({});
  
  const [pointSubTab, setPointSubTab] = useState<'rules' | 'members'>('rules');
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Partial<PointRule>>({});
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<LeaderboardEntry | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<'add' | 'sub'>('add');
  
  // Rank Management States
  const [rankSubTab, setRankSubTab] = useState<'config' | 'evaluation'>('config');
  const [currentRole, setCurrentRole] = useState<'manager' | 'supervisor'>('manager');
  
  // Rank Config State
  const [selectedConfigTrack, setSelectedConfigTrack] = useState<'F'|'Y'|'G'>('F');
  const [selectedConfigLevel, setSelectedConfigLevel] = useState<number>(8);
  const [editingDimension, setEditingDimension] = useState<Partial<RankDimension> | null>(null); // If adding new dim

  // Rank Eval State
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalTarget, setEvalTarget] = useState<LeaderboardEntry | null>(null);
  const [evalScores, setEvalScores] = useState<{[dimName: string]: number}>({});

  // --- New States for Fund & Feedback ---
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [editingFund, setEditingFund] = useState<Partial<FundRecord>>({});

  // ... (Helper Configs) ...
  const DEPARTMENTS = ['产品部', '技术部', '客服部', '运营部', '行政部'];
  const LEVELS = ['P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'F5','F6','F7','F8','F9'];
  const DOWNLOAD_CATEGORIES = ['全员资料', '派单员', '客服', '技术', '运营'];

  // --- Handlers ---
  
  // Notice
  const handleSaveNotice = () => {
      if (!editingNotice.title || !editingNotice.content) return alert("请填写完整信息");
      const newNotice: Notification = {
          id: editingNotice.id || Date.now().toString(),
          title: editingNotice.title,
          date: editingNotice.date || new Date().toISOString().split('T')[0],
          type: editingNotice.type || 'general',
          content: editingNotice.content,
          readCount: editingNotice.readCount || 0,
          isPinned: editingNotice.isPinned || false,
          publisher: editingNotice.publisher || '行政部',
          expiryDate: editingNotice.expiryDate || '',
      };
      if (editingNotice.id) setNotifications(prev => prev.map(n => n.id === newNotice.id ? newNotice : n));
      else setNotifications(prev => [newNotice, ...prev]);
      setIsNoticeModalOpen(false);
  };
  const handleDeleteNotice = (id: string) => { if(confirm('确定删除?')) setNotifications(prev => prev.filter(n => n.id !== id)); };

  // Course
  const handleSaveCourse = () => { 
      if (!editingCourse.title) return;
      const newCourse: Course = {
          id: editingCourse.id || Date.now().toString(),
          title: editingCourse.title,
          category: editingCourse.category || '通用技能',
          imageUrl: editingCourse.imageUrl || 'https://picsum.photos/400/300',
          permissions: editingCourse.permissions || { departments: ['all'], levels: ['all'] }
      };
      if (editingCourse.id) setCourses(prev => prev.map(c => c.id === newCourse.id ? newCourse : c));
      else setCourses(prev => [...prev, newCourse]);
      setIsCourseModalOpen(false);
  };
  
  const toggleCoursePermission = (type: 'departments' | 'levels', value: string) => {
      setEditingCourse(prev => {
          const current = prev.permissions?.[type] || [];
          let updated: string[];
          if (current.includes(value)) {
              updated = current.filter(v => v !== value);
          } else {
              updated = [...current, value];
          }
          return {
              ...prev,
              permissions: {
                  ...prev.permissions!,
                  [type]: updated
              }
          };
      });
  };

  // Benefits
  const handleSaveBenefit = () => { 
      if (!editingBenefit.title) return;
      const newItem: BenefitItem = {
          id: editingBenefit.id || Date.now(),
          title: editingBenefit.title,
          points: Number(editingBenefit.points) || 0,
          price: Number(editingBenefit.price) || 0,
          imageUrl: editingBenefit.imageUrl || 'https://picsum.photos/300/300',
      };
      if (editingBenefit.id) setBenefits(prev => prev.map(b => b.id === newItem.id ? newItem : b));
      else setBenefits(prev => [newItem, ...prev]);
      setIsBenefitModalOpen(false);
  };
  const handleDeleteBenefit = (id: string | number) => { if(confirm('确定删除?')) setBenefits(prev => prev.filter(b => b.id !== id)); };

  // Download
  const handleSaveDownload = () => { 
       if (!editingDownload.title) return;
       const newItem: DownloadItem = {
           id: editingDownload.id || Date.now().toString(),
           title: editingDownload.title,
           category: editingDownload.category || '全员资料',
           date: new Date().toISOString().split('T')[0],
           content: editingDownload.content || '',
           fileName: editingDownload.fileName || 'file.pdf',
           isPinned: editingDownload.isPinned
       };
       if (editingDownload.id) setDownloads(prev => prev.map(d => d.id === newItem.id ? newItem : d));
       else setDownloads(prev => [newItem, ...prev]);
       setIsDownloadModalOpen(false);
  };
  const handleDeleteDownload = (id: string) => { if(confirm('确定删除?')) setDownloads(prev => prev.filter(d => d.id !== id)); };

  // Rules
  const handleSaveRule = () => { 
       if (!editingRule.title) return;
       const newRule: PointRule = {
           id: editingRule.id || Date.now(),
           title: editingRule.title,
           category: editingRule.category || '全员',
           content: editingRule.content || ''
       };
       if (editingRule.id) setPointRules(prev => prev.map(r => r.id === newRule.id ? newRule : r));
       else setPointRules(prev => [...prev, newRule]);
       setIsRuleModalOpen(false);
  };
  const handleDeleteRule = (id: string | number) => { if(confirm('确定删除?')) setPointRules(prev => prev.filter(r => r.id !== id)); };

  // Adjust Points
  const openAdjustModal = (m: LeaderboardEntry) => { setSelectedMember(m); setAdjustAmount(0); setAdjustType('add'); setIsAdjustModalOpen(true); };
  const handleConfirmAdjust = () => { 
      if(selectedMember) onAdjustPoints(selectedMember.id, adjustType === 'add' ? adjustAmount : -adjustAmount); 
      setIsAdjustModalOpen(false); 
  };
  
  // --- Rank Handlers ---

  // 1. Config Standard
  const currentStandard = rankStandards.find(r => r.track === selectedConfigTrack && r.level === selectedConfigLevel);
  
  const handleAddDimension = () => {
      if (!editingDimension?.name || !editingDimension?.weight) return alert("请填写维度名称和权重");
      
      const newDim: RankDimension = {
          name: editingDimension.name,
          weight: Number(editingDimension.weight),
          description: editingDimension.description || ''
      };

      setRankStandards(prev => {
          const exists = prev.find(r => r.track === selectedConfigTrack && r.level === selectedConfigLevel);
          if (exists) {
              return prev.map(r => r.id === exists.id ? { ...r, dimensions: [...r.dimensions, newDim] } : r);
          } else {
              return [...prev, {
                  id: Date.now().toString(),
                  track: selectedConfigTrack,
                  level: selectedConfigLevel,
                  dimensions: [newDim]
              }];
          }
      });
      setEditingDimension(null);
  };

  const handleDeleteDimension = (dimName: string) => {
      setRankStandards(prev => prev.map(r => {
          if (r.track === selectedConfigTrack && r.level === selectedConfigLevel) {
              return { ...r, dimensions: r.dimensions.filter(d => d.name !== dimName) };
          }
          return r;
      }));
  };

  // 2. Evaluation
  const handleEvalClick = (employee: LeaderboardEntry) => { 
      setEvalTarget(employee); 
      // Initialize scores with 0
      const nextLevel = (employee.rankLevel || 0) + 1;
      const track = employee.rankTrack || 'F';
      const standard = rankStandards.find(r => r.track === track && r.level === nextLevel);
      
      const initialScores: {[key:string]: number} = {};
      if (standard) {
          standard.dimensions.forEach(d => initialScores[d.name] = 0);
      }
      setEvalScores(initialScores);
      setEvalModalOpen(true); 
  };

  const handleSubmitEval = () => { 
      if(!evalTarget) return;
      const nextLevel = (evalTarget.rankLevel || 0) + 1;
      const track = evalTarget.rankTrack || 'F';
      const standard = rankStandards.find(r => r.track === track && r.level === nextLevel);
      
      let totalScore = 0;
      if (standard) {
          // Weighted Average: Sum(Score * Weight) / 100
          standard.dimensions.forEach(d => {
             const score = evalScores[d.name] || 0;
             totalScore += (score * d.weight) / 100;
          });
      } else {
          // Fallback if no standard (shouldn't happen with correct config)
          totalScore = 0;
      }
      
      // Round to 1 decimal
      totalScore = Math.round(totalScore * 10) / 10;
      
      onUpdateRankProgress(evalTarget.id, totalScore);
      setEvalModalOpen(false); 
      alert(`评估完成！员工 ${evalTarget.name} 的晋升进度已更新为 ${totalScore}%`);
  };

  const filteredSubordinates = employees.filter(e => currentRole === 'manager' ? e.role === 'supervisor' : e.role === 'member');

  // Fund
  const handleSaveFund = () => {
      if (!editingFund.month || !editingFund.amount) return alert("请填写月份和金额");
      const newFund: FundRecord = {
          id: editingFund.id || Date.now().toString(),
          type: editingFund.type || 'income',
          month: editingFund.month,
          amount: Number(editingFund.amount),
          department: editingFund.department || (editingFund.type==='income'?'技术部':undefined),
          expenseType: editingFund.expenseType || (editingFund.type==='expense'?'日常支出':undefined),
          project: editingFund.project,
          neededAmount: editingFund.neededAmount ? Number(editingFund.neededAmount) : undefined,
          invoiceImages: editingFund.invoiceImages || [],
          productImages: editingFund.productImages || []
      };
      if (editingFund.id) setFundRecords(prev => prev.map(r => r.id === newFund.id ? newFund : r));
      else setFundRecords(prev => [newFund, ...prev]);
      setIsFundModalOpen(false);
  };
  const handleDeleteFund = (id: string) => { if(confirm('删除此记录?')) setFundRecords(prev => prev.filter(r => r.id !== id)); };

  // Feedback
  const toggleFeedbackStatus = (id: string) => {
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 'read' ? 'pending' : 'read' } : f));
  };
  const handleDeleteFeedback = (id: string) => { if(confirm('删除此反馈?')) setFeedbacks(prev => prev.filter(f => f.id !== id)); };

  // Helper for Feedback styling
  const getFeedbackStyle = (type: string) => {
      if (type === 'suggestion') return 'border-purple-100 shadow-purple-50';
      if (type === 'complaint') return 'border-orange-100 shadow-orange-50';
      return 'border-red-100 shadow-red-50'; // report
  };
  
  const getFeedbackBadge = (type: string, isAnon: boolean) => {
      if (type === 'suggestion') return { text: isAnon ? '匿名建议' : '实名建议', className: 'bg-purple-100 text-purple-600' };
      if (type === 'complaint') return { text: isAnon ? '匿名投诉' : '实名投诉', className: 'bg-orange-100 text-orange-600' };
      return { text: isAnon ? '匿名举报' : '实名举报', className: 'bg-red-100 text-red-600' };
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab ? 'bg-blue-600 shadow-lg shadow-blue-900/50 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
        <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="flex h-screen w-full bg-[#f0f2f5] font-sans text-slate-800">
      
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shrink-0 shadow-xl z-20">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Settings size={20} />
              </div>
              <span className="font-bold text-xl tracking-wider">管理后台</span>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <NavItem tab="notice" icon={Bell} label="公告管理" />
              <NavItem tab="learning" icon={BookOpen} label="学习中心权限" />
              <NavItem tab="benefits" icon={Gift} label="员工福利管理" />
              <NavItem tab="downloads" icon={Download} label="资料下载管理" />
              <NavItem tab="points" icon={Coins} label="积分管理" />
              <NavItem tab="ranks" icon={Layers} label="职级管理" />
              <NavItem tab="funds" icon={PiggyBank} label="乐捐资金管理" />
              <NavItem tab="feedback" icon={MessageSquare} label="反馈信箱" />
          </nav>

          <div className="p-4 border-t border-slate-800">
              <button onClick={onBack} className="w-full flex items-center gap-2 justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl transition-colors">
                  <ArrowLeft size={18} /> 返回前台
              </button>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
          <header className="bg-white shadow-sm px-8 py-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-slate-800">
                  {activeTab === 'notice' && '公告内容管理'}
                  {activeTab === 'learning' && '课程权限配置'}
                  {activeTab === 'benefits' && '福利商城商品管理'}
                  {activeTab === 'downloads' && '资料中心内容管理'}
                  {activeTab === 'points' && '积分体系管理'}
                  {activeTab === 'ranks' && '职级评审管理'}
                  {activeTab === 'funds' && '乐捐收支记录'}
                  {activeTab === 'feedback' && '员工建议与反馈'}
              </h2>
              <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">管理员: admin</span>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">A</div>
              </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
              
              {/* --- 8. Feedback Tab --- */}
              {activeTab === 'feedback' && (
                  <div className="space-y-6 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {feedbacks.map(f => {
                              const badge = getFeedbackBadge(f.type, f.isAnonymous);
                              return (
                                  <div key={f.id} className={`bg-white rounded-2xl p-6 border ${getFeedbackStyle(f.type)} shadow-sm flex flex-col`}>
                                       <div className="flex justify-between items-start mb-4">
                                           <div className={`px-2 py-1 rounded text-xs font-bold ${badge.className}`}>
                                               {badge.text}
                                           </div>
                                           <span className="text-xs text-slate-400">{f.date}</span>
                                       </div>
                                       <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                                       <p className="text-slate-600 text-sm mb-4 line-clamp-4 flex-1">{f.content}</p>
                                       
                                       <div className="text-xs text-slate-400 mb-4 font-bold">
                                           提交人: {f.isAnonymous ? '匿名' : f.name}
                                       </div>
                                       
                                       <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-auto">
                                           <button onClick={()=>toggleFeedbackStatus(f.id)} className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${f.status==='read'?'bg-gray-100 text-gray-500':'bg-blue-100 text-blue-600'}`}>
                                               {f.status==='read'?'标记为未读':'标记为已读'}
                                           </button>
                                           <button onClick={()=>handleDeleteFeedback(f.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                       </div>
                                  </div>
                              );
                          })}
                          {feedbacks.length === 0 && <div className="col-span-3 text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed">暂无反馈信息</div>}
                      </div>
                  </div>
              )}

              {/* ... [Other tabs remain largely the same, just keeping structure valid] ... */}
              {/* --- 1. Notice Tab --- */}
              {activeTab === 'notice' && (
                   <div className="space-y-6 animate-fade-in">
                       <div className="flex justify-end">
                          <button onClick={() => { setEditingNotice({}); setIsNoticeModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"><Plus size={20} /> 发布新公告</button>
                       </div>
                       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                          <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 pl-6">标题</th><th className="p-4">发布人</th><th className="p-4">日期</th><th className="p-4">有效期</th><th className="p-4 text-right">操作</th></tr></thead>
                              <tbody className="divide-y divide-slate-100">
                                  {notifications.map(n => (
                                      <tr key={n.id} className="hover:bg-slate-50">
                                          <td className="p-4 pl-6 font-medium">{n.title}</td>
                                          <td className="p-4 text-sm text-slate-500">{n.publisher}</td>
                                          <td className="p-4 text-sm text-slate-500">{n.date}</td>
                                          <td className="p-4 text-sm text-slate-500">{n.expiryDate || '长期'}</td>
                                          <td className="p-4 text-right space-x-2">
                                              <button onClick={() => { setEditingNotice(n); setIsNoticeModalOpen(true); }} className="p-2 text-blue-600"><Edit size={18} /></button>
                                              <button onClick={() => handleDeleteNotice(n.id)} className="p-2 text-red-600"><Trash2 size={18} /></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {/* --- 2. Learning Tab --- */}
              {activeTab === 'learning' && (
                  <div className="space-y-6 animate-fade-in">
                       <div className="flex justify-end">
                          <button onClick={() => { setEditingCourse({permissions: {departments:['all'], levels:['all']}}); setIsCourseModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"><Plus size={20} /> 添加课程</button>
                       </div>
                       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                          <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 pl-6">课程标题</th><th className="p-4">分类</th><th className="p-4">权限设置</th><th className="p-4 text-right">操作</th></tr></thead>
                              <tbody className="divide-y divide-slate-100">
                                  {courses.map(c => (
                                      <tr key={c.id} className="hover:bg-slate-50">
                                          <td className="p-4 pl-6 font-medium">{c.title}</td>
                                          <td className="p-4 text-sm text-slate-500">{c.category}</td>
                                          <td className="p-4 text-sm text-slate-500">
                                              <div className="flex flex-col gap-1">
                                                  <div className="flex items-center gap-1">
                                                      <span className="font-bold text-xs text-slate-400">部门:</span>
                                                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{c.permissions.departments.includes('all') ? '全部' : c.permissions.departments.join(', ')}</span>
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                      <span className="font-bold text-xs text-slate-400">职级:</span>
                                                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{c.permissions.levels.includes('all') ? '全部' : c.permissions.levels.join(', ')}</span>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="p-4 text-right space-x-2">
                                              <button onClick={() => { setEditingCourse(c); setIsCourseModalOpen(true); }} className="p-2 text-blue-600"><Edit size={18} /></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                       </div>
                  </div>
              )}

              {/* --- 3. Benefits Tab --- */}
              {activeTab === 'benefits' && (
                  <div className="space-y-6 animate-fade-in">
                       <div className="flex justify-end">
                          <button onClick={() => { setEditingBenefit({}); setIsBenefitModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"><Plus size={20} /> 上架商品</button>
                       </div>
                       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                          <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 pl-6">商品名称</th><th className="p-4">积分/价格</th><th className="p-4 text-right">操作</th></tr></thead>
                              <tbody className="divide-y divide-slate-100">
                                  {benefits.map(b => (
                                      <tr key={b.id} className="hover:bg-slate-50">
                                          <td className="p-4 pl-6 flex items-center gap-3">
                                              <img src={b.imageUrl} className="w-10 h-10 rounded-lg object-cover" />
                                              <span className="font-medium">{b.title}</span>
                                          </td>
                                          <td className="p-4 text-sm text-slate-500">
                                              {b.points > 0 ? `${b.points} 积分` : `¥${b.price}`}
                                          </td>
                                          <td className="p-4 text-right space-x-2">
                                              <button onClick={() => { setEditingBenefit(b); setIsBenefitModalOpen(true); }} className="p-2 text-blue-600"><Edit size={18} /></button>
                                              <button onClick={() => handleDeleteBenefit(b.id)} className="p-2 text-red-600"><Trash2 size={18} /></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                       </div>
                  </div>
              )}

              {/* --- 4. Downloads Tab --- */}
              {activeTab === 'downloads' && (
                  <div className="space-y-6 animate-fade-in">
                       <div className="flex justify-end">
                          <button onClick={() => { setEditingDownload({}); setIsDownloadModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"><Plus size={20} /> 上传资料</button>
                       </div>
                       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                          <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 pl-6">资料标题</th><th className="p-4">分类</th><th className="p-4">文件名</th><th className="p-4 text-right">操作</th></tr></thead>
                              <tbody className="divide-y divide-slate-100">
                                  {downloads.map(d => (
                                      <tr key={d.id} className="hover:bg-slate-50">
                                          <td className="p-4 pl-6 font-medium">
                                              {d.isPinned && <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded mr-2">顶</span>}
                                              {d.title}
                                          </td>
                                          <td className="p-4 text-sm text-slate-500">{d.category}</td>
                                          <td className="p-4 text-sm text-slate-500">{d.fileName}</td>
                                          <td className="p-4 text-right space-x-2">
                                              <button onClick={() => { setEditingDownload(d); setIsDownloadModalOpen(true); }} className="p-2 text-blue-600"><Edit size={18} /></button>
                                              <button onClick={() => handleDeleteDownload(d.id)} className="p-2 text-red-600"><Trash2 size={18} /></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                       </div>
                  </div>
              )}

              {/* --- 5. Points Tab --- */}
              {activeTab === 'points' && (
                  <div className="space-y-6 animate-fade-in">
                       <div className="flex gap-4 mb-4">
                           <button onClick={() => setPointSubTab('rules')} className={`px-4 py-2 rounded-lg font-bold ${pointSubTab==='rules'?'bg-slate-800 text-white':'bg-white text-slate-600'}`}>规则配置</button>
                           <button onClick={() => setPointSubTab('members')} className={`px-4 py-2 rounded-lg font-bold ${pointSubTab==='members'?'bg-slate-800 text-white':'bg-white text-slate-600'}`}>积分调整</button>
                       </div>

                       {pointSubTab === 'rules' ? (
                           <>
                               <div className="flex justify-end">
                                   <button onClick={() => { setEditingRule({}); setIsRuleModalOpen(true); }} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2"><Plus size={20} /> 新增规则</button>
                               </div>
                               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                  <table className="w-full text-left">
                                      <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 pl-6">分类</th><th className="p-4">规则标题</th><th className="p-4">内容</th><th className="p-4 text-right">操作</th></tr></thead>
                                      <tbody className="divide-y divide-slate-100">
                                          {pointRules.map(r => (
                                              <tr key={r.id} className="hover:bg-slate-50">
                                                  <td className="p-4 pl-6"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{r.category}</span></td>
                                                  <td className="p-4 font-bold text-slate-700">{r.title}</td>
                                                  <td className="p-4 text-sm text-slate-500 max-w-md truncate">{r.content}</td>
                                                  <td className="p-4 text-right space-x-2">
                                                      <button onClick={() => { setEditingRule(r); setIsRuleModalOpen(true); }} className="p-2 text-blue-600"><Edit size={18} /></button>
                                                      <button onClick={() => handleDeleteRule(r.id)} className="p-2 text-red-600"><Trash2 size={18} /></button>
                                                  </td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                               </div>
                           </>
                       ) : (
                           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                               <table className="w-full text-left">
                                  <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 pl-6">员工</th><th className="p-4">部门</th><th className="p-4">当前积分</th><th className="p-4 text-right">操作</th></tr></thead>
                                  <tbody className="divide-y divide-slate-100">
                                      {employees.map(e => (
                                          <tr key={e.id} className="hover:bg-slate-50">
                                              <td className="p-4 pl-6 flex items-center gap-3">
                                                  <img src={e.avatar} className="w-8 h-8 rounded-full" />
                                                  <span className="font-bold">{e.name}</span>
                                              </td>
                                              <td className="p-4 text-sm text-slate-500">{e.department}</td>
                                              <td className="p-4 font-mono font-bold text-blue-600">{e.score}</td>
                                              <td className="p-4 text-right">
                                                  <button onClick={() => openAdjustModal(e)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold">奖惩调整</button>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                               </table>
                           </div>
                       )}
                  </div>
              )}

              {/* --- 6. Ranks Tab --- */}
              {activeTab === 'ranks' && (
                  <div className="space-y-6 animate-fade-in">
                       <div className="flex gap-4 mb-4">
                           <button onClick={() => setRankSubTab('config')} className={`px-4 py-2 rounded-lg font-bold ${rankSubTab==='config'?'bg-slate-800 text-white':'bg-white text-slate-600'}`}>标准配置</button>
                           <button onClick={() => setRankSubTab('evaluation')} className={`px-4 py-2 rounded-lg font-bold ${rankSubTab==='evaluation'?'bg-slate-800 text-white':'bg-white text-slate-600'}`}>晋升评审</button>
                       </div>

                       {rankSubTab === 'config' ? (
                           <div className="flex flex-col lg:flex-row gap-8">
                               {/* Configuration Sidebar */}
                               <div className="w-full lg:w-1/3 bg-white rounded-2xl p-6 border border-slate-200">
                                   <h3 className="text-lg font-bold mb-6">选择配置对象</h3>
                                   <div className="mb-6">
                                       <label className="block mb-2 font-bold text-slate-600">序列 Track</label>
                                       <div className="flex gap-2">
                                           {['F', 'Y', 'G'].map(t => (
                                               <button key={t} onClick={() => setSelectedConfigTrack(t as any)} className={`flex-1 py-2 rounded-xl font-bold border transition-all ${selectedConfigTrack===t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                                                   {t}序列
                                               </button>
                                           ))}
                                       </div>
                                   </div>
                                   <div className="mb-6">
                                       <label className="block mb-2 font-bold text-slate-600">目标层级 Level</label>
                                       <select 
                                         value={selectedConfigLevel} 
                                         onChange={e => setSelectedConfigLevel(Number(e.target.value))}
                                         className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                                       >
                                           {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>Level {l}</option>)}
                                       </select>
                                   </div>
                               </div>
                               
                               {/* Dimensions Editor */}
                               <div className="flex-1 bg-white rounded-2xl p-6 border border-slate-200">
                                   <div className="flex justify-between items-center mb-6">
                                       <h3 className="text-lg font-bold flex items-center gap-2">
                                           <Target className="text-blue-600" />
                                           {selectedConfigTrack}{selectedConfigLevel} 评审维度
                                       </h3>
                                       {currentStandard && currentStandard.dimensions.reduce((a,b)=>a+b.weight,0) !== 100 && (
                                           <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">当前权重总和不为100%</span>
                                       )}
                                   </div>

                                   <div className="space-y-4 mb-8">
                                       {currentStandard ? (
                                           currentStandard.dimensions.map((dim, idx) => (
                                               <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                   <div>
                                                       <div className="font-bold text-slate-800">{dim.name}</div>
                                                       <div className="text-xs text-slate-500">{dim.description}</div>
                                                   </div>
                                                   <div className="flex items-center gap-4">
                                                       <div className="text-sm font-mono font-bold text-blue-600">{dim.weight}%</div>
                                                       <button onClick={() => handleDeleteDimension(dim.name)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                                   </div>
                                               </div>
                                           ))
                                       ) : (
                                           <div className="text-center py-10 text-slate-400">当前层级暂无配置，请添加维度</div>
                                       )}
                                   </div>

                                   <div className="border-t border-slate-100 pt-6">
                                       <h4 className="font-bold text-sm text-slate-500 mb-4">添加新维度</h4>
                                       <div className="grid grid-cols-2 gap-4 mb-4">
                                           <input 
                                             placeholder="维度名称 (如: 专业深度)" 
                                             value={editingDimension?.name || ''}
                                             onChange={e => setEditingDimension(prev => ({...prev, name: e.target.value}))}
                                             className="border p-2 rounded-lg"
                                           />
                                           <input 
                                             type="number" placeholder="权重 %" 
                                             value={editingDimension?.weight || ''}
                                             onChange={e => setEditingDimension(prev => ({...prev, weight: Number(e.target.value)}))}
                                             className="border p-2 rounded-lg"
                                           />
                                           <input 
                                             placeholder="维度描述" 
                                             value={editingDimension?.description || ''}
                                             onChange={e => setEditingDimension(prev => ({...prev, description: e.target.value}))}
                                             className="border p-2 rounded-lg col-span-2"
                                           />
                                       </div>
                                       <button onClick={handleAddDimension} className="w-full bg-slate-800 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2"><Plus size={16} /> 添加维度</button>
                                   </div>
                               </div>
                           </div>
                       ) : (
                           <div>
                               <div className="flex justify-between items-center mb-6">
                                   <h3 className="font-bold text-lg">晋升评估</h3>
                                   <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                                       <button onClick={() => setCurrentRole('manager')} className={`px-4 py-1 rounded ${currentRole==='manager'?'bg-blue-100 text-blue-600 font-bold':''}`}>我看主管</button>
                                       <button onClick={() => setCurrentRole('supervisor')} className={`px-4 py-1 rounded ${currentRole==='supervisor'?'bg-blue-100 text-blue-600 font-bold':''}`}>我看员工</button>
                                   </div>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                   {filteredSubordinates.map(sub => {
                                       const nextLvl = (sub.rankLevel || 0) + 1;
                                       const track = sub.rankTrack || 'F';
                                       return (
                                           <div key={sub.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center hover:shadow-lg transition-all">
                                               <img src={sub.avatar} className="w-16 h-16 rounded-full border-2 border-slate-100 mb-3" />
                                               <h4 className="font-bold text-lg">{sub.name}</h4>
                                               <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                                                   <span className="bg-slate-100 px-2 py-0.5 rounded">{sub.department}</span>
                                                   <span>{track}{sub.rankLevel} → {track}{nextLvl}</span>
                                               </div>
                                               <button onClick={() => handleEvalClick(sub)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold shadow-md shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2">
                                                   <Award size={18} /> 发起评估
                                               </button>
                                           </div>
                                       );
                                   })}
                               </div>
                           </div>
                       )}
                  </div>
              )}

              {/* --- 7. Funds Tab --- */}
              {activeTab === 'funds' && (
                  <div className="space-y-6 animate-fade-in">
                      <div className="flex justify-end">
                          <button onClick={() => { setEditingFund({ type: 'income', month: '11月' }); setIsFundModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"><Plus size={20} /> 录入新记录</button>
                      </div>
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                          <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 pl-6">类型</th><th className="p-4">详情</th><th className="p-4">月份</th><th className="p-4">金额</th><th className="p-4 text-right">操作</th></tr></thead>
                              <tbody className="divide-y divide-slate-100">
                                  {fundRecords.map(r => (
                                      <tr key={r.id} className="hover:bg-slate-50">
                                          <td className="p-4 pl-6">
                                              <span className={`text-xs px-2 py-1 rounded font-bold ${r.type==='income'?'bg-green-50 text-green-600':'bg-red-50 text-red-600'}`}>
                                                  {r.type==='income'?'收入':'支出'}
                                              </span>
                                          </td>
                                          <td className="p-4 text-sm font-bold text-slate-700">
                                              {r.type==='income' ? r.department : `${r.expenseType} - ${r.project}`}
                                          </td>
                                          <td className="p-4 text-slate-500">{r.month}</td>
                                          <td className="p-4 font-mono font-bold">{r.amount}</td>
                                          <td className="p-4 text-right space-x-2">
                                              <button onClick={() => { setEditingFund(r); setIsFundModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                                              <button onClick={() => handleDeleteFund(r.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* --- Modals --- */}
      
      {/* 1. Fund Modal */}
      {isFundModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center"><h3 className="text-xl font-bold">资金记录</h3><button onClick={() => setIsFundModalOpen(false)}><X size={20} /></button></div>
                  <div className="p-8 space-y-4 overflow-y-auto">
                      <div><label className="font-bold block mb-2">类型</label><select value={editingFund.type||'income'} onChange={e=>setEditingFund({...editingFund, type:e.target.value as any})} className="w-full border p-3 rounded-xl"><option value="income">收入</option><option value="expense">支出</option></select></div>
                      <div><label className="font-bold block mb-2">月份</label><input value={editingFund.month||''} onChange={e=>setEditingFund({...editingFund, month:e.target.value})} className="w-full border p-3 rounded-xl" placeholder="例如: 1月" /></div>
                      <div><label className="font-bold block mb-2">金额</label><input type="number" value={editingFund.amount||''} onChange={e=>setEditingFund({...editingFund, amount:Number(e.target.value)})} className="w-full border p-3 rounded-xl" /></div>
                      
                      {editingFund.type === 'income' ? (
                          <div><label className="font-bold block mb-2">来源部门</label><select value={editingFund.department||'技术部'} onChange={e=>setEditingFund({...editingFund, department:e.target.value})} className="w-full border p-3 rounded-xl">{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></div>
                      ) : (
                          <>
                            <div><label className="font-bold block mb-2">支出类型</label><input value={editingFund.expenseType||''} onChange={e=>setEditingFund({...editingFund, expenseType:e.target.value})} className="w-full border p-3 rounded-xl" /></div>
                            <div><label className="font-bold block mb-2">项目名称</label><input value={editingFund.project||''} onChange={e=>setEditingFund({...editingFund, project:e.target.value})} className="w-full border p-3 rounded-xl" /></div>
                            <div><label className="font-bold block mb-2">需支出金额 (预算)</label><input type="number" value={editingFund.neededAmount||''} onChange={e=>setEditingFund({...editingFund, neededAmount:Number(e.target.value)})} className="w-full border p-3 rounded-xl" /></div>
                            <div className="pt-2 border-t mt-2">
                                <label className="font-bold block mb-2">发票图片 URL (用逗号分隔)</label>
                                <input 
                                    value={editingFund.invoiceImages?.join(',') || ''} 
                                    onChange={e=>setEditingFund({...editingFund, invoiceImages: e.target.value.split(',').filter(s=>s.trim())})} 
                                    className="w-full border p-3 rounded-xl" 
                                    placeholder="http://..."
                                />
                            </div>
                            <div className="pt-2">
                                <label className="font-bold block mb-2">实物图片 URL (用逗号分隔)</label>
                                <input 
                                    value={editingFund.productImages?.join(',') || ''} 
                                    onChange={e=>setEditingFund({...editingFund, productImages: e.target.value.split(',').filter(s=>s.trim())})} 
                                    className="w-full border p-3 rounded-xl"
                                    placeholder="http://..."
                                />
                            </div>
                          </>
                      )}
                  </div>
                  <div className="p-6 border-t flex justify-end gap-3"><button onClick={handleSaveFund} className="bg-blue-600 text-white px-6 py-2 rounded-xl">保存</button></div>
              </div>
          </div>
      )}

      {/* 2. Notice Modal */}
      {isNoticeModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center"><h3 className="text-xl font-bold">公告编辑</h3><button onClick={() => setIsNoticeModalOpen(false)}><X size={20} /></button></div>
                  <div className="p-8 space-y-6 overflow-y-auto">
                      <div><label className="font-bold block mb-2">标题</label><input value={editingNotice.title||''} onChange={e=>setEditingNotice({...editingNotice, title:e.target.value})} className="w-full border p-3 rounded-xl" /></div>
                      <div className="grid grid-cols-2 gap-4">
                          <div><label className="font-bold block mb-2">发布人</label><input value={editingNotice.publisher||''} onChange={e=>setEditingNotice({...editingNotice, publisher:e.target.value})} className="w-full border p-3 rounded-xl" placeholder="例如：行政部" /></div>
                          <div><label className="font-bold block mb-2">有效期至</label><input type="date" value={editingNotice.expiryDate||''} onChange={e=>setEditingNotice({...editingNotice, expiryDate:e.target.value})} className="w-full border p-3 rounded-xl" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div><label className="font-bold block mb-2">类型</label><select value={editingNotice.type||'general'} onChange={e=>setEditingNotice({...editingNotice, type:e.target.value as any})} className="w-full border p-3 rounded-xl"><option value="general">普通</option><option value="urgent">紧急</option><option value="promotion">晋升</option></select></div>
                          <div className="pt-8"><label className="flex gap-2"><input type="checkbox" checked={editingNotice.isPinned||false} onChange={e=>setEditingNotice({...editingNotice, isPinned:e.target.checked})} /> 置顶</label></div>
                      </div>
                      <div><label className="font-bold block mb-2">内容</label><textarea value={editingNotice.content||''} onChange={e=>setEditingNotice({...editingNotice, content:e.target.value})} className="w-full border p-3 rounded-xl h-32" /></div>
                  </div>
                  <div className="p-6 border-t flex justify-end gap-3"><button onClick={handleSaveNotice} className="bg-blue-600 text-white px-6 py-2 rounded-xl">保存</button></div>
              </div>
          </div>
      )}

      {/* 3. Course Modal (Updated with Checkboxes) */}
      {isCourseModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold">课程编辑</h3><button onClick={() => setIsCourseModalOpen(false)}><X size={20} /></button></div>
                  <div className="p-8 space-y-6 overflow-y-auto">
                      <div><label className="block mb-2 font-bold">课程标题</label><input value={editingCourse.title||''} onChange={e=>setEditingCourse({...editingCourse, title:e.target.value})} className="w-full border p-3 rounded-xl"/></div>
                      <div><label className="block mb-2 font-bold">分类</label><select value={editingCourse.category||'通用技能'} onChange={e=>setEditingCourse({...editingCourse, category:e.target.value as any})} className="w-full border p-3 rounded-xl"><option>企业文化</option><option>通用技能</option><option>专业技能</option></select></div>
                      
                      {/* Permission Editing */}
                      <div>
                          <label className="block mb-3 font-bold border-b pb-1">可见部门权限</label>
                          <div className="flex flex-wrap gap-3">
                              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border hover:border-blue-400">
                                  <input type="checkbox" checked={editingCourse.permissions?.departments.includes('all')} onChange={() => toggleCoursePermission('departments', 'all')} />
                                  <span className="text-sm font-bold">全部部门</span>
                              </label>
                              {DEPARTMENTS.map(dept => (
                                  <label key={dept} className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border hover:border-blue-400">
                                      <input type="checkbox" checked={editingCourse.permissions?.departments.includes(dept)} onChange={() => toggleCoursePermission('departments', dept)} />
                                      <span className="text-sm">{dept}</span>
                                  </label>
                              ))}
                          </div>
                      </div>
                      <div>
                          <label className="block mb-3 font-bold border-b pb-1">可见职级权限</label>
                          <div className="flex flex-wrap gap-3">
                              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border hover:border-blue-400">
                                  <input type="checkbox" checked={editingCourse.permissions?.levels.includes('all')} onChange={() => toggleCoursePermission('levels', 'all')} />
                                  <span className="text-sm font-bold">全部职级</span>
                              </label>
                              {LEVELS.map(lvl => (
                                  <label key={lvl} className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border hover:border-blue-400">
                                      <input type="checkbox" checked={editingCourse.permissions?.levels.includes(lvl)} onChange={() => toggleCoursePermission('levels', lvl)} />
                                      <span className="text-sm">{lvl}</span>
                                  </label>
                              ))}
                          </div>
                      </div>

                  </div>
                  <div className="p-6 border-t flex justify-end"><button onClick={handleSaveCourse} className="bg-blue-600 text-white px-6 py-2 rounded-xl">保存</button></div>
              </div>
          </div>
      )}

      {/* 4. Benefit Modal */}
      {isBenefitModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
                  <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold">商品编辑</h3><button onClick={() => setIsBenefitModalOpen(false)}><X size={20} /></button></div>
                  <div className="p-6 space-y-4">
                      <div><label className="block mb-1 font-bold">商品名称</label><input value={editingBenefit.title||''} onChange={e=>setEditingBenefit({...editingBenefit, title:e.target.value})} className="w-full border p-2 rounded-lg"/></div>
                      <div className="flex gap-4">
                          <div className="flex-1"><label className="block mb-1 font-bold">积分</label><input type="number" value={editingBenefit.points||''} onChange={e=>setEditingBenefit({...editingBenefit, points:Number(e.target.value)})} className="w-full border p-2 rounded-lg"/></div>
                          <div className="flex-1"><label className="block mb-1 font-bold">现金价(元)</label><input type="number" value={editingBenefit.price||''} onChange={e=>setEditingBenefit({...editingBenefit, price:Number(e.target.value)})} className="w-full border p-2 rounded-lg"/></div>
                      </div>
                      <div><label className="block mb-1 font-bold">图片URL</label><input value={editingBenefit.imageUrl||''} onChange={e=>setEditingBenefit({...editingBenefit, imageUrl:e.target.value})} className="w-full border p-2 rounded-lg"/></div>
                  </div>
                  <div className="p-6 border-t flex justify-end"><button onClick={handleSaveBenefit} className="bg-blue-600 text-white px-6 py-2 rounded-xl">保存</button></div>
              </div>
          </div>
      )}

      {/* 5. Download Modal */}
      {isDownloadModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
                  <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold">资料上传</h3><button onClick={() => setIsDownloadModalOpen(false)}><X size={20} /></button></div>
                  <div className="p-6 space-y-4">
                      <div><label className="block mb-1 font-bold">标题</label><input value={editingDownload.title||''} onChange={e=>setEditingDownload({...editingDownload, title:e.target.value})} className="w-full border p-2 rounded-lg"/></div>
                      <div><label className="block mb-1 font-bold">分类</label><select value={editingDownload.category||'全员资料'} onChange={e=>setEditingDownload({...editingDownload, category:e.target.value})} className="w-full border p-2 rounded-lg">{DOWNLOAD_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
                      <div><label className="block mb-1 font-bold">文件名</label><input value={editingDownload.fileName||''} onChange={e=>setEditingDownload({...editingDownload, fileName:e.target.value})} className="w-full border p-2 rounded-lg"/></div>
                      <div className="flex items-center gap-2"><input type="checkbox" checked={editingDownload.isPinned||false} onChange={e=>setEditingDownload({...editingDownload, isPinned:e.target.checked})} /><label>置顶</label></div>
                  </div>
                  <div className="p-6 border-t flex justify-end"><button onClick={handleSaveDownload} className="bg-blue-600 text-white px-6 py-2 rounded-xl">保存</button></div>
              </div>
          </div>
      )}

      {/* 6. Rule Modal */}
      {isRuleModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
                  <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold">规则编辑</h3><button onClick={() => setIsRuleModalOpen(false)}><X size={20} /></button></div>
                  <div className="p-6 space-y-4">
                      <div><label className="block mb-1 font-bold">标题</label><input value={editingRule.title||''} onChange={e=>setEditingRule({...editingRule, title:e.target.value})} className="w-full border p-2 rounded-lg"/></div>
                      <div><label className="block mb-1 font-bold">分类</label><select value={editingRule.category||'全员'} onChange={e=>setEditingRule({...editingRule, category:e.target.value})} className="w-full border p-2 rounded-lg"><option>全员</option><option>技术</option><option>客服</option><option>运营</option><option>派单</option></select></div>
                      <div><label className="block mb-1 font-bold">内容</label><textarea value={editingRule.content||''} onChange={e=>setEditingRule({...editingRule, content:e.target.value})} className="w-full border p-2 rounded-lg h-24"/></div>
                  </div>
                  <div className="p-6 border-t flex justify-end"><button onClick={handleSaveRule} className="bg-blue-600 text-white px-6 py-2 rounded-xl">保存</button></div>
              </div>
          </div>
      )}

      {/* 7. Adjust Points Modal */}
      {isAdjustModalOpen && selectedMember && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col p-6 text-center">
                  <h3 className="text-xl font-bold mb-4">调整 {selectedMember.name} 的积分</h3>
                  <div className="flex justify-center gap-4 mb-6">
                      <button onClick={()=>setAdjustType('add')} className={`px-4 py-2 rounded-lg font-bold ${adjustType==='add'?'bg-green-100 text-green-600':'bg-slate-100 text-slate-400'}`}>奖励 (+)</button>
                      <button onClick={()=>setAdjustType('sub')} className={`px-4 py-2 rounded-lg font-bold ${adjustType==='sub'?'bg-red-100 text-red-600':'bg-slate-100 text-slate-400'}`}>扣除 (-)</button>
                  </div>
                  <input type="number" value={adjustAmount} onChange={e=>setAdjustAmount(Number(e.target.value))} className="w-full border p-3 rounded-xl text-center text-2xl font-bold mb-6" placeholder="0" />
                  <div className="flex gap-3">
                      <button onClick={()=>setIsAdjustModalOpen(false)} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold">取消</button>
                      <button onClick={handleConfirmAdjust} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">确认</button>
                  </div>
              </div>
          </div>
      )}

      {/* 8. Rank Evaluation Modal (Dynamic based on standards) */}
      {evalModalOpen && evalTarget && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col p-6 max-h-[90vh]">
                   <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                       <div>
                           <h3 className="text-xl font-bold">评估: {evalTarget.name}</h3>
                           <p className="text-sm text-slate-500">目标: {evalTarget.rankTrack}{(evalTarget.rankLevel||0)+1}</p>
                       </div>
                       <button onClick={()=>setEvalModalOpen(false)}><X size={20} /></button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                       {Object.keys(evalScores).length > 0 ? (
                           Object.keys(evalScores).map(dim => (
                               <div key={dim}>
                                   <div className="flex justify-between mb-2">
                                       <label className="font-bold text-slate-700">{dim}</label>
                                       <span className="font-mono font-bold text-blue-600">{evalScores[dim]}分</span>
                                   </div>
                                   <input 
                                     type="range" min="0" max="100" 
                                     value={evalScores[dim]} 
                                     onChange={e => setEvalScores({...evalScores, [dim]: Number(e.target.value)})}
                                     className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                   />
                               </div>
                           ))
                       ) : (
                           <div className="text-center py-10 text-slate-400">
                               <p>未找到该层级的评审标准配置。</p>
                               <p className="text-xs mt-2">请先在“标准配置”中添加维度。</p>
                           </div>
                       )}
                   </div>
                   
                   <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                      <button onClick={()=>setEvalModalOpen(false)} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold">取消</button>
                      <button onClick={handleSubmitEval} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">提交结果</button>
                  </div>
               </div>
          </div>
      )}

    </div>
  );
};