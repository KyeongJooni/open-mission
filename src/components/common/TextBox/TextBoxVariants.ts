import { tv } from 'tailwind-variants';

export const textBoxVariants = tv({
  base: 'inline-flex py-0.5 px-2 justify-center items-center gap-1 flex-shrink-0 rounded border transition-all duration-200',
  variants: {
    color: {
      default: '',
      primary: 'text-primary',
      positive: 'text-positive',
      gray: 'text-gray',
      'gray-90': 'text-gray-90 hover:text-gray-78',
      'gray-56': 'text-gray-56',
    },
    borderColor: {
      default: 'border-transparent',
      primary: 'border-primary',
      positive: 'border-positive',
      gray: 'border-gray',
      'gray-90': 'border-gray-90 hover:border-gray-78 hover:bg-gray-96',
      transparent: 'border-transparent',
    },
  },
  defaultVariants: {
    color: 'default',
    borderColor: 'default',
  },
});

export const textBoxTextVariants = tv({
  base: 'text-xs font-normal transition-colors duration-200',
  variants: {
    color: {
      default: '',
      primary: 'text-primary',
      positive: 'text-positive',
      gray: 'text-gray',
      'gray-90': 'text-gray-90 group-hover:text-gray-78',
      'gray-56': 'text-gray-56',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});
