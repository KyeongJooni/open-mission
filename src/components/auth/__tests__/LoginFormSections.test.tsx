import { render, screen, fireEvent } from '@testing-library/react';
import { InputSection, ErrorMessage, SnsDivider } from '../LoginFormComponents/LoginFormSections';

describe('InputSection', () => {
  const defaultProps = {
    email: '',
    password: '',
    onEmailChange: jest.fn(),
    onPasswordChange: jest.fn(),
    onKeyDown: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('이메일 입력창을 렌더링해야 함', () => {
    render(<InputSection {...defaultProps} />);

    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
  });

  it('비밀번호 입력창을 렌더링해야 함', () => {
    render(<InputSection {...defaultProps} />);

    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
  });

  it('이메일 입력 시 onEmailChange를 호출해야 함', () => {
    const onEmailChange = jest.fn();
    render(<InputSection {...defaultProps} onEmailChange={onEmailChange} />);

    fireEvent.change(screen.getByPlaceholderText('이메일'), {
      target: { value: 'test@example.com' },
    });

    expect(onEmailChange).toHaveBeenCalledWith('test@example.com');
  });

  it('비밀번호 입력 시 onPasswordChange를 호출해야 함', () => {
    const onPasswordChange = jest.fn();
    render(<InputSection {...defaultProps} onPasswordChange={onPasswordChange} />);

    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'password123' },
    });

    expect(onPasswordChange).toHaveBeenCalledWith('password123');
  });

  it('키 입력 시 onKeyDown을 호출해야 함', () => {
    const onKeyDown = jest.fn();
    render(<InputSection {...defaultProps} onKeyDown={onKeyDown} />);

    fireEvent.keyDown(screen.getByPlaceholderText('이메일'), { key: 'Enter' });

    expect(onKeyDown).toHaveBeenCalled();
  });
});

describe('ErrorMessage', () => {
  it('메시지가 있을 때 에러 메시지를 표시해야 함', () => {
    render(<ErrorMessage message="에러 발생" />);

    expect(screen.getByText('* 에러 발생')).toBeInTheDocument();
  });

  it('메시지가 없을 때 아무것도 렌더링하지 않아야 함', () => {
    const { container } = render(<ErrorMessage message="" />);

    expect(container.firstChild).toBeNull();
  });
});

describe('SnsDivider', () => {
  it('텍스트를 렌더링해야 함', () => {
    render(<SnsDivider text="또는" />);

    expect(screen.getByText('또는')).toBeInTheDocument();
  });
});
