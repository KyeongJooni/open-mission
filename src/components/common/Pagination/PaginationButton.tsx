import { NavigateBeforeIcon } from '@/assets/icons';
import { type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { paginationButtonVariants } from '@/components/common/Pagination/PaginationButtonVariants';

interface PaginationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof paginationButtonVariants> {
  children?: ReactNode;
  className?: string;
}

const PaginationButton = ({
  variant,
  state,
  direction,
  children,
  className,
  disabled,
  ...props
}: PaginationButtonProps) => {
  const renderContent = () => {
    if (variant === 'navigation' && (direction === 'prev' || direction === 'next')) {
      const iconColorClass = state === 'disabled' ? 'text-character-disabled-25' : 'text-character-title-85';
      return <NavigateBeforeIcon className={clsx('h-3 w-3', direction === 'next' && 'rotate-180', iconColorClass)} />;
    }

    if (variant === 'page') {
      return (
        <span
          className={clsx(
            'flex flex-col justify-center',
            'h-[30px] w-[18px]',
            'text-center',
            'font-["Roboto"] text-sm font-regular',
            'leading-[22px]',
            ''
          )}
        >
          {children}
        </span>
      );
    }

    return children;
  };

  return (
    <button
      className={clsx(
        paginationButtonVariants({ variant, state: disabled ? 'disabled' : state, direction }),
        className
      )}
      disabled={disabled}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default PaginationButton;
