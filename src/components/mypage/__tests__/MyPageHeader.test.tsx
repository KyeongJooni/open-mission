import { render, screen, fireEvent } from '@testing-library/react';
import MyPageHeader from '../MyPageHeader';

jest.mock('@/components', () => ({
  PostHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="post-header">
      <span>{title}</span>
      <span>{subtitle}</span>
    </div>
  ),
  TextBox: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="text-box" onClick={onClick}>{children}</button>
  ),
  TextField: ({ value, onChange, placeholder, disabled, error }: any) => (
    <input
      data-testid={`text-field-${placeholder}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      data-error={error}
    />
  ),
}));

jest.mock('@/assets/icons', () => ({
  SettingsIcon: () => <span data-testid="settings-icon">Settings</span>,
  EditProfileIcon: () => <span data-testid="edit-profile-icon">Edit</span>,
}));

describe('MyPageHeader', () => {
  const defaultProps = {
    isEditMode: false,
    nickname: '테스트유저',
    bio: '테스트 소개',
    profilePicture: 'test.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('컴포넌트가 렌더링되어야 함', () => {
    render(<MyPageHeader {...defaultProps} />);

    expect(screen.getByAltText('Profile')).toBeInTheDocument();
  });

  it('프로필 이미지를 표시해야 함', () => {
    render(<MyPageHeader {...defaultProps} />);

    const img = screen.getByAltText('Profile');
    expect(img).toHaveAttribute('src', 'test.jpg');
  });

  it('편집 모드가 아닐 때 PostHeader를 표시해야 함', () => {
    render(<MyPageHeader {...defaultProps} isEditProfilePage={false} />);

    expect(screen.getByTestId('post-header')).toBeInTheDocument();
  });

  it('편집 모드가 아닐 때 설정 버튼을 표시해야 함', () => {
    render(<MyPageHeader {...defaultProps} />);

    expect(screen.getByTestId('text-box')).toBeInTheDocument();
  });

  it('showSettingsButton이 false일 때 설정 버튼을 숨겨야 함', () => {
    render(<MyPageHeader {...defaultProps} showSettingsButton={false} />);

    expect(screen.queryByTestId('text-box')).not.toBeInTheDocument();
  });

  it('편집 모드일 때 프로필 편집 아이콘을 표시해야 함', () => {
    render(<MyPageHeader {...defaultProps} isEditMode={true} />);

    expect(screen.getByLabelText('프로필 사진 변경')).toBeInTheDocument();
  });

  it('설정 버튼 클릭 시 onEditClick이 호출되어야 함', () => {
    const onEditClick = jest.fn();
    render(<MyPageHeader {...defaultProps} onEditClick={onEditClick} />);

    fireEvent.click(screen.getByTestId('text-box'));
    expect(onEditClick).toHaveBeenCalled();
  });

  it('isEditProfilePage일 때 TextField를 표시해야 함', () => {
    render(<MyPageHeader {...defaultProps} isEditProfilePage={true} isEditMode={true} />);

    expect(screen.getAllByTestId(/text-field/)).toHaveLength(2);
  });

  it('닉네임 변경 시 onNicknameChange가 호출되어야 함', () => {
    const onNicknameChange = jest.fn();
    render(
      <MyPageHeader
        {...defaultProps}
        isEditProfilePage={true}
        isEditMode={true}
        onNicknameChange={onNicknameChange}
      />
    );

    const nicknameField = screen.getAllByTestId(/text-field/)[0];
    fireEvent.change(nicknameField, { target: { value: '새닉네임' } });
    expect(onNicknameChange).toHaveBeenCalledWith('새닉네임');
  });

  it('소개 변경 시 onBioChange가 호출되어야 함', () => {
    const onBioChange = jest.fn();
    render(
      <MyPageHeader
        {...defaultProps}
        isEditProfilePage={true}
        isEditMode={true}
        onBioChange={onBioChange}
      />
    );

    const bioField = screen.getAllByTestId(/text-field/)[1];
    fireEvent.change(bioField, { target: { value: '새소개' } });
    expect(onBioChange).toHaveBeenCalledWith('새소개');
  });
});
