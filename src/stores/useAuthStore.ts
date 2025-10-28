import { create } from 'zustand';
import type * as UserTypes from '@/api/user/userTypes';
import type * as AuthTypes from '@/api/auth/authTypes';
import { login as loginApi } from '@/api/auth/authApi';
import { getUserInfo } from '@/api/user/userApi';
import { setAccessToken, setRefreshToken } from '@/api/apiInstance';

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
  resetCheckStatus: () => void;
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

  logout: () => {
    // 토큰 클리어
    setAccessToken(null);
    setRefreshToken(null);
    sessionStorage.removeItem('isKakaoSignup');
    sessionStorage.removeItem('kakaoId');

    set({
      user: null,
      isLoggedIn: false,
      hasChecked: false, // 다음 마운트 시 다시 체크하도록
      isLoading: false,
    });
  },

  checkLoginStatus: async () => {
    if (get().hasChecked) {
      return;
    }

    set({ isLoading: true });

    try {
      const userResponse = await getUserInfo();

      set({
        isLoggedIn: true,
        user: userResponse.data,
        hasChecked: true,
        isLoading: false,
      });
    } catch {
      set({
        isLoggedIn: false,
        user: null,
        isLoading: false,
        hasChecked: true,
      });
    }
  },

  // hasChecked 상태만 리셋 (토큰 저장 후 재체크를 위해)
  resetCheckStatus: () => {
    set({ hasChecked: false });
  },
}));
