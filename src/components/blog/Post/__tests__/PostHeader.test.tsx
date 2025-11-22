import { render, screen } from '@testing-library/react';
import PostHeader from '../PostHeader';

describe('PostHeader', () => {
  it('제목을 렌더링해야 함', () => {
    render(<PostHeader title="테스트 제목" />);

    expect(screen.getByText('테스트 제목')).toBeInTheDocument();
  });

  it('제목이 h1 태그로 렌더링되어야 함', () => {
    render(<PostHeader title="테스트 제목" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('테스트 제목');
  });

  it('subtitle을 렌더링해야 함', () => {
    render(<PostHeader title="제목" subtitle="부제목" />);

    expect(screen.getByText('부제목')).toBeInTheDocument();
  });

  it('subtitle이 없으면 부제목을 렌더링하지 않아야 함', () => {
    render(<PostHeader title="제목" />);

    expect(screen.queryByText('부제목')).not.toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<PostHeader title="제목" className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
