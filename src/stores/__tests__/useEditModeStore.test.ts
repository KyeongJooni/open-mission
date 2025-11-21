import { act } from '@testing-library/react';
import { useEditModeStore } from '../useEditModeStore';

describe('useEditModeStore', () => {
  beforeEach(() => {
    act(() => {
      useEditModeStore.setState({ isEditMode: false });
    });
  });

  describe('초기 상태', () => {
    it('초기 상태가 false여야 함', () => {
      expect(useEditModeStore.getState().isEditMode).toBe(false);
    });
  });

  describe('setEditMode', () => {
    it.each([
      [true],
      [false],
    ])('isEditMode를 %s로 설정해야 함', (value) => {
      act(() => {
        useEditModeStore.getState().setEditMode(value);
      });
      expect(useEditModeStore.getState().isEditMode).toBe(value);
    });
  });

  describe('toggleEditMode', () => {
    it('false에서 true로 토글해야 함', () => {
      act(() => {
        useEditModeStore.getState().toggleEditMode();
      });
      expect(useEditModeStore.getState().isEditMode).toBe(true);
    });

    it('true에서 false로 토글해야 함', () => {
      act(() => {
        useEditModeStore.setState({ isEditMode: true });
      });

      act(() => {
        useEditModeStore.getState().toggleEditMode();
      });
      expect(useEditModeStore.getState().isEditMode).toBe(false);
    });

    it('연속 토글이 정상 동작해야 함', () => {
      expect(useEditModeStore.getState().isEditMode).toBe(false);

      act(() => {
        useEditModeStore.getState().toggleEditMode();
      });
      expect(useEditModeStore.getState().isEditMode).toBe(true);

      act(() => {
        useEditModeStore.getState().toggleEditMode();
      });
      expect(useEditModeStore.getState().isEditMode).toBe(false);

      act(() => {
        useEditModeStore.getState().toggleEditMode();
      });
      expect(useEditModeStore.getState().isEditMode).toBe(true);
    });
  });

  describe('사용 시나리오', () => {
    it('수정 모드 진입 후 종료 플로우가 동작해야 함', () => {
      act(() => {
        useEditModeStore.getState().setEditMode(true);
      });
      expect(useEditModeStore.getState().isEditMode).toBe(true);

      act(() => {
        useEditModeStore.getState().setEditMode(false);
      });
      expect(useEditModeStore.getState().isEditMode).toBe(false);
    });
  });
});
