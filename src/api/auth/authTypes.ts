// 공통
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

// 재사용 타입
type BasicProfile = Pick<BaseUserInfo, 'nickname' | 'profilePicture' | 'introduction'>;

// 로그인
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData extends TokenPair, BasicProfile {
  httpStatus: string;
  responseMessage: string;
}

// 회원가입
export type RegisterRequest = BaseUserInfo & {
  password: string;
};

export type RegisterData = Pick<BaseUserInfo, 'email' | 'nickname' | 'profilePicture' | 'introduction'>;

// OAuth 회원가입
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

export type KakaoCallbackData = Partial<TokenPair> &
  Partial<BaseUserInfo> & {
    httpStatus: string;
    responseMessage: string;
    kakaoId?: number;
  };

export interface ReissueRequest {
  refreshToken: string;
}

export type ReissueData = TokenPair;
