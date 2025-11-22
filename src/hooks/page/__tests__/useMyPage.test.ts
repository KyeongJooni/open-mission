import { renderHook, act } from '@testing-library/react';
import { useMyPage } from '../useMyPage';

const mockNavigate = jest.fn();
const mockPathname = jest.fn();

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: mockPathname(),
  }),
  useNavigate: () => mockNavigate,
}));

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => ({
    user: { id: 1, nickname: 'testuser' },
  }),
}));

jest.mock('@/stores/useEditModeStore', () => ({
  useEditModeStore: (selector: any) => selector({ isEditMode: false }),
}));

describe('useMyPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('마이프로필 경로에서 isMyProfile이 true여야 함', () => {
    mockPathname.mockReturnValue('/mypage/myprofile');

    const { result } = renderHook(() => useMyPage());

    expect(result.current.isMyProfile).toBe(true);
    expect(result.current.isProfilePage).toBe(true);
  });

  it('프로필 수정 경로에서 isEditProfile이 true여야 함', () => {
    mockPathname.mockReturnValue('/mypage/editprofile');

    const { result } = renderHook(() => useMyPage());

    expect(result.current.isEditProfile).toBe(true);
    expect(result.current.isProfilePage).toBe(true);
  });

  it('일반 마이페이지 경로에서 isProfilePage가 false여야 함', () => {
    mockPathname.mockReturnValue('/mypage');

    const { result } = renderHook(() => useMyPage());

    expect(result.current.isMyProfile).toBe(false);
    expect(result.current.isEditProfile).toBe(false);
    expect(result.current.isProfilePage).toBe(false);
  });

  it('프로필 페이지에서 spacerTopHeight가 lg여야 함', () => {
    mockPathname.mockReturnValue('/mypage/myprofile');

    const { result } = renderHook(() => useMyPage());

    expect(result.current.spacerTopHeight).toBe('lg');
  });

  it('일반 페이지에서 spacerTopHeight가 md여야 함', () => {
    mockPathname.mockReturnValue('/mypage');

    const { result } = renderHook(() => useMyPage());

    expect(result.current.spacerTopHeight).toBe('md');
  });

  it('handleEditProfile이 프로필 수정 페이지로 이동해야 함', () => {
    mockPathname.mockReturnValue('/mypage/myprofile');

    const { result } = renderHook(() => useMyPage());

    act(() => {
      result.current.handleEditProfile();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/mypage/editprofile');
  });

  it('user 정보를 반환해야 함', () => {
    mockPathname.mockReturnValue('/mypage');

    const { result } = renderHook(() => useMyPage());

    expect(result.current.user).toEqual({ id: 1, nickname: 'testuser' });
  });

  it('isEditMode를 반환해야 함', () => {
    mockPathname.mockReturnValue('/mypage');

    const { result } = renderHook(() => useMyPage());

    expect(result.current.isEditMode).toBe(false);
  });

  it('title을 반환해야 함', () => {
    mockPathname.mockReturnValue('/mypage');

    const { result } = renderHook(() => useMyPage());

    expect(result.current.title).toBeDefined();
  });
});
