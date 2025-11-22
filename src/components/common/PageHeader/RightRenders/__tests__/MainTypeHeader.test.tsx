import { render, screen, fireEvent } from '@testing-library/react';
import { MainTypeHeader } from '../MainTypeHeader';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/components/common/Icon/Icon', () => ({
  __esModule: true,
  default: ({ children }: any) => <span data-testid="icon">{children}</span>,
}));

jest.mock('@/components/common/Modal/Modal', () => ({
  __esModule: true,
  default: ({ isOpen, children, onDelete }: any) => (
    isOpen ? (
      <div data-testid="modal">
        {children}
        <button onClick={onDelete} data-testid="confirm-button">확인</button>
      </div>
    ) : null
  ),
}));

jest.mock('@/components/auth', () => ({
  LoginModal: ({ isOpen }: any) => (
    isOpen ? <div data-testid="login-modal">Login</div> : null
  ),
}));

jest.mock('@/assets/icons', () => ({
  CreateIcon: () => <span>Create</span>,
}));

describe('MainTypeHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('컴포넌트가 렌더링되어야 함', () => {
    const { useAuthStore } = require('@/stores/useAuthStore');
    useAuthStore.mockImplementation((selector: any) => selector({ isLoggedIn: false }));

    render(<MainTypeHeader />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('로그인 상태에서 클릭 시 글쓰기 페이지로 이동해야 함', () => {
    const { useAuthStore } = require('@/stores/useAuthStore');
    useAuthStore.mockImplementation((selector: any) => selector({ isLoggedIn: true }));

    render(<MainTypeHeader />);

    const button = screen.getByText('깃로그 쓰기');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/blog/write');
  });

  it('비로그인 상태에서 클릭 시 모달을 표시해야 함', () => {
    const { useAuthStore } = require('@/stores/useAuthStore');
    useAuthStore.mockImplementation((selector: any) => selector({ isLoggedIn: false }));

    render(<MainTypeHeader />);

    const button = screen.getByText('깃로그 쓰기');
    fireEvent.click(button);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('모달 확인 버튼이 존재해야 함', () => {
    const { useAuthStore } = require('@/stores/useAuthStore');
    useAuthStore.mockImplementation((selector: any) => selector({ isLoggedIn: false }));

    render(<MainTypeHeader />);

    const button = screen.getByText('깃로그 쓰기');
    fireEvent.click(button);

    expect(screen.getByTestId('confirm-button')).toBeInTheDocument();
  });
});
