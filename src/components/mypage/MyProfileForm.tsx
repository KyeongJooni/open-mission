import { Spacer, MainPreviewCard as BlogPreviewCard } from '@/components';
import { mockPosts } from '@/_mocks_/mockposts';
import { MyProfileFormProps } from '@/types/mypage';

const MyProfileForm = ({ className }: MyProfileFormProps) => {
  // TODO: API 연동 시 로그인한 사용자가 작성한 글만 가져오도록 수정 필요
  // 현재는 mock 데이터 전체를 표시
  // 예: const user = useAuthStore((state) => state.user);
  //     const userPosts = await fetchUserPosts(user?.id);
  const userPosts = mockPosts;

  return (
    <div className={className}>
      <Spacer height="md" className="w-full max-w-content" />
      {userPosts.map(post => (
        <BlogPreviewCard key={post.id} id={post.id} title={post.title} content={post.content} imageSrc={post.image} />
      ))}
    </div>
  );
};

export default MyProfileForm;
