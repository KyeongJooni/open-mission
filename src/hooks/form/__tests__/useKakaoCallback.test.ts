import { renderHook } from '@testing-library/react';
import { useKakaoCallback } from '../useKakaoCallback';

const mockNavigate = jest.fn();
const mockMutate = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockSetIsKakaoUser = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock('@/api/auth/authQuery', () => ({
  useKakaoCallbackMutation: () => ({
    mutate: mockMutate,
    isPending: false,
    isError: false,
    error: null,
  }),
}));

jest.mock('@/api/apiInstance', () => ({
  setAccessToken: jest.fn(),
  setRefreshToken: jest.fn(),
}));

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ setIsKakaoUser: mockSetIsKakaoUser }),
}));

describe('useKakaoCallback', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    delete (window as any).location;
    window.location = { search: '', href: '' } as any;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('code가 없을 때 홈으로 이동해야 함', () => {
    window.location.search = '';

    renderHook(() => useKakaoCallback());

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('isLoading 상태를 반환해야 함', () => {
    window.location.search = '';

    const { result } = renderHook(() => useKakaoCallback());

    expect(result.current.isLoading).toBe(false);
  });

  it('isError 상태를 반환해야 함', () => {
    window.location.search = '';

    const { result } = renderHook(() => useKakaoCallback());

    expect(result.current.isError).toBe(false);
  });

  it('error를 반환해야 함', () => {
    window.location.search = '';

    const { result } = renderHook(() => useKakaoCallback());

    expect(result.current.error).toBe(null);
  });
});
