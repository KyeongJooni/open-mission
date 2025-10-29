import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getUserInfo } from './userApi';
import { useAuthStore } from '@/stores/useAuthStore';
import type { ApiResponse } from '../apiTypes';
import type * as UserTypes from './userTypes';

export const useUserInfo = () => {
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);

  const query = useQuery<ApiResponse<UserTypes.UserData>>({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: false, // 401 에러 시 재시도하지 않음
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data?.data) {
      setIsLoggedIn(true);
    } else if (query.error) {
      setIsLoggedIn(false);
    }
  }, [query.data, query.error, setIsLoggedIn]);

  return query;
};

// 인증 상태 확인용 헬퍼 훅
export const useAuth = () => {
  const { data, isLoading, error } = useUserInfo();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  return {
    user: data?.data || null,
    isLoggedIn,
    isLoading,
    error,
  };
};
