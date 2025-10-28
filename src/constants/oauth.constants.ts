const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

export const KAKAO_RESPONSE_CODE = {
  SUCCESS: 200,
  SIGNUP_REQUIRED: 401,
} as const;

export const KAKAO_REDIRECT_PATH = {
  HOME: '/',
  SIGNUP: '/mypage/signup',
} as const;
