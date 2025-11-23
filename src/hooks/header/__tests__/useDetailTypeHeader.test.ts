import { renderHook, act } from '@testing-library/react';
import { useDetailTypeHeader } from '../useDetailTypeHeader';

const mockNavigate = jest.fn();
const mockShowToast = jest.fn();
const mockMutateAsync = jest.fn();
const mockId = jest.fn();

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: mockId() }),
  useNavigate: () => mockNavigate,
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@/api/blog/blogQuery', () => ({
  useDeleteBlogMutation: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

describe('useDetailTypeHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockId.mockReturnValue('123');
  });

  it('초기 상태에서 삭제 모달이 닫혀있어야 함', () => {
    const { result } = renderHook(() => useDetailTypeHeader());
    expect(result.current.isDeleteModalOpen).toBe(false);
  });

  it('handleChatClick이 댓글 섹션으로 스크롤해야 함', () => {
    const mockScrollIntoView = jest.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };
    jest.spyOn(document, 'querySelector').mockReturnValue(mockElement as any);

    const { result } = renderHook(() => useDetailTypeHeader());

    act(() => {
      result.current.handleChatClick();
    });

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('handleChatClick이 댓글 섹션이 없을 때 아무것도 하지 않아야 함', () => {
    jest.spyOn(document, 'querySelector').mockReturnValue(null);

    const { result } = renderHook(() => useDetailTypeHeader());

    act(() => {
      result.current.handleChatClick();
    });
  });

  it('handleEdit이 수정 페이지로 이동해야 함', () => {
    const { result } = renderHook(() => useDetailTypeHeader());

    act(() => {
      result.current.handleEdit();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/blog/write?edit=123');
  });

  it('handleEdit이 id가 없을 때 토스트를 표시해야 함', () => {
    mockId.mockReturnValue(undefined);

    const { result } = renderHook(() => useDetailTypeHeader());

    act(() => {
      result.current.handleEdit();
    });

    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'warning');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handleDelete가 삭제 모달을 열어야 함', () => {
    const { result } = renderHook(() => useDetailTypeHeader());

    act(() => {
      result.current.handleDelete();
    });

    expect(result.current.isDeleteModalOpen).toBe(true);
  });

  it('handleConfirmDelete가 삭제를 수행해야 함', async () => {
    mockMutateAsync.mockResolvedValue({});

    const { result } = renderHook(() => useDetailTypeHeader());

    await act(async () => {
      await result.current.handleConfirmDelete();
    });

    expect(mockMutateAsync).toHaveBeenCalledWith('123');
    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'positive');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handleConfirmDelete가 id가 없을 때 토스트를 표시해야 함', async () => {
    mockId.mockReturnValue(undefined);

    const { result } = renderHook(() => useDetailTypeHeader());

    await act(async () => {
      await result.current.handleConfirmDelete();
    });

    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'warning');
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('handleConfirmDelete가 실패 시 에러 토스트를 표시해야 함', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => useDetailTypeHeader());

    await act(async () => {
      await result.current.handleConfirmDelete();
    });

    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'warning');
  });

  it('handleCloseDeleteModal이 모달을 닫아야 함', () => {
    const { result } = renderHook(() => useDetailTypeHeader());

    act(() => {
      result.current.handleDelete();
    });
    expect(result.current.isDeleteModalOpen).toBe(true);

    act(() => {
      result.current.handleCloseDeleteModal();
    });
    expect(result.current.isDeleteModalOpen).toBe(false);
  });

  it('modalTexts를 반환해야 함', () => {
    const { result } = renderHook(() => useDetailTypeHeader());

    expect(result.current.modalTexts).toBeDefined();
    expect(result.current.modalTexts.confirm).toBeDefined();
    expect(result.current.modalTexts.cancel).toBeDefined();
    expect(result.current.modalTexts.deleteTitle).toBeDefined();
    expect(result.current.modalTexts.deleteDescription).toBeDefined();
  });
});
