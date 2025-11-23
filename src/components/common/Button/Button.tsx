import { ButtonProps } from '@/components/common/Button/ButtonTypes';
import { buttonIconVariants, buttonTextVariants, buttonVariants } from '@/components/common/Button/ButtonVariants';
import { Icon } from '@/components';
import { useRipple } from '@/hooks';
import { cn } from '@/utils/cn';

const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
  showIcon = false,
  icon,
  intent = 'primary',
  size = 'md',
  variant = 'solid',
  fullWidth = false,
}: ButtonProps) => {
  const createRipple = useRipple();

  return (
    <button
      type={type}
      onClick={e => {
        createRipple(e);
        onClick?.();
      }}
      className={cn(
        buttonVariants({ intent, size, variant, fullWidth }),
        'transition-transform active:scale-95',
        className
      )}
    >
      {showIcon && icon && (
        <Icon size="md" className={buttonIconVariants()}>
          {icon}
        </Icon>
      )}
      <span className={buttonTextVariants()}>{children}</span>
    </button>
  );
};

export default Button;
