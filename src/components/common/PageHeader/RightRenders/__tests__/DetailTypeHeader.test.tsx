import { render, screen } from '@testing-library/react';
import { DetailTypeHeader } from '../DetailTypeHeader';

const mockUseDetailTypeHeader = jest.fn();

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '123' }),
  useLocation: () => ({ pathname: '/blog/123' }),
}));

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ isLoggedIn: true }),
}));

jest.mock('@/api/blog/blogQuery', () => ({
  useBlogDetailQuery: () => ({
    data: { data: { isOwner: true } },
  }),
}));

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => ({ isLoading: false }),
}));

jest.mock('@/hooks', () => ({
  useDetailTypeHeader: () => mockUseDetailTypeHeader(),
}));

jest.mock('@/components', () => ({
  Icon: ({ children, onClick }: any) => (
    <button data-testid="icon" onClick={onClick}>
      {children}
    </button>
  ),
  DropdownMenu: ({ trigger }: any) => <div data-testid="dropdown-menu">{trigger}</div>,
  Modal: ({ isOpen, children }: any) => (isOpen ? <div data-testid="modal">{children}</div> : null),
}));

jest.mock('@/assets/icons', () => ({
  ChatIcon: () => <span>Chat</span>,
  MoreVertIcon: () => <span>More</span>,
}));

describe('DetailTypeHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDetailTypeHeader.mockReturnValue({
      handleChatClick: jest.fn(),
      handleEdit: jest.fn(),
      handleDelete: jest.fn(),
      handleConfirmDelete: jest.fn(),
      handleCloseDeleteModal: jest.fn(),
      isDeleteModalOpen: false,
      modalTexts: {
        confirm: '확인',
        cancel: '취소',
        deleteTitle: '삭제',
        deleteDescription: '삭제하시겠습니까?',
      },
    });
  });

  it('컴포넌트가 렌더링되어야 함', () => {
    render(<DetailTypeHeader />);

    expect(screen.getAllByTestId('icon').length).toBeGreaterThan(0);
  });

  it('소유자일 때 드롭다운 메뉴를 표시해야 함', () => {
    render(<DetailTypeHeader />);

    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('삭제 모달이 열릴 때 표시해야 함', () => {
    mockUseDetailTypeHeader.mockReturnValue({
      handleChatClick: jest.fn(),
      handleEdit: jest.fn(),
      handleDelete: jest.fn(),
      handleConfirmDelete: jest.fn(),
      handleCloseDeleteModal: jest.fn(),
      isDeleteModalOpen: true,
      modalTexts: {
        confirm: '확인',
        cancel: '취소',
        deleteTitle: '삭제',
        deleteDescription: '삭제하시겠습니까?',
      },
    });

    render(<DetailTypeHeader />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});
