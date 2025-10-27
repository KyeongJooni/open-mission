import { useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
    } catch (error: any) {
      console.error('로그인 실패:', error);
      console.error('에러 응답:', error.response?.data);
      setErrorMessage(error.response?.data?.message || '이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 구현
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
