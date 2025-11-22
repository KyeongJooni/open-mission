import { render, screen } from '@testing-library/react';
import MainPage from '../MainPage';

const mockUseAuth = jest.fn();
const mockUseInfiniteScroll = jest.fn();

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/hooks/common/useInfiniteScroll', () => ({
  useInfiniteScroll: () => mockUseInfiniteScroll(),
}));

jest.mock('@/components', () => ({
  MainPreviewCard: ({ title, id }: { title: string; id: string }) => (
    <div data-testid={`blog-${id}`}>{title}</div>
  ),
  Spacer: () => <div data-testid="spacer" />,
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
  ErrorMessage: () => <div data-testid="error-message">Error</div>,
}));

jest.mock('@/utils/blogContentExtractor', () => ({
  getFirstTextContent: () => 'Test content',
  getFirstImageUrl: () => 'test.jpg',
  truncateText: (text: string) => text,
}));

describe('MainPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('인증 로딩 중일 때 로딩 스피너를 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      isLoading: true,
    });
    mockUseInfiniteScroll.mockReturnValue({
      blogs: [],
      observerRef: { current: null },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      isError: false,
    });

    render(<MainPage />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('블로그 로딩 중일 때 로딩 스피너를 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      isLoading: false,
    });
    mockUseInfiniteScroll.mockReturnValue({
      blogs: [],
      observerRef: { current: null },
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      isError: false,
    });

    render(<MainPage />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('에러 발생 시 에러 메시지를 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      isLoading: false,
    });
    mockUseInfiniteScroll.mockReturnValue({
      blogs: [],
      observerRef: { current: null },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      isError: true,
    });

    render(<MainPage />);

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  it('블로그 목록을 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      isLoading: false,
    });
    mockUseInfiniteScroll.mockReturnValue({
      blogs: [
        { postId: '1', title: '첫번째 글', contents: [], nickName: 'user1' },
        { postId: '2', title: '두번째 글', contents: [], nickName: 'user2' },
      ],
      observerRef: { current: null },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      isError: false,
    });

    render(<MainPage />);

    expect(screen.getByTestId('blog-1')).toBeInTheDocument();
    expect(screen.getByTestId('blog-2')).toBeInTheDocument();
  });

  it('다음 페이지가 있을 때 observer를 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      isLoading: false,
    });
    mockUseInfiniteScroll.mockReturnValue({
      blogs: [{ postId: '1', title: '글', contents: [], nickName: 'user' }],
      observerRef: { current: null },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      isError: false,
    });

    const { container } = render(<MainPage />);

    expect(container.querySelector('[style*="height: 20px"]')).toBeInTheDocument();
  });

  it('다음 페이지 로딩 중일 때 스피너를 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      isLoading: false,
    });
    mockUseInfiniteScroll.mockReturnValue({
      blogs: [{ postId: '1', title: '글', contents: [], nickName: 'user' }],
      observerRef: { current: null },
      isLoading: false,
      isFetchingNextPage: true,
      hasNextPage: true,
      isError: false,
    });

    render(<MainPage />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
