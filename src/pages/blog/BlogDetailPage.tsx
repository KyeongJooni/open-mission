import { useParams } from 'react-router-dom';
import {
  BlogPostSection,
  BlogCommentSection,
  BlogAuthorSection,
  Spacer,
  LoadingSpinner,
  ErrorMessage,
} from '@/components';
import { useAuth } from '@/api/user/userQuery';
import { useBlogDetailQuery } from '@/api/blog/blogQuery';

const BlogDetailPage = () => {
  const { id } = useParams();
  const { isLoggedIn, user, isLoading: authLoading } = useAuth();
  const { data: blogData, isLoading: blogLoading } = useBlogDetailQuery(id, isLoggedIn, !authLoading);

  if (authLoading || blogLoading) {
    return <LoadingSpinner />;
  }

  if (!blogData?.data) {
    return <ErrorMessage />;
  }

  const post = blogData.data;

  return (
    <>
      <BlogPostSection
        title={post.title}
        contents={post.contents}
        nickName={post.nickName}
        profileUrl={post.profileUrl}
        createdAt={post.createdAt}
        commentCount={post.comments.length}
      />
      <BlogCommentSection
        comments={post.comments}
        isLoggedIn={isLoggedIn}
        currentUserNickName={user?.nickname || 'User'}
        currentUserProfileUrl={user?.profilePicture}
      />
      <BlogAuthorSection nickName={post.nickName} profileUrl={post.profileUrl} introduction={post.introduction} />
      <Spacer height="custom" />
    </>
  );
};

export default BlogDetailPage;
