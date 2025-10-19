import { useKakaoCallback } from '@/hooks';

const OAuthCallback = () => {
  useKakaoCallback();

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <p></p>
    </div>
  );
};

export default OAuthCallback;
