import { tv, type VariantProps } from 'tailwind-variants';

export const textFieldVariants = tv({
  // 기본 TextField 컨테이너 스타일
  base: 'flex w-[656px] px-4 py-3 items-center gap-2.5 rounded border transition-colors',
  variants: {
    variant: {
      default: 'border-gray-90',
      dark: 'border-gray-33',
      light: 'border-gray-90',
    },
    backgroundColor: {
      transparent: 'bg-transparent',
      filled: 'bg-gray-90',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: '',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    backgroundColor: 'transparent',
    disabled: false,
    fullWidth: false,
  },
});

export const inputVariants = tv({
  // 기본 input 스타일
  base: 'w-full border-0 outline-none bg-transparent',
  variants: {
    textColor: {
      black: 'text-black placeholder:text-black',
      gray56: 'text-gray-56 placeholder:text-gray-56',
      gray78: 'text-gray-78 placeholder:text-gray-78',
      gray90: 'text-gray-90 placeholder:text-gray-90',
      title: 'text-gray-56 placeholder:text-gray-56',
    },
    fontSize: {
      light: 'text-sm font-light leading-[160%] tracking-[-0.07px]',
      medium: 'text-2xl font-medium leading-[160%]',
    },
  },
  defaultVariants: {
    textColor: 'gray56',
    fontSize: 'light',
  },
});

export type TextFieldVariantProps = VariantProps<typeof textFieldVariants>;
export type InputVariantProps = VariantProps<typeof inputVariants>;
