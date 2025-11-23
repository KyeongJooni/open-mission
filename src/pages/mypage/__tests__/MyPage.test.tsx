import { render, screen } from '@testing-library/react';
import MyPage from '../MyPage';

const mockUseMyPage = jest.fn();
const mockUseEditProfile = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('react-router-dom', () => ({
  Outlet: ({ context }: any) => (
    <div data-testid="outlet" data-context={JSON.stringify(context)}>
      Outlet
    </div>
  ),
}));

jest.mock('@/hooks', () => ({
  useMyPage: () => mockUseMyPage(),
  useEditProfile: () => mockUseEditProfile(),
}));

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/components', () => ({
  Spacer: ({ height }: { height: string }) => <div data-testid="spacer" data-height={height} />,
  PostHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="post-header">
      <span>{title}</span>
      <span>{subtitle}</span>
    </div>
  ),
  MyPageHeader: ({ nickname, bio }: { nickname: string; bio: string }) => (
    <div data-testid="mypage-header">
      <span>{nickname}</span>
      <span>{bio}</span>
    </div>
  ),
}));

describe('MyPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: { nickname: 'testuser', profilePicture: 'profile.jpg' },
    });

    mockUseEditProfile.mockReturnValue({
      headerNickname: 'testuser',
      headerIntroduction: '소개',
      setHeaderNickname: jest.fn(),
      setHeaderIntroduction: jest.fn(),
      previewImage: 'preview.jpg',
      fileInputRef: { current: null },
      handleImageUpload: jest.fn(),
      handleProfileImageClick: jest.fn(),
      validateField: jest.fn(),
      handleSave: jest.fn(),
    });
  });

  it('프로필 페이지일 때 MyPageHeader를 표시해야 함', () => {
    mockUseMyPage.mockReturnValue({
      isMyProfile: true,
      isEditProfile: false,
      isProfilePage: true,
      isEditMode: false,
      title: '마이페이지',
      subtitle: '',
      spacerTopHeight: 'md',
      handleEditProfile: jest.fn(),
    });

    render(<MyPage />);

    expect(screen.getByTestId('mypage-header')).toBeInTheDocument();
  });

  it('프로필 페이지가 아닐 때 PostHeader를 표시해야 함', () => {
    mockUseMyPage.mockReturnValue({
      isMyProfile: false,
      isEditProfile: false,
      isProfilePage: false,
      isEditMode: false,
      title: '회원가입',
      subtitle: '새 계정을 만드세요',
      spacerTopHeight: 'md',
      handleEditProfile: jest.fn(),
    });

    render(<MyPage />);

    expect(screen.getByTestId('post-header')).toBeInTheDocument();
  });

  it('Outlet을 렌더링해야 함', () => {
    mockUseMyPage.mockReturnValue({
      isMyProfile: true,
      isEditProfile: false,
      isProfilePage: true,
      isEditMode: false,
      title: '마이페이지',
      subtitle: '',
      spacerTopHeight: 'md',
      handleEditProfile: jest.fn(),
    });

    render(<MyPage />);

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    mockUseMyPage.mockReturnValue({
      isMyProfile: true,
      isEditProfile: false,
      isProfilePage: true,
      isEditMode: false,
      title: '마이페이지',
      subtitle: '',
      spacerTopHeight: 'md',
      handleEditProfile: jest.fn(),
    });

    const { container } = render(<MyPage className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
