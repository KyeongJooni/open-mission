import { renderHook, act } from '@testing-library/react';
import { useSignup } from '../useSignup';

const mockNavigate = jest.fn();
const mockShowToast = jest.fn();
const mockRegisterMutate = jest.fn();
const mockRegisterOAuthMutate = jest.fn();
const mockUploadImage = jest.fn();
const mockSetIsKakaoUser = jest.fn();
const mockInvalidateQueries = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock('@/api/auth/authQuery', () => ({
  useRegisterMutation: () => ({
    mutate: mockRegisterMutate,
  }),
  useRegisterOAuthMutation: () => ({
    mutate: mockRegisterOAuthMutate,
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

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@/api/apiInstance', () => ({
  setAccessToken: jest.fn(),
  setRefreshToken: jest.fn(),
}));

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ setIsKakaoUser: mockSetIsKakaoUser }),
}));

describe('useSignup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('초기 상태가 올바르게 설정되어야 함', () => {
    const { result } = renderHook(() => useSignup('default.jpg'));

    expect(result.current.isCompleteModalOpen).toBe(false);
    expect(result.current.isLoginModalOpen).toBe(false);
    expect(result.current.isKakaoSignup).toBe(false);
  });

  it('카카오 회원가입 상태를 감지해야 함', () => {
    sessionStorage.setItem('isKakaoSignup', 'true');
    sessionStorage.setItem('kakaoId', '12345');

    const { result } = renderHook(() => useSignup('default.jpg'));

    expect(result.current.isKakaoSignup).toBe(true);
  });

  it('handleButtonClick이 파일 입력을 클릭해야 함', () => {
    const { result } = renderHook(() => useSignup('default.jpg'));

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

  it('handleImageUpload가 파일이 없을 때 아무것도 하지 않아야 함', async () => {
    const { result } = renderHook(() => useSignup('default.jpg'));

    await act(async () => {
      await result.current.handleImageUpload({ target: { files: null } } as any);
    });

    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  it('onSubmit이 일반 회원가입을 수행해야 함', () => {
    const { result } = renderHook(() => useSignup('default.jpg'));

    act(() => {
      result.current.onSubmit({
        email: 'test@test.com',
        password: 'Password1!',
        nickname: 'testuser',
        birthDate: '1990-01-01',
        name: 'Test User',
        introduction: 'Hello',
      });
    });

    expect(mockRegisterMutate).toHaveBeenCalled();
  });

  it('일반 회원가입 성공 시 완료 모달을 열어야 함', () => {
    const { result } = renderHook(() => useSignup('default.jpg'));

    act(() => {
      result.current.onSubmit({
        email: 'test@test.com',
        password: 'Password1!',
        nickname: 'testuser',
        birthDate: '1990-01-01',
        name: 'Test User',
      });
    });

    // onSuccess 콜백 실행
    const mutateCall = mockRegisterMutate.mock.calls[0];
    const callbacks = mutateCall[1];

    act(() => {
      callbacks.onSuccess();
    });

    expect(result.current.isCompleteModalOpen).toBe(true);
  });

  it('일반 회원가입 실패 시 토스트를 표시해야 함', () => {
    const { result } = renderHook(() => useSignup('default.jpg'));

    act(() => {
      result.current.onSubmit({
        email: 'test@test.com',
        password: 'Password1!',
        nickname: 'testuser',
        birthDate: '1990-01-01',
        name: 'Test User',
      });
    });

    const mutateCall = mockRegisterMutate.mock.calls[0];
    const callbacks = mutateCall[1];

    act(() => {
      callbacks.onError();
    });

    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'warning');
  });

  it('카카오 회원가입을 수행해야 함', () => {
    sessionStorage.setItem('isKakaoSignup', 'true');
    sessionStorage.setItem('kakaoId', '12345');

    const { result } = renderHook(() => useSignup('default.jpg'));

    act(() => {
      result.current.onSubmit({
        email: 'test@test.com',
        password: '',
        nickname: 'testuser',
        birthDate: '1990-01-01',
        name: 'Test User',
      });
    });

    expect(mockRegisterOAuthMutate).toHaveBeenCalled();
  });

  it('카카오 회원가입 시 kakaoId가 없으면 아무것도 하지 않아야 함', () => {
    sessionStorage.setItem('isKakaoSignup', 'true');
    // kakaoId 없음

    const { result } = renderHook(() => useSignup('default.jpg'));

    act(() => {
      result.current.onSubmit({
        email: 'test@test.com',
        password: '',
        nickname: 'testuser',
        birthDate: '1990-01-01',
        name: 'Test User',
      });
    });

    expect(mockRegisterOAuthMutate).not.toHaveBeenCalled();
  });

  it('handleLoginRedirect가 로그인 모달을 열어야 함', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useSignup('default.jpg'));

    act(() => {
      result.current.setIsCompleteModalOpen(true);
    });

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

  it('setIsCompleteModalOpen으로 모달을 제어할 수 있어야 함', () => {
    const { result } = renderHook(() => useSignup('default.jpg'));

    act(() => {
      result.current.setIsCompleteModalOpen(true);
    });
    expect(result.current.isCompleteModalOpen).toBe(true);

    act(() => {
      result.current.setIsCompleteModalOpen(false);
    });
    expect(result.current.isCompleteModalOpen).toBe(false);
  });

  it('setIsLoginModalOpen으로 모달을 제어할 수 있어야 함', () => {
    const { result } = renderHook(() => useSignup('default.jpg'));

    act(() => {
      result.current.setIsLoginModalOpen(true);
    });
    expect(result.current.isLoginModalOpen).toBe(true);

    act(() => {
      result.current.setIsLoginModalOpen(false);
    });
    expect(result.current.isLoginModalOpen).toBe(false);
  });

  it('form을 반환해야 함', () => {
    const { result } = renderHook(() => useSignup('default.jpg'));

    expect(result.current.form).toBeDefined();
  });

  it('fileInputRef를 반환해야 함', () => {
    const { result } = renderHook(() => useSignup('default.jpg'));

    expect(result.current.fileInputRef).toBeDefined();
  });
});
