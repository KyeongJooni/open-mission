import { useState, useRef, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { signupSchema, SignupFormData } from '@/utils/schemas';
import { useRegisterMutation, useRegisterOAuthMutation } from '@/api/auth/authQuery';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { setAccessToken, setRefreshToken } from '@/api/apiInstance';

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
  // sessionStorage를 먼저 읽어서 카카오 회원가입 정보 확인
  const kakaoFlag = sessionStorage.getItem('isKakaoSignup') === 'true';
  const storedKakaoId = sessionStorage.getItem('kakaoId');

  const [previewImage, setPreviewImage] = useState<string>(defaultImage);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [kakaoId] = useState<number | null>(storedKakaoId ? Number(storedKakaoId) : null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isKakaoSignup = kakaoFlag;

  const queryClient = useQueryClient();
  const registerMutation = useRegisterMutation();
  const registerOAuthMutation = useRegisterOAuthMutation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

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
          profilePicture: previewImage || '',
          birthDate: data.birthDate,
          name: data.name,
          introduction: data.bio || '',
          kakaoId: kakaoId,
        },
        {
          onSuccess: async response => {
            sessionStorage.removeItem('isKakaoSignup');
            sessionStorage.removeItem('kakaoId');
            setAccessToken(response.data.accessToken || null);
            setRefreshToken(response.data.refreshToken || null);
            await queryClient.invalidateQueries({ queryKey: ['userInfo'] });
            navigate('/');
          },
          onError: () => {
            showToast('회원가입을 할 수 없습니다.', 'warning');
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
          profilePicture: previewImage || '',
          birthDate: data.birthDate,
          name: data.name,
          introduction: data.bio || '',
        },
        {
          onSuccess: () => {
            sessionStorage.removeItem('isKakaoSignup');
            setIsCompleteModalOpen(true);
          },
          onError: () => {
            showToast('회원가입을 할 수 없습니다.', 'warning');
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
