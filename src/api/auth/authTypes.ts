export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface BaseUserInfo {
  email: string;
  nickname: string;
  profilePicture: string;
  name: string;
  birthDate: string;
  introduction: string;
}

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

export type RegisterRequest = BaseUserInfo & {
  password: string;
};

export interface RegisterData {
  email: string;
  nickname: string;
  profilePicture: string;
  introduction: string;
}

export type RegisterOAuthRequest = BaseUserInfo & {
  kakaoId: number;
};

export interface RegisterOAuthData {
  email: string;
  nickname: string;
  profilePicture: string;
  birthDate: string;
  name: string;
  introduction: string;
  kakaoId: number;
}

export interface KakaoRedirectData {
  redirectUrl: string;
}

export interface KakaoRedirectRequest {
  code: string;
  state?: string;
}

export interface KakaoCallbackData {
  httpStatus: string;
  responseMessage: string;
}

export interface ReissueRequest {
  refreshToken: string;
}

export interface ReissueData {
  accessToken: string;
  refreshToken: string;
}
