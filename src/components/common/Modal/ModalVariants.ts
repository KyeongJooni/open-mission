import { tv } from 'tailwind-variants';

// 모달 컨테이너 스타일
export const modalContainerVariants = tv({
  base: 'flex w-[326px] flex-col items-start gap-6 rounded border-0 p-6 pb-4 bg-white shadow-modal',
});

// 모달 콘텐츠 컨테이너 스타일
export const modalContentVariants = tv({
  base: 'flex flex-col items-start gap-2 self-stretch rounded-xl',
  variants: {
    padding: {
      default: 'p-1',
      none: 'p-0',
    },
  },
  defaultVariants: {
    padding: 'default',
  },
});

// 모달 버튼 컨테이너 스타일
export const modalButtonsVariants = tv({
  base: 'flex items-center gap-3 self-stretch',
});

// 모달 취소 버튼 스타일
export const modalCancelButtonVariants = tv({
  base: 'flex px-3 py-2 justify-center items-center gap-2 flex-1 text-sm font-normal text-black text-right rounded-sm border border-gray-96',
});

// 모달 확인 버튼 스타일
export const modalConfirmButtonVariants = tv({
  base: 'flex px-3 py-2 justify-center items-center gap-2 flex-1 rounded-sm text-sm font-normal border-0 cursor-pointer',
  variants: {
    variant: {
      danger: 'text-white bg-warning hover:bg-warning/90',
      primary: 'text-white bg-[#00A1FF] hover:bg-[#00A1FF]/90',
      secondary: 'text-white bg-gray-500 hover:bg-gray-600',
    },
  },
  defaultVariants: {
    variant: 'danger',
  },
});

// 기존 삭제 버튼 스타일 (하위 호환성)
export const modalDeleteButtonVariants = tv({
  base: 'flex px-3 py-2 justify-center items-center gap-2 flex-1 rounded-sm text-sm font-normal border-0 cursor-pointer text-white bg-warning hover:bg-warning/90',
});
