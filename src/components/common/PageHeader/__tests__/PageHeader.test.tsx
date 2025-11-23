import { render, screen } from '@testing-library/react';
import PageHeader from '../PageHeader';

jest.mock('@/components', () => ({
  PageHeaderLeft: ({ onHamburgerClick }: any) => (
    <div data-testid="page-header-left" onClick={onHamburgerClick}>
      Left
    </div>
  ),
  PageHeaderRight: ({ type, onEdit, onCancel }: any) => (
    <div data-testid="page-header-right" data-type={type}>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

describe('PageHeader', () => {
  it('PageHeaderLeft를 렌더링해야 함', () => {
    render(<PageHeader type="main" />);

    expect(screen.getByTestId('page-header-left')).toBeInTheDocument();
  });

  it('PageHeaderRight를 렌더링해야 함', () => {
    render(<PageHeader type="main" />);

    expect(screen.getByTestId('page-header-right')).toBeInTheDocument();
  });

  it('type을 PageHeaderRight에 전달해야 함', () => {
    render(<PageHeader type="detail" />);

    expect(screen.getByTestId('page-header-right')).toHaveAttribute('data-type', 'detail');
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<PageHeader type="main" className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
