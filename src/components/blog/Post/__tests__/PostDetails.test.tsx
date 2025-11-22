import { render, screen } from '@testing-library/react';
import PostDetails from '../PostDetails';

jest.mock('@/utils/date', () => ({
  formatCommentDate: jest.fn(() => '2024-01-01'),
}));

describe('PostDetails', () => {
  const defaultProps = {
    nickName: '테스트 유저',
    profileUrl: 'https://example.com/profile.png',
    createdAt: '2024-01-01T00:00:00Z',
    commentCount: 5,
  };

  it('닉네임을 렌더링해야 함', () => {
    render(<PostDetails {...defaultProps} />);

    expect(screen.getByText('테스트 유저')).toBeInTheDocument();
  });

  it('날짜를 렌더링해야 함', () => {
    render(<PostDetails {...defaultProps} />);

    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('댓글 수를 렌더링해야 함', () => {
    render(<PostDetails {...defaultProps} />);

    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<PostDetails {...defaultProps} className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('프로필 이미지를 배경으로 설정해야 함', () => {
    const { container } = render(<PostDetails {...defaultProps} />);

    const profileDiv = container.querySelector('[style*="background-image"]');
    expect(profileDiv).toBeInTheDocument();
  });
});
