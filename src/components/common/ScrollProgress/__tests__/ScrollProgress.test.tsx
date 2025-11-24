import { render, act } from '@testing-library/react';
import { ScrollProgress } from '../ScrollProgress';

describe('ScrollProgress', () => {
  const originalScrollY = window.scrollY;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 768,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'scrollY', {
      value: originalScrollY,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
      writable: true,
    });
  });

  it('renders progress bar container', () => {
    render(<ScrollProgress />);

    const container = document.querySelector('.fixed.left-0.top-0');
    expect(container).toBeInTheDocument();
  });

  it('shows 0% progress at top of page', () => {
    render(<ScrollProgress />);

    const progressBar = document.querySelector('.bg-gradient-to-r');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });

  it('updates progress on scroll', () => {
    render(<ScrollProgress />);

    // Simulate scroll to middle
    Object.defineProperty(window, 'scrollY', {
      value: 616, // (2000 - 768) / 2 = 616
      writable: true,
    });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    const progressBar = document.querySelector('.bg-gradient-to-r');
    expect(progressBar).toBeInTheDocument();
  });

  it('removes scroll listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<ScrollProgress />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it('handles zero document height', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 768, // Same as window height
      writable: true,
      configurable: true,
    });

    render(<ScrollProgress />);

    const progressBar = document.querySelector('.bg-gradient-to-r');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });
});
