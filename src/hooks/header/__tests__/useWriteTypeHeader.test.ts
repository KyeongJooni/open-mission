import { renderHook, act } from '@testing-library/react';
import { useWriteTypeHeader } from '../useWriteTypeHeader';

const mockNavigate = jest.fn();
const mockShowToast = jest.fn();
const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();
const mockReset = jest.fn();
const mockCreateMutateAsync = jest.fn();
const mockUpdateMutateAsync = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@/stores/useModalStore', () => ({
  useModalStore: () => ({
    modalType: null,
    confirmButtonText: '',
    onModalConfirm: jest.fn(),
    openModal: mockOpenModal,
    closeModal: mockCloseModal,
  }),
}));

jest.mock('@/stores/useBlogWriteStore', () => ({
  useBlogWriteStore: Object.assign(
    () => ({
      title: '테스트 제목',
      getCurrentContent: () => '테스트 내용',
      reset: mockReset,
      editPostId: null,
    }),
    {
      getState: () => ({
        mode: 'text',
      }),
    }
  ),
}));

jest.mock('@/api/blog/blogQuery', () => ({
  useCreateBlogMutation: () => ({
    mutateAsync: mockCreateMutateAsync,
  }),
  useUpdateBlogMutation: () => ({
    mutateAsync: mockUpdateMutateAsync,
  }),
}));

jest.mock('@/utils/blogContentParser', () => ({
  convertToApiFormat: jest.fn(() => ({ title: '테스트', contents: [] })),
}));

describe('useWriteTypeHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handleDeleteClick이 삭제 모달을 열어야 함', () => {
    const { result } = renderHook(() => useWriteTypeHeader());

    act(() => {
      result.current.handleDeleteClick();
    });

    expect(mockOpenModal).toHaveBeenCalledWith(
      'delete',
      undefined,
      expect.any(Function),
      expect.any(String)
    );
  });

  it('삭제 확인 시 리셋하고 뒤로 이동해야 함', () => {
    const { result } = renderHook(() => useWriteTypeHeader());

    act(() => {
      result.current.handleDeleteClick();
    });

    const confirmDelete = mockOpenModal.mock.calls[0][2];

    act(() => {
      confirmDelete();
    });

    expect(mockReset).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('handlePublishClick이 새 글을 생성해야 함', async () => {
    mockCreateMutateAsync.mockResolvedValue({});

    const { result } = renderHook(() => useWriteTypeHeader());

    await act(async () => {
      await result.current.handlePublishClick();
    });

    expect(mockCreateMutateAsync).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'positive');
    expect(mockReset).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handlePublishClick이 실패 시 에러를 표시해야 함', async () => {
    mockCreateMutateAsync.mockRejectedValue(new Error('Create failed'));

    const { result } = renderHook(() => useWriteTypeHeader());

    await act(async () => {
      await result.current.handlePublishClick();
    });

    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'warning');
  });

  it('modalType을 반환해야 함', () => {
    const { result } = renderHook(() => useWriteTypeHeader());

    expect(result.current.modalType).toBeDefined();
  });

  it('confirmButtonText를 반환해야 함', () => {
    const { result } = renderHook(() => useWriteTypeHeader());

    expect(result.current.confirmButtonText).toBeDefined();
  });

  it('onModalConfirm을 반환해야 함', () => {
    const { result } = renderHook(() => useWriteTypeHeader());

    expect(result.current.onModalConfirm).toBeDefined();
  });

  it('closeModal을 반환해야 함', () => {
    const { result } = renderHook(() => useWriteTypeHeader());

    expect(result.current.closeModal).toBeDefined();
  });
});
