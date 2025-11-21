import { act } from '@testing-library/react';
import { useAuthStore } from '../useAuthStore';
import { setAccessToken, setRefreshToken } from '@/api/apiInstance';

jest.mock('@/api/apiInstance', () => ({
  setAccessToken: jest.fn(),
  setRefreshToken: jest.fn(),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.setState({
        isLoggedIn: false,
        isKakaoUser: false,
      });
    });
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('초기 상태', () => {
    it('초기 상태가 올바르게 설정되어야 함', () => {
      const state = useAuthStore.getState();
      expect(state.isLoggedIn).toBe(false);
      expect(state.isKakaoUser).toBe(false);
    });
  });

  describe('setIsLoggedIn', () => {
    it.each([
      [true],
      [false],
    ])('isLoggedIn을 %s로 설정해야 함', (value) => {
      act(() => {
        useAuthStore.getState().setIsLoggedIn(value);
      });
      expect(useAuthStore.getState().isLoggedIn).toBe(value);
    });
  });

  describe('setIsKakaoUser', () => {
    it.each([
      [true],
      [false],
    ])('isKakaoUser를 %s로 설정해야 함', (value) => {
      act(() => {
        useAuthStore.getState().setIsKakaoUser(value);
      });
      expect(useAuthStore.getState().isKakaoUser).toBe(value);
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      act(() => {
        useAuthStore.setState({
          isLoggedIn: true,
          isKakaoUser: true,
        });
      });
      sessionStorage.setItem('isKakaoSignup', 'true');
      sessionStorage.setItem('kakaoId', '12345');
    });

    it('로그아웃 시 상태를 초기화해야 함', () => {
      act(() => {
        useAuthStore.getState().logout();
      });

      const state = useAuthStore.getState();
      expect(state.isLoggedIn).toBe(false);
      expect(state.isKakaoUser).toBe(false);
    });

    it('로그아웃 시 토큰을 제거해야 함', () => {
      act(() => {
        useAuthStore.getState().logout();
      });

      expect(setAccessToken).toHaveBeenCalledWith(null);
      expect(setRefreshToken).toHaveBeenCalledWith(null);
    });

    it('로그아웃 시 세션 스토리지를 정리해야 함', () => {
      act(() => {
        useAuthStore.getState().logout();
      });

      expect(sessionStorage.getItem('isKakaoSignup')).toBeNull();
      expect(sessionStorage.getItem('kakaoId')).toBeNull();
    });
  });

  describe('상태 변경 시나리오', () => {
    it('로그인 후 로그아웃 플로우가 정상 동작해야 함', () => {
      act(() => {
        useAuthStore.getState().setIsLoggedIn(true);
        useAuthStore.getState().setIsKakaoUser(true);
      });

      expect(useAuthStore.getState().isLoggedIn).toBe(true);
      expect(useAuthStore.getState().isKakaoUser).toBe(true);

      act(() => {
        useAuthStore.getState().logout();
      });

      expect(useAuthStore.getState().isLoggedIn).toBe(false);
      expect(useAuthStore.getState().isKakaoUser).toBe(false);
    });

    it('일반 로그인 사용자 설정이 가능해야 함', () => {
      act(() => {
        useAuthStore.getState().setIsLoggedIn(true);
        useAuthStore.getState().setIsKakaoUser(false);
      });

      const state = useAuthStore.getState();
      expect(state.isLoggedIn).toBe(true);
      expect(state.isKakaoUser).toBe(false);
    });
  });
});
