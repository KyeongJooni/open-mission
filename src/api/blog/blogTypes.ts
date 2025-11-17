import type { ContentItem } from '@/types/blog';

// 공통 타입
export interface UserInfo {
  nickName: string;
  profileUrl: string;
}

export interface PostBase {
  postId: string;
  title: string;
  createdAt: string;
}

export type BlogContent = ContentItem;

// 댓글
export interface BlogComment extends UserInfo {
  commentId: number;
  content: string;
  createdAt: string;
  isOwner: boolean;
}

// 게시글 작성/수정 요청
export interface BlogPostRequest {
  title: string;
  contents: BlogContent[];
}

export type CreateBlogRequest = BlogPostRequest;
export type UpdateBlogRequest = BlogPostRequest;

// 게시글 상세
export interface BlogDetailData extends PostBase, UserInfo {
  contents: BlogContent[];
  isOwner: boolean;
  comments: BlogComment[];
  introduction: string;
}

// 게시글 목록 아이템
export interface BlogListItem extends PostBase, UserInfo {
  commentCount: number;
  contents: BlogContent[];
}

// 게시글 목록 응답
export interface BlogListResponse {
  posts: BlogListItem[];
  pageMax: number;
}
