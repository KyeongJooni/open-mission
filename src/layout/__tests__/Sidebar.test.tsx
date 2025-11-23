import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';

const mockHandleStartGitlog = jest.fn();
const mockHandleMyGitlog = jest.fn();
const mockHandleWriteGitlog = jest.fn();
const mockHandleSettings = jest.fn();
const mockHandleLogout = jest.fn();
const mockCloseModal = jest.fn();
const mockOnModalConfirm = jest.fn();

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => ({
    user: {
      nickname: '테스트 유저',
      introduction: '테스트 소개',
      profilePicture: 'https://example.com/profile.png',
    },
  }),
}));

jest.mock('@/stores/useModalStore', () => ({
  useModalStore: () => ({
    modalType: null,
    modalMessage: '',
    confirmButtonText: '확인',
    onModalConfirm: mockOnModalConfirm,
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

jest.mock('@/components', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  Spacer: () => <div data-testid="spacer" />,
  Modal: ({ children }: any) => <div data-testid="modal">{children}</div>,
}));

jest.mock('@/components/auth', () => ({
  LoginModal: () => <div data-testid="login-modal" />,
}));

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('로그인하지 않았을 때 시작 버튼을 표시해야 함', () => {
    render(<Sidebar isLoggedIn={false} />);

    expect(screen.getByText('깃로그 시작하기')).toBeInTheDocument();
  });

  it('로그인하지 않았을 때 인용구를 표시해야 함', () => {
    render(<Sidebar isLoggedIn={false} />);

    expect(screen.getByText(/You can make anything by writing/)).toBeInTheDocument();
  });

  it('로그인했을 때 사용자 정보를 표시해야 함', () => {
    render(<Sidebar isLoggedIn={true} />);

    expect(screen.getByText('테스트 유저')).toBeInTheDocument();
    expect(screen.getByText('테스트 소개')).toBeInTheDocument();
  });

  it('로그인했을 때 내 깃로그/글쓰기 버튼을 표시해야 함', () => {
    render(<Sidebar isLoggedIn={true} />);

    expect(screen.getByText('나의 깃로그')).toBeInTheDocument();
    expect(screen.getByText('깃로그 쓰기')).toBeInTheDocument();
  });

  it('로그인했을 때 설정/로그아웃 버튼을 표시해야 함', () => {
    render(<Sidebar isLoggedIn={true} />);

    expect(screen.getByText('설정')).toBeInTheDocument();
    expect(screen.getByText('로그아웃')).toBeInTheDocument();
  });

  it('시작 버튼 클릭 시 handleStartGitlog를 호출해야 함', () => {
    render(<Sidebar isLoggedIn={false} />);

    fireEvent.click(screen.getByText('깃로그 시작하기'));

    expect(mockHandleStartGitlog).toHaveBeenCalled();
  });

  it('내 깃로그 버튼 클릭 시 handleMyGitlog를 호출해야 함', () => {
    render(<Sidebar isLoggedIn={true} />);

    fireEvent.click(screen.getByText('나의 깃로그'));

    expect(mockHandleMyGitlog).toHaveBeenCalled();
  });

  it('글쓰기 버튼 클릭 시 handleWriteGitlog를 호출해야 함', () => {
    render(<Sidebar isLoggedIn={true} />);

    fireEvent.click(screen.getByText('깃로그 쓰기'));

    expect(mockHandleWriteGitlog).toHaveBeenCalled();
  });

  it('설정 버튼 클릭 시 handleSettings를 호출해야 함', () => {
    render(<Sidebar isLoggedIn={true} />);

    fireEvent.click(screen.getByText('설정'));

    expect(mockHandleSettings).toHaveBeenCalled();
  });

  it('로그아웃 버튼 클릭 시 handleLogout을 호출해야 함', () => {
    render(<Sidebar isLoggedIn={true} />);

    fireEvent.click(screen.getByText('로그아웃'));

    expect(mockHandleLogout).toHaveBeenCalled();
  });

  it('로그인했을 때 프로필 이미지를 표시해야 함', () => {
    render(<Sidebar isLoggedIn={true} />);

    const img = screen.getByAltText('테스트 유저의 프로필');
    expect(img).toHaveAttribute('src', 'https://example.com/profile.png');
  });
});
