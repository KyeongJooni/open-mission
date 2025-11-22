import { render, screen } from '@testing-library/react';
import LoginPage from '../LoginPage';

jest.mock('@/components/auth', () => ({
  LoginLogo: () => <div data-testid="login-logo" />,
  LoginForm: ({ onClose }: any) => (
    <div data-testid="login-form" onClick={onClose}>
      Login Form
    </div>
  ),
}));

describe('LoginPage', () => {
  it('LoginLogo를 렌더링해야 함', () => {
    render(<LoginPage />);

    expect(screen.getByTestId('login-logo')).toBeInTheDocument();
  });

  it('LoginForm을 렌더링해야 함', () => {
    render(<LoginPage />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<LoginPage className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('onClose prop을 LoginForm에 전달해야 함', () => {
    const onClose = jest.fn();
    render(<LoginPage onClose={onClose} />);

    screen.getByTestId('login-form').click();

    expect(onClose).toHaveBeenCalled();
  });
});
