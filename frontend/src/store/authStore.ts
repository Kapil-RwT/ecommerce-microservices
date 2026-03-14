import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  return {
    token: storedToken,
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken,

    login: (token: string, user: User) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ token: null, user: null, isAuthenticated: false });
    },
  };
});
