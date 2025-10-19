// 공통 API 응답 구조
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

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
