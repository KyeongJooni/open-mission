import { createComment, deleteComment } from '../commentApi';
import { axiosInstance } from '../../apiInstance';

jest.mock('../../apiInstance', () => ({
  axiosInstance: {
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('commentApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    it('댓글을 생성해야 함', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 1,
            content: '테스트 댓글',
          },
        },
      };
      (axiosInstance.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await createComment('123', '테스트 댓글');

      expect(axiosInstance.post).toHaveBeenCalledWith('/comments/123', {
        content: '테스트 댓글',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteComment', () => {
    it('댓글을 삭제해야 함', async () => {
      const mockResponse = {
        data: {
          data: null,
        },
      };
      (axiosInstance.delete as jest.Mock).mockResolvedValue(mockResponse);

      const result = await deleteComment(1);

      expect(axiosInstance.delete).toHaveBeenCalledWith('/comments/1');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
