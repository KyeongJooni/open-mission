import { DoneIcon, ErrorOutlineIcon } from '@/assets/icons';
import { cn } from '@/utils/cn';
import { type VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';
import { toastIconVariants, toastTextVariants, toastVariants } from './ToastVariants';

interface ToastProps extends VariantProps<typeof toastVariants> {
  children: ReactNode;
  className?: string;
}

const Toast = ({ children, type, className = '' }: ToastProps) => {
  const getIcon = (toastType: typeof type) => {
    switch (toastType) {
      case 'positive':
        return <DoneIcon />;
      case 'warning':
        return <ErrorOutlineIcon />;
      default:
        return <DoneIcon />;
    }
  };

  return (
    <div className={cn(toastVariants({ type }), className)} style={{ cursor: 'default' }}>
      <div className={toastIconVariants({ type })}>{getIcon(type)}</div>
      <span className={toastTextVariants({ type })}>{children}</span>
    </div>
  );
};

export default Toast;
