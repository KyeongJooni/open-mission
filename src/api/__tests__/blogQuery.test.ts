import { renderHook, waitFor } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useBlogDetailQuery,
  useBlogsQuery,
} from '../blog/blogQuery';

jest.mock('../blog/blogApi', () => ({
  createBlog: jest.fn().mockResolvedValue({ data: { postId: '1' } }),
  updateBlog: jest.fn().mockResolvedValue({ data: { postId: '1' } }),
  deleteBlog: jest.fn().mockResolvedValue({}),
  fetchBlogDetail: jest.fn().mockResolvedValue({ data: { postId: '1', title: 'Test' } }),
  fetchBlogs: jest.fn().mockResolvedValue({ data: { posts: [] } }),
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

describe('blogQuery', () => {
  describe('useCreateBlogMutation', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useCreateBlogMutation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useUpdateBlogMutation', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useUpdateBlogMutation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useDeleteBlogMutation', () => {
    it('mutation을 반환해야 함', () => {
      const { result } = renderHook(() => useDeleteBlogMutation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useBlogDetailQuery', () => {
    it('blogId가 없을 때 비활성화되어야 함', () => {
      const { result } = renderHook(() => useBlogDetailQuery(undefined, true), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
    });

    it('blogId가 있을 때 데이터를 가져와야 함', async () => {
      const { result } = renderHook(() => useBlogDetailQuery('1', true, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('useBlogsQuery', () => {
    it('데이터를 가져와야 함', async () => {
      const { result } = renderHook(() => useBlogsQuery(1, 10, true, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('enabled가 false일 때 비활성화되어야 함', () => {
      const { result } = renderHook(() => useBlogsQuery(1, 10, true, false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
    });
  });
});
