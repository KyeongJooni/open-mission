import { useKakaoCallback } from '@/hooks';

const OAuthCallback = () => {
  useKakaoCallback();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-gray-300 border-t-primary-500 h-12 w-12 animate-spin rounded-full border-4" />
        <p className="text-gray-700 text-lg">카카오 로그인 처리중</p>
        <p className="text-gray-500 text-sm">잠시만 기다려주세요</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
