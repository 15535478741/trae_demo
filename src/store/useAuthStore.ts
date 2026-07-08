import { create } from 'zustand';
import type { User } from '@/types';

interface StoredUser {
  id: string;
  email: string;
  password: string;
  username: string | null;
  avatar_url: string | null;
  theme: string;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'fact_check_users';
const CURRENT_USER_KEY = 'fact_check_current_user';

function getStoredUsers(): StoredUser[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getCurrentUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

function setCurrentUserId(userId: string | null) {
  if (userId) {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getStoredUsers();
    const found = users.find(u => u.email === email && u.password === password);
    
    if (!found) {
      set({ loading: false, error: '邮箱或密码错误' });
      return;
    }
    
    const user: User = {
      id: found.id,
      email: found.email,
      username: found.username,
      avatar_url: found.avatar_url,
      theme: found.theme,
      created_at: found.created_at,
      updated_at: found.updated_at,
    };
    
    setCurrentUserId(found.id);
    set({ user, isAuthenticated: true, loading: false });
  },
  
  signUp: async (email, password) => {
    set({ loading: true, error: null });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getStoredUsers();
    const exists = users.find(u => u.email === email);
    
    if (exists) {
      set({ loading: false, error: '该邮箱已被注册' });
      return;
    }
    
    const now = new Date().toISOString();
    const newUser: StoredUser = {
      id: generateId(),
      email,
      password,
      username: null,
      avatar_url: null,
      theme: 'blue',
      created_at: now,
      updated_at: now,
    };
    
    users.push(newUser);
    saveUsers(users);
    
    const user: User = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      avatar_url: newUser.avatar_url,
      theme: newUser.theme,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    };
    
    setCurrentUserId(newUser.id);
    set({ user, isAuthenticated: true, loading: false });
  },
  
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setCurrentUserId(null);
    set({ user: null, isAuthenticated: false, loading: false });
  },
  
  updatePassword: async (newPassword) => {
    set({ loading: true, error: null });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userId = getCurrentUserId();
    if (!userId) {
      set({ loading: false, error: '请先登录' });
      return;
    }
    
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) {
      set({ loading: false, error: '用户不存在' });
      return;
    }
    
    users[index].password = newPassword;
    users[index].updated_at = new Date().toISOString();
    saveUsers(users);
    
    set({ loading: false });
  },
  
  checkAuth: async () => {
    set({ loading: true });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userId = getCurrentUserId();
    if (!userId) {
      set({ user: null, isAuthenticated: false, loading: false });
      return;
    }
    
    const users = getStoredUsers();
    const found = users.find(u => u.id === userId);
    
    if (!found) {
      setCurrentUserId(null);
      set({ user: null, isAuthenticated: false, loading: false });
      return;
    }
    
    const user: User = {
      id: found.id,
      email: found.email,
      username: found.username,
      avatar_url: found.avatar_url,
      theme: found.theme,
      created_at: found.created_at,
      updated_at: found.updated_at,
    };
    
    set({ user, isAuthenticated: true, loading: false });
  },
  
  clearError: () => set({ error: null }),
}));