import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';

// Portal 모킹
jest.mock('@/components', () => ({
  Toast: ({ children, type }: { children: React.ReactNode; type: string }) => (
    <div data-testid="toast" data-type={type}>{children}</div>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => <div data-testid="portal">{children}</div>,
}));

const TestComponent = () => {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast('테스트 메시지')}>Show Toast</button>
      <button onClick={() => showToast('경고 메시지', 'warning')}>Show Warning</button>
    </div>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('ToastProvider 없이 useToast를 사용하면 에러가 발생해야 함', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const BrokenComponent = () => {
      useToast();
      return null;
    };

    expect(() => render(<BrokenComponent />)).toThrow(
      'useToast must be used within ToastProvider'
    );

    consoleSpy.mockRestore();
  });

  it('showToast 호출 시 토스트가 표시되어야 함', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show Toast');

    act(() => {
      button.click();
    });

    expect(screen.getByTestId('toast')).toBeInTheDocument();
    expect(screen.getByText('테스트 메시지')).toBeInTheDocument();
  });

  it('warning 타입의 토스트를 표시할 수 있어야 함', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show Warning');

    act(() => {
      button.click();
    });

    const toast = screen.getByTestId('toast');
    expect(toast).toHaveAttribute('data-type', 'warning');
    expect(screen.getByText('경고 메시지')).toBeInTheDocument();
  });

  it('3초 후에 토스트가 사라져야 함', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show Toast');

    act(() => {
      button.click();
    });

    expect(screen.getByTestId('toast')).toBeInTheDocument();

    // 3초 후
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
  });

  it('애니메이션 타이밍이 올바르게 동작해야 함', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show Toast');

    act(() => {
      button.click();
    });

    // 10ms 후 애니메이션 시작
    act(() => {
      jest.advanceTimersByTime(10);
    });

    expect(screen.getByTestId('toast')).toBeInTheDocument();

    // 2700ms 후 애니메이션 종료
    act(() => {
      jest.advanceTimersByTime(2690);
    });

    expect(screen.getByTestId('toast')).toBeInTheDocument();

    // 3000ms 후 토스트 숨김
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
  });

  it('기본 타입은 positive여야 함', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show Toast');

    act(() => {
      button.click();
    });

    const toast = screen.getByTestId('toast');
    expect(toast).toHaveAttribute('data-type', 'positive');
  });

  it('children을 올바르게 렌더링해야 함', () => {
    render(
      <ToastProvider>
        <div data-testid="child">Child Content</div>
      </ToastProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
