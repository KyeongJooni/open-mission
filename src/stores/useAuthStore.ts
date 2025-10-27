import { create } from 'zustand';

import type * as UserTypes from '@/api/user/userTypes';
import type * as AuthTypes from '@/api/auth/authTypes';
import { login as loginApi } from '@/api/auth/authApi';
import { getUserInfo } from '@/api/user/userApi';

type User = UserTypes.UserData;

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  hasChecked: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  login: (data: AuthTypes.LoginRequest) => Promise<void>;
  logout: () => void;
  checkLoginStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  isLoading: true,
  hasChecked: false,
  user: null,

  setUser: user => set({ user, isLoggedIn: Boolean(user) }),

  login: async (data: AuthTypes.LoginRequest) => {
    set({ isLoading: true });

    try {
      await loginApi(data);

      const userResponse = await getUserInfo();

      set({
        isLoggedIn: true,
        user: userResponse.data,
        hasChecked: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoggedIn: false,
        user: null,
        hasChecked: true,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => set({ user: null, isLoggedIn: false }),

  checkLoginStatus: async () => {
    if (get().hasChecked) {
      return;
    }

    set({ isLoading: true });

    try {
      const token = localStorage.getItem('accessToken');
      const user = get().user;

      if (token && user) {
        set({ isLoggedIn: true, hasChecked: true, isLoading: false });
      } else {
        set({
          isLoggedIn: false,
          isLoading: false,
          hasChecked: true,
        });
      }
    } catch {
      set({
        isLoggedIn: false,
        isLoading: false,
        hasChecked: true,
      });
    }
  },
}));
