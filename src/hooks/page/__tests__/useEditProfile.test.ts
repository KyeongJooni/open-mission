import { renderHook, act } from '@testing-library/react';
import { useEditProfile } from '../useEditProfile';

const mockSetEditMode = jest.fn();
const mockNavigate = jest.fn();
const mockShowToast = jest.fn();
const mockUploadImage = jest.fn();
const mockSetPreviewImage = jest.fn();
const mockGeneratePreview = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@/stores/useEditModeStore', () => ({
  useEditModeStore: () => ({
    setEditMode: mockSetEditMode,
    isEditMode: false,
  }),
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => ({
    user: {
      nickname: '테스트',
      introduction: '소개',
      profilePicture: 'https://example.com/profile.png',
    },
  }),
  useUpdateUser: () => ({ mutate: jest.fn() }),
  useUpdateNickname: () => ({ mutate: jest.fn() }),
  useUpdateProfilePicture: () => ({ mutateAsync: jest.fn() }),
}));

jest.mock('@/hooks/common/useS3ImageUpload', () => ({
  useS3ImageUpload: () => ({
    uploadImage: mockUploadImage,
  }),
}));

jest.mock('@/hooks/common/useImagePreview', () => ({
  useImagePreview: () => ({
    previewImage: '',
    setPreviewImage: mockSetPreviewImage,
    generatePreview: mockGeneratePreview,
  }),
}));

describe('useEditProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('초기 상태를 반환해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    expect(result.current.handleEdit).toBeDefined();
    expect(result.current.handleCancel).toBeDefined();
    expect(result.current.handleSave).toBeDefined();
    expect(result.current.validateField).toBeDefined();
  });

  it('handleEdit 호출 시 setEditMode(true)를 호출해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    act(() => {
      result.current.handleEdit();
    });

    expect(mockSetEditMode).toHaveBeenCalledWith(true);
  });

  it('handleCancel 호출 시 setEditMode(false)를 호출해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    act(() => {
      result.current.handleCancel();
    });

    expect(mockSetEditMode).toHaveBeenCalledWith(false);
  });

  it('validateField가 올바른 검증을 수행해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    const nicknameError = result.current.validateField('nickname', '');
    expect(nicknameError).toBeDefined();

    const validNickname = result.current.validateField('nickname', 'validNickname123');
    expect(validNickname).toBeUndefined();
  });

  it('headerNickname과 headerIntroduction을 반환해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    expect(result.current.headerNickname).toBe('테스트');
    expect(result.current.headerIntroduction).toBe('소개');
  });

  it('setHeaderNickname과 setHeaderIntroduction이 정의되어 있어야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    expect(result.current.setHeaderNickname).toBeDefined();
    expect(result.current.setHeaderIntroduction).toBeDefined();
  });
});
