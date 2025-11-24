import { render, act } from '@testing-library/react';
import { AnalysisParticleBackground } from '../AnalysisParticleBackground';

// Mock THREE.js
const mockDispose = jest.fn();
const mockRender = jest.fn();
const mockSetSize = jest.fn();
const mockSetPixelRatio = jest.fn();
const mockAdd = jest.fn();

jest.mock('three', () => ({
  Scene: jest.fn().mockImplementation(() => ({
    add: mockAdd,
  })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    position: { z: 0 },
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
  })),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: mockSetSize,
    setPixelRatio: mockSetPixelRatio,
    render: mockRender,
    domElement: document.createElement('canvas'),
    dispose: mockDispose,
  })),
  BufferGeometry: jest.fn().mockImplementation(() => ({
    setAttribute: jest.fn(),
    dispose: mockDispose,
  })),
  BufferAttribute: jest.fn(),
  PointsMaterial: jest.fn().mockImplementation(() => ({
    dispose: mockDispose,
  })),
  Points: jest.fn().mockImplementation(() => ({
    rotation: { y: 0 },
  })),
}));

describe('AnalysisParticleBackground', () => {
  let requestAnimationFrameSpy: jest.SpyInstance;
  let cancelAnimationFrameSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => {
      return 1;
    });
    cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    requestAnimationFrameSpy.mockRestore();
    cancelAnimationFrameSpy.mockRestore();
  });

  it('renders the background container', () => {
    render(<AnalysisParticleBackground />);

    const container = document.querySelector('.fixed.inset-0');
    expect(container).toBeInTheDocument();
  });

  it('initializes Three.js scene on mount', () => {
    const THREE = require('three');

    render(<AnalysisParticleBackground />);

    expect(THREE.Scene).toHaveBeenCalled();
    expect(THREE.PerspectiveCamera).toHaveBeenCalled();
    expect(THREE.WebGLRenderer).toHaveBeenCalled();
  });

  it('starts animation on mount', () => {
    render(<AnalysisParticleBackground />);

    expect(requestAnimationFrameSpy).toHaveBeenCalled();
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(<AnalysisParticleBackground />);

    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    expect(mockDispose).toHaveBeenCalled();
  });

  it('handles resize events', () => {
    render(<AnalysisParticleBackground />);

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Resize handler should update renderer size
    expect(mockSetSize).toHaveBeenCalled();
  });

  it('removes resize listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<AnalysisParticleBackground />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});
