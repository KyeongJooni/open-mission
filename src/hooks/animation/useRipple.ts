import { useCallback, MouseEvent } from 'react';

export const useRipple = () => {
  const createRipple = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: currentColor;
      border-radius: 50%;
      transform: scale(0);
      opacity: 0.3;
      pointer-events: none;
      animation: ripple-animation 0.6s ease-out;
    `;

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }, []);

  return createRipple;
};
