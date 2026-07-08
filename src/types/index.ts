export interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  theme: string;
  created_at: string;
  updated_at: string;
}

export interface SourceInfo {
  url: string;
  reliability: number;
  description: string;
}

export interface CheckResult {
  id: string;
  content: string;
  content_type: 'text' | 'url' | 'image' | 'document';
  accuracy_score: number;
  source_reliability: number;
  verdict: 'true' | 'false' | 'unknown';
  confidence: number;
  analysis: string;
  sources: SourceInfo[];
  created_at: string;
  user_id?: string;
  imageData?: string;
}

export interface CheckRequest {
  content: string;
  type: 'text' | 'url' | 'image' | 'document';
  imageData?: string;
}

export type ThemeName = 'blue' | 'green' | 'purple' | 'orange' | 'pink';

export interface ThemeConfig {
  name: ThemeName;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
}

export interface ImageAnalysisDetails {
  formatValid: boolean;
  formatType: string;
  sizeValid: boolean;
  width: number;
  height: number;
  fileSize: number;
  metadataValid: boolean;
  hasExif: boolean;
  exifData?: Record<string, any>;
  hasWatermark: boolean;
  watermarkInfo?: string;
  hasDigitalSignature: boolean;
  isCompressed: boolean;
  compressionRatio?: number;
  hasEditingTraces: boolean;
  editingTraces?: string[];
  potentialIssues: string[];
  scoreImpact: number;
}

export const themes: Record<ThemeName, ThemeConfig> = {
  blue: {
    name: 'blue',
    primary: '#1e40af',
    primaryLight: '#3b82f6',
    primaryDark: '#1e3a8a',
    accent: '#06b6d4',
    success: '#16a34a',
    warning: '#ca8a04',
    danger: '#dc2626',
  },
  green: {
    name: 'green',
    primary: '#15803d',
    primaryLight: '#22c55e',
    primaryDark: '#166534',
    accent: '#84cc16',
    success: '#16a34a',
    warning: '#ca8a04',
    danger: '#dc2626',
  },
  purple: {
    name: 'purple',
    primary: '#7e22ce',
    primaryLight: '#a855f7',
    primaryDark: '#6b21a8',
    accent: '#ec4899',
    success: '#16a34a',
    warning: '#ca8a04',
    danger: '#dc2626',
  },
  orange: {
    name: 'orange',
    primary: '#c2410c',
    primaryLight: '#f97316',
    primaryDark: '#9a3412',
    accent: '#fb923c',
    success: '#16a34a',
    warning: '#ca8a04',
    danger: '#dc2626',
  },
  pink: {
    name: 'pink',
    primary: '#be185d',
    primaryLight: '#ec4899',
    primaryDark: '#9d174d',
    accent: '#f472b6',
    success: '#16a34a',
    warning: '#ca8a04',
    danger: '#dc2626',
  },
};

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface AppState {
  theme: ThemeName;
  checkResults: CheckResult[];
  currentResult: CheckResult | null;
  isChecking: boolean;
}