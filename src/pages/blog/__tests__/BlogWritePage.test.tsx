import { render, screen } from '@testing-library/react';

// CSS 파일 모킹
jest.mock('react-quill/dist/quill.snow.css', () => ({}));
jest.mock('@uiw/react-md-editor/markdown-editor.css', () => ({}));
jest.mock('@uiw/react-markdown-preview/markdown.css', () => ({}));

import BlogWritePage from '../BlogWritePage';

const mockUseBlogWrite = jest.fn();
const mockUseIsMobile = jest.fn();

jest.mock('@/hooks', () => ({
  useBlogWrite: () => mockUseBlogWrite(),
  useIsMobile: () => mockUseIsMobile(),
}));

jest.mock('react-quill', () => ({
  __esModule: true,
  default: ({ value, placeholder }: any) => (
    <div data-testid="react-quill" data-value={value} data-placeholder={placeholder}>
      ReactQuill
    </div>
  ),
}));

jest.mock('@uiw/react-md-editor', () => ({
  __esModule: true,
  default: ({ value }: any) => (
    <div data-testid="md-editor" data-value={value}>
      MDEditor
    </div>
  ),
}));

jest.mock('@/components', () => ({
  Spacer: ({ height }: { height: string }) => <div data-testid="spacer" data-height={height} />,
  PostCard: ({ title }: { title: string }) => <div data-testid="post-card">{title}</div>,
  PageHeaderLegacy: () => <div data-testid="page-header-legacy">Header</div>,
}));

jest.mock('@/components/blog/Write', () => ({
  TitleInput: ({ title }: { title: string }) => (
    <input data-testid="title-input" value={title} readOnly />
  ),
  ModeToggleButtons: ({ mode }: { mode: string }) => (
    <div data-testid="mode-toggle" data-mode={mode}>Toggle</div>
  ),
}));

describe('BlogWritePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseBlogWrite.mockReturnValue({
      title: '테스트 제목',
      setTitle: jest.fn(),
      mode: 'basic',
      setMode: jest.fn(),
      basicContent: '기본 내용',
      setBasicContent: jest.fn(),
      markdownContent: '# 마크다운',
      setMarkdownContent: jest.fn(),
      modules: {},
      mobileModules: {},
      editorStyles: '',
      getButtonProps: jest.fn(),
      quillRef: { current: null },
      handleImageDrop: jest.fn(),
      handleImagePaste: jest.fn(),
    });
  });

  it('데스크톱에서 basic 모드로 렌더링되어야 함', () => {
    mockUseIsMobile.mockReturnValue(false);

    render(<BlogWritePage />);

    expect(screen.getByTestId('page-header-legacy')).toBeInTheDocument();
    expect(screen.getByTestId('post-card')).toBeInTheDocument();
    expect(screen.getByTestId('mode-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('react-quill')).toBeInTheDocument();
  });

  it('데스크톱에서 markdown 모드로 렌더링되어야 함', () => {
    mockUseIsMobile.mockReturnValue(false);
    mockUseBlogWrite.mockReturnValue({
      title: '테스트 제목',
      setTitle: jest.fn(),
      mode: 'markdown',
      setMode: jest.fn(),
      basicContent: '',
      setBasicContent: jest.fn(),
      markdownContent: '# 마크다운',
      setMarkdownContent: jest.fn(),
      modules: {},
      mobileModules: {},
      editorStyles: '',
      getButtonProps: jest.fn(),
      quillRef: { current: null },
      handleImageDrop: jest.fn(),
      handleImagePaste: jest.fn(),
    });

    render(<BlogWritePage />);

    expect(screen.getByTestId('md-editor')).toBeInTheDocument();
  });

  it('모바일에서 렌더링되어야 함', () => {
    mockUseIsMobile.mockReturnValue(true);

    render(<BlogWritePage />);

    expect(screen.getByTestId('react-quill')).toBeInTheDocument();
    expect(screen.queryByTestId('mode-toggle')).not.toBeInTheDocument();
  });

  it('Spacer가 렌더링되어야 함', () => {
    mockUseIsMobile.mockReturnValue(false);

    render(<BlogWritePage />);

    const spacers = screen.getAllByTestId('spacer');
    expect(spacers.length).toBeGreaterThan(0);
  });
});
