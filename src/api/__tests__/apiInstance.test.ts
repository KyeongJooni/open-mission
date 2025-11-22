import { setAccessToken, setRefreshToken, getRefreshToken } from '../apiInstance';

describe('apiInstance', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('setAccessToken', () => {
    it('토큰을 sessionStorage에 저장해야 함', () => {
      setAccessToken('test-access-token');

      expect(sessionStorage.getItem('accessToken')).toBe('test-access-token');
    });

    it('null이면 토큰을 삭제해야 함', () => {
      sessionStorage.setItem('accessToken', 'existing-token');

      setAccessToken(null);

      expect(sessionStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('setRefreshToken', () => {
    it('토큰을 sessionStorage에 저장해야 함', () => {
      setRefreshToken('test-refresh-token');

      expect(sessionStorage.getItem('refreshToken')).toBe('test-refresh-token');
    });

    it('null이면 토큰을 삭제해야 함', () => {
      sessionStorage.setItem('refreshToken', 'existing-token');

      setRefreshToken(null);

      expect(sessionStorage.getItem('refreshToken')).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('저장된 리프레시 토큰을 반환해야 함', () => {
      sessionStorage.setItem('refreshToken', 'test-token');

      expect(getRefreshToken()).toBe('test-token');
    });

    it('토큰이 없으면 null을 반환해야 함', () => {
      expect(getRefreshToken()).toBeNull();
    });
  });
});
