import { tv, type VariantProps } from 'tailwind-variants';

export const buttonVariants = tv({
  base: 'inline-flex h-10 px-3 py-2 justify-center items-center gap-1 flex-shrink-0 rounded-[25px] border transition-all duration-200 cursor-pointer',
  variants: {
    intent: {
      primary: 'text-primary border-primary bg-white hover:text-white hover:bg-primary hover:border-primary',
      secondary: 'text-gray border-gray hover:text-gray hover:bg-gray-96',
      gray: 'text-gray border-gray',
      danger: 'text-white bg-error border-error hover:bg-error/90',
    },
    size: {
      sm: 'h-8 px-2 text-sm',
      md: 'h-10 px-3 text-sm', // 기본 크기
      lg: 'h-12 px-4 text-base',
      comment: 'h-[38px] w-16 px-3 text-sm', // 댓글 버튼 전용 크기
    },
    variant: {
      solid: '',
      outline: 'bg-transparent',
      ghost: 'bg-transparent border-transparent',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
  compoundVariants: [
    { intent: 'gray', variant: 'solid', class: '!bg-dark !text-white hover:!bg-dark/50' },
    {
      intent: 'gray',
      variant: 'outline',
      class: 'text-gray border-gray bg-white hover:bg-gray hover:text-white',
    },
    {
      intent: 'primary',
      variant: 'outline',
      class: 'text-primary border-primary bg-white hover:bg-primary/10',
    },
    { intent: 'danger', variant: 'outline', class: 'text-error border-error bg-transparent hover:bg-error/10' },
  ],
  defaultVariants: {
    intent: 'primary',
    size: 'md',
    variant: 'solid',
    fullWidth: false,
  },
});

// 버튼 텍스트 스타일
export const buttonTextVariants = tv({
  base: 'text-sm font-normal leading-[160%] tracking-[-0.07px]',
});

// 버튼 아이콘 스타일
export const buttonIconVariants = tv({
  base: 'flex items-center justify-center',
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
