import { render, screen, fireEvent } from '@testing-library/react';
import Textarea from '../Textarea';

jest.mock('@/components', () => ({
  TextField: ({ placeholder, value, onChange, onBlur, disabled, error, name, type }: any) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      data-error={error}
    />
  ),
}));

describe('Textarea', () => {
  it('TextField를 렌더링해야 함', () => {
    render(<Textarea placeholder="테스트" />);

    expect(screen.getByPlaceholderText('테스트')).toBeInTheDocument();
  });

  it('title을 렌더링해야 함', () => {
    render(<Textarea title="제목" />);

    expect(screen.getByText('제목')).toBeInTheDocument();
  });

  it('title이 없으면 제목을 렌더링하지 않아야 함', () => {
    const { container } = render(<Textarea />);

    const titleElements = container.querySelectorAll('.text-sm.font-light.text-gray-56');
    expect(titleElements.length).toBe(0);
  });

  it('hintText를 렌더링해야 함', () => {
    render(<Textarea hintText="힌트 텍스트" />);

    expect(screen.getByText('* 힌트 텍스트')).toBeInTheDocument();
  });

  it('error가 있으면 에러 메시지를 렌더링해야 함', () => {
    render(<Textarea error="에러 메시지" />);

    expect(screen.getByText('* 에러 메시지')).toBeInTheDocument();
  });

  it('error가 있으면 hintText 대신 에러를 표시해야 함', () => {
    render(<Textarea error="에러" hintText="힌트" />);

    expect(screen.getByText('* 에러')).toBeInTheDocument();
    expect(screen.queryByText('* 힌트')).not.toBeInTheDocument();
  });

  it('value를 TextField에 전달해야 함', () => {
    render(<Textarea value="테스트 값" onChange={() => {}} placeholder="입력" />);

    expect(screen.getByDisplayValue('테스트 값')).toBeInTheDocument();
  });

  it('onChange를 호출해야 함', () => {
    const onChange = jest.fn();
    render(<Textarea onChange={onChange} placeholder="입력" />);

    const input = screen.getByPlaceholderText('입력');
    fireEvent.change(input, { target: { value: '새 값' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<Textarea className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('disabled 상태를 TextField에 전달해야 함', () => {
    render(<Textarea disabled placeholder="입력" />);

    expect(screen.getByPlaceholderText('입력')).toBeDisabled();
  });
});
