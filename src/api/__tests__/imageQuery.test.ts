import { renderHook } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUploadImageMutation } from '../image/imageQuery';

jest.mock('../image/imageApi', () => ({
  uploadImage: jest.fn().mockResolvedValue({ data: { url: 'https://example.com/image.jpg' } }),
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

describe('imageQuery', () => {
  describe('useUploadImageMutation', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useUploadImageMutation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });
});
