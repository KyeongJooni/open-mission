import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../Layout';

jest.mock('@/layout/Sidebar', () => ({
  __esModule: true,
  default: ({ isLoggedIn }: { isLoggedIn: boolean }) => (
    <div data-testid="sidebar">Sidebar - {isLoggedIn ? 'Logged In' : 'Logged Out'}</div>
  ),
}));

jest.mock('@/components', () => ({
  PageHeader: ({ type, onHamburgerClick }: { type: string; onHamburgerClick: () => void }) => (
    <div data-testid="page-header" data-type={type}>
      <button onClick={onHamburgerClick}>Menu</button>
    </div>
  ),
}));

jest.mock('@/hooks', () => ({
  useSidebar: () => ({
    isSidebarOpen: false,
    sidebarRef: { current: null },
    toggleSidebar: jest.fn(),
  }),
  usePageHeaderType: () => 'main',
  useEditProfile: () => ({
    handleEdit: jest.fn(),
    handleCancel: jest.fn(),
  }),
}));

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ isLoggedIn: false }),
}));

describe('Layout', () => {
  it('PageHeader를 렌더링해야 함', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    expect(screen.getByTestId('page-header')).toBeInTheDocument();
  });

  it('Sidebar를 렌더링해야 함', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('pageHeaderType을 PageHeader에 전달해야 함', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    expect(screen.getByTestId('page-header')).toHaveAttribute('data-type', 'main');
  });

  it('로그인 상태를 Sidebar에 전달해야 함', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    expect(screen.getByText('Sidebar - Logged Out')).toBeInTheDocument();
  });
});
