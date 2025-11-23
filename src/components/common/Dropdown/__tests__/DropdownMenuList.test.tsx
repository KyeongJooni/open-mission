import { render, screen, fireEvent } from '@testing-library/react';
import DropdownMenuList from '../DropdownMenuList';

describe('DropdownMenuList', () => {
  const mockItems = [
    { id: 'edit', label: '수정', onClick: jest.fn() },
    { id: 'delete', label: '삭제', onClick: jest.fn(), color: 'danger' as const },
  ];

  const mockOnItemClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('아이템들을 렌더링해야 함', () => {
    render(<DropdownMenuList items={mockItems} onItemClick={mockOnItemClick} />);

    expect(screen.getByText('수정')).toBeInTheDocument();
    expect(screen.getByText('삭제')).toBeInTheDocument();
  });

  it('아이템 클릭 시 onItemClick을 호출해야 함', () => {
    render(<DropdownMenuList items={mockItems} onItemClick={mockOnItemClick} />);

    fireEvent.click(screen.getByText('수정'));

    expect(mockOnItemClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('disabled 아이템은 비활성화되어야 함', () => {
    const disabledItems = [{ id: 'disabled', label: '비활성', onClick: jest.fn(), disabled: true }];

    render(<DropdownMenuList items={disabledItems} onItemClick={mockOnItemClick} />);

    const button = screen.getByText('비활성');
    expect(button.closest('button')).toBeDisabled();
  });

  it('position이 left일 때 left-0 클래스를 적용해야 함', () => {
    const { container } = render(<DropdownMenuList items={mockItems} onItemClick={mockOnItemClick} position="left" />);

    expect(container.firstChild).toHaveClass('left-0');
  });

  it('position이 right일 때 right-0 클래스를 적용해야 함', () => {
    const { container } = render(<DropdownMenuList items={mockItems} onItemClick={mockOnItemClick} position="right" />);

    expect(container.firstChild).toHaveClass('right-0');
  });

  it('menuClassName을 적용해야 함', () => {
    const { container } = render(
      <DropdownMenuList items={mockItems} onItemClick={mockOnItemClick} menuClassName="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('danger 색상 아이템은 text-warning 클래스를 가져야 함', () => {
    render(<DropdownMenuList items={mockItems} onItemClick={mockOnItemClick} />);

    const deleteButton = screen.getByText('삭제');
    expect(deleteButton).toHaveClass('text-warning');
  });
});
