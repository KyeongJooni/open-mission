import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { ReactNode } from 'react';
import { iconInnerVariants, iconVariants } from './IconVariants';

export type IconSize = 'sm' | 'md' | 'lg';

interface IconProps extends VariantProps<typeof iconVariants> {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
}

const Icon = ({ children, size, clickable, padding, className = '', containerClassName = '', onClick }: IconProps) => {
  const isClickable = clickable || Boolean(onClick);

  return (
    <div className={cn(iconVariants({ size, clickable: isClickable, padding }), containerClassName)} onClick={onClick}>
      <div className={cn(iconInnerVariants({ size }), '[&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current', className)}>
        {children}
      </div>
    </div>
  );
};

export default Icon;
