export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'educator' | 'student';
  avatar?: string;
  joinDate: string;
  streak: number;
  totalScans: number;
  friends: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  autoSync: boolean;
  language: string;
  privacy: PrivacySettings;
}

export interface PrivacySettings {
  shareScans: boolean;
  allowFriendRequests: boolean;
  showActivity: boolean;
}

export interface Book {
  id: string;
  title: string;
  author?: string;
  scanDate: string;
  userId: string;
  pages: BookPage[];
  totalPages: number;
  tags: string[];
  summary?: string;
  concepts: string[];
  isPublic: boolean;
  thumbnail?: string;
}

export interface BookPage {
  id: string;
  pageNumber: number;
  imageUrl: string;
  pdfUrl?: string;
  ocrText: string;
  aiEnhancements: AIEnhancements;
  annotations: Annotation[];
}

export interface AIEnhancements {
  summary: string;
  keyPoints: string[];
  relatedVideos: VideoLink[];
  concepts: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface VideoLink {
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
}

export interface Annotation {
  id: string;
  type: 'highlight' | 'note' | 'bookmark';
  content: string;
  position: { x: number; y: number; width: number; height: number };
  color: string;
  userId: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'scan' | 'annotation' | 'share' | 'achievement';
  description: string;
  timestamp: string;
  data?: any;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}