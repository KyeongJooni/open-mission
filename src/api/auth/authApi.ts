import { axiosInstance } from '../apiInstance';
import {
  KakaoRedirectCallbackResponse,
  KakaoRedirectRequest,
  KakaoRedirectResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './authTypes';

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
export const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', loginData);

  const { accessToken, refreshToken } = response.data.data;

  // 로그인 성공 시 토큰들 저장
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);

  return response.data;
};

// 회원가입 API
export const register = async (registerData: RegisterRequest): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>('/auth/register', registerData);
  return response.data;
};

// OAuth2 로그인 리다이렉트 URL 조회
export const getKakaoRedirectUrl = async (): Promise<KakaoRedirectResponse> => {
  const response = await axiosInstance.get<KakaoRedirectResponse>('/auth/kakao');
  return response.data;
};

// OAuth2 로그인 콜백 처리
export const handleKakaoRedirect = async (
  callbackData: KakaoRedirectRequest
): Promise<KakaoRedirectCallbackResponse> => {
  const response = await axiosInstance.get<KakaoRedirectCallbackResponse>('/auth/kakao/redirect', {
    params: callbackData,
  });
  return response.data;
};
