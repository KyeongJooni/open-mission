// 공통 사용자 정보
export interface UserData {
  id: number;
  email: string;
  nickname: string;
  profilePicture: string;
  name: string;
  birthDate: string;
  introduction: string;
}

// 유저 정보 수정
export type UpdateUserRequest = Omit<UserData, 'id'> & {
  password: string;
};

export type UpdateUserData = Record<string, never>;

// 프로필 사진 수정
export type UpdateProfilePictureRequest = Pick<UserData, 'profilePicture'>;

export type UpdateProfilePictureData = Record<string, never>;

// 비밀번호 수정
export interface UpdatePasswordRequest {
  password: string;
}

export type UpdatePasswordData = Record<string, never>;

// 닉네임 수정
export type UpdateNicknameRequest = Pick<UserData, 'nickname'>;

export type UpdateNicknameData = Record<string, never>;
