import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleKakaoRedirect } from '@/api/auth/authApi';

export const useKakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      return;
    }

    window.history.replaceState({}, '', '/mypage/signup');

    handleKakaoRedirect({ code })
      .then(() => {
        sessionStorage.setItem('isKakaoSignup', 'true');

        navigate('/mypage/signup');
      })
      .catch(error => {
        console.error('카카오 로그인 실패:', error);
        navigate('/mypage');
      });
  }, [navigate]);
};
