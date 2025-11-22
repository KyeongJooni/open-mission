import { render, screen, fireEvent } from '@testing-library/react';
import PaginationButton from '../PaginationButton';

describe('PaginationButton', () => {
  it('버튼을 렌더링해야 함', () => {
    render(<PaginationButton>1</PaginationButton>);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('children을 렌더링해야 함', () => {
    render(<PaginationButton variant="page">5</PaginationButton>);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('클릭 시 onClick을 호출해야 함', () => {
    const onClick = jest.fn();
    render(<PaginationButton onClick={onClick}>1</PaginationButton>);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });

  it('disabled일 때 클릭이 비활성화되어야 함', () => {
    const onClick = jest.fn();
    render(
      <PaginationButton onClick={onClick} disabled>
        1
      </PaginationButton>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('navigation variant와 prev direction일 때 아이콘을 렌더링해야 함', () => {
    render(<PaginationButton variant="navigation" direction="prev" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('navigation variant와 next direction일 때 회전된 아이콘을 렌더링해야 함', () => {
    render(<PaginationButton variant="navigation" direction="next" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    render(<PaginationButton className="custom-class">1</PaginationButton>);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('state="active"일 때 활성 상태 스타일을 적용해야 함', () => {
    render(
      <PaginationButton variant="page" state="active">
        1
      </PaginationButton>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
