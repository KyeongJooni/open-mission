import router from '@/routes/Route';
import Playground from '@/playground/Playground';
import { RouterProvider } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/contexts/ToastContext';
import { useAuthStore } from '@/stores/useAuthStore';

const queryClient = new QueryClient();

function App() {
  const checkLoginStatus = useAuthStore(state => state.checkLoginStatus);

  useEffect(() => {
    // 카카오 콜백 페이지에서는 checkLoginStatus 스킵
    const isKakaoCallback = window.location.pathname.includes('/oauth/kakao');
    if (isKakaoCallback) {
      return;
    }
    checkLoginStatus();
  }, [checkLoginStatus]);

  const isPlayground = useMemo(() => {
    // 빌드 시에는 플레이그라운드 비활성화
    if (ENABLE_PLAYGROUND === 'false') {
      return false;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('playground') === '1') {
      return true;
    }
    return import.meta.env.VITE_PLAYGROUND === '1';
  }, []);

  if (isPlayground) {
    return <Playground />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="global-layout">
          <RouterProvider router={router} />
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
