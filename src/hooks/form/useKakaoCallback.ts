import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleKakaoRedirect } from '@/api/auth/authApi';
import { useAuthStore } from '@/stores/useAuthStore';
import { setAccessToken, setRefreshToken } from '@/api/apiInstance';

export const useKakaoCallback = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (hasCalledRef.current) {
      return;
    }

    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      navigate('/');
      return;
    }

    hasCalledRef.current = true;

    // Promise로 직접 처리
    handleKakaoRedirect({ code })
      .then(async response => {
        if (response.code === 200) {
          // 로그인 성공 (기존 회원)
          setAccessToken(response.data.accessToken || null);
          setRefreshToken(response.data.refreshToken || null);
          authStore.resetCheckStatus();
          await authStore.checkLoginStatus();
          window.location.href = '/';
        } else if (response.code === 401) {
          // 회원가입 필요 (신규 회원)
          sessionStorage.setItem('isKakaoSignup', 'true');
          if (response.data.kakaoId) {
            sessionStorage.setItem('kakaoId', response.data.kakaoId.toString());
          }
          window.location.href = '/mypage/signup';
        } else {
          // 알 수 없는 상태
          window.location.href = '/';
        }
      })
      .catch(() => {
        window.location.href = '/';
      });
  }, [navigate, authStore]);

  return {
    isLoading: false,
    isError: false,
    error: null,
  };
};
