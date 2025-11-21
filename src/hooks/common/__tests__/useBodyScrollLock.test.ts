import { renderHook } from '@testing-library/react';
import { useBodyScrollLock } from '../useBodyScrollLock';

describe('useBodyScrollLock', () => {
  const originalOverflow = document.body.style.overflow;
  const originalPaddingRight = document.body.style.paddingRight;

  beforeEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  afterEach(() => {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  });

  describe('스크롤 잠금', () => {
    it('isLocked가 true면 스크롤을 잠가야 함', () => {
      renderHook(() => useBodyScrollLock(true));
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('isLocked가 false면 스크롤을 잠그지 않아야 함', () => {
      renderHook(() => useBodyScrollLock(false));
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('cleanup', () => {
    it('언마운트 시 스크롤 잠금을 해제해야 함', () => {
      const { unmount } = renderHook(() => useBodyScrollLock(true));
      expect(document.body.style.overflow).toBe('hidden');

      unmount();
      expect(document.body.style.overflow).toBe('');
    });

    it('이전 overflow 값을 복원해야 함', () => {
      document.body.style.overflow = 'auto';

      const { unmount } = renderHook(() => useBodyScrollLock(true));
      expect(document.body.style.overflow).toBe('hidden');

      unmount();
      expect(document.body.style.overflow).toBe('auto');
    });
  });

  describe('상태 변경', () => {
    it('isLocked가 변경되면 스크롤 잠금 상태가 변경되어야 함', () => {
      const { rerender } = renderHook(
        ({ isLocked }) => useBodyScrollLock(isLocked),
        { initialProps: { isLocked: false } }
      );

      expect(document.body.style.overflow).toBe('');

      rerender({ isLocked: true });
      expect(document.body.style.overflow).toBe('hidden');

      rerender({ isLocked: false });
      expect(document.body.style.overflow).toBe('');
    });
  });
});
