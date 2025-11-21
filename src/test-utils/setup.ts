import '@testing-library/jest-dom';

// TextEncoder/TextDecoder polyfill
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

// localStorage 모킹
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// sessionStorage 모킹
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// matchMedia 모킹
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// IntersectionObserver 모킹
class IntersectionObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});

// ResizeObserver 모킹
class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
});

// scrollTo 모킹
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// 각 테스트 후 모킹 초기화
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});
