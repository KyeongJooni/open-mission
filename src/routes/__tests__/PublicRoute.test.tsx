import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PublicRoute } from '../PublicRoute';

const mockUseAuth = jest.fn();

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('PublicRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('로딩 중일 때 null을 반환해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      isLoading: true,
    });

    const { container } = render(
      <MemoryRouter>
        <PublicRoute>
          <div>Public Content</div>
        </PublicRoute>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('로그인되었을 때 마이프로필로 리다이렉트해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <PublicRoute>
          <div>Public Content</div>
        </PublicRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
  });

  it('로그인되지 않았을 때 children을 렌더링해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <PublicRoute>
          <div>Public Content</div>
        </PublicRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });
});
