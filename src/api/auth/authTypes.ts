// 공통 API 응답 구조
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 로그인 요청/응답
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  nickname: string;
  profilePicture: string;
  introduction: string;
  httpStatus: string;
  responseMessage: string;
}

export type LoginResponse = ApiResponse<LoginData>;

// 회원가입 요청/응답
export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  // 추가 필드들...
}

export type RegisterResponse = ApiResponse<LoginData>;

// OAuth2 회원가입 요청/응답
export interface RegisterOAuthRequest {
  provider: 'kakao' | 'google' | 'naver';
  authCode: string;
  nickname?: string;
}

export type RegisterOAuthResponse = ApiResponse<LoginData>;

// 카카오 리다이렉트 URL 응답
export interface KakaoRedirectData {
  redirectUrl: string;
}

export type KakaoRedirectResponse = ApiResponse<KakaoRedirectData>;

// 카카오 콜백 요청/응답
export interface KakaoRedirectRequest {
  code: string;
  state?: string;
}

export interface KakaoCallbackData {
  id: number;
  email: string;
  nickname: string;
  profilePicture: string;
  name: string;
  birthDate: string;
  introduction: string;
}

export type KakaoRedirectCallbackResponse = ApiResponse<KakaoCallbackData>;
