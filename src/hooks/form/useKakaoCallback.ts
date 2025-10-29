import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useKakaoCallbackMutation } from '@/api/auth/authQuery';
import { setAccessToken, setRefreshToken } from '@/api/apiInstance';
import { KAKAO_RESPONSE_CODE, KAKAO_REDIRECT_PATH } from '@/constants';
import type { ApiResponse } from '@/api/apiTypes';
import type { KakaoCallbackData } from '@/api/auth/authTypes';

// code 추출
const getAuthCode = () => new URLSearchParams(window.location.search).get('code');

const saveNewUserSession = (kakaoId?: number) => {
  sessionStorage.setItem('isKakaoSignup', 'true');
  if (kakaoId) {
    sessionStorage.setItem('kakaoId', kakaoId.toString());
  }
};

export const useKakaoCallback = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasCalledRef = useRef(false);

  // 기존 회원
  const handleExistingUser = useCallback(
    async (data: KakaoCallbackData) => {
      setAccessToken(data.accessToken || null);
      setRefreshToken(data.refreshToken || null);
      // React Query 캐시 무효화로 유저 정보 다시 가져오기
      await queryClient.invalidateQueries({ queryKey: ['userInfo'] });
      navigate(KAKAO_REDIRECT_PATH.HOME, { replace: true });
    },
    [queryClient, navigate]
  );

  // 신규 회원
  const handleNewUser = useCallback(
    (data: KakaoCallbackData) => {
      saveNewUserSession(data.kakaoId);
      navigate(KAKAO_REDIRECT_PATH.SIGNUP, { replace: true });
    },
    [navigate]
  );

  // 응답 처리
  const handleResponse = useCallback(
    async (response: ApiResponse<KakaoCallbackData>) => {
      switch (response.code) {
        case KAKAO_RESPONSE_CODE.SUCCESS:
          await handleExistingUser(response.data);
          break;
        case KAKAO_RESPONSE_CODE.SIGNUP_REQUIRED:
          handleNewUser(response.data);
          break;
        default:
          navigate(KAKAO_REDIRECT_PATH.HOME, { replace: true });
      }
    },
    [handleExistingUser, handleNewUser, navigate]
  );

  const { mutate, isPending, isError, error } = useKakaoCallbackMutation({
    onSuccess: handleResponse,
    onError: () => {
      navigate(KAKAO_REDIRECT_PATH.HOME, { replace: true });
    },
  });

  useEffect(() => {
    if (hasCalledRef.current) {
      return;
    }

    const code = getAuthCode();
    if (!code) {
      navigate(KAKAO_REDIRECT_PATH.HOME);
      return;
    }

    hasCalledRef.current = true;
    mutate({ code });
  }, [mutate, navigate]);

  return {
    isLoading: isPending,
    isError,
    error,
  };
};
