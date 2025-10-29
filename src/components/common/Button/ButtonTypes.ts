export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: ButtonType;
  showIcon?: boolean;
  icon?: React.ReactNode;
  intent?: 'primary' | 'secondary' | 'gray' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'comment';
  variant?: 'solid' | 'outline' | 'ghost';
  fullWidth?: boolean;
}
