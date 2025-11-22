import { render, screen, fireEvent } from '@testing-library/react';
import LoginModal from '../LoginModal';

jest.mock('@/hooks', () => ({
  useBodyScrollLock: jest.fn(),
  useFocusTrap: jest.fn(),
}));

jest.mock('@/components', () => ({
  Icon: ({ children, onClick }: any) => (
    <button data-testid="close-icon" onClick={onClick}>
      {children}
    </button>
  ),
  Portal: ({ children }: any) => <div data-testid="portal">{children}</div>,
}));

jest.mock('@/pages/auth/LoginPage', () => ({ onClose }: any) => (
  <div data-testid="login-page">
    <button onClick={onClose}>로그인</button>
  </div>
));

describe('LoginModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('isOpen이 true일 때 모달을 렌더링해야 함', () => {
    render(<LoginModal {...defaultProps} />);

    expect(screen.getByTestId('portal')).toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('isOpen이 false일 때 아무것도 렌더링하지 않아야 함', () => {
    render(<LoginModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId('portal')).not.toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose를 호출해야 함', () => {
    const onClose = jest.fn();
    render(<LoginModal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByTestId('close-icon'));

    expect(onClose).toHaveBeenCalled();
  });

  it('오버레이 클릭 시 onClose를 호출해야 함', () => {
    const onClose = jest.fn();
    render(<LoginModal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByRole('dialog'));

    expect(onClose).toHaveBeenCalled();
  });

  it('모달 컨텐츠 클릭 시 이벤트 전파를 막아야 함', () => {
    const onClose = jest.fn();
    render(<LoginModal {...defaultProps} onClose={onClose} />);

    const content = screen.getByTestId('login-page').parentElement;
    fireEvent.click(content!);

    // onClose가 오버레이 클릭으로 호출되지 않아야 함
    expect(onClose).not.toHaveBeenCalled();
  });

  it('className을 적용해야 함', () => {
    render(<LoginModal {...defaultProps} className="custom-class" />);

    const content = screen.getByTestId('login-page').parentElement;
    expect(content).toHaveClass('custom-class');
  });
});
