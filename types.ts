
export enum SessionMode {
  DEFAULT = 'default',
  CUSTOM = 'custom',
}

export type TimePattern = 'pomodoro' | 'deep-work' | 'custom';

export type View = 'dashboard' | 'start-focus' | 'statistics' | 'tips-tricks' | 'notes';

export interface SessionSettings {
  targetMinutes: number;
  timePattern: TimePattern;
  focusMinutes: number;
  breakMinutes: number;
}

export interface SessionRecord {
  id: string;
  date: string; // ISO string
  durationMinutes: number;
  targetMet: boolean;
  targetDuration?: number; // Added for T8
}

export interface UserProgress {
  sessions: SessionRecord[];
  totalFocusMinutes: number;
  dailyTargetMinutes?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Stored for mock auth, not passed in props
  joinDate: string; // ISO String
}

export interface Note {
  id: string;
  content: string;
  createdAt: string; // ISO String
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  totalMinutes: number;
  isCurrentUser: boolean;
}

export interface UserTip {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  imageUrl?: string;
  timestamp: string; // ISO String
  likes: number;
}
