import { render, screen, fireEvent } from '@testing-library/react';
import PageHeaderLeft from '../PageHeaderLeft';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

describe('PageHeaderLeft', () => {
  it('햄버거 메뉴 버튼을 렌더링해야 함', () => {
    render(<PageHeaderLeft />);

    expect(screen.getByRole('button', { name: '메뉴 열기' })).toBeInTheDocument();
  });

  it('GITLOG 로고를 렌더링해야 함', () => {
    render(<PageHeaderLeft />);

    expect(screen.getByText('GITLOG')).toBeInTheDocument();
  });

  it('로고가 홈으로 링크되어야 함', () => {
    render(<PageHeaderLeft />);

    expect(screen.getByText('GITLOG').closest('a')).toHaveAttribute('href', '/');
  });

  it('햄버거 버튼 클릭 시 onHamburgerClick을 호출해야 함', () => {
    const onHamburgerClick = jest.fn();
    render(<PageHeaderLeft onHamburgerClick={onHamburgerClick} />);

    fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }));

    expect(onHamburgerClick).toHaveBeenCalled();
  });

  it('onHamburgerClick이 없을 때 에러가 발생하지 않아야 함', () => {
    render(<PageHeaderLeft />);

    expect(() => {
      fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }));
    }).not.toThrow();
  });
});
