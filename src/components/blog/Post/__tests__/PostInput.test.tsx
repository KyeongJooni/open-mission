import { render, screen, fireEvent } from '@testing-library/react';
import PostInput from '../PostInput';

describe('PostInput', () => {
  it('컴포넌트가 렌더링되어야 함', () => {
    const onChange = jest.fn();
    render(<PostInput value="" onChange={onChange} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('placeholder를 표시해야 함', () => {
    const onChange = jest.fn();
    render(<PostInput value="" onChange={onChange} placeholder="테스트 플레이스홀더" />);

    expect(screen.getByPlaceholderText('테스트 플레이스홀더')).toBeInTheDocument();
  });

  it('기본 placeholder를 표시해야 함', () => {
    const onChange = jest.fn();
    render(<PostInput value="" onChange={onChange} />);

    expect(screen.getByPlaceholderText('댓글을 입력하세요.')).toBeInTheDocument();
  });

  it('value를 표시해야 함', () => {
    const onChange = jest.fn();
    render(<PostInput value="테스트 내용" onChange={onChange} />);

    expect(screen.getByDisplayValue('테스트 내용')).toBeInTheDocument();
  });

  it('입력 시 onChange를 호출해야 함', () => {
    const onChange = jest.fn();
    render(<PostInput value="" onChange={onChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '새 내용' } });

    expect(onChange).toHaveBeenCalledWith('새 내용');
  });

  it('className을 적용해야 함', () => {
    const onChange = jest.fn();
    const { container } = render(
      <PostInput value="" onChange={onChange} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
