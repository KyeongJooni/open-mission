import { render, screen, fireEvent } from '@testing-library/react';
import DropdownMenu from '../DropdownMenu';

jest.mock('../DropdownMenuList', () => ({
  __esModule: true,
  default: ({ items, onItemClick }: any) => (
    <div data-testid="dropdown-list">
      {items.map((item: any) => (
        <button key={item.id} onClick={() => onItemClick(item)} data-testid={`item-${item.id}`}>
          {item.label}
        </button>
      ))}
    </div>
  ),
}));

describe('DropdownMenu', () => {
  const mockItems = [
    { id: 'edit', label: '수정', onClick: jest.fn() },
    { id: 'delete', label: '삭제', onClick: jest.fn() },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('트리거를 렌더링해야 함', () => {
    render(
      <DropdownMenu
        trigger={<span>메뉴</span>}
        items={mockItems}
      />
    );

    expect(screen.getByText('메뉴')).toBeInTheDocument();
  });

  it('클릭 시 메뉴를 열어야 함', () => {
    render(
      <DropdownMenu
        trigger={<span>메뉴</span>}
        items={mockItems}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('dropdown-list')).toBeInTheDocument();
  });

  it('아이템 클릭 시 onClick을 호출해야 함', () => {
    render(
      <DropdownMenu
        trigger={<span>메뉴</span>}
        items={mockItems}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByTestId('item-edit'));

    expect(mockItems[0].onClick).toHaveBeenCalled();
  });

  it('아이템 클릭 후 메뉴를 닫아야 함', () => {
    render(
      <DropdownMenu
        trigger={<span>메뉴</span>}
        items={mockItems}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByTestId('item-edit'));

    expect(screen.queryByTestId('dropdown-list')).not.toBeInTheDocument();
  });

  it('외부 클릭 시 메뉴를 닫아야 함', () => {
    render(
      <div>
        <DropdownMenu
          trigger={<span>메뉴</span>}
          items={mockItems}
        />
        <div data-testid="outside">Outside</div>
      </div>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('dropdown-list')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByTestId('dropdown-list')).not.toBeInTheDocument();
  });

  it('disabled 아이템은 onClick을 호출하지 않아야 함', () => {
    const disabledItem = { id: 'disabled', label: '비활성', onClick: jest.fn(), disabled: true };
    render(
      <DropdownMenu
        trigger={<span>메뉴</span>}
        items={[disabledItem]}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByTestId('item-disabled'));

    expect(disabledItem.onClick).not.toHaveBeenCalled();
  });
});
