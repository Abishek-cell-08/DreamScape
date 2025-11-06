
import type { Dispatch, SetStateAction } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface DreamInsights {
  summary: string;
  themes: string[];
  emotions: { [key: string]: number };
  entities: string[];
  lucidity: number;
}

export interface Dream {
  id: number;
  text: string;
  date: string;
  privacy: 'private' | 'public' | 'anonymous';
  image?: string;
  insights?: DreamInsights | null;
}

export interface TrendsData {
  emotions: { name: string; value: number }[];
  lucidityTrend: { date: string; lucidity: number }[];
  themes: { name: string; count: number }[];
}

export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export interface AppContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  isDark: boolean;
  setIsDark: Dispatch<SetStateAction<boolean>>;
  toast: ToastState;
  setToast: Dispatch<SetStateAction<ToastState>>;
  addDream: (dream: Omit<Dream, 'id' | 'insights' | 'image'>) => Promise<Dream>;
  dreams: Dream[];
}
