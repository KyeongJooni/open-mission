import { useMemo } from 'react';
import { MainPreviewCard as BlogPreviewCard, Spacer, LoadingSpinner, ErrorMessage } from '@/components';
import { useAuth } from '@/api/user/userQuery';
import { getFirstTextContent, getFirstImageUrl, truncateText } from '@/utils/blogContentExtractor';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';

const MainPage = () => {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { blogs, observerRef, isLoading, isFetchingNextPage, hasNextPage, isError } = useInfiniteScroll({
    size: 10,
    isLoggedIn,
    enabled: !authLoading,
  });

  const processedBlogs = useMemo(() => {
    return blogs.map(blog => {
      const textContent = getFirstTextContent(blog.contents);
      const imageUrl = getFirstImageUrl(blog.contents);

      return {
        postId: blog.postId,
        title: blog.title,
        content: truncateText(textContent),
        imageSrc: imageUrl,
        nickName: blog.nickName,
        profileUrl: blog.profileUrl,
        createdAt: blog.createdAt,
        commentCount: blog.commentCount,
      };
    });
  }, [blogs]);

  if (authLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage />;
  }

  return (
    <div>
      <Spacer height="md" />

      {processedBlogs.map((blog, index) => (
        <BlogPreviewCard
          key={blog.postId}
          id={blog.postId}
          title={blog.title}
          content={blog.content}
          imageSrc={blog.imageSrc}
          nickName={blog.nickName}
          profileUrl={blog.profileUrl}
          createdAt={blog.createdAt}
          commentCount={blog.commentCount}
          priority={index === 0}
        />
      ))}

      {hasNextPage && (
        <div ref={observerRef} style={{ height: '20px', margin: '20px 0' }}>
          {isFetchingNextPage && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
};

export default MainPage;
