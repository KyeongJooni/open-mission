import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditModeStore } from '@/stores/useEditModeStore';
import { useToast } from '@/contexts/ToastContext';
import * as UserQuery from '@/api/user/userQuery';
import { MYPAGE_ROUTES, MYPAGE_TEXTS } from '@/constants';
import { validators } from '@/utils/validation';
import type { SignupFormData } from '@/utils/schemas';

interface UseEditProfileProps {
  defaultProfileImage?: string;
}

export const useEditProfile = ({ defaultProfileImage = '' }: UseEditProfileProps = {}) => {
  const { setEditMode, isEditMode } = useEditModeStore();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = UserQuery.useAuth();
  const updateUser = UserQuery.useUpdateUser();
  const updateNickname = UserQuery.useUpdateNickname();
  const updatePassword = UserQuery.useUpdatePassword();
  const [previewImage, setPreviewImage] = useState<string>(defaultProfileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [headerNickname, setHeaderNickname] = useState(user?.nickname || '');
  const [headerIntroduction, setHeaderIntroduction] = useState(user?.introduction || '');

  // user 정보 변경 시 state 업데이트
  useEffect(() => {
    if (user) {
      setHeaderNickname(user.nickname);
      setHeaderIntroduction(user.introduction || '');
    }
  }, [user]);

  // 편집 모드 종료 시 리셋
  useEffect(() => {
    if (!isEditMode && user) {
      setHeaderNickname(user.nickname);
      setHeaderIntroduction(user.introduction || '');
    }
  }, [isEditMode, user]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSave = (data: Partial<SignupFormData>) => {
    if (!user) {
      showToast('유저 정보가 없습니다.', 'warning');
      return;
    }

    // 변경된 필드 감지
    const fieldChecks = [
      {
        field: 'nickname',
        hasChanged: () => data.nickname && data.nickname !== user.nickname,
        value: data.nickname,
      },
      {
        field: 'introduction',
        hasChanged: () => data.introduction !== undefined && data.introduction !== user.introduction,
        value: data.introduction,
      },
      {
        field: 'password',
        hasChanged: () => data.password && data.password !== '',
        value: data.password,
      },
      {
        field: 'birthDate',
        hasChanged: () => data.birthDate && data.birthDate !== user.birthDate,
        value: data.birthDate,
      },
    ];

    const changes = fieldChecks
      .filter(check => check.hasChanged())
      .map(check => ({ field: check.field, value: check.value }));

    if (changes.length === 0) {
      showToast('변경된 내용이 없습니다.', 'warning');
      return;
    }

    // 성공/실패 핸들러
    const onSuccess = () => {
      setEditMode(false);
      showToast(MYPAGE_TEXTS.PROFILE.SAVE_SUCCESS, 'positive');
      navigate(MYPAGE_ROUTES.MY_PROFILE);
    };

    const onError = () => {
      showToast('프로필 업데이트에 실패했습니다.', 'warning');
    };

    // 1개 필드만 변경
    if (changes.length === 1) {
      const { field, value } = changes[0];

      const apiMap: Record<string, () => void> = {
        nickname: () => updateNickname.mutate({ nickname: value as string }, { onSuccess, onError }),
        password: () => updatePassword.mutate({ password: value as string }, { onSuccess, onError }),
      };

      if (apiMap[field]) {
        apiMap[field]();
        return;
      }
    }

    // 2개 이상 변경
    const requestData = {
      email: data.email || user.email,
      nickname: data.nickname || user.nickname,
      password: data.password || '',
      profilePicture: user.profilePicture,
      birthDate: data.birthDate || user.birthDate,
      name: data.name || user.name,
      introduction: data.introduction || '',
    };

    updateUser.mutate(requestData, { onSuccess, onError });
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  // 필드 검증
  const validateField = (fieldName: 'nickname' | 'bio', value: string): string | undefined => {
    const validatorMap = {
      nickname: validators.nickname(),
      bio: validators.bio(),
    };
    const result = validatorMap[fieldName].safeParse(value);
    if (!result.success) {
      return result.error.issues[0]?.message;
    }
    return undefined;
  };

  return {
    // 이미지 관련
    previewImage,
    fileInputRef,
    handleImageUpload,
    handleProfileImageClick,
    // 액션 핸들러
    handleEdit,
    handleCancel,
    handleSave,
    // 검증
    validateField,
    // 헤더 필드
    headerNickname,
    headerIntroduction,
    setHeaderNickname,
    setHeaderIntroduction,
  };
};
