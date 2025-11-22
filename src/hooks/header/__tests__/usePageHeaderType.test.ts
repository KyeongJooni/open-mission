import { renderHook } from '@testing-library/react';
import { usePageHeaderType } from '../usePageHeaderType';

const mockPathname = jest.fn();

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: mockPathname(),
  }),
}));

describe('usePageHeaderType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('홈 경로에서는 main을 반환해야 함', () => {
    mockPathname.mockReturnValue('/');

    const { result } = renderHook(() => usePageHeaderType());

    expect(result.current).toBe('main');
  });

  it('글쓰기 경로에서는 write를 반환해야 함', () => {
    mockPathname.mockReturnValue('/blog/write');

    const { result } = renderHook(() => usePageHeaderType());

    expect(result.current).toBe('write');
  });

  it('마이프로필 경로에서는 main을 반환해야 함', () => {
    mockPathname.mockReturnValue('/mypage/myprofile');

    const { result } = renderHook(() => usePageHeaderType());

    expect(result.current).toBe('main');
  });

  it('프로필 수정 경로에서는 editprofile을 반환해야 함', () => {
    mockPathname.mockReturnValue('/mypage/editprofile');

    const { result } = renderHook(() => usePageHeaderType());

    expect(result.current).toBe('editprofile');
  });

  it('마이페이지 경로에서는 mypage를 반환해야 함', () => {
    mockPathname.mockReturnValue('/mypage');

    const { result } = renderHook(() => usePageHeaderType());

    expect(result.current).toBe('mypage');
  });

  it('마이페이지 하위 경로에서는 mypage를 반환해야 함', () => {
    mockPathname.mockReturnValue('/mypage/signup');

    const { result } = renderHook(() => usePageHeaderType());

    expect(result.current).toBe('mypage');
  });

  it('블로그 상세 경로에서는 detail을 반환해야 함', () => {
    mockPathname.mockReturnValue('/blog/123');

    const { result } = renderHook(() => usePageHeaderType());

    expect(result.current).toBe('detail');
  });

  it('알 수 없는 경로에서는 detail을 반환해야 함', () => {
    mockPathname.mockReturnValue('/unknown');

    const { result } = renderHook(() => usePageHeaderType());

    expect(result.current).toBe('detail');
  });
});
