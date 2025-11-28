export interface Employee {
  id: string;
  name: string;
  avatar: string;
  position: string;
  department: string; 
  level: string; // e.g., "F7"
  tenure: string; 
  nextLevelProgress: number; // 0-100
  totalPoints: number;
  medals: string[];
  // New fields for Rank System
  role: 'manager' | 'supervisor' | 'member';
  superiorId?: string;
  rankTrack: 'F' | 'Y' | 'G'; // F:专业, Y:管理, G:通用
  rankLevel: number; // 1-9
}

export interface Notification {
  id: string;
  title: string;
  date: string;
  type: 'promotion' | 'general' | 'urgent';
  content?: string; 
  readCount?: number;
  isPinned?: boolean;
  publisher?: string; // New: 发布人
  expiryDate?: string; // New: 有效期 (YYYY-MM-DD)
}

export interface LeaderboardEntry {
  id: string; 
  rank: number;
  name: string;
  avatar: string;
  score: number;
  department: string; 
  trend?: 'up' | 'down' | 'same';
  // Sync with Employee for mock purposes
  role?: 'manager' | 'supervisor' | 'member';
  superiorId?: string;
  rankTrack?: 'F' | 'Y' | 'G';
  rankLevel?: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  iconName: string;
  colorClass: string;
  count?: number;
}

export interface RedemptionRecord {
  id: string;
  title: string;
  points: number;
  date: string;
  imageUrl: string;
  status: 'unused' | 'used';
}

export interface Course {
  id: string;
  title: string;
  category: '企业文化' | '通用技能' | '专业技能';
  imageUrl: string;
  permissions: {
    departments: string[]; 
    levels: string[]; 
  };
}

export interface BenefitItem {
  id: string | number;
  title: string;
  points: number; 
  price?: number; 
  imageUrl: string;
  description?: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  content: string; 
  date: string;
  category: string; 
  isPinned?: boolean;
  fileName?: string; 
}

export type GiftType = 'lollipop' | 'cake' | 'car' | 'yacht' | 'rocket';

export interface Gift {
  id: string;
  type: GiftType;
  name: string;
  points: number;
  icon: string; 
}

export interface GiftEvent {
  id: string;
  senderName: string;
  message: string;
  gift: Gift;
}

export interface GiftHistoryItem {
  id: string;
  type: 'sent' | 'received';
  targetUser: string;
  giftName: string;
  giftIcon: string;
  points: number;
  date: string;
}

export interface PointRule {
  id: string | number;
  category: string; 
  title: string;
  content: string;
}

// --- New Types for Rank Management ---

export interface RankDimension {
  name: string;
  weight: number; // Percentage 0-100
  description?: string;
}

export interface RankStandard {
  id: string;
  track: 'F' | 'Y' | 'G';
  level: number; // Target Level (e.g. Standard for F8)
  dimensions: RankDimension[];
}

// --- New Types for Fund & Feedback ---

export interface FundRecord {
    id: string;
    type: 'income' | 'expense';
    month: string; // "1月", "2月"...
    amount: number;
    // Income specific
    department?: string;
    // Expense specific
    expenseType?: string; // Big Category
    project?: string; // Small Item
    neededAmount?: number;
    // Proofs
    invoiceImages?: string[];
    productImages?: string[];
}

export interface Feedback {
    id: string;
    type: 'suggestion' | 'complaint' | 'report'; // Added 'report'
    date: string;
    title: string;
    content: string;
    status: 'pending' | 'read';
    name?: string; 
    isAnonymous: boolean; // Explicit anonymous flag
}