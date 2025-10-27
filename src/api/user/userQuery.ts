import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from './userApi';
import type * as UserTypes from './userTypes';

export const useUserInfo = () => {
  return useQuery<UserTypes.ApiResponse<UserTypes.UserData>>({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
