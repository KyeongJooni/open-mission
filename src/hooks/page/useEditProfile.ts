import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditModeStore } from '@/stores/useEditModeStore';
import { useToast } from '@/contexts/ToastContext';
import * as UserQuery from '@/api/user/userQuery';
import { useS3ImageUpload } from '@/hooks/common/useS3ImageUpload';
import { useImagePreview } from '@/hooks/common/useImagePreview';
import { ROUTES, MYPAGE_TEXTS } from '@/constants';
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
  const updateProfilePicture = UserQuery.useUpdateProfilePicture();
  const { previewImage, setPreviewImage, generatePreview } = useImagePreview();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [headerNickname, setHeaderNickname] = useState(user?.nickname || '');
  const [headerIntroduction, setHeaderIntroduction] = useState(user?.introduction || '');

  // defaultImage 초기화
  useEffect(() => {
    if (!previewImage && defaultProfileImage) {
      setPreviewImage(defaultProfileImage);
    }
  }, [defaultProfileImage, previewImage, setPreviewImage]);

  // state 업데이트
  useEffect(() => {
    if (user) {
      setHeaderNickname(user.nickname);
      setHeaderIntroduction(user.introduction || '');
    }
  }, [user, isEditMode]);

  const { uploadImage } = useS3ImageUpload();

  const handleSave = async (data: Partial<SignupFormData>) => {
    if (!user) {
      showToast(MYPAGE_TEXTS.PROFILE.NO_USER_INFO, 'warning');
      return;
    }

    const changes = detectProfileChanges(data, user);
    const hasProfileImageChange = selectedImageFile !== null;

    if (changes.length === 0 && !hasProfileImageChange) {
      showToast(MYPAGE_TEXTS.PROFILE.NO_CHANGES, 'warning');
      return;
    }

    // 성공/실패 핸들러
    const onSuccess = () => {
      setEditMode(false);
      showToast(MYPAGE_TEXTS.PROFILE.SAVE_SUCCESS, 'positive');
      setSelectedImageFile(null);
      navigate(ROUTES.MYPAGE.MY_PROFILE);
    };

    const onError = () => {
      showToast(MYPAGE_TEXTS.PROFILE.UPDATE_FAILED, 'warning');
    };

    try {
      // 프로필 사진 업로드
      if (hasProfileImageChange) {
        const result = await uploadImage(selectedImageFile);
        if (result) {
          await updateProfilePicture.mutateAsync({ profilePicture: result });
        }
      }

      // 다른 필드 업데이트
      if (changes.length > 0) {
        const strategy = getUpdateStrategy(changes);

        // 단일 필드 업데이트
        if (strategy.type === 'single' && strategy.field && strategy.value) {
          const apiMap: Record<string, () => void> = {
            nickname: () => updateNickname.mutate({ nickname: strategy.value as string }, { onSuccess, onError }),
          };

          if (apiMap[strategy.field]) {
            apiMap[strategy.field]();
            return;
          }
        }

        // 복수 필드 업데이트
        const requestData = buildUpdateRequest(data, user);
        updateUser.mutate(requestData, { onSuccess, onError });
      } else if (hasProfileImageChange) {
        // 프로필 사진만 변경된 경우
        onSuccess();
      }
    } catch {
      onError();
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // 미리보기 생성
    generatePreview(file);

    // 저장 버튼 클릭 시 업로드하기 위해 파일 저장
    setSelectedImageFile(file);
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
