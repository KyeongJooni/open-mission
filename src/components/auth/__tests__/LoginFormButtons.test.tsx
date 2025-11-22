import { render, screen, fireEvent } from '@testing-library/react';
import { EmailLoginButton, KakaoLoginButton, SignupButton } from '../LoginFormComponents/LoginFormButtons';

describe('EmailLoginButton', () => {
  it('텍스트를 렌더링해야 함', () => {
    render(<EmailLoginButton onClick={() => {}} text="이메일 로그인" />);

    expect(screen.getByText('이메일 로그인')).toBeInTheDocument();
  });

  it('클릭 시 onClick을 호출해야 함', () => {
    const onClick = jest.fn();
    render(<EmailLoginButton onClick={onClick} text="이메일 로그인" />);

    fireEvent.click(screen.getByText('이메일 로그인'));

    expect(onClick).toHaveBeenCalled();
  });
});

describe('KakaoLoginButton', () => {
  it('텍스트를 렌더링해야 함', () => {
    render(<KakaoLoginButton onClick={() => {}} text="카카오 로그인" />);

    expect(screen.getByText('카카오 로그인')).toBeInTheDocument();
  });

  it('클릭 시 onClick을 호출해야 함', () => {
    const onClick = jest.fn();
    render(<KakaoLoginButton onClick={onClick} text="카카오 로그인" />);

    fireEvent.click(screen.getByText('카카오 로그인'));

    expect(onClick).toHaveBeenCalled();
  });
});

describe('SignupButton', () => {
  it('회원가입 텍스트를 렌더링해야 함', () => {
    render(<SignupButton onClick={() => {}} />);

    expect(screen.getByText('또는 회원가입')).toBeInTheDocument();
  });

  it('클릭 시 onClick을 호출해야 함', () => {
    const onClick = jest.fn();
    render(<SignupButton onClick={onClick} />);

    fireEvent.click(screen.getByText('또는 회원가입'));

    expect(onClick).toHaveBeenCalled();
  });
});
