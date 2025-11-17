import { useState, useRef, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { signupSchema, SignupFormData } from '@/utils/schemas';
import { useRegisterMutation, useRegisterOAuthMutation } from '@/api/auth/authQuery';
import { useS3ImageUpload } from '@/hooks/common/useS3ImageUpload';
import { useImagePreview } from '@/hooks/common/useImagePreview';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { setAccessToken, setRefreshToken } from '@/api/apiInstance';
import { useAuthStore } from '@/stores/useAuthStore';
import { AUTH_TEXTS } from '@/constants';

interface UseSignupReturn {
  previewImage: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  handleButtonClick: () => void;
  form: ReturnType<typeof useForm<SignupFormData>>;
  onSubmit: (data: SignupFormData) => void;
  handleLoginRedirect: () => void;
  isCompleteModalOpen: boolean;
  setIsCompleteModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isKakaoSignup: boolean;
}

export const useSignup = (defaultImage: string): UseSignupReturn => {
  const kakaoFlag = sessionStorage.getItem('isKakaoSignup') === 'true';
  const storedKakaoId = sessionStorage.getItem('kakaoId');

  const { previewImage, setPreviewImage, generatePreview } = useImagePreview();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [kakaoId] = useState<number | null>(storedKakaoId ? Number(storedKakaoId) : null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isKakaoSignup = kakaoFlag;

  const queryClient = useQueryClient();
  const registerMutation = useRegisterMutation();
  const registerOAuthMutation = useRegisterOAuthMutation();
  const { uploadImage } = useS3ImageUpload();
  const setIsKakaoUser = useAuthStore(state => state.setIsKakaoUser);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  // defaultImage 초기화
  if (!previewImage && defaultImage) {
    setPreviewImage(defaultImage);
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // 미리보기 생성
    generatePreview(file);

    // S3 업로드
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setUploadedImageUrl(imageUrl);
      showToast(AUTH_TEXTS.SIGNUP.IMAGE_UPLOADED, 'positive');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data: SignupFormData) => {
    if (isKakaoSignup) {
      if (!kakaoId) {
        return;
      }

      registerOAuthMutation.mutate(
        {
          email: data.email,
          nickname: data.nickname,
          profilePicture: uploadedImageUrl || '',
          birthDate: data.birthDate,
          name: data.name,
          introduction: data.introduction || '',
          kakaoId: kakaoId,
        },
        {
          onSuccess: async response => {
            sessionStorage.removeItem('isKakaoSignup');
            sessionStorage.removeItem('kakaoId');
            setAccessToken(response.data.accessToken || null);
            setRefreshToken(response.data.refreshToken || null);
            setIsKakaoUser(true); // 카카오 사용자로 설정
            await queryClient.invalidateQueries({ queryKey: ['userInfo'] });
            navigate('/');
          },
          onError: () => {
            showToast(AUTH_TEXTS.SIGNUP.SIGNUP_FAILED, 'warning');
          },
        }
      );
    } else {
      // 일반 회원가입
      registerMutation.mutate(
        {
          email: data.email,
          nickname: data.nickname,
          password: data.password,
          profilePicture: uploadedImageUrl || '',
          birthDate: data.birthDate,
          name: data.name,
          introduction: data.introduction || '',
        },
        {
          onSuccess: () => {
            sessionStorage.removeItem('isKakaoSignup');
            setIsCompleteModalOpen(true);
          },
          onError: () => {
            showToast(AUTH_TEXTS.SIGNUP.SIGNUP_FAILED, 'warning');
          },
        }
      );
    }
  };

  const handleLoginRedirect = () => {
    setIsCompleteModalOpen(false);
    setTimeout(() => {
      setIsLoginModalOpen(true);
    }, 0);
  };

  return {
    previewImage,
    fileInputRef,
    handleImageUpload,
    handleButtonClick,
    form,
    onSubmit,
    handleLoginRedirect,
    isCompleteModalOpen,
    setIsCompleteModalOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isKakaoSignup,
  };
};
