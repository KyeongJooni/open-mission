import { renderHook, act } from '@testing-library/react';
import { useSidebar } from '../useSidebar';

const mockNavigate = jest.fn();
const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();
const mockLogout = jest.fn();
const mockQueryClientClear = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    clear: mockQueryClientClear,
  }),
}));

jest.mock('@/stores/useModalStore', () => ({
  useModalStore: () => ({
    openModal: mockOpenModal,
    closeModal: mockCloseModal,
  }),
}));

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ logout: mockLogout }),
}));

describe('useSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('초기 상태에서 사이드바가 닫혀있어야 함', () => {
    const { result } = renderHook(() => useSidebar());
    expect(result.current.isSidebarOpen).toBe(false);
  });

  it('toggleSidebar로 사이드바를 열고 닫을 수 있어야 함', () => {
    const { result } = renderHook(() => useSidebar());

    act(() => {
      result.current.toggleSidebar();
    });
    expect(result.current.isSidebarOpen).toBe(true);

    act(() => {
      result.current.toggleSidebar();
    });
    expect(result.current.isSidebarOpen).toBe(false);
  });

  it('openSidebar로 사이드바를 열 수 있어야 함', () => {
    const { result } = renderHook(() => useSidebar());

    act(() => {
      result.current.openSidebar();
    });
    expect(result.current.isSidebarOpen).toBe(true);
  });

  it('closeSidebar로 사이드바를 닫을 수 있어야 함', () => {
    const { result } = renderHook(() => useSidebar());

    act(() => {
      result.current.openSidebar();
    });
    expect(result.current.isSidebarOpen).toBe(true);

    act(() => {
      result.current.closeSidebar();
    });
    expect(result.current.isSidebarOpen).toBe(false);
  });

  it('handleStartGitlog이 로그인 모달을 열어야 함', () => {
    const { result } = renderHook(() => useSidebar());

    act(() => {
      result.current.handleStartGitlog();
    });

    expect(mockOpenModal).toHaveBeenCalledWith('login');
  });

  it('handleMyGitlog이 마이프로필 페이지로 이동해야 함', () => {
    const { result } = renderHook(() => useSidebar());

    act(() => {
      result.current.handleMyGitlog();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/mypage/myprofile');
  });

  it('handleWriteGitlog이 글쓰기 페이지로 이동해야 함', () => {
    const { result } = renderHook(() => useSidebar());

    act(() => {
      result.current.handleWriteGitlog();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/blog/write');
  });

  it('handleSettings가 사이드바를 닫아야 함', () => {
    const { result } = renderHook(() => useSidebar());

    act(() => {
      result.current.openSidebar();
    });

    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    act(() => {
      result.current.handleSettings();
    });

    expect(dispatchEventSpy).toHaveBeenCalled();
  });

  it('handleLogout이 로그아웃 확인 모달을 열어야 함', () => {
    const { result } = renderHook(() => useSidebar());

    act(() => {
      result.current.handleLogout();
    });

    expect(mockOpenModal).toHaveBeenCalledWith('logout', expect.any(String), expect.any(Function), expect.any(String));
  });

  it('로그아웃 확인 시 로그아웃을 수행해야 함', () => {
    const { result } = renderHook(() => useSidebar());

    act(() => {
      result.current.handleLogout();
    });

    // 세 번째 인자로 전달된 confirmLogout 함수 실행
    const confirmLogout = mockOpenModal.mock.calls[0][2];
    act(() => {
      confirmLogout();
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockQueryClientClear).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('sidebarRef를 반환해야 함', () => {
    const { result } = renderHook(() => useSidebar());
    expect(result.current.sidebarRef).toBeDefined();
  });

  it('sidebar:close 이벤트에 반응해야 함', () => {
    const { result } = renderHook(() => useSidebar());

    act(() => {
      result.current.openSidebar();
    });
    expect(result.current.isSidebarOpen).toBe(true);

    act(() => {
      window.dispatchEvent(new CustomEvent('sidebar:close'));
    });
    expect(result.current.isSidebarOpen).toBe(false);
  });

  it('외부 클릭 시 사이드바가 닫혀야 함', () => {
    const { result } = renderHook(() => useSidebar());

    // sidebarRef에 element 설정
    const sidebarElement = document.createElement('div');
    const outsideElement = document.createElement('div');
    document.body.appendChild(sidebarElement);
    document.body.appendChild(outsideElement);

    Object.defineProperty(result.current.sidebarRef, 'current', {
      value: sidebarElement,
      writable: true,
    });

    act(() => {
      result.current.openSidebar();
    });
    expect(result.current.isSidebarOpen).toBe(true);

    // 외부 클릭 시뮬레이션
    act(() => {
      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent, 'target', { value: outsideElement });
      document.dispatchEvent(mouseEvent);
    });

    expect(result.current.isSidebarOpen).toBe(false);

    document.body.removeChild(sidebarElement);
    document.body.removeChild(outsideElement);
  });
});
