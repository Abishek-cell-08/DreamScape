import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import type { AppContextType, Dream, ToastState, User, DreamInsights } from '../types';
import { api } from '../services/api';

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook to use context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// ✅ Default insights structure
const defaultInsights: DreamInsights = {
  summary: '',
  themes: [],
  emotions: {},
  entities: [],
  lucidity: 0,
};

// Context Provider Component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
  });
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoadingDreams, setIsLoadingDreams] = useState<boolean>(true);

  // ✅ Safely normalize insight data (handles JSON string or missing)
  const normalizeInsights = (rawInsights: any): DreamInsights => {
    if (!rawInsights) return defaultInsights;

    let parsed = rawInsights;
    try {
      if (typeof rawInsights === 'string') {
        parsed = JSON.parse(rawInsights);
      }
    } catch (e) {
      console.warn('Failed to parse insights JSON:', e);
      parsed = {};
    }

    return {
      ...defaultInsights,
      ...parsed,
      emotions: parsed.emotions || {},
    };
  };

  // ✅ Fetch all dreams (with parsing)
  const fetchDreams = useCallback(async () => {
    if (!token) return;

    setIsLoadingDreams(true);
    try {
      const initialDreams = await api.getDreams(token);

      const safeDreams = initialDreams.map((dream: Dream) => ({
        ...dream,
        insights: normalizeInsights(dream.insights),
      }));

      setDreams(safeDreams);
    } catch (error) {
      console.error('Failed to fetch dreams:', error);
      setToast({
        show: true,
        message: 'Could not load your dreams.',
        type: 'error',
      });
    } finally {
      setIsLoadingDreams(false);
    }
  }, [token]);

  // ✅ Run fetchDreams when token changes
  useEffect(() => {
    fetchDreams();
  }, [fetchDreams]);

  // ✅ Add new dream (also normalize insights)
  const addDream = useCallback(
    async (dreamData: Omit<Dream, 'id' | 'insights' | 'image'>): Promise<Dream> => {
      if (!token) throw new Error('No token found');

      const newDream = await api.addDream(dreamData, token);

      const safeDream: Dream = {
        ...newDream,
        insights: normalizeInsights(newDream.insights),
      };

      setDreams((prevDreams) => [safeDream, ...prevDreams]);
      return safeDream;
    },
    [token]
  );

  const value: AppContextType = {
    user,
    setUser,
    token,
    setToken,
    isDark,
    setIsDark,
    toast,
    setToast,
    dreams,
    addDream,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
