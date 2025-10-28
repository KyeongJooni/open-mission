import { ComponentWithBase } from './mypage';

// 공통
interface BaseInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: 'text' | 'password' | 'email';
  name?: string;
  disabled?: boolean;
  autoComplete?: string;
}

// 색상 관련 타입
type TextColor = 'black' | 'gray56' | 'gray78' | 'gray90' | 'title';
type BackgroundColor = 'transparent' | 'filled';
type FontSize = 'light' | 'medium';

// TextField 스타일 Props
interface TextFieldStyleProps {
  variant?: 'default' | 'dark' | 'light';
  backgroundColor?: BackgroundColor;
  textColor?: TextColor;
  fontSize?: FontSize;
  fullWidth?: boolean;
  error?: boolean;
  errorMessage?: string;
}

// Textarea 스타일 Props
interface TextareaStyleProps {
  title?: string;
  hintText?: string;
  textFieldColor?: 'black' | 'gray56' | 'gray78';
  textFieldBackgroundColor?: BackgroundColor;
  textFieldFontSize?: FontSize;
  error?: string;
}

export type TextFieldProps = ComponentWithBase<BaseInputProps & TextFieldStyleProps>;
export type TextareaProps = ComponentWithBase<BaseInputProps & TextareaStyleProps>;
