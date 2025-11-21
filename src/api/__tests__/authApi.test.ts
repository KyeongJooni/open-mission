import { login, register, registerOAuth, getKakaoRedirectUrl, reissueToken } from '../auth/authApi';
import { axiosInstance, setAccessToken, setRefreshToken } from '../apiInstance';

jest.mock('../apiInstance', () => ({
  axiosInstance: {
    post: jest.fn(),
    get: jest.fn(),
  },
  setAccessToken: jest.fn(),
  setRefreshToken: jest.fn(),
}));

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('로그인 성공 시 토큰을 설정해야 함', async () => {
      const mockResponse = {
        data: {
          data: {
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token',
          },
        },
      };
      (mockedAxios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await login({ email: 'test@test.com', password: 'Password1!' });

      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'Password1!',
      });
      expect(setAccessToken).toHaveBeenCalledWith('test-access-token');
      expect(setRefreshToken).toHaveBeenCalledWith('test-refresh-token');
      expect(result.data.accessToken).toBe('test-access-token');
    });

    it('로그인 실패 시 에러를 throw해야 함', async () => {
      (mockedAxios.post as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      await expect(login({ email: 'test@test.com', password: 'wrong' })).rejects.toThrow();
    });
  });

  describe('register', () => {
    it('회원가입 성공 시 데이터를 반환해야 함', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 1,
            email: 'test@test.com',
          },
        },
      };
      (mockedAxios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await register({
        email: 'test@test.com',
        password: 'Password1!',
        name: '홍길동',
        birthDate: '1990-01-01',
        nickname: 'testuser',
        profilePicture: '',
        introduction: '',
      });

      expect(result.data.email).toBe('test@test.com');
    });
  });

  describe('registerOAuth', () => {
    it('OAuth 회원가입 성공 시 토큰을 설정해야 함', async () => {
      const mockResponse = {
        data: {
          data: {
            accessToken: 'oauth-access-token',
            refreshToken: 'oauth-refresh-token',
          },
        },
      };
      (mockedAxios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await registerOAuth({
        kakaoId: 12345,
        email: 'test@test.com',
        name: '홍길동',
        birthDate: '1990-01-01',
        nickname: 'testuser',
        profilePicture: '',
        introduction: '',
      });

      expect(setAccessToken).toHaveBeenCalledWith('oauth-access-token');
      expect(setRefreshToken).toHaveBeenCalledWith('oauth-refresh-token');
      expect(result.data.accessToken).toBe('oauth-access-token');
    });
  });

  describe('getKakaoRedirectUrl', () => {
    it('카카오 리다이렉트 URL을 반환해야 함', async () => {
      const mockResponse = {
        data: {
          data: {
            redirectUrl: 'https://kauth.kakao.com/oauth/authorize',
          },
        },
      };
      (mockedAxios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getKakaoRedirectUrl();

      expect(mockedAxios.get).toHaveBeenCalledWith('/auth/kakao');
      expect(result.data.redirectUrl).toBe('https://kauth.kakao.com/oauth/authorize');
    });
  });

  describe('reissueToken', () => {
    it('토큰 재발급 성공 시 새 토큰을 설정해야 함', async () => {
      const mockResponse = {
        data: {
          data: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
          },
        },
      };
      (mockedAxios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await reissueToken({ refreshToken: 'old-refresh-token' });

      expect(setAccessToken).toHaveBeenCalledWith('new-access-token');
      expect(setRefreshToken).toHaveBeenCalledWith('new-refresh-token');
      expect(result.data.accessToken).toBe('new-access-token');
    });
  });
});
