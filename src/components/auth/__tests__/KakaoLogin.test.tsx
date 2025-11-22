import { render, screen } from '@testing-library/react';
import OAuthCallback from '../KakaoLogin';

jest.mock('@/hooks', () => ({
  useKakaoCallback: jest.fn(),
}));

describe('OAuthCallback', () => {
  it('로딩 UI를 렌더링해야 함', () => {
    render(<OAuthCallback />);

    expect(screen.getByText('카카오 로그인 처리중')).toBeInTheDocument();
    expect(screen.getByText('잠시만 기다려주세요')).toBeInTheDocument();
  });

  it('스피너를 렌더링해야 함', () => {
    const { container } = render(<OAuthCallback />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('useKakaoCallback 훅을 호출해야 함', () => {
    const { useKakaoCallback } = require('@/hooks');
    render(<OAuthCallback />);

    expect(useKakaoCallback).toHaveBeenCalled();
  });
});
