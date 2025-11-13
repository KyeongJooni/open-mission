import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ErrorBoundary } from '../ErrorBoundary';

// 에러를 던지는 테스트 컴포넌트
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('테스트 에러');
  }
  return <div>정상 렌더링</div>;
};

describe('ErrorBoundary', () => {
  // console.error 모킹 (에러 로그 출력 방지)
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('에러가 없으면 children을 정상적으로 렌더링해야 함', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('정상 렌더링')).toBeInTheDocument();
  });

  it('자식 컴포넌트에서 에러가 발생하면 에러 메시지를 렌더링해야 함', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('테스트 에러')).toBeInTheDocument();
    expect(screen.getByText('다시 시도')).toBeInTheDocument();
  });

  it('커스텀 fallback을 사용할 수 있어야 함', () => {
    const customFallback = <div>커스텀 에러 UI</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('커스텀 에러 UI')).toBeInTheDocument();
    expect(screen.queryByText('다시 시도')).not.toBeInTheDocument();
  });

  it('다시 시도 버튼 클릭 시 에러 상태를 초기화해야 함', async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    const TestComponent = () => {
      if (shouldThrow) {
        throw new Error('테스트 에러');
      }
      return <div>정상 렌더링</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    // 에러 발생 확인
    expect(screen.getByText('테스트 에러')).toBeInTheDocument();

    // 다시 시도 버튼 클릭
    const retryButton = screen.getByText('다시 시도');
    shouldThrow = false; // 에러 조건 제거

    await user.click(retryButton);

    // 에러 상태 초기화 후 리렌더링
    rerender(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('정상 렌더링')).toBeInTheDocument();
  });
});
