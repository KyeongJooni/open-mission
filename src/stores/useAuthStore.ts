import { create } from 'zustand';
import { setAccessToken, setRefreshToken } from '@/api/apiInstance';

interface AuthState {
  // UI 상태
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  isLoggedIn: false,

  setIsLoggedIn: value => set({ isLoggedIn: value }),

  logout: () => {
    setAccessToken(null);
    setRefreshToken(null);
    sessionStorage.removeItem('isKakaoSignup');
    sessionStorage.removeItem('kakaoId');

    set({ isLoggedIn: false }); // 로그아웃 시 컴포넌트 내에서 query캐시 삭제
  },
}));
