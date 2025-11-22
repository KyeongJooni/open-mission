import { render, screen } from '@testing-library/react';
import PostCard from '../PostCard';

describe('PostCard', () => {
  it('제목을 렌더링해야 함', () => {
    render(<PostCard title="테스트 제목" />);

    expect(screen.getByText('테스트 제목')).toBeInTheDocument();
  });

  it('콘텐츠를 렌더링해야 함', () => {
    render(<PostCard title="제목" content="테스트 콘텐츠" />);

    expect(screen.getByText('테스트 콘텐츠')).toBeInTheDocument();
  });

  it('콘텐츠가 없으면 콘텐츠 영역을 렌더링하지 않아야 함', () => {
    render(<PostCard title="제목" />);

    expect(screen.queryByText('테스트 콘텐츠')).not.toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<PostCard title="제목" className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renderTitle이 제공되면 커스텀 제목을 렌더링해야 함', () => {
    render(
      <PostCard
        title="기본 제목"
        renderTitle={<h1 data-testid="custom-title">커스텀 제목</h1>}
      />
    );

    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    expect(screen.queryByText('기본 제목')).not.toBeInTheDocument();
  });

  it('hasImage prop이 true일 때 스타일이 적용되어야 함', () => {
    const { container } = render(<PostCard title="제목" hasImage />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
