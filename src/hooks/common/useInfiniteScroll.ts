import { useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchBlogs } from '@/api/blog/blogApi';
import type { BlogListItem } from '@/api/blog/blogTypes';

interface UseInfiniteScrollParams {
  size?: number;
  isLoggedIn: boolean;
  enabled?: boolean;
}

export const useInfiniteScroll = ({ size = 10, isLoggedIn, enabled = true }: UseInfiniteScrollParams) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ['blogs', 'infinite', size, isLoggedIn],
    queryFn: ({ pageParam = 1 }) => fetchBlogs(pageParam, size, isLoggedIn),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data) {
        return undefined;
      }

      const currentPage = allPages.length;
      const { pageMax } = lastPage.data;

      return currentPage < pageMax ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled,
  });

  const blogs: BlogListItem[] = data?.pages.flatMap(page => page.data?.posts || []) || [];

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetchingNextPage && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    blogs,
    observerRef,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
  };
};
