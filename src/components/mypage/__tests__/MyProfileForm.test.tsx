import { render, screen } from '@testing-library/react';
import MyProfileForm from '../MyProfileForm';

jest.mock('@/components', () => ({
  Spacer: ({ height }: { height: string }) => <div data-testid="spacer" data-height={height} />,
  MainPreviewCard: ({ title, id }: { title: string; id: string }) => (
    <div data-testid={`post-${id}`}>{title}</div>
  ),
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

const mockUseAuth = jest.fn();
const mockUseBlogsQuery = jest.fn();

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/api/blog/blogQuery', () => ({
  useBlogsQuery: () => mockUseBlogsQuery(),
}));

jest.mock('@/utils/blogContentExtractor', () => ({
  getFirstTextContent: () => 'Test content',
  getFirstImageUrl: () => 'test.jpg',
  truncateText: (text: string) => text,
}));

describe('MyProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('인증 로딩 중일 때 로딩 스피너를 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      user: null,
      isLoading: true,
    });
    mockUseBlogsQuery.mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<MyProfileForm />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('블로그 로딩 중일 때 로딩 스피너를 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      user: { nickname: 'testuser' },
      isLoading: false,
    });
    mockUseBlogsQuery.mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<MyProfileForm />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('사용자의 포스트만 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      user: { nickname: 'testuser' },
      isLoading: false,
    });
    mockUseBlogsQuery.mockReturnValue({
      data: {
        data: {
          posts: [
            { postId: '1', title: '내 포스트', nickName: 'testuser', contents: [] },
            { postId: '2', title: '다른 포스트', nickName: 'otheruser', contents: [] },
          ],
        },
      },
      isLoading: false,
    });

    render(<MyProfileForm />);

    expect(screen.getByTestId('post-1')).toBeInTheDocument();
    expect(screen.queryByTestId('post-2')).not.toBeInTheDocument();
  });

  it('포스트가 없을 때 빈 화면을 표시해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      user: { nickname: 'testuser' },
      isLoading: false,
    });
    mockUseBlogsQuery.mockReturnValue({
      data: {
        data: {
          posts: [],
        },
      },
      isLoading: false,
    });

    render(<MyProfileForm />);

    expect(screen.getByTestId('spacer')).toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      user: { nickname: 'testuser' },
      isLoading: false,
    });
    mockUseBlogsQuery.mockReturnValue({
      data: { data: { posts: [] } },
      isLoading: false,
    });

    const { container } = render(<MyProfileForm className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('데이터가 없을 때도 처리해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      user: { nickname: 'testuser' },
      isLoading: false,
    });
    mockUseBlogsQuery.mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<MyProfileForm />);

    expect(screen.getByTestId('spacer')).toBeInTheDocument();
  });
});
