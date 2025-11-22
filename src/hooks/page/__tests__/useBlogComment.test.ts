import { renderHook, act } from '@testing-library/react';
import { useBlogComment } from '../useBlogComment';

const mockShowToast = jest.fn();
const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();
const mockCreateMutateAsync = jest.fn();
const mockDeleteMutateAsync = jest.fn();
const mockId = jest.fn();

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: mockId() }),
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@/stores/useModalStore', () => ({
  useModalStore: () => ({
    openModal: mockOpenModal,
    closeModal: mockCloseModal,
  }),
}));

jest.mock('@/api/comment/commentQuery', () => ({
  useCreateCommentMutation: () => ({
    mutateAsync: mockCreateMutateAsync,
  }),
  useDeleteCommentMutation: () => ({
    mutateAsync: mockDeleteMutateAsync,
  }),
}));

const mockComments = [
  { commentId: 1, content: '테스트 댓글 1', nickname: 'user1' },
  { commentId: 2, content: '테스트 댓글 2', nickname: 'user2' },
];

describe('useBlogComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockId.mockReturnValue('123');
  });

  it('comments를 반환해야 함', () => {
    const { result } = renderHook(() => useBlogComment(mockComments as any, 'currentUser'));

    expect(result.current.comments).toEqual(mockComments);
  });

  it('handleCommentSubmit이 댓글을 생성해야 함', async () => {
    mockCreateMutateAsync.mockResolvedValue({});

    const { result } = renderHook(() => useBlogComment(mockComments as any, 'currentUser'));

    await act(async () => {
      await result.current.handleCommentSubmit('새 댓글');
    });

    expect(mockCreateMutateAsync).toHaveBeenCalledWith('새 댓글');
    expect(mockShowToast).toHaveBeenCalledWith('댓글이 작성되었습니다', 'positive');
  });

  it('handleCommentSubmit이 id가 없을 때 경고를 표시해야 함', async () => {
    mockId.mockReturnValue(undefined);

    const { result } = renderHook(() => useBlogComment(mockComments as any, 'currentUser'));

    await act(async () => {
      await result.current.handleCommentSubmit('새 댓글');
    });

    expect(mockShowToast).toHaveBeenCalledWith('게시글 정보가 없습니다', 'warning');
    expect(mockCreateMutateAsync).not.toHaveBeenCalled();
  });

  it('handleCommentSubmit이 실패 시 에러를 표시해야 함', async () => {
    mockCreateMutateAsync.mockRejectedValue(new Error('Create failed'));

    const { result } = renderHook(() => useBlogComment(mockComments as any, 'currentUser'));

    await act(async () => {
      await result.current.handleCommentSubmit('새 댓글');
    });

    expect(mockShowToast).toHaveBeenCalledWith('댓글 작성에 실패했습니다', 'warning');
  });

  it('handleCommentDeleteClick이 삭제 모달을 열어야 함', () => {
    const { result } = renderHook(() => useBlogComment(mockComments as any, 'currentUser'));

    act(() => {
      result.current.handleCommentDeleteClick(1);
    });

    expect(mockOpenModal).toHaveBeenCalledWith(
      'delete',
      undefined,
      expect.any(Function),
      '삭제하기'
    );
  });

  it('삭제 확인 시 댓글을 삭제해야 함', async () => {
    mockDeleteMutateAsync.mockResolvedValue({});

    const { result } = renderHook(() => useBlogComment(mockComments as any, 'currentUser'));

    act(() => {
      result.current.handleCommentDeleteClick(1);
    });

    const confirmDelete = mockOpenModal.mock.calls[0][2];

    await act(async () => {
      await confirmDelete();
    });

    expect(mockDeleteMutateAsync).toHaveBeenCalledWith(1);
    expect(mockShowToast).toHaveBeenCalledWith('댓글이 삭제되었습니다', 'positive');
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('삭제 실패 시 에러를 표시해야 함', async () => {
    mockDeleteMutateAsync.mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => useBlogComment(mockComments as any, 'currentUser'));

    act(() => {
      result.current.handleCommentDeleteClick(1);
    });

    const confirmDelete = mockOpenModal.mock.calls[0][2];

    await act(async () => {
      await confirmDelete();
    });

    expect(mockShowToast).toHaveBeenCalledWith('댓글 삭제에 실패했습니다', 'warning');
    expect(mockCloseModal).toHaveBeenCalled();
  });
});
