import { cn } from '@/utils/cn';
import { useLoginForm } from '@/hooks';
import { Spacer } from '@/components';
import * as variants from '@/components/auth/LoginFormVariants';
import { AUTH_TEXTS } from '@/constants';
import {
  InputSection,
  ErrorMessage,
  SnsDivider,
  EmailLoginButton,
  KakaoLoginButton,
  SignupButton,
} from '@/components/auth/LoginFormComponents';

interface LoginFormProps {
  className?: string;
  onClose?: () => void;
  showInputSection?: boolean;
  showSignupButton?: boolean;
  emailButtonText?: string;
  kakaoButtonText?: string;
  dividerText?: string;
  dividerLineColor?: string;
  onEmailClick?: () => void;
  onKakaoClick?: () => void;
}

const LoginForm = ({
  className,
  onClose,
  showInputSection = true,
  showSignupButton = true,
  emailButtonText = AUTH_TEXTS.LOGIN_FORM.BUTTONS.EMAIL_LOGIN,
  kakaoButtonText = AUTH_TEXTS.LOGIN_FORM.BUTTONS.KAKAO_LOGIN,
  dividerText = AUTH_TEXTS.LOGIN_FORM.DIVIDER.SNS,
  dividerLineColor,
  onEmailClick,
  onKakaoClick,
}: LoginFormProps) => {
  const {
    email,
    password,
    errorMessage,
    setEmail,
    setPassword,
    handleLogin,
    handleKeyDown,
    handleKakaoLogin,
    handleSignup,
  } = useLoginForm(onClose);

  return (
    <form
      className={cn(variants.loginFormVariants(), className)}
      onSubmit={e => {
        e.preventDefault();
        if (onEmailClick) {
          onEmailClick();
        } else {
          handleLogin();
        }
      }}
    >
      <Spacer height="md" className="max-w-login-form-max min-w-login-form-min px-4 py-1" />
      {showInputSection && (
        <InputSection
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onKeyDown={handleKeyDown}
        />
      )}
      <ErrorMessage message={errorMessage} />
      <EmailLoginButton onClick={onEmailClick || handleLogin} text={emailButtonText} />
      <SnsDivider text={dividerText} lineColor={dividerLineColor} />
      <KakaoLoginButton onClick={onKakaoClick || handleKakaoLogin} text={kakaoButtonText} />
      {showSignupButton && <SignupButton onClick={handleSignup} />}
    </form>
  );
};

export default LoginForm;
