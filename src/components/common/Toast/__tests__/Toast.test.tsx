import { render, screen } from '@testing-library/react';
import Toast from '../Toast';

jest.mock('@/assets/icons', () => ({
  DoneIcon: () => <span data-testid="done-icon">Done</span>,
  ErrorOutlineIcon: () => <span data-testid="error-icon">Error</span>,
}));

describe('Toast', () => {
  it('positive 타입일 때 DoneIcon을 표시해야 함', () => {
    render(<Toast type="positive">성공 메시지</Toast>);

    expect(screen.getByTestId('done-icon')).toBeInTheDocument();
    expect(screen.getByText('성공 메시지')).toBeInTheDocument();
  });

  it('warning 타입일 때 ErrorOutlineIcon을 표시해야 함', () => {
    render(<Toast type="warning">경고 메시지</Toast>);

    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    expect(screen.getByText('경고 메시지')).toBeInTheDocument();
  });

  it('기본 타입일 때 DoneIcon을 표시해야 함', () => {
    render(<Toast>기본 메시지</Toast>);

    expect(screen.getByTestId('done-icon')).toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    const { container } = render(
      <Toast type="positive" className="custom-class">
        메시지
      </Toast>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('children을 렌더링해야 함', () => {
    render(<Toast type="positive">테스트 내용</Toast>);

    expect(screen.getByText('테스트 내용')).toBeInTheDocument();
  });
});
