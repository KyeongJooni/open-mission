import { CreateIcon } from '@/assets/icons';
import { Icon } from '@/components';
import { textBoxTextVariants, textBoxVariants } from '@/components/common/Textbox/TextBoxVariants';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface TextBoxProps {
  children: ReactNode;
  className?: string;
  showIcon?: boolean;
  icon?: ReactNode;
  color?: 'default' | 'primary' | 'positive' | 'gray' | 'gray-90' | 'gray-56';
  borderColor?: 'default' | 'primary' | 'positive' | 'gray' | 'gray-90' | 'transparent';
  onClick?: () => void;
  asButton?: boolean;
}

const TextBox = ({
  children,
  className = '',
  showIcon = false,
  icon,
  color,
  borderColor,
  onClick,
  asButton = false,
}: TextBoxProps) => {
  const content = (
    <>
      {showIcon && <Icon size="sm">{icon || <CreateIcon />}</Icon>}
      <span className={textBoxTextVariants({ color })}>{children}</span>
    </>
  );

  const baseClassName = clsx(textBoxVariants({ color, borderColor }), className);

  if (asButton || onClick) {
    return (
      <button type="button" onClick={onClick} className={baseClassName}>
        {content}
      </button>
    );
  }

  return <div className={baseClassName}>{content}</div>;
};

export default TextBox;
