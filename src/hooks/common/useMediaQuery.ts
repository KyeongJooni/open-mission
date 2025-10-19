import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // 초기값 설정
    setMatches(mediaQuery.matches);

    // 미디어 쿼리 변경 감지
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 이벤트 리스너 등록
    mediaQuery.addEventListener('change', handleChange);

    // 클린업
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

export const useIsMobile = (breakpoint = 768): boolean => {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
};

export const useIsDesktop = (breakpoint = 768): boolean => {
  return useMediaQuery(`(min-width: ${breakpoint}px)`);
};
