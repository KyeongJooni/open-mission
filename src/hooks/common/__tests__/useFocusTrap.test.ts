import { renderHook } from '@testing-library/react';
import { useFocusTrap } from '../useFocusTrap';

describe('useFocusTrap', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <button id="first">First</button>
      <input id="middle" type="text" />
      <button id="last">Last</button>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('활성화 상태', () => {
    it('isActive가 true면 첫 번째 요소에 포커스해야 함', () => {
      const ref = { current: container };

      renderHook(() => useFocusTrap(ref, true));

      expect(document.activeElement).toBe(container.querySelector('#first'));
    });

    it('isActive가 false면 포커스하지 않아야 함', () => {
      const ref = { current: container };

      renderHook(() => useFocusTrap(ref, false));

      expect(document.activeElement).not.toBe(container.querySelector('#first'));
    });

    it('ref가 null이면 아무것도 하지 않아야 함', () => {
      const ref = { current: null };

      expect(() => {
        renderHook(() => useFocusTrap(ref, true));
      }).not.toThrow();
    });
  });

  describe('Tab 키 처리', () => {
    it('마지막 요소에서 Tab 누르면 첫 번째 요소로 이동해야 함', () => {
      const ref = { current: container };
      renderHook(() => useFocusTrap(ref, true));

      const lastButton = container.querySelector('#last') as HTMLButtonElement;
      lastButton.focus();

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      container.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(container.querySelector('#first'));
    });

    it('첫 번째 요소에서 Shift+Tab 누르면 마지막 요소로 이동해야 함', () => {
      const ref = { current: container };
      renderHook(() => useFocusTrap(ref, true));

      const firstButton = container.querySelector('#first') as HTMLButtonElement;
      firstButton.focus();

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      container.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(container.querySelector('#last'));
    });

    it('중간 요소에서 Tab 누르면 기본 동작을 허용해야 함', () => {
      const ref = { current: container };
      renderHook(() => useFocusTrap(ref, true));

      const middleInput = container.querySelector('#middle') as HTMLInputElement;
      middleInput.focus();

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      container.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('Tab이 아닌 키는 무시해야 함', () => {
      const ref = { current: container };
      renderHook(() => useFocusTrap(ref, true));

      const lastButton = container.querySelector('#last') as HTMLButtonElement;
      lastButton.focus();

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      container.dispatchEvent(event);

      expect(document.activeElement).toBe(lastButton);
    });
  });

  describe('cleanup', () => {
    it('언마운트 시 이벤트 리스너를 제거해야 함', () => {
      const ref = { current: container };
      const removeEventListenerSpy = jest.spyOn(container, 'removeEventListener');

      const { unmount } = renderHook(() => useFocusTrap(ref, true));
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('빈 컨테이너', () => {
    it('포커스 가능한 요소가 없어도 에러가 발생하지 않아야 함', () => {
      const emptyContainer = document.createElement('div');
      document.body.appendChild(emptyContainer);

      const ref = { current: emptyContainer };

      expect(() => {
        renderHook(() => useFocusTrap(ref, true));
      }).not.toThrow();

      document.body.removeChild(emptyContainer);
    });
  });
});
