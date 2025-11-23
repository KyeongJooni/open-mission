import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../LoginForm';

const mockHandleLogin = jest.fn();
const mockHandleKakaoLogin = jest.fn();
const mockHandleSignup = jest.fn();

jest.mock('@/hooks', () => ({
  useLoginForm: () => ({
    email: '',
    password: '',
    errorMessage: '',
    setEmail: jest.fn(),
    setPassword: jest.fn(),
    handleLogin: mockHandleLogin,
    handleKeyDown: jest.fn(),
    handleKakaoLogin: mockHandleKakaoLogin,
    handleSignup: mockHandleSignup,
  }),
}));

jest.mock('@/components', () => ({
  Spacer: () => <div data-testid="spacer" />,
}));

jest.mock('@/components/auth/LoginFormComponents', () => ({
  InputSection: ({ onEmailChange, onPasswordChange }: any) => (
    <div data-testid="input-section">
      <input data-testid="email-input" onChange={e => onEmailChange(e.target.value)} />
      <input data-testid="password-input" onChange={e => onPasswordChange(e.target.value)} />
    </div>
  ),
  ErrorMessage: ({ message }: any) => (message ? <div data-testid="error-message">{message}</div> : null),
  SnsDivider: ({ text }: any) => <div data-testid="sns-divider">{text}</div>,
  EmailLoginButton: ({ onClick, text }: any) => (
    <button data-testid="email-login-button" onClick={onClick}>
      {text}
    </button>
  ),
  KakaoLoginButton: ({ onClick, text }: any) => (
    <button data-testid="kakao-login-button" onClick={onClick}>
      {text}
    </button>
  ),
  SignupButton: ({ onClick }: any) => (
    <button data-testid="signup-button" onClick={onClick}>
      회원가입
    </button>
  ),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('폼을 렌더링해야 함', () => {
    render(<LoginForm />);

    expect(screen.getByTestId('input-section')).toBeInTheDocument();
    expect(screen.getByTestId('email-login-button')).toBeInTheDocument();
    expect(screen.getByTestId('kakao-login-button')).toBeInTheDocument();
  });

  it('showInputSection이 false일 때 입력 섹션을 숨겨야 함', () => {
    render(<LoginForm showInputSection={false} />);

    expect(screen.queryByTestId('input-section')).not.toBeInTheDocument();
  });

  it('showSignupButton이 false일 때 회원가입 버튼을 숨겨야 함', () => {
    render(<LoginForm showSignupButton={false} />);

    expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
  });

  it('이메일 로그인 버튼 클릭 시 handleLogin을 호출해야 함', () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByTestId('email-login-button'));

    expect(mockHandleLogin).toHaveBeenCalled();
  });

  it('카카오 로그인 버튼 클릭 시 handleKakaoLogin을 호출해야 함', () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByTestId('kakao-login-button'));

    expect(mockHandleKakaoLogin).toHaveBeenCalled();
  });

  it('회원가입 버튼 클릭 시 handleSignup을 호출해야 함', () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByTestId('signup-button'));

    expect(mockHandleSignup).toHaveBeenCalled();
  });

  it('onEmailClick이 제공되면 해당 함수를 호출해야 함', () => {
    const onEmailClick = jest.fn();
    render(<LoginForm onEmailClick={onEmailClick} />);

    fireEvent.click(screen.getByTestId('email-login-button'));

    expect(onEmailClick).toHaveBeenCalled();
    expect(mockHandleLogin).not.toHaveBeenCalled();
  });

  it('onKakaoClick이 제공되면 해당 함수를 호출해야 함', () => {
    const onKakaoClick = jest.fn();
    render(<LoginForm onKakaoClick={onKakaoClick} />);

    fireEvent.click(screen.getByTestId('kakao-login-button'));

    expect(onKakaoClick).toHaveBeenCalled();
    expect(mockHandleKakaoLogin).not.toHaveBeenCalled();
  });

  it('커스텀 버튼 텍스트를 표시해야 함', () => {
    render(<LoginForm emailButtonText="커스텀 이메일" kakaoButtonText="커스텀 카카오" />);

    expect(screen.getByText('커스텀 이메일')).toBeInTheDocument();
    expect(screen.getByText('커스텀 카카오')).toBeInTheDocument();
  });

  it('폼 제출 시 handleLogin을 호출해야 함', () => {
    const { container } = render(<LoginForm />);

    fireEvent.submit(container.querySelector('form')!);

    expect(mockHandleLogin).toHaveBeenCalled();
  });
});
