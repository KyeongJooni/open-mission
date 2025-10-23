import { cn } from '@/utils/cn';
import { LogoWebp } from '@/assets/logo';
import { logoWrapperStyle, logoContainerStyle, textboxContainerStyle, textboxTextStyle } from './LoginLogo.styles';

interface LoginLogoProps {
  isDark?: boolean;
}

const LoginLogo = ({ isDark = false }: LoginLogoProps) => {
  return (
    <div className={logoWrapperStyle}>
      <div className={logoContainerStyle}>
        <img src={LogoWebp} alt="Gitlog Logo" className={cn(isDark && 'brightness-0')} />
      </div>
      <div className={textboxContainerStyle}>
        <div className={textboxTextStyle}>You can make anything by writing</div>
      </div>
    </div>
  );
};

export default LoginLogo;
