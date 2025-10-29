import { axiosInstance } from '../apiInstance';
import type { UserResponse } from './userTypes';

// 유저 정보 조회
export const getUserInfo = async (): Promise<UserResponse> => {
  const response = await axiosInstance.get<UserResponse>('/users/me');
  return response.data;
};
