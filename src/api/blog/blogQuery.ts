import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBlog, updateBlog, deleteBlog, fetchBlogDetail, fetchBlogs } from './blogApi';
import type * as BlogTypes from './blogTypes';

// 블로그 게시물 생성
export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

// 블로그 게시물 수정
export const useUpdateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blogId, blogData }: { blogId: string; blogData: BlogTypes.UpdateBlogRequest }) =>
      updateBlog(blogId, blogData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', variables.blogId] });
    },
  });
};

// 블로그 게시물 삭제
export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

// 블로그 게시물 상세 조회
export const useBlogDetailQuery = (blogId: string | undefined, isLoggedIn: boolean, enabled = true) => {
  return useQuery({
    queryKey: ['blog', blogId, isLoggedIn],
    queryFn: () => fetchBlogDetail(blogId!, isLoggedIn),
    enabled: Boolean(blogId) && enabled,
  });
};

// 블로그 게시물 목록 조회
export const useBlogsQuery = (page = 1, size = 10, isLoggedIn: boolean, enabled = true) => {
  return useQuery({
    queryKey: ['blogs', page, size, isLoggedIn],
    queryFn: () => fetchBlogs(page, size, isLoggedIn),
    enabled,
  });
};
