import axios, { AxiosInstance } from 'axios';

// Axios 인스턴스 설정
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  responseType: 'json',
  withCredentials: true, // 쿠키 전달 활성화
});

// 토큰 관리 함수
const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('accessToken');
};

const setAccessToken = (token: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }
  if (!token) {
    localStorage.removeItem('accessToken');
  } else {
    localStorage.setItem('accessToken', token);
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
    localStorage.removeItem('refreshToken');
  } else {
    localStorage.setItem('refreshToken', token);
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

// 응답 인터셉터 (401 에러 시 토큰 갱신 로직 - 필요 시 주석 해제)
// import { InternalAxiosRequestConfig } from 'axios';
// import { ENV } from './env';

// declare module 'axios' {
//   export interface InternalAxiosRequestConfig {
//     _retry?: boolean;
//     _skipAuthRefresh?: boolean;
//   }
// }

// 인증이 필요하지 않은 경로들
// const AUTH_EXCLUDED_PATHS = [
//   '/auth/login',
//   '/auth/register',
//   '/auth/register-oauth',
//   '/auth/reissue',
//   '/auth/kakao',
//   '/auth/kakao/redirect',
// ] as const;

// 인증 제외 경로 확인
// const _isAuthExcluded = (url?: string) => {
//   if (!url) {
//     return false;
//   }
//   return AUTH_EXCLUDED_PATHS.some(path => url.startsWith(path));
// };

// 리프레시 전용 axios 인스턴스
// const _refreshAxios: AxiosInstance = axios.create({
//   baseURL: ENV.API_BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 10000,
// });

// 토큰 갱신 중인지 확인하는 플래그
// let _isRefreshing = false;

// 토큰 갱신 대기 중인 요청들을 저장하는 큐
// const pendingQueue: Array<{
//   resolve: (_value?: unknown) => void;
//   reject: (_reason?: unknown) => void;
//   config: InternalAxiosRequestConfig;
// }> = [];

// 대기 중인 요청들을 처리하는 함수
// const _processQueue = (error: unknown, token: string | null) => {
//   pendingQueue.forEach(({ resolve, reject, config }) => {
//     if (error) {
//       reject(error);
//       return;
//     }
//     if (token) {
//       config.headers = config.headers ?? {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     resolve(axiosInstance(config));
//   });
//   pendingQueue = [];
// };

// 응답 인터셉터 - 401 에러 시 토큰 갱신
/*
axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig | undefined;

    const status = error.response?.status;

    // 재시도 중이거나 401이 아니거나 설정이 없는 경우 에러 반환
    if (!originalConfig || originalConfig._retry || status !== 401) {
      return Promise.reject(error);
    }

    // 인증 제외 경로인 경우 에러 반환
    if (isAuthExcluded(originalConfig.url)) {
      return Promise.reject(error);
    }

    // 재시도 플래그 설정
    originalConfig._retry = true;

    // 이미 토큰 갱신 중인 경우 대기열에 추가
    if (_isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, config: originalConfig });
      });
    }

    _isRefreshing = true;

    try {
      // 리프레시 토큰으로 새로운 액세스 토큰 요청
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const refreshRes = await refreshAxios.post<{
        code: number;
        message: string;
        data: {
          accessToken: string;
          refreshToken: string;
        };
      }>('/auth/reissue', {
        refreshToken: refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = refreshRes.data?.data || {};

      if (!accessToken || !newRefreshToken) {
        throw new Error('No tokens received from refresh response');
      }

      // 새로운 토큰들 저장
      setAccessToken(accessToken);
      setRefreshToken(newRefreshToken);

      // 대기 중인 요청들 처리
      processQueue(null, accessToken);

      // 원래 요청에 새로운 토큰 설정
      originalConfig.headers = originalConfig.headers ?? {};
      originalConfig.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance(originalConfig);
    } catch (refreshErr) {
      // 토큰 갱신 실패 시 대기 중인 요청들 모두 실패 처리
      processQueue(refreshErr, null);

      // 토큰들 제거
      setAccessToken(null);
      setRefreshToken(null);

      // 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshErr);
    } finally {
      _isRefreshing = false;
    }
  }
);
*/

// 유틸리티 함수
export const logout = () => {
  setAccessToken(null);
  setRefreshToken(null);
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

export const isAuthenticated = (): boolean => {
  return Boolean(getAccessToken());
};
