import { Employee, LeaderboardEntry, Notification, ServiceItem, Course, BenefitItem, DownloadItem, Gift, PointRule, RankStandard, FundRecord } from './types.ts';

export const CURRENT_USER: Employee = {
  id: 'u1',
  name: '李明哲',
  avatar: 'https://picsum.photos/150/150?random=1',
  position: '高级产品经理',
  department: '产品部',
  level: 'F7',
  tenure: '3 年 5 个月',
  nextLevelProgress: 95, // Close to promotion for demo
  totalPoints: 5000,
  medals: ['🚀', '⭐', '🔥', '🏆'],
  role: 'supervisor', // He is a supervisor
  superiorId: 'u_boss', // Managed by boss
  rankTrack: 'F',
  rankLevel: 7
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: '关于 2025 年度秋季职级晋升评审的通知',
    date: '2025-11-19',
    type: 'promotion',
    isPinned: true,
    content: '各位同事：\n\n根据公司年度人才发展规划，2025年度秋季职级晋升评审工作即将启动。本次评审旨在选拔优秀人才，激励员工持续成长。\n\n一、评审范围\n入职满6个月且符合晋升条件的正式员工。\n\n二、时间安排\n1. 个人申报：11月20日 - 11月25日\n2. 部门初审：11月26日 - 11月30日\n3. 述职评审：12月5日 - 12月10日\n\n请大家提前准备述职材料，祝各位取得好成绩！',
    readCount: 1205,
    publisher: '人力资源部',
    expiryDate: '2025-12-10'
  },
  {
    id: 'n2',
    title: '年度财务报销流程更新说明',
    date: '2025-11-18',
    type: 'general',
    content: '为进一步规范财务报销流程，提高审批效率，财务部对报销系统进行了升级。新的报销流程将于下月1日正式上线。主要变动包括：取消纸质发票粘贴环节，全面推行电子发票归档...',
    readCount: 850,
    publisher: '财务部',
    expiryDate: '2026-01-01'
  },
  {
    id: 'n3',
    title: '关于开展“技术创新月”活动的预告',
    date: '2025-11-15',
    type: 'general',
    content: '技术是推动公司发展的核心动力。为营造浓厚的技术氛围，鼓励全员创新，公司决定将12月定为“技术创新月”。届时将举办黑客马拉松、技术沙龙分享等系列活动，欢迎大家踊跃报名。',
    readCount: 620,
    publisher: '技术委员会',
    expiryDate: '2025-11-20' // Expired example
  }
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: '企业文化与价值观宣导',
    category: '企业文化',
    imageUrl: 'https://picsum.photos/400/300?random=101',
    permissions: { departments: ['all'], levels: ['all'] }
  },
  {
    id: 'c2',
    title: '高效沟通技巧进阶',
    category: '通用技能',
    imageUrl: 'https://picsum.photos/400/300?random=102',
    permissions: { departments: ['all'], levels: ['P5', 'P6', 'P7', 'P8', 'F5','F6','F7','F8'] }
  },
  {
    id: 'c3',
    title: '高级Java并发编程实战',
    category: '专业技能',
    imageUrl: 'https://picsum.photos/400/300?random=103',
    permissions: { departments: ['技术部'], levels: ['P6', 'P7', 'P8', 'F6', 'F7', 'F8'] }
  },
  {
    id: 'c4',
    title: '客户投诉处理标准化流程',
    category: '专业技能',
    imageUrl: 'https://picsum.photos/400/300?random=104',
    permissions: { departments: ['客服部', '运营部'], levels: ['all'] }
  },
  {
    id: 'c5',
    title: '2025年战略规划解读',
    category: '企业文化',
    imageUrl: 'https://picsum.photos/400/300?random=105',
    permissions: { departments: ['all'], levels: ['P7', 'P8', 'P9', 'F7', 'F8', 'F9'] }
  }
];

// Updated Leaderboard Data with Rank Info and Hierarchy
// Structure: u_boss (Manager) -> u1, u2 (Supervisors) -> u4, u5, u6 (Members)
export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { id: 'u_boss', rank: 0, name: '大老板', avatar: 'https://picsum.photos/100/100?random=99', score: 12000, department: '管理部', trend: 'same', role: 'manager', rankTrack: 'Y', rankLevel: 9 },
  { id: 'u2', rank: 1, name: '张伟', avatar: 'https://picsum.photos/100/100?random=2', score: 9850, department: '技术部', trend: 'up', role: 'supervisor', superiorId: 'u_boss', rankTrack: 'F', rankLevel: 7 },
  { id: 'u3', rank: 2, name: '王芳', avatar: 'https://picsum.photos/100/100?random=3', score: 9720, department: '运营部', trend: 'same', role: 'supervisor', superiorId: 'u_boss', rankTrack: 'Y', rankLevel: 6 },
  { id: 'u4', rank: 3, name: '李娜', avatar: 'https://picsum.photos/100/100?random=4', score: 9540, department: '客服部', trend: 'up', role: 'member', superiorId: 'u3', rankTrack: 'G', rankLevel: 4 },
  { id: 'u5', rank: 4, name: '刘强', avatar: 'https://picsum.photos/100/100?random=5', score: 9300, department: '技术部', trend: 'down', role: 'member', superiorId: 'u2', rankTrack: 'F', rankLevel: 5 },
  { id: 'u6', rank: 5, name: '陈静', avatar: 'https://picsum.photos/100/100?random=6', score: 9150, department: '产品部', trend: 'up', role: 'member', superiorId: 'u1', rankTrack: 'F', rankLevel: 6 }, // u1 is Current User
  { id: 'u7', rank: 6, name: '杨洋', avatar: 'https://picsum.photos/100/100?random=7', score: 8900, department: '运营部', trend: 'down', role: 'member', superiorId: 'u3', rankTrack: 'Y', rankLevel: 5 },
  { id: 'u8', rank: 7, name: '赵云', avatar: 'https://picsum.photos/100/100?random=8', score: 8850, department: '技术部', trend: 'same', role: 'member', superiorId: 'u2', rankTrack: 'F', rankLevel: 5 },
  { id: 'u1', rank: 15, name: '李明哲', avatar: 'https://picsum.photos/150/150?random=1', score: 5000, department: '产品部', trend: 'same', role: 'supervisor', superiorId: 'u_boss', rankTrack: 'F', rankLevel: 7 }, 
];

export const SERVICE_ITEMS: ServiceItem[] = [
  { id: '1', title: '待处理问题', iconName: 'AlertCircle', colorClass: 'bg-red-50 text-red-600', count: 12 },
  { id: '2', title: '员工内部福利', iconName: 'Gift', colorClass: 'bg-pink-50 text-pink-600' },
  { id: '3', title: '团队排名', iconName: 'Trophy', colorClass: 'bg-blue-50 text-blue-600' },
  { id: '4', title: '学习中心', iconName: 'BookOpen', colorClass: 'bg-green-50 text-green-600' },
  { id: '5', title: '财务管理', iconName: 'PieChart', colorClass: 'bg-yellow-50 text-yellow-600' },
  { id: '6', title: '资料下载', iconName: 'Download', colorClass: 'bg-indigo-50 text-indigo-600' },
  { id: '7', title: '乐捐收支公示', iconName: 'PiggyBank', colorClass: 'bg-emerald-50 text-emerald-600' },
  { id: '8', title: '建议&投诉&举报', iconName: 'MessageSquarePlus', colorClass: 'bg-purple-50 text-purple-600' },
];

export const INITIAL_BENEFITS: BenefitItem[] = [
    { id: 101, title: '空调清洗员工价', points: 0, price: 69, imageUrl: 'https://picsum.photos/300/300?random=101' },
    { id: 102, title: '油烟机清洗员工价', points: 0, price: 89, imageUrl: 'https://picsum.photos/300/300?random=102' },
    { id: 103, title: '洗衣机清洗员工价', points: 0, price: 59, imageUrl: 'https://picsum.photos/300/300?random=103' },
    { id: 104, title: '滚筒洗衣机深度洗', points: 10, imageUrl: 'https://picsum.photos/300/300?random=201' },
    { id: 105, title: '家用工具箱套装', points: 2000, imageUrl: 'https://picsum.photos/300/300?random=202' },
];

export const INITIAL_DOWNLOADS: DownloadItem[] = [
    { 
        id: 'd1', 
        title: '内部补贴申请资料', 
        date: '2025-11-18', 
        content: '包含最新的交通补贴、通讯补贴申请表格及填写规范。请仔细阅读后填写，每月25日前提交至行政部。', 
        category: '全员资料',
        isPinned: true,
        fileName: '2025补贴申请表.pdf'
    },
    { 
        id: 'd2', 
        title: 'Q4季度技术考核大纲', 
        date: '2025-11-10', 
        content: '第四季度技术人员技能考核重点范围，包含新设备调试流程及常见故障排查手册。', 
        category: '技术',
        fileName: 'Q4考核大纲_V2.docx'
    },
    {
        id: 'd3', 
        title: '客户服务话术规范手册(2025版)', 
        date: '2025-10-25', 
        content: '更新了针对投诉处理的标准回答话术，请客服部全员熟读背诵。', 
        category: '客服',
        fileName: '客服话术2025.pdf'
    }
];

export const AVAILABLE_GIFTS: Gift[] = [
    { id: 'g1', type: 'lollipop', name: '棒棒糖', points: 10, icon: '🍭' },
    { id: 'g2', type: 'cake', name: '生日蛋糕', points: 50, icon: '🎂' },
    { id: 'g3', type: 'car', name: '超级跑车', points: 500, icon: '🏎️' },
    { id: 'g4', type: 'yacht', name: '豪华游轮', points: 1000, icon: '🚢' },
    { id: 'g5', type: 'rocket', name: '太空火箭', points: 5000, icon: '🚀' },
];

export const INITIAL_POINT_RULES: PointRule[] = [
    { id: 1, category: '全员', title: '基础积分规则', content: '每日签到 +5分；连续签到7天额外 +20分；按时提交周报 +10分/次；参加公司晨会 +2分/次。' },
    { id: 2, category: '全员', title: '福利兑换规则', content: '积分可用于“员工福利”商城兑换商品或服务；积分每自然年年底清零一次（保留最后3个月积分）。' },
    { id: 3, category: '技术', title: '上门服务规范分', content: '着装规范 +5分/天；工具摆放整齐 +5分/次；收到客户投诉 -50分/次；好评 +50分/次。' },
    { id: 4, category: '技术', title: '技术等级分', content: '考取初级证书 +100分；中级证书 +300分；高级证书 +500分。' },
    { id: 5, category: '派单', title: '调度响应分', content: '3分钟内响应工单 +2分/单；零差错调度月度奖励 +200分。' },
    { id: 6, category: '客服', title: '话术规范', content: '全天无违规用语 +10分；客户满意度100%月度奖 +100分。' },
    { id: 7, category: '运营', title: '活动策划', content: '策划活动效果达标 +50分；创新方案被采纳 +80分。' }
];

// --- Initial Rank Standards ---
export const INITIAL_RANK_STANDARDS: RankStandard[] = [
    // F (Professional) Track Example
    { id: 'rs_f8', track: 'F', level: 8, dimensions: [
        { name: '专业深度', weight: 40, description: '领域内的技术权威性' },
        { name: '技术广度', weight: 20, description: '跨领域技术理解能力' },
        { name: '业务贡献', weight: 30, description: '技术对业务的实际推动' },
        { name: '人才培养', weight: 10, description: '导师带徒情况' }
    ]},
    { id: 'rs_f9', track: 'F', level: 9, dimensions: [
        { name: '行业影响力', weight: 40, description: '外部技术大会演讲等' },
        { name: '战略规划', weight: 30, description: '技术战略制定' },
        { name: '组织建设', weight: 30, description: '技术团队梯队建设' }
    ]},
     // Y (Management) Track Example
    { id: 'rs_y7', track: 'Y', level: 7, dimensions: [
        { name: '团队绩效', weight: 50, description: 'KPI完成率' },
        { name: '团队建设', weight: 30, description: '人员招聘与留存' },
        { name: '跨部门协作', weight: 20, description: '资源协调能力' }
    ]},
    // G (General) Track Example
    { id: 'rs_g5', track: 'G', level: 5, dimensions: [
        { name: '执行力', weight: 60, description: '任务按时交付率' },
        { name: '通用技能', weight: 20, description: '办公软件及沟通能力' },
        { name: '企业文化', weight: 20, description: '价值观符合度' }
    ]}
];

// --- Updated Fund Records with Multi-Month Data and Images ---
export const INITIAL_FUNDS: FundRecord[] = [
    // Income
    { id: 'inc1', type: 'income', department: '技术部', month: '1月', amount: 500 },
    { id: 'inc2', type: 'income', department: '技术部', month: '2月', amount: 450 },
    { id: 'inc3', type: 'income', department: '客服部', month: '1月', amount: 300 },
    { id: 'inc4', type: 'income', department: '客服部', month: '2月', amount: 320 },
    { id: 'inc5', type: 'income', department: '运营部', month: '1月', amount: 200 },
    { id: 'inc6', type: 'income', department: '运营部', month: '2月', amount: 210 },
    { id: 'inc7', type: 'income', department: '产品部', month: '1月', amount: 150 },
    { id: 'inc8', type: 'income', department: '产品部', month: '2月', amount: 160 },
    // Expenses
    { 
        id: 'exp1', type: 'expense', expenseType: '活动支出', project: '下午茶', month: '1月', neededAmount: 800, amount: 800,
        invoiceImages: ['https://picsum.photos/300/400?random=901'],
        productImages: ['https://picsum.photos/300/300?random=902']
    },
    { 
        id: 'exp2', type: 'expense', expenseType: '活动支出', project: '下午茶', month: '2月', neededAmount: 800, amount: 750,
        invoiceImages: ['https://picsum.photos/300/400?random=903'],
        productImages: ['https://picsum.photos/300/300?random=904']
    },
    { 
        id: 'exp3', type: 'expense', expenseType: '公益捐赠', project: '流浪动物救助', month: '1月', neededAmount: 500, amount: 500,
        invoiceImages: ['https://picsum.photos/300/400?random=905'],
        productImages: ['https://picsum.photos/300/300?random=906', 'https://picsum.photos/300/300?random=907']
    },
    { 
        id: 'exp4', type: 'expense', expenseType: '公益捐赠', project: '流浪动物救助', month: '2月', neededAmount: 500, amount: 500,
        invoiceImages: ['https://picsum.photos/300/400?random=908'],
        productImages: ['https://picsum.photos/300/300?random=909']
    },
];