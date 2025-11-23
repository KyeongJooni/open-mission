import {
  modalButtonsVariants,
  modalCancelButtonVariants,
  modalContainerVariants,
  modalContentVariants,
  modalConfirmButtonVariants,
} from '@/components/common/Modal/ModalVariants';
import { cn } from '@/utils/cn';
import { ReactNode, useState, useEffect } from 'react';
import { useBodyScrollLock, useRipple } from '@/hooks';
import { Portal } from '@/components';

interface ModalProps {
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  cancelButtonText?: string;
  confirmButtonText?: string;
  confirmButtonVariant?: 'primary' | 'danger' | 'secondary';
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

const Modal = ({
  children,
  className = '',
  isOpen,
  onClose,
  onDelete,
  cancelButtonText = '취소',
  confirmButtonText = '삭제하기',
  confirmButtonVariant = 'danger',
  ariaLabelledBy,
  ariaDescribedBy,
}: ModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const createRipple = useRipple();

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
          isAnimating ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-0'
        }`}
        onClick={onClose}
        role="presentation"
      >
        <div
          className={cn(
            modalContainerVariants(),
            'transition-all duration-200',
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          onClick={e => e.stopPropagation()}
        >
          <div className={modalContentVariants()} style={{ padding: '0 4px' }}>
            {children}
          </div>
          <div className={modalButtonsVariants()}>
            <button
              onClick={e => {
                createRipple(e);
                onClose();
              }}
              className={cn(modalCancelButtonVariants(), 'transition-transform active:scale-95')}
              aria-label={cancelButtonText}
            >
              {cancelButtonText}
            </button>
            {onDelete && (
              <button
                onClick={e => {
                  createRipple(e);
                  onDelete();
                }}
                className={cn(
                  modalConfirmButtonVariants({ variant: confirmButtonVariant }),
                  'transition-transform active:scale-95'
                )}
                aria-label={confirmButtonText}
              >
                {confirmButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
