import { tv } from 'tailwind-variants';

export const paginationButtonVariants = tv({
  base: 'inline-flex rounded-sm border transition-colors duration-200',
  variants: {
    variant: {
      navigation: 'justify-center items-center p-2.5',
      page: 'flex-col items-center gap-2.5 px-[7px] py-[1px]',
    },
    state: {
      default: 'bg-white border-gray-90 text-character-title-85 hover:bg-gray-light',
      active: 'bg-primary-6 border-primary-6 text-white',
      disabled: 'bg-white border-gray-90 text-character-disabled-25 cursor-not-allowed opacity-50',
    },
    direction: {
      prev: '',
      next: '',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'navigation',
    state: 'default',
  },
});
