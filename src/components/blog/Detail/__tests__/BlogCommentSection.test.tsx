import { render, screen, fireEvent } from '@testing-library/react';
import BlogCommentSection from '../BlogCommentSection';

const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();
const mockOnModalConfirm = jest.fn();
const mockHandleCommentSubmit = jest.fn();
const mockHandleCommentDeleteClick = jest.fn();

jest.mock('@/stores/useModalStore', () => ({
  useModalStore: () => ({
    modalType: null,
    confirmButtonText: '확인',
    onModalConfirm: mockOnModalConfirm,
    openModal: mockOpenModal,
    closeModal: mockCloseModal,
  }),
}));

jest.mock('@/hooks', () => ({
  useBlogComment: (initialComments: any) => ({
    comments: initialComments,
    handleCommentSubmit: mockHandleCommentSubmit,
    handleCommentDeleteClick: mockHandleCommentDeleteClick,
  }),
}));

jest.mock('@/components', () => ({
  Spacer: () => <div data-testid="spacer" />,
  CommentItem: ({ nickName, content, onDelete, commentId }: any) => (
    <div data-testid="comment-item">
      <span>{nickName}</span>
      <span>{content}</span>
      <button onClick={() => onDelete(commentId)}>삭제</button>
    </div>
  ),
  CommentInput: ({ nickName, onSubmit }: any) => (
    <div data-testid="comment-input">
      <span>{nickName}</span>
      <button onClick={() => onSubmit('새 댓글')}>제출</button>
    </div>
  ),
  Modal: ({ children }: any) => <div data-testid="modal">{children}</div>,
}));

describe('BlogCommentSection', () => {
  const mockComments = [
    {
      commentId: 1,
      content: '첫 번째 댓글',
      nickName: '유저1',
      profileUrl: 'https://example.com/1.png',
      createdAt: '2024-01-01',
      isOwner: true,
    },
    {
      commentId: 2,
      content: '두 번째 댓글',
      nickName: '유저2',
      profileUrl: 'https://example.com/2.png',
      createdAt: '2024-01-02',
      isOwner: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('댓글 제목과 개수를 렌더링해야 함', () => {
    render(<BlogCommentSection comments={mockComments} />);

    expect(screen.getByText('댓글')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('댓글 목록을 렌더링해야 함', () => {
    render(<BlogCommentSection comments={mockComments} />);

    expect(screen.getAllByTestId('comment-item')).toHaveLength(2);
  });

  it('댓글이 없을 때 안내 메시지를 표시해야 함', () => {
    render(<BlogCommentSection comments={[]} />);

    expect(screen.getByText(/작성된 댓글이 없습니다/)).toBeInTheDocument();
  });

  it('로그인했을 때 댓글 입력창을 표시해야 함', () => {
    render(<BlogCommentSection comments={mockComments} isLoggedIn={true} currentUserNickName="테스트 유저" />);

    expect(screen.getByTestId('comment-input')).toBeInTheDocument();
  });

  it('로그인하지 않았을 때 로그인 안내를 표시해야 함', () => {
    render(<BlogCommentSection comments={mockComments} isLoggedIn={false} />);

    expect(screen.getByText(/로그인을 하고 댓글을 달아보세요/)).toBeInTheDocument();
  });

  it('로그인 안내 클릭 시 로그인 모달을 열어야 함', () => {
    render(<BlogCommentSection comments={mockComments} isLoggedIn={false} />);

    fireEvent.click(screen.getByText(/로그인을 하고 댓글을 달아보세요/));

    expect(mockOpenModal).toHaveBeenCalledWith('login');
  });

  it('댓글 제출 시 handleCommentSubmit을 호출해야 함', () => {
    render(<BlogCommentSection comments={mockComments} isLoggedIn={true} />);

    fireEvent.click(screen.getByText('제출'));

    expect(mockHandleCommentSubmit).toHaveBeenCalledWith('새 댓글');
  });
});
