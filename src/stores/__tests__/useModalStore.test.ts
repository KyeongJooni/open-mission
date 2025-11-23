import { act } from '@testing-library/react';
import { useModalStore } from '../useModalStore';

describe('useModalStore', () => {
  beforeEach(() => {
    act(() => {
      useModalStore.getState().closeModal();
    });
  });

  describe('초기 상태', () => {
    it('초기 상태가 올바르게 설정되어야 함', () => {
      const state = useModalStore.getState();
      expect(state.modalType).toBeNull();
      expect(state.modalMessage).toBeUndefined();
      expect(state.confirmButtonText).toBeUndefined();
      expect(state.onModalConfirm).toBeUndefined();
    });
  });

  describe('openModal', () => {
    it.each([['login'], ['message'], ['logout'], ['delete']] as const)('%s 타입 모달을 열어야 함', type => {
      act(() => {
        useModalStore.getState().openModal(type);
      });
      expect(useModalStore.getState().modalType).toBe(type);
    });

    it('메시지와 함께 모달을 열어야 함', () => {
      act(() => {
        useModalStore.getState().openModal('message', '테스트 메시지');
      });

      const state = useModalStore.getState();
      expect(state.modalType).toBe('message');
      expect(state.modalMessage).toBe('테스트 메시지');
    });

    it('확인 콜백과 함께 모달을 열어야 함', () => {
      const onConfirm = jest.fn();

      act(() => {
        useModalStore.getState().openModal('delete', '삭제하시겠습니까?', onConfirm);
      });

      const state = useModalStore.getState();
      expect(state.modalType).toBe('delete');
      expect(state.modalMessage).toBe('삭제하시겠습니까?');
      expect(state.onModalConfirm).toBe(onConfirm);
    });

    it('확인 버튼 텍스트를 설정해야 함', () => {
      act(() => {
        useModalStore.getState().openModal('logout', '로그아웃하시겠습니까?', jest.fn(), '확인');
      });

      expect(useModalStore.getState().confirmButtonText).toBe('확인');
    });

    it('모든 파라미터를 설정해야 함', () => {
      const onConfirm = jest.fn();

      act(() => {
        useModalStore.getState().openModal('delete', '정말 삭제?', onConfirm, '삭제');
      });

      const state = useModalStore.getState();
      expect(state.modalType).toBe('delete');
      expect(state.modalMessage).toBe('정말 삭제?');
      expect(state.onModalConfirm).toBe(onConfirm);
      expect(state.confirmButtonText).toBe('삭제');
    });
  });

  describe('closeModal', () => {
    beforeEach(() => {
      act(() => {
        useModalStore.getState().openModal('delete', '메시지', jest.fn(), '확인');
      });
    });

    it('모달을 닫아야 함', () => {
      act(() => {
        useModalStore.getState().closeModal();
      });

      expect(useModalStore.getState().modalType).toBeNull();
    });

    it('모든 상태를 초기화해야 함', () => {
      act(() => {
        useModalStore.getState().closeModal();
      });

      const state = useModalStore.getState();
      expect(state.modalType).toBeNull();
      expect(state.modalMessage).toBeUndefined();
      expect(state.confirmButtonText).toBeUndefined();
      expect(state.onModalConfirm).toBeUndefined();
    });
  });

  describe('사용 시나리오', () => {
    it('로그인 모달 플로우가 동작해야 함', () => {
      act(() => {
        useModalStore.getState().openModal('login');
      });

      expect(useModalStore.getState().modalType).toBe('login');

      act(() => {
        useModalStore.getState().closeModal();
      });

      expect(useModalStore.getState().modalType).toBeNull();
    });

    it('삭제 확인 모달 플로우가 동작해야 함', () => {
      const onConfirm = jest.fn();

      act(() => {
        useModalStore.getState().openModal('delete', '삭제하시겠습니까?', onConfirm, '삭제');
      });

      const state = useModalStore.getState();
      expect(state.modalType).toBe('delete');

      state.onModalConfirm?.();
      expect(onConfirm).toHaveBeenCalled();

      act(() => {
        useModalStore.getState().closeModal();
      });

      expect(useModalStore.getState().modalType).toBeNull();
    });

    it('모달을 여러 번 열고 닫을 수 있어야 함', () => {
      act(() => {
        useModalStore.getState().openModal('login');
      });
      expect(useModalStore.getState().modalType).toBe('login');

      act(() => {
        useModalStore.getState().closeModal();
      });
      expect(useModalStore.getState().modalType).toBeNull();

      act(() => {
        useModalStore.getState().openModal('logout', '로그아웃');
      });
      expect(useModalStore.getState().modalType).toBe('logout');
      expect(useModalStore.getState().modalMessage).toBe('로그아웃');
    });

    it('모달을 교체할 수 있어야 함', () => {
      act(() => {
        useModalStore.getState().openModal('login');
      });

      act(() => {
        useModalStore.getState().openModal('message', '새 메시지');
      });

      const state = useModalStore.getState();
      expect(state.modalType).toBe('message');
      expect(state.modalMessage).toBe('새 메시지');
    });
  });
});
