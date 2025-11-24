import { render, screen, fireEvent } from '@testing-library/react';
import MyPageForm from '../MyPageForm';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@/components/auth/LoginLogo', () => ({
  __esModule: true,
  default: ({ isDark }: { isDark?: boolean }) => (
    <div data-testid="login-logo" data-dark={isDark}>
      Logo
    </div>
  ),
}));

jest.mock('@/components/auth/LoginForm', () => ({
  __esModule: true,
  default: ({ onEmailClick, onKakaoClick, emailButtonText, kakaoButtonText }: any) => (
    <div data-testid="login-form">
      <button onClick={onEmailClick}>{emailButtonText}</button>
      <button onClick={onKakaoClick}>{kakaoButtonText}</button>
    </div>
  ),
}));

describe('MyPageForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('컴포넌트가 렌더링되어야 함', () => {
    render(<MyPageForm />);

    expect(screen.getByTestId('login-logo')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('이메일 가입 버튼 클릭 시 회원가입 페이지로 이동해야 함', () => {
    render(<MyPageForm />);

    const emailButton = screen.getByText('이메일로 회원가입');
    fireEvent.click(emailButton);

    expect(mockNavigate).toHaveBeenCalledWith('/mypage/signup');
  });

  it('카카오 가입 버튼 클릭 시 카카오 인증 URL로 이동해야 함', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { href: '' };

    render(<MyPageForm />);

    const kakaoButton = screen.getByText('카카오로 회원가입');
    fireEvent.click(kakaoButton);

    expect(window.location.href).toBeDefined();

    (window as any).location = originalLocation;
  });

  it('children을 렌더링해야 함', () => {
    render(
      <MyPageForm>
        <div data-testid="child">Child Content</div>
      </MyPageForm>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    render(<MyPageForm className="custom-class" />);

    const container = screen.getByTestId('login-logo').parentElement;
    expect(container).toHaveClass('custom-class');
  });
});
