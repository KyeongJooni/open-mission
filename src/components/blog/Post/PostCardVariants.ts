import { tv } from 'tailwind-variants';

export const postCardVariants = tv({
  // 기본 스타일
  base: 'flex px-4  py-3 flex-col justify-center items-start gap-2 self-stretch',
  variants: {
    hasImage: {
      true: 'w-full max-w-post-card-mobile md:max-w-post-card',
      false: 'w-full max-w-post-card-mobile-full md:max-w-content',
    },
  },
  defaultVariants: {
    hasImage: false,
  },
});

export const postTitleVariants = tv({
  base: 'w-full self-stretch font-medium leading-[160%] tracking-[-0.08px] text-black overflow-hidden text-ellipsis whitespace-nowrap',
  variants: {
    size: {
      md: 'text-base sm:text-lg',
      xl: 'text-2xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const postContentVariants = tv({
  base: 'h-12 sm:h-auto w-full self-stretch overflow-hidden text-ellipsis text-sm font-light leading-[160%] tracking-[-0.07px] text-gray-dark line-clamp-2 sm:line-clamp-3',
});
