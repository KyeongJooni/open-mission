import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditModeStore } from '@/stores/useEditModeStore';
import { useToast } from '@/contexts/ToastContext';
import * as UserQuery from '@/api/user/userQuery';
import { useS3ImageUpload } from '@/hooks/common/useS3ImageUpload';
import { MYPAGE_ROUTES, MYPAGE_TEXTS } from '@/constants';
import { validators } from '@/utils/validation';
import { detectProfileChanges, getUpdateStrategy, buildUpdateRequest } from '@/utils/profileHelpers';
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
  const updateProfilePicture = UserQuery.useUpdateProfilePicture();
  const [previewImage, setPreviewImage] = useState<string>(defaultProfileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [headerNickname, setHeaderNickname] = useState(user?.nickname || '');
  const [headerIntroduction, setHeaderIntroduction] = useState(user?.introduction || '');

  // state 업데이트
  useEffect(() => {
    if (user) {
      setHeaderNickname(user.nickname);
      setHeaderIntroduction(user.introduction || '');
    }
  }, [user, isEditMode]);

  const { uploadImage } = useS3ImageUpload({
    onSuccess: async imageUrl => {
      await updateProfilePicture.mutateAsync({ profilePicture: imageUrl });
    },
  });

  const handleSave = (data: Partial<SignupFormData>) => {
    if (!user) {
      showToast(MYPAGE_TEXTS.PROFILE.NO_USER_INFO, 'warning');
      return;
    }

    const changes = detectProfileChanges(data, user);

    if (changes.length === 0) {
      showToast(MYPAGE_TEXTS.PROFILE.NO_CHANGES, 'warning');
      return;
    }

    // 성공/실패 핸들러
    const onSuccess = () => {
      setEditMode(false);
      showToast(MYPAGE_TEXTS.PROFILE.SAVE_SUCCESS, 'positive');
      navigate(MYPAGE_ROUTES.MY_PROFILE);
    };

    const onError = () => {
      showToast(MYPAGE_TEXTS.PROFILE.UPDATE_FAILED, 'warning');
    };

    // 업데이트 전략 결정
    const strategy = getUpdateStrategy(changes);

    // 단일 필드 업데이트
    if (strategy.type === 'single' && strategy.field && strategy.value) {
      const apiMap: Record<string, () => void> = {
        nickname: () => updateNickname.mutate({ nickname: strategy.value as string }, { onSuccess, onError }),
        password: () => updatePassword.mutate({ password: strategy.value as string }, { onSuccess, onError }),
      };

      if (apiMap[strategy.field]) {
        apiMap[strategy.field]();
        return;
      }
    }

    // 복수 필드 업데이트
    const requestData = buildUpdateRequest(data, user);
    updateUser.mutate(requestData, { onSuccess, onError });
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // 미리보기용 base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // S3 업로드 + 프로필 사진 업데이트
    await uploadImage(file);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  // 필드 검증
  const validateField = (fieldName: 'nickname' | 'bio', value: string): string | undefined => {
    const result = validators[fieldName]().safeParse(value);
    return result.success ? undefined : result.error.issues[0]?.message;
  };

  return {
    // 이미지 관련
    previewImage,
    fileInputRef,
    handleImageUpload,
    handleProfileImageClick,
    // 액션 핸들러
    handleEdit: () => setEditMode(true),
    handleCancel: () => setEditMode(false),
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
