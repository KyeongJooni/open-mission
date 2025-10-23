import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Toast, Portal } from '@/components';
import { tv } from 'tailwind-variants';

export type ToastType = 'positive' | 'warning';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

const toastContainerVariants = tv({
  base: 'fixed top-24 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ease-out',
  variants: {
    isAnimating: {
      true: 'opacity-100 translate-y-0',
      false: 'opacity-0 -translate-y-2',
    },
  },
  defaultVariants: {
    isAnimating: false,
  },
});

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('positive');

  const showToast = useCallback((message: string, type: ToastType = 'positive') => {
    setMessage(message);
    setType(type);
    setIsVisible(true);
    setTimeout(() => setIsAnimating(true), 10);
    setTimeout(() => {
      setIsAnimating(false);
    }, 2700);
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {isVisible && (
        <Portal>
          <div className={toastContainerVariants({ isAnimating })}>
            <Toast type={type}>{message}</Toast>
          </div>
        </Portal>
      )}
    </ToastContext.Provider>
  );
};
