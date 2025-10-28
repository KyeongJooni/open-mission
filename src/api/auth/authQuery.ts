import { useMutation } from '@tanstack/react-query';
import { register, login, registerOAuth, reissueToken, handleKakaoRedirect } from './authApi';
import type { ApiResponse } from '../apiTypes';
import type * as AuthTypes from './authTypes';

export const useRegisterMutation = () => {
  return useMutation<ApiResponse<AuthTypes.RegisterData>, Error, AuthTypes.RegisterRequest>({
    mutationFn: register,
  });
};

export const useRegisterOAuthMutation = () => {
  return useMutation<ApiResponse<AuthTypes.RegisterOAuthData>, Error, AuthTypes.RegisterOAuthRequest>({
    mutationFn: registerOAuth,
  });
};

export const useLoginMutation = () => {
  return useMutation<ApiResponse<AuthTypes.LoginData>, Error, AuthTypes.LoginRequest>({
    mutationFn: login,
  });
};

export const useReissueTokenMutation = () => {
  return useMutation<ApiResponse<AuthTypes.ReissueData>, Error, AuthTypes.ReissueRequest>({
    mutationFn: reissueToken,
  });
};

export const useKakaoCallbackMutation = () => {
  return useMutation<ApiResponse<AuthTypes.KakaoCallbackData>, Error, AuthTypes.KakaoRedirectRequest>({
    mutationFn: handleKakaoRedirect,
  });
};
