import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';

const mockHandleStartGitlog = jest.fn();
const mockHandleMyGitlog = jest.fn();
const mockHandleWriteGitlog = jest.fn();
const mockHandleSettings = jest.fn();
const mockHandleLogout = jest.fn();
const mockCloseModal = jest.fn();

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => ({
    user: {
      nickname: 'testuser',
      introduction: 'Hello',
      profilePicture: 'profile.jpg',
    },
  }),
}));

jest.mock('@/stores/useModalStore', () => ({
  useModalStore: () => ({
    modalType: null,
    modalMessage: '',
    confirmButtonText: '',
    onModalConfirm: jest.fn(),
    closeModal: mockCloseModal,
  }),
}));

jest.mock('@/hooks', () => ({
  useSidebar: () => ({
    handleStartGitlog: mockHandleStartGitlog,
    handleMyGitlog: mockHandleMyGitlog,
    handleWriteGitlog: mockHandleWriteGitlog,
    handleSettings: mockHandleSettings,
    handleLogout: mockHandleLogout,
  }),
}));

jest.mock('@/components/auth', () => ({
  LoginModal: () => <div data-testid="login-modal">Login Modal</div>,
}));

jest.mock('@/assets/icons', () => ({
  Profile1Icon: () => <div data-testid="profile-icon">Profile Icon</div>,
}));

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('비로그인 상태', () => {
    it('기본 프로필 아이콘을 표시해야 함', () => {
      render(<Sidebar isLoggedIn={false} />);

      expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
    });

    it('시작하기 버튼을 표시해야 함', () => {
      render(<Sidebar isLoggedIn={false} />);

      const startButton = screen.getByRole('button');
      expect(startButton).toBeInTheDocument();
    });

    it('시작하기 버튼 클릭 시 handleStartGitlog을 호출해야 함', () => {
      render(<Sidebar isLoggedIn={false} />);

      const startButton = screen.getByRole('button');
      fireEvent.click(startButton);

      expect(mockHandleStartGitlog).toHaveBeenCalled();
    });
  });

  describe('로그인 상태', () => {
    it('사용자 프로필 이미지를 표시해야 함', () => {
      render(<Sidebar isLoggedIn={true} />);

      const profileImage = screen.getByAltText('testuser의 프로필');
      expect(profileImage).toBeInTheDocument();
      expect(profileImage).toHaveAttribute('src', 'profile.jpg');
    });

    it('사용자 닉네임을 표시해야 함', () => {
      render(<Sidebar isLoggedIn={true} />);

      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('사용자 소개를 표시해야 함', () => {
      render(<Sidebar isLoggedIn={true} />);

      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('마이 깃로그 버튼 클릭 시 handleMyGitlog을 호출해야 함', () => {
      render(<Sidebar isLoggedIn={true} />);

      const buttons = screen.getAllByRole('button');
      const myGitlogButton = buttons[0];
      fireEvent.click(myGitlogButton);

      expect(mockHandleMyGitlog).toHaveBeenCalled();
    });

    it('글쓰기 버튼 클릭 시 handleWriteGitlog을 호출해야 함', () => {
      render(<Sidebar isLoggedIn={true} />);

      const buttons = screen.getAllByRole('button');
      const writeButton = buttons[1];
      fireEvent.click(writeButton);

      expect(mockHandleWriteGitlog).toHaveBeenCalled();
    });

    it('설정 버튼 클릭 시 handleSettings을 호출해야 함', () => {
      render(<Sidebar isLoggedIn={true} />);

      const buttons = screen.getAllByRole('button');
      const settingsButton = buttons[2];
      fireEvent.click(settingsButton);

      expect(mockHandleSettings).toHaveBeenCalled();
    });

    it('로그아웃 버튼 클릭 시 handleLogout을 호출해야 함', () => {
      render(<Sidebar isLoggedIn={true} />);

      const buttons = screen.getAllByRole('button');
      const logoutButton = buttons[3];
      fireEvent.click(logoutButton);

      expect(mockHandleLogout).toHaveBeenCalled();
    });
  });

  it('className을 적용해야 함', () => {
    render(<Sidebar className="custom-class" />);

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('custom-class');
  });
});
