import {
  modalButtonsVariants,
  modalCancelButtonVariants,
  modalContainerVariants,
  modalContentVariants,
  modalConfirmButtonVariants,
} from '@/components/common/Modal/ModalVariants';
import { cn } from '@/utils/cn';
import { ReactNode } from 'react';
import { useBodyScrollLock } from '@/hooks';
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
  useBodyScrollLock(isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
        role="presentation"
      >
        <div
          className={cn(modalContainerVariants(), className)}
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
            <button onClick={onClose} className={modalCancelButtonVariants()} aria-label={cancelButtonText}>
              {cancelButtonText}
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className={modalConfirmButtonVariants({ variant: confirmButtonVariant })}
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
