import { renderHook, waitFor } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserInfo, useAuth, useUpdateUser, useUpdateProfilePicture, useUpdateNickname } from '../user/userQuery';

const mockSetIsLoggedIn = jest.fn();

jest.mock('../user/userApi', () => ({
  getUserInfo: jest.fn().mockResolvedValue({ data: { nickname: 'testuser' } }),
  updateUser: jest.fn().mockResolvedValue({ data: {} }),
  updateProfilePicture: jest.fn().mockResolvedValue({ data: {} }),
  updateNickname: jest.fn().mockResolvedValue({ data: {} }),
}));

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: (selector: any) =>
    selector({
      isLoggedIn: true,
      setIsLoggedIn: mockSetIsLoggedIn,
    }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('userQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useUserInfo', () => {
    it('유저 정보를 가져와야 함', async () => {
      const { result } = renderHook(() => useUserInfo(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('useAuth', () => {
    it('인증 상태를 반환해야 함', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isLoggedIn).toBe(true);
    });
  });

  describe('useUpdateUser', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useUpdateUser(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useUpdateProfilePicture', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useUpdateProfilePicture(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useUpdateNickname', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useUpdateNickname(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });
});
