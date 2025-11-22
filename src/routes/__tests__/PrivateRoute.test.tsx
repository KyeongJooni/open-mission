import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PrivateRoute } from '../PrivateRoute';

const mockUseAuth = jest.fn();

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('PrivateRoute', () => {
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
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('로그인되지 않았을 때 홈으로 리다이렉트해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('로그인되었을 때 children을 렌더링해야 함', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
