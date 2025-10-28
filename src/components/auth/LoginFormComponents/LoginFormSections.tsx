import { KeyboardEvent } from 'react';
import { cn } from '@/utils/cn';
import * as variants from '@/components/auth/LoginFormVariants';
import { AUTH_TEXTS } from '@/constants';

interface InputSectionProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const InputSection = ({ email, password, onEmailChange, onPasswordChange, onKeyDown }: InputSectionProps) => (
  <div className={variants.loginSectionContainerVariants({ align: 'start', gap: 'small' })}>
    <div className={variants.inputContainerVariants()}>
      <input
        type="email"
        placeholder={AUTH_TEXTS.LOGIN_FORM.PLACEHOLDERS.EMAIL}
        className={variants.inputFieldVariants()}
        value={email}
        onChange={e => onEmailChange(e.target.value)}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
    </div>
    <div className={variants.inputContainerVariants()}>
      <input
        type="password"
        placeholder={AUTH_TEXTS.LOGIN_FORM.PLACEHOLDERS.PASSWORD}
        className={variants.inputFieldVariants()}
        value={password}
        onChange={e => onPasswordChange(e.target.value)}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
    </div>
  </div>
);

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) {
    return null;
  }

  return (
    <div className={variants.loginSectionContainerVariants({ align: 'start', gap: 'small' })}>
      <div className={variants.errorMessageContainerVariants()}>
        <span className={variants.errorMessageTextVariants()}>* {message}</span>
      </div>
    </div>
  );
};

interface SnsDividerProps {
  text: string;
  lineColor?: string;
}

export const SnsDivider = ({ text, lineColor }: SnsDividerProps) => (
  <div className={variants.snsDividerContainerVariants()}>
    <div className={cn(variants.snsDividerLineVariants(), lineColor)} />
    <span className={variants.snsDividerTextVariants()}>{text}</span>
    <div className={cn(variants.snsDividerLineVariants(), lineColor)} />
  </div>
);
