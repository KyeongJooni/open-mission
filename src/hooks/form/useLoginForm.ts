import { useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

export const useLoginForm = (onClose?: () => void) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuthStore();

  const handleLogin = async () => {
    setErrorMessage('');

    try {
      await login({ email, password });
      onClose?.();
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.message || '이메일 또는 비밀번호가 일치하지 않습니다.');
      } else {
        setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/kakao`;
  };

  const handleSignup = () => {
    onClose?.();
    navigate('/mypage');
  };

  return {
    email,
    password,
    errorMessage,
    setEmail,
    setPassword,
    handleLogin,
    handleKeyDown,
    handleKakaoLogin,
    handleSignup,
  };
};
