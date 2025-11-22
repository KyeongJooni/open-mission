import { render, screen, fireEvent } from '@testing-library/react';
import TextBox from '../TextBox';

jest.mock('@/components', () => ({
  Icon: ({ children }: any) => <span data-testid="icon">{children}</span>,
}));

describe('TextBox', () => {
  it('children을 렌더링해야 함', () => {
    render(<TextBox>테스트 텍스트</TextBox>);

    expect(screen.getByText('테스트 텍스트')).toBeInTheDocument();
  });

  it('showIcon이 true일 때 아이콘을 렌더링해야 함', () => {
    render(<TextBox showIcon>텍스트</TextBox>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('showIcon이 false일 때 아이콘을 렌더링하지 않아야 함', () => {
    render(<TextBox>텍스트</TextBox>);

    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('커스텀 아이콘을 렌더링해야 함', () => {
    render(
      <TextBox showIcon icon={<span data-testid="custom-icon">커스텀</span>}>
        텍스트
      </TextBox>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('onClick이 제공되면 버튼으로 렌더링해야 함', () => {
    const onClick = jest.fn();
    render(<TextBox onClick={onClick}>텍스트</TextBox>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it('asButton이 true면 버튼으로 렌더링해야 함', () => {
    render(<TextBox asButton>텍스트</TextBox>);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('onClick과 asButton이 없으면 div로 렌더링해야 함', () => {
    const { container } = render(<TextBox>텍스트</TextBox>);

    expect(container.querySelector('div')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<TextBox className="custom-class">텍스트</TextBox>);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
