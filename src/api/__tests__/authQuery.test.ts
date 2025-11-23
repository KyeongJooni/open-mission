import { renderHook } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useRegisterMutation,
  useRegisterOAuthMutation,
  useLoginMutation,
  useReissueTokenMutation,
  useKakaoCallbackMutation,
} from '../auth/authQuery';

jest.mock('../auth/authApi', () => ({
  register: jest.fn().mockResolvedValue({ data: {} }),
  login: jest.fn().mockResolvedValue({ data: {} }),
  registerOAuth: jest.fn().mockResolvedValue({ data: {} }),
  reissueToken: jest.fn().mockResolvedValue({ data: {} }),
  handleKakaoRedirect: jest.fn().mockResolvedValue({ data: {} }),
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

describe('authQuery', () => {
  describe('useRegisterMutation', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useRegisterMutation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useRegisterOAuthMutation', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useRegisterOAuthMutation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useLoginMutation', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useLoginMutation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useReissueTokenMutation', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useReissueTokenMutation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useKakaoCallbackMutation', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useKakaoCallbackMutation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });

    it('옵션을 받을 수 있어야 함', () => {
      const onSuccess = jest.fn();
      const onError = jest.fn();

      const { result } = renderHook(() => useKakaoCallbackMutation({ onSuccess, onError }), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
    });
  });
});
