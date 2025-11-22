import { render, screen, fireEvent } from '@testing-library/react';
import CommentInput from '../CommentInput';

jest.mock('@/components', () => ({
  PostInput: ({ value, onChange, placeholder }: any) => (
    <textarea
      data-testid="post-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
  Button: ({ children, onClick, variant }: any) => (
    <button onClick={onClick} data-variant={variant} data-testid="submit-button">
      {children}
    </button>
  ),
}));

describe('CommentInput', () => {
  const defaultProps = {
    nickName: '테스트 유저',
    profileUrl: 'https://example.com/profile.png',
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('닉네임을 렌더링해야 함', () => {
    render(<CommentInput {...defaultProps} />);

    expect(screen.getByText('테스트 유저')).toBeInTheDocument();
  });

  it('프로필 이미지를 렌더링해야 함', () => {
    render(<CommentInput {...defaultProps} />);

    const img = screen.getByAltText('profile');
    expect(img).toHaveAttribute('src', 'https://example.com/profile.png');
  });

  it('입력창을 렌더링해야 함', () => {
    render(<CommentInput {...defaultProps} />);

    expect(screen.getByTestId('post-input')).toBeInTheDocument();
  });

  it('제출 버튼을 렌더링해야 함', () => {
    render(<CommentInput {...defaultProps} />);

    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('내용이 있을 때 제출하면 onSubmit을 호출해야 함', () => {
    const onSubmit = jest.fn();
    render(<CommentInput {...defaultProps} onSubmit={onSubmit} />);

    const input = screen.getByTestId('post-input');
    fireEvent.change(input, { target: { value: '새 댓글' } });

    fireEvent.click(screen.getByTestId('submit-button'));

    expect(onSubmit).toHaveBeenCalledWith('새 댓글');
  });

  it('내용이 비어있을 때 제출하면 onSubmit을 호출하지 않아야 함', () => {
    const onSubmit = jest.fn();
    render(<CommentInput {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByTestId('submit-button'));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('공백만 있을 때 제출하면 onSubmit을 호출하지 않아야 함', () => {
    const onSubmit = jest.fn();
    render(<CommentInput {...defaultProps} onSubmit={onSubmit} />);

    const input = screen.getByTestId('post-input');
    fireEvent.change(input, { target: { value: '   ' } });

    fireEvent.click(screen.getByTestId('submit-button'));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('제출 후 입력창이 초기화되어야 함', () => {
    const onSubmit = jest.fn();
    render(<CommentInput {...defaultProps} onSubmit={onSubmit} />);

    const input = screen.getByTestId('post-input');
    fireEvent.change(input, { target: { value: '새 댓글' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    expect(input).toHaveValue('');
  });

  it('내용이 있을 때 버튼이 solid variant를 가져야 함', () => {
    render(<CommentInput {...defaultProps} />);

    const input = screen.getByTestId('post-input');
    fireEvent.change(input, { target: { value: '내용' } });

    expect(screen.getByTestId('submit-button')).toHaveAttribute('data-variant', 'solid');
  });

  it('내용이 없을 때 버튼이 outline variant를 가져야 함', () => {
    render(<CommentInput {...defaultProps} />);

    expect(screen.getByTestId('submit-button')).toHaveAttribute('data-variant', 'outline');
  });
});
