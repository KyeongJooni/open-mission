import { Spacer, MainPreviewCard as BlogPreviewCard, LoadingSpinner } from '@/components';
import { MyProfileFormProps } from '@/types/mypage';
import { useBlogsQuery } from '@/api/blog/blogQuery';
import { useAuth } from '@/api/user/userQuery';
import { getFirstTextContent, getFirstImageUrl, truncateText } from '@/utils/blogContentExtractor';

const MyProfileForm = ({ className }: MyProfileFormProps) => {
  const { isLoggedIn, user, isLoading: authLoading } = useAuth();
  const { data: blogsData, isLoading: blogsLoading } = useBlogsQuery(1, 100, isLoggedIn, !authLoading);

  if (authLoading || blogsLoading) {
    return <LoadingSpinner />;
  }

  const allPosts = blogsData?.data?.posts || [];
  const myPosts = allPosts.filter(post => post.nickName === user?.nickname);

  return (
    <div className={className}>
      <Spacer height="md" className="w-full max-w-content" />
      {myPosts.map(post => {
        const textContent = getFirstTextContent(post.contents);
        const imageUrl = getFirstImageUrl(post.contents);

        return (
          <BlogPreviewCard
            key={post.postId}
            id={post.postId}
            title={post.title}
            content={truncateText(textContent)}
            imageSrc={imageUrl}
            nickName={post.nickName}
            profileUrl={post.profileUrl}
            createdAt={post.createdAt}
            commentCount={post.commentCount}
          />
        );
      })}
    </div>
  );
};

export default MyProfileForm;
