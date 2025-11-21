import { renderHook, act } from '@testing-library/react';
import { useMediaQuery, useIsMobile, useIsDesktop } from '../useMediaQuery';

describe('useMediaQuery', () => {
  const createMockMatchMedia = (matches: boolean) => {
    const listeners: Array<(e: MediaQueryListEvent) => void> = [];

    const mockMediaQuery = {
      matches,
      media: '',
      onchange: null,
      addEventListener: jest.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          listeners.push(listener);
        }
      }),
      removeEventListener: jest.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          const index = listeners.indexOf(listener);
          if (index > -1) {
            listeners.splice(index, 1);
          }
        }
      }),
      dispatchEvent: jest.fn(),
      trigger: (newMatches: boolean) => {
        listeners.forEach(listener => {
          listener({ matches: newMatches } as MediaQueryListEvent);
        });
      },
    };

    return mockMediaQuery;
  };

  let mockMatchMedia: ReturnType<typeof createMockMatchMedia>;

  beforeEach(() => {
    mockMatchMedia = createMockMatchMedia(false);
    window.matchMedia = jest.fn().mockImplementation(() => mockMatchMedia);
  });

  describe('초기 상태', () => {
    it('초기 matches 값을 반환해야 함', () => {
      mockMatchMedia = createMockMatchMedia(true);
      window.matchMedia = jest.fn().mockImplementation(() => mockMatchMedia);

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      expect(result.current).toBe(true);
    });

    it('매치되지 않으면 false를 반환해야 함', () => {
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      expect(result.current).toBe(false);
    });
  });

  describe('이벤트 리스너', () => {
    it('change 이벤트 리스너를 등록해야 함', () => {
      renderHook(() => useMediaQuery('(min-width: 768px)'));
      expect(mockMatchMedia.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('언마운트 시 이벤트 리스너를 제거해야 함', () => {
      const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      unmount();
      expect(mockMatchMedia.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('미디어 쿼리 변경 시 상태가 업데이트되어야 함', () => {
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      expect(result.current).toBe(false);

      act(() => {
        mockMatchMedia.trigger(true);
      });

      expect(result.current).toBe(true);
    });
  });

  describe('쿼리 변경', () => {
    it('쿼리가 변경되면 새 미디어 쿼리로 업데이트해야 함', () => {
      const { rerender } = renderHook(
        ({ query }) => useMediaQuery(query),
        { initialProps: { query: '(min-width: 768px)' } }
      );

      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');

      rerender({ query: '(min-width: 1024px)' });
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
    });
  });
});

describe('useIsMobile', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === '(max-width: 767px)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  });

  it('기본 breakpoint(768px)를 사용해야 함', () => {
    renderHook(() => useIsMobile());
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });

  it('커스텀 breakpoint를 사용해야 함', () => {
    renderHook(() => useIsMobile(1024));
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 1023px)');
  });
});

describe('useIsDesktop', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === '(min-width: 768px)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  });

  it('기본 breakpoint(768px)를 사용해야 함', () => {
    renderHook(() => useIsDesktop());
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('커스텀 breakpoint를 사용해야 함', () => {
    renderHook(() => useIsDesktop(1024));
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
  });
});
