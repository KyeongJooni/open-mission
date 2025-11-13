import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('기본 메시지를 렌더링해야 함', () => {
    render(<ErrorMessage />);
    expect(screen.getByText('오류가 발생했습니다.')).toBeInTheDocument();
  });

  it('커스텀 메시지를 렌더링해야 함', () => {
    render(<ErrorMessage message="커스텀 에러 메시지" />);
    expect(screen.getByText('커스텀 에러 메시지')).toBeInTheDocument();
  });

  it('onRetry가 없으면 다시 시도 버튼을 표시하지 않아야 함', () => {
    render(<ErrorMessage />);
    expect(screen.queryByText('다시 시도')).not.toBeInTheDocument();
  });

  it('onRetry가 있으면 다시 시도 버튼을 표시해야 함', () => {
    const onRetry = jest.fn();
    render(<ErrorMessage onRetry={onRetry} />);
    expect(screen.getByText('다시 시도')).toBeInTheDocument();
  });

  it('다시 시도 버튼 클릭 시 onRetry가 호출되어야 함', async () => {
    const onRetry = jest.fn();
    const user = userEvent.setup();

    render(<ErrorMessage onRetry={onRetry} />);

    const retryButton = screen.getByText('다시 시도');
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
