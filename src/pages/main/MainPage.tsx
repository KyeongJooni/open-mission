import { MainPreviewCard as BlogPreviewCard, Spacer, LoadingSpinner, ErrorMessage } from '@/components';
import { useBlogsQuery } from '@/api/blog/blogQuery';
import { useAuth } from '@/api/user/userQuery';
import { getFirstTextContent, getFirstImageUrl, truncateText } from '@/utils/blogContentExtractor';

const MainPage = () => {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { data: blogsData, isLoading: blogsLoading } = useBlogsQuery(1, 10, isLoggedIn, !authLoading);

  if (authLoading || blogsLoading) {
    return <LoadingSpinner />;
  }

  if (!blogsData?.data) {
    return <ErrorMessage />;
  }

  const blogs = blogsData.data.posts || [];

  return (
    <div>
      <Spacer height="md" />

      {blogs.map(blog => {
        const textContent = getFirstTextContent(blog.contents);
        const imageUrl = getFirstImageUrl(blog.contents);

        return (
          <BlogPreviewCard
            key={blog.postId}
            id={blog.postId}
            title={blog.title}
            content={truncateText(textContent)}
            imageSrc={imageUrl}
            nickName={blog.nickName}
            profileUrl={blog.profileUrl}
            createdAt={blog.createdAt}
            commentCount={blog.commentCount}
          />
        );
      })}
    </div>
  );
};

export default MainPage;
