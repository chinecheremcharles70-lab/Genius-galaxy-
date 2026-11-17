export type AgeGroup = '3-5' | '6-8';

export type WorldId =
  | 'letter-land'
  | 'number-safari'
  | 'colour-shapes'
  | 'animal-explorer'
  | 'puzzle-planet';

export type ScreenType =
  | 'welcome'
  | 'home'
  | 'world-select'
  | 'game-play'
  | 'rewards'
  | 'parent-gate'
  | 'parent-dashboard'
  | 'settings';

export interface GameDefinition {
  id: string;
  worldId: WorldId;
  title: string;
  tagline: string;
  skills: string[];
  minAge: AgeGroup;
  icon: string;
  totalLevels: number;
  isPremiumOnly?: boolean;
}

export interface WorldDefinition {
  id: WorldId;
  name: string;
  themeColor: string;
  secondaryColor: string;
  bgGradient: string;
  description: string;
  bannerImage: string;
  mascotGreeting: string;
  learningFocus: string[];
  games: GameDefinition[];
}

export interface LevelProgress {
  stars: number; // 0-3
  completed: boolean;
  highScore: number;
  lastPlayed?: string;
}

export interface UserProgress {
  totalStars: number;
  currentStreak: number;
  sessionMinutes: number;
  todayMinutes: number;
  lastActiveDate: string;
  levelScores: Record<string, LevelProgress>; // key: `${worldId}_${gameId}_${level}`
  unlockedBadges: string[];
  unlockedMascots: string[];
  isPremiumUnlocked: boolean;
  amazonReceipts: AmazonReceipt[];
}

export interface AmazonReceipt {
  receiptId: string;
  sku: string;
  itemType: 'SUBSCRIPTION' | 'ENTITLED';
  purchaseDate: string;
  status: 'FULFILLED' | 'ACTIVE';
}

export interface ParentSettings {
  childName: string;
  ageGroup: AgeGroup;
  dailyTimeLimitMinutes: number;
  soundEffectsVolume: number; // 0 - 100
  musicVolume: number; // 0 - 100
  voiceGuidance: boolean;
  breakReminders: boolean;
  tabletModel: 'fire-hd-10' | 'fire-hd-8' | 'responsive';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'literacy' | 'math' | 'creativity' | 'nature' | 'puzzle' | 'dedication';
  requirement: string;
  unlockedAt?: string;
}
