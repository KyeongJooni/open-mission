import axios, { AxiosInstance, AxiosError } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const getBaseURL = () => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return '/api/proxy';
};

// API용 Axios 인스턴스
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  responseType: 'json',
});

// 토큰 관리 함수
const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return sessionStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return sessionStorage.getItem('refreshToken');
};

export const setAccessToken = (token: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }
  if (!token) {
    sessionStorage.removeItem('accessToken');
  } else {
    sessionStorage.setItem('accessToken', token);
  }
};

export const setRefreshToken = (token: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }
  if (!token) {
    sessionStorage.removeItem('refreshToken');
  } else {
    sessionStorage.setItem('refreshToken', token);
  }
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(config => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// 응답 인터셉터 - body code 체크
axiosInstance.interceptors.response.use(
  response => {
    // 카카오 콜백은 body code 체크 제외 (401은 회원가입 필요를 의미)
    if (response.config.url?.includes('/auth/kakao/redirect')) {
      return response;
    }

    // HTTP는 성공(200)이지만 body의 code가 에러인 경우
    if (response.data?.code && response.data.code >= 400) {
      return Promise.reject({
        response,
        message: response.data.message || 'Request failed',
        isBusinessError: true,
      });
    }
    return response;
  },
  error => Promise.reject(error)
);

// 인증이 필요하지 않은 경로들
const AUTH_EXCLUDED_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/register-oauth',
  '/auth/reissue',
  '/auth/kakao',
  '/auth/kakao/redirect',
] as const;

// 인증 제외 경로 확인
const isAuthExcluded = (url?: string) => {
  if (!url) {
    return false;
  }
  return AUTH_EXCLUDED_PATHS.some(path => url.startsWith(path));
};

// 토큰 재발급 로직
const refreshAuthLogic = async (failedRequest: AxiosError) => {
  const url = failedRequest.config?.url;

  // 인증 제외 경로는 토큰 재발급 안함
  if (isAuthExcluded(url)) {
    return Promise.reject(failedRequest);
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    setAccessToken(null);
    setRefreshToken(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return Promise.reject(failedRequest);
  }

  try {
    const refreshRes = await axios.post<{
      code: number;
      message: string;
      data: {
        accessToken: string;
        refreshToken: string;
      };
    }>(
      `${getBaseURL()}/auth/reissue`,
      { refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = refreshRes.data?.data || {};

    if (!accessToken || !newRefreshToken) {
      throw new Error('No tokens received from refresh response');
    }

    setAccessToken(accessToken);
    setRefreshToken(newRefreshToken);

    // 실패한 요청의 헤더 업데이트
    if (failedRequest.response?.config.headers) {
      failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return Promise.resolve();
  } catch (error) {
    setAccessToken(null);
    setRefreshToken(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
};

// axios-auth-refresh 설정
createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
  shouldRefresh: (error: AxiosError) => {
    const url = error.config?.url;
    const status = error.response?.status;

    if (isAuthExcluded(url)) {
      return false;
    }

    return status === 401;
  },
});
