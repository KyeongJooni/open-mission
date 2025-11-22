import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import ProfileSection from '../SignupProfileSection';

jest.mock('@/components', () => ({
  Spacer: () => <div data-testid="spacer" />,
  TextBox: ({ children, onClick }: any) => (
    <button data-testid="text-box" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('ProfileSection', () => {
  const mockStyles = {
    spacer: () => 'spacer-class',
    profileSection: () => 'profile-section-class',
    sectionTitle: () => 'section-title-class',
    profileContent: () => 'profile-content-class',
    profileImage: () => 'profile-image-class',
    image: () => 'image-class',
  };

  const defaultProps = {
    previewImage: 'https://example.com/image.png',
    fileInputRef: createRef<HTMLInputElement>(),
    handleImageUpload: jest.fn(),
    handleButtonClick: jest.fn(),
    styles: mockStyles as any,
  };

  it('프로필 이미지를 렌더링해야 함', () => {
    render(<ProfileSection {...defaultProps} />);

    expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'https://example.com/image.png');
  });

  it('프로필 사진 추가 버튼을 렌더링해야 함', () => {
    render(<ProfileSection {...defaultProps} />);

    expect(screen.getByText('프로필 사진 추가')).toBeInTheDocument();
  });

  it('버튼 클릭 시 handleButtonClick을 호출해야 함', () => {
    const handleButtonClick = jest.fn();
    render(<ProfileSection {...defaultProps} handleButtonClick={handleButtonClick} />);

    fireEvent.click(screen.getByTestId('text-box'));

    expect(handleButtonClick).toHaveBeenCalled();
  });

  it('Spacer를 렌더링해야 함', () => {
    render(<ProfileSection {...defaultProps} />);

    expect(screen.getByTestId('spacer')).toBeInTheDocument();
  });
});
