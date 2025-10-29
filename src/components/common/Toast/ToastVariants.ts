import { tv, type VariantProps } from 'tailwind-variants';

export const toastVariants = tv({
  base: 'toast-container backdrop-blur-sm bg-white/90',
  variants: {
    type: {
      positive: 'border-positive text-positive',
      warning: 'border-warning text-warning',
    },
  },
  defaultVariants: {
    type: 'positive',
  },
});

export const toastIconVariants = tv({
  base: 'btn-icon',
  variants: {
    type: {
      positive: 'text-positive',
      warning: 'text-warning',
    },
  },
  defaultVariants: {
    type: 'positive',
  },
});

export const toastTextVariants = tv({
  base: 'btn-text whitespace-nowrap',
  variants: {
    type: {
      positive: 'text-positive',
      warning: 'text-warning',
    },
  },
  defaultVariants: {
    type: 'positive',
  },
});

export type ToastVariants = VariantProps<typeof toastVariants>;
