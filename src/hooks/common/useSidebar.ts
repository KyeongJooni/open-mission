import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useModalStore } from '@/stores/useModalStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { MYPAGE_ROUTES, SIDEBAR_TEXTS, SIDEBAR_ROUTES, SIDEBAR_MODAL_TYPES } from '@/constants';

export const useSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();
  const logout = useAuthStore(state => state.logout);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isSidebarOpen]);

  // 전역 사이드바 닫기 이벤트
  useEffect(() => {
    const handleGlobalSidebarClose = () => closeSidebar();
    window.addEventListener('sidebar:close', handleGlobalSidebarClose as EventListener);
    return () => {
      window.removeEventListener('sidebar:close', handleGlobalSidebarClose as EventListener);
    };
  }, []);

  const dispatchClose = () => window.dispatchEvent(new CustomEvent('sidebar:close'));

  // 네비게이션
  const handleStartGitlog = () => {
    openModal(SIDEBAR_MODAL_TYPES.LOGIN);
  };

  const handleMyGitlog = () => {
    navigate(MYPAGE_ROUTES.MY_PROFILE);
    dispatchClose();
  };

  const handleWriteGitlog = () => {
    navigate(SIDEBAR_ROUTES.BLOG_WRITE);
    dispatchClose();
  };

  const handleSettings = () => {
    // TODO: 설정 페이지 라우팅
    dispatchClose();
  };

  const handleLogout = () => {
    const confirmLogout = () => {
      logout();
      queryClient.clear(); // React Query 캐시 모두 제거
      closeModal();
      navigate(SIDEBAR_ROUTES.HOME);
      dispatchClose();
    };

    openModal(
      SIDEBAR_MODAL_TYPES.LOGOUT,
      SIDEBAR_TEXTS.MODAL.LOGOUT_MESSAGE,
      confirmLogout,
      SIDEBAR_TEXTS.MODAL.LOGOUT_CONFIRM
    );
  };

  return {
    isSidebarOpen,
    sidebarRef,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    handleStartGitlog,
    handleMyGitlog,
    handleWriteGitlog,
    handleSettings,
    handleLogout,
  };
};
