import { axiosInstance } from '../apiInstance';
import type { ApiResponse } from '../apiTypes';
import type * as CommentTypes from './commentTypes';

// 댓글 작성
export const createComment = async (
  postId: string,
  content: string
): Promise<ApiResponse<CommentTypes.CreateCommentResponse>> => {
  const response = await axiosInstance.post<ApiResponse<CommentTypes.CreateCommentResponse>>(`/comments/${postId}`, {
    content,
  });
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (commentId: number): Promise<ApiResponse<CommentTypes.DeleteCommentResponse>> => {
  const response = await axiosInstance.delete<ApiResponse<CommentTypes.DeleteCommentResponse>>(
    `/comments/${commentId}`
  );
  return response.data;
};
