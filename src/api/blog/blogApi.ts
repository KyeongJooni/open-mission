import { axiosInstance } from '../apiInstance';
import type { ApiResponse } from '../apiTypes';
import type * as BlogTypes from './blogTypes';

// 블로그 게시물 생성
export const createBlog = async (blogData: BlogTypes.CreateBlogRequest): Promise<ApiResponse<{}>> => {
  const response = await axiosInstance.post<ApiResponse<{}>>('/posts', blogData);
  return response.data;
};

// 블로그 게시물 수정
export const updateBlog = async (blogId: string, blogData: BlogTypes.UpdateBlogRequest): Promise<ApiResponse<{}>> => {
  const response = await axiosInstance.patch<ApiResponse<{}>>('/posts', blogData, {
    params: { postId: blogId },
  });
  return response.data;
};

// 블로그 게시물 삭제
export const deleteBlog = async (blogId: string): Promise<ApiResponse<{}>> => {
  const response = await axiosInstance.delete<ApiResponse<{}>>(`/posts`, {
    params: { postId: blogId },
  });
  return response.data;
};

// 블로그 게시물 상세 조회 (단일)
export const fetchBlogDetail = async (
  blogId: string,
  isLoggedIn: boolean
): Promise<ApiResponse<BlogTypes.BlogDetailData>> => {
  const endpoint = isLoggedIn ? '/posts/token' : '/posts';
  const response = await axiosInstance.get<ApiResponse<BlogTypes.BlogDetailData>>(endpoint, {
    params: { postId: blogId },
  });
  return response.data;
};

// 블로그 게시물 목록 조회
export const fetchBlogs = async (
  page = 1,
  size = 10,
  isLoggedIn: boolean
): Promise<ApiResponse<BlogTypes.BlogListResponse>> => {
  const endpoint = isLoggedIn ? '/posts/all/token' : '/posts/all';
  const response = await axiosInstance.get<ApiResponse<BlogTypes.BlogListResponse>>(endpoint, {
    params: { page, size },
  });
  return response.data;
};
