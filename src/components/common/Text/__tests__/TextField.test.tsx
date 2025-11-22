import { render, screen, fireEvent } from '@testing-library/react';
import TextField from '../TextField';

describe('TextField', () => {
  it('input 요소를 렌더링해야 함', () => {
    render(<TextField />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('placeholder를 표시해야 함', () => {
    render(<TextField placeholder="테스트 플레이스홀더" />);

    expect(screen.getByPlaceholderText('테스트 플레이스홀더')).toBeInTheDocument();
  });

  it('기본 placeholder를 표시해야 함', () => {
    render(<TextField />);

    expect(screen.getByPlaceholderText('Text field')).toBeInTheDocument();
  });

  it('value를 표시해야 함', () => {
    render(<TextField value="테스트 값" onChange={() => {}} />);

    expect(screen.getByDisplayValue('테스트 값')).toBeInTheDocument();
  });

  it('입력 시 onChange를 호출해야 함', () => {
    const onChange = jest.fn();
    render(<TextField onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '새 값' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('blur 시 onBlur를 호출해야 함', () => {
    const onBlur = jest.fn();
    render(<TextField onBlur={onBlur} />);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(onBlur).toHaveBeenCalled();
  });

  it('disabled일 때 입력이 비활성화되어야 함', () => {
    render(<TextField disabled />);

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('error가 true일 때 에러 스타일을 적용해야 함', () => {
    const { container } = render(<TextField error />);

    expect(container.querySelector('.border-error')).toBeInTheDocument();
  });

  it('error와 errorMessage가 있을 때 에러 메시지를 표시해야 함', () => {
    render(<TextField error errorMessage="에러 메시지" />);

    expect(screen.getByText('에러 메시지')).toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<TextField className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('type을 설정할 수 있어야 함', () => {
    render(<TextField type="password" />);

    const input = screen.getByPlaceholderText('Text field');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('name 속성을 설정할 수 있어야 함', () => {
    render(<TextField name="test-name" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'test-name');
  });
});
