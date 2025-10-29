import { useMutation, useQueryClient } from '@tanstack/react-query';
import { register, login, registerOAuth, reissueToken, handleKakaoRedirect } from './authApi';
import type { ApiResponse } from '../apiTypes';
import type * as AuthTypes from './authTypes';

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });
};

export const useRegisterOAuthMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerOAuth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });
};

export const useReissueTokenMutation = () => {
  return useMutation({
    mutationFn: reissueToken,
  });
};

export const useKakaoCallbackMutation = (options?: {
  onSuccess?: (data: ApiResponse<AuthTypes.KakaoCallbackData>) => void | Promise<void>;
  onError?: (error: Error) => void;
}) => {
  return useMutation<ApiResponse<AuthTypes.KakaoCallbackData>, Error, AuthTypes.KakaoRedirectRequest>({
    mutationFn: handleKakaoRedirect,
    ...options,
  });
};
