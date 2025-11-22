import { renderHook } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateCommentMutation, useDeleteCommentMutation } from '../comment/commentQuery';

jest.mock('../comment/commentApi', () => ({
  createComment: jest.fn().mockResolvedValue({ data: {} }),
  deleteComment: jest.fn().mockResolvedValue({}),
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

describe('commentQuery', () => {
  describe('useCreateCommentMutation', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useCreateCommentMutation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useDeleteCommentMutation', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useDeleteCommentMutation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });
});
