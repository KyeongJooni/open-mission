import { render, screen } from '@testing-library/react';
import PostBody from '../PostBody';

jest.mock('@uiw/react-md-editor', () => ({
  __esModule: true,
  default: {
    Markdown: ({ source }: { source: string }) => (
      <div data-testid="markdown-preview">{source}</div>
    ),
  },
}));

describe('PostBody', () => {
  it('content를 렌더링해야 함', () => {
    render(<PostBody content="테스트 내용" />);

    expect(screen.getByText('테스트 내용')).toBeInTheDocument();
  });

  it('content가 비어있을 때 placeholder를 표시해야 함', () => {
    render(<PostBody content="" placeholder="내용을 입력하세요" />);

    expect(screen.getByText('내용을 입력하세요')).toBeInTheDocument();
  });

  it('content가 공백만 있을 때 placeholder를 표시해야 함', () => {
    render(<PostBody content="   " placeholder="내용을 입력하세요" />);

    expect(screen.getByText('내용을 입력하세요')).toBeInTheDocument();
  });

  it('isMarkdown이 true일 때 마크다운을 렌더링해야 함', () => {
    render(<PostBody content="# 마크다운 제목" isMarkdown />);

    expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
  });

  it('isMarkdown이 true이고 content가 비어있을 때 마크다운을 렌더링하지 않아야 함', () => {
    render(<PostBody content="" isMarkdown placeholder="입력" />);

    expect(screen.queryByTestId('markdown-preview')).not.toBeInTheDocument();
  });

  it('특수 HTML 태그가 있을 때 prose 스타일을 적용해야 함', () => {
    const { container } = render(<PostBody content="<h1>제목</h1>" />);

    expect(container.querySelector('.prose')).toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<PostBody content="내용" className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
