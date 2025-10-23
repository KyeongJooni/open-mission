import { useRef } from 'react';
import { cn } from '@/utils/cn';
import { useBodyScrollLock, useFocusTrap } from '@/hooks';
import LoginPage from '@/pages/auth/LoginPage';
import { Icon, Portal } from '@/components';
import { ClearIcon } from '@/assets/icons';

interface LoginModalProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const LoginModal = ({ className = '', isOpen, onClose }: LoginModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 커스텀 훅
  useBodyScrollLock(isOpen);
  useFocusTrap(modalRef, isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <div
        className="login-modal-overlay"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <div ref={modalRef} className={cn('login-modal-container', className)} onClick={e => e.stopPropagation()}>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="absolute right-4 top-4 flex items-center gap-2.5 text-white transition-colors hover:text-gray-90"
          >
            <Icon size="md" clickable>
              <ClearIcon />
            </Icon>
          </button>
          <LoginPage onClose={onClose} />
        </div>
      </div>
    </Portal>
  );
};

export default LoginModal;
