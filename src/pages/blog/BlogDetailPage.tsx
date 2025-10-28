import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BlogPostSection, BlogCommentSection, BlogAuthorSection, Spacer } from '@/components';
import {
  mockPostDetail,
  mockPostDetailNoComments,
  mockPostDetailWithMyComments,
  mockPostDetailByHongGilDong,
} from '@/_mocks_/mockPostDetail';
import { useAuthStore } from '@/stores/useAuthStore';
import type { PostDetail } from '@/types/blog';

const BlogDetailPage = () => {
  const { id } = useParams();
  const { isLoggedIn, user } = useAuthStore();
  const [postData, setPostData] = useState<PostDetail>(mockPostDetail);

  useEffect(() => {
    // TODO: API 연결 시 삭제예정 - localStorage에서 저장된 블로그 찾기
    const savedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const savedPost = savedPosts.find((post: PostDetail) => post.postId === Number(id));

    if (savedPost) {
      // TODO: API 연결 시 삭제예정 - localStorage에서 찾은 경우
      setPostData(savedPost);
    } else {
      // Mock 데이터에서 찾기
      const mockData =
        id === '1001'
          ? mockPostDetailByHongGilDong
          : id === '998'
            ? mockPostDetailNoComments
            : id === '997'
              ? mockPostDetailWithMyComments
              : mockPostDetail;
      setPostData(mockData);
    }
  }, [id]);

  return (
    <>
      <BlogPostSection title={postData.title} contents={postData.contents} />
      <BlogCommentSection
        comments={postData.comments}
        isLoggedIn={isLoggedIn}
        currentUserNickName={user?.nickname || 'User'}
      />
      <BlogAuthorSection nickName={postData.nickName} introduction={postData.introduction} />
      <Spacer height="custom" />
    </>
  );
};

export default BlogDetailPage;
