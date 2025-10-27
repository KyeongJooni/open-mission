import { useMutation } from '@tanstack/react-query';
import { register, login, registerOAuth, reissueToken } from './authApi';
import type * as AuthTypes from './authTypes';

export const useRegisterMutation = () => {
  return useMutation<AuthTypes.ApiResponse<AuthTypes.RegisterData>, Error, AuthTypes.RegisterRequest>({
    mutationFn: register,
  });
};

export const useRegisterOAuthMutation = () => {
  return useMutation<AuthTypes.ApiResponse<AuthTypes.RegisterOAuthData>, Error, AuthTypes.RegisterOAuthRequest>({
    mutationFn: registerOAuth,
  });
};

export const useLoginMutation = () => {
  return useMutation<AuthTypes.ApiResponse<AuthTypes.LoginData>, Error, AuthTypes.LoginRequest>({
    mutationFn: login,
  });
};

export const useReissueTokenMutation = () => {
  return useMutation<AuthTypes.ApiResponse<AuthTypes.ReissueData>, Error, AuthTypes.ReissueRequest>({
    mutationFn: reissueToken,
  });
};
