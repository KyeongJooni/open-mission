import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

const mockToggleSidebar = jest.fn();
const mockHandleEdit = jest.fn();
const mockHandleCancel = jest.fn();

jest.mock('@/hooks', () => ({
  useSidebar: () => ({
    isSidebarOpen: false,
    sidebarRef: { current: null },
    toggleSidebar: mockToggleSidebar,
  }),
  usePageHeaderType: () => 'main',
  useEditProfile: () => ({
    handleEdit: mockHandleEdit,
    handleCancel: mockHandleCancel,
  }),
}));

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn((selector) => selector({ isLoggedIn: false })),
}));

jest.mock('@/components', () => ({
  PageHeader: ({ type, onHamburgerClick }: any) => (
    <header data-testid="page-header" data-type={type}>
      <button onClick={onHamburgerClick} data-testid="hamburger">메뉴</button>
    </header>
  ),
}));

jest.mock('@/layout/Sidebar', () => ({ isLoggedIn }: any) => (
  <aside data-testid="sidebar" data-logged-in={isLoggedIn}>사이드바</aside>
));

jest.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="outlet">콘텐츠</div>,
}));

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('PageHeader를 렌더링해야 함', () => {
    render(<Layout />);

    expect(screen.getByTestId('page-header')).toBeInTheDocument();
  });

  it('Sidebar를 렌더링해야 함', () => {
    render(<Layout />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('Outlet을 렌더링해야 함', () => {
    render(<Layout />);

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('pageHeaderType을 PageHeader에 전달해야 함', () => {
    render(<Layout />);

    expect(screen.getByTestId('page-header')).toHaveAttribute('data-type', 'main');
  });

  it('isLoggedIn 상태를 Sidebar에 전달해야 함', () => {
    render(<Layout />);

    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-logged-in', 'false');
  });
});
