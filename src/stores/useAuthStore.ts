import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setAccessToken, setRefreshToken } from '@/api/apiInstance';

interface AuthState {
  // UI 상태
  isLoggedIn: boolean;
  isKakaoUser: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setIsKakaoUser: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isLoggedIn: false,
      isKakaoUser: false,

      setIsLoggedIn: value => set({ isLoggedIn: value }),
      setIsKakaoUser: value => set({ isKakaoUser: value }),

      logout: () => {
        setAccessToken(null);
        setRefreshToken(null);
        sessionStorage.removeItem('isKakaoSignup');
        sessionStorage.removeItem('kakaoId');

        set({ isLoggedIn: false, isKakaoUser: false }); // 로그아웃 시 초기화
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
