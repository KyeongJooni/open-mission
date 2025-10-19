import { axiosInstance } from '../apiInstance';
import type { UserResponse } from './userTypes';

export const getUserInfo = async (): Promise<UserResponse> => {
  const response = await axiosInstance.get<UserResponse>('/users/me');
  return response.data;
};
