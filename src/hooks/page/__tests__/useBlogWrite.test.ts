import { renderHook } from '@testing-library/react';
import { useBlogWrite } from '../useBlogWrite';

const mockSearchParams = new URLSearchParams();
const mockSetTitle = jest.fn();
const mockSetMode = jest.fn();
const mockSetBasicContent = jest.fn();
const mockSetMarkdownContent = jest.fn();
const mockSetEditPostId = jest.fn();
const mockReset = jest.fn();

jest.mock('react-router-dom', () => ({
  useSearchParams: () => [mockSearchParams],
}));

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ isLoggedIn: true }),
}));

jest.mock('@/stores/useBlogWriteStore', () => ({
  useBlogWriteStore: () => ({
    title: '테스트 제목',
    setTitle: mockSetTitle,
    mode: 'basic',
    setMode: mockSetMode,
    basicContent: '기본 내용',
    setBasicContent: mockSetBasicContent,
    markdownContent: '# 마크다운',
    setMarkdownContent: mockSetMarkdownContent,
    setEditPostId: mockSetEditPostId,
    reset: mockReset,
  }),
}));

jest.mock('@/api/blog/blogQuery', () => ({
  useBlogDetailQuery: () => ({
    data: null,
  }),
}));

jest.mock('../useImageUpload', () => ({
  useImageUpload: () => ({
    handleImageUpload: jest.fn(),
    handleImageDrop: jest.fn(),
    handleImagePaste: jest.fn(),
  }),
}));

jest.mock('@/styles/editor.styles', () => ({
  getEditorStyles: () => 'mock-styles',
}));

describe('useBlogWrite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.delete('edit');
  });

  it('초기 상태를 반환해야 함', () => {
    const { result } = renderHook(() => useBlogWrite());

    expect(result.current.title).toBe('테스트 제목');
    expect(result.current.mode).toBe('basic');
    expect(result.current.basicContent).toBe('기본 내용');
  });

  it('setTitle 함수를 반환해야 함', () => {
    const { result } = renderHook(() => useBlogWrite());

    expect(result.current.setTitle).toBeDefined();
  });

  it('setMode 함수를 반환해야 함', () => {
    const { result } = renderHook(() => useBlogWrite());

    expect(result.current.setMode).toBeDefined();
  });

  it('modules를 반환해야 함', () => {
    const { result } = renderHook(() => useBlogWrite());

    expect(result.current.modules).toBeDefined();
    expect(result.current.modules.toolbar).toBeDefined();
  });

  it('mobileModules를 반환해야 함', () => {
    const { result } = renderHook(() => useBlogWrite());

    expect(result.current.mobileModules).toBeDefined();
  });

  it('editorStyles를 반환해야 함', () => {
    const { result } = renderHook(() => useBlogWrite());

    expect(result.current.editorStyles).toBe('mock-styles');
  });

  it('getButtonProps가 올바른 props를 반환해야 함', () => {
    const { result } = renderHook(() => useBlogWrite());

    const basicProps = result.current.getButtonProps('basic');
    expect(basicProps.intent).toBe('primary');
    expect(basicProps.variant).toBe('solid');

    const markdownProps = result.current.getButtonProps('markdown');
    expect(markdownProps.intent).toBe('secondary');
    expect(markdownProps.variant).toBe('outline');
  });

  it('quillRef를 반환해야 함', () => {
    const { result } = renderHook(() => useBlogWrite());

    expect(result.current.quillRef).toBeDefined();
  });

  it('이미지 핸들러를 반환해야 함', () => {
    const { result } = renderHook(() => useBlogWrite());

    expect(result.current.handleImageUpload).toBeDefined();
    expect(result.current.handleImageDrop).toBeDefined();
    expect(result.current.handleImagePaste).toBeDefined();
  });

  it('unmount 시 reset이 호출되어야 함', () => {
    const { unmount } = renderHook(() => useBlogWrite());

    unmount();

    expect(mockReset).toHaveBeenCalled();
  });
});
