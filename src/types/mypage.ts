import { ReactNode } from 'react';

// 기본 컴포넌트 Props
export interface BaseComponentProps {
  className?: string;
}

// 제네릭 타입
export type ComponentWithBase<T = {}> = BaseComponentProps & T;

export type ComponentWithChildren<T = {}> = ComponentWithBase<T & { children?: ReactNode }>;

// MyPage 관련 타입
export type MyPageHeaderProps = ComponentWithBase<{
  isEditMode: boolean;
  nickname: string;
  bio: string;
  onNicknameChange?: (nickname: string) => void;
  onBioChange?: (bio: string) => void;
  onEditClick: () => void;
  showSettingsButton?: boolean;
  isEditProfilePage?: boolean;
}>;

export type MyPageFormProps = ComponentWithChildren;
export type EditProfileFormProps = BaseComponentProps;
export type MyProfileFormProps = BaseComponentProps;
export type SignupFormProps = BaseComponentProps;
