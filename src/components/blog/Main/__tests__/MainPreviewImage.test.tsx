import { render, screen } from '@testing-library/react';
import MainPreviewImage from '../MainPreviewImage';

describe('MainPreviewImage', () => {
  it('이미지를 렌더링해야 함', () => {
    render(<MainPreviewImage src="https://example.com/image.png" />);

    const img = screen.getByAltText('Blog preview');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.png');
  });

  it('src가 없을 때 기본 이미지를 사용해야 함', () => {
    render(<MainPreviewImage />);

    const img = screen.getByAltText('Blog preview');
    expect(img).toBeInTheDocument();
  });

  it('priority가 true일 때 eager 로딩을 사용해야 함', () => {
    render(<MainPreviewImage src="https://example.com/image.png" priority />);

    const img = screen.getByAltText('Blog preview');
    expect(img).toHaveAttribute('loading', 'eager');
  });

  it('priority가 false일 때 lazy 로딩을 사용해야 함', () => {
    render(<MainPreviewImage src="https://example.com/image.png" />);

    const img = screen.getByAltText('Blog preview');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<MainPreviewImage className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
