// ===== 공통 타입 =====

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface BaseUserInfo {
  email: string;
  nickname: string;
  profilePicture: string;
  name: string;
  birthDate: string;
  introduction: string;
}

// ===== 로그인 =====

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData extends TokenPair {
  nickname: string;
  profilePicture: string;
  introduction: string;
  httpStatus: string;
  responseMessage: string;
}

// ===== 일반 회원가입 =====

export type RegisterRequest = BaseUserInfo & {
  password: string;
};

export interface RegisterData {
  email: string;
  nickname: string;
  profilePicture: string;
  introduction: string;
}

// ===== OAuth 회원가입 =====

export type RegisterOAuthRequest = BaseUserInfo & {
  kakaoId: number;
};

export type RegisterOAuthData = TokenPair &
  BaseUserInfo & {
    kakaoId: number;
  };

export interface KakaoRedirectData {
  redirectUrl: string;
}

export interface KakaoRedirectRequest {
  code: string;
  state?: string;
}

export type KakaoCallbackData = Partial<TokenPair> & {
  nickname?: string;
  profilePicture?: string;
  introduction?: string;
  httpStatus: string;
  responseMessage: string;
  kakaoId?: number;
  email?: string;
};

export interface ReissueRequest {
  refreshToken: string;
}

export type ReissueData = TokenPair;
