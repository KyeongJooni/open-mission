import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormData } from '@/utils/schemas';
import { useRegisterMutation } from '@/api/auth/authQuery';

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
  const [previewImage, setPreviewImage] = useState<string>(defaultImage);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isKakaoSignup, setIsKakaoSignup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const registerMutation = useRegisterMutation();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    const kakaoFlag = sessionStorage.getItem('isKakaoSignup') === 'true';
    setIsKakaoSignup(kakaoFlag);
  }, []);

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
        onError: (error: any) => {
          console.error('회원가입 실패:', error);
          console.error('에러 응답:', error.response?.data);
          // TODO: 에러 토스트 표시
        },
      }
    );
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
