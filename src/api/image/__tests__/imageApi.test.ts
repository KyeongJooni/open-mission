import { getPresignedUrl, uploadImageToS3, uploadImage } from '../imageApi';
import { axiosInstance } from '../../apiInstance';

jest.mock('../../apiInstance', () => ({
  axiosInstance: {
    get: jest.fn(),
  },
}));

describe('imageApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPresignedUrl', () => {
    it('presigned URL을 가져와야 함', async () => {
      const mockResponse = {
        data: {
          data: 'https://s3.amazonaws.com/bucket/image.png?signature=xxx',
        },
      };
      (axiosInstance.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getPresignedUrl('image.png');

      expect(axiosInstance.get).toHaveBeenCalledWith('/images/presigned-url', {
        params: { fileName: 'image.png' },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('uploadImageToS3', () => {
    it('S3에 이미지를 업로드해야 함', async () => {
      const mockFetch = jest.fn().mockResolvedValue({ ok: true });
      global.fetch = mockFetch;

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      await uploadImageToS3('https://s3.amazonaws.com/presigned-url', file);

      expect(mockFetch).toHaveBeenCalledWith('https://s3.amazonaws.com/presigned-url', {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': 'image/png',
        },
      });
    });

    it('업로드 실패 시 에러를 던져야 함', async () => {
      const mockFetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
      global.fetch = mockFetch;

      const file = new File(['test'], 'test.png', { type: 'image/png' });

      await expect(uploadImageToS3('https://s3.amazonaws.com/presigned-url', file)).rejects.toThrow(
        'S3 upload failed: 500'
      );
    });
  });

  describe('uploadImage', () => {
    it('이미지를 업로드하고 URL을 반환해야 함', async () => {
      const presignedUrl = 'https://s3.amazonaws.com/bucket/image.png?signature=xxx';
      const mockResponse = {
        data: {
          data: presignedUrl,
        },
      };
      (axiosInstance.get as jest.Mock).mockResolvedValue(mockResponse);

      const mockFetch = jest.fn().mockResolvedValue({ ok: true });
      global.fetch = mockFetch;

      const file = new File(['test'], 'image.png', { type: 'image/png' });
      const result = await uploadImage(file);

      expect(result).toEqual({
        imageUrl: 'https://s3.amazonaws.com/bucket/image.png',
      });
    });
  });
});
