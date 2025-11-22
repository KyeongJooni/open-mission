import { renderHook, act } from '@testing-library/react';
import { useSignup } from '../useSignup';

const mockNavigate = jest.fn();
const mockShowToast = jest.fn();
const mockMutate = jest.fn();
const mockUploadImage = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockSetIsKakaoUser = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock('@/api/auth/authQuery', () => ({
  useRegisterMutation: () => ({
    mutate: mockMutate,
  }),
  useRegisterOAuthMutation: () => ({
    mutate: mockMutate,
  }),
}));

jest.mock('@/hooks/common/useS3ImageUpload', () => ({
  useS3ImageUpload: () => ({
    uploadImage: mockUploadImage,
  }),
}));

jest.mock('@/hooks/common/useImagePreview', () => ({
  useImagePreview: () => ({
    previewImage: '',
    setPreviewImage: jest.fn(),
    generatePreview: jest.fn(),
  }),
}));

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ setIsKakaoUser: mockSetIsKakaoUser }),
}));

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn(),
    formState: { errors: {} },
    reset: jest.fn(),
  }),
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(),
}));

describe('useSignup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('기본 상태를 반환해야 함', () => {
    const { result } = renderHook(() => useSignup('default-image.png'));

    expect(result.current.previewImage).toBeDefined();
    expect(result.current.fileInputRef).toBeDefined();
    expect(result.current.handleImageUpload).toBeDefined();
    expect(result.current.handleButtonClick).toBeDefined();
    expect(result.current.form).toBeDefined();
    expect(result.current.onSubmit).toBeDefined();
    expect(result.current.isCompleteModalOpen).toBe(false);
    expect(result.current.isLoginModalOpen).toBe(false);
    expect(result.current.isKakaoSignup).toBe(false);
  });

  it('handleButtonClick이 fileInputRef.current.click을 호출해야 함', () => {
    const { result } = renderHook(() => useSignup('default-image.png'));

    const mockClick = jest.fn();
    Object.defineProperty(result.current.fileInputRef, 'current', {
      value: { click: mockClick },
      writable: true,
    });

    act(() => {
      result.current.handleButtonClick();
    });

    expect(mockClick).toHaveBeenCalled();
  });

  it('handleLoginRedirect가 모달 상태를 변경해야 함', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useSignup('default-image.png'));

    act(() => {
      result.current.setIsCompleteModalOpen(true);
    });

    expect(result.current.isCompleteModalOpen).toBe(true);

    act(() => {
      result.current.handleLoginRedirect();
    });

    expect(result.current.isCompleteModalOpen).toBe(false);

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoginModalOpen).toBe(true);
    jest.useRealTimers();
  });

  it('카카오 회원가입 플래그를 올바르게 처리해야 함', () => {
    sessionStorage.setItem('isKakaoSignup', 'true');
    sessionStorage.setItem('kakaoId', '12345');

    const { result } = renderHook(() => useSignup('default-image.png'));

    expect(result.current.isKakaoSignup).toBe(true);
  });

  it('onSubmit이 일반 회원가입을 처리해야 함', () => {
    const { result } = renderHook(() => useSignup('default-image.png'));

    act(() => {
      result.current.onSubmit({
        email: 'test@example.com',
        nickname: 'testuser',
        password: 'password123',
        passwordConfirm: 'password123',
        birthDate: '1990-01-01',
        name: 'Test User',
        introduction: 'Hello',
      });
    });

    expect(mockMutate).toHaveBeenCalled();
  });

  it('setIsCompleteModalOpen이 모달 상태를 변경해야 함', () => {
    const { result } = renderHook(() => useSignup('default-image.png'));

    act(() => {
      result.current.setIsCompleteModalOpen(true);
    });

    expect(result.current.isCompleteModalOpen).toBe(true);
  });

  it('setIsLoginModalOpen이 모달 상태를 변경해야 함', () => {
    const { result } = renderHook(() => useSignup('default-image.png'));

    act(() => {
      result.current.setIsLoginModalOpen(true);
    });

    expect(result.current.isLoginModalOpen).toBe(true);
  });
});
