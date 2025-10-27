import { axiosInstance } from '../apiInstance';
import type * as AuthTypes from './authTypes';

// 토큰 저장을 위한 임시 함수들 (axios.ts에서 가져와야 함)
// const _getAccessToken = (): string | null => {
//   if (typeof window === 'undefined') {
//     return null;
//   }
//   return sessionStorage.getItem('accessToken');
// };

const setAccessToken = (token: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }
  if (!token) {
    sessionStorage.removeItem('accessToken');
  } else {
    sessionStorage.setItem('accessToken', token);
  }
};

// const _getRefreshToken = (): string | null => {
//   if (typeof window === 'undefined') {
//     return null;
//   }
//   return sessionStorage.getItem('refreshToken');
// };

const setRefreshToken = (token: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }
  if (!token) {
    sessionStorage.removeItem('refreshToken');
  } else {
    sessionStorage.setItem('refreshToken', token);
  }
};

// 로그인 API
export const login = async (loginData: AuthTypes.LoginRequest): Promise<AuthTypes.ApiResponse<AuthTypes.LoginData>> => {
  const response = await axiosInstance.post<AuthTypes.ApiResponse<AuthTypes.LoginData>>('/auth/login', loginData);

  const { accessToken, refreshToken } = response.data.data;

  // 로그인 성공 시 토큰들 저장
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);

  return response.data;
};

// 회원가입 API
export const register = async (
  registerData: AuthTypes.RegisterRequest
): Promise<AuthTypes.ApiResponse<AuthTypes.RegisterData>> => {
  const response = await axiosInstance.post<AuthTypes.ApiResponse<AuthTypes.RegisterData>>(
    '/auth/register',
    registerData
  );
  return response.data;
};

// OAuth2 회원가입 API
export const registerOAuth = async (
  registerData: AuthTypes.RegisterOAuthRequest
): Promise<AuthTypes.ApiResponse<AuthTypes.RegisterOAuthData>> => {
  const response = await axiosInstance.post<AuthTypes.ApiResponse<AuthTypes.RegisterOAuthData>>(
    '/auth/register-oauth',
    registerData
  );
  return response.data;
};

// OAuth2 로그인 리다이렉트 URL 조회
export const getKakaoRedirectUrl = async (): Promise<AuthTypes.ApiResponse<AuthTypes.KakaoRedirectData>> => {
  const response = await axiosInstance.get<AuthTypes.ApiResponse<AuthTypes.KakaoRedirectData>>('/auth/kakao');
  return response.data;
};

// OAuth2 로그인 콜백 처리
export const handleKakaoRedirect = async (
  callbackData: AuthTypes.KakaoRedirectRequest
): Promise<AuthTypes.ApiResponse<AuthTypes.KakaoCallbackData>> => {
  const response = await axiosInstance.get<AuthTypes.ApiResponse<AuthTypes.KakaoCallbackData>>('/auth/kakao/redirect', {
    params: callbackData,
  });
  return response.data;
};

// 토큰 재발급 API
export const reissueToken = async (
  reissueData: AuthTypes.ReissueRequest
): Promise<AuthTypes.ApiResponse<AuthTypes.ReissueData>> => {
  const response = await axiosInstance.post<AuthTypes.ApiResponse<AuthTypes.ReissueData>>('/auth/reissue', reissueData);

  const { accessToken, refreshToken } = response.data.data;

  // 새로운 토큰들 저장
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);

  return response.data;
};
