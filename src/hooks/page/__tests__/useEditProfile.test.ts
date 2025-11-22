import { renderHook, act } from '@testing-library/react';
import { useEditProfile } from '../useEditProfile';

const mockNavigate = jest.fn();
const mockShowToast = jest.fn();
const mockSetEditMode = jest.fn();
const mockUploadImage = jest.fn();
const mockMutate = jest.fn();
const mockMutateAsync = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@/stores/useEditModeStore', () => ({
  useEditModeStore: () => ({
    setEditMode: mockSetEditMode,
    isEditMode: false,
  }),
}));

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      nickname: 'testuser',
      email: 'test@test.com',
      introduction: 'Hello',
      profilePicture: 'profile.jpg',
    },
  }),
  useUpdateUser: () => ({ mutate: mockMutate }),
  useUpdateNickname: () => ({ mutate: mockMutate }),
  useUpdateProfilePicture: () => ({ mutateAsync: mockMutateAsync }),
}));

jest.mock('@/hooks/common/useS3ImageUpload', () => ({
  useS3ImageUpload: () => ({
    uploadImage: mockUploadImage,
  }),
}));

jest.mock('@/hooks/common/useImagePreview', () => ({
  useImagePreview: () => ({
    previewImage: 'preview.jpg',
    setPreviewImage: jest.fn(),
    generatePreview: jest.fn(),
  }),
}));

describe('useEditProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('초기 상태를 올바르게 반환해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    expect(result.current.headerNickname).toBe('testuser');
    expect(result.current.headerIntroduction).toBe('Hello');
  });

  it('handleEdit이 편집 모드를 활성화해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    act(() => {
      result.current.handleEdit();
    });

    expect(mockSetEditMode).toHaveBeenCalledWith(true);
  });

  it('handleCancel이 편집 모드를 비활성화해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    act(() => {
      result.current.handleCancel();
    });

    expect(mockSetEditMode).toHaveBeenCalledWith(false);
  });

  it('handleProfileImageClick이 파일 입력을 클릭해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    const mockClick = jest.fn();
    Object.defineProperty(result.current.fileInputRef, 'current', {
      value: { click: mockClick },
      writable: true,
    });

    act(() => {
      result.current.handleProfileImageClick();
    });

    expect(mockClick).toHaveBeenCalled();
  });

  it('handleImageUpload가 파일이 없을 때 아무것도 하지 않아야 함', async () => {
    const { result } = renderHook(() => useEditProfile());

    await act(async () => {
      await result.current.handleImageUpload({ target: { files: null } } as any);
    });
  });

  it('handleSave가 변경사항이 없을 때 경고를 표시해야 함', async () => {
    const { result } = renderHook(() => useEditProfile());

    await act(async () => {
      await result.current.handleSave({
        nickname: 'testuser',
        introduction: 'Hello',
      });
    });

    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'warning');
  });

  it('validateField가 닉네임을 검증해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    const error = result.current.validateField('nickname', '');
    expect(error).toBeDefined();

    const valid = result.current.validateField('nickname', 'validname');
    expect(valid).toBeUndefined();
  });

  it('validateField가 bio를 검증해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    const valid = result.current.validateField('bio', 'Valid bio');
    expect(valid).toBeUndefined();
  });

  it('setHeaderNickname 함수가 존재해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    expect(result.current.setHeaderNickname).toBeDefined();
    expect(typeof result.current.setHeaderNickname).toBe('function');
  });

  it('setHeaderIntroduction 함수가 존재해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    expect(result.current.setHeaderIntroduction).toBeDefined();
    expect(typeof result.current.setHeaderIntroduction).toBe('function');
  });

  it('previewImage를 반환해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    expect(result.current.previewImage).toBe('preview.jpg');
  });

  it('fileInputRef를 반환해야 함', () => {
    const { result } = renderHook(() => useEditProfile());

    expect(result.current.fileInputRef).toBeDefined();
  });
});
