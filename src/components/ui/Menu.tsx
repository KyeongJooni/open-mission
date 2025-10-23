import clsx from 'clsx';
import { ReactNode } from 'react';

interface MobileMenuContainerProps {
  children: ReactNode;
  className?: string;
}

interface MobileMenuIconProps {
  children: ReactNode;
  className?: string;
}

const MobileMenuIcon = ({ children, className = '' }: MobileMenuIconProps) => {
  return (
    <div className={clsx('flex aspect-square h-10 w-10 items-center justify-center p-2', className)}>{children}</div>
  );
};

const MobileMenuContainer = ({ children, className = '' }: MobileMenuContainerProps) => {
  return <div className={clsx('flex items-center gap-2.5 px-4 py-1', className)}>{children}</div>;
};

export { MobileMenuIcon };
export default MobileMenuContainer;
