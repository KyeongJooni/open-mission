import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { useInfiniteScroll } from '../useInfiniteScroll';
import { fetchBlogs } from '@/api/blog/blogApi';

jest.mock('@/api/blog/blogApi');

const mockFetchBlogs = fetchBlogs as jest.MockedFunction<typeof fetchBlogs>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('초기 로딩 상태를 반환해야 함', () => {
    mockFetchBlogs.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useInfiniteScroll({ isLoggedIn: false }), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.blogs).toEqual([]);
  });

  it('블로그 데이터를 성공적으로 가져와야 함', async () => {
    const mockPosts = [
      { postId: '1', title: '테스트 포스트 1' },
      { postId: '2', title: '테스트 포스트 2' },
    ];

    mockFetchBlogs.mockResolvedValue({
      data: {
        posts: mockPosts,
        pageMax: 2,
      },
    } as any);

    const { result } = renderHook(() => useInfiniteScroll({ isLoggedIn: false }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.blogs).toEqual(mockPosts);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('마지막 페이지일 때 hasNextPage가 false여야 함', async () => {
    mockFetchBlogs.mockResolvedValue({
      data: {
        posts: [{ postId: '1', title: '테스트' }],
        pageMax: 1,
      },
    } as any);

    const { result } = renderHook(() => useInfiniteScroll({ isLoggedIn: false }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(false);
  });

  it('에러 발생 시 isError가 true여야 함', async () => {
    mockFetchBlogs.mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useInfiniteScroll({ isLoggedIn: false }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('enabled가 false일 때 쿼리를 실행하지 않아야 함', () => {
    const { result } = renderHook(() => useInfiniteScroll({ isLoggedIn: false, enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockFetchBlogs).not.toHaveBeenCalled();
  });

  it('로그인 상태에 따라 다른 queryKey를 사용해야 함', async () => {
    mockFetchBlogs.mockResolvedValue({
      data: { posts: [], pageMax: 1 },
    } as any);

    renderHook(() => useInfiniteScroll({ isLoggedIn: true }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockFetchBlogs).toHaveBeenCalledWith(1, 10, true);
    });
  });

  it('커스텀 size를 사용해야 함', async () => {
    mockFetchBlogs.mockResolvedValue({
      data: { posts: [], pageMax: 1 },
    } as any);

    renderHook(() => useInfiniteScroll({ isLoggedIn: false, size: 20 }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockFetchBlogs).toHaveBeenCalledWith(1, 20, false);
    });
  });

  it('observerRef를 반환해야 함', () => {
    mockFetchBlogs.mockResolvedValue({
      data: { posts: [], pageMax: 1 },
    } as any);

    const { result } = renderHook(() => useInfiniteScroll({ isLoggedIn: false }), { wrapper: createWrapper() });

    expect(result.current.observerRef).toBeDefined();
  });

  it('data가 없을 때 undefined를 반환해야 함', async () => {
    mockFetchBlogs.mockResolvedValue({
      data: null,
    } as any);

    const { result } = renderHook(() => useInfiniteScroll({ isLoggedIn: false }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(false);
  });
});
