import { render, screen } from '@testing-library/react';
import Pagination from '../Pagination';

jest.mock('../PaginationButton', () => ({
  __esModule: true,
  default: ({ children, variant, direction }: any) => (
    <button data-testid={`pagination-${variant}-${direction || 'page'}`}>{children}</button>
  ),
}));

describe('Pagination', () => {
  it('컴포넌트가 렌더링되어야 함', () => {
    render(<Pagination />);

    expect(screen.getByTestId('pagination-navigation-prev')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-page-page')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-navigation-next')).toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<Pagination className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('페이지 번호를 표시해야 함', () => {
    render(<Pagination />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
