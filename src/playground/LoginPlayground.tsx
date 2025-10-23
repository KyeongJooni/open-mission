import { useState } from 'react';
import { LoginModal } from '@/components/auth';
import LoginPage from '@/pages/auth/LoginPage';

const LoginPlayground = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-gray-800 mb-8 text-3xl font-bold">로그인 컴포넌트 플레이그라운드</h1>

        {/* 컨트롤 패널 */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-gray-700 mb-4 text-xl font-semibold">테스트 컨트롤</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              로그인 모달 열기
            </button>
          </div>
        </div>

        {/* 로그인 페이지 미리보기 */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-gray-700 mb-4 text-xl font-semibold">로그인 페이지 미리보기</h2>
          <div className="border-gray-200 bg-gray-50 rounded-lg border-2 p-4">
            <LoginPage />
          </div>
        </div>

        {/* 모달 상태 표시 */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-gray-700 mb-4 text-xl font-semibold">상태 정보</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              모달 상태: <span className="font-semibold">{isModalOpen ? '열림' : '닫힘'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 로그인 모달 */}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LoginPlayground;
