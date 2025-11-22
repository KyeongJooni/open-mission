import { render, screen, fireEvent } from '@testing-library/react';
import MainPreviewCard from '../MainPreviewCard';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@/components', () => ({
  PostCard: ({ title, content }: any) => (
    <div data-testid="post-card">
      <h3>{title}</h3>
      {content && <p>{content}</p>}
    </div>
  ),
  PostDetails: ({ nickName, createdAt, commentCount }: any) => (
    <div data-testid="post-details">
      <span>{nickName}</span>
      <span>{createdAt}</span>
      <span>{commentCount}</span>
    </div>
  ),
}));

jest.mock('../MainPreviewImage', () => ({ src, priority }: any) => (
  <img data-testid="preview-image" src={src} data-priority={priority} alt="preview" />
));

describe('MainPreviewCard', () => {
  const defaultProps = {
    id: 1,
    title: '테스트 제목',
    content: '테스트 내용',
    nickName: '테스트 유저',
    createdAt: '2024-01-01',
    commentCount: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('제목을 렌더링해야 함', () => {
    render(<MainPreviewCard {...defaultProps} />);

    expect(screen.getByText('테스트 제목')).toBeInTheDocument();
  });

  it('내용을 렌더링해야 함', () => {
    render(<MainPreviewCard {...defaultProps} />);

    expect(screen.getByText('테스트 내용')).toBeInTheDocument();
  });

  it('닉네임을 렌더링해야 함', () => {
    render(<MainPreviewCard {...defaultProps} />);

    expect(screen.getByText('테스트 유저')).toBeInTheDocument();
  });

  it('클릭 시 블로그 상세 페이지로 이동해야 함', () => {
    render(<MainPreviewCard {...defaultProps} />);

    fireEvent.click(screen.getByTestId('post-card').parentElement!.parentElement!);

    expect(mockNavigate).toHaveBeenCalledWith('/blog/1');
  });

  it('imageSrc가 있을 때 이미지를 렌더링해야 함', () => {
    render(<MainPreviewCard {...defaultProps} imageSrc="https://example.com/image.png" />);

    expect(screen.getByTestId('preview-image')).toBeInTheDocument();
    expect(screen.getByTestId('preview-image')).toHaveAttribute('src', 'https://example.com/image.png');
  });

  it('imageSrc가 없을 때 이미지를 렌더링하지 않아야 함', () => {
    render(<MainPreviewCard {...defaultProps} />);

    expect(screen.queryByTestId('preview-image')).not.toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<MainPreviewCard {...defaultProps} className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('priority prop을 이미지에 전달해야 함', () => {
    render(<MainPreviewCard {...defaultProps} imageSrc="https://example.com/image.png" priority />);

    expect(screen.getByTestId('preview-image')).toHaveAttribute('data-priority', 'true');
  });
});
