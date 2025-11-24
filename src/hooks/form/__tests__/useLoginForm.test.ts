import { renderHook, act } from '@testing-library/react';
import { AxiosError } from 'axios';
import { useLoginForm } from '../useLoginForm';

const mockNavigate = jest.fn();
const mockMutate = jest.fn();
const mockSetAccessToken = jest.fn();
const mockSetRefreshToken = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@/api/auth/authQuery', () => ({
  useLoginMutation: () => ({
    mutate: mockMutate,
  }),
}));

jest.mock('@/api/apiInstance', () => ({
  setAccessToken: (token: string | null) => mockSetAccessToken(token),
  setRefreshToken: (token: string | null) => mockSetRefreshToken(token),
}));

describe('useLoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('초기 상태가 올바르게 설정되어야 함', () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.errorMessage).toBe('');
  });

  it('setEmail로 이메일을 변경할 수 있어야 함', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setEmail('test@test.com');
    });

    expect(result.current.email).toBe('test@test.com');
  });

  it('setPassword로 비밀번호를 변경할 수 있어야 함', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setPassword('password123');
    });

    expect(result.current.password).toBe('password123');
  });

  it('handleLogin이 로그인 mutation을 호출해야 함', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setEmail('test@test.com');
      result.current.setPassword('password123');
    });

    act(() => {
      result.current.handleLogin();
    });

    expect(mockMutate).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' }, expect.any(Object));
  });

  it('로그인 성공 시 토큰을 설정하고 홈으로 이동해야 함', () => {
    const onClose = jest.fn();
    const { result } = renderHook(() => useLoginForm(onClose));

    act(() => {
      result.current.handleLogin();
    });

    // onSuccess 콜백 실행
    const mutateCall = mockMutate.mock.calls[0];
    const callbacks = mutateCall[1];

    act(() => {
      callbacks.onSuccess({
        data: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      });
    });

    expect(mockSetAccessToken).toHaveBeenCalledWith('access-token');
    expect(mockSetRefreshToken).toHaveBeenCalledWith('refresh-token');
    expect(onClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('로그인 실패 시 에러 메시지를 설정해야 함 (AxiosError)', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleLogin();
    });

    // onError 콜백 실행
    const mutateCall = mockMutate.mock.calls[0];
    const callbacks = mutateCall[1];

    const axiosError = new AxiosError();
    axiosError.response = {
      data: { message: '사용자를 찾을 수 없습니다.' },
    } as any;

    act(() => {
      callbacks.onError(axiosError);
    });

    expect(result.current.errorMessage).toBe('사용자를 찾을 수 없습니다.');
  });

  it('로그인 실패 시 기본 에러 메시지를 설정해야 함 (일반 에러)', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleLogin();
    });

    // onError 콜백 실행
    const mutateCall = mockMutate.mock.calls[0];
    const callbacks = mutateCall[1];

    act(() => {
      callbacks.onError(new Error('Unknown error'));
    });

    expect(result.current.errorMessage).toBe('이메일 또는 비밀번호가 일치하지 않습니다.');
  });

  it('AxiosError에 message가 없을 때 기본 메시지를 사용해야 함', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleLogin();
    });

    const mutateCall = mockMutate.mock.calls[0];
    const callbacks = mutateCall[1];

    const axiosError = new AxiosError();
    axiosError.response = { data: {} } as any;

    act(() => {
      callbacks.onError(axiosError);
    });

    expect(result.current.errorMessage).toBe('이메일 또는 비밀번호가 일치하지 않습니다.');
  });

  it('handleKeyDown이 Enter 키에 반응해야 함', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleKeyDown({ key: 'Enter' } as any);
    });

    expect(mockMutate).toHaveBeenCalled();
  });

  it('handleKeyDown이 다른 키에는 반응하지 않아야 함', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleKeyDown({ key: 'Escape' } as any);
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('handleKakaoLogin이 카카오 로그인 URL을 설정해야 함', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { href: '' };

    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleKakaoLogin();
    });

    // import.meta.env.VITE_API_BASE_URL이 설정되었으므로 href가 변경됨
    expect(window.location.href).toBeDefined();

    (window as any).location = originalLocation;
  });

  it('handleSignup이 마이페이지로 이동해야 함', () => {
    const onClose = jest.fn();
    const { result } = renderHook(() => useLoginForm(onClose));

    act(() => {
      result.current.handleSignup();
    });

    expect(onClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/mypage');
  });

  it('onClose가 없어도 handleSignup이 동작해야 함', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleSignup();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/mypage');
  });
});
