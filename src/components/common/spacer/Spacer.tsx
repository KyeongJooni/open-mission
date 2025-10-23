import clsx from 'clsx';

interface SpacerProps {
  className?: string;
  height?: 'sm' | 'md' | 'custom' | 'lg';
}

const Spacer = ({ className = '', height = 'sm' }: SpacerProps) => {
  const getHeightClass = (h: 'sm' | 'md' | 'custom' | 'lg') => {
    switch (h) {
      case 'sm':
        return 'h-5'; // 20px
      case 'md':
        return 'h-8'; // 32px
      case 'custom':
        return 'h-14'; // 56px
      case 'lg':
        return 'h-16'; // 64px
      default:
        return 'h-5';
    }
  };

  return <div className={clsx('flex max-w-content flex-shrink-0 items-start', getHeightClass(height), className)} />;
};

export default Spacer;
