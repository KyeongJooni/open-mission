import type { ApiResponse } from '../apiTypes';

// 사용자 정보 응답
export interface UserData {
  id: number;
  email: string;
  nickname: string;
  profilePicture: string;
  name: string;
  birthDate: string;
  introduction: string;
}

export type UserResponse = ApiResponse<UserData>;
