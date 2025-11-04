import { axiosInstance } from '../apiInstance';
import type { ApiResponse } from '../apiTypes';
import type * as UserTypes from './userTypes';

// 유저 정보 조회
export const getUserInfo = async (): Promise<ApiResponse<UserTypes.UserData>> => {
  const response = await axiosInstance.get<ApiResponse<UserTypes.UserData>>('/users/me');
  return response.data;
};

// 유저 정보 수정
export const updateUser = async (data: UserTypes.UpdateUserRequest): Promise<ApiResponse<UserTypes.UpdateUserData>> => {
  const response = await axiosInstance.patch<ApiResponse<UserTypes.UpdateUserData>>('/users', data);
  return response.data;
};

// 프로필 사진 수정
export const updateProfilePicture = async (
  data: UserTypes.UpdateProfilePictureRequest
): Promise<ApiResponse<UserTypes.UpdateProfilePictureData>> => {
  const response = await axiosInstance.patch<ApiResponse<UserTypes.UpdateProfilePictureData>>('/users/picture', data);
  return response.data;
};

// 비밀번호 수정
export const updatePassword = async (
  data: UserTypes.UpdatePasswordRequest
): Promise<ApiResponse<UserTypes.UpdatePasswordData>> => {
  const response = await axiosInstance.patch<ApiResponse<UserTypes.UpdatePasswordData>>('/users/password', data);
  return response.data;
};

// 닉네임 수정
export const updateNickname = async (
  data: UserTypes.UpdateNicknameRequest
): Promise<ApiResponse<UserTypes.UpdateNicknameData>> => {
  const response = await axiosInstance.patch<ApiResponse<UserTypes.UpdateNicknameData>>('/users/nickname', data);
  return response.data;
};
