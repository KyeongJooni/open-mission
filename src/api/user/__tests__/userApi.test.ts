import { getUserInfo, updateUser, updateProfilePicture, updateNickname } from '../userApi';
import { axiosInstance } from '../../apiInstance';

jest.mock('../../apiInstance', () => ({
  axiosInstance: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('userApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserInfo', () => {
    it('유저 정보를 조회해야 함', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 1,
            email: 'test@example.com',
            nickname: 'testuser',
          },
        },
      };
      (axiosInstance.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getUserInfo();

      expect(axiosInstance.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateUser', () => {
    it('유저 정보를 수정해야 함', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 1,
            nickname: 'newNickname',
          },
        },
      };
      (axiosInstance.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await updateUser({ nickname: 'newNickname' });

      expect(axiosInstance.patch).toHaveBeenCalledWith('/users', { nickname: 'newNickname' });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateProfilePicture', () => {
    it('프로필 사진을 수정해야 함', async () => {
      const mockResponse = {
        data: {
          data: {
            profilePicture: 'https://example.com/new-image.png',
          },
        },
      };
      (axiosInstance.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await updateProfilePicture({ profilePicture: 'https://example.com/new-image.png' });

      expect(axiosInstance.patch).toHaveBeenCalledWith('/users/picture', {
        profilePicture: 'https://example.com/new-image.png',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateNickname', () => {
    it('닉네임을 수정해야 함', async () => {
      const mockResponse = {
        data: {
          data: {
            nickname: 'newNickname',
          },
        },
      };
      (axiosInstance.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await updateNickname({ nickname: 'newNickname' });

      expect(axiosInstance.patch).toHaveBeenCalledWith('/users/nickname', { nickname: 'newNickname' });
      expect(result).toEqual(mockResponse.data);
    });
  });
});
