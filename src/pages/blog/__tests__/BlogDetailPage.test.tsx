import { render, screen } from '@testing-library/react';
import BlogDetailPage from '../BlogDetailPage';

const mockUseParams = jest.fn();
const mockUseAuth = jest.fn();
const mockUseBlogDetailQuery = jest.fn();

jest.mock('react-router-dom', () => ({
  useParams: () => mockUseParams(),
}));

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/api/blog/blogQuery', () => ({
  useBlogDetailQuery: () => mockUseBlogDetailQuery(),
}));

jest.mock('@/components', () => ({
  BlogPostSection: ({ title }: { title: string }) => (
    <div data-testid="blog-post-section">{title}</div>
  ),
  BlogCommentSection: ({ comments }: { comments: any[] }) => (
    <div data-testid="blog-comment-section">{comments.length} comments</div>
  ),
  BlogAuthorSection: ({ nickName }: { nickName: string }) => (
    <div data-testid="blog-author-section">{nickName}</div>
  ),
  Spacer: () => <div data-testid="spacer" />,
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
  ErrorMessage: () => <div data-testid="error-message">Error</div>,
}));

describe('BlogDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '123' });
  });

  it('인증 로딩 중일 때 로딩 스피너를 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      user: null,
      isLoading: true,
    });
    mockUseBlogDetailQuery.mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<BlogDetailPage />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('블로그 로딩 중일 때 로딩 스피너를 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      user: { nickname: 'testuser' },
      isLoading: false,
    });
    mockUseBlogDetailQuery.mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<BlogDetailPage />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('데이터가 없을 때 에러 메시지를 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      user: { nickname: 'testuser' },
      isLoading: false,
    });
    mockUseBlogDetailQuery.mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<BlogDetailPage />);

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  it('블로그 상세 정보를 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      user: { nickname: 'testuser', profilePicture: 'profile.jpg' },
      isLoading: false,
    });
    mockUseBlogDetailQuery.mockReturnValue({
      data: {
        data: {
          title: '테스트 글',
          contents: [],
          nickName: 'author',
          profileUrl: 'author.jpg',
          createdAt: '2024-01-01',
          comments: [{ id: '1', content: 'comment' }],
          introduction: '소개',
        },
      },
      isLoading: false,
    });

    render(<BlogDetailPage />);

    expect(screen.getByTestId('blog-post-section')).toHaveTextContent('테스트 글');
    expect(screen.getByTestId('blog-comment-section')).toHaveTextContent('1 comments');
    expect(screen.getByTestId('blog-author-section')).toHaveTextContent('author');
  });

  it('로그인하지 않은 사용자도 볼 수 있어야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      user: null,
      isLoading: false,
    });
    mockUseBlogDetailQuery.mockReturnValue({
      data: {
        data: {
          title: '공개 글',
          contents: [],
          nickName: 'author',
          profileUrl: 'author.jpg',
          createdAt: '2024-01-01',
          comments: [],
          introduction: '소개',
        },
      },
      isLoading: false,
    });

    render(<BlogDetailPage />);

    expect(screen.getByTestId('blog-post-section')).toHaveTextContent('공개 글');
  });
});
