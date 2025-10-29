import { axiosInstance, setAccessToken, setRefreshToken } from '../apiInstance';
import type { ApiResponse } from '../apiTypes';
import type * as AuthTypes from './authTypes';

// 로그인 API
export const login = async (loginData: AuthTypes.LoginRequest): Promise<ApiResponse<AuthTypes.LoginData>> => {
  const response = await axiosInstance.post<ApiResponse<AuthTypes.LoginData>>('/auth/login', loginData);

  const { accessToken, refreshToken } = response.data.data;
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
  return response.data;
};

// 회원가입 API
export const register = async (
  registerData: AuthTypes.RegisterRequest
): Promise<ApiResponse<AuthTypes.RegisterData>> => {
  const response = await axiosInstance.post<ApiResponse<AuthTypes.RegisterData>>('/auth/register', registerData);
  return response.data;
};

// OAuth2 회원가입 API
export const registerOAuth = async (
  registerData: AuthTypes.RegisterOAuthRequest
): Promise<ApiResponse<AuthTypes.RegisterOAuthData>> => {
  const response = await axiosInstance.post<ApiResponse<AuthTypes.RegisterOAuthData>>(
    '/auth/register-oauth',
    registerData
  );
  const { accessToken, refreshToken } = response.data.data;
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);

  return response.data;
};

// OAuth2 로그인 리다이렉트 URL 조회
export const getKakaoRedirectUrl = async (): Promise<ApiResponse<AuthTypes.KakaoRedirectData>> => {
  const response = await axiosInstance.get<ApiResponse<AuthTypes.KakaoRedirectData>>('/auth/kakao');
  return response.data;
};

// OAuth2 로그인 콜백 처리
export const handleKakaoRedirect = async (
  callbackData: AuthTypes.KakaoRedirectRequest
): Promise<ApiResponse<AuthTypes.KakaoCallbackData>> => {
  const response = await axiosInstance.get<ApiResponse<AuthTypes.KakaoCallbackData>>('/auth/kakao/redirect', {
    params: callbackData,
  });
  return response.data;
};

// 토큰 재발급 API
export const reissueToken = async (
  reissueData: AuthTypes.ReissueRequest
): Promise<ApiResponse<AuthTypes.ReissueData>> => {
  const response = await axiosInstance.post<ApiResponse<AuthTypes.ReissueData>>('/auth/reissue', reissueData);

  const { accessToken, refreshToken } = response.data.data;

  setAccessToken(accessToken);
  setRefreshToken(refreshToken);

  return response.data;
};
