import { render, screen, fireEvent } from '@testing-library/react';
import CommentItem from '../CommentItem';

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/utils/date', () => ({
  formatCommentDate: jest.fn(() => '2024-01-01'),
}));

jest.mock('@/components', () => ({
  PostBody: ({ content }: { content: string }) => <div data-testid="post-body">{content}</div>,
  Spacer: () => <div data-testid="spacer" />,
  Icon: ({ children, onClick }: any) => (
    <button data-testid="icon" onClick={onClick}>
      {children}
    </button>
  ),
  DropdownMenu: ({ trigger, items }: any) => (
    <div data-testid="dropdown-menu">
      {trigger}
      {items.map((item: any) => (
        <button key={item.id} onClick={item.onClick} data-testid={`dropdown-item-${item.id}`}>
          {item.label}
        </button>
      ))}
    </div>
  ),
}));

describe('CommentItem', () => {
  const defaultProps = {
    commentId: 1,
    content: '테스트 댓글',
    nickName: '테스트 유저',
    profileUrl: 'https://example.com/profile.png',
    createdAt: '2024-01-01T00:00:00Z',
    isOwner: true,
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('댓글 내용을 렌더링해야 함', () => {
    const { useAuthStore } = require('@/stores/useAuthStore');
    useAuthStore.mockImplementation((selector: any) => selector({ isLoggedIn: true }));

    render(<CommentItem {...defaultProps} />);

    expect(screen.getByTestId('post-body')).toHaveTextContent('테스트 댓글');
  });

  it('닉네임을 렌더링해야 함', () => {
    const { useAuthStore } = require('@/stores/useAuthStore');
    useAuthStore.mockImplementation((selector: any) => selector({ isLoggedIn: true }));

    render(<CommentItem {...defaultProps} />);

    expect(screen.getByText('테스트 유저')).toBeInTheDocument();
  });

  it('날짜를 렌더링해야 함', () => {
    const { useAuthStore } = require('@/stores/useAuthStore');
    useAuthStore.mockImplementation((selector: any) => selector({ isLoggedIn: true }));

    render(<CommentItem {...defaultProps} />);

    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('로그인하고 소유자일 때 드롭다운 메뉴를 표시해야 함', () => {
    const { useAuthStore } = require('@/stores/useAuthStore');
    useAuthStore.mockImplementation((selector: any) => selector({ isLoggedIn: true }));

    render(<CommentItem {...defaultProps} isOwner={true} />);

    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('로그인하지 않았을 때 드롭다운 메뉴를 표시하지 않아야 함', () => {
    const { useAuthStore } = require('@/stores/useAuthStore');
    useAuthStore.mockImplementation((selector: any) => selector({ isLoggedIn: false }));

    render(<CommentItem {...defaultProps} />);

    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('소유자가 아닐 때 드롭다운 메뉴를 표시하지 않아야 함', () => {
    const { useAuthStore } = require('@/stores/useAuthStore');
    useAuthStore.mockImplementation((selector: any) => selector({ isLoggedIn: true }));

    render(<CommentItem {...defaultProps} isOwner={false} />);

    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('삭제 버튼 클릭 시 onDelete를 호출해야 함', () => {
    const { useAuthStore } = require('@/stores/useAuthStore');
    useAuthStore.mockImplementation((selector: any) => selector({ isLoggedIn: true }));

    const onDelete = jest.fn();
    render(<CommentItem {...defaultProps} onDelete={onDelete} />);

    fireEvent.click(screen.getByTestId('dropdown-item-delete'));

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('프로필 이미지를 렌더링해야 함', () => {
    const { useAuthStore } = require('@/stores/useAuthStore');
    useAuthStore.mockImplementation((selector: any) => selector({ isLoggedIn: true }));

    render(<CommentItem {...defaultProps} />);

    const img = screen.getByAltText('profile');
    expect(img).toHaveAttribute('src', 'https://example.com/profile.png');
  });
});
