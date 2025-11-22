import { render, screen } from '@testing-library/react';
import BlogPostSection from '../BlogPostSection';

jest.mock('@/utils/markdownDetector', () => ({
  hasMarkdownSyntax: jest.fn(() => false),
}));

jest.mock('@/components', () => ({
  Spacer: () => <div data-testid="spacer" />,
  PostHeader: ({ title }: any) => <h1 data-testid="post-header">{title}</h1>,
  PostDetails: ({ nickName, createdAt, commentCount }: any) => (
    <div data-testid="post-details">
      <span>{nickName}</span>
      <span>{createdAt}</span>
      <span>{commentCount}</span>
    </div>
  ),
  PostBody: ({ content, isMarkdown }: any) => (
    <div data-testid="post-body" data-markdown={isMarkdown}>
      {content}
    </div>
  ),
}));

describe('BlogPostSection', () => {
  const defaultProps = {
    title: '테스트 제목',
    contents: [
      { contentType: 'TEXT' as const, content: '텍스트 내용', contentOrder: 1 },
      { contentType: 'IMAGE' as const, content: 'https://example.com/image.png', contentOrder: 2 },
    ],
    nickName: '테스트 유저',
    profileUrl: 'https://example.com/profile.png',
    createdAt: '2024-01-01',
    commentCount: 5,
  };

  it('제목을 렌더링해야 함', () => {
    render(<BlogPostSection {...defaultProps} />);

    expect(screen.getByTestId('post-header')).toHaveTextContent('테스트 제목');
  });

  it('작성자 정보를 렌더링해야 함', () => {
    render(<BlogPostSection {...defaultProps} />);

    expect(screen.getByTestId('post-details')).toBeInTheDocument();
    expect(screen.getByText('테스트 유저')).toBeInTheDocument();
  });

  it('텍스트 콘텐츠를 렌더링해야 함', () => {
    render(<BlogPostSection {...defaultProps} />);

    expect(screen.getByText('텍스트 내용')).toBeInTheDocument();
  });

  it('이미지 콘텐츠를 렌더링해야 함', () => {
    render(<BlogPostSection {...defaultProps} />);

    const img = screen.getByAltText('content-1');
    expect(img).toHaveAttribute('src', 'https://example.com/image.png');
  });

  it('콘텐츠를 contentOrder 순서대로 렌더링해야 함', () => {
    const props = {
      ...defaultProps,
      contents: [
        { contentType: 'TEXT' as const, content: '두 번째', contentOrder: 2 },
        { contentType: 'TEXT' as const, content: '첫 번째', contentOrder: 1 },
      ],
    };

    render(<BlogPostSection {...props} />);

    const bodies = screen.getAllByTestId('post-body');
    expect(bodies[0]).toHaveTextContent('첫 번째');
    expect(bodies[1]).toHaveTextContent('두 번째');
  });

  it('마크다운 콘텐츠를 마크다운으로 렌더링해야 함', () => {
    const props = {
      ...defaultProps,
      contents: [{ contentType: 'MARKDOWN' as const, content: '# 마크다운', contentOrder: 1 }],
    };

    render(<BlogPostSection {...props} />);

    const body = screen.getByTestId('post-body');
    expect(body).toHaveAttribute('data-markdown', 'true');
  });
});
