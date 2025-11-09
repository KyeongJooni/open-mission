import { useEffect } from 'react';

export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    // 스크롤바 너비 계산
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    const fixedElements = document.querySelectorAll('.page-header-container');
    const previousFixedRights: string[] = [];

    fixedElements.forEach(el => {
      previousFixedRights.push((el as HTMLElement).style.right);
    });

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    fixedElements.forEach(el => {
      (el as HTMLElement).style.right = `${scrollbarWidth / 2}px`;
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;

      fixedElements.forEach((el, index) => {
        (el as HTMLElement).style.right = previousFixedRights[index];
      });
    };
  }, [isLocked]);
};
